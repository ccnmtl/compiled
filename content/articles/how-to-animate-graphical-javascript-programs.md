---
title: "How to animate graphical JavaScript programs"
date: "2018-07-27"
type: "post"
author_name:  "Nik Nyby"
author_url: "https://ctl.columbia.edu/about/team/nyby/"
lede: "You can now do even more in JavaScript than you ever could in Flash. Here's an outline on how to take advantage of some of this technology."
poster: "poster-javascript-animation.gif"
socmediaimg: "socmedia-javascript-animation.jpg"
poster_sourceurl: ""
poster_source: ""
topics: 
- Research and Development
---

You can now do even more in JavaScript than you ever could in
Flash. Google and the [V8 team](https://en.wikipedia.org/wiki/Chrome_V8)
developed new technology that pressured all mainstream browsers to make JavaScript
as efficient as it can be. The performance improvements, which are about
100 times the speed of old JavaScript engines from pre-2008, have led to
the development of new rendering standards such as
[WebGL](https://www.khronos.org/webgl/) and [Canvas](https://www.w3.org/TR/2dcontext/).
It’s now even typical for example, graphics [demos](https://en.wikipedia.org/wiki/Demoscene)
on [Pouet](http://www.pouet.net/) to be made in three.js alongside all the
contributions for c64 and Amiga that have been made for years. These events
helped prompt my own decision to just focus on web development rather than
get further into iOS development, when I was trying that out in 2012.

So, this technology is just waiting to be used, but how do you
actually put things together in a simple, organized way? Starting from
scratch (because when I start anywhere else I don’t learn as much),
you can set up a run loop to animate programs using
[setInterval()](https://developer.mozilla.org/en-US/docs/Web/API/WindowOrWorkerGlobalScope/setInterval):

```
setInterval(function() {
    moveSomethingOnTheScreen();
}, 200);
```

Maybe you want your `moveSomethingOnTheScreen` method to be a function of some
“time” value that’s incremented regularly. That way, you can control
the speed of the motion, and everything you want to animate will use
this single time value to determine where they should appear:

```
var time = 0;

setInterval(function() {
    moveSomethingOnTheScreen(time);

    time += 0.01;
}, 200);
```

The 200 I’m passing in to `setInterval` means “run this every 200
milliseconds”. It’s kind of arbitrary... you can increase or decrease
it to whatever you want and see what happens. You can also let the
browser decide what this value should be with
[requestAnimationFrame()](https://developer.mozilla.org/en-US/docs/Web/API/window/requestAnimationFrame).

```
var time = 0;

function moveSomethingOnTheScreen() {
    // move a DOM element or something

    time += 0.01;

    requestAnimationFrame(moveSomethingOnTheScreen);
};

requestAnimationFrame(moveSomethingOnTheScreen);
```

If you want to stop the animation, setInterval and
requestAnimationFrame both return an ID that you can call
`clearInterval()` or `cancelAnimationFrame()` on. Even when you’re using
comprehensive drawing frameworks such as [three.js](https://threejs.org/) or
[Pixi.js](http://www.pixijs.com/), handling
the animation step with `requestAnimationFrame()` is still the norm.

That’s all you need for animation—but what do you want to animate?
You can hook this run loop up to any visualization that JavaScript can
reach: graphs, math visualizations, 3D scenes, etc. Libraries like
these don’t render HTML dom elements—that’s too limiting for
graphics. Most of them render with Canvas or SVG.

The HTML `<canvas>` element is fun to mess around with, and there’s a
lot you can do with just that. In fact, WebGL all happens through the
Canvas element, so whatever you want to do, you should learn the
basics of Canvas. Mozilla’s [Canvas tutorial](https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API/Tutorial) and [API docs](https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API) are
helpful. When using Canvas, keep in mind that the browser only thinks
of it as some arbitrary bitmap—a series of colored pixels: any
shapes you draw sort of slip out of your fingers and into the
bitmap. You can’t do `var circle = canvasContext.arc();` and then move
that circle around because `arc()`, along with all the drawing methods,
are void type and don’t return anything. This constraint is fun to
work around because anything is still possible with Canvas. But if you
need to treat parts of your graphics as objects because they’re
interactive, like responding to mouse movement, that’s where it
quickly gets too complicated because there’s too much to keep track
of, including UX subtleties that you shouldn’t be expected to
handle. In that case, I recommend using a Canvas-based framework like
Pixi.js.

I’ve been working on porting these [astronomy visualizations](http://astro.unl.edu/animationsLinks.html)
originally developed at the University of Nebraska from Flash
to JavaScript ([astro-interactives](https://github.com/ccnmtl/astro-interactives)).
All this new web technology is
well-suited for these kinds of things. I’m using [React](https://reactjs.org/)
because from what I’ve seen, the code just becomes simpler and more reliable when
you’re not manually manipulating DOM elements. React is a large
library though—you can get a similar development experience by
combining [S.js](https://github.com/adamhaile/S) with JSX.

So to show how you can actually use the animation example above,
here’s the animate function that runs in a loop to animate a three.js
scene. You can see how the sky color is dynamic: `getSkyColor()`
returns a blue color when the sun is above the horizon, and black when
it’s beneath it.

```
animate() {
    this.sun.position.x = 50 * Math.cos(this.props.observerAngle);
    this.sun.position.z = 50 * Math.sin(this.props.observerAngle);
    this.sun.rotation.y = -this.props.observerAngle +
                          THREE.Math.degToRad(90);

    this.skyMaterial.color.setHex(this.getSkyColor(this.props.observerAngle));

    this.moon.position.x = 50 * Math.cos(this.props.moonObserverPos);
    this.moon.position.z = 50 * Math.sin(this.props.moonObserverPos);
    this.moon.rotation.y = -this.props.moonObserverPos + THREE.Math.degToRad(90);

    this.renderScene();
    this.frameId = requestAnimationFrame(this.animate);
}
```
<small>From [lunar-phase-simulator/HorizonView.jsx](https://github.com/ccnmtl/astro-interactives/blob/master/lunar-phase-simulator/src/HorizonView.jsx)</small>

The sun and moon move in a circular orbit created by passing in radian
values to sine and cosine functions. I don’t know the math offhand—I
just work through trial and error. The observerAngle and
moonObserverPos values are being passed in from the main React
component in main.jsx, and are controlled and incremented from there,
in their own animate loop:

```
animate() {
    const me = this;
    this.setState(prevState => ({
        observerAngle: me.incrementAngle(prevState.observerAngle),
        moonPhase: me.incrementMoonPhaseAngle(prevState.moonPhase),
        moonObserverPos: me.getMoonObserverPos(
            prevState.observerAngle, prevState.moonPhase)
    }));
    this.frameId = requestAnimationFrame(this.animate);
}
```
<small>From [lunar-phase-simulator/main.jsx](https://github.com/ccnmtl/astro-interactives/blob/master/lunar-phase-simulator/src/main.jsx)</small>

So, through methodical organization and trial and error, you can build
these pieces up to make any sort of visualization as a function of a few
pieces of core data, tied together in sync.

Here's my
[Lunar Phase Simulator](https://ccnmtl.github.io/astro-interactives/lunar-phase-simulator/)
that's still in progress. The animation basics are in place—at the moment I
need to fix some problems with the mouse
interactions.

{{< figure caption="Lunar Phase Simulator still in progress" src="/img/assets/lunar-phase-simulator.png" class="text-center centered bordered responsive" alt="Lunar phase simulator screeshot" >}}
