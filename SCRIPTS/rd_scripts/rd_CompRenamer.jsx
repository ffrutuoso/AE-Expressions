// rd_CompRenamer.jsx
// Copyright (c) 2005-2013 redefinery (Jeffrey R. Almasol). All rights reserved.
// check it: www.redefinery.com
// 
// Name: rd_CompRenamer
// Version: 3.0
// 
// Description:
// This script displays a palette with controls for renaming the 
// selected compositions in the Project panel. You can use this 
// script to, for example, remove the " Comp #" suffix (or 
// localized equivalent in German and French versions of After 
// Effects) added to new compositions whose footage was 
// previously dragged to the New Composition button.
// 
// Notes: Expressions that refer to the existing composition 
// names are not updated, so it's best to use this script after 
// creating a composition.
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




// rd_CompRenamer()
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
(function rd_CompRenamer(thisObj)
{
	// Globals
	
	var rd_CompRenamerData = new Object();	// Store globals in an object
	rd_CompRenamerData.scriptName = "rd: Composition Renamer";
	rd_CompRenamerData.scriptTitle = rd_CompRenamerData.scriptName + " v3.0";
	
	rd_CompRenamerData.compNameRE = {"en": /(.*)\sComp\s\d+$/, "de": /(.*)\sKomp\s\d+$/, "fr": /(.*)\sComp\s\d+$/}; //, "jp": /(.*)\sƒRƒ“ƒ|\s\d+$/};
	
	rd_CompRenamerData.strSelectPnl = {"en": "Selection"};
	rd_CompRenamerData.strSelectComps = {"en": "Select Compositions"};
	rd_CompRenamerData.strOnlyWithComp1 = {"en": "Only with \" Comp #\" Suffix", "de": "Only with \" Komp #\" Suffix", "fr": "Only with \" Comp #\" Suffix"};
	rd_CompRenamerData.strNamingPnl = {"en": "Naming"};
	rd_CompRenamerData.strRemoveComp1 = {"en": "Remove \" Comp #\" Suffix", "de": "Remove \" Komp #\" Suffix", "fr": "Remove \" Comp #\" Suffix"};
	rd_CompRenamerData.strAddSuffix = {"en": "Add Suffix:"};
	rd_CompRenamerData.strRename = {"en": "Rename"};
	rd_CompRenamerData.strHelp = {"en": "?"};
	rd_CompRenamerData.strMinAE100 = {en: "This script requires Adobe After Effects CS5 or later."};
	rd_CompRenamerData.strHelpText = 
	{
		"en": "Copyright (c) 2005-2013 redefinery (Jeffrey R. Almasol). \n" +
		"All rights reserved.\n" +
		"\n" +
		"This script displays a palette with controls for renaming the selected compositions in the Project panel. You can use this script to, for example, remove the \" Comp #\" suffix (or localized equivalent in German and French versions of After Effects) added to new compositions whose footage was previously dragged to the New Composition button.\n" +
		"\n" +
		"Notes: Expressions that refer to the existing composition names are not updated, so it's best to use this script after creating a composition.\n" +
		"\n" +
		"Note: This version of the script requires After Effects CS5 or later. It can be used as a dockable panel by placing the script in a ScriptUI Panels subfolder of the Scripts folder, and then choosing this script from the Window menu."
	};
	
	
	
	
	// rd_CompRenamer_localize()
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
	function rd_CompRenamer_localize(strVar)
	{
		var locCode;
		
		switch (app.language)
		{
			case Language.GERMAN:
				locCode = "de";
				break;
			case Language.FRENCH:
				locCode = "fr";
				break;
			case Language.JAPANESE:
				locCode = "jp";
				break;
			case Language.ENGLISH:
			default:
				locCode = "en";
		}
		
		if (locCode in strVar)
			return strVar[locCode];
		else
			return strVar["en"];
	}
	
	
	
	
	// rd_CompRenamer_buildUI()
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
	function rd_CompRenamer_buildUI(thisObj)
	{
		var pal = (thisObj instanceof Panel) ? thisObj : new Window("palette", rd_CompRenamerData.scriptName, undefined, {resizeable:true});
		
		if (pal !== null)
		{
			var res =
			"group { \
				orientation:'column', alignment:['fill','top'], \
				header: Group { \
					alignment:['fill','top'], \
					title: StaticText { text:'" + rd_CompRenamerData.scriptName + "', alignment:['fill','center'] }, \
					help: Button { text:'" + rd_CompRenamer_localize(rd_CompRenamerData.strHelp) +"', maximumSize:[30,20], alignment:['right','center'] }, \
				}, \
				selPnl: Panel { \
					text: '" + rd_CompRenamer_localize(rd_CompRenamerData.strSelectPnl) + "', alignment:['fill','top'], spacing:5, \
					onlyWC1: Checkbox { text:'" + rd_CompRenamer_localize(rd_CompRenamerData.strOnlyWithComp1) + "', alignment:['fill','top'] }, \
					selectComps: Button { text:'" + rd_CompRenamer_localize(rd_CompRenamerData.strSelectComps) + "', alignment:['fill','top'], preferredSize:[-1,20] }, \
				}, \
				namePnl: Panel { \
					text: '" + rd_CompRenamer_localize(rd_CompRenamerData.strNamingPnl) + "', alignment:['fill','top'], spacing:5, \
					delSuffix: Checkbox { text:'" + rd_CompRenamer_localize(rd_CompRenamerData.strRemoveComp1) + "', alignment:['fill','top'] }, \
					addSuffix: Group { \
						alignment:['fill','top'], margins:[0,0,0,0], \
						lbl: StaticText { text:'" + rd_CompRenamer_localize(rd_CompRenamerData.strAddSuffix) + "', alignment:['left','center'] }, \
						fld: EditText { text:'', characters:10, alignment:['fill','center'], preferredSize:[-1,20] }, \
					}, \
				}, \
				cmds: Group { \
					alignment:['right','top'] \
					rename: Button { text:'" + rd_CompRenamer_localize(rd_CompRenamerData.strRename) + "', preferredSize:[-1,20] }, \
				}, \
			} \
			";
			pal.grp = pal.add(res);
			
			pal.layout.layout(true);
			pal.grp.minimumSize = pal.grp.size;
			pal.layout.resize();
			pal.onResizing = pal.onResize = function () {this.layout.resize();}
			
			pal.grp.header.help.onClick = function () {alert(rd_CompRenamerData.scriptTitle + "\n" + rd_CompRenamer_localize(rd_CompRenamerData.strHelpText), rd_CompRenamerData.scriptName);}
			pal.grp.selPnl.onlyWC1.value = true;
			pal.grp.selPnl.selectComps.onClick = rd_CompRenamer_doSelectComps;
			pal.grp.namePnl.delSuffix.value = true;
			pal.grp.cmds.rename.onClick = rd_CompRenamer_doRenameComps;
		}
		
		return pal;
	}
	
	
	
	
	// rd_CompRenamer_doSelectComps()
	// 
	// Description:
	// This callback function selects the specified compositions
	// in the Project window.
	// 
	// Parameters:
	// None.
	// 
	// Returns:
	// Nothing.
	//
	function rd_CompRenamer_doSelectComps()
	{
		var onlyComp1s = this.parent.onlyWC1.value;
		
		if (app.project !== null)
		{
			var items = app.project.items, item;
			
			// Loop through all compositions in the project
			for (var i = 1; i <= items.length; i++)
			{
				item = items[i];
				if (item instanceof CompItem)
				{
					// Don't select comps that end in " Comp 1"; otherwise do
					if (onlyComp1s)
					{
						// Check for names shorter than " Comp 1" or that don't have a " Comp 1" suffix
						//if ((item.name.length < 7) || (item.name.indexOf(" Comp 1") !== (item.name.length-7)))
						if ((item.name.length < 7) || (item.name.match(rd_CompRenamer_localize(rd_CompRenamerData.compNameRE)) === null))
							item.selected = false;
						else
							item.selected = true;
					}
					else
						item.selected = true;
				}
			}
		}
	}
	
	
	
	
	// rd_CompRenamer_doRenameComps()
	// 
	// Description:
	// This callback function renames the selected compositions 
	// based on the settings provided.
	// 
	// Parameters:
	// None.
	// 
	// Returns:
	// Nothing.
	//
	function rd_CompRenamer_doRenameComps()
	{
		if (app.project !== null)
		{
			// Keep track of all selected comps (instead of looping, as renaming might change selection order)
			var selComps = new Array();
			for (var i=0; i < app.project.selection.length; i++)
			{
				if (app.project.selection[i] instanceof CompItem)
					selComps[selComps.length] = app.project.selection[i];
			}
			
			// Encapsulate all operations into a single undo event
			app.beginUndoGroup(rd_CompRenamerData.scriptName);
			
			var item;
			var delSuffix = this.parent.parent.namePnl.delSuffix.value;
			var addSuffix = this.parent.parent.namePnl.addSuffix.fld.text;
			var reText = rd_CompRenamer_localize(rd_CompRenamerData.compNameRE);
			
			// Loop through all selected comps
			for (var i=0; i < selComps.length; i++)
			{
				item = selComps[i];
				
				// Remove " Comp 1" suffix, if requested
				//if (delSuffix && (item.name.indexOf(" Comp 1") === (item.name.length-7)))
				//	item.name = item.name.substr(0, item.name.indexOf(" Comp 1"));
				if (delSuffix && (item.name.match(reText) !== null))
					item.name = item.name.match(reText)[1];
				
				// Add suffix, if requested
				if (addSuffix !== "")
					item.name = item.name + addSuffix;
			}
			
			app.endUndoGroup();
		}
	}
	
	
	
	
	// main code:
	//
	
	// Prerequisites check
	if (parseFloat(app.version) < 10.0)
		alert(rd_CompRenamer_localize(rd_CompRenamerData.strMinAE100), rd_CompRenamerData.scriptName);
	else
	{
		// Build and show the console's floating palette
		var rdcrPal = rd_CompRenamer_buildUI(thisObj);
		if ((rdcrPal !== null) && (rdcrPal instanceof Window))
		{
			// Show the palette
			rdcrPal.center();
			rdcrPal.show();
		}
		else
			rdcrPal.layout.layout(true);
	}
})(this);
