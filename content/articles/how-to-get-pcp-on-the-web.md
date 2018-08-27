---
author_name: "Anders Pearson"
author_url: "https://thraxil.org/"
date: "2011-05-13"
topics: 
- Projects
tags: ["pcp", "python", "video"]
title: "How to Get PCP on the Web"
type: "post"
---

<p>For years, I&#8217;ve watched our video team do amazing work shooting,
editing, and encoding video for the web. I think most production
companies would be shocked at how much high quality work our team
produces with so few staff, a tight budget, and tighter time
constraints. </p>

<!--more-->

<p>When I look closely at how they do what they do, I&#8217;m impressed and
just a little frightened at how many manual steps are involved in
getting a video online. Manual steps that take time, attention to
detail, expertise, and are ripe for mistakes. </p>

<p>I try to automate everything I touch. I can&#8217;t help it. It&#8217;s the curse
of being a programmer. </p>

<p>I&#8217;ve looked at our video process a few times over the years, always
thinking about how we might eliminate some of those manual
steps. Aside from my instinctive cringing at anything that looks
repetitive to me, the work we&#8217;re doing in online learning (and the web
in general) is integrating more and more student created or supplied
video. The options for that have not been the best. If there were no
issues of copyright or privacy, we could just tell students to upload
their videos to youtube and be done with it. Unfortunately, that&#8217;s
usually not possible, so we end up with students having to bring their
videos to us, on flash drives or SD cards or floppy disks or
punchcards or whatever they have and our video team collects them,
grabs the files and processes and uploads them for them. This is a big
drain on our resources and takes their time away from the shooting and
editing work that actually makes better use of their skills and
talents. It&#8217;s also inconvenient for students to have to come to Butler
Library during business hours to drop off their files, pick up their
drives later, and so on. If they have to upload a video for a class
assignment, they&#8217;d be much happier if they could just upload it
directly themselves at 2am the night before the assignment is due
(because we all know that that&#8217;s how it works). Finally, if every
student supplied video has to come through our video team, it puts a
severe limit on how many video related assignments can realistically
happen at once and how large of a class can run them. </p>

<p>When I&#8217;ve looked at this stuff in the past, I&#8217;ve usually run into a
wall pretty early on. This video encoding stuff is hard. All the
possible input formats, codecs, bitrates, and aspect ratios are a
royal pain. The tools that our video team uses to deal with those are
generally OS X desktop apps that expect a user to point and click and
aren&#8217;t that concerned with exposing an API to script. Then the
delivery options as far as streaming servers, authentication schemes
and podcasting tools, each with their own picky, proprietary
interfaces just multiply the complexity.</p>

<p>If all that weren&#8217;t enough, integrating anything involving video with
our web application world has a big, fat elephant of a problem: video
is big. The files are orders of magnitude bigger than the images or
text or rows of data in databases that we&#8217;re used to dealing with in
our web apps. The web servers we run don&#8217;t have much disk space
available on them (drives for those servers are much more expensive
than consumer hard drives) and would fill up immediately if we put
videos on them. Encoding jobs on long, high quality videos can take
hours. Building web applications, I&#8217;m used to worrying about whether a
request is taking too many milliseconds to complete. If an application
takes more than a second or two to respond, users complain. </p>

<p>The desire to get our video work more tightly integrated with our web
applications and smoothly support user supplied video content doesn&#8217;t
go away though. Some technologies and architectural patterns that have
come out and that I hope to write about here in the future have
offered solutions for the size related problems and we recently
realized that enough of those impediments have eroded that it was
worth investing some effort into the problem again. </p>

<p>In the last few years, improvements have also been made in our video
process thanks to a lot of work building on Apple&#8217;s Podcast Producer
software and it&#8217;s ability to manage custom workflows. Podcast Producer
(or &#8220;PCP&#8221; as we like to abbreviate it) integrates with most of the
other video tools we use and has allowed us to largely automate the
encode and upload process in many cases and can manage distributing
the workload across a grid of desktop and lab machines. </p>

<p>PCP, being from Apple, is very OS X desktop specific though, which
doesn&#8217;t lend itself well to integrating with our web applications
running on Linux servers. Getting videos into PCP typically requires
running OS X, installing an application, and running it. There is a
web interface, Kino, but it&#8217;s pretty locked down, unintuitive, and
won&#8217;t even load in a lot of browsers.</p>

<p>However, to me, that web interface, limited as it is, was the crack in
the armor of the video problem that I&#8217;d been waiting for. </p>

<p>However we were going to go about working video upload support into
our web applications, we knew we weren&#8217;t going to abandon all the work
that had been done with PCP. The workflows that had been developed for
it handled our encoding needs and were robust and debugged. What I
needed was just a way to get our web applications to be able to
communicate with PCP.</p>

<p>So I got out my dissecting tools and started figuring out how to talk
to Kino from Python. </p>

<p>The result is a little library called
<a href="https://github.com/ccnmtl/angeldust/">Angeldust</a> which we have
released in case anyone else needs to do something similar.</p>

<p>The <a href="https://github.com/ccnmtl/angeldust/blob/master/angeldust/__init__.py">code is relatively
short</a>
but it took quite a while to get there. Kino clearly was not intended
to be used in this way and fought me every step of the way. </p>

<p>It was undocumented and used some odd HTTP headers for SSL stuff (I
don&#8217;t remember the exact details now, but it was why it wouldn&#8217;t even
load in most non-Apple browsers). It used a weird combination of HTTP
Basic Auth as well as cookie based login sessions. The interface for
the site was built, not as plain HTML, but as an almost completely
client-side JavaScript application (similar to GMail) constructed from
obfuscated and minified JavaScript. This made it a pain to figure out
what form parameters were being used and when they were being passed
back and forth to the backend. </p>

<p>When submitting a video to be processed by a workflow, Kino broke it
into two steps. First, you would select the workflow, then you would
upload the video with its title and description. It does it in two
separate requests to the backend with the state stored in the
session. This was easy enough to figure out and deal with, but this
kind of stateful interface is annoying and fragile since the
underlying HTTP is stateless. An application trying to interface with
Kino has to make two separate requests to accomplish one action: first
set the workflow, then submit the video. This opens it up to race
condition bugs in a concurrent environment if one isn&#8217;t very careful. </p>

<p>The Kino interface has a few more administrative features, but the only
functions we really needed were to get a list of the PCP workflows
that are available, listed by their title and UUID, and to submit a
video to one of those workflows. This is the functionality that
angeldust exposes. </p>

<p>Using it is fairly straightforward:</p>

<pre><code>from angeldust import PCP
pcp = PCP("https://mykinoserver/url/","username","password")
for workflow in pcp.workflows():
    print "workflow '%s' has UUID %s" % (wf['title'],wf['uuid'])
pcp.upload_file(open("some_video.avi","rb"),"some_video.avi","uuid-of-workflow","title","description")
</code></pre>

<p>angeldust handles everything else for you. It&#8217;s careful to stream the
video upload in chunks instead of trying to read the entire file into
memory first. </p>

<p>Unfortunately, there are still things that angeldust can&#8217;t really do
and won&#8217;t be able to without some changes to Kino. </p>

<p>First, filename, title, and description are the only metadata fields
available. PCP has the ability to deal with more metadata, but Kino
actively ignores anything except those couple fields. Actually, we&#8217;ve
found that Kino also loses the original filename as soon as the video
is uploaded, before it makes it into the PCP workflows. Aside from
preventing us from exploring some more interesting automatic
publishing use-cases, It makes it hard to even track an uploaded video
through it&#8217;s whole lifecycle. Filenames and titles aren&#8217;t typically
enough to uniquely identify a video, so we end up having to insert
unique ids into those fields in ad-hoc and brittle ways. </p>

<p>Angeldust is the first, key piece in getting PCP to integrate with web
applications for student supplied video and we hope that others will
find it as useful as we do. </p>
