// rd_GetSmart.jsx
// Copyright (c) 2005-2013 redefinery (Jeffrey R. Almasol). All rights reserved.
// check it: www.redefinery.com
// 
// Name: rd_GetSmart
// Version: 3.0
// 
// Description:
// This script displays a palette with controls for fixing 
// various "plain text" punctuation into their "smart" 
// typographical representations. For example:
// -- straight single/double quotes --> curly single/double quotes
// -- backticks/apostrophes --> left/right curly quotes
// -- less-than/greather-than --> angle quotes
// -- three periods (...) --> ellipsis
// -- two (--) and three (---) dashes --> en and em dashes
// -- (c) or (C) --> copyright symbols
// -- (r) or (R) --> registered trademark symbols
// -- (tm) or (TM) --> trademark symbols
// -- 1/4, 1/2, 3/4, 0/00 --> fractions
// 
// This script is useful if you've copied this type of text from 
// another application, but don't want to fix them manually, or 
// fix them in the original application and re-paste them into 
// your text layers. Now who wants to do that?!
// 
// You can choose to update the text layers in the current 
// composition, selected compositions, or all compositions in 
// the Project panel. All Source Text keyframes are updated 
// automatically.
// 
// Note: If your text layers haven't been renamed and they are 
// referred to in expressions, the expressions will not be 
// updated with the new text layer names. So, run this script or 
// rename your text layers before using them in expressions.
// 
// Note: This version of the script requires After Effects CS3 
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




// rd_GetSmart()
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
(function rd_GetSmart(thisObj)
{
	// Globals
	
	var rd_GetSmartData = new Object();	// Store globals in an object
	rd_GetSmartData.scriptName = "rd: Get Smart";
	rd_GetSmartData.scriptTitle = rd_GetSmartData.scriptName + " v3.0";
	
	rd_GetSmartData.strConvertPnl = {en: "Convert"};
	rd_GetSmartData.strConvertStraightDQuotes = {en: "Straight double quote (\\\"...\\\") to curly double quote (\u201C...\u201D)"};
	rd_GetSmartData.strConvertStraightSQuotes = {en: "Straight single quote (\\'...\\') to curly single quote (\u2018...\u2019)"};
	rd_GetSmartData.strConvertStraightAltLR = {en: "Alternate Left/Right Quotes"};
	rd_GetSmartData.strConvertStraightROnly = {en: "Right Quote Only"};
	rd_GetSmartData.strConvertBacktickQuotes = {en: "Backticks/quotes (``...\\'\\', `) to curly quotes (\u201C...\u201D, \u2018)"};
	rd_GetSmartData.strConvertAngleQuotes = {en: "Less-than/greater-than (<<...>>) to angle quotes (\u00AB...\u00BB)"};
	rd_GetSmartData.strConvertTwoThreeDashes = {en: "Dashes (-- and ---) to en-dash (\u2013) and em-dash (\u2014)"};
	rd_GetSmartData.strConvertThreePeriods = {en: "Three periods (...) to ellipsis (\u2026)"};
	rd_GetSmartData.strConvertCopyright = {en: "(C) or (c) to copyright \u00A9 symbol "};
	rd_GetSmartData.strConvertRegisteredTM = {en: "(R) or (r) to registered trademark \u00AE symbol"};
	rd_GetSmartData.strConvertTrademark = {en: "(TM) or (tm) to trademark \u2122 symbol"};
	rd_GetSmartData.strConvertFractions = {en: "1/4, 1/2, 3/4, 0/00 to fractions"}; // (\u00BC, \u00BD, \u00BE)"};
	//rd_GetSmartData.strConvertSymbols = {en: "<--, <-->, -->, :-) to symbols (\u2190, \u2194, \u2192, \u263A)"};
	rd_GetSmartData.strProcess = {en: "Process"};
	rd_GetSmartData.strProcessCurrComp = {en: "Current Comp"};
	rd_GetSmartData.strProcessSelComps = {en: "Selected Comps"};
	rd_GetSmartData.strProcessAllComps = {en: "All Comps"};
	rd_GetSmartData.strErrNoCompSel = {en: "Cannot perform operation. Please select a single composition in the Project panel, and try again."};
	rd_GetSmartData.strErrNoMulCompSel = {en: "Cannot perform operation. Please select at least one composition in the Project panel, and try again."};
	rd_GetSmartData.strErrNoComps = {en: "Cannot perform operation. Please create at least one composition in the Project panel, and try again."};
	rd_GetSmartData.strSmartenUp = {en: "Smarten Up"};
	rd_GetSmartData.strHelp = {en: "?"};
	rd_GetSmartData.strMinAE80 = {en: "This script requires Adobe After Effects CS3 or later."};
	rd_GetSmartData.strHelpText = 
	{
		en: "Copyright (c) 2005-2013 redefinery (Jeffrey R. Almasol). \n" +
		"All rights reserved.\n" +
		"\n" +
		"This script displays a palette with controls for fixing various \"plain text\" punctuation into their \"smart\" typographical representations. For example:\n" +
		"-- straight single/double quotes --> curly single/double quotes\n" +
		"-- backticks/apostrophes --> left/right curly quotes\n" +
		"-- less-than/greather-than --> angle quotes\n" +
		"-- three periods (...) --> ellipsis\n" +
		"-- two (--) and three (---) dashes --> en and em dashes\n" +
		"-- (c) or (C) --> copyright symbols\n" +
		"-- (r) or (R) --> registered trademark symbols\n" +
		"-- (tm) or (TM) --> trademark symbols\n" +
		"-- 1/4, 1/2, 3/4, 0/00 --> fractions\n" +
		"\n" +
		"This script is useful if you've copied this type of text from another application, but don't want to fix them manually, or fix them in the original application and re-paste them into your text layers. Now who wants to do that?!\n" +
		"\n" +
		"You can choose to update the text layers in the current composition, selected compositions, or all compositions in the Project panel. All Source Text keyframes are updated automatically.\n" +
		"\n" +
		"Note: If your text layers haven't been renamed and they are referred to in expressions, the expressions will not be updated with the new text layer names. So, run this script or rename your text layers before using them in expressions.\n" +
		"\n" +
		"Note: This version of the script requires After Effects CS3 or later. It can be used as a dockable panel by placing the script in a ScriptUI Panels subfolder of the Scripts folder, and then choosing this script from the Window menu."
	};
	
	
	
	
	// rd_GetSmart_localize()
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
	function rd_GetSmart_localize(strVar)
	{
		return strVar["en"];
	}
	
	
	
	
	// rd_GetSmart_buildUI()
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
	function rd_GetSmart_buildUI(thisObj)
	{
		var pal = (thisObj instanceof Panel) ? thisObj : new Window("palette", rd_GetSmartData.scriptName, undefined, {resizeable:true});
		
		if (pal !== null)
		{
			var res = 
			"group { \
				orientation:'column', alignment:['fill','top'], \
				header: Group { \
					alignment:['fill','top'], \
					title: StaticText { text:'" + rd_GetSmartData.scriptName + "', alignment:['fill','center'] }, \
					help: Button { text:'" + rd_GetSmart_localize(rd_GetSmartData.strHelp) +"', maximumSize:[30,20], alignment:['right','center'] }, \
				}, \
				convertPnl: Panel { \
					text:'" + rd_GetSmart_localize(rd_GetSmartData.strConvertPnl) + "', alignment:['fill','top'], \
					straightDQuotes: Checkbox { text:'" + rd_GetSmart_localize(rd_GetSmartData.strConvertStraightDQuotes) + "', value:true, alignment:['fill','top'] }, \
					optsD: Group { \
						alignment:['fill','top'], alignChildren:['fill','top'], margins:[20,0,0,0], \
						straightQuotesAltLR: RadioButton { text:'" + rd_GetSmart_localize(rd_GetSmartData.strConvertStraightAltLR) + "', value:true }, \
						straightQuotesROnly: RadioButton { text:'" + rd_GetSmart_localize(rd_GetSmartData.strConvertStraightROnly) + "' }, \
					}, \
					straightSQuotes: Checkbox { text:'" + rd_GetSmart_localize(rd_GetSmartData.strConvertStraightSQuotes) + "', value:true, alignment:['fill','top'] }, \
					optsS: Group { \
						alignment:['fill','top'], alignChildren:['fill','top'], margins:[20,0,0,0], \
						straightQuotesAltLR: RadioButton { text:'" + rd_GetSmart_localize(rd_GetSmartData.strConvertStraightAltLR) + "', value:true }, \
						straightQuotesROnly: RadioButton { text:'" + rd_GetSmart_localize(rd_GetSmartData.strConvertStraightROnly) + "' }, \
					}, \
					backtickQuotes: Checkbox { text:'" + rd_GetSmart_localize(rd_GetSmartData.strConvertBacktickQuotes) + "', value:true, alignment:['fill','top'] }, \
					angleQuotes: Checkbox { text:'" + rd_GetSmart_localize(rd_GetSmartData.strConvertAngleQuotes) + "', value:true, alignment:['fill','top'] }, \
					twoThreeDashes: Checkbox { text:'" + rd_GetSmart_localize(rd_GetSmartData.strConvertTwoThreeDashes) + "', value:true, alignment:['fill','top'] }, \
					threePeriods: Checkbox { text:'" + rd_GetSmart_localize(rd_GetSmartData.strConvertThreePeriods) + "', value:true, alignment:['fill','top'] }, \
					copyright: Checkbox { text:'" + rd_GetSmart_localize(rd_GetSmartData.strConvertCopyright) + "', value:true, alignment:['fill','top'] }, \
					registeredTM: Checkbox { text:'" + rd_GetSmart_localize(rd_GetSmartData.strConvertRegisteredTM) + "', value:true, alignment:['fill','top'] }, \
					trademark: Checkbox { text:'" + rd_GetSmart_localize(rd_GetSmartData.strConvertTrademark) + "', value:true, alignment:['fill','top'] }, \
					fractions: Checkbox { text:'" + rd_GetSmart_localize(rd_GetSmartData.strConvertFractions) + "', value:true, alignment:['fill','top'] }, \
				}, \
				processPnl: Panel { \
					text:'" + rd_GetSmart_localize(rd_GetSmartData.strProcess) + "', orientation:'row', alignment:['fill','top'], alignChildren:['fill','top'], \
					currComp: RadioButton { text:'" + rd_GetSmart_localize(rd_GetSmartData.strProcessCurrComp) + "', value:true }, \
					selComps: RadioButton { text:'" + rd_GetSmart_localize(rd_GetSmartData.strProcessSelComps) + "' }, \
					allComps: RadioButton { text:'" + rd_GetSmart_localize(rd_GetSmartData.strProcessAllComps) + "' }, \
				}, \
				cmds: Group { \
					alignment:['right','top'], \
					smartenUpBtn: Button { text:'" + rd_GetSmart_localize(rd_GetSmartData.strSmartenUp) + "', preferredSize:[-1,20] }, \
				}, \
			}";
			pal.grp = pal.add(res);
							
			pal.layout.layout(true);
			pal.grp.minimumSize = pal.grp.size;
			pal.layout.resize();
			pal.onResizing = pal.onResize = function () {this.layout.resize();}
			
			pal.grp.convertPnl.straightDQuotes.onClick = function ()
			{
				// Enable or disable the radio buttons as necessary
				this.parent.optsD.straightQuotesAltLR.enabled = this.value;
				this.parent.optsD.straightQuotesROnly.enabled = this.value;
			}
			
			pal.grp.convertPnl.straightSQuotes.onClick = function ()
			{
				// Enable or disable the radio buttons as necessary
				this.parent.optsS.straightQuotesAltLR.enabled = this.value;
				this.parent.optsS.straightQuotesROnly.enabled = this.value;
			}
		
			pal.grp.header.help.onClick = function () {alert(rd_GetSmartData.scriptTitle + "\n" + rd_GetSmart_localize(rd_GetSmartData.strHelpText), rd_GetSmartData.scriptName);}
			pal.grp.cmds.smartenUpBtn.onClick = rd_GetSmart_doSmartenUp;
		}
		
		return pal;
	}
	
	
	
	
	// rd_GetSmart_doSmartenUp()
	// 
	// Description:
	// This function performs the actual "smartening up" conversion operation.
	// 
	// Parameters:
	// None.
	// 
	// Returns:
	// Nothing.
	//
	function rd_GetSmart_doSmartenUp()
	{
		// getAllComps()
		// 
		// Description:
		// This function retrieves all comps in the Project window.
		// 
		// Parameters:
		// None.
		// 
		// Returns:
		// Array of CompItem objects.
		//
		function getAllComps()
		{
			var comps = new Array();
			
			for (var i=1; i<=app.project.numItems; i++)
				if (app.project.item(i) instanceof CompItem)
					comps[comps.length] = app.project.item(i);
			
			return comps;
		}
		
		
		
		
		// getSelectedComps()
		// 
		// Description:
		// This function retrieves the selected comps in the Project window.
		// 
		// Parameters:
		// None.
		// 
		// Returns:
		// Array of CompItem objects.
		//
		function getSelectedComps()
		{
			var comps = new Array();
			var items = app.project.selection;
			
			for (var i=0; i<items.length; i++)
			{
				if (items[i] instanceof CompItem)
					comps[comps.length] = items[i];
			}
			
			return comps;
		}
		
		
		
		
		// getCurrComps()
		// 
		// Description:
		// This function retrieves the currently selected comp in the Project window.
		// 
		// Parameters:
		// None.
		// 
		// Returns:
		// Array of single CompItem object, or null if no or more than one comp is selected.
		//
		function getCurrComp()
		{
			var comps = getSelectedComps();
			
			if (comps.length === 1)
				return comps;
			else
				return null;
		}
		
		
		
		
		// doSmartenTextValue()
		// 
		// Description:
		// This function converts the selected "dumb" text into "smart" text.
		// 
		// Parameters:
		//   text - The text string to update, if necessary.
		//   pal - The palette UI.
		// 
		// Returns:
		// String representing the possibly updated text.
		//
		function doSmartenTextValue(text, pal)
		{
			var smartenedText = text;
			
			// Backtick quotes - Check before Straight single quotes so it can handle '' before '
			if (pal.convertPnl.backtickQuotes.value)
			{
				// Check two backticks before one backtick to make sure we gobble enough backticks (that sounds gross! :-)
				smartenedText = smartenedText.replace(/``/g, "\u201C");
				smartenedText = smartenedText.replace(/`/g, "\u2018");
				
				smartenedText = smartenedText.replace(/''/g, "\u201D");
			}
			
			// Straight double quotes
			if (pal.convertPnl.straightDQuotes.value)
			{
				var altLRQuotes = pal.convertPnl.optsD.straightQuotesAltLR.value;
				
				if (!altLRQuotes)							// If always right quote, just do a batch conversion
					smartenedText = smartenedText.replace(/\"/g, "\u201D");
				else										// Otherwise, handle per-character because we of special cases
				{
					var newText = "", prevChar = null;
					var nextDQIsLeft = true;
					
					for (var i=0; i<smartenedText.length; i++)
					{
						if (smartenedText[i] === "\"")
						{
							if (prevChar === null)		// First character, so use a left quote
							{
								newText += "\u201C";
								nextDQIsLeft = false;
							}
							else if (prevChar.match(/\s/))	// Previous character was whitespace, so use a left quote
							{
								newText += "\u201C";
								nextDQIsLeft = false;
							}
							else							// Previous character wasn't whitespace, so use selected handling
							{
								newText += (nextDQIsLeft ? "\u201C" : "\u201D");
								nextDQIsLeft = !nextDQIsLeft;
							}
						}
						else
							newText += smartenedText[i];
						
						prevChar = smartenedText[i];
					}
					
					smartenedText = newText;
				}
			}
			
			// Straight single quotes
			if (pal.convertPnl.straightSQuotes.value)
			{
				var altLRQuotes = pal.convertPnl.optsS.straightQuotesAltLR.value;
				
				if (!altLRQuotes)							// If always right quote, just do a batch conversion
					smartenedText = smartenedText.replace(/'/g, "\u2019");
				else										// Otherwise, handle per-character because we of special cases
				{
					var newText = "", prevChar = null;
					var nextSQIsLeft = true;
					
					for (var i=0; i<smartenedText.length; i++)
					{
						if (smartenedText[i] === "'")
						{
							if (prevChar === null)			// First character, so use a left quote
							{
								newText += "\u2018";
								nextSQIsLeft = false;
							}
							else if (prevChar.match(/\s/))	// Previous character was whitespace, so use a left quote
							{
								newText += "\u2018";
								nextSQIsLeft = false;
							}
							else							// Previous character wasn't whitespace, so use selected handling
							{
								newText += (nextSQIsLeft ? "\u2018" : "\u2019");
								nextSQIsLeft = !nextSQIsLeft;
							}
						}
						else
							newText += smartenedText[i];
						
						prevChar = smartenedText[i];
					}
					
					smartenedText = newText;
				}
			}
			
			// Angle quotes
			if (pal.convertPnl.angleQuotes.value)
			{
				smartenedText = smartenedText.replace(/<</g, "\u00AB");
				smartenedText = smartenedText.replace(/>>/g, "\u00BB");
			}
			
			// Two/three dashes
			if (pal.convertPnl.twoThreeDashes.value)
			{
				// Check three dashes before two dashes to make sure we gobble enough dashes
				smartenedText = smartenedText.replace(/\-\-\-/g, "\u2014");
				smartenedText = smartenedText.replace(/\-\-/g, "\u2013");
			}
			
			// Three periods
			if (pal.convertPnl.threePeriods.value)
				smartenedText = smartenedText.replace(/\.\.\./g, "\u2026");
			
			// Copyright symbol
			if (pal.convertPnl.copyright.value)
				smartenedText = smartenedText.replace(/\([cC]\)/g, "\u00A9");
			
			// Registered TM symbol
			if (pal.convertPnl.registeredTM.value)
				smartenedText = smartenedText.replace(/\([rR]\)/g, "\u00AE");
			
			// Trademark symbol
			if (pal.convertPnl.trademark.value)
				smartenedText = smartenedText.replace(/\((tm|TM)\)/g, "\u2122");
			
			// Fractions
			if (pal.convertPnl.fractions.value)
			{
				smartenedText = smartenedText.replace(/1\/4/g, "\u00BC");
				smartenedText = smartenedText.replace(/1\/2/g, "\u00BD");
				smartenedText = smartenedText.replace(/3\/4/g, "\u00BE");
				smartenedText = smartenedText.replace(/0\/00/g, "\u2030");
			}
	//smartenedText = smartenedText.replace(/c\/o/g, "\u2105");
	//smartenedText = smartenedText.replace(/1\/3/g, "\u2153");
	//smartenedText = smartenedText.replace(/:\-\)/g, "\u263A");
	//smartenedText = smartenedText.replace(/\(1\)/g, "\u00B9");
	//smartenedText = smartenedText.replace(/\(2\)/g, "\u00B2");
	//smartenedText = smartenedText.replace(/\(3\)/g, "\u00B3");
	//smartenedText = smartenedText.replace(/\+-/g, "\u00B1");
			
			return smartenedText;
		}
		
		
		// Check that a project exists
		if (app.project === null)
			return;
		
		var proj = app.project;
		
		// Get an array of the specified comps to process
		var comps, comp;
		
		if (this.parent.parent.processPnl.currComp.value)
		{
			comps = getCurrComp();
			if (comps === null)
			{
				alert(rd_GetSmart_localize(rd_GetSmartData.strErrNoCompSel), rd_GetSmartData.scriptName);
				return;
			}
		}
		else if (this.parent.parent.processPnl.selComps.value)
		{
			comps = getSelectedComps();
			if (comps.length === 0)
			{
				alert(rd_GetSmart_localize(rd_GetSmartData.strErrNoMulCompSel), rd_GetSmartData.scriptName);
				return;
			}
		}
		else if (this.parent.parent.processPnl.allComps.value)
		{
			comps = getAllComps();
			if (comps.length === 0)
			{
				alert(rd_GetSmart_localize(rd_GetSmartData.strErrNoComps), rd_GetSmartData.scriptName);
				return;
			}
		}
		
		// Process the specified comps
		var layer, prop, srcText, smartedText;
		
		app.beginUndoGroup(rd_GetSmartData.scriptName);
		
		for (var i=0; i<comps.length; i++)
		{
			comp = comps[i];
			
			// Process the text layers in the current comp
			for (var j=1; j<=comp.numLayers; j++)
			{
				layer = comp.layer(j);
				prop = layer.property("sourceText");
				
				// Check for text layers
				if (prop !== null)
				{
					if (prop.isTimeVarying)
					{
						for (var k=1; k<=prop.numKeys; k++)
						{
							srcText = prop.keyValue(k).text;
							smartedText = doSmartenTextValue(srcText, this.parent.parent);
							if (srcText !== smartedText)
								prop.setValueAtKey(k, new TextDocument(smartedText));
						}
					}
					else
					{
						srcText = prop.value.text;
						smartedText = doSmartenTextValue(srcText, this.parent.parent);
						if (srcText !== smartedText)
							prop.setValue(new TextDocument(smartedText));
					}
				}
			}
		}
		
		app.endUndoGroup();
	}
	
	
	
	
	// main code:
	//
	
	// Prerequisites check
	if (parseFloat(app.version) < 8.0)
		alert(rd_GetSmart_localize(rd_GetSmartData.strMinAE80), rd_GetSmartData.scriptName);
	else
	{
		// Build and show the console's floating palette
		var rdgsPal = rd_GetSmart_buildUI(thisObj);
		if (rdgsPal !== null)
		{
			if (rdgsPal instanceof Window)
			{
				rdgsPal.center();
				rdgsPal.show();
			}
			else
				rdgsPal.layout.layout(true);
		}
	}
})(this);
