// Sets position of a cursor rectangle that follows animated text
// Apply on Position

var x = value[0];  // Get current position, allows it to be repositioned after
var y = value[1];

var targetLayer = effect("Layer Control")("Layer");  // Get text layer

var rectW = targetLayer.sourceRectAtTime(time - targetLayer.startTime).width;  // Get width of text area

// If text area is less than 1px wide, move 1px right
if (rectW < 1) {
  offset = 0;
} else {
  offset = 1;
}

var roundRectW = Math.round(rectW) + offset;  // Rounds to the nearest pixel

// Return value
[x + roundRectW, y]
