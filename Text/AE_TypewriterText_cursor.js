//apply on Position

var x = value[0];
var y = value[1];
var L = effect("Layer Control")("Layer");
var source = L.text.sourceText;

var rect = L.sourceRectAtTime(time-L.inPoint).width;

if (rect < 1) offset = 0 else offset = 1;

var roundRect = Math.round(rect) + offset;

[x + roundRect, y]
