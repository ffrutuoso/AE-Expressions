// Adds a marker to the selected layers
// To be used for time-remapping with markers

{
  function addMarker() {
    var thisComp = app.project.activeItem;
    var markerComment = "hold";

    app.beginUndoGroup("Create Tap Marker");

    for (var i = 0; i < thisComp.selectedLayers.length; i++) {
      var myLayer = thisComp.selectedLayers[i];
      var myMarkerVal = new MarkerValue(markerComment);
      myLayer.property("Marker").setValueAtTime(myLayer.time, myMarkerVal);
    }

    app.endUndoGroup();
  }

  addMarker();

}
