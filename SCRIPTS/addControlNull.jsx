//SwapPosition.jsx
//copyright 2012 Dan Fredley
// Swaps the position of two selected layers in After Effects.
// v1.0 - original release 27 July 2012
/** Set the current comp to the var thisComp */

{
  function addNullLayer() {
    var thisComp = app.project.activeItem;
    var proj = app.project;

    app.beginUndoGroup("Add Control Layer");

    var thisNull = thisComp.layers.addNull();
    thisNull.name = "Control";
    thisNull.enabled = false;
    thisNull.property("anchorPoint").setValue([50, 50, 0]);

    app.endUndoGroup();
  }

  addNullLayer();

}
