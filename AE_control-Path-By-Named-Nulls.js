// Control path by named layers
// apply to any path property

var useName = true; // use path layer name
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
for (var i = thisComp.numLayers; i >= 1; i--) {
  var nameSearch = thisComp.layer(i).name.search(searchString);

  // if any Layer name matches searchString
  if (nameSearch >= 0) {
    var pointIndex = Number(thisComp.layer(i).name.substr(searchString.length)); // get point index from name
    if (pointIndex >= pointArr.length) {
      pointArr.push([0, 0]);
      inTangArr.push([0, 0]);
      outTangArr.push([0, 0]);
    }
    pointArr[pointIndex] = fromCompToSurface(thisComp.layer(i).toComp(thisComp.layer(i).anchorPoint)); // set position

  }
}

// create path
createPath(pointArr, inTangArr, outTangArr, originalPath.isClosed());
