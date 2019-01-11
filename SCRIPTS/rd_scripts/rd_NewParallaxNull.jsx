// rd_NewParallaxNull.jsx
// Copyright (c) 2007-2013 redefinery (Jeffrey R. Almasol). All rights reserved.
// check it: www.redefinery.com
// 
// Name: rd_NewParallaxNull
// Version: 1.1
// 
// Description:
// This script creates a new null layer with a slider that 
// controls its position between two selected layers.
// A slider value of 0 represents the first selected 
// layer's position, whereas 1 represents the second 
// selected's position.
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




// rd_NewParallaxNull()
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
(function rd_NewParallaxNull()
{
	// Globals
	
	var rd_NewParallaxNullData = new Object();	// Store globals in an object
	rd_NewParallaxNullData.scriptName = "rd: New Parallax Null";
	rd_NewParallaxNullData.scriptTitle = rd_NewParallaxNullData.scriptName + " v1.1";
	
	rd_NewParallaxNullData.strHelp = {en: "?"};
	rd_NewParallaxNullData.strNoTwoLayersSel = {en: "Select only two 2D or two 3D layers, then try again."};
	rd_NewParallaxNullData.strLayersSameName = {en: "The selected layers have the same name. Rename one of them, then try again."};
	rd_NewParallaxNullData.strErrNoCompSel = {en: "Cannot perform operation. Please select or open a composition in the Project window, and try again."};
	rd_NewParallaxNullData.strErrAddFx = {en: "Cannot add the Slider effect to the null (p) layer. Try again."};
	rd_NewParallaxNullData.strMinAE70 = {en: "This script requires Adobe After Effects 7.0 or later."};
	rd_NewParallaxNullData.strHelpText = 
	{
		en: "Copyright (c) 2007-2013 redefinery (Jeffrey R. Almasol). \n" +
		"All rights reserved.\n" +
		"\n" +
		"This script creates a new null layer with a slider that \n" +
		"controls its position between two selected layers. \n" +
		"A slider value of 0 represents the first selected \n" + 
		"layer's position, whereas 1 represents the second \n" + 
		"selected's position.\n" + 
		"\n" +
		"Note: This script requires After Effects 7.0 or later.\n" +
		"\n" +
		"Originally requested and based on expressions \n" +
		"created by Stu Maschwitz.\n"
	};
	
	
	
	
	// rd_NewParallaxNull_localize()
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
	function rd_NewParallaxNull_localize(strVar)
	{
		return strVar["en"];
	}
	
	
	
	
	// main code:
	//
	
	// Prerequisites check
	if (parseFloat(app.version) < 7.0)
		alert(rd_NewParallaxNull_localize(rd_NewParallaxNullData.strMinAE70), rd_NewParallaxNullData.scriptName);
	else
	{
		// Make sure only a single comp is selected
		if (app.project === null)
			return;
		
		// Get the current (active/frontmost) comp
		var comp = app.project.activeItem;
		
		if ((comp === null) || !(comp instanceof CompItem))
		{
			alert(rd_NewParallaxNull_localize(rd_NewParallaxNullData.strErrNoCompSel), rd_NewParallaxNullData.scriptName);
			return;
		}
		
		// Make sure only two layers of same type (2D or 3D, not mixed), with different names, are selected
		if (comp.selectedLayers.length !== 2)
		{
			alert(rd_NewParallaxNull_localize(rd_NewParallaxNullData.strNoTwoLayersSel), rd_NewParallaxNullData.scriptName);
			return;
		}
		
		var l1 = comp.selectedLayers[0];	// first selected
		var l2 = comp.selectedLayers[1];	// second selected
		if (l1.threeDLayer !== l2.threeDLayer)
		{
			alert(rd_NewParallaxNull_localize(rd_NewParallaxNullData.strNoTwoLayersSel), rd_NewParallaxNullData.scriptName);
			return;
		}
		if (l1.name === l2.name)
		{
			alert(rd_NewParallaxNull_localize(rd_NewParallaxNullData.strLayersSameName), rd_NewParallaxNullData.scriptName);
			return;
		}
		
		app.beginUndoGroup(rd_NewParallaxNullData.scriptName);
		
		// Create null layer above top-selected layer
		var pLayer = comp.layers.addNull();
		pLayer.name = "p";
		
		if (l1.threeDLayer)		// Make the null 3D if the layers are 3D
			pLayer.threeDLayer = true;
		
		var topLayer = (l1.index < l2.index) ? l1 : l2;
		pLayer.moveBefore(topLayer);
		
		// Add slider control (named Parallax) to null
		var parallaxFx = pLayer.property("Effects");
		
		
		var pLayerEffects = pLayer("ADBE Effect Parade");
		var parallaxFx = null;
		if ((pLayerEffects !== null) && pLayerEffects.canAddProperty("ADBE Slider Control"))
			parallaxFx = pLayerEffects.addProperty("ADBE Slider Control");
		
		if (parallaxFx !== null)
		{
			// Name the slider
			parallaxFx.name = "Parallax";
			
			// Create expression
			pLayer.position.expression = "((thisComp.layer(\"" + l2.name + "\").transform.position - thisComp.layer(\"" + l1.name + "\").transform.position) * effect(\"" + parallaxFx.name + "\")(\"ADBE Slider Control-0001\")) + thisComp.layer(\"" + l1.name + "\").transform.position";
			pLayer.position.expressionEnabled = true;
			
			// Set slider value to 0.5 (midway between the layers)
			parallaxFx.property("ADBE Slider Control-0001").setValue(0.5);
		}
		else
			alert(rd_localize(rd_NewParallaxNullData.strErrAddFx), rd_NewParallaxNullData.scriptName);
		
		app.endUndoGroup();
	}
})();
