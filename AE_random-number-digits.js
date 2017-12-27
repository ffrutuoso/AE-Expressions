var arr = [];
var numDigits = 10;
seedRandom(3, timeless = true);

for (var i = 0; i < numDigits; i++) {
  num = Math.floor(random()*10);
  arr.push(num);
}

arr = arr.join("");
"2" + arr
