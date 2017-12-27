//apply on SourceText

//adding keyframe controls
var On = effect("Checkbox Control")("Checkbox"); //On/Off cursor
var anim = thisLayer("Effects")("Slider Control")("Slider"); //animator from 0% to 100%
var spd = effect("Slider Control")("Slider").speed; //detect animator is in progress

var cursor = "|"; //character for the cursor
var sign = ""; //define sign to add after text

var textLength = text.sourceText.length; //check number of characters
var startTime = time - thisLayer.inPoint; //
var blink = Math.round(startTime % 1);

var val = linear(anim, 0, 100, 0, textLength); //map to 0-100 range

if (spd != 0 && On == 1) {
  sign = cursor;
} else {
  if (blink == 0 && On == 1) {
    sign = cursor;
  } else {
    sign = "";
  }
}

//return value
substr(0,val) + sign
