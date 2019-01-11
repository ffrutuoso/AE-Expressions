// Adds a blinking cursor to the selected layer.

{
  function addCursor() {
    var thisComp = app.project.activeItem;
    var thisLayer = thisComp.selectedLayers[0];
    var oneTextSelected = true;
    var isText = thisLayer instanceof TextLayer;

    if (thisComp.selectedLayers.length != 1 || !isText) {
      oneTextSelected = false;
      alert("Please select only one TEXT layer");
    }

    if (oneTextSelected) {
      //adds shape
      var thisShape = thisComp.layers.addShape();

      //set prefs
      //thisShape.startTime = thisLayer.startTime;
      thisShape.inPoint = thisLayer.inPoint;
      thisShape.outPoint = thisLayer.outPoint;
      thisShape.parent = thisLayer;
      thisShape.shy = thisLayer.shy;
      thisShape.name = thisLayer.name + "_cursor";

      //move to before parent
      thisShape.moveBefore(thisLayer);

      //shape content
      var shapeContents = thisShape.property("Contents");
      shapeContents.addProperty("ADBE Vector Shape - Rect");
      shapeContents
        .property("Rectangle Path 1")
        .property("Size")
        .setValue([1, 25]);

      shapeContents.addProperty("ADBE Vector Graphic - Fill");
      shapeContents
        .property("Fill 1")
        .property("Color")
        .setValue([220, 220, 220] / 255);

      thisShape.transform.position.expression =
        "// Sets position of a cursor rectangle that follows animated text\n// Apply on Position\nvar x = value[0];  // Get current position, allows it to be repositioned after\nvar y = value[1];\nvar targetLayer = parent;  // Get text layer\nvar rectW = targetLayer.sourceRectAtTime(time - targetLayer.startTime).width;  // Get width of text area\n// If text area is less than 1px wide, move 1px right\nif (rectW < 1) {\n  offset = 0;\n} else {\n  offset = 1;\n}\nvar roundRectW = Math.round(rectW) + offset;  // Rounds to the nearest pixel\n// Return value\n[x + roundRectW, y]";

      thisShape.transform.position.setValue([1, -6.5]);
      thisShape.transform.scale.setValue([100, 100]);

      thisShape.transform.opacity.expression =
        '// Blinks opacity of a cursor rectangle, in an input text field\n// Apply on opacity\nvar targetLayer = parent; // Sets target text layer\nvar spd = targetLayer.effect("Slider Control").slider.velocity; // Gets text animation speed\nvar inTime = time - thisLayer.startTime; // Calculates layer start time\nvar pulse = Math.round(inTime % 1); // Blinks every second\nif (pulse == 0) {\n    value\n} else if (spd != 0) {\n    value\n} else 0';
    }
  }

  app.beginUndoGroup("Add Text Cursor DEBUG");
  addCursor();
  app.endUndoGroup();
}
