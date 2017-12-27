// Blinks opacity of a cursor rectangle, in an input text field
// Apply on opacity

var targetLayer = effect("Layer Control")("Layer");  // Sets target text layer
var spd = targetLayer.effect("Slider Control").slider.velocity;  // Gets text animation speed
var startTime = time - thisLayer.inPoint;  // Calculates layer start time
var pulse = Math.round(startTime % 1);  // Blinks every second
var opacityVal = 100;  // Initiate variable

if (spd != 0) {
  // If text is writing, always stay on
  opacityVal = 100;
} else {
  // If it stopped writing, blink every second
  if (pulse == 0) {
    opacityVal = 100;
  } else {
    opacityVal = 0;
  }
}

// Return the value
opacityVal
