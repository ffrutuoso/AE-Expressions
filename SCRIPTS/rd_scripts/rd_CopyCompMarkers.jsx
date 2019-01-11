// rd_CopyMarkers.jsx
// Copyright (c) 2016 redefinery (Jeffrey R. Almasol). All rights reserved.
// check it: www.redefinery.com
// 
// Name: rd_CopyCompMarkers
// Version: 1.0
// 
// Description:
// This script copies the composition markers to the selected layers, at the same
// composition times. It doesn't copy Flash Cue Point data at this time.
// 
// Note: Existing markers on the target layers are not removed beforehand.
// 
// Originally requested by Ryan Summers.
// 
// Legal stuff:
// This script is provided "as is," without warranty of any kind, expressed
// or implied. In no event shall the author be held liable for any damages 
// arising in any way from the use of this script.
// 
// In other words, I'm just trying to share knowledge with and help out my
// fellow AE script heads, so don't blame me if my code doesn't rate. :-)




// CopyCompMarkers()
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
(function CopyCompMarkers()
{
	// Globals
	
	var rd_CopyCompMarkersData = new Object();	// Store globals in an object
	var comp, layers, i, textLayer, numCompMarkers, m, markerTime, markerObj, j;

	rd_CopyCompMarkersData.scriptName = "rd: Copy Comp Markers";
	rd_CopyCompMarkersData.scriptTitle = rd_CopyCompMarkersData.scriptName + " v1.0";
	
	rd_CopyCompMarkersData.strErrNoCompSel = {en: "Cannot perform operation. Please select or open a single composition in the Project window, and try again."};
	rd_CopyCompMarkersData.strErrNoLayersSel = {en: "Cannot perform operation. Please select at least one layer, and try again."};
	
	
	
	
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
	
	
	
	
	// rd_CopyMarkers_getCompMarkerValue()
	// 
	// Description:
	// This function gets the marker data for a comp marker, creating a MarkerValue object suitable for a layer.
	// 
	// Parameters:
	//   textLayer - The text layer to use for querying comp markers.
	//   i - The index of the comp maker to query.
	// 
	// Returns:
	// MarkerValue object
	//
	function rd_CopyMarkers_getCompMarkerValue(textLayer, i)
	{
		var mv = new MarkerValue(""), mt = 0;
		
		textLayer.sourceText.expression = "thisComp.marker.key(" + i + ").time";
		mt = parseFloat(textLayer.sourceText.value);
		
		textLayer.sourceText.expression = "thisComp.marker.key(" + i + ").comment";
		mv.comment = textLayer.sourceText.value;
		textLayer.sourceText.expression = "thisComp.marker.key(" + i + ").duration";
		mv.duration = parseFloat(textLayer.sourceText.value);
		textLayer.sourceText.expression = "thisComp.marker.key(" + i + ").chapter";
		mv.chapter = textLayer.sourceText.value;
		textLayer.sourceText.expression = "thisComp.marker.key(" + i + ").url";
		mv.url = textLayer.sourceText.value;
		textLayer.sourceText.expression = "thisComp.marker.key(" + i + ").frameTarget";
		mv.frameTarget= textLayer.sourceText.value;
		
		return [mt, mv];
	}
	
	
	
	
	// Check that a project exists
	if (app.project === null)
		return;
	
	// Get the current (active/frontmost) comp
	comp = app.project.activeItem;
	
	if ((comp === null) || !(comp instanceof CompItem))
	{
		alert(rd_CopyMarkers_localize(rd_CopyCompMarkersData.strErrNoCompSel), rd_CopyCompMarkersData.scriptName);
		return;
	}
	
	// If no layers are selected, nothing to do
	if (comp.selectedLayers.length === 0)
	{
		alert(rd_CopyMarkers_localize(rd_CopyCompMarkersData.strErrNoLayersSel), rd_CopyCompMarkersData.scriptName);
		return;
	}
	
	app.beginUndoGroup(rd_CopyCompMarkersData.scriptName);
	
	// Store a copy of the selected layers, because we'll be creating a temp text layer
	layers = new Array();
	for (i=0; i<comp.selectedLayers.length; i++)
	{
		layers.push(comp.selectedLayers[i]);
	}
	
	// Create a temp text layer at the bottom of the comp stack (to avoid changing indices). We'll use this text layer to query the comp markers.
	textLayer = comp.layers.addText("temp");
	textLayer.moveToEnd();

	// Get the number of comp markers
	textLayer.sourceText.expression = "thisComp.marker.numKeys";
	numCompMarkers = parseInt(textLayer.sourceText.value);

	// Loop through all comp markers, copying their info to the selected layers
	for (i=1; i<=numCompMarkers; i++)
	{
		// Query the next comp marker
		m = rd_CopyMarkers_getCompMarkerValue(textLayer, i);
		markerTime = m[0];
		markerObj = m[1];
		
		// Apply marker info to the selected layers
		for (var j=0; j<layers.length; j++)
		{
			layers[j].marker.setValueAtTime(markerTime, markerObj);
		}
	}
	
	// Delete the temp text layer
	textLayer.remove();
	
	// Restore selection of layers
	for (var j=0; j<layers.length; j++)
	{
		layers[j].selected = true;
	}
	
	app.endUndoGroup();
})();
