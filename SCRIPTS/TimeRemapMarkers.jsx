{
  function addRemap() {
    var thisComp = app.project.activeItem;
    var thisLayer = thisComp.selectedLayers;

    for (var i = 0; i < thisLayer.length; i++) {
      // stores the expression
      var exp =
        "//control layer actions by markers\n//adapted from Dan Ebberts @ www.motionscript.com\n//apply to Time Remapping\nvar action = comp('" +
        thisLayer[i].source.name +
        "').layer('Time Control');\nvar d = framesToTime(1); //tira um frame para parar\nvar n = 0;\nif (marker.numKeys > 0){\n  var n = marker.nearestKey(time).index; //nro do marker\n  if (marker.key(n).time > time){ //se o tempo do marker for maior que o tempo actual\n    n--; //tira um ao index do marker\n  }\n}\nif (n == 0){\n  0\n} else {\n  var m = marker.key(n);\n  var myComment = m.comment;\n  var t = time - m.time;\n  try {\n    var actMarker = action.marker.key(myComment);\n    if (action.marker.numKeys > actMarker.index){ //se não for o último marker\n      var tMax = action.marker.key(actMarker.index + 1).time - actMarker.time - d; //define o tempo máximo 'd' tira um frame\n    } else {\n      var tMax = action.outPoint - actMarker.time - d;\n    }\n    t = Math.min(t, tMax);\n    actMarker.time + t;\n  } catch (err) {0}\n}";

      addNullLayer(findMyComp(thisLayer[i].source.name)); // creates control null
      thisLayer[i].timeRemapEnabled = true; // sets time-remapping
      thisLayer[i].timeRemap.expression = exp; // sets expression

      if (thisLayer[i].timeRemap.numKeys > 1) {
        thisLayer[i].timeRemap.removeKey(2); // removes second keyframe
      }
    }

    // close twirled layers
    // app.executeCommand(2771);
    // app.executeCommand(2771);
  }

  // function to find comp by name

  function findMyComp(compName) {
    var myComp;
    for (var j = 1; j <= app.project.numItems; j++) {
      if (app.project.item(j) instanceof CompItem && app.project.item(j).name === String(compName)) {
        myComp = app.project.item(j);
        break;
      }
    }
    return myComp;
  }

  // function to add control null

  function addNullLayer(targetComp) {
    var nameControl = "Time Control";
    var hasControl = false;

    // searches for existing control layers

    for (var i = 1; i < targetComp.layers.length; i++) {
      if (targetComp.layers[i].name === nameControl) {
        var hasControl = true;
        break;
      }
    }

    // if there are none, then create Control

    if (!hasControl) {
      var thisNull = targetComp.layers.addNull();

      thisNull.name = nameControl;
      thisNull.enabled = false;
      thisNull.property("anchorPoint").setValue([50, 50, 0]);
    }
  }

  // begin undo group
  app.beginUndoGroup("Time Remap Markers");

  // execute
  addRemap();

  app.endUndoGroup();
}
