//Align Vertices
//Author: Paul Conigliaro
//2017/11/28
//Assign to kbar button. Hold ALT/Option to nudge to the half pixel. Hold Shift to specify grid size for rounding.

(function(){
	var comp = app.project.activeItem;
	var selectedProperties = comp.selectedProperties;
	var prop = null;
	var shape = null;
	var vertex = [];
	var offset = ScriptUI.environment.keyboardState.altKey ? [0.5,0.5] : [0,0];
	var quantize = ScriptUI.environment.keyboardState.shiftKey ? prompt("Enter grid size in pixels:",10) : 1;

	if(quantize) {
		app.beginUndoGroup("Align Path Vertices"); {
			for(var i = 0; i < selectedProperties.length; i++) {
				prop = selectedProperties[i];
				if(prop.matchName == "ADBE Vector Shape") {
					var vertices = [];
					shape = new Shape();
					shape.inTangents = prop.value.inTangents;
					shape.outTangents = prop.value.outTangents;
					shape.closed = prop.value.closed;
					for(var j = 0; j < prop.value.vertices.length; j++) {
						vertex = prop.value.vertices[j];
						vertices.push([Math.round(vertex[0]/quantize)*quantize,Math.round(vertex[1]/quantize)*quantize]+offset);
					}
					shape.vertices = vertices;
					prop.setValue(shape);
				}
			}
		} app.endUndoGroup();
	}
})();