// Writes text as if typed from a keyboard
// Apply on SourceText

// Adding keyframe controls
var anim = effect("Slider Control")("Slider");  // Animator from 0% to 100%
var textLength = text.sourceText.length;  // Check number of characters

var val = linear(anim, 0, 100, 0, textLength);  //Map to 0-100 range

// Return value
substr(0, val)
