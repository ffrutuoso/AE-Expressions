// rd_MapTextFileToMarkers.jsx
// Copyright (c) 2006-2013 redefinery (Jeffrey R. Almasol). All rights reserved.
// check it: www.redefinery.com
// 
// Name: rd_MapTextFileToMarkers
// Version: 1.3
// 
// Description:
// This script maps lines from a text file as Source Text keyframes on the
// selected text layer at successive markers on the layer. You can control
// the text line to use by entering a line number at the start of the 
// marker's comment.
// 
// Unless specified, each successive marker from that point will use
// successive lines from the text file. For example, if the text layer
// contains five markers, all without a comment except the third one which
// has a comment starting with the number 10, the script will place the 
// first line of text at the first marker, second line at the second, 
// tenth line at the third, 11th line at the fourth, and 12th line at 
// the fifth. If the requested line number does not exist in the text 
// file, lines from the text file will be cycled (repeated); specify 0 
// at the start of the comment to skip a marker (and incremented line).
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




// rd_MapTextFileToMarkers()
// 
// Description:
// This function performs the actual mapping of text lines from a file to markers on the selected
// text layer.
// 
// Parameters:
// None.
// 
// Returns:
// Nothing.
//
(function rd_MapTextFileToMarkers()
{
	// Globals
	
	var rd_MapTextFileToMarkersData = new Object();	// Store globals in an object
	rd_MapTextFileToMarkersData.scriptName = "rd: Map Text File to Markers";
	rd_MapTextFileToMarkersData.scriptTitle = rd_MapTextFileToMarkersData.scriptName + " v1.3";
	
	rd_MapTextFileToMarkersData.strErrNoCompSel = {en: "Cannot perform operation. Please select or open a single composition in the Project window, and try again."};
	rd_MapTextFileToMarkersData.strErrNoTextLayerSel = {en: "Cannot perform operation. Please select a single text layer containing one or more markers, and try again."};
	
	
	
	
	// rd_MapTextFileToMarkers_localize()
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
	function rd_MapTextFileToMarkers_localize(strVar)
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
		alert(rd_MapTextFileToMarkers_localize(rd_MapTextFileToMarkersData.strErrNoCompSel), rd_MapTextFileToMarkersData.scriptName);
		return;
	}
	
	// If a single layer isn't selected, nothing to do
	if (comp.selectedLayers.length !== 1)
	{
		alert(rd_MapTextFileToMarkers_localize(rd_MapTextFileToMarkersData.strErrNoTextLayerSel), rd_MapTextFileToMarkersData.scriptName);
		return;
	}
	
	// Check that the layer is a text layer with markers
	var layer = comp.selectedLayers[0];
	
	if (layer.property("sourceText") === null)
	{
		alert(rd_MapTextFileToMarkers_localize(rd_MapTextFileToMarkersData.strErrNoTextLayerSel), rd_MapTextFileToMarkersData.scriptName);
		return;
	}
	
	if (layer.property("marker") === null)
	{
		alert(rd_MapTextFileToMarkers_localize(rd_MapTextFileToMarkersData.strErrNoTextLayerSel), rd_MapTextFileToMarkersData.scriptName);
		return;
	}
	
	var markers = layer.property("marker");
	if (markers.numKeys === 0)
	{
		alert(rd_MapTextFileToMarkers_localize(rd_MapTextFileToMarkersData.strErrNoTextLayerSel), rd_MapTextFileToMarkersData.scriptName);
		return;
	}
	
	// Get the text file to use; and read the lines of text
	var textFile = File.openDialog("Select a text file");
	if (textFile === null)
		return;
	
	var textLines = new Array();
	textFile.open("r");
	while (!textFile.eof)
		textLines[textLines.length] = textFile.readln();
	textFile.close();
	
	// Start performing the operation
	app.beginUndoGroup(rd_MapTextFileToMarkersData.scriptName);
	
	var sourceText = layer.property("sourceText");
	
	// Remove existing Source Text keyframes
	for (var i=sourceText.numKeys; i>=1; i--)
		sourceText.removeKey(i);
	
	var currLineNum = 0;
	var markerTime, markerText, markerNum;
	//$.writeln("numlines = "+textLines.length);
	for (var i=1; i<=markers.numKeys; i++)
	{
		// Get the marker info
		markerTime = markers.keyTime(i);
		markerText = markers.keyValue(i).comment;
		
		// Check if resetting line number
		if (markerText !== "")
		{
			// Get the initial number (if one exists) in the marker comment
			markerNum = markerText.match(/\d+/);
			
			// Check if skipping text (but still increment line number)
			if (parseInt(markerNum) === 0)
			{
				currLineNum++;
				continue;
			}
			
			currLineNum = markerNum - 1;
		}
		
		// Loop line number if greater than number of lines in text file (modulo operator to the rescue!)
		currLineNum = currLineNum % textLines.length;
		
		// Set the source text at the marker time
		markerText = textLines[currLineNum];
		if (markerText === "")		// AE can't set a text layer to be blank via scripting, so use blank character instead
			markerText = " ";
		
		sourceText.setValueAtTime(markerTime, new TextDocument(markerText));
		//$.writeln("marker "+i+" = '"+markerText+"' (line "+currLineNum+")");
		
		// Get ready for the next line of text
		currLineNum++;
	}
	
	app.endUndoGroup();
})();
