// Adds a blinking cursor to the selected layer.

{
  function addCircleGrid() {
    var thisComp = app.project.activeItem;

    for (var currentIndex = 1; currentIndex <= thisComp.numLayers; currentIndex++) {
      var thisLayer = thisComp.layer(currentIndex);
      var isCircle = false;

      if (thisLayer.name.search("CIRCLE") != -1) {
        var isCircle = true;
      }

      if (isCircle) {
        var shapeContents = thisLayer.property("Contents");
        shapeContents
          .property("Fill 1")
          .property("Color")
          .setValue(getRandomColor(thisComp.layer("Colors")));
      }
    }
  }

  function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min)) + min; //The maximum is exclusive and the minimum is inclusive
  }

  function getRandomColor(comp) {
    var controlLayer = comp;
    var effectNumber = controlLayer.effect.numProperties;
    var randomNumber = getRandomInt(0, effectNumber) + 1;

    return controlLayer.effect(randomNumber).color.value;
  }

  app.beginUndoGroup("Add Circle Grid");
  addCircleGrid();
  app.endUndoGroup();
}
