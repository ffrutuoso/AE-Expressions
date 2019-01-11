// rd_Rampart.jsx
// Copyright (c) 2006-2013 redefinery (Jeffrey R. Almasol). All rights reserved.
// check it: www.redefinery.com
// 
// Name: rd_Rampart
// Version: 3.0
// 
// Description:
// This script allows you to ramp the opacity at the location of the 
// specified property's keyframes or layer's markers. Keyframes and markers
// are processed in chronological order.
// 
// To skip defining one of the keys, enter a blank frame offset (which
// disables the corresponding value edit field).
// 
// Note: The script will remember your previous key frame offsets and
// opacity values, but you must switch (Tab or click) to another field
// to store value.
// 
// Note: This version of the script requires After Effects CS5 
// or later.
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




// rd_Rampart()
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
(function rd_Rampart()
{
	// Globals
	
	var rd_RampartData = new Object();	// Store globals in an object
	rd_RampartData.scriptName = "rd: Rampart";
	rd_RampartData.scriptTitle = rd_RampartData.scriptName + " v3.0";
	
	rd_RampartData.keyedProps = new Array();	// Store keyframed properties here
	
	rd_RampartData.strRampPropUsing = {en: "Ramp Opacity using:"};
	rd_RampartData.strFramesBefore = {en: "frames before"};
	rd_RampartData.strFramesAfter = {en: "frames after"};
	rd_RampartData.strKey = {en: "key"};
	rd_RampartData.strValue = {en: "value"};
	rd_RampartData.strLayerMarkers = {en: "Layer-time markers"};
	rd_RampartData.strPropKeyframes = {en: "%s keyframes"};
	rd_RampartData.strDelPrevKeys = {en: "Remove existing Opacity keyframes"};
	rd_RampartData.strRampIt = {en: "OK"};
	rd_RampartData.strCancel = {en: "Cancel"};
	rd_RampartData.strHelp = {en: "?"};
	rd_RampartData.strErrNoCompSel = {en: "Cannot perform operation. Please select or open a single composition in the Project panel, and try again."};
	rd_RampartData.strErrNoSingleLayerSel = {en: "Cannot perform operation. Please select a single layer, and try again."};
	rd_RampartData.strMinAE100 = {en: "This script requires Adobe After Effects CS5 or later."};
	rd_RampartData.strHelpText = 
	{
		en: "Copyright (c) 2006-2013 redefinery (Jeffrey R. Almasol). \n" +
		"All rights reserved.\n" +
		"\n" +
		"This script allows you to ramp the opacity at the location of the specified property's keyframes or layer's markers. Keyframes and markers are processed in chronological order.\n" +
		"\n" +
		"To skip defining one of the keys, enter a blank frame offset (which disables the corresponding value edit field).\n" +
		"\n" +
		"Note: The script will remember your previous key frame offsets and opacity values, but you must switch (Tab or click) to another field to store value.\n" +
		"\n" +
		"Note: This version of the script requires After Effects CS5 or later.\n" +
		"\n" +
		"Originally requested by Wes Plate."
	};
	
	
	
	
	// rd_Rampart_localize()
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
	function rd_Rampart_localize(strVar)
	{
		return strVar["en"];
	}
	
	
	
	
	// rd_Rampart_getListOfKeyframedProps()
	// 
	// Description:
	// This function traverses the specified property group's (layer's, initially) property
	// hierarchy, building a list of keyframed properties. Marker and Opacity properties
	// are skipped, as they are handled separately.
	// 
	// Parameters:
	//   propGroup - PropertyGroup object representing the current property group to scan.
	// 
	// Returns:
	// Array of Property objects representing keyframed properties.
	//
	function rd_Rampart_getListOfKeyframedProps(propGroup)
	{
		var propList = new Array();
		var prop;
		
		for (var i=1; i<=propGroup.numProperties; i++)
		{
			prop = propGroup.property(i);
			switch (prop.propertyType)
			{
				case PropertyType.PROPERTY:
					// Skip Marker and Opacity keyframes
					if ((prop.matchName !== "ADBE Marker") && (prop.matchName !== "ADBE Opacity"))
					{
						// Skip non-keyframed properties
						if (prop.numKeys > 0)
							propList[propList.length] = prop;
					}
					break;
				case PropertyType.INDEXED_GROUP:
				case PropertyType.NAMED_GROUP:
					// Recusive into this property group; append results
					propList = propList.concat(rd_Rampart_getListOfKeyframedProps(prop));
					break;
				default:
					break;
			}
		}
		
		return propList;
	}
	
	
	
	
	// rd_Rampart_buildUI()
	// 
	// Description:
	// This function builds the user interface.
	// 
	// Parameters:
	// None.
	// 
	// Returns:
	// Window object representing the built user interface.
	//
	function rd_Rampart_buildUI()
	{
		function doClampOpacityValue()
		{
			var value = parseInt(this.text);
			if (isNaN(value) || (value < 0))
				value = 0;
			else if (value > 100)
				value = 100;
			this.text = value.toString();
		}
		
		var res = "dialog { \
			text:'" + rd_RampartData.scriptName + "', \
			r1: Group { \
				orientation:'column', alignment:['fill','top'], alignChildren:['left','top'], \
				rampPropUsing: StaticText { text:'" + rd_Rampart_localize(rd_RampartData.strRampPropUsing) + "' }, \
				rampPropUsingList: DropDownList { properties:{items:['" + rd_Rampart_localize(rd_RampartData.strLayerMarkers) + "']}, alignment:['fill','top'], preferredSize:[-1,20] }, \
			}, \
			r2: Group { \
				alignment:['fill','top'], \
				fbef: StaticText { text:'" + rd_Rampart_localize(rd_RampartData.strFramesBefore) + "', alignment:['center','top'], justify:'center' }, \
				gap: StaticText { text:' ', alignment:['fill','top'] }, \
				faft: StaticText { text:'" + rd_Rampart_localize(rd_RampartData.strFramesAfter) + "', alignment:['center','top'], justify:'center' }, \
			}, \
			r3: Group { \
				fbef2: EditText { text:'20', characters:4, justify:'center', preferredSize:[-1,20] }, \
				fbef1: EditText { text:'10', characters:4, justify:'center', preferredSize:[-1,20] }, \
				key: StaticText { text:'" + rd_Rampart_localize(rd_RampartData.strKey) + "', alignment:['fill','center'], justify:'center' }, \
				faft1: EditText { text:'10', characters:4, justify:'center', preferredSize:[-1,20] }, \
				faft2: EditText { text:'20', characters:4, justify:'center', preferredSize:[-1,20] }, \
			}, \
			r4: Group { \
				vbef2: EditText { text:'100', characters:4, justify:'center', preferredSize:[-1,20] }, \
				vbef1: EditText { text:'0', characters:4, justify:'center', preferredSize:[-1,20] }, \
				key: StaticText { text:'" + rd_Rampart_localize(rd_RampartData.strValue) + "', alignment:['fill','center'], justify:'center' }, \
				vaft1: EditText { text:'0', characters:4, justify:'center', preferredSize:[-1,20] }, \
				vaft2: EditText { text:'100', characters:4, justify:'center', preferredSize:[-1,20] }, \
			}, \
			r5: Group { \
				alignment:['left','top'], \
				delPrevKeys: Checkbox { text:'" + rd_Rampart_localize(rd_RampartData.strDelPrevKeys) + "', value:true }, \
			}, \
			sep: Panel { alignment:['fill','top'] }, \
			cmds: Group { \
				alignment:['fill','top'], \
				helpBtn: Button { text:'" + rd_Rampart_localize(rd_RampartData.strHelp) + "', alignment:['left','bottom'], maximumSize:[30,20] }, \
				okBtn: Button { text:'" + rd_Rampart_localize(rd_RampartData.strRampIt) + "', alignment:['right','bottom'], preferredSize:[-1,20] }, \
				cancelBtn: Button { text:'" + rd_Rampart_localize(rd_RampartData.strCancel) + "', alignment:['right','bottom'], preferredSize:[-1,20] }, \
			}, \
		}";
		var dlg = new Window(res);
		
		// Build list of keyframed properties on the selected layer
		var layer = app.project.activeItem.selectedLayers[0];
		// Start with the markers on the layer
		rd_RampartData.keyedProps[rd_RampartData.keyedProps.length] = layer.property("Marker");
		var foo = rd_Rampart_getListOfKeyframedProps(layer);
		rd_RampartData.keyedProps = rd_RampartData.keyedProps.concat(foo);
		for (var i=1; i<rd_RampartData.keyedProps.length; i++)
			dlg.r1.rampPropUsingList.add("item", rd_Rampart_localize(rd_RampartData.strPropKeyframes).replace("%s", rd_RampartData.keyedProps[i].name));
		dlg.r1.rampPropUsingList.selection = 0;
		
		dlg.r3.margins.top -= 5;
		dlg.r4.margins.top -= 5;
		dlg.r5.margins.top += 5;
		
		dlg.r2.fbef.preferredSize.width = dlg.r3.fbef2.preferredSize.width + dlg.r3.fbef1.preferredSize.width + dlg.r3.spacing;
		dlg.r2.faft.preferredSize.width = dlg.r3.faft2.preferredSize.width + dlg.r3.faft1.preferredSize.width + dlg.r3.spacing;
		dlg.r2.gap.preferredSize.width = dlg.r3.key.preferredSize.width = dlg.r4.key.preferredSize.width;
		
		dlg.sep.height = 2;

		dlg.r3.fbef2.onChange = function ()
		{
			var value = this.text;
			if (value === "")
			{
				this.parent.parent.r4.vbef2.enabled = false;
				return;
			}
			this.parent.parent.r4.vbef2.enabled = true;
			value = parseFloat(value);
			if (isNaN(value) || (value < 0))
				value = 0;
			this.text = value.toString();
		}
		dlg.r3.fbef1.onChange = function ()
		{
			var value = this.text;
			if (value === "")
			{
				this.parent.parent.r4.vbef1.enabled = false;
				return;
			}
			this.parent.parent.r4.vbef1.enabled = true;
			value = parseFloat(value);
			if (isNaN(value) || (value < 0))
				value = 0;
			this.text = value.toString();
		}
		
		dlg.r3.faft1.onChange = function ()
		{
			var value = this.text;
			if (value === "")
			{
				this.parent.parent.r4.vaft1.enabled = false;
				return;
			}
			this.parent.parent.r4.vaft1.enabled = true;
			value = parseFloat(value);
			if (isNaN(value) || (value < 0))
				value = 0;
			this.text = value.toString();
		}
		dlg.r3.faft2.onChange = function ()
		{
			var value = this.text;
			if (value === "")
			{
				this.parent.parent.r4.vaft2.enabled = false;
				return;
			}
			this.parent.parent.r4.vbef2.enabled = true;
			value = parseFloat(value);
			if (isNaN(value) || (value < 0))
				value = 0;
			this.text = value.toString();
		}
		
		// before, value, after
		dlg.r4.vbef2.onChange = doClampOpacityValue;
		dlg.r4.vbef1.onChange = doClampOpacityValue;
		dlg.r4.vaft1.onChange = doClampOpacityValue;
		dlg.r4.vaft2.onChange = doClampOpacityValue;
		
		dlg.cmds.helpBtn.onClick = function () {alert(rd_RampartData.scriptTitle + "\n" + rd_Rampart_localize(rd_RampartData.strHelpText), rd_RampartData.scriptName);}
		dlg.cmds.okBtn.onClick = rd_Rampart_doRampart;
		
		return dlg;
	}
	
	
	
	
	// rd_Rampart_doRampart()
	// 
	// Description:
	// This callback function determines the deepest selected property or property group.
	// Assumes a single composition is selected or active.
	// 
	// Parameters:
	// None
	// 
	// Returns:
	// Property or PropertyGroup object if successful; null if no property or
	// property group, or if multiple of them, are selected.
	// 
	function rd_Rampart_doRampart()
	{
		// Assumes we already have a selected layer, based on prerequisites in calling function
		var comp = app.project.activeItem;
		var layer = comp.selectedLayers[0];
		var keyedProp = rd_RampartData.keyedProps[this.parent.parent.r1.rampPropUsingList.selection.index];	// Get the property associated with the selected ramp control
		var opacProp = layer.opacity;
		
		var fbef2 = parseFloat(this.parent.parent.r3.fbef2.text) * comp.frameDuration;
		var fbef1 = parseFloat(this.parent.parent.r3.fbef1.text) * comp.frameDuration;
		var faft1 = parseFloat(this.parent.parent.r3.faft1.text) * comp.frameDuration;
		var faft2 = parseFloat(this.parent.parent.r3.faft2.text) * comp.frameDuration;
		
		var vbef2 = parseInt(this.parent.parent.r4.vbef2.text);
		var vbef1 = parseInt(this.parent.parent.r4.vbef1.text);
		var vaft1 = parseInt(this.parent.parent.r4.vaft1.text);
		var vaft2 = parseInt(this.parent.parent.r4.vaft2.text);
		
		// Start performing the operation
		app.beginUndoGroup(rd_RampartData.scriptName);

		// Delete existing keys, if requested
		if (this.parent.parent.r5.delPrevKeys.value)
		{
			for (var i=opacProp.numKeys; i>=1; i--)
				opacProp.removeKey(i);
		}
		
		// Loop through the keyframes
		var keyTime;
		for (var i=1; i<=keyedProp.numKeys; i++)
		{
			keyTime = keyedProp.keyTime(i);
			//$.writeln("  key "+i+" @ "+keyTime);
			
			// Create keys based on settings; skip any that are not defined (blank)
			if (!isNaN(fbef2))
				opacProp.setValueAtTime(keyTime - fbef2, vbef2);
			if (!isNaN(fbef1))
				opacProp.setValueAtTime(keyTime - fbef1, vbef1);
			if (!isNaN(faft1))
				opacProp.setValueAtTime(keyTime + faft1, vaft1);
			if (!isNaN(faft2))
				opacProp.setValueAtTime(keyTime + faft2, vaft2);
		}
		
		app.endUndoGroup();
		
		// Close the dialog box
		this.parent.parent.close();
	}
	
	
	
	
	// main code:
	//
	
	// Prerequisites check
	if (parseFloat(app.version) < 10.0)
		alert(rd_Rampart_localize(rd_RampartData.strMinAE100), rd_RampartData.scriptName);
	else
	{
		if ((app.project === null) || (app.project.activeItem === null) || !(app.project.activeItem instanceof CompItem))
			alert(rd_Rampart_localize(rd_RampartData.strErrNoCompSel), rd_RampartData.scriptName);
		else if (app.project.activeItem.selectedLayers.length !== 1)
			alert(rd_Rampart_localize(rd_RampartData.strErrNoSingleLayerSel), rd_RampartData.scriptName);
		else
		{
			// Build and show the dialog box
			var rdrDlg  = rd_Rampart_buildUI();
			if (rdrDlg !== null)
			{
				// Update UI values, if saved in the settings
				if (app.settings.haveSetting("redefinery", "rd_Rampart_fbef2"))
				{
					rdrDlg.r3.fbef2.text = parseFloat(app.settings.getSetting("redefinery", "rd_Rampart_fbef2")).toString();
					if (rdrDlg.r3.fbef2.text === "NaN")
					{
						rdrDlg.r3.fbef2.text = "";
						rdrDlg.r4.vbef2.enabled = false;
					}
				}
				if (app.settings.haveSetting("redefinery", "rd_Rampart_fbef1"))
				{
					rdrDlg.r3.fbef1.text = parseFloat(app.settings.getSetting("redefinery", "rd_Rampart_fbef1")).toString();
					if (rdrDlg.r3.fbef1.text === "NaN")
					{
						rdrDlg.r3.fbef1.text = "";
						rdrDlg.r4.vbef1.enabled = false;
					}
				}
				if (app.settings.haveSetting("redefinery", "rd_Rampart_faft1"))
				{
					rdrDlg.r3.faft1.text = parseFloat(app.settings.getSetting("redefinery", "rd_Rampart_faft1")).toString();
					if (rdrDlg.r3.faft1.text === "NaN")
					{
						rdrDlg.r3.faft1.text = "";
						rdrDlg.r4.vaft1.enabled = false;
					}
				}
				if (app.settings.haveSetting("redefinery", "rd_Rampart_faft2"))
				{
					rdrDlg.r3.faft2.text = parseFloat(app.settings.getSetting("redefinery", "rd_Rampart_faft2")).toString();
					if (rdrDlg.r3.faft2.text === "NaN")
					{
						rdrDlg.r3.faft2.text = "";
						rdrDlg.r4.vaft2.enabled = false;
					}
				}
				if (app.settings.haveSetting("redefinery", "rd_Rampart_vbef2"))
					rdrDlg.r4.vbef2.text = parseInt(app.settings.getSetting("redefinery", "rd_Rampart_vbef2")).toString();
				if (app.settings.haveSetting("redefinery", "rd_Rampart_vbef1"))
					rdrDlg.r4.vbef1.text = parseInt(app.settings.getSetting("redefinery", "rd_Rampart_vbef1")).toString();
				if (app.settings.haveSetting("redefinery", "rd_Rampart_vaft1"))
					rdrDlg.r4.vaft1.text = parseInt(app.settings.getSetting("redefinery", "rd_Rampart_vaft1")).toString();
				if (app.settings.haveSetting("redefinery", "rd_Rampart_vaft2"))
					rdrDlg.r4.vaft2.text = parseInt(app.settings.getSetting("redefinery", "rd_Rampart_vaft2")).toString();
				if (app.settings.haveSetting("redefinery", "rd_Rampart_delPrevKeys"))
					rdrDlg.r5.delPrevKeys.value = !(app.settings.getSetting("redefinery", "rd_Rampart_delPrevKeys") === "false");
				
				// Save current UI settings upon closing the dialog box
				rdrDlg.onClose = function()
				{
					app.settings.saveSetting("redefinery", "rd_Rampart_fbef2", isNaN(rdrDlg.r3.fbef2.text) ? "" : rdrDlg.r3.fbef2.text);
					app.settings.saveSetting("redefinery", "rd_Rampart_fbef1", isNaN(rdrDlg.r3.fbef1.text) ? "" : rdrDlg.r3.fbef1.text);
					app.settings.saveSetting("redefinery", "rd_Rampart_faft1", isNaN(rdrDlg.r3.faft1.text) ? "" : rdrDlg.r3.faft1.text);
					app.settings.saveSetting("redefinery", "rd_Rampart_faft2", isNaN(rdrDlg.r3.faft2.text) ? "" : rdrDlg.r3.faft2.text);
					app.settings.saveSetting("redefinery", "rd_Rampart_vbef2", isNaN(rdrDlg.r4.vbef2.text) ? "0" : rdrDlg.r4.vbef2.text);
					app.settings.saveSetting("redefinery", "rd_Rampart_vbef1", isNaN(rdrDlg.r4.vbef1.text) ? "0" : rdrDlg.r4.vbef1.text);
					app.settings.saveSetting("redefinery", "rd_Rampart_vaft1", isNaN(rdrDlg.r4.vaft1.text) ? "0" : rdrDlg.r4.vaft1.text);
					app.settings.saveSetting("redefinery", "rd_Rampart_vaft2", isNaN(rdrDlg.r4.vaft2.text) ? "0" : rdrDlg.r4.vaft2.text);
					app.settings.saveSetting("redefinery", "rd_Rampart_delPrevKeys", rdrDlg.r5.delPrevKeys.value);
				}
				
				// Show the dialog box
				rdrDlg.center();
				rdrDlg.show();
			}
		}
	}
})();
