// rd_CopyMarkers.jsx
// Copyright (c) 2006-2013 redefinery (Jeffrey R. Almasol). All rights reserved.
// check it: www.redefinery.com
// 
// Name: rd_CopyMarkers
// Version: 1.2
// 
// Description:
// This script copies the markers from the first selected layer to the
// other selected layers, at the same composition times.
// 
// Note: Existing markers on the target layers are not removed beforehand.
// 
// Originally requested by Wes Plate.
// 
// Legal stuff:
// This script is provided "as is," without warranty of any kind, expressed
// or implied. In no event shall the author be held liable for any damages 
// arising in any way from the use of this script.
// 
// In other words, I'm just trying to share knowledge with and help out my
// fellow AE script heads, so don't blame me if my code doesn't rate. :-)




// CopyMarkers()
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
(function CopyMarkers()
{
	// Globals
	
	var rd_CopyMarkersData = new Object();	// Store globals in an object
	rd_CopyMarkersData.scriptName = "rd: Copy Markers";
	rd_CopyMarkersData.scriptTitle = rd_CopyMarkersData.scriptName + " v1.2";
	
	rd_CopyMarkersData.strErrNoCompSel = {en: "Cannot perform operation. Please select or open a single composition in the Project window, and try again."};
	rd_CopyMarkersData.strErrNoTwoPlusLayersSel = {en: "Cannot perform operation. Please select at least two layers with the first selected layer having at least one layer marker, and try again."};
	
	
	
	
	// rd_CopyMarkers_localize()
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
	function rd_CopyMarkers_localize(strVar)
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
		alert(rd_CopyMarkers_localize(rd_CopyMarkersData.strErrNoCompSel), rd_CopyMarkersData.scriptName);
		return;
	}
	
	// If less than two layers aren't selected, nothing to do
	if (comp.selectedLayers.length < 2)
	{
		alert(rd_CopyMarkers_localize(rd_CopyMarkersData.strErrNoTwoPlusLayersSel), rd_CopyMarkersData.scriptName);
		return;
	}
	
	// Check that the first selected layer has markers
	var layer = comp.selectedLayers[0];
	
	if (layer.property("marker") === null)
	{
		alert(rd_CopyMarkers_localize(rd_CopyMarkersData.strErrNoTwoPlusLayersSel), rd_CopyMarkersData.scriptName);
		return;
	}
	
	var markers = layer.property("marker");
	if (markers.numKeys === 0)
	{
		alert(rd_CopyMarkers_localize(rd_CopyMarkersData.strErrNoTwoPlusLayersSel), rd_CopyMarkersData.scriptName);
		return;
	}
	
	// Start performing the operation
	app.beginUndoGroup(rd_CopyMarkersData.scriptName);
	
	for (var i=1; i<=markers.numKeys; i++)
	{
		for (var j=1; j<comp.selectedLayers.length; j++)
			comp.selectedLayers[j].property("marker").setValueAtTime(markers.keyTime(i), markers.keyValue(i));
	}
	
	app.endUndoGroup();
})();
