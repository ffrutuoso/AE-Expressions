// apply on opacity

var targetLayer = effect("Layer Control")("Layer");
var On = effect("Checkbox Control")("Checkbox");
var spd = L.effect("Slider Control").slider.velocity;
var startTime = time - thisLayer.inPoint;
var pulse = Math.round(startTime % 1);
var opacityVal = 100;

if (spd != 0 && On == 1) {
  opacityVal = 100;
} else {
  if (pulse == 0 && On == 1) {
    opacityVal = 100;
  } else {
    opacityVal = 0;
  }
}

opacityVal
