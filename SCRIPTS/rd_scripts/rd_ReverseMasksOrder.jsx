// rd_ReverseMasksOrder.jsx
// Copyright (c) 2009-2013 redefinery (Jeffrey R. Almasol). All rights reserved.
// check it: www.redefinery.com
// 
// Name: rd_ReverseMasksOrder
// Version: 1.1
// 
// Description:
// This script reverses the stacking order of all masks on the selected layer.
// 
// Note: This version of the script requires After Effects CS3 
// or later.
// 
// Originally requested by Rob Birnholz.
// 
// Legal stuff:
// This script is provided "as is," without warranty of any kind, expressed
// or implied. In no event shall the author be held liable for any damages 
// arising in any way from the use of this script.
// 
// In other words, I'm just trying to share knowledge with and help out my
// fellow AE script heads, so don't blame me if my code doesn't rate. :-)




// rd_ReverseMasksOrder()
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
(function rd_ReverseMasksOrder()
{
	// Globals
	
	var rd_ReverseMasksOrderData = new Object();	// Store globals in an object
	rd_ReverseMasksOrderData.scriptName = "rd: Reverse Masks Order";
	rd_ReverseMasksOrderData.scriptTitle = rd_ReverseMasksOrderData.scriptName + " v1.1";
	
	rd_ReverseMasksOrderData.strErrNoComp = {en: "Select or open a composition, then try again."};
	rd_ReverseMasksOrderData.strErrNoSelLayer = {en: "Select a single layer containing masks, then try again."};
	rd_ReverseMasksOrderData.strMinAE80 = {en: "This script requires Adobe After Effects CS3 or later."};
	
	
	
	
	// rd_ReverseMasksOrder_localize()
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
	function rd_ReverseMasksOrder_localize(strVar)
	{
		return strVar["en"];
	}
	
	
	
	
	// main code:
	//
	
	// Prerequisites check
	if (parseFloat(app.version) < 8.0)
		alert(rd_ReverseMasksOrder_localize(rd_ReverseMasksOrderData.strMinAE80), rd_ReverseMasksOrderData.scriptName);
	else
	{
		var comp = app.project.activeItem;
		if ((comp === null) || !(comp instanceof CompItem))
		{
			alert(rd_ReverseMasksOrder_localize(rd_ReverseMasksOrderData.strErrNoComp), rd_ReverseMasksOrderData.scriptName);
			return;
		}
		
		if (comp.selectedLayers.length !== 1)
		{
			alert(rd_ReverseMasksOrder_localize(rd_ReverseMasksOrderData.strErrNoSelLayer), rd_ReverseMasksOrderData.scriptName);
			return;
		}
		var layer = comp.selectedLayers[0];
		var masks = layer.mask;
		var numMasks = masks.numProperties;
		
		app.beginUndoGroup(rd_ReverseMasksOrderData.scriptName);
		
		for (var i=0; i<numMasks-1; i++)
		{
			masks.property(1).moveTo(numMasks-i);
		}
		
		app.endUndoGroup();
	}
})();
