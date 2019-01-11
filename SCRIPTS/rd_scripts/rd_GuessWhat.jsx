// rd_GuessWhat.jsx
// Copyright (c) 2006-2013 redefinery (Jeffrey R. Almasol). All rights reserved.
// check it: www.redefinery.com
// 
// Name: rd_GuessWhat
// Version: 3.0
// 
// Description:
// This script displays a palette with controls for guessing the
// alpha mode and/or pulldown of the selected footage items. Basically,
// a batch mode for these operations.
// 
// If a proxy is active for a footage item, the operation will be
// applied to the proxy, not the main footage.
// 
// Note: After the operation finishes, the info appearing next to the
// selected footage item in the Project panel might not update to
// reflect the guessed setting, so deselect and then reselect it to
// view the current setting.
// 
// Note: This version of the script requires After Effects CS3 
// or later. It can be used as a dockable panel by placing the 
// script in a ScriptUI Panels subfolder of the Scripts folder, 
// and then choosing this script from the Window menu.
// 
// Originally requested by Matt Silverman.
// 
// Legal stuff:
// This script is provided "as is," without warranty of any kind, expressed
// or implied. In no event shall the author be held liable for any damages 
// arising in any way from the use of this script.
// 
// In other words, I'm just trying to share knowledge with and help out my
// fellow AE script heads, so don't blame me if my code doesn't rate. :-)




// rd_GuessWhat()
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
(function rd_GuessWhat(thisObj)
{
	// Globals
	
	var rd_GuessWhatData = new Object();	// Store globals in an object
	rd_GuessWhatData.scriptName = "rd: Guess What";
	rd_GuessWhatData.scriptTitle = rd_GuessWhatData.scriptName + " v3.0";
	
	rd_GuessWhatData.strGuessAlpha = {en: "Guess Alpha"};
	rd_GuessWhatData.strGuess32Pulldown = {en: "Guess 3:2 Pulldown"};
	rd_GuessWhatData.strGuess24PaPulldown = {en: "Guess 24Pa Pulldown"};
	rd_GuessWhatData.strHelp = {en: "?"};
	rd_GuessWhatData.strErrNoSelFootage = {en: "Cannot perform operation. Please select at least one footage item in the Project panel, and try again."};
	rd_GuessWhatData.strMinAE80 = {en: "This script requires Adobe After Effects CS3 or later."};
	rd_GuessWhatData.strHelpText = 
	{
		"en": "Copyright (c) 2006-2013 redefinery (Jeffrey R. Almasol). \n" +
		"All rights reserved.\n" +
		"\n" +
		"This script displays a palette with controls for guessing the alpha mode and/or pulldown of the selected footage items. Basically, a batch mode for these operations.\n" +
		"\n" +
		"If a proxy is active for a footage item, the operation will be applied to the proxy, not the main footage.\n" +
		"\n" +
		"Note: After the operation finishes, the info appearing next to the selected footage item in the Project panel might not pdate to reflect the guessed setting, so deselect and then reselect it to view the current setting.\n" +
		"\n" +
		"Note: This version of the script requires After Effects CS3 or later. It can be used as a dockable panel by placing the script in a ScriptUI Panels subfolder of the Scripts folder, and then choosing this script from the Window menu.\n" +
		"\n" +
		"Originally requested by Matt Silverman."
	};
	
	
	
	
	// rd_GuessWhat_localize()
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
	function rd_GuessWhat_localize(strVar)
	{
		return strVar["en"];
	}
	
	
	
	
	// rd_GuessWhat_buildUI()
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
	function rd_GuessWhat_buildUI(thisObj)
	{
		var pal = (thisObj instanceof Panel) ? thisObj : new Window("palette", rd_GuessWhatData.scriptName, undefined, {resizeable:true});
		
		if (pal !== null)
		{
			var res =
			"group { \
				orientation:'column', alignment:['fill','fill'], \
				header: Group { \
					alignment:['fill','top'], \
					title: StaticText { text:'" + rd_GuessWhatData.scriptName + "', alignment:['fill','center'] }, \
					help: Button { text:'" + rd_GuessWhat_localize(rd_GuessWhatData.strHelp) +"', maximumSize:[30,20], alignment:['right','center'] }, \
				}, \
				guessAlpha: Button { text:'" + rd_GuessWhat_localize(rd_GuessWhatData.strGuessAlpha) + "', alignment:['fill','top'], preferredSize:[-1,20] }, \
				guess32Pulldown: Button { text:'" + rd_GuessWhat_localize(rd_GuessWhatData.strGuess32Pulldown) + "', alignment:['fill','top'], preferredSize:[-1,20] }, \
				guess24PaPulldown: Button { text:'" + rd_GuessWhat_localize(rd_GuessWhatData.strGuess24PaPulldown) + "', alignment:['fill','top'], preferredSize:[-1,20] }, \
			} \
			";
			pal.grp = pal.add(res);
			
			pal.layout.layout(true);
			pal.grp.minimumSize = pal.grp.size;
			pal.layout.resize();
			pal.onResizing = pal.onResize = function () {this.layout.resize();}
			
			pal.grp.guessAlpha.onClick = function () {rd_GuessWhat_doGuessWhat(1);}			// 1 = guess alpha
			pal.grp.guess32Pulldown.onClick = function () {rd_GuessWhat_doGuessWhat(2);}		// 2 = guess 3:2 pulldown
			pal.grp.guess24PaPulldown.onClick = function () {rd_GuessWhat_doGuessWhat(3);}	// 3 = guess 24Pa pulldown
			
			pal.grp.header.help.onClick = function () {alert(rd_GuessWhatData.scriptTitle + "\n" + rd_GuessWhat_localize(rd_GuessWhatData.strHelpText), rd_GuessWhatData.scriptName);}
		}
		
		return pal;
	}
	
	
	
	
	// rd_GuessWhat_doGuessWhat()
	// 
	// Description:
	// This callback function performs the selected guess operations
	// on the selected footage items.
	// 
	// Parameters:
	//   op - Integer representing the guess operation:
	//     1 = guess alpha
	//     2 = guess 3:2 pulldown
	//     3 = guess 24Pa pulldown
	// 
	// Returns:
	// Nothing.
	//
	function rd_GuessWhat_doGuessWhat(op)
	{
		// Check that a project exists
		if (app.project === null)
		{
			alert(rd_GuessWhat_localize(rd_GuessWhatData.strErrNoProj), rd_GuessWhatData.scriptName);
			return;
		}
		
		var proj = app.project;
		
		// Check for at least one selected item; no pre-check of footage item yet
		if (proj.selection.length === 0)
		{
			alert(rd_GuessWhat_localize(rd_GuessWhatData.strErrNoSelFootage), rd_GuessWhatData.scriptName);
			return;
		}
		
		// Do the work
		app.beginUndoGroup(rd_GuessWhatData.scriptName);
		
		var selItem, footageSrc;
		for (var i=0; i<proj.selection.length; i++)
		{
			selItem = proj.selection[i];
			
			// Check if a footage item
			if (selItem.typeName === "Footage")
			{
				// Check if footage has a proxy or not
				footageSrc = selItem.useProxy ? selItem.proxySource : selItem.mainSource;
				
				try
				{
					switch (op)
					{
						case 1:	// alpha
							footageSrc.guessAlphaMode();
							break;
						case 2:	// 3:2 pulldown
							footageSrc.guessPulldown(PulldownMethod.PULLDOWN_3_2);
							break;
						case 3:	// 24Pa pulldown
							footageSrc.guessPulldown(PulldownMethod.ADVANCE_24P);
							break;
						default:
							break;
					}
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
	var rdgwPal = rd_GuessWhat_buildUI(thisObj);
	if (rdgwPal !== null)
	{
		if (rdgwPal instanceof Window)
		{
			rdgwPal.center();
			rdgwPal.show();
		}
		else
			rdgwPal.layout.layout(true);
	}
})(this);
