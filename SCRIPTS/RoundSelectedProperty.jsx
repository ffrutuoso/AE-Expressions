{
  function roundProps() {
    var proj = app.project;
    var thisComp = proj.activeItem;
    var selLayers = thisComp.selectedLayers;

    for (var currentLayer = 0; currentLayer < selLayers.length; currentLayer++) {
      var activeLayer = selLayers[currentLayer];
      var roundedValue = [];
      var layerPos = activeLayer.transform.position;

      for (var index = 0; index < layerPos.value.length; index++) {
        var changedValue = Math.floor(layerPos.value[index] / 100) * 100 + 50;
        roundedValue.push(changedValue);
      }
      layerPos.setValue(roundedValue);
      layerPos.expression = "";
    }
  }
  app.beginUndoGroup("Round Position");
  roundProps();
  app.endUndoGroup();
}
