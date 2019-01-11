// Control path by named layers
// apply to any path property

var useName = true; // use path layer name
var useTangents = true; // use tangents

var nameString = "PathPoint_"; // string to search
var inTangString = "inTang_"; // string to search
var outTangString = "outTang_"; // string to search

// search by path layer name
if (useName) {
  nameString = name + "_";
}

// store original path
var originalPath = thisProperty;
var pointArray = originalPath.points();
var inTangArray = originalPath.inTangents();
var outTangArray = originalPath.outTangents();

function subtituteArray(searchString, searchArr) {
  // search layers
  for (var i = thisComp.numLayers; i >= 1; i--) {
    var nameSearch = thisComp.layer(i).name.search(searchString);

    // if any Layer name matches searchString
    if (nameSearch >= 0) {
      // get point index from name
      var pointIndex = Number(thisComp.layer(i).name.substr(searchString.length));

      // if a null name exceeds the point count, add a new point
      // if (pointIndex >= pointArray.length && arrType == "point") {
      //   pointArray.push([0, 0]);
      //   inTangArray.push([0, 0]);
      //   outTangArray.push([0, 0]);
      // }

      // set point position
      searchArr[pointIndex] = fromCompToSurface(thisComp.layer(i).toComp(thisComp.layer(i).anchorPoint));
    }
  }
}

subtituteArray(nameString, pointArray);
subtituteArray(inTangString, inTangArray);
subtituteArray(outTangString, outTangArray);

// create path
createPath(pointArray, inTangArray, outTangArray, originalPath.isClosed());
