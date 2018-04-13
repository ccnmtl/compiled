---
author_name: "Nik Nyby"
author_url: https://ctl.columbia.edu/about/team/nyby/
date: 2017-03-24
lede: "This post sketches out a process for developing activities in an ePub-style environment."
poster: poster-sequenced-activities-javascript.jpg
poster_source: ""
poster_sourceurl: ""
tags: ["javascript", "epub", "working notes"]
title: Sequenced Activities in JavaScript
topics:
- Research and Development
type: post
---

We've been designing a new version of [Women on the Road to
Health](https://github.com/ccnmtl/worth3) with the goal of breaking it
out of its web application mold to make it more easily
distributable. We're thinking something with a little more interactive
functionality than a PDF, so possibly an
[ePub](https://en.wikipedia.org/wiki/EPUB) or an offline, standalone
HTML5 application. The device we're primarily targeting is some type
of Android tablet, but with the durability and sustainability that our
chosen formats provide, we'd like to make it as widely compatible
across different systems as possible.

Our intervention consists of a series of videos with some text and
interactive activities interspersed throughout. Because it's so
video-centric, we've been wondering whether an ePub makes sense for
this experience. One advantage of using ePub is that the navigation
controls are provided automatically by the ePub reader, which
we'd otherwise need to design ourselves in an HTML5 application.

We're envisioning each interactive in this experience as sort of an
independent world of its own, but still with a consistent look and
feel. Here's an example of a simple system I've put together for
handling that. My style of developing here is to sketch things out in
a simple way and let it gradually evolve to the appropriate level of
complexity or sophistication.

```
<!-- In the ePub, each page is its own HTML file, 
     with a single activity's container.
     In the HTML5 app, the container is surrounded
     by a 'slide' element.
   -->
<div class="container myth-fact">
    <div class="panel s0">
        <h1>Myth/Fact</h1>
        <p>Let's play the Myth/Fact Quiz game!</p>
        <button type="button" class="s1">
            Got it. Let's go!
        </button>
    </div>
    
    <div class="panel hidden s1">
        <h1>True of False?</h1>
        <p>The sky is always blue?</p>
        <button type="button" class="s2-true">True</button>
        <button type="button" class="s2-false">False</button>
    </div>
    
    ...
    
</div>
```

Each activity has a progress bar that needs to be updated, so we can
define this functionality for all activities in `common.js`:

```
// common.js

var updateProgressBar = function($container, percentage) {
    var $bar = $container.find('.progress-bar');
    $bar.css('width', percentage + '%');
    $bar.attr('aria-valuenow', percentage);
};
```

Below is some of the code for the Myth/Fact activity. The container is
a key piece of data that I'm using to isolate these operations from
everything else that could be going on in the page. Again, I might
have to change this as we start putting multiple activities of the
same type in the application, but this is good enough for our simple
prototype.

```
// myth-fact.js

(function() {
    var resetActivity = function($container) {
        updateProgressBar($container, 0);
        $container.find('div.s0').removeClass('hidden');
        $container.find('button.s2-true,button.s2-false')
            .removeClass('disabled');
        $container.find('button.s2-true,button.s2-false')
            .removeAttr('disabled');
        $container.find('.alert.wrong-answer,.alert.right-answer')
            .addClass('hidden');
        $container.find('.alert.answer').addClass('hidden');
    };

    $(document).ready(function() {
        var $container = $('.container.myth-fact');

        $container.find('button.s1').click(function(e) {
            e.preventDefault();
            $(this).closest('div.panel').addClass('hidden');
            $container.find('div.s1').removeClass('hidden');
            updateProgressBar($container, 20);
        });

        ...
    });
})();
```

The code illustrates the concept of each activity consisting of a
series of panels, with only one panel visible at a given time. I'm
doing this with JavaScript and jQuery, and it's stable enough. I'm
betting that our activities are going to be simple enough that we can
continue in this fashion, but I'm also keeping in mind that this is a
job that would be handled really well by a UI tool
like [React](https://facebook.github.io/react/). I don't think it's
worth it at this point, since using React adds a noticable amount of
overhead through maintenance and deployment strategies.

And here's the code for another activity. I've started to work out the
concept of each activity resetting itself in its own way:

```
// feeling.js

(function() {
    var resetActivity = function($container) {
        updateProgressBar($container, 0);
        $container.find('div.s0').removeClass('hidden');
    };

    $(document).ready(function() {
        var $container = $('.container.feeling');

        $container.find('figure').click(function(e) {
            e.preventDefault();
            $(this).closest('div.panel').addClass('hidden');
            $container.find('div.s1').removeClass('hidden');
            updateProgressBar($container, 100);
        });

        $container.find('button.s0').click(function(e) {
            e.preventDefault();
            $(this).closest('div.panel').addClass('hidden');
            resetActivity($container);
        });
    });
})();
```
