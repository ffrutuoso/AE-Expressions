// Attach Object to Trim Paths End
// Apply to Position
// Object must be parented to the path layer

// Path must be converted to Bezier!

var target = effect("Layer Control")("Layer");
var path = target.content("Path 1").path;
var perc = target.content("Trim Paths 1").end/100;

var pos = path.pointOnPath(percentage = perc);

pos
