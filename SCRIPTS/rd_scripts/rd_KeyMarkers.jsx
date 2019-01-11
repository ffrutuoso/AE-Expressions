// rd_KeyMarkers.jsx
// Copyright (c) 2006-2013 redefinery (Jeffrey R. Almasol). All rights reserved.
// check it: www.redefinery.com
// 
// Name: rd_KeyMarkers
// Version: 3.0
// 
// Description:
// This script displays a palette with controls for identifying the location
// of keyframes on a layer by using layer markers.
// 
// Note: The generated layer markers do not update automatically as you
// modify keyframes, but you can re-run this script to update them
// accordingly. Markers created by this script are identified by a Frame
// Target value of "redefinery" so that they can be updated accordingly.
// 
// If multiple keyframes exist at the same time, and you have selected to use
// a non-custom or non-keyframe time comment, the information for each keyframe
// will be separated by semicolons. However, marker comments are limited to 63
// characters.
// 
// Note: If placing markers on the top or selected layer, and the layer
// contains existing markers that you created, they will not be affected
// unless they exist at the same times as keyframes being identified.
// 
// Note: This version of the script requires After Effects CS5 
// or later. It can be used as a dockable panel by placing the 
// script in a ScriptUI Panels subfolder of the Scripts folder, 
// and then choosing this script from the Window menu.
// 
// Legal stuff:
// This script is provided "as is," without warranty of any kind, expressed
// or implied. In no event shall the author be held liable for any damages 
// arising in any way from the use of this script.
// 
// In other words, I'm just trying to share knowledge with and help out my
// fellow AE script heads, so don't blame me if my code doesn't rate. :-)




// rd_KeyMarkers()
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
(function rd_KeyMarkers(thisObj)
{
	// Globals
	
	var rd_KeyMarkersData = new Object();	// Store globals in an object
	rd_KeyMarkersData.scriptName = "rd: Key Markers";
	rd_KeyMarkersData.scriptTitle = rd_KeyMarkersData.scriptName + " v3.0";
	
	rd_KeyMarkersData.strKfsToId = {en: "Keyframes to Identify:"};
	rd_KeyMarkersData.strKfsToIdOpts = {en: '["Selected", "All in Work Area", "All in Composition"]'};
	rd_KeyMarkersData.strPlaceMarkers = {en: "Place Markers On:"};
	rd_KeyMarkersData.strPlaceMarkersOpts = {en: '["New Null Layer", "Top Layer", "Selected Layer"]'};
	rd_KeyMarkersData.strMarkerComment = {en: "Marker Comment:"};
	rd_KeyMarkersData.strMarkerCommentOpts = {en: '["Property Name", "Property Shortcut", "Keyframe Time", "Keyframe Value", "Prop Name = Key Value", "Custom Comment"]'};
	rd_KeyMarkersData.strCreate = {en: "Create Key Markers"};
	rd_KeyMarkersData.strMarkerId = "redefinery";	// Identifies created markers
	rd_KeyMarkersData.strHelp = {en: "?"};
	rd_KeyMarkersData.strErrNoWorkToDo = {en: "No operation to perform because no options are selected."};
	rd_KeyMarkersData.strErrNoCompSel = {en: "Cannot perform operation. Please select or open a single composition in the Project panel, and try again."};
	rd_KeyMarkersData.strErrNoLayerSel = {en: "Cannot perform operation. Please select at least one keyframe or a single layer, and try again."};
	rd_KeyMarkersData.strMinAE100 = {en: "This script requires Adobe After Effects CS5 or later."};
	rd_KeyMarkersData.strHelpText = 
	{
		en: "Copyright (c) 2006-2013 redefinery (Jeffrey R. Almasol). \n" +
		"All rights reserved.\n" +
		"\n" +
		"This script displays a palette with controls for identifying the location of keyframes on a layer by using layer markers. Markers created by this script are identified by a Frame Target value of \"redefinery\" so that they can be updated accordingly.\n" +
		"\n" +
		"Note: The generated layer markers do not update automatically as you modify keyframes, but you can re-run this script to update them accordingly.\n" +
		"\n" +
		"If multiple keyframes exist at the same time, and you have selected to use a non-custom or non-keyframe time comment, the information for each keyframe will be separated by semicolons. However, marker comments are limited to 63 characters.\n" +
		"\n" +
		"Note: If placing markers on the top or selected layer, and the layer contains existing markers that you created, they will not be affected unless they exist at the same times as keyframes being identified.\n" +
		"\n" +
		"Note: This version of the script requires After Effects CS5 or later. It can be used as a dockable panel by placing the script in a ScriptUI Panels subfolder of the Scripts folder, and then choosing this script from the Window menu."
	};
	
	// Associative array of property match names and their respective keyboard shortcuts
	rd_KeyMarkersData.propShortcuts =
	{
		"ADBE Anchor Point":			"A",
		"ADBE Audio Levels":			"L",
		//audio waveform:				"LL",
		//effects:								"E",
		"ADBE Mask Feather":		"F",
		"ADBE Mask Shape":			"M",
		"ADBE Mask Opacity":			"TT",
		//"ADBE Mask Offset":			"MM",	// for Mask Expansion
		//material options:				"AA",
		"ADBE Opacity":					"T",
		"ADBE Light Intensity":		"T",
		"ADBE Position":					"P",
		//paint effects:						"PP",
		"ADBE Rotate X":				"R",
		"ADBE Rotate Y":				"R",
		"ADBE Rotate Z":				"R",
		"ADBE Orientation":			"R",
		"ADBE Time Remapping":	"RR",
		"ADBE Scale":					"S",
	};
	
	
	
	
	// rd_KeyMarkers_localize()
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
	function rd_KeyMarkers_localize(strVar)
	{
		return strVar["en"];
	}
	
	
	
	
	// rd_KeyMarkers_buildUI()
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
	function rd_KeyMarkers_buildUI(thisObj)
	{
		var pal = (thisObj instanceof Panel) ? thisObj : new Window("palette", rd_KeyMarkersData.scriptName, undefined, {resizeable:true});
		
		if (pal !== null)
		{
			var res =
			"group { \
				orientation:'column', alignment:['fill','fill'], \
				header: Group { \
					alignment:['fill','top'], \
					title: StaticText { text:'" + rd_KeyMarkersData.scriptName + "', alignment:['fill','center'] }, \
					help: Button { text:'" + rd_KeyMarkers_localize(rd_KeyMarkersData.strHelp) +"', maximumSize:[30,20], alignment:['right','center'] }, \
				}, \
				kfsToId: Group { \
					alignment:['fill','top'], alignChildren:['fill','top'], \
					lbl: StaticText { text:'" + rd_KeyMarkers_localize(rd_KeyMarkersData.strKfsToId) + "', alignment:['left','center'] }, \
					lst: DropDownList { properties:{ items:" + rd_KeyMarkers_localize(rd_KeyMarkersData.strKfsToIdOpts) + ", alignment:['fill','center'] }, preferredSize:[-1,20] }, \
				}, \
				placeMarkers: Group { \
					alignment:['fill','top'], alignChildren:['fill','top'], \
					lbl: StaticText { text:'" + rd_KeyMarkers_localize(rd_KeyMarkersData.strPlaceMarkers) + "', alignment:['left','center'] }, \
					lst: DropDownList { properties:{ items:" + rd_KeyMarkers_localize(rd_KeyMarkersData.strPlaceMarkersOpts) + ", alignment:['fill','center'] }, preferredSize:[-1,20] }, \
				}, \
				markerComment: Group { \
					alignment:['fill','top'], alignChildren:['fill','top'], \
					lbl: StaticText { text:'" + rd_KeyMarkers_localize(rd_KeyMarkersData.strMarkerComment) + "', alignment:['left','center'] }, \
					lst: DropDownList { properties:{ items:" + rd_KeyMarkers_localize(rd_KeyMarkersData.strMarkerCommentOpts) + ", alignment:['fill','center'] }, preferredSize:[-1,20] }, \
				}, \
				markerCommentCustom: Group { \
					alignment:['fill','top'], alignChildren:['fill','top'], \
					gap: StaticText { text:'', alignment:['left','center'] }, \
					edt: EditText { text:'', alignment:['fill','center'], preferredSize:[-1,20] }, \
				}, \
				cmds: Group { \
					alignment:['right','top'], \
					createKeyMarkersBtn: Button { text:'" + rd_KeyMarkers_localize(rd_KeyMarkersData.strCreate) + "', preferredSize:[-1,20] }, \
				}, \
			} \
			";
			pal.grp = pal.add(res);
			
			pal.grp.placeMarkers.lbl.preferredSize = 
				pal.grp.markerComment.lbl.preferredSize = 
				pal.grp.markerCommentCustom.gap.preferredSize = pal.grp.kfsToId.lbl.preferredSize;
			pal.grp.markerCommentCustom.margins.top = -5;
			
			pal.grp.kfsToId.lst.selection = 0;
			pal.grp.placeMarkers.lst.selection = 2;
			pal.grp.markerComment.lst.selection = 4;
			
			pal.grp.markerComment.lst.onChange = function () {rd_KeyMarkers_checkIfCustomMarkerComment(this.parent.parent.parent);}
			
			pal.layout.layout(true);
			pal.grp.minimumSize = pal.grp.size;
			pal.layout.resize();
			pal.onResizing = pal.onResize = function () {this.layout.resize();}
			
			pal.grp.header.help.onClick = function () {alert(rd_KeyMarkersData.scriptTitle + "\n" + rd_KeyMarkers_localize(rd_KeyMarkersData.strHelpText), rd_KeyMarkersData.scriptName);}
			pal.grp.cmds.createKeyMarkersBtn.onClick = rd_KeyMarkers_doCreateKeyMarkers;
		}
		
		return pal;
	}
	
	
	
	
	// rd_KeyMarkers_checkIfCustomMarkerComment()
	// 
	// Description:
	// This function checks if the current settings should enable the
	// custom marker comment field.
	// 
	// Parameters:
	//   pal - Window object representing the palette.
	// 
	// Returns:
	// None.
	//
	function rd_KeyMarkers_checkIfCustomMarkerComment(pal)
	{
		pal.grp.markerCommentCustom.edt.enabled = (pal.grp.markerComment.lst.selection.index === 5);
	}
	
	
	
	
	// rd_KeyMarkers_markAllPropKeysInRange()
	// 
	// Description:
	// This function identifies the specified property's keyframes (within the
	// specified time range) as markers.
	// 
	// Parameters:
	//   propGroup - PropertyGroup object (initially, the Layer object) containing keyframes.
	//   startTime - Floating point number representing the start comp time (in seconds).
	//   endTime - Floating point number representing the end comp time (in seconds).
	// 
	// Returns:
	// Array of markers to create.
	//
	function rd_KeyMarkers_markAllPropKeysInRange(propGroup, startTime, endTime)
	{
		var prop, keyTime;
		var markers = new Array();
		
		// Iterate over the specified property group's properties
		for (var i=1; i<=propGroup.numProperties; i++)
		{
			prop = propGroup.property(i);
			if (prop.propertyType === PropertyType.PROPERTY)			// Found a property
			{
				if (prop.matchName === "ADBE Marker")				// Skip markers
					continue;
				if (prop.numKeys === 0)								// Skip properties that aren't keyframed
					continue;
				
				// Loop through the property's keys
				for (var j=1; j<=prop.numKeys; j++)
				{
					keyTime = prop.keyTime(j);
					
					// Skip keyframes outside of the specified range
					if ((keyTime < startTime) || (keyTime > endTime))
						continue;
					else
						markers[markers.length] = [prop, keyTime];
				}
			}
			else if (prop.propertyType === PropertyType.INDEXED_GROUP)	// Found an indexed group, so check its nested properties
				markers = markers.concat(rd_KeyMarkers_markAllPropKeysInRange(prop, startTime, endTime));
			else if (prop.propertyType === PropertyType.NAMED_GROUP)	// Found a named group, so check its nested properties
				markers = markers.concat(rd_KeyMarkers_markAllPropKeysInRange(prop, startTime, endTime));
		}
		
		return markers;
	}
	
	
	
	
	// rd_KeyMarkers_getSelectedPropGroupKeys()
	// 
	// Description:
	// This function retrieves the selected properties and keyframes (no markers) of the specified property group.
	// 
	// Parameters:
	//   propGroup - PropertyGroup object (initially, the Layer object) containing keyframes.
	// 
	// Returns:
	// Array of PropInfo objects representing properties and their selected key times.
	//
	function rd_KeyMarkers_getSelectedPropGroupKeys(propGroup)
	{
		var props = new Array();
		var prop, propInfo;
		
		// Iterate over the specified property group's properties
		for (var i=1; i<=propGroup.numProperties; i++)
		{
			prop = propGroup.property(i);
			if (prop.propertyType === PropertyType.PROPERTY)			// Found a property
			{
				if (prop.matchName === "ADBE Marker")				// Skip markers; they're processed separately
					continue;
				if (prop.numKeys === 0)								// Skip properties that aren't keyframed
					continue;
				
				propInfo = new Object;
				propInfo.prop = prop;
				propInfo.keyTimes = new Array();
				
				for (var j=1; j<=prop.numKeys; j++)
					if (prop.keySelected(j))
						propInfo.keyTimes[propInfo.keyTimes.length] = prop.keyTime(j);
				
				// If there were keys to save, add the property and its keys to the props array
				if (propInfo.keyTimes.length > 0)
					props[props.length] = propInfo;
			}
			else if (prop.propertyType === PropertyType.INDEXED_GROUP)	// Found an indexed group, so check its nested properties
				props = props.concat(rd_KeyMarkers_getSelectedPropGroupKeys(prop));
			else if (prop.propertyType === PropertyType.NAMED_GROUP)	// Found a named group, so check its nested properties
				props = props.concat(rd_KeyMarkers_getSelectedPropGroupKeys(prop));
		}
		
		return props;
	}
	
	
	
	
	// rd_KeyMarkers_markSelectedPropKeys()
	// 
	// Description:
	// This function identifies the specified property's selected keyframes
	// as markers.
	// 
	// Parameters:
	//   propGroup - PropertyGroup object (initially, the Layer object) containing keyframes.
	// 
	// Returns:
	// Array of markers to create.
	//
	function rd_KeyMarkers_markSelectedPropKeys(propGroup)
	{
		var props = rd_KeyMarkers_getSelectedPropGroupKeys(propGroup);
		var prop, propKeyTimes;
		var markers = new Array();
		
		for (var i=0; i<props.length; i++)
		{
			prop = props[i].prop;
			propKeyTimes = props[i].keyTimes;
			
			for (var j=0; j<propKeyTimes.length; j++)
				markers[markers.length] = [prop, propKeyTimes[j]];
		}
		
		return markers;
	}
	
	
	
	
	// rd_KeyMarkers_doCreateKeyMarkers()
	// 
	// Description:
	// This function performs the actual creation of markers.
	// 
	// Parameters:
	// None.
	// 
	// Returns:
	// Nothing.
	//
	function rd_KeyMarkers_doCreateKeyMarkers()
	{
		var kfsToId = this.parent.parent.kfsToId.lst.selection.index;
		var placeMarkers = this.parent.parent.placeMarkers.lst.selection.index;
		var markerComment = this.parent.parent.markerComment.lst.selection.index;
		var markerCommentCustom = this.parent.parent.markerCommentCustom.edt.text;
		
		// Check that a project exists
		if (app.project === null)
			return;
		
		// Get the current (active/frontmost) comp
		var comp = app.project.activeItem;
		
		if ((comp === null) || !(comp instanceof CompItem))
		{
			alert(rd_KeyMarkers_localize(rd_KeyMarkersData.strErrNoCompSel), rd_KeyMarkersData.scriptName);
			return;
		}
		
		// If no single layer is selected, nothing to do
		if (comp.selectedLayers.length !== 1)
		{
			alert(rd_KeyMarkers_localize(rd_KeyMarkersData.strErrNoLayerSel), rd_KeyMarkersData.scriptName);
			return;
		}
		
		// Process the selected layer
		app.beginUndoGroup(rd_KeyMarkersData.scriptName);
		
		var layer = comp.selectedLayers[0];
		var prop, startTime, endTime, markers;
		
		// Need to get key times before creating possible new marker layer because doing such
		// deselects selected keys. D'oh!
		markers = new Array();		// Reset the list of markers to create
		
		if (kfsToId === 0)			// Selected
			markers = rd_KeyMarkers_markSelectedPropKeys(layer);
		else
		{
			// Determine the comp time range to scan for keyframes
			if (kfsToId === 1)		// All lin Work Area
			{
				startTime = comp.workAreaStart;
				endTime = comp.workAreaStart + comp.workAreaDuration;
			}
			else if (kfsToId === 2)	// All in Composition
			{
				startTime = 0;
				endTime = comp.duration;
			}
			
			// Recursively check the layer's properties for keyframes within a specific range
			markers = rd_KeyMarkers_markAllPropKeysInRange(layer, startTime, endTime);
		}
		
		// Create markers on marker layer
		if (markers.length > 0)
		{
			var markerStream, markerLayer, markerProp, markerTime, markerValue, comment, newMarkerComment, nearestKeyIndex;
			
			if (placeMarkers === 0)			// New Null Layer
				markerLayer = comp.layers.addNull(comp.duration);
			else if (placeMarkers === 1)		// Top Layer
				markerLayer = comp.layer(1);
			else if (placeMarkers === 2)		// Selected Layer
				markerLayer = layer;
			markerStream = markerLayer.property("Marker");
			
			// Remove markers for any previously created (tagged) markers
			for (var i=markerStream.numKeys; i>=1; i--)
			{
				markerValue = markerStream.keyValue(i);
				if (markerValue.frameTarget === rd_KeyMarkersData.strMarkerId)
					markerStream.removeKey(i);
			}
			
			// Loop through the marker times
			for (var i=0; i<markers.length; i++)
			{
				// Create a marker on the marker layer
				try
				{
					markerProp = markers[i][0];
					markerTime = markers[i][1];
					
					// Determine the marker comment to use
					switch (markerComment)
					{
						case 0:				// Property Name
							comment = markerProp.name;
							break;
						case 1:				// Property Shortcut
							comment = rd_KeyMarkersData.propShortcuts[markerProp.matchName];
							if (comment === undefined)
								comment = "";
							break;
						case 2:				// Keyframe Time
							comment = timeToCurrentFormat(markerTime, comp.frameRate);
							break;
						case 3:				// Keyframe Value
							comment = markerProp.valueAtTime(markerTime, false).toString();
							break;
						case 4:				// Prop Name = Key Value
							comment = markerProp.name + "=" + markerProp.valueAtTime(markerTime, false).toString();
							break;
						case 5:				// Custom Comment
							comment = markerCommentCustom;
							break;
						default:
							comment = "";
							break;
					}
					
					// If existing tagged marker is at the same time, append comment to it
					if (markerStream.numKeys > 0)
					{
						nearestKeyIndex = markerStream.nearestKeyIndex(markerTime);
						if (markerStream.keyTime(nearestKeyIndex) === markerTime)
						{
							markerValue = markerStream.keyValue(nearestKeyIndex);
							if (markerValue.frameTarget === rd_KeyMarkersData.strMarkerId)
							{
								// Don't include comma if using custom comment, keyframe time, or comment is blank
								if ((markerComment === 5) || (markerComment === 2) || (comment === ""))
									comment = markerValue.comment;
								else
								{
									// If existing comment is blank, don't include semicolon
									if (markerValue.comment !== "")
										comment = markerValue.comment + "; " + comment;
								}
							}
							newMarkerComment = new MarkerValue(comment.substr(0,63), markerValue.chapter, markerValue.url, rd_KeyMarkersData.strMarkerId);
						}
						else
							newMarkerComment = new MarkerValue(comment.substr(0,63), "", "", rd_KeyMarkersData.strMarkerId);
					}
					else
						newMarkerComment = new MarkerValue(comment.substr(0,63), "", "", rd_KeyMarkersData.strMarkerId);
					
					// Create/update the layer marker
					markerStream.setValueAtTime(markerTime, newMarkerComment);
				}
				catch (e)
				{}
			}
		}
		
		app.endUndoGroup();
	}
	
	
	
	
	// main code:
	//
	
	// Prerequisites check
	if (parseFloat(app.version) < 10.0)
		alert(rd_KeyMarkers_localize(rd_KeyMarkersData.strMinAE100), rd_KeyMarkersData.scriptName);
	else
	{
		// Build and show the console's floating palette
		var rdkmPal = rd_KeyMarkers_buildUI(thisObj);
		if (rdkmPal !== null)
		{
			// Update UI values, if saved in the settings
			if (app.settings.haveSetting("redefinery", "rd_KeyMarkers_kfsToId"))
				rdkmPal.grp.kfsToId.lst.selection = parseInt(app.settings.getSetting("redefinery", "rd_KeyMarkers_kfsToId"));
			if (app.settings.haveSetting("redefinery", "rd_KeyMarkers_placeMarkers"))
				rdkmPal.grp.placeMarkers.lst.selection = parseInt(app.settings.getSetting("redefinery", "rd_KeyMarkers_placeMarkers"));
			if (app.settings.haveSetting("redefinery", "rd_KeyMarkers_markerComment"))
				rdkmPal.grp.markerComment.lst.selection = parseInt(app.settings.getSetting("redefinery", "rd_KeyMarkers_markerComment"));
			rd_KeyMarkers_checkIfCustomMarkerComment(rdkmPal);
			
			// Save current UI settings upon closing the palette
			rdkmPal.onClose = function()
			{
				app.settings.saveSetting("redefinery", "rd_KeyMarkers_kfsToId", rdkmPal.grp.kfsToId.lst.selection.index);
				app.settings.saveSetting("redefinery", "rd_KeyMarkers_placeMarkers", rdkmPal.grp.placeMarkers.lst.selection.index);
				app.settings.saveSetting("redefinery", "rd_KeyMarkers_markerComment", rdkmPal.grp.markerComment.lst.selection.index);
			}
			
			if (rdkmPal instanceof Window)
			{
				// Show the palette
				rdkmPal.center();
				rdkmPal.show();
			}
			else
				rdkmPal.layout.layout(true);
		}
	}
})(this);
