{
  function pxToEm() {
    var thisComp = app.project.activeItem;
    var thisLayer = thisComp.selectedLayers;

    app.beginUndoGroup("Set Tracking");

    var inputPix = prompt("Please enter tracking in Pixels:", "");
    var pixelVal = parseFloat(inputPix);

    if (isNaN(pixelVal)) {
      alert("Not a valid number");
    } else {

      var textSize = 20;

      for (var i = 0; i < thisLayer.length; i++) {
        var textProp = thisLayer[i].property("Source Text");
        var textDocument = textProp.value;

        textSize = textDocument.fontSize;
        var trackingVal = Math.round(pixelVal / textSize * 1000);

        if (trackingVal > 1000 || trackingVal < -1000) {
          alert("Value " + trackingVal + " is out of Range");
          break;
        }

        textDocument.tracking = trackingVal;

        textProp.setValue(textDocument);

      };

      app.endUndoGroup();
    }
  }
  pxToEm();

}
