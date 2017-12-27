// Writes text as if it's typed from a keyboard
// Apply on SourceText

//adding keyframe controls
var anim = effect(("Slider Control")("Slider"); //animator from 0% to 100%
var textLength = text.sourceText.length; //check number of characters

var val = linear(anim, 0, 100, 0, textLength); //map to 0-100 range

//return value
substr(0, val)
