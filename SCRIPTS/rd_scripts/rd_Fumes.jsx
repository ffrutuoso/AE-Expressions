// rd_Fumes.jsx
// Copyright (c) 2005-2013 redefinery (Jeffrey R. Almasol). All rights reserved.
// check it: www.redefinery.com
// 
// Name: rd_Fumes
// Version: 1.2
// 
// Description:
// This script allows you to import tracker data exported from Autodesk(R)
// Combustion(R) as motion tracker data on the selected layer in Adobe(R)
// After Effects(R).
// 
// Each run of this script creates a new tracker and track point (with
// Feature Center and Attach Point keyframes), so if you have multiple 
// exported files, simply cut/paste the track points into the same 
// tracker afterwards. Each track point is named the same as the specified 
// tracker data file for easier identification.
// 
// Frame 1 in the exported data will be associated with the first frame
// of the selected layer, and associated frame numbers are assumed to be
// on a non (100%)-stretched layer. A custom (non-zero) starting frame
// number for the composition is ignored.
// 
// Note: This script requires After Effects 6.5 or later.
// 
// Originally requested by Donat Von Bellinghen.
// 
// Legal stuff:
// This script is provided "as is," without warranty of any kind, expressed
// or implied. In no event shall the author be held liable for any damages 
// arising in any way from the use of this script.
// 
// In other words, I'm just trying to share knowledge with and help out my
// fellow AE script heads, so don't blame me if my code doesn't rate. :-)




// rd_Fumes()
// 
// Description:
// This function queries the user for the tracker data file, and
// imports the data into After Effects.
// 
// Parameters:
// None.
// 
// Returns:
// Nothing.
//
(function rd_Fumes()
{
	// Globals
	
	var rd_FumesData = new Object();	// Store globals in an object
	rd_Fumes.scriptName = "rd: Fumes";
	rd_Fumes.scriptTitle = rd_Fumes.scriptName + " v1.2";
	
	rd_Fumes.strErrNoCompSel = {en: "Cannot perform operation. Please select or open a single composition in the Project window, and try again."};
	rd_Fumes.strErrNoLayerSel = {en: "Cannot perform operation. Please select a single footage or solid layer, and try again."};
	rd_Fumes.strErrNoMTSupportedLayer = {en: "Cannot perform operation because the selected layer cannot support motion tracker data. Please select a single layer (such as a footage or solid layer) that can support such data, and try again."};
	rd_Fumes.strSelectCombDataFile = {en: "Select the tracker data file exported from Combustion"};
	rd_Fumes.strImportDone = {en: "Tracker data imported as the track point named '%s'."};
	
	
	
	
	// rd_Fumes_localize()
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
	function rd_Fumes_localize(strVar)
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
		alert(rd_Fumes_localize(rd_Fumes.strErrNoCompSel), rd_Fumes.scriptName);
		return;
	}
	
	// If no layers are selected, nothing to do
	if (comp.selectedLayers.length !== 1)
	{
		alert(rd_Fumes_localize(rd_Fumes.strErrNoLayerSel), rd_Fumes.scriptName);
		return;
	}
	
	// Make sure the selected layer can have motion tracker data
	var layer = comp.selectedLayers[0];
	if (layer("Motion Trackers") === null)
	{
		alert(rd_Fumes_localize(rd_Fumes.strErrNoMTSupportedLayer), rd_Fumes.scriptName);
		return;
	}
	
	// Get the tracker data file
	var combDataFile = File.openDialog(rd_Fumes_localize(rd_Fumes.strSelectCombDataFile));
	
	if ((combDataFile === null) || !combDataFile.exists)
		return;
	
	// Start the operation
	app.beginUndoGroup(rd_Fumes.scriptName);
	
	// Read the data from the file, and create a new tracker point for it
	combDataFile.open("r");
	
	// Create a new motion tracker on the layer
	var mtGroup = layer("ADBE MTrackers");
	var mtTracker = mtGroup.addProperty("ADBE MTracker");
	var mtTrackPt = mtTracker.addProperty("ADBE MTracker Pt");
	var combPointData, matches, frame, x, y, frameTime;
	
	// Name the new track point the same as the data file
	mtTrackPt.name = combDataFile.name;
	
	//$.writeln("File: "+combDataFile.fsName);
	while (!combDataFile.eof)
	{
		// Read a line of data
		combPointData = combDataFile.readln();
		if (combDataFile.eof)
			break;
		
		// Break the line into the frame number, and x/y coordinates
		//$.writeln(combPointData);
		matches = combPointData.match(/\s*(.*)\s*:\s*(.*),\s*(.*)/);
		if (matches === null)
			continue;
		if (matches.length < 3)
			continue;
		
		frame = parseFloat(matches[1]) - 1;			// frame number 1 at start of layer
		x = parseFloat(matches[2]);
		y = comp.height - parseFloat(matches[3]);	// y-axis values are numbered opposite of those in AE
		
		// Create a Feature Center keyframe for each data point
		frameTime = frame / comp.frameRate + layer.startTime;			// frame time (in seconds), relative to layer's start time (assumes 100% stretch)
		//$.writeln("frame "+frame+" ("+frameTime+" sec) = "+x+", "+y);
		mtTrackPt.property("ADBE MTracker Pt Feature Center").setValueAtTime(frameTime, [x,y]);
		mtTrackPt.property("ADBE MTracker Pt Attach Pt").setValueAtTime(frameTime, [x,y]);
	}
	
	// Be kind...close the file
	combDataFile.close();
	
	app.endUndoGroup();
	
	alert(rd_Fumes_localize(rd_Fumes.strImportDone).replace("%s", mtTrackPt.name), rd_Fumes.scriptName)
})();
