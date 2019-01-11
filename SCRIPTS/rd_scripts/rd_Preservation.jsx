// rd_Preservation.jsx
// Copyright (c) 2006-2013 redefinery (Jeffrey R. Almasol). All rights reserved.
// check it: www.redefinery.com
// 
// Name: rd_Preservation
// Version: 3.0
// 
// Description:
// This script displays a palette with controls for changing the "Preserve
// frame rate when nested or in render queue" and "Preserve resolution
// when nested" options in Composition Settings for multiple selected
// compositions.
// 
// Note: This version of the script requires After Effects CS5 
// or later. It can be used as a dockable panel by placing the 
// script in a ScriptUI Panels subfolder of the Scripts folder, 
// and then choosing this script from the Window menu.
// 
// Originally requested by Gary Jaeger.
// 
// Legal stuff:
// This script is provided "as is," without warranty of any kind, expressed
// or implied. In no event shall the author be held liable for any damages 
// arising in any way from the use of this script.
// 
// In other words, I'm just trying to share knowledge with and help out my
// fellow AE script heads, so don't blame me if my code doesn't rate. :-)




// rd_Preservation()
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
(function rd_Preservation(thisObj)
{
	// Globals
	
	var rd_PreservationData = new Object();	// Store globals in an object
	rd_PreservationData.scriptName = "rd: Preservation";
	rd_PreservationData.scriptTitle = rd_PreservationData.scriptName + " v3.0";
	
	rd_PreservationData.strPreserveFPS = {en: "Preserve frame rate when nested or in render queue:"};
	rd_PreservationData.strPreserveRez = {en: "Preserve resolution when nested:"};
	rd_PreservationData.strPreserveOpts = {en: '["Don\'t Change", "Enable (Preserve)", "Disable (Retain)"]'};
	rd_PreservationData.strApply = {"en": "Apply"};
	rd_PreservationData.strHelp = {"en": "?"};
	rd_PreservationData.strErrNoProj = {en: "Cannot perform operation. Please create or open a project, open a single composition, and try again."};
	rd_PreservationData.strErrNoCompsSel = {en: "Cannot perform operation. Please select at least one composition in the Project panel, and try again."};
	rd_PreservationData.strHelpText = 
	{
		"en": "Copyright (c) 2006-2013 redefinery (Jeffrey R. Almasol). \n" +
		"All rights reserved.\n" +
		"\n" +
		"This script displays a palette with controls for changing the \"Preserve frame rate when nested or in render queue\" and \"Preserve resolution when nested\" options in Composition Settings for multiple selected compositions.\n" +
		"\n" + 
		"Note: This version of the script requires After Effects CS5 or later. It can be used as a dockable panel by placing the script in a ScriptUI Panels subfolder of the Scripts folder, and then choosing this script from the Window menu.\n" +
		"\n" +
		"Originally requested by Gary Jaeger."
	};
	
	
	
	
	// rd_Preservation_localize()
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
	function rd_Preservation_localize(strVar)
	{
		return strVar["en"];
	}
	
	
	
	
	// rd_Preservation_buildUI()
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
	function rd_Preservation_buildUI(thisObj)
	{
		var pal = (thisObj instanceof Panel) ? thisObj : new Window("palette", rd_PreservationData.scriptName, undefined, {resizeable:true});
		
		if (pal !== null)
		{
			var res = 
			"group { \
				orientation:'column', alignment:['fill','top'], \
				header: Group { \
					alignment:['fill','top'], \
					title: StaticText { text:'" + rd_PreservationData.scriptName + "', alignment:['fill','center'] }, \
					help: Button { text:'" + rd_Preservation_localize(rd_PreservationData.strHelp) +"', maximumSize:[30,20], alignment:['right','center'] }, \
				}, \
				preserveFPS: StaticText { text:'" + rd_Preservation_localize(rd_PreservationData.strPreserveFPS) + "', alignment:['fill','top'] }, \
				preserveFPSList: DropDownList { properties:{items:" + rd_Preservation_localize(rd_PreservationData.strPreserveOpts) + "}, alignment:['fill','top'], preferredSize:[-1,20] }, \
				gap: Group {}, \
				preserveRez: StaticText { text:'" + rd_Preservation_localize(rd_PreservationData.strPreserveRez) + "', alignment:['fill','top'] }, \
				preserveRezList: DropDownList { properties:{items:" + rd_Preservation_localize(rd_PreservationData.strPreserveOpts) + "}, alignment:['fill','top'], preferredSize:[-1,20] }, \
				cmds: Group { \
					alignment:['fill','top'], \
					applyBtn: Button { text:'" + rd_Preservation_localize(rd_PreservationData.strApply) + "', alignment:['right','top'], preferredSize:[-1,20] }, \
				}, \
			}";
			pal.grp = pal.add(res);
			
			pal.grp.preserveFPSList.selection = 0;
			pal.grp.preserveRezList.selection = 0;
			
			pal.layout.layout(true);
			pal.grp.minimumSize = pal.grp.size;
			pal.layout.resize();
			pal.onResizing = pal.onResize = function () {this.layout.resize();}
			
			pal.grp.header.help.onClick = function () {alert(rd_PreservationData.scriptTitle + "\n" + rd_Preservation_localize(rd_PreservationData.strHelpText), rd_PreservationData.scriptName);}
			pal.grp.cmds.applyBtn.onClick = rd_Preservation_doPreservation;
		}
		
		return pal;
	}
	
	
	
	
	// rd_Preservation_doPreservation()
	// 
	// Description:
	// This callback function change the selected compositions 
	// based on the settings provided.
	// 
	// Parameters:
	// None.
	// 
	// Returns:
	// Nothing.
	//
	function rd_Preservation_doPreservation()
	{
		// Check that a project exists
		if (app.project === null)
		{
			alert(rd_Preservation_localize(rd_PreservationData.strErrNoProj), rd_PreservationData.scriptName);
			return;
		}
		
		var proj = app.project;
		
		// Get the currently selected compositions
		var comps = new Array();
		for (var i=0; i<proj.selection.length; i++)
		{
			if (proj.selection[i] instanceof CompItem)
				comps[comps.length] = proj.selection[i];
		}
		
		if (comps.length === 0)
		{
			alert(rd_Preservation_localize(rd_PreservationData.strErrNoCompsSel), rd_PreservationData.scriptName);
			return;
		}
		
		// Do the work
		app.beginUndoGroup(rd_PreservationData.scriptName);
		
		var preserveFPS = this.parent.parent.preserveFPSList.selection.index;
		var preserveRez = this.parent.parent.preserveRezList.selection.index;
		
		for (var i=0; i<comps.length; i++)
		{
			if (preserveFPS)
				comps[i].preserveNestedFrameRate = (preserveFPS === 1);		// Set to true if enabling, false otherwise
			
			if (preserveRez)
				comps[i].preserveNestedResolution = (preserveRez === 1);		// Set to true if enabling, false otherwise
		}
		
		app.endUndoGroup();
	}
	
	
	
	
	// main code:
	//
	
	// Build and show the console's floating palette
	var rdprPal = rd_Preservation_buildUI(thisObj);
	if (rdprPal !== null)
	{
		// Update UI values, if saved in the settings
		if (app.settings.haveSetting("redefinery", "rd_Preservation_preserveFPS"))
			rdprPal.grp.preserveFPSList.selection = parseInt(app.settings.getSetting("redefinery", "rd_Preservation_preserveFPS"));
		if (app.settings.haveSetting("redefinery", "rd_Preservation_preserveRez"))
			rdprPal.grp.preserveRezList.selection = parseInt(app.settings.getSetting("redefinery", "rd_Preservation_preserveRez"));
		
		// Save current UI settings upon closing the palette
		rdprPal.onClose = function()
		{
			app.settings.saveSetting("redefinery", "rd_Preservation_preserveFPS", rdprPal.grp.preserveFPSList.selection.index);
			app.settings.saveSetting("redefinery", "rd_Preservation_preserveRez", rdprPal.grp.preserveRezList.selection.index);
		}
		
		if (rdprPal instanceof Window)
		{
			rdprPal.center();
			rdprPal.show();
		}
		else
			rdprPal.layout.layout(true);
	}
})(this);
