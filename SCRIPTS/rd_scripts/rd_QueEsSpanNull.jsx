// rd_QueEsSpanNull.jsx
// Copyright (c) 2007-2013 redefinery (Jeffrey R. Almasol). All rights reserved.
// check it: www.redefinery.com
// 
// Name: rd_QueEsSpanNull
// Version: 1.1
// 
// Description:
// This script creates a null layer that spans the distance between two 
// selected 2D layers.
// 
// Note: This script requires After Effects 7.0 or later.
// 
// Originally requested and based on expressions 
// created by Stu Maschwitz.
// 
// Legal stuff:
// This script is provided "as is," without warranty of any kind, expressed
// or implied. In no event shall the author be held liable for any damages 
// arising in any way from the use of this script.
// 
// In other words, I'm just trying to share knowledge with and help out my
// fellow AE script heads, so don't blame me if my code doesn't rate. :-)




// rd_QueEsSpanNull()
// 
// Description:
// This function contains the main logic for this script.
// 
// Parameters:
// None.
// 
// Returns:
// Nothing.
//
(function rd_QueEsSpanNull()
{
	// Globals
	
	var rd_QueEsSpanNullData = new Object();	// Store globals in an object
	rd_QueEsSpanNullData.scriptName = "rd: Que Es Span Null";
	rd_QueEsSpanNullData.scriptTitle = rd_QueEsSpanNullData.scriptName + " v1.1";
	
	rd_QueEsSpanNullData.strHelp = {en: "?"};
	rd_QueEsSpanNullData.strNoTwoLayersSel = {en: "Select only two 2D layers to span, then try again."};
	rd_QueEsSpanNullData.strLayersSameName = {en: "The selected layers have the same name. Rename one of them, then try again."};
	rd_QueEsSpanNullData.strErrNoCompSel = {en: "Cannot perform operation. Please select or open a composition in the Project window, and try again."};
	rd_QueEsSpanNullData.strMinAE70 = {en: "This script requires Adobe After Effects 7.0 or later."};
	rd_QueEsSpanNullData.strHelpText = 
	{
		en: "Copyright (c) 2007-2013 redefinery (Jeffrey R. Almasol). \n" +
		"All rights reserved.\n" +
		"\n" +
		"This script creates a null layer that spans the distance between two \n" +
		"selected 2D layers.\n" +
		"\n" +
		"Note: This script requires After Effects 7.0 or later.\n" +
		"\n" +
		"Originally requested and based on expressions \n" +
		"created by Stu Maschwitz.\n"
	};
	
	
	
	
	// rd_QueEsSpanNull_localize()
	// 
	// Description:
	// This function localizes the given string variable based on the current locale.
	// 
	// Parameters:
	//   strVar - The string variable's name.
	// 
	// Returns:
	// String.
	//
	function rd_QueEsSpanNull_localize(strVar)
	{
		return strVar["en"];
	}
	
	
	
	
	// main code:
	//
	
	// Prerequisites check
	if (parseFloat(app.version) < 7.0)
		alert(rd_QueEsSpanNull_localize(rd_QueEsSpanNullData.strMinAE70), rd_QueEsSpanNullData.scriptName);
	else
	{
		// Make sure only a single comp is selected
		if (app.project === null)
			return;
		
		// Get the current (active/frontmost) comp
		var comp = app.project.activeItem;
		
		if ((comp === null) || !(comp instanceof CompItem))
		{
			alert(rd_QueEsSpanNull_localize(rd_QueEsSpanNullData.strErrNoCompSel), rd_QueEsSpanNullData.scriptName);
			return;
		}
		
		// Make sure only two 2D layers, with different names, are selected
		if (comp.selectedLayers.length !== 2)
		{
			alert(rd_QueEsSpanNull_localize(rd_QueEsSpanNullData.strNoTwoLayersSel), rd_QueEsSpanNullData.scriptName);
			return;
		}
		
		var l1 = comp.selectedLayers[0];
		var l2 = comp.selectedLayers[1];
		if (l1.threeDLayer || l2.threeDLayer)
		{
			alert(rd_QueEsSpanNull_localize(rd_QueEsSpanNullData.strNoTwoLayersSel), rd_QueEsSpanNullData.scriptName);
			return;
		}
		if (l1.name === l2.name)
		{
			alert(rd_QueEsSpanNull_localize(rd_QueEsSpanNullData.strLayersSameName), rd_QueEsSpanNullData.scriptName);
			return;
		}
		
		app.beginUndoGroup(rd_QueEsSpanNullData.scriptName);
		
		// Create null layer above top-selected layer
		var spanLayer = comp.layers.addNull();
		spanLayer.name = "Span";
		spanLayer.source.pixelAspect = 1.0;
		
		var topLayer = (l1.index < l2.index) ? l1 : l2;
		spanLayer.moveBefore(topLayer);
		
		// Create expressions
		spanLayer.position.expression = "thisComp.layer(\"" + l1.name + "\").transform.position";
		spanLayer.position.expressionEnabled = true;
		
		//spanLayer.scale.expression = "l = length(thisComp.layer(\"" + l2.name + "\").transform.position, thisComp.layer(\"" + l1.name + "\").transform.position); [l, l]";
		spanLayer.scale.expression = "p1 = [thisComp.layer(\"" + l1.name + "\").transform.position[0]*thisComp.pixelAspect, thisComp.layer(\"" + l1.name + "\").transform.position[1]];\n" + 
			"p2 = [thisComp.layer(\"" + l2.name + "\").transform.position[0]*thisComp.pixelAspect, thisComp.layer(\"" + l2.name + "\").transform.position[1]];\n" + 
			"l = length(p1, p2);\n" + 
			"[l, l]";
		spanLayer.scale.expressionEnabled = true;
		
		//spanLayer.rotation.expression = "targetLayer = thisComp.layer(\"" + l2.name + "\"); delta = position - targetLayer.position; (Math.atan2(delta[1], delta[0]) * 180/Math.PI) +180;";
		spanLayer.rotation.expression = "p1 = [thisComp.layer(\"" + l1.name + "\").transform.position[0]*thisComp.pixelAspect, thisComp.layer(\"" + l1.name + "\").transform.position[1]];\n" +
			"p2 = [thisComp.layer(\"" + l2.name + "\").transform.position[0]*thisComp.pixelAspect, thisComp.layer(\"" + l2.name + "\").transform.position[1]];\n" +
			"delta = p1-p2;\n" +
			"(Math.atan2(delta[1], delta[0])*180/Math.PI)+180;"
		spanLayer.rotation.expressionEnabled = true;
		
		app.endUndoGroup();
	}
})();
