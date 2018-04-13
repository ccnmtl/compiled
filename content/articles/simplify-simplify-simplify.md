---
author_name: "Susan Dreher"
author_url: "https://ctl.columbia.edu/about/team/dreher/"
date: "2010-08-21"
topics: 
- Process
tags: []
title: "Simplify, Simplify, Simplify"
type: "post"
---

<p>I see programmers as inherently helpful people. Given a  57-step flowchart describing the steps some poor soul has to execute manually, most programmers get a little gleam in their eye and set about providing a streamlined solution. Programmers truly love removing those inefficiencies. Meanwhile, the customer stops wrestling with a frustrating system and gets on with his job.</p>

<!--more-->

<p>I recently had the opportunity to untangle a complicated little process knot. The technical details are applicable solely to the Columbia community, but I think the story is a reminder that a core engineering duty is to tackle real world inefficiencies.</p>

<p><u><b>The Story</b></u><br /><a href="http://ccnmtl.columbia.edu/staff/ferrigno/">Briana</a>, our Communication and Marketing Manager, is responsible for posting events on our <a href="http://ccnmtl.columbia.edu/events"><span class="caps">CCNMTL </span>website</a> and getting those events into the Columbia <a href="http://calendar.columbia.edu/">calendar</a>. To post the events to the Columbia calendar, she used the university's Sundial event management software. To post events to the <span class="caps">CCNMTL </span>website, she used our site content management software and recreated the events, adding links to the Sundial registration system. </p>

<p>Now, Briana has enough to do without managing events in two quite disparate systems. <a href="http://ccnmtl.columbia.edu/staff/matiz/">Maurice</a> suggested I leverage the Sundial api to pull events into our <span class="caps">CCNMTL </span>site. Briana could create events in a single location and eliminate the redundant efforts.</p>

<p><u><b>The Base Technologies</b></u><br /><a href="http://sundialhelp.columbia.edu/">Sundial</a> is a powerful system, handling basic event creation and display plus advanced registration flow including payment, waitlists, cancellations and public and university-only enrollment. Event display can be customized through an online templating interface. As mentioned, Sundial offers a well-developed api to enable custom event retrieval. </p>

<p>Our <span class="caps">CCNMTL </span>site relies on <a href="http://www.movabletype.org/">MovableType</a> to manage content. </p>

<p><u><b>The Architecture</b></u><br />My main goal was to (obviously) streamline event creation, while still giving Briana a great deal of control over the look/feel of the site. </p>

<p>As Movable Type is purely a publishing system, the best approach was to use Ajax to retrieve a list of events given date and event type parameters. The Sundial api would return formatted html based on the branded templates. Briana could edit the templates directly to tweak event display. </p>

<p>Using Ajax meant I was faced with a cross-domain scripting problem. Ajax allows requests only to the page's domain, e.g. foo.com can make calls to foo.com but not to sundialapi.com. Luckily, <a href="http://bob.pythonmac.org/archives/2005/12/05/remote-json-jsonp/"><span class="caps">JSONP</span></a> now provides a workaround. <a href="http://jquery.com/">jQuery</a> integrates this solution into its <a href="http://docs.jquery.com/Release:jQuery_1.2/Ajax#Cross-Domain_getJSON_.28using_JSONP.29">getJSON</a> call. Sundial does not offer a <span class="caps">JSON </span>return format, so I also needed a simple.php script to provide a <span class="caps">JSON </span>wrapper for the Sundial server response.</p>

<p>Here's all the pieces:<br /><b>eventList.html, eventDetail.html</b> - onload() call the Ajax event retrieval interface and slot resulting html into the appropriate div.</p>

<p><b>sundial.js</b> - Ajax script to retrieve events from events.php based on page parameters.</p>

<pre><code>
function loadEvents() {
   var url = "<events.php url>jsoncallback=?';
   var allParams = getUrlVars();

   var queryParams = {};
   queryParams['start'] = allParams['start'];
   queryParams['end'] = allParams['end'];
   queryParams['type'] = allParams['type'];
   queryParams['viewType'] = 'list';
   queryParams['keyword'] = allParams['keyword'];
   queryParams['eventFilter'] = allParams['eventFilter'];

   $.getJSON(url, queryParams,
             function(data, textStatus) {
                if (data.events) {
                   $("#eventList").html(unescape(data.events));
                } else
                   $("#eventList").html("There are presently 
                       no events to display. Please check again soon.</p>");
                
                var title = allParams['title'] ? unescape(allParams['title']) 
                      : "Upcoming Events";
                $("#eventListTitle").html(title);
                
                });
}
</pre></code>

<p><b>events.php</b> - shim .php script to retrieve events from the Sundial server and return a <span class="caps">JSON </span>response to MovableType. My code is almost a duplicate of the sample.php code provided by Sundial. </p>


<pre>
<?

// Sundial's HTTP Event Retrieval Interface URI
$url = "https://<sundial event interface>";

$criteria = array("dateStart"   => $_GET['start'],
                  "dateEnd" => $_GET['end'],
                  "maxEvents" => "30",
                  "viewType"  =>$_GET['viewType'],
                  "sponsor" => "ccnmtl",
                  "typeFilter" => $_GET['type'],
                  "eventFilter" => $_GET['eventFilter'],
                  "brand" => "<ccnmtl brand id>",
                  "keyword" => $_GET['keyword'],
                 );

if (strlen($criteria["dateEnd"]) <= 0) {
   $criteria["dateEnd"] = "R60";
}

foreach ($criteria as $key => $value) {
   $url .= "&" . $key . "=" . urlencode($value);
}

$result = file_get_contents($url);

if (stripos($result, "No Records") > 0) {
   $result = "";
}

$arr = array ('events'=> mb_convert_encoding($result, 'utf-8'));

echo $_GET['jsoncallback'] . '(' . json_encode($arr) . ');';

?>

</pre>




<p><b>Customized Templates</b> - Sundial interface. Requires authorization from the Sundial folks. I overrode the Event Listing and Event Detail to control the event presentation. While I was at it, I overrode the Child Header, Child Footer, No Records, , Registration Status, Registration Form and Registration Cancel pages to add <span class="caps">CCNMTL</span>-specific branding. </p>

<p><u><b>Limitations</b></u><br />I've run into a few limitations with Sundial. A minor pain point has been dynamically categorizing events. Sundial provides an eventType filter with a predefined list of events. We've used eventType to slot our events into high-level categories like "Academic: Conference." Sundial also provides a keyword filter -- a single word, no phrases -- that searches the name, summary and description fields, which is great for a search interface. However, Briana requires something akin to a subEventType, so workshops can be categorized into things like Courseworks or Wikispaces. Ideally, these subEventTypes would be dynamic, so I could create and query them without any help from Sundial. Short-term hack, I'm using the keyword feature as a workaround but I'm worried about picking up events that just happen to have "Courseworks" in their description.</p>

<p>Another minor problem is the event titles. On the Columbia calendar, we want a very descriptive title for some events, e.g. <span class="caps">CCNMTL</span> Faculty and Instructor Workshop. On the <span class="caps">CCNMTL </span>site, we can drop this prefix as the <span class="caps">CCNMTL </span>affilitation and Workshop type is already clear. Maybe additional event attributes such as eventHeader could be added to resolve this issue. </p>

<p><u><b>Finally...</b></u><br />I was casting about for a quote to bring this all full circle, and found a great one from Dijkstra: </p>


<blockquote>
"The lurking suspicion that something could be simplified is the world's richest source of rewarding challenges."
</blockquote>


<p>If you find yourself executing some mind-numbing task over and over and over, give your local programmer a call today.</p>
