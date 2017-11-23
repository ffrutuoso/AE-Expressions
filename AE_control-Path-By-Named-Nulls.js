// Control path by named layers
// apply to any path property

var useName = false; // use path layer name
var searchString = "PathPoint_"; // string to search

// search by path layer name
if (useName) {
  searchString = name + "_";
}

// store original path
var originalPath = thisProperty;
var pointArr = originalPath.points();
var inTangArr = originalPath.inTangents();
var outTangArr = originalPath.outTangents();

// search layers
for (var i = 1; i < thisComp.numLayers + 1; i++) {
  var nameSearch = thisComp.layer(i).name.search(searchString);

  // if any Layer name matches searchString
  if (nameSearch >= 0) {
    var pointIndex = Number(thisComp.layer(i).name.substr(searchString.length)); // get point index from name
    pointArr[pointIndex] = fromCompToSurface(thisComp.layer(i).toComp(thisComp.layer(i).anchorPoint)); // set position
  }
}

// create path
createPath(pointArr, inTangArr, outTangArr, originalPath.isClosed());
