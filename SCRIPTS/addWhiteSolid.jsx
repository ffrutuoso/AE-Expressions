//SwapPosition.jsx
//copyright 2012 Dan Fredley
// Swaps the position of two selected layers in After Effects.
// v1.0 - original release 27 July 2012
/** Set the current comp to the var thisComp */

{
  function addNullLayer() {
    var thisComp = app.project.activeItem;

    app.beginUndoGroup("Add White BG");

    var solidColor = [1,1,1];
    var solidName = "BG";
    var solidWidth = thisComp.width;
    var solidHeight = thisComp.height;
    var solidDuration = thisComp.duration;

    var thisSolid = thisComp.layers.addSolid(solidColor, solidName, solidWidth, solidHeight, 1, solidDuration);

    thisSolid.moveToEnd();
    thisSolid.guideLayer = true;
    thisSolid.locked = true;
    
    app.endUndoGroup();

  }

  addNullLayer();

}
