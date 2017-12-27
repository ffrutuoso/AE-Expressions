// Adds a marker to the selected layers
// To be used for time-remapping with markers

{
  function setDifference() {
    var thisComp = app.project.activeItem;

    app.beginUndoGroup("Create Tap Marker");

    for (var i = 0; i < thisComp.selectedLayers.length; i++) {
      var myLayer = thisComp.selectedLayers[i];

      if (myLayer.blendingMode == BlendingMode.DIFFERENCE) {
        myLayer.blendingMode = BlendingMode.NORMAL;
      } else {
        myLayer.blendingMode = BlendingMode.DIFFERENCE;
      }
    }

    app.endUndoGroup();
  }

  setDifference();

}
