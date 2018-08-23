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
    oninput="handleRangeInput(this)" />

```
<input type="range"
    step="1"
    min="0"
    max="100"
    value="25"
    oninput="handleRangeInput(this)" />
```

<script src="/js/src/handleRangeInput.js"></script>
```
var savedValue = 25;

function handleRangeInput(input) {
    var step = new Number(input.step);
    var newVal = new Number(input.value);
    var oldVal = savedValue;
    if (oldVal) {
        input.value = (newVal > oldVal) ?
            oldVal + step : oldVal - step;
    }

    savedValue = new Number(input.value);
}
```

Notice that clicking right and left of the knob always steps the value
by the same increment now. Dragging the knob doesn't behave perfectly,
but it's usable. It might be possible to improve the dragging behavior
with more code.

This method was pointed out by zcorpan on StackOverflow:
https://stackoverflow.com/a/51988783/173630, I've just adapted it for
my use case.

If you're using React, this global savedValue variable can be handled
by state/props, and connected to the input's value. See the
RangeStepInput React component here for the details:
https://github.com/ccnmtl/astro-interactives/pull/57/files
