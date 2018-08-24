/* eslint no-unused-vars: 0 */

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
