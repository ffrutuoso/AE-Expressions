// WIP

var scrollPos = effect("Layer Control")("Layer").position;
var x = value[0];
var y = scrollPos[1] / 2;
var threshold = 91;
var spd = scrollPos.velocity[1];

var refMin = -1262;
var refMax = refMin + 182 * 4;

if (time > framesToTime(1440)) {
  refMin = -792;
}

if (y <= -threshold || spd > 0) {
  if (spd <= 0) {
    y = -threshold;
  } else {
    y = linear(scrollPos[1], refMin, refMax, -threshold, 0);
  }
}

[x, y]
