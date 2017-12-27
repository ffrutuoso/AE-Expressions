// WIP

var scrollPos = effect("Layer Control")("Layer").position[1];
var x = value[0];
var y = scrollPos - 320 + 24;

if (y <= -94 + 24) {
  y = -94 + 24;
}

[x, y]
