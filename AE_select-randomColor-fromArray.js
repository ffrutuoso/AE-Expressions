// Selects one random color from effects group
// apply on any Color property

// Run only on first frame
posterizeTime(0);

// Layer selector
var controlLayer = effect("Layer Control")("Layer");

// Number of effects
var effectNumber = controlLayer("Effects").numProperties;

// Generate random number
var randomNumber = Math.ceil(random() * effectNumber);

// Get color value
var selectedColor = controlLayer.effect(randomNumber).color.value;

selectedColor;
