//Returns Comp Name in Sentence Case

var thisComp = {
  name: "CTA_proceedToBilling"
};

var bannedWords = ["To", "And"];

var compName = thisComp.name.split("_");
var val = compName[compName.length - 1];

//To camel case
var result = val.charAt(0).toUpperCase() + val.replace(/([A-Z])/g, " $1").slice(1);

console.log(result);
