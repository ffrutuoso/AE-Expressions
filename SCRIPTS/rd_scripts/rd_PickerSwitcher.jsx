// rd_PickerSwitcher.jsx
// Copyright (c) 2006-2013 redefinery (Jeffrey R. Almasol). All rights reserved.
// check it: www.redefinery.com
// 
// Name: rd_PickerSwitcher
// Version: 1.2
// 
// Description:
// This script toggles the Use System Color Picker setting in the General
// Preferences dialog box. Use this script when you prefer to use the
// Adobe color picker for certain tasks, but the system's color picker for
// others, and want a quick way to change this setting.
// 
// Note: You must save your preferences at least once before this script
// can toggle the color picker setting.
// 
// Note: This script requires After Effects 6.5 or later.
// 
// Originally requested by Barry Munsterteiger.
// 
// Legal stuff:
// This script is provided "as is," without warranty of any kind, expressed
// or implied. In no event shall the author be held liable for any damages 
// arising in any way from the use of this script.
// 
// In other words, I'm just trying to share knowledge with and help out my
// fellow AE script heads, so don't blame me if my code doesn't rate. :-)




// rd_PickerSwitcher()
// 
// Description:
// This function contains the main logic for this script.
// 
// Parameters:
// None
// 
// Returns:
// Nothing.
//
(function rd_PickerSwitcher()
{
	// Globals
	
	var rd_PickerSwitcherData = new Object();	// Store globals in an object
	rd_PickerSwitcherData.scriptName = "rd: Picker Switcher";
	rd_PickerSwitcherData.scriptTitle = rd_PickerSwitcherData.scriptName + " v1.2";
	
	rd_PickerSwitcherData.strUsingAdobePicker = {en: "Now using the Adobe color picker."};
	rd_PickerSwitcherData.strUsingSystemPicker = {en: "Now using the system color picker."};
	rd_PickerSwitcherData.strErrCantChangePrefs = {en: "Cannot retrieve or set the preferences setting for the color picker. No change was made.\n\nIf you have not previously updated your preferences, do so (click OK in the Preferences dialog box), and then try again."};
	rd_PickerSwitcherData.strMinAE65 = {en: "This script requires Adobe After Effects 6.5 or later."};
	rd_PickerSwitcherData.strHelpText = 
	{
		en: "Copyright (c) 2006-2013 redefinery (Jeffrey R. Almasol). \n" +
		"All rights reserved.\n" +
		"\n" +
		"This script toggles the Use System Color Picker setting in \n" +
		"the General Preferences dialog box. Use this script when \n" +
		"you prefer to use the Adobe color picker for certain \n" +
		"tasks, but the system's color picker for others, and want \n" +
		"a quick way to change this setting.\n" +
		"\n" +
		"Note: You must save your preferences at least once before \n" +
		"this script can toggle the color picker setting.\n" +
		"\n" +
		"Note: This script requires After Effects 6.5 or later.\n" +
		"\n" +
		"Originally requested by Barry Munsterteiger."
	};
	
	
	
	
	// rd_localize()
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
	function rd_localize(strVar)
	{
		return strVar["en"];
	}
	
	
	
	
	// doPickerSwitcher()
	// 
	// Description:
	// This function performs the actual toggling of the Use System
	// Color Picker preference setting.
	// 
	// Parameters:
	// None.
	// 
	// Returns:
	// Nothing.
	//
	function doPickerSwitcher()
	{
		// Do the work
		app.beginUndoGroup(rd_PickerSwitcherData.scriptName);
		
		try
		{
			// Toggle the pref, save to disk, and reload so it's active in the current session
			if (parseFloat(app.version) >= 12.0)
			{
				var newSetting = +!(app.preferences.getPrefAsLong("Main Pref Section v2", "Use Adobe Color Picker", PREFType.PREF_Type_MACHINE_INDEPENDENT) === 1);
				
				app.preferences.savePrefAsLong("Main Pref Section v2", "Use Adobe Color Picker", newSetting, PREFType.PREF_Type_MACHINE_INDEPENDENT);
			}
			else
			{
				var newSetting = +!(app.preferences.getPrefAsLong("Main Pref Section", "Use Adobe Color Picker") === 1);
				
				app.preferences.savePrefAsLong("Main Pref Section", "Use Adobe Color Picker", newSetting);
			}
			app.preferences.saveToDisk();
			app.preferences.reload();
			
			if (newSetting === 0)
				alert(rd_localize(rd_PickerSwitcherData.strUsingSystemPicker), rd_PickerSwitcherData.scriptName);
			else
				alert(rd_localize(rd_PickerSwitcherData.strUsingAdobePicker), rd_PickerSwitcherData.scriptName);
		}
		catch (e)
		{
			alert(rd_localize(rd_PickerSwitcherData.strErrCantChangePrefs), rd_PickerSwitcherData.scriptName);
		}
		
		app.endUndoGroup();
	}
	
	
	
	
	// main code:
	//
	
	// Prerequisite check for After Effects 6.5 or later
	if (parseFloat(app.version) < 6.5)
		alert(rd_localize(rd_PickerSwitcherData.strMinAE65), rd_PickerSwitcherData.scriptName);
	else
		doPickerSwitcher();
})();
