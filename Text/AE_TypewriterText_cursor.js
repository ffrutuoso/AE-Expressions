// Sets position of a cursor rectangle that follows animated text
// Apply on Position

var x = value[0];  // Get current position, allows it to be repositioned after
var y = value[1];

var targetLayer = effect("Layer Control")("Layer");  // Get text layer

var rect = targetLayer.sourceRectAtTime(time - targetLayer.inPoint).width;  // Get width of text area

// If text area is less than 1px wide, move 1px right
if (rect < 1) {
  offset = 0;
} else {
  offset = 1;
}

var roundRect = Math.round(rect) + offset;  // Rounds to the nearest pixel

// Return value
[x + roundRect, y]
