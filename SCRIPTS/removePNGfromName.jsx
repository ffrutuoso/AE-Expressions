//Removes ".png" from layer name

{
  function removePNG() {
    var searchString = ".png";
    var thisComp = app.project.activeItem;

    for (var currentLayer = 1; currentLayer <= thisComp.layers.length; currentLayer++) {
      var thisLayer = thisComp.layer(currentLayer);
      var thisLayerName = thisLayer.name;
      var hasString = thisLayerName.search(searchString);

      if (hasString >= 0) {
        var newName = thisLayerName.slice(0, -searchString.length);

        if (thisLayer.locked) {
          thisLayer.locked = !thisLayer.locked;
          thisComp.layer(currentLayer).name = newName;
          thisLayer.locked = !thisLayer.locked;
        } else {
          thisComp.layer(currentLayer).name = newName;
        }
      }
    }
  }

  app.beginUndoGroup("Remove .PNG from name");
  removePNG();
  app.endUndoGroup();
}
