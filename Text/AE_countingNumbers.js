// counts numbers using an animator from 0% - 100%
//add to sourceText

numDecimals = 0;
commas = false;
sign = 0;
symbol ="%";
before = 1;
s = effect("Slider Control")("Slider").value.toFixed(numDecimals);


prefix = "";
sufix ="";

if (s[0] == "-"){
  prefix = "-";
  s = s.substr(1);
}

if (before == 1 && sign) prefix += symbol;

if (before == 0 && sign) sufix += symbol;

if (commas){
  decimals = "";
  if (numDecimals > 0){
    decimals = s.substr(-(numDecimals + 1));
    s = s.substr(0,s.length - (numDecimals + 1));
  }
  outStr = s.substr(-s.length, (s.length-1)%3 +1);
  for (i = Math.floor((s.length-1)/3); i > 0; i--){
    outStr += "," + s.substr(-i*3,3);
  }
  prefix + outStr + decimals + sufix;
}else{

prefix + s + sufix;

}
