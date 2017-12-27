// Adjusts rectangle size to fit inside and tangent to any given circle
// apply to rect size

var offset = position[1] - 60;
var radius = effect("Y")("Slider") / 2;
var Null = thisComp.layer("NULL").position + [0, offset];
var Center = thisComp.layer("Circle Container").position;
var dist = length(Null, Center);
var contRadius = thisComp.layer("Circle Container").content("Ellipse Path 1").size[0] / 2 - radius;

var threshold = 0.8*contRadius;

if (dist > threshold) {
  dist = threshold;
}

var x = 2 * Math.sqrt(Math.pow(contRadius, 2) - Math.pow(dist, 2)) + radius * 2;

x

[x, value[1]]
