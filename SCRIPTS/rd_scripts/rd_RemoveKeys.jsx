// rd_RemoveKeys.jsx
// Copyright (c) 2006-2013 redefinery (Jeffrey R. Almasol). All rights reserved.
// check it: www.redefinery.com
// 
// Name: rd_RemoveKeys
// Version: 3.0
// 
// Description:
// This script displays a palette with controls for removing keyframes from
// the selected layers.
// 
// Note: Keyframes are removed from right to left.
// 
// Note: This version of the script requires After Effects 
// CS5 or later. It can be used as a dockable panel by 
// placing the script in a ScriptUI Panels subfolder of 
// the Scripts folder, and then choosing this script 
// from the Window menu.
// 
// Originally requested by Gary Jaeger.
// Enhancements requested by Phil Spitler.
// 
// Legal stuff:
// This script is provided "as is," without warranty of any kind, expressed
// or implied. In no event shall the author be held liable for any damages 
// arising in any way from the use of this script.
// 
// In other words, I'm just trying to share knowledge with and help out my
// fellow AE script heads, so don't blame me if my code doesn't rate. :-)




// rd_RemoveKeys()
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
(function rd_RemoveKeys(thisObj)
{
	// Globals
	
	var rd_RemoveKeysData = new Object();	// Store globals in an object
	rd_RemoveKeysData.scriptName = "rd: Remove Keys";
	rd_RemoveKeysData.scriptTitle = rd_RemoveKeysData.scriptName + " v3.0";
	
	rd_RemoveKeysData.strKfsToDel = {en: "Keyframes to Remove:"};
	rd_RemoveKeysData.strKfsToDelOpts = {en: ["All", "Inside Work Area", "Inside Layer In/Out", "Outside Layer In/Out", "Before/At Current Time", "At/After Current Time", "Odd-Numbered", "Even-Numbered"]};
	rd_RemoveKeysData.strDelKeys = {en: "Remove Keyframes"};
	rd_RemoveKeysData.strHelp = {en: "?"};
	rd_RemoveKeysData.strErrNoCompSel = {en: "Cannot perform operation. Please select or open a single composition in the Project panel, and try again."};
	rd_RemoveKeysData.strErrNoLayerSel = {en: "Cannot perform operation. Please select at least one layer, and try again."};
	rd_RemoveKeysData.strMinAE100 = {en: "This script requires Adobe After Effects CS5 or later."};
	rd_RemoveKeysData.strHelpText = 
	{
		en: "Copyright (c) 2006-2013 redefinery (Jeffrey R. Almasol). \n" +
		"All rights reserved.\n" +
		"\n" +
		"This script displays a palette with controls for removing keyframes from the selected layers.\n" +
		"\n" +
		"Note: Keyframes are removed from right to left.\n" +
		"\n" +
		"Note: This version of the script requires After Effects CS5 or later. It can be used as a dockable panel by placing the script in a ScriptUI Panels subfolder of the Scripts folder, and then choosing this script from the Window menu.\n" +
		"\n" +
		"Originally requested by Gary Jaeger.\n" + 
		"Enhancements requested by Phil Spitler."
	};
	
	
	
	
	// rd_RemoveKeys_localize()
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
	function rd_RemoveKeys_localize(strVar)
	{
		return strVar["en"];
	}
	
	
	
	
	// rd_RemoveKeys_buildUI()
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
	function rd_RemoveKeys_buildUI(thisObj)
	{
		var pal = (thisObj instanceof Panel) ? thisObj : new Window("palette", rd_RemoveKeysData.scriptName, undefined, {resizeable:true});
		
		if (pal !== null)
		{
			var res =
			"group { \
				orientation:'column', alignment:['fill','top'], \
				header: Group { \
					alignment:['fill','top'], \
					title: StaticText { text:'" + rd_RemoveKeysData.scriptName + "', alignment:['fill','center'] }, \
					help: Button { text:'" + rd_RemoveKeys_localize(rd_RemoveKeysData.strHelp) +"', maximumSize:[30,20], alignment:['right','center'] }, \
				}, \
				main: Group { \
					alignment:['fill','top'], \
					kfsToDel: StaticText { text:'" + rd_RemoveKeys_localize(rd_RemoveKeysData.strKfsToDel) + "' }, \
					kfsToDelList: DropDownList { properties:{ }, alignment:['fill','center'], preferredSize:[-1,20] }, \
				}, \
				cmds: Group { \
					alignment:['right','top'], \
					delKeysBtn: Button { text:'" + rd_RemoveKeys_localize(rd_RemoveKeysData.strDelKeys) + "', preferredSize:[-1,20] }, \
				}, \
			} \
			";
			pal.grp = pal.add(res);
			
			var listItems = rd_RemoveKeys_localize(rd_RemoveKeysData.strKfsToDelOpts);
			for (var i=0; i<listItems.length; i++)
				pal.grp.main.kfsToDelList.add("item", listItems[i]);
			pal.grp.main.kfsToDelList.selection = 0;
			
			pal.layout.layout(true);
			pal.grp.minimumSize = pal.grp.size;
			pal.layout.resize();
			pal.onResizing = pal.onResize = function () {this.layout.resize();}
			
			pal.grp.header.help.onClick = function () {alert(rd_RemoveKeysData.scriptTitle + "\n" + rd_RemoveKeys_localize(rd_RemoveKeysData.strHelpText), rd_RemoveKeysData.scriptName);}
			pal.grp.cmds.delKeysBtn.onClick = rd_RemoveKeys_doRemoveKeys;
		}
		
		return pal;
	}
	
	
	
	
	// rd_RemoveKeys_removeKeysFromPropGroup()
	// 
	// Description:
	// This function iterates over a property's children properties, deleting 
	// the specified keyframes.
	// 
	// Parameters:
	//   comp - CompItem object representing the property group's composition.
	//   layer - Layer object representing the property group's layer.
	//   propParent - PropertyGroup object whose children Property object to examine.
	//   kfsToDel - Integer representing the keyframes to delete.
	// 
	// Returns:
	// Nothing.
	//
	function rd_RemoveKeys_removeKeysFromPropGroup(comp, layer, propParent, kfsToDel)
	{
		if (propParent !== null)
		{
			var tolerance = comp.frameDuration / 10.0;	// Slop for keys at specific times (start/end of layer, work area, or CTI)
			var prop;
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
			
			// Loop through child properties
			for (var i=1; i<=propParent.numProperties; i++)
			{
				prop = propParent.property(i);
				switch (prop.propertyType)
				{
					case PropertyType.PROPERTY:
						// Skip layer markers, as the user probably doesn't consider those keyframes
						if (prop.matchName === "ADBE Marker")
							continue;
						
						// Remove keyframes here -- from right to left for simplicity
						for (var k=prop.numKeys; k>0; k--)
						{
							keyTime = prop.keyTime(k);
							switch (kfsToDel)
							{
								case 1:	// Inside Work Area
									if ((keyTime >= compStart) && (keyTime <= compEnd))
										prop.removeKey(k);
									break;
								case 2:	// Inside Layer In/Out
									if ((keyTime >= layerStart) && (keyTime <= layerEnd))
										prop.removeKey(k);
									break;
								case 3:	// Outside Layer In/Out
									if ((keyTime < layerStart) || (keyTime > layerEnd))
										prop.removeKey(k);
									break;
								case 4:	// Before/At Current Time
									if (keyTime <= (currTime + tolerance))
										prop.removeKey(k);
									break;
								case 5:	// At/After Current Time
									if (keyTime >= (currTime - tolerance))
										prop.removeKey(k);
									break;
								case 6:	// Odd-Numbered
									if ((k % 2) === 1)
										prop.removeKey(k);
									break;
								case 7:	// Even-Numbered
									if ((k % 2) === 0)
										prop.removeKey(k);
									break;
								case 0:	// All
								default:
										prop.removeKey(k);
									break;
							}
						}
						break;
					
					case PropertyType.INDEXED_GROUP:
					case PropertyType.NAMED_GROUP:
						rd_RemoveKeys_removeKeysFromPropGroup(comp, layer, prop, kfsToDel);
						break;
					
					default:
						break;
				}
			}
		}
	}
	
	
	
	
	// rd_RemoveKeys_doRemoveKeys()
	// 
	// Description:
	// This function performs the actual removal of keyframes.
	// 
	// Parameters:
	// None.
	// 
	// Returns:
	// Nothing.
	//
	function rd_RemoveKeys_doRemoveKeys()
	{
		var kfsToDel = this.parent.parent.main.kfsToDelList.selection.index;
		
		// Check that a project exists
		if (app.project === null)
			return;
		
		// Get the current (active/frontmost) comp
		var comp = app.project.activeItem;
		
		if ((comp === null) || !(comp instanceof CompItem))
		{
			alert(rd_RemoveKeys_localize(rd_RemoveKeysData.strErrNoCompSel), rd_RemoveKeysData.scriptName);
			return;
		}
		
		// If no layers are selected, nothing to do
		if (comp.selectedLayers.length === 0)
		{
			alert(rd_RemoveKeys_localize(rd_RemoveKeysData.strErrNoLayerSel), rd_RemoveKeysData.scriptName);
			return;
		}
		
		// Process the selected layers
		app.beginUndoGroup(rd_RemoveKeysData.scriptName);
		
		var layers = comp.selectedLayers, layer;
		for (var i=0; i<layers.length; i++)
		{
			layer = layers[i];
			rd_RemoveKeys_removeKeysFromPropGroup(comp, layer, layer, kfsToDel);
		}
		
		app.endUndoGroup();
	}
	
	
	
	
	// main code:
	//
	
	// Prerequisites check
	if (parseFloat(app.version) < 10.0)
		alert(rd_RemoveKeys_localize(rd_RemoveKeysData.strMinAE100), rd_RemoveKeysData.scriptName);
	else
	{
		// Build and show the console's floating palette
		var rdrkPal = rd_RemoveKeys_buildUI(thisObj);
		if (rdrkPal !== null)
		{
			// Update UI values, if saved in the settings
			if (app.settings.haveSetting("redefinery", "rd_RemoveKeys_kfsToDel"))
				rdrkPal.grp.main.kfsToDelList.selection = parseInt(app.settings.getSetting("redefinery", "rd_RemoveKeys_kfsToDel"));
			
			// Save current UI settings upon closing the palette
			rdrkPal.onClose = function()
			{
				app.settings.saveSetting("redefinery", "rd_RemoveKeys_kfsToDel", rdrkPal.grp.main.kfsToDelList.selection.index);
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
