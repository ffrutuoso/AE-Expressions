// rd_Partial.jsx
// Copyright (c) 2009-2013 redefinery (Jeffrey R. Almasol). All rights reserved.
// check it: www.redefinery.com
// 
// Name: rd_Partial
// Version: 2.0
// 
// Description:
// This script displays a panel with controls for setting the pixel aspect 
// ratio of the selected footage items. Basically, a batch mode for 
// setting PAR in the Interpret Footage dialog box.
// 
// If a proxy is active for a footage item, the operation will be
// applied to the main footage, not proxy. This is a limitation.
// 
// Note: After the operation finishes, the info appearing next to the
// selected footage item in the Project panel might not update to
// reflect the guessed setting, so deselect and then reselect it to
// view the current setting.
// 
// Note: This version of the script requires After Effects CS5 
// or later. It can be used as a dockable panel by placing the 
// script in a ScriptUI Panels subfolder of the Scripts folder, 
// and then choosing this script from the Window menu.
// 
// Originally requested by Matthew Crnich.
// 
// Legal stuff:
// This script is provided "as is," without warranty of any kind, expressed
// or implied. In no event shall the author be held liable for any damages 
// arising in any way from the use of this script.
// 
// In other words, I'm just trying to share knowledge with and help out my
// fellow AE script heads, so don't blame me if my code doesn't rate. :-)




// rd_Partial()
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
(function rd_Partial(thisObj)
{
	// Globals
	
	var rd_PartialData = new Object();	// Store globals in an object
	rd_PartialData.scriptName = "rd: Partial";
	rd_PartialData.scriptTitle = rd_PartialData.scriptName + " v2.0";
	
	rd_PartialData.strPAR = {en: "PAR:"};
	rd_PartialData.strPARList = {en: '["Square Pixels", "D1/DV NTSC (0.9)", "D1/DV NTSC - CS4 (0.91)", "D1/DV NTSC Widescreen (1.2)", "D1/DV NTSC Widescreen - CS4 (1.21)", "D1/DV PAL (1.07)", "D1/DV PAL - CS4 (1.09)", "D1/DV PAL Widescreen (1.42)", "D1/DV PAL Widescreen - CS4 (1.46)", "HDV 1080/DVCPRO HD 720 (1.33)", "DVCPRO HD 1080 (1.5)", "Anamorphic 2:1 (2)", "Custom"]'};
	rd_PartialData.strPARValues = [1.0, 0.9, 0.91, 1.2, 1.21, 1.07, 1.09, 1.42, 1.46, 1.33, 1.5, 2.0, 1.0];	// keep in same order as strPARList
	rd_PartialData.strCustom = {en: "Custom:"};
	rd_PartialData.strApply = {en: "Apply"};
	rd_PartialData.strHelp = {en: "?"};
	rd_PartialData.strErrNoSelFootage = {en: "Cannot perform operation. Please select at least one footage item in the Project panel, and try again."};
	rd_PartialData.strMinAE100 = {en: "This script requires Adobe After Effects CS5 or later."};
	rd_PartialData.strHelpText = 
	{
		"en": "Copyright (c) 2009-2013 redefinery (Jeffrey R. Almasol). \n" +
		"All rights reserved.\n" +
		"\n" +
		"This script displays a panel with controls for setting the pixel aspect ratio of the selected footage items. Basically, a batch mode for setting PAR in the Interpret Footage dialog box.\n" +
		"\n" +
		"If a proxy is active for a footage item, the operation will be applied to the main footage, not proxy. This is a limitation.\n" +
		"\n" +
		"Note: After the operation finishes, the info appearing next to the selected footage item in the Project panel might not update to reflect the guessed setting, so deselect and then reselect it to view the current setting.\n" +
		"\n" +
		"Note: This version of the script requires After Effects CS5 or later. It can be used as a dockable panel by placing the script in a ScriptUI Panels subfolder of the Scripts folder, and then choosing this script from the Window menu.\n" +
		"\n" +
		"Originally requested by Matthew Crnich."
	};
	
	
	
	
	// rd_Partial_localize()
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
	function rd_Partial_localize(strVar)
	{
		return strVar["en"];
	}
	
	
	
	
	// rd_Partial_buildUI()
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
	function rd_Partial_buildUI(thisObj)
	{
		var pal = (thisObj instanceof Panel) ? thisObj : new Window("palette", rd_PartialData.scriptName, undefined, {resizeable:true});
		
		if (pal !== null)
		{
			var res =
			"group { \
				orientation:'column', alignment:['fill','fill'], \
				header: Group { \
					alignment:['fill','top'], \
					title: StaticText { text:'" + rd_PartialData.scriptName + "', alignment:['fill','center'] }, \
					help: Button { text:'" + rd_Partial_localize(rd_PartialData.strHelp) + "', maximumSize:[30,20], alignment:['right','center'] }, \
				}, \
				parGroup: Group { \
					alignment:['fill','top'], \
					title: StaticText { text:'" + rd_Partial_localize(rd_PartialData.strPAR) + "' }, \
					list: DropDownList { properties:{items:" + rd_Partial_localize(rd_PartialData.strPARList) + "}, alignment:['fill','center'], preferredSize:[-1,20] }, \
					custom: EditText { text:'1.0', characters:5, alignment:['right','center'], enabled:false, preferredSize:[-1,20] }, \
				}, \
				applyBtn: Button { text:'" + rd_Partial_localize(rd_PartialData.strApply) + "', alignment:['right','top'], preferredSize:[-1,20] }, \
			} \
			";
			pal.grp = pal.add(res);
			
			pal.layout.layout(true);
			pal.grp.minimumSize = pal.grp.size;
			pal.layout.resize();
			pal.onResizing = pal.onResize = function () {this.layout.resize();}
			
			pal.grp.parGroup.list.selection = 0;
			pal.grp.parGroup.list.onChange = function ()
			{
				this.parent.custom.enabled = (this.selection.index === (rd_PartialData.strPARValues.length-1));
			}
			
			pal.grp.parGroup.custom.onChange = function ()
			{
				var value = parseFloat(this.text);
				if (isNaN(value))
					value = 1.0;
				else if (value < 0.01)
					value = 0.01;
				else if (value > 100.0)
					value = 100.0;
				this.text = value.toString();
			}
			
			pal.grp.applyBtn.onClick = function ()
			{
				var par;
				if (this.parent.parGroup.list.selection.index === (rd_PartialData.strPARValues.length-1))
				{
					// Custom
					par = parseFloat(this.parent.parGroup.custom.text);
					if (isNaN(par))
						par = 1.0;
					else if (par < 0.01)
						par = 0.01;
					else if (par > 100.0)
						par = 100.0;
					this.parent.parGroup.custom.text = par.toString();
				}
				else
					par = rd_PartialData.strPARValues[this.parent.parGroup.list.selection.index];
				rd_Partial_doPartial(par);
			}
			
			pal.grp.header.help.onClick = function () {alert(rd_PartialData.scriptTitle + "\n" + rd_Partial_localize(rd_PartialData.strHelpText), rd_PartialData.scriptName);}
		}
		
		return pal;
	}
	
	
	
	
	// rd_Partial_doPartial()
	// 
	// Description:
	// This callback function performs the selected PAR adjustment 
	// on the selected footage items.
	// 
	// Parameters:
	//   par - Floating point number for the new PAR.
	// 
	// Returns:
	// Nothing.
	//
	function rd_Partial_doPartial(par)
	{
		// Check that a project exists
		if (app.project === null)
		{
			alert(rd_Partial_localize(rd_PartialData.strErrNoProj), rd_PartialData.scriptName);
			return;
		}
		
		var proj = app.project;
		
		// Check for at least one selected item; no pre-check of footage item yet
		if (proj.selection.length === 0)
		{
			alert(rd_Partial_localize(rd_PartialData.strErrNoSelFootage), rd_PartialData.scriptName);
			return;
		}
		
		// Do the work
		app.beginUndoGroup(rd_PartialData.scriptName);
		
		var selItem, footageSrc;
		for (var i=0; i<proj.selection.length; i++)
		{
			selItem = proj.selection[i];
			
			// Check if a footage item
			if (selItem.typeName === "Footage")
			{
				try
				{
					selItem.pixelAspect = par;
				}
				catch (e)
				{}
			}
		}
		
		app.endUndoGroup();
	}
	
	
	
	
	// main code:
	//
	
	// Build and show the console's floating palette
	var rdpPal = rd_Partial_buildUI(thisObj);
	if (rdpPal !== null)
	{
		if (rdpPal instanceof Window)
		{
			rdpPal.center();
			rdpPal.show();
		}
		else
			rdpPal.layout.layout(true);
	}
})(this);
