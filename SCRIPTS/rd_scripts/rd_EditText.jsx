// rd_EditText.jsx
// Copyright (c) 2006-2013 redefinery (Jeffrey R. Almasol). All rights reserved.
// check it: www.redefinery.com
// 
// Name: rd_EditText
// Version: 3.0
// 
// Description:
// This script displays a palette for editing the text of text 
// layers in an unstyled form. If your text layer uses a 
// complex animation, or is difficult to access or is hidden at 
// the current time, editing the text when not animated or 
// style can be useful.
// 
// Although you must have only one text layer selected to 
// retrieve text (using the Get Text button), you can update 
// multiple text layers to the same text (using Set Text).
// 
// Note: You can enter up to a maximum of 255 characters, but 
// if the selected text layer contains more than that, you 
// can still make changes as long as the number of characters 
// does not increase. Also, due to a limitation, if you delete 
// all of the characters on a text layer, the layer will be 
// set to a single blank character.
// 
// Note: If the text uses different character or paragraph 
// styling, these differences will be lost when the text is 
// updated.
// 
// Note: This version of the script requires After Effects CS5 
// or later. It can be used as a dockable panel by placing the 
// script in a ScriptUI Panels subfolder of the Scripts folder, 
// and then choosing this script from the Window menu.
// 
// Originally requested by Paul Dougherty.
// 
// Legal stuff:
// This script is provided "as is," without warranty of any kind, expressed
// or implied. In no event shall the author be held liable for any damages 
// arising in any way from the use of this script.
// 
// In other words, I'm just trying to share knowledge with and help out my
// fellow AE script heads, so don't blame me if my code doesn't rate. :-)




// rd_EditText()
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
(function rd_EditText(thisObj)
{
	// Globals
	
	var rd_EditTextData = new Object();	// Store globals in an object
	rd_EditTextData.scriptName = "rd: Edit Text";
	rd_EditTextData.scriptTitle = rd_EditTextData.scriptName + " v3.0";
	
	rd_EditTextData.maxTextChars = 255;		// Maximum number of characters supported by edittext control
	
	rd_EditTextData.strTextHeading = {en: "Text (up to "+rd_EditTextData.maxTextChars+" characters):"};
	rd_EditTextData.strGetText = {en: "Get Text"};
	rd_EditTextData.strSetText = {en: "Set Text"};
	rd_EditTextData.strHelp = {en: "?"}
	rd_EditTextData.strErrNoCompSel = {en: "Cannot perform operation. Please select or open a single composition in the Project window, and try again."};
	rd_EditTextData.strErrNoSingleTextLayerSel = {en: "Cannot perform operation. Please select a single text layer, and try again."};
	rd_EditTextData.strErrNoTextLayersSel = {en: "Cannot perform operation. Please select at least one text layer, and try again."};
	rd_EditTextData.strMinAE100 = {en: "This script requires Adobe After Effects CS5 or later."};
	rd_EditTextData.strHelpText = 
	{
		en: "Copyright (c) 2006-2013 redefinery (Jeffrey R. Almasol). \n" +
		"All rights reserved.\n" +
		"\n" +
		"This script displays a palette for editing the text of text layers in an unstyled form. If your text layer uses a complex animation, or is difficult to access or is hidden at the current time, editing the text when not animated or style can be useful.\n" +
		"\n" +
		"Although you must have only one text layer selected to retrieve text (using the Get Text button), you can update multiple text layers to the same text (using Set Text).\n" +
		"\n" +
		"Note: You can enter up to a maximum of 255 characters, but if the selected text layer contains more than that, you can still make changes as long as the number of characters does not increase. Also, due to a limitation, if you delete all of the characters on a text layer, the layer will be set to a single blank character.\n" +
		"\n" +
		"Note: If the text uses different character or paragraph styling, these differences will be lost when the text is updated.\n" +
		"\n" +
		"Note: This version of the script requires After Effects CS5 or later. It can be used as a dockable panel by placing the script in a ScriptUI Panels subfolder of the Scripts folder, and then choosing this script from the Window menu.\n" + 
		"\n" +
		"Originally requested by Paul Dougherty."
	};
	
	
	
	
	// rd_EditText_localize()
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
	function rd_EditText_localize(strVar)
	{
		return strVar["en"];
	}
	
	
	
	
	// rd_EditText_buildUI()
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
	function rd_EditText_buildUI(thisObj)
	{
		var pal = (thisObj instanceof Panel) ? thisObj : new Window("palette", rd_EditTextData.scriptName, undefined, {resizeable:true});
		
		if (pal !== null)
		{
			var res =
			"group { \
				orientation:'column', alignment:['fill','fill'], \
				header: Group { \
					alignment:['fill','top'], \
					title: StaticText { text:'" + rd_EditTextData.scriptName + "', alignment:['fill','center'] }, \
					help: Button { text:'" + rd_EditText_localize(rd_EditTextData.strHelp) +"', maximumSize:[30,20], alignment:['right','center'] }, \
				}, \
				textField: EditText { alignment:['fill','fill'], properties:{multiline:true} }, \
				cmds: Group { \
					alignment:['fill','bottom'], \
					getTextBtn: Button { text:'" + rd_EditText_localize(rd_EditTextData.strGetText) + "', alignment:['right','bottom'], preferredSize:[-1,20] }, \
					setTextBtn: Button { text:'" + rd_EditText_localize(rd_EditTextData.strSetText) + "', alignment:['right','bottom'], preferredSize:[-1,20] }, \
				}, \
			}";
			pal.grp = pal.add(res);
			
			pal.grp.textField.preferredSize = [100,40];
			
			pal.layout.layout(true);
			pal.grp.minimumSize = pal.grp.size;
			pal.layout.resize();
			pal.onResizing = pal.onResize = function () {this.layout.resize();}
			
			pal.grp.header.help.onClick = function () {alert(rd_EditTextData.scriptTitle + "\n" + rd_EditText_localize(rd_EditTextData.strHelpText), rd_EditTextData.scriptName);}
			pal.grp.cmds.getTextBtn.onClick = rd_EditText_doGetText;
			pal.grp.cmds.setTextBtn.onClick = rd_EditText_doSetText;
		}
		
		return pal;
	}
	
	
	
	
	// rd_EditText_getTextLayers()
	// 
	// Description:
	// This function retrieves an array of selected text layers.
	// 
	// Parameters:
	// None.
	// 
	// Returns:
	// Array of text layers selected.
	//
	function rd_EditText_getSelectedTextLayers()
	{
		var textLayers = new Array();
		
		// Check that a project exists
		if (app.project !== null)
		{
			// Get the current (active/frontmost) comp
			var comp = app.project.activeItem;
			
			if ((comp !== null) && (comp instanceof CompItem))
			{
				// Search the selected layers for text layers
				for (var i=0; i<comp.selectedLayers.length; i++)
					if (comp.selectedLayers[i].property("sourceText") !== null)
						textLayers[textLayers.length] = comp.selectedLayers[i];
			}
		}
		
		return textLayers;
	}
	
	
	
	
	// rd_EditText_doGetText()
	// 
	// Description:
	// This function retrieves the text for the selected text layer.
	// 
	// Parameters:
	// None.
	// 
	// Returns:
	// Nothing.
	//
	function rd_EditText_doGetText()
	{
		// Check that a project exists
		if (app.project === null)
			return;
		
		// Get the current (active/frontmost) comp
		var comp = app.project.activeItem;
		
		if ((comp === null) || !(comp instanceof CompItem))
		{
			alert(rd_EditText_localize(rd_EditTextData.strErrNoCompSel), rd_EditTextData.scriptName);
			return;
		}
		
		// Get the selected text layers
		var textLayers = rd_EditText_getSelectedTextLayers();
		
		// Make sure we have only one text layer selected
		if (textLayers.length !== 1)
		{
			alert(rd_EditText_localize(rd_EditTextData.strErrNoSingleTextLayerSel), rd_EditTextData.scriptName);
			return;
		}
		
		var rawText = textLayers[0].property("sourceText").value.text;
		// On Windows only, include newlines with carriage returns so that multi-line text appears as expected
		if ($.os.indexOf("Windows") !== -1)
			rawText = rawText.replace(/\r/g, "\r\n");
		
		// Visualize carriage returns as separate lines in the text field
		rdetPal.grp.textField.text = new TextDocument(rawText);
	}
	
	
	
	
	// rd_EditText_doSetText()
	// 
	// Description:
	// This function updates the text for the selected text layers.
	// 
	// Parameters:
	// None.
	// 
	// Returns:
	// Nothing.
	//
	function rd_EditText_doSetText()
	{
		// Check that a project exists
		if (app.project === null)
			return;
		
		// Get the current (active/frontmost) comp
		var comp = app.project.activeItem;
		
		if ((comp === null) || !(comp instanceof CompItem))
		{
			alert(rd_EditText_localize(rd_EditTextData.strErrNoCompSel), rd_EditTextData.scriptName);
			return;
		}
		
		// Get the selected text layers
		var textLayers = rd_EditText_getSelectedTextLayers();
		
		// Make sure we have at least one text layer selected
		if (textLayers.length < 1)
		{
			alert(rd_EditText_localize(rd_EditTextData.strErrNoTextLayersSel), rd_EditTextData.scriptName);
			return;
		}
		
		// Perform the actual updating of selected text layers
		app.beginUndoGroup(rd_EditTextData.scriptName);
		
		var newText = this.parent.parent.textField.text;
		var currTime = comp.time;
		
		// Due to a limitation with setting a text layer to a blank string, we need to set it to a blank character
		if (newText === "")
			newText = " ";
		newText = new TextDocument(newText);
		
		for (var i=0; i<textLayers.length; i++)
		{
			// Create a Source Text key only if previous keyframed
			if (textLayers[i].property("sourceText").numKeys > 0)
				textLayers[i].property("sourceText").setValueAtTime(currTime, newText);
			else
				textLayers[i].property("sourceText").setValue(newText);
		}
		
		app.endUndoGroup();
	}
	
	
	
	
	// main code:
	//
	
	// Prerequisites check
	if (parseFloat(app.version) < 10.0)
		alert(rd_EditText_localize(rd_EditTextData.strMinAE100), rd_EditTextData.scriptName);
	else
	{
		// Build and show the console's floating palette
		var rdetPal = rd_EditText_buildUI(thisObj);
		if (rdetPal !== null)
		{
			rd_EditText_doGetText();
			
			if (rdetPal instanceof Window)
			{
				// Show the palette
				rdetPal.center();
				rdetPal.show();
			}
			else
				rdetPal.layout.layout(true);
		}
	}
})(this);
