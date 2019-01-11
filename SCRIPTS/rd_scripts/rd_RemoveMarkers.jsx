// rd_RemoveMarkers.jsx
// Copyright (c) 2007-2013 redefinery (Jeffrey R. Almasol). All rights reserved.
// check it: www.redefinery.com
// 
// Name: rd_RemoveMarkers
// Version: 2.0
// 
// Description:
// This script displays a palette with controls for removing layer-time
// markers from the selected layers.
// 
// Note: This version of the script requires After Effects 
// CS5 or later. It can be used as a dockable panel by 
// placing the script in a ScriptUI Panels subfolder of 
// the Scripts folder, and then choosing this script 
// from the Window menu.
// 
// Originally requested by Chris Meyer.
// 
// Legal stuff:
// This script is provided "as is," without warranty of any kind, expressed
// or implied. In no event shall the author be held liable for any damages 
// arising in any way from the use of this script.
// 
// In other words, I'm just trying to share knowledge with and help out my
// fellow AE script heads, so don't blame me if my code doesn't rate. :-)




// rd_RemoveMarkers()
// 
// Description:
// This function contains the main logic for this script.
// 
// Parameters:
// thisObj - "this" object.
// 
// Returns:
// Nothing.
//
(function rd_RemoveMarkers(thisObj)
{
	// Globals
	
	var rd_RemoveMarkersData = new Object();	// Store globals in an object
	rd_RemoveMarkersData.scriptName = "rd: Remove Markers";
	rd_RemoveMarkersData.scriptTitle = rd_RemoveMarkersData.scriptName + " v2.0";
	
	rd_RemoveMarkersData.strMarkersToDel = {en: "Layer Markers to Remove:"};
	rd_RemoveMarkersData.strMarkersToDelOpts = {en: '["All", "Inside Work Area", "Inside Layer In/Out", "Outside Layer In/Out", "Before/At Current Time", "At/After Current Time", "Odd-Numbered", "Even-Numbered"]'};
	rd_RemoveMarkersData.strDelMarkers = {en: "Remove Markers"};
	rd_RemoveMarkersData.strHelp = {en: "?"};
	rd_RemoveMarkersData.strErrNoCompSel = {en: "Cannot perform operation. Please select or open a single composition in the Project panel, and try again."};
	rd_RemoveMarkersData.strErrNoLayerSel = {en: "Cannot perform operation. Please select at least one layer, and try again."};
	rd_RemoveMarkersData.strMinAE100 = {en: "This script requires Adobe After Effects CS5 or later."};
	rd_RemoveMarkersData.strHelpText = 
	{
		en: "Copyright (c) 2007-2013 redefinery (Jeffrey R. Almasol). \n" +
		"All rights reserved.\n" +
		"\n" +
		"This script displays a palette with controls for removing layer-time markers from the selected layers.\n" +
		"\n" +
		"Note: This version of the script requires After Effects CS5 or later. It can be used as a dockable panel by placing the script in a ScriptUI Panels subfolder of the Scripts folder, and then choosing this script from the Window menu.\n" +
		"\n" +
		"Originally requested by Chris Meyer."
	};
	
	
	
	
	// rd_RemoveMarkers_localize()
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
	function rd_RemoveMarkers_localize(strVar)
	{
		return strVar["en"];
	}
	
	
	
	
	// rd_RemoveMarkers_buildUI()
	// 
	// Description:
	// This function builds the user interface.
	// 
	// Parameters:
	// thisObj - Panel object (if script is launched from Window menu); null otherwise.
	// 
	// Returns:
	// Window or Panel object representing the built user interface.
	//
	function rd_RemoveMarkers_buildUI(thisObj)
	{
		var pal = (thisObj instanceof Panel) ? thisObj : new Window("palette", rd_RemoveMarkersData.scriptName, undefined, {resizeable:true});
		
		if (pal !== null)
		{
			var res =
			"group { \
				orientation:'column', alignment:['fill','top'], \
				header: Group { \
					alignment:['fill','top'], \
					title: StaticText { text:'" + rd_RemoveMarkersData.scriptName + "', alignment:['fill','center'] }, \
					help: Button { text:'" + rd_RemoveMarkers_localize(rd_RemoveMarkersData.strHelp) +"', maximumSize:[30,20], alignment:['right','center'] }, \
				}, \
				main: Group { \
					alignment:['fill','top'], \
					markersToDel: StaticText { text:'" + rd_RemoveMarkers_localize(rd_RemoveMarkersData.strMarkersToDel) + "' }, \
					markersToDelList: DropDownList { properties:{ items:" + rd_RemoveMarkers_localize(rd_RemoveMarkersData.strMarkersToDelOpts) + " }, alignment:['fill','center'], preferredSize:[-1,20] }, \
				}, \
				cmds: Group { \
					alignment:['right','top'], \
					delMarkersBtn: Button { text:'" + rd_RemoveMarkers_localize(rd_RemoveMarkersData.strDelMarkers) + "', preferredSize:[-1,20] }, \
				}, \
			} \
			";
			pal.grp = pal.add(res);
			
			//var listItems = rd_RemoveMarkers_localize(rd_RemoveMarkersData.strMarkersToDelOpts);
			//for (var i=0; i<listItems.length; i++)
			//	pal.grp.main.markersToDelList.add("item", listItems[i]);
			pal.grp.main.markersToDelList.selection = 0;
			
			pal.layout.layout(true);
			pal.grp.minimumSize = pal.grp.size;
			pal.layout.resize();
			pal.onResizing = pal.onResize = function () {this.layout.resize();}
			
			pal.grp.header.help.onClick = function () {alert(rd_RemoveMarkersData.scriptTitle + "\n" + rd_RemoveMarkers_localize(rd_RemoveMarkersData.strHelpText), rd_RemoveMarkersData.scriptName);}
			pal.grp.cmds.delMarkersBtn.onClick = rd_RemoveMarkers_doRemoveMarkers;
		}
		
		return pal;
	}
	
	
	
	
	// rd_RemoveMarkers_removeMarkersFromLayer()
	// 
	// Description:
	// This function deletes the specified layer-time markers.
	// 
	// Parameters:
	//   comp - CompItem object representing the property group's composition.
	//   layer - Layer object representing the property group's layer.
	//   markersToDel - Integer representing the markers to delete.
	// 
	// Returns:
	// Nothing.
	//
	function rd_RemoveMarkers_removeMarkersFromLayer(comp, layer, markersToDel)
	{
		var markerStream = layer.property("Marker");
		if (markerStream === null)
			return;
		
		var tolerance = comp.frameDuration / 10.0;	// Slop for markers at specific times (start/end of layer, work area, or CTI)
		var compStart = comp.workAreaStart - tolerance;
		var compEnd = comp.workAreaStart + comp.workAreaDuration + tolerance;
		var layerStart = layer.inPoint - tolerance;
		var layerEnd = layer.outPoint + tolerance;
		var currTime = comp.time;
		var keyTime;
		
		// Adjust for negatively stretched layers
		if (layer.stretch < 0)
		{
			var temp = layerStart;
			layerStart = layerEnd;
			layerEnd = temp;
		}
		
		// Remove markers here -- from right to left for simplicity
		for (var k=markerStream.numKeys; k>0; k--)
		{
			keyTime = markerStream.keyTime(k);
			switch (markersToDel)
			{
				case 1:	// Inside Work Area
					if ((keyTime >= compStart) && (keyTime <= compEnd))
						markerStream.removeKey(k);
					break;
				case 2:	// Inside Layer In/Out
					if ((keyTime >= layerStart) && (keyTime <= layerEnd))
						markerStream.removeKey(k);
					break;
				case 3:	// Outside Layer In/Out
					if ((keyTime < layerStart) || (keyTime > layerEnd))
						markerStream.removeKey(k);
					break;
				case 4:	// Before/At Current Time
					if (keyTime <= (currTime + tolerance))
						markerStream.removeKey(k);
					break;
				case 5:	// At/After Current Time
					if (keyTime >= (currTime - tolerance))
						markerStream.removeKey(k);
					break;
				case 6:	// Odd-Numbered
					if ((k % 2) === 1)
						markerStream.removeKey(k);
					break;
				case 7:	// Even-Numbered
					if ((k % 2) === 0)
						markerStream.removeKey(k);
					break;
				case 0:	// All
				default:
						markerStream.removeKey(k);
					break;
			}
		}
	}
	
	
	
	
	// rd_RemoveMarkers_doRemoveMarkers()
	// 
	// Description:
	// This function performs the actual removal of markers.
	// 
	// Parameters:
	// None.
	// 
	// Returns:
	// Nothing.
	//
	function rd_RemoveMarkers_doRemoveMarkers()
	{
		var markersToDel = this.parent.parent.main.markersToDelList.selection.index;
		
		// Check that a project exists
		if (app.project === null)
			return;
		
		// Get the current (active/frontmost) comp
		var comp = app.project.activeItem;
		
		if ((comp === null) || !(comp instanceof CompItem))
		{
			alert(rd_RemoveMarkers_localize(rd_RemoveMarkersData.strErrNoCompSel), rd_RemoveMarkersData.scriptName);
			return;
		}
		
		// If no layers are selected, nothing to do
		if (comp.selectedLayers.length === 0)
		{
			alert(rd_RemoveMarkers_localize(rd_RemoveMarkersData.strErrNoLayerSel), rd_RemoveMarkersData.scriptName);
			return;
		}
		
		// Process the selected layers
		app.beginUndoGroup(rd_RemoveMarkersData.scriptName);
		
		var layers = comp.selectedLayers, layer;
		for (var i=0; i<layers.length; i++)
		{
			layer = layers[i];
			rd_RemoveMarkers_removeMarkersFromLayer(comp, layer, markersToDel);
		}
		
		app.endUndoGroup();
	}
	
	
	
	
	// main code:
	//
	
	// Prerequisites check
	if (parseFloat(app.version) < 10.0)
		alert(rd_RemoveMarkers_localize(rd_RemoveMarkersData.strMinAE100), rd_RemoveMarkersData.scriptName);
	else
	{
		// Build and show the console's floating palette
		var rdrkPal = rd_RemoveMarkers_buildUI(thisObj);
		if (rdrkPal !== null)
		{
			// Update UI values, if saved in the settings
			if (app.settings.haveSetting("redefinery", "rd_RemoveMarkers_markersToDel"))
				rdrkPal.grp.main.markersToDelList.selection = parseInt(app.settings.getSetting("redefinery", "rd_RemoveMarkers_markersToDel"));
			
			// Save current UI settings upon closing the palette
			rdrkPal.onClose = function()
			{
				app.settings.saveSetting("redefinery", "rd_RemoveMarkers_markersToDel", rdrkPal.grp.main.markersToDelList.selection.index);
			}
			
			if (rdrkPal instanceof Window)
			{
				// Show the palette
				rdrkPal.center();
				rdrkPal.show();
			}
			else
				rdrkPal.layout.layout(true);
		}
	}
})(this);
