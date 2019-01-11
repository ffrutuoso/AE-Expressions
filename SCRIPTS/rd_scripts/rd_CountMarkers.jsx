// rd_CountMarkers.jsx
// Copyright (c) 2009-2013 redefinery (Jeffrey R. Almasol). All rights reserved.
// check it: www.redefinery.com
// 
// Name: rd_CountMarkers
// Version: 1.1
// 
// Description:
// This script displays a count of the number of markers on the selected layer.
// 
// Originally requested by Tim Sassoon.
// 
// Legal stuff:
// This script is provided "as is," without warranty of any kind, expressed
// or implied. In no event shall the author be held liable for any damages 
// arising in any way from the use of this script.
// 
// In other words, I'm just trying to share knowledge with and help out my
// fellow AE script heads, so don't blame me if my code doesn't rate. :-)




// CountMarkers()
// 
// Description:
// This function performs the actual copying of markers between selected layers.
// 
// Parameters:
// None.
// 
// Returns:
// Nothing.
//
(function CountMarkers()
{
	// Globals
	
	var rd_CountMarkersData = new Object();	// Store globals in an object
	rd_CountMarkersData.scriptName = "rd: Count Markers";
	rd_CountMarkersData.scriptTitle = rd_CountMarkersData.scriptName + " v1.1";
	
	rd_CountMarkersData.strErrNoCompSel = {en: "Cannot perform operation. Please select or open a single composition in the Project panel, and try again."};
	rd_CountMarkersData.strErrNoSingleLayerSel = {en: "Cannot perform operation. Please select a single layer, and try again."};
	rd_CountMarkersData.strNumMarkerOnLayer = {en: " marker found"};
	rd_CountMarkersData.strNumMarkersOnLayer = {en: " markers found"};
	
	
	
	
	// rd_CountMarkers_localize()
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
	function rd_CountMarkers_localize(strVar)
	{
		return strVar["en"];
	}
	
	
	
	
	// Check that a project exists
	if (app.project === null)
		return;
	
	// Get the current (active/frontmost) comp
	var comp = app.project.activeItem;
	
	if ((comp === null) || !(comp instanceof CompItem))
	{
		alert(rd_CountMarkers_localize(rd_CountMarkersData.strErrNoCompSel), rd_CountMarkersData.scriptName);
		return;
	}
	
	// If a single layer isn't selected, nothing to do
	if (comp.selectedLayers.length !== 1)
	{
		alert(rd_CountMarkers_localize(rd_CountMarkersData.strErrNoSingleLayerSel), rd_CountMarkersData.scriptName);
		return;
	}
	
	// Display the number of markers on the selected layer
	var layer = comp.selectedLayers[0];
	
	if (layer.property("marker") === null)
	{
		alert(rd_CountMarkers_localize(rd_CountMarkersData.strErrNoSingleLayerSel), rd_CountMarkersData.scriptName);
		return;
	}
	
	var markers = layer.property("marker");
	alert(markers.numKeys + rd_CountMarkers_localize((markers.numKeys === 1) ? rd_CountMarkersData.strNumMarkerOnLayer : rd_CountMarkersData.strNumMarkersOnLayer), rd_CountMarkersData.scriptName);
})();
