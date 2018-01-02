// Blinks opacity of a cursor rectangle, in an input text field
// Apply on opacity

var targetLayer = effect("Layer Control")("Layer"); // Sets target text layer
var spd = targetLayer.effect("Slider Control").slider.velocity; // Gets text animation speed
var inTime = time - thisLayer.startTime; // Calculates layer start time
var pulse = Math.round(inTime % 1); // Blinks every second

if (pulse == 0 ) value else if (spd !=0) value else 0
