---
author_name: "Jonah Bossewitch"
author_url: "http://alchemicalmusings.org/about/"
date: "2009-06-27"
topics: 
- Events
tags: ["conference", "html5", "openvideo"]
title: "Video Goes Native (SFW)"
type: "post"
---

<p>There is a lot of buzz right now around the latest version of Firefox which  finally implemented the native <code>&lt;video&gt;</code> tag specified in <a href="http://en.wikipedia.org/wiki/HTML_5">html5</a> .</p>

<!--more-->

<p>These developments were a hot topic at the <a href="http://openvideoconference.org">Open Video Conference</a>, which was about a whole lot more than just the video tag, but the timing was really perfect. For more about the <span class="caps">OVC, </span>see <a href="http://alchemicalmusings.org/2009/06/24/ov-high/">Jonah</a> and <a href="http://www.clayfox.com/2009/06/22/reflections-on-the-ovc/">Mark Phillipson's</a> reports, as well as the announcement of our <a href="http://openvideoconference.org/2009/06/columbias-educational-video-environment-released-at-ovc/">Open Sourcing of <span class="caps">VITAL</span></a> . </p>

<p>The introduction of the <code>&lt;video&gt;</code> tag is a pretty big deal. Up until now, to display video in a browser, you needed to use third party plugins embedded in object tags. This allowed for the video to be seen in the browser, but the video wasn't really part of the web page - it was trapped inside a box.</p>

<p>Suddenly, all sorts of really amazing things can happen - all the tools and operations that browsers perform on elements of a page can now be applied to video. Video can be dynamically modified using javascript and css, filters and transformations can be applied, canvas and svg can be combined with video, etc etc.  When I saw this in action it made me realize how much I had assumed and taken for granted about the constraints around web video.</p>

<p>But don't take my word for it - check out some of these early demos:</p>


<ul>
<li><a href="http://www.youtube.com/watch?v=3tLBLVtIk3A">Firefox 3.5 Treats Videos Like Web Pages</a></li>
<li><a href="http://standblog.org/blog/post/2009/04/15/Making-video-a-first-class-citizen-of-the-Web">Making video a first class citizen of the Web</a></li>
</ul>


<p><a href="http://people.mozilla.com/~prouget/demos/">These demos</a> (these require installing <a href="http://ccnmtl.columbia.edu/compiled/projects/why_ccnmtl_likes_firefox.html">a browser</a> that supports the new stuff). Some of my favs:</p>


<ul>
<li><a href="http://people.mozilla.com/~prouget/demos/round/index.xhtml">washing machine</a></li>
<li><a href="http://people.mozilla.com/~prouget/demos/mashup/video.xhtml">filter mashup</a></li>
</ul>



<p>There is an incredibly important part of this story that has everything in the world to do with open standards, <a href="http://journal.media-culture.org.au/index.php/mcjournal/article/viewArticle/55">accessibility</a>, and codecs which are unencumbered by patents, but I will save  those angles are for another time.</p>

<p>Meanwhile, even the big corporate players are excited. <a href="http://www.youtube.com/html5">YouTube</a> and <a href="http://www.0xdeadbeef.com/weblog/?p=1312">Daily Motion</a> both have html5 pages up, and Daily Motion is even converting their catalog to the royalty-free format, Ogg Theora (this is also how wikipedia is encoding video).</p>

<p>Don't get too excited yet though. MS still has no official plans to support the video tag in IE (though apple/safari/webkit does - but only with quicktime codecs).</p>

<p>Welcome to the Multimedia Wars of late Oughts. The revolution will definitely be an element of the Dom.</p>
