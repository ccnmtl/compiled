---
author_name: "Susan Dreher"
author_url: "https://ctl.columbia.edu/about/team/dreher/"
date: "2010-02-15"
topics: 
- Process
tags: ["agile", "javascript", "testing"]
title: "Test.AnotherWay: JavaScript Unit Tests Made Easy"
type: "post"
---

<p>One of the primary tenets of <a href="http://en.wikipedia.org/wiki/Agile_software_development">agile development</a> is test first, test often. After working in a small <a href="http://www.extremeprogramming.org/">XP</a> shop doing mobile development, I came to believe strongly that quality code hinges on a test-driven approach. </p>

<!--more-->

<p>Coders, impatient with paper specs and endless product meetings, often rush to their keyboards and push out half-baked, poorly implemented solutions that don't meet anyone's needs. Writing tests -- especially in a test-first approach -- provides time for thoughtful inquiry into an application's overall design and specific functionality. The coder can express herself in her own comfortable environment and language. The resulting tests become permanent artifacts, able to verify functionality as the application is enhanced and refactored. </p>

<p>And, in less altruistic, more self-serving terms: good tests mean good code, and good code makes the coder look good. Why wouldn't you want to write tests?</p>

<p>Still, I was a little apprehensive when asked to setup a test infrastructure for the Mondrian JavaScript components. (<a href="http://ccnmtl.columbia.edu/compiled/projects/composition_with_video_images.html">Mondrian</a> is our snazzy new web-based, multimedia, annotation environment). I've tackled many server-side testing tasks, but have managed to circumvent the swampy land of JavaScript. JavaScript generally does not lend itself to testing. Most JavaScript code I've seen is poorly organized, fragmentary and tightly-bound to the browser. I've often lamented the lack of good JavaScript testing tools, but also was loathe to tackle the seemingly messy, difficult task.</p>

<p>The <a href="http://github.com/ccnmtl/SherdJS">Mondrian JavaScript codebase</a>, luckily, is quite object-oriented and well-organized thanks to Schuyler Duveen, the lead programmer/architect on the project. Sky suggested I take a look at <a href="http://www.openjsan.org/src/a/ar/artemkhodush/Test.AnotherWay-0.51/doc/doc.html">Test.AnotherWay</a>, the JavaScript test tool used by the OpenLayers community as a starting point. Written by Artem Khadoush, Test.AnotherWay turns out to be perfect for the job -- small, simple and easy to setup. Sold! Khadoush's stated goal is an "effortless setup" and he definitely achieves that goal. For a small project, this test infrastructure is surprisingly complete. In addition to the expected assertions, the test runner also handles asynchronous calls and can record and playback mouse events.</p>

<p>The basic setup involves downloading a main test runner (run-tests.html) into your web application and registering your test file (list-tests.html). Constructing a test is straightforward (and familiar). Execute functionality within a function named testX, and then verify results with a variety of assertions. I wrote a <a href="http://github.com/ccnmtl/SherdJS/blob/master/tests/test-example.html">simple test</a> in 5 minutes. I then wrote more complex tests for our video interfaces (<a href="http://www.youtube.com">YouTube</a>, <a href="http://flowplayer.org">FlowPlayer</a> and <a href="http://www.apple.com/quicktime/">Quicktime</a>). Each player is put through its individual paces -- play, start, stop, seek, pauseAt(x seconds), duration, time. The players all have distinct personalities, and require some handholding. Test.AnotherWay helped out immensely by having facilities to run the players in their own iFrames and to "delay" assertions while the player loaded or fast forwarded to a particular time point. Take a look at the <a href="http://github.com/ccnmtl/SherdJS/blob/master/tests/video/test-youtube.html">YouTube test source</a> for a good run through.</p>

<p>Once the tests were in place, I was able to complete some much needed cross-browser testing. I immediately found and resolved bugs in IE 8 and Safari. I just completed some refactoring to make the code more consistent between players. Running the tests after each step made me feel confident I hadn't broken anything. There are still many more tests to write, but the lessons (re)learned are clear: writing tests should always be a priority, even if the implementation looks rocky and difficult. The payoff is incredible. </p>
