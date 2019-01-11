// rd_DivvyUp.jsx
// Copyright (c) 2011-2013 redefinery (Jeffrey R. Almasol). All rights reserved.
// check it: www.redefinery.com
// 
// Name: rd_DivvyUp
// Version: 2.0
// 
// Description:
// This script displays a palette with controls for splitting the selected layer
// into equal portions.
// 
// The duplicate layers stagger upward, and are named the same as the
// original.
// 
// Note: This version of the script requires After Effects CS5 
// or later. It can be used as a dockable panel by placing the 
// script in a ScriptUI Panels subfolder of the Scripts folder, 
// and then choosing this script from the Window menu.
// 
// Originally requested by Thomas Jaeger.
// 
// Legal stuff:
// This script is provided "as is," without warranty of any kind, expressed
// or implied. In no event shall the author be held liable for any damages 
// arising in any way from the use of this script.
// 
// In other words, I'm just trying to share knowledge with and help out my
// fellow AE script heads, so don't blame me if my code doesn't rate. :-)




// rd_DivvyUp()
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
(function rd_DivvyUp(thisObj)
{
	// Globals
	
	var rd_DivvyUpData = new Object();	// Store globals in an object
	rd_DivvyUpData.scriptName = "rd: Divvy Up";
	rd_DivvyUpData.scriptTitle = rd_DivvyUpData.scriptName + " v2.0";
	
	rd_DivvyUpData.strPortions = {en: "Divide into:"};
	rd_DivvyUpData.strPortionsUOM = {en: "parts"};
	rd_DivvyUpData.strOK = {en: "Divvy Up"};
	rd_DivvyUpData.strHelp = {en: "?"};
	rd_DivvyUpData.strErrNoCompSel = {en: "Cannot perform operation. Please select or open a single composition in the Project panel, and try again."};
	rd_DivvyUpData.strErrNoLayerSel = {en: "Cannot perform operation. Please select a single layer, and try again."};
	rd_DivvyUpData.strMinAE100 = {en: "This script requires Adobe After Effects CS5 or later."};
	rd_DivvyUpData.strHelpText = 
	{
		en: "Copyright (c) 2011-2013 redefinery (Jeffrey R. Almasol). \n" +
		"All rights reserved.\n" +
		"\n" +
		"This script displays a palette with controls for splitting the selected layer into equal portions.\n" +
		"\n" +
		"The duplicate layers stagger upward, and are named the same as the original.\n" + 
		"\n" +
		"Note: This version of the script requires After Effects CS5 or later. It can be used as a dockable panel by placing the script in a ScriptUI Panels subfolder of the Scripts folder, and then choosing this script from the Window menu.\n" + 
		"\n" +
		"Originally requested by Thomas Jaeger."
	};
	
	
	
	
	// rd_DivvyUp_localize()
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
	function rd_DivvyUp_localize(strVar)
	{
		return strVar["en"];
	}
	
	
	
	
	// rd_DivvyUp_buildUI()
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
	function rd_DivvyUp_buildUI(thisObj)
	{
		var pal = (thisObj instanceof Panel) ? thisObj : new Window("palette", rd_DivvyUpData.scriptName, undefined, {resizeable:true});
		
		if (pal !== null)
		{
			var res =
			"group { \
				orientation:'column', alignment:['fill','fill'], \
				header: Group { \
					alignment:['fill','top'], \
					title: StaticText { text:'" + rd_DivvyUpData.scriptName + "', alignment:['fill','center'] }, \
					help: Button { text:'" + rd_DivvyUp_localize(rd_DivvyUpData.strHelp) +"', maximumSize:[30,20], alignment:['right','center'] }, \
				}, \
				opts: Group { \
					alignment:['fill','top'], alignChildren:['center','center'], \
					lbl: StaticText { text:'" + rd_DivvyUp_localize(rd_DivvyUpData.strPortions) + "' }, \
					val: EditText { text:'4', characters:5, preferredSize:[-1,20] }, \
					uom: StaticText { text:'" + rd_DivvyUp_localize(rd_DivvyUpData.strPortionsUOM) + "', alignment:['left','center'] }, \
				}, \
				cmds: Group { \
					alignment:['right','top'], \
					okBtn: Button { text:'" + rd_DivvyUp_localize(rd_DivvyUpData.strOK) + "', preferredSize:[-1,20] }, \
				}, \
			} \
			";
			pal.grp = pal.add(res);
			
			pal.layout.layout(true);
			pal.grp.minimumSize = pal.grp.size;
			pal.onResizing = pal.onResize = function () {this.layout.resize();}
			
			pal.grp.opts.val.onChange = function ()
			{
				var value = parseInt(this.text);
				if (isNaN(value))
					value = 4;
				else if (value < 2)
					value = 2;
				else if (value > 500)
					value = 500;
				this.text = value.toString();
			}
			
			pal.grp.header.help.onClick = function () {alert(rd_DivvyUpData.scriptTitle + "\n" + rd_DivvyUp_localize(rd_DivvyUpData.strHelpText), rd_DivvyUpData.scriptName);}
			pal.grp.cmds.okBtn.onClick = rd_DivvyUp_doDivvyUp;
		}
		
		return pal;
	}
	
	
	
	
	// rd_DivvyUp_doDivvyUp()
	// 
	// Description:
	// This function performs the actual splitting of the layer.
	// 
	// Parameters:
	// None.
	// 
	// Returns:
	// Nothing.
	//
	function rd_DivvyUp_doDivvyUp()
	{
		var portions = parseInt(this.parent.parent.opts.val.text);
		
		// Check that a project exists
		if (app.project === null)
			return;
		
		// Get the current (active/frontmost) comp
		var comp = app.project.activeItem;
		
		if ((comp === null) || !(comp instanceof CompItem))
		{
			alert(rd_DivvyUp_localize(rd_DivvyUpData.strErrNoCompSel), rd_DivvyUpData.scriptName);
			return;
		}
		
		// If no single layer is selected, nothing to do
		if (comp.selectedLayers.length !== 1)
		{
			alert(rd_DivvyUp_localize(rd_DivvyUpData.strErrNoLayerSel), rd_DivvyUpData.scriptName);
			return;
		}
		
		// Process the selected layer
		app.beginUndoGroup(rd_DivvyUpData.scriptName);
		
		var layer = comp.selectedLayers[0], dupeLayer;
		var origOutPoint = layer.outPoint;
		var portionDur = (layer.outPoint - layer.inPoint) / portions;
		var sliceTime = layer.inPoint + portionDur;
		var origTime = comp.time;	// remember the current comp time to restore later
		
		while (portions > 1)
		{
			comp.time = sliceTime;
			
			dupeLayer = layer.duplicate();
			layer.outPoint = dupeLayer.inPoint = sliceTime;
			
			sliceTime += portionDur;
			portions--;
			layer = dupeLayer;
		}
		layer.outPoint = origOutPoint;
		
		comp.time = origTime;
		
		app.endUndoGroup();
	}
	
	
	
	
	// main code:
	//
	
	// Prerequisites check
	if (parseFloat(app.version) < 10.0)
		alert(rd_DivvyUp_localize(rd_DivvyUpData.strMinAE100), rd_DivvyUpData.scriptName);
	else
	{
		// Build and show the console's floating palette
		var rdduPal = rd_DivvyUp_buildUI(thisObj);
		if (rdduPal !== null)
		{
			if (rdduPal instanceof Window)
			{
				rdduPal.center();
				rdduPal.show();
			}
			else
			{
				rdduPal.layout.resize();
				rdduPal.layout.layout(true);
			}
		}
	}
})(this);
