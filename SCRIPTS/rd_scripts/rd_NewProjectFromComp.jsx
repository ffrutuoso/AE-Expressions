// rd_NewProjectFromComp.jsx
// Copyright (c) 2007-2013 redefinery (Jeffrey R. Almasol). All rights reserved.
// check it: www.redefinery.com
// 
// Name: rd_NewProjectFromComp
// Version: 1.2
// 
// Description:
// This script saves separate projects for each selected 
// composition.
// 
// Note: This script requires After Effects 7.0 or later.
// 
// Originally requested by David Torno.
// 
// Legal stuff:
// This script is provided "as is," without warranty of any kind, expressed
// or implied. In no event shall the author be held liable for any damages 
// arising in any way from the use of this script.
// 
// In other words, I'm just trying to share knowledge with and help out my
// fellow AE script heads, so don't blame me if my code doesn't rate. :-)




// rd_NewProjectFromComp()
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
(function rd_NewProjectFromComp()
{
	// Globals
	
	var rd_NewProjectFromCompData = new Object();	// Store globals in an object
	rd_NewProjectFromCompData.scriptName = "rd: New Project From Comp";
	rd_NewProjectFromCompData.scriptTitle = rd_NewProjectFromCompData.scriptName + " v1.2";
	
	rd_NewProjectFromCompData.strHelp = {en: "?"};
	rd_NewProjectFromCompData.strSaveProjFirst = {en: "Click OK to save the current project."};
	rd_NewProjectFromCompData.strSaveInstructions = {en: "The current project will be reduced to each selected composition (and its assets). Please specify a project file name for each one. Click OK to begin."};
	rd_NewProjectFromCompData.strErrNoCompsSel = {en: "Cannot perform operation. Please select at least one composition in the Project window, and try again."};
	rd_NewProjectFromCompData.strMinAE70 = {en: "This script requires Adobe After Effects 7.0 or later."};
	rd_NewProjectFromCompData.strHelpText = 
	{
		en: "Copyright (c) 2007-2013 redefinery (Jeffrey R. Almasol). \n" +
		"All rights reserved.\n" +
		"\n" +
		"This script saves separate projects for each selected \n" +
		"composition.\n" +
		"\n" +
		"Note: This script requires After Effects 7.0 or later.\n" +
		"\n" +
		"Originally requested by David Torno.\n"
	};
	
	
	
	
	// rd_NewProjectFromComp_localize()
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
	function rd_NewProjectFromComp_localize(strVar)
	{
		return strVar["en"];
	}
	
	
	
	
	// main code:
	//
	
	// Prerequisites check
	if (parseFloat(app.version) < 7.0)
		alert(rd_NewProjectFromComp_localize(rd_NewProjectFromCompData.strMinAE70), rd_NewProjectFromCompData.scriptName);
	else
	{
		// Make sure only a single comp is selected
		if (app.project === null)
			return;
		
		// Keep track of item numbers (not actual items, as we need to reload the project after each time)
		var comps = new Array();
		
		for (var i=1; i<=app.project.numItems; i++)
		{
			if (app.project.item(i).selected && (app.project.item(i) instanceof CompItem))
				comps[comps.length] = i;
		}
		
		if (comps.length < 1)
		{
			alert(rd_NewProjectFromComp_localize(rd_NewProjectFromCompData.strErrNoCompsSel), rd_NewProjectFromCompData.scriptName);
			return;
		}
		
		// Make sure the project is saved first
		alert(rd_NewProjectFromComp_localize(rd_NewProjectFromCompData.strSaveProjFirst), rd_NewProjectFromCompData.scriptName);
		app.project.saveWithDialog();
		if (app.project.file === null)
			return;
		
		alert(rd_NewProjectFromComp_localize(rd_NewProjectFromCompData.strSaveInstructions), rd_NewProjectFromCompData.scriptName);
		
		// Reduce the project to the selected comp
		app.beginUndoGroup(rd_NewProjectFromCompData.scriptName);
		
		var projFile = app.project.file;
		
		for (var i=0; i<comps.length; i++)
		{
			try
			{
				// Reduce project
				app.project.reduceProject(app.project.items[comps[i]]);
				
				// Ask the user to save the project under a new name
				app.project.saveWithDialog();
			}
			catch (e)
			{}
			
			// Reopen project
			app.open(projFile);
		}
		
		app.endUndoGroup();
	}
})();
