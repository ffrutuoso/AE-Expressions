// Counts numbers using an animator from 0% - 100%
// Add to sourceText

numDecimals = 0;
commas = false;
sign = 0;
symbol = "%";
before = 1;
s = effect("Slider Control")("Slider").value.toFixed(numDecimals);

prefix = "";
sufix = "";

if (s[0] == "-") {
  prefix = "-";
  s = s.substr(1);
}

if (before == 1 && sign)
  prefix += symbol;

if (before == 0 && sign)
  sufix += symbol;

if (commas) {
  decimals = "";
  if (numDecimals > 0) {
    decimals = s.substr(-(numDecimals + 1));
    s = s.substr(0, s.length - (numDecimals + 1));
  }
  outStr = s.substr(-s.length, (s.length - 1) % 3 + 1);
  for (i = Math.floor((s.length - 1) / 3); i > 0; i--) {
    outStr += "," + s.substr(-i * 3, 3);
  }
  prefix + outStr + decimals + sufix;
} else {

  prefix + s + sufix;

}

// -------------------------------

var numDecimals = 2;
var separators = true;
var counter = effect("Slider Control")("Slider").value.toFixed(numDecimals);
var separatorChar = ".";
var textLength = 8;

if (separators) {

  var decimals = "";
  if (numDecimals > 0) {
    decimals = counter.substr(-(numDecimals + 1)); // Get decimal characters
    decimals = decimals.replace(".", ","); // Replace decimal dot
    counter = counter.substr(0, counter.length - (numDecimals + 1)); // Isolate numbers without decimals
  }

  while (counter.length < textLength) {
    counter = "0".concat(counter);
  }

  var outStr = counter.substr(-counter.length, (counter.length - 1) % 3 + 1);

  for (var i = Math.floor((counter.length - 1) / 3); i > 0; i--) {
    outStr += separatorChar + counter.substr(-i * 3, 3); //insert separator each 3 numbers
  }

  outStr + decimals;

} else {

  outStr;

}


// -------------------------------


var num = text.sourceText.length;

for (var i = 0; i < text.sourceText.length; i++) {
  var searchChar = text.sourceText[i];
  if (searchChar != "0" && searchChar != "." && searchChar != "," ) {
    num = i;
    break;
  }
}

num
