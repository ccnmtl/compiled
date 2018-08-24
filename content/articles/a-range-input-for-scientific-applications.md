---
title: "A Range Input for Scientific Applications"
date: 2018-08-23T12:28:28-04:00
type: "post"
author_name: "Nik Nyby"
author_url: "https://ctl.columbia.edu/about/team/nyby/"
lede: "This post describes how to change the behavior of an <input type=range>
to something that may be more appropriate for certain scientific applications."
topics: 
- Research and Development
tags: ["html", "javascript"]
---

Here's a range input. Notice how it jumps immediately to the position you click.

<input type="range"
    step="1"
    min="0"
    max="100"
    value="25" />

```
<input type="range"
    step="1"
    min="0"
    max="100"
    value="25" />
```

What if you want to fine-tune the value by incrementing and
decrementing it by a predictable step? You can do this fine-tuning by
focusing the input and using the arrow keys to adjust the value up and
down.

You can make the click event behave in the same way by filtering the
input's oninput event, like this:

<input type="range"
    step="1"
    min="0"
    max="100"
    value="25"
    onmousedown="onMouseDown()"
    onmouseup="onMouseUp()"
    onmousemove="onMouseMove()"
    oninput="onInput(this)" />

```
<input type="range"
    step="1"
    min="0"
    max="100"
    value="25"
    onmousedown="onMouseDown()"
    onmouseup="onMouseUp()"
    onmousemove="onMouseMove()"    
    oninput="onInput(this)" />
```

<script src="/js/src/handleRangeInput.js"></script>
```
var savedValue = 25;
var isMouseDown = false;
var isDragging = false;

function onMouseDown() {
    isMouseDown = true;
}
function onMouseUp() {
    isMouseDown = false;
    isDragging = false;
}
function onMouseMove() {
    if (isMouseDown) {
        isDragging = true;
    }
}

function onInput(input) {
    var step = new Number(input.step);
    var newVal = new Number(input.value);
    var oldVal = savedValue;
    if (
        // Disable the oninput filter with the user is dragging
        // the slider's knob.
        !(isMouseDown && isDragging) &&
            oldVal
    ) {
        input.value = (newVal > oldVal) ?
            oldVal + step : oldVal - step;
    }

    savedValue = new Number(input.value);
}
```

This method was pointed out by zcorpan on StackOverflow:
[stackoverflow.com/a/51988783/173630](https://stackoverflow.com/a/51988783/173630), I've just adapted it for
my use case.

If you're using React, the global variables can be handled by state
and props. See the RangeStepInput React component here for the
details:
[small-angle-demo/src/RangeStepInput.jsx](https://github.com/ccnmtl/astro-interactives/blob/master/small-angle-demo/src/RangeStepInput.jsx)
