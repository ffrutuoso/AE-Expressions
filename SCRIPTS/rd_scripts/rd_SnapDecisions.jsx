// rd_SnapDecisions.jsx
// Copyright (c) 2007-2015 redefinery (Jeffrey R. Almasol). All rights reserved.
// check it: www.redefinery.com
// 
// Name: rd_SnapDecisions
// Version: 1.2
// 
// Description:
// This script displays a palette with controls for snapping keyframes
// (all on a layer), layer markers, and even layer in/out points (by trimming)
// to frame times based on the composition's frame rate. When not on a frame 
// boundary, they can be snapped to the nearest, previous, or next frame.
// 
// Note: This version of the script requires After Effects CS5 
// or later. It can be used as a dockable panel by placing the 
// script in a ScriptUI Panels subfolder of the Scripts folder, 
// and then choosing this script from the Window menu.
// 
// Enhancements requested by Kevin Snyder.
//
// Legal stuff:
// This script is provided "as is," without warranty of any kind, expressed
// or implied. In no event shall the author be held liable for any damages 
// arising in any way from the use of this script.
// 
// In other words, I'm just trying to share knowledge with and help out my
// fellow AE script heads, so don't blame me if my code doesn't rate. :-)




// rd_SnapDecisions()
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
(function rd_SnapDecisions(thisObj)
{
	// Globals
	
	var rd_SnapDecisionsData = new Object();	// Store globals in an object
	rd_SnapDecisionsData.scriptName = "rd: Snap Decisions";
	rd_SnapDecisionsData.scriptTitle = rd_SnapDecisionsData.scriptName + " v1.2";
	
	rd_SnapDecisionsData.strSnapLbl = {en: "Snap:"};
	rd_SnapDecisionsData.strLayerIOLbl = {en: "Layer In/Out Points (Trim)"};
	rd_SnapDecisionsData.strKfsLbl = {en: "Keyframes"};
	//rd_SnapDecisionsData.strKfsOpts = {en: ["Selected Properties", "All Properties"]};
	rd_SnapDecisionsData.strLayerMarkersLbl = {en: "Layer Markers"};
	rd_SnapDecisionsData.strToLbl = {en: "To:"};
	rd_SnapDecisionsData.strToOpts = {en: ["Nearest Frame", "Previous Frame", "Next Frame"]};
	rd_SnapDecisionsData.strAffectLbl = {en: "On:"};
	rd_SnapDecisionsData.strAffectOpts = {en: ["Selected Layers in Comp", "All Layers in Comp"]};
    rd_SnapDecisionsData.strSnap = {en: "Snap"};
	rd_SnapDecisionsData.strHelp = {en: "?"};
	rd_SnapDecisionsData.strErrNoCompSel = {en: "Cannot perform operation. Please select or open a single composition in the Project panel, and try again."};
	rd_SnapDecisionsData.strErrNoLayerSel = {en: "Cannot perform operation. Please select at least one layer, and try again."};
	rd_SnapDecisionsData.strMinAE100 = {en: "This script requires Adobe After Effects CS5 or later."};
	rd_SnapDecisionsData.strHelpText = 
	{
		en: "Copyright (c) 2007-2015 redefinery (Jeffrey R. Almasol). \n" +
		"All rights reserved.\n" +
		"\n" +
		"This script displays a palette with controls for snapping keyframes (all on a layer), layer markers, and even layer in/out points (by trimming) to frame times based on the composition's frame rate. When not on a frame boundary, they can be snapped to the nearest, previous, or next frame.\n" +
		"\n" +
		"Note: This version of the script requires After Effects CS5 or later. It can be used as a dockable panel by placing the script in a ScriptUI Panels subfolder of the Scripts folder, and then choosing this script from the Window menu.\n" +
		"\n" +
		"Enhancements requested by Kevin Snyder."
	};
	
	
	
	
	// rd_SnapDecisions_localize()
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
	function rd_SnapDecisions_localize(strVar)
	{
		return strVar["en"];
	}
	
	
	
	
	// rd_SnapDecisions_buildUI()
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
	function rd_SnapDecisions_buildUI(thisObj)
	{
		var pal = (thisObj instanceof Panel) ? thisObj : new Window("palette", rd_SnapDecisionsData.scriptName, undefined, {resizeable:true});
		
		if (pal !== null)
		{
			var res = 
			"""group { 
				orientation:'column', alignment:['fill','top'], alignChildren:['fill','top'], 
				header: Group { 
					alignment:['fill','top'], 
					title: StaticText { text:'""" + rd_SnapDecisionsData.scriptName + """', alignment:['fill','center'] }, 
					help: Button { text:'""" + rd_SnapDecisions_localize(rd_SnapDecisionsData.strHelp) + """', maximumSize:[30,20], alignment:['right','center'] }, 
				}, 
				layerIO: Group {
					orientation:'row', alignChildren:['fill','center'], 
					snapLbl: StaticText { text:'""" + rd_SnapDecisions_localize(rd_SnapDecisionsData.strSnapLbl) + """', alignment:['left','top'] },
					lbl: Checkbox { text:'""" + rd_SnapDecisions_localize(rd_SnapDecisionsData.strLayerIOLbl) + """', alignment:['left','top'], value:true },
				}, 
				kfs: Group {
					orientation:'row', alignChildren:['fill','center'],
					spacer: Group { alignment:['left','center'] },
					lbl: Checkbox { text:'""" + rd_SnapDecisions_localize(rd_SnapDecisionsData.strKfsLbl) + """', alignment:['left','center'], value:true },
				}, 
				layerMarkers: Group {
					orientation:'row', alignChildren:['fill','center'],
					spacer: Group { alignment:['left','center'] },
					lbl: Checkbox { text:'""" + rd_SnapDecisions_localize(rd_SnapDecisionsData.strLayerMarkersLbl) + """', alignment:['left','center'], value:true },
				}, 
				snapTo: Group {
					lbl: StaticText { text:'""" + rd_SnapDecisions_localize(rd_SnapDecisionsData.strToLbl) + """', alignment:['left','center'] },
					lst: DropDownList { properties:{ }, alignment:['fill','center'], preferredSize:[-1,20] }, 
				}, 
				affectLayers: Group {
					lbl: StaticText { text:'""" + rd_SnapDecisions_localize(rd_SnapDecisionsData.strAffectLbl) + """', alignment:['left','center'] },
					lst: DropDownList { properties:{ }, alignment:['fill','center'], preferredSize:[-1,20] }, 
				}, 
				btns: Group { 
					alignment:['right','bottom'], 
					snap: Button { text:'""" + rd_SnapDecisions_localize(rd_SnapDecisionsData.strSnap) + """', preferredSize:[-1,20] }, 
				}, 
			}""";
			pal.grp = pal.add(res);
			
			//var listItems = rd_SnapDecisions_localize(rd_SnapDecisionsData.strKfsOpts);
			//for (var i=0; i<listItems.length; i++)
			//	pal.grp.kfs.lst.add("item", listItems[i]);
			//pal.grp.kfs.lst.selection = 1;
			var listItems = rd_SnapDecisions_localize(rd_SnapDecisionsData.strToOpts);
			for (var i=0; i<listItems.length; i++)
				pal.grp.snapTo.lst.add("item", listItems[i]);
			pal.grp.snapTo.lst.selection = 0;
			var listItems = rd_SnapDecisions_localize(rd_SnapDecisionsData.strAffectOpts);
			for (var i=0; i<listItems.length; i++)
				pal.grp.affectLayers.lst.add("item", listItems[i]);
			pal.grp.affectLayers.lst.selection = 0;
			
			pal.grp.affectLayers.lbl.preferredSize.width = pal.grp.snapTo.lbl.preferredSize.width = pal.grp.kfs.spacer.preferredSize.width = pal.grp.layerMarkers.spacer.preferredSize.width = pal.grp.layerIO.snapLbl.preferredSize.width;
			
			pal.layout.layout(true);
			pal.grp.minimumSize = pal.grp.size;
			pal.layout.resize();
			pal.onResizing = pal.onResize = function () {this.layout.resize();}
			
			//pal.grp.kfs.lbl.onClick = function ()
			//{
			//	this.parent.lst.enabled = this.value;
			//}
			pal.grp.btns.snap.onClick = function () {rd_SnapDecisions_doSnap(pal);}
			pal.grp.header.help.onClick = function () {alert(rd_SnapDecisionsData.scriptTitle + "\n" + rd_SnapDecisions_localize(rd_SnapDecisionsData.strHelpText), rd_SnapDecisionsData.scriptName);}
		}
		
		return pal;
	}
	
		
	
	
	// rd_SnapDecisions_captureKeys()
	// 
	// Description:
	// This function retrieves a property's keys as an array.
	// 
	// Parameters:
	//   prop - The property that has keys.
	// 
	// Returns:
	// Array of property info (object)
	//
	function rd_SnapDecisions_captureKeys(prop)
	{
		var keys = new Array(), key;
		
		for (var i=1; i<=prop.numKeys; i++)
		{
			keys[i-1] = {
				time: prop.keyTime(i),
				value: prop.keyValue(i),
				inInterp: prop.keyInInterpolationType(i),
				outInterp: prop.keyOutInterpolationType(i),
				tempAutoBezier: prop.keyTemporalAutoBezier(i),
				tempContBezier: prop.keyTemporalContinuous(i),
				inTempEase: prop.keyInTemporalEase(i),
				outTempEase: prop.keyOutTemporalEase(i),
			}
			if ((prop.propertyValueType === PropertyValueType.TwoD_SPATIAL) || (prop.propertyValueType === PropertyValueType.ThreeD_SPATIAL))
			{
				keys[i-1]["spatAutoBezier"] = prop.keySpatialAutoBezier(i);
				keys[i-1]["spatContBezier"] = prop.keySpatialContinuous(i);
				keys[i-1]["inSpatTangent"] = prop.keyInSpatialTangent(i);
				keys[i-1]["outSpatTangent"] = prop.keyOutSpatialTangent(i);
				keys[i-1]["roving"] = prop.keyRoving(i);
			}
		}
		
		return keys;
	}
	
	
	
	
	// rd_SnapDecisions_snapProp()
	// 
	// Description:
	// This function performs the actual snapping operation on a layer's properties.
	// 
	// Parameters:
	//   comp - CompItem object representing the composition.
	//   prop - Property object containing keyframes.
	//   snapTo - In what direction to snap.
	// 
	// Returns:
	// Nothing.
	//
	function rd_SnapDecisions_snapProp(comp, prop, snapTo)
	{
		var oldKeys, oldK, frameOffset;
		var frameDuration = comp.frameDuration, halfFrameDuration = frameDuration/2.0;
		
		// Capture the current keyframes
		oldKeys = rd_SnapDecisions_captureKeys(prop);
		
		// Remove the current keyframes
		while (prop.numKeys > 0)
			prop.removeKey(1);
		
		// Snap keyframe times
		for (var k=0; k<oldKeys.length; k++)
		{
			oldK = oldKeys[k];
			
			// Find the nearest frame time (i.e., round to nearest time)
			frameOffset = oldK.time % frameDuration;
			//$.writeln("old="+oldK.time+", offset="+frameOffset);
			if (frameOffset > 0.0001)	// Hopefully enough slop needed for "exact" frame values
			{
				if (snapTo === 1)		// Previous Frame
					oldK.time -= frameOffset;
				else if (snapTo === 2)	// Next Frame
					oldK.time += (frameDuration - frameOffset);
				else if (snapTo === 0)	// Nearest Frame
				{
					if (frameOffset < halfFrameDuration)
						oldK.time -= frameOffset;
					else
						oldK.time += (frameDuration - frameOffset);
				}
			}
			
			prop.setValueAtTime(oldK.time, oldK.value);
			
			// Restore old key's characteristics
			if (oldK.outInterp !== KeyframeInterpolationType.HOLD)
				prop.setTemporalEaseAtKey(k+1, oldK.inTempEase, oldK.outTempEase);
			
			prop.setInterpolationTypeAtKey(k+1, oldK.inInterp, oldK.outInterp);
			
			if ((oldK.inInterp === KeyframeInterpolationType.BEZIER) && (oldK.outInterp === KeyframeInterpolationType.BEZIER) && oldK.tempContBezier)
			{
				prop.setTemporalContinuousAtKey(k+1, oldK.tempContBezier);
				prop.setTemporalAutoBezierAtKey(k+1, oldK.tempAutoBezier);		// Implies Continuous, so do after it
			}
			
			if ((prop.propertyValueType === PropertyValueType.TwoD_SPATIAL) || (prop.propertyValueType === PropertyValueType.ThreeD_SPATIAL))
			{
				prop.setSpatialContinuousAtKey(k+1, oldK.spatContBezier);
				prop.setSpatialAutoBezierAtKey(k+1, oldK.spatAutoBezier);		// Implies Continuous, so do after it

				prop.setSpatialTangentsAtKey(k+1, oldK.inSpatTangent, oldK.outSpatTangent);

				prop.setRovingAtKey(k+1, oldK.roving);
			}
		}
	}
	
	
	
	
	// rd_SnapDecisions_snapLayerProps()
	// 
	// Description:
	// This function performs the actual snapping operation on a layer's properties.
	// 
	// Parameters:
	//   comp - CompItem object representing the composition.
	//   propGroup - PropertyGroup object (initially, the Layer object) containing keyframes.
	//   doKeys - Whether to snap keyframes.
	//   doMarkers - Whether to snap layer markers.
	//   snapTo - In what direction to snap.
	// 
	// Returns:
	// Nothing.
	//
	function rd_SnapDecisions_snapLayerProps(comp, propGroup, doKeys, doMarkers, snapTo)
	{
		var prop, newTime, newValue, keyIndex;
		
		// Iterate over the specified property group's properties
		for (var i=1; i<=propGroup.numProperties; i++)
		{
			prop = propGroup.property(i);
			if (prop.propertyType === PropertyType.PROPERTY)			// Found a property
			{
				if (!doKeys && (prop.matchName !== "ADBE Marker"))	// Skip keyframes if not needed
					continue;
				if (!doMarkers && (prop.matchName === "ADBE Marker"))	// Skip markers if not needed
					continue;
				if (prop.numKeys === 0)							// Skip properties that aren't keyframed
					continue;
				
				if (prop.isSeparationLeader && prop.dimensionsSeparated)	// Skip Position property when dimensions are separated
					continue;
				
				rd_SnapDecisions_snapProp(comp, prop, snapTo);
			}
			else if (prop.propertyType === PropertyType.INDEXED_GROUP)	// Found an indexed group, so check its nested properties
				rd_SnapDecisions_snapLayerProps(comp, prop, doKeys, doMarkers, snapTo);
			else if (prop.propertyType === PropertyType.NAMED_GROUP)	// Found a named group, so check its nested properties
				rd_SnapDecisions_snapLayerProps(comp, prop, doKeys, doMarkers, snapTo);
		}
	}
	
	
	
	
	// rd_SnapDecisions_doSnap()
	// 
	// Description:
	// This function performs the actual snapping operation.
	// 
	// Parameters:
	//   pal - The palette (Window object) itself.
	// 
	// Returns:
	// Nothing.
	//
	function rd_SnapDecisions_doSnap(pal)
	{
		var layerIO = pal.grp.layerIO.lbl.value, kfs = pal.grp.kfs.lbl.value, layerMarkers = pal.grp.layerMarkers.lbl.value, snapTo = pal.grp.snapTo.lst.selection.index, affectLayers = pal.grp.affectLayers.lst.selection.index;
		//var kfsOpt = pal.grp.kfs.lst.selection.index;
		
		// Check that a project exists
		if (app.project === null)
			return;
		
		// Get the current (active/frontmost) comp
		var comp = app.project.activeItem;
		
		if ((comp === null) || !(comp instanceof CompItem))
		{
			alert(rd_SnapDecisions_localize(rd_SnapDecisionsData.strErrNoCompSel), rd_SnapDecisionsData.scriptName);
			return;
		}
		
		// Get the layers to update
		if (affectLayers === 1)
		{
			// Get all layers into an array (blah)
			var layers = new Array();
			for (var i=1; i<=comp.numLayers; i++)
				layers[layers.length] = comp.layer(i);
		}
		else
		{
			var layers = comp.selectedLayers;
			if (layers.length === 0)
			{
				alert(rd_SnapDecisions_localize(rd_SnapDecisionsData.strErrNoLayerSel), rd_SnapDecisionsData.scriptName);
				return;
			}
		}
		
		// Process each intended layer
		app.beginUndoGroup(rd_SnapDecisionsData.scriptName);
		
		var frameOffset, frameDuration = comp.frameDuration, halfFrameDuration = frameDuration / 2.0, doubleFrameDuration = frameDuration * 2.0;
		var layer, inTime, outTime;
		
		for (var i=0; i<layers.length; i++)
		{
			layer = layers[i];
			
			// Process layer in/out
			if (layerIO)
			{
				inTime = layer.inPoint;
				outTime = layer.outPoint;
				//$.writeln("frameDur="+frameDuration);
				
				frameOffset = inTime % frameDuration;
				//$.writeln("oldIn="+inTime+", offset="+frameOffset);
				if (frameOffset > 0.0001) //doubleFrameDuration)// 0.0001)	// Hopefully enough slop needed for "exact" frame values
				{
					if (snapTo === 1)		// Previous Frame
						inTime -= frameOffset;
					else if (snapTo === 2)	// Next Frame
						inTime += (frameDuration - frameOffset);
					else if (snapTo === 0)	// Nearest Frame
					{
						if (frameOffset < halfFrameDuration)
							inTime -= frameOffset;
						else
							inTime += (frameDuration - frameOffset);
					}
				}
				
				frameOffset = outTime % frameDuration;
				//$.writeln("oldOut="+outTime+", offset="+frameOffset);
				if (frameOffset > 0.0001) //doubleFrameDuration)// 0.0001)	// Hopefully enough slop needed for "exact" frame values
				{
					if (snapTo === 1)		// Previous Frame
						outTime -= frameOffset;
					else if (snapTo === 2)	// Next Frame
						outTime += (frameDuration - frameOffset);
					else if (snapTo === 0)	// Nearest Frame
					{
						if (frameOffset < halfFrameDuration)
							outTime -= frameOffset;
						else
							outTime += (frameDuration - frameOffset);
					}
				}
				
				layer.inPoint = inTime;
				layer.outPoint = outTime;
			}
			
			// Process keys
			rd_SnapDecisions_snapLayerProps(comp, layer, kfs, layerMarkers, snapTo);
		}
		
		app.endUndoGroup();
	}
	
	
	
	
	// main code:
	//
	
	// Prerequisites check
	if (parseFloat(app.version) < 10.0)
		alert(rd_SnapDecisions_localize(rd_SnapDecisionsData.strMinAE100), rd_SnapDecisionsData.scriptName);
	else
	{
		// Build and show the console's floating palette
		var rdsdPal = rd_SnapDecisions_buildUI(thisObj);
		if (rdsdPal !== null)
		{
			// Update UI values, if saved in the settings
			if (app.settings.haveSetting("redefinery", "rd_SnapDecisions_layerIO"))
				rdsdPal.grp.layerIO.lbl.value = (app.settings.getSetting("redefinery", "rd_SnapDecisions_layerIO") === "false") ? false : true;
			if (app.settings.haveSetting("redefinery", "rd_SnapDecisions_kfs"))
				rdsdPal.grp.kfs.lbl.value = (app.settings.getSetting("redefinery", "rd_SnapDecisions_kfs") === "false") ? false : true;
			if (app.settings.haveSetting("redefinery", "rd_SnapDecisions_layerMarkers"))
				rdsdPal.grp.layerMarkers.lbl.value = (app.settings.getSetting("redefinery", "rd_SnapDecisions_layerMarkers") === "false") ? false : true;
			if (app.settings.haveSetting("redefinery", "rd_SnapDecisions_snapTo"))
				rdsdPal.grp.snapTo.lst.selection = parseInt(app.settings.getSetting("redefinery", "rd_SnapDecisions_snapTo"), 10);
			if (app.settings.haveSetting("redefinery", "rd_SnapDecisions_affectLayers"))
				rdsdPal.grp.affectLayers.lst.selection = parseInt(app.settings.getSetting("redefinery", "rd_SnapDecisions_affectLayers"), 10);
			
			// Save current UI settings upon closing the palette
			rdsdPal.onClose = function()
			{
				app.settings.saveSetting("redefinery", "rd_SnapDecisions_layerIO", rdsdPal.grp.layerIO.lbl.value);
				app.settings.saveSetting("redefinery", "rd_SnapDecisions_kfs", rdsdPal.grp.kfs.lbl.value);
				app.settings.saveSetting("redefinery", "rd_SnapDecisions_layerMarkers", rdsdPal.grp.layerMarkers.lbl.value);
				app.settings.saveSetting("redefinery", "rd_SnapDecisions_snapTo", rdsdPal.grp.snapTo.lst.selection.index);
				app.settings.saveSetting("redefinery", "rd_SnapDecisions_affectLayers", rdsdPal.grp.affectLayers.lst.selection.index);
			}
			
			if (rdsdPal instanceof Window)
			{
				// Show the palette
				rdsdPal.center();
				rdsdPal.show();
			}
			else
				rdsdPal.layout.layout(true);
		}
	}
})(this);
