// rd_ExprTweaker.jsx
// Copyright (c) 2005-2013 redefinery (Jeffrey R. Almasol). All rights reserved.
// check it: www.redefinery.com
// 
// Name: rd_ExprTweaker
// Version: 3.0
// 
// Description:
// This script modifies expressions based on specific 
// settings. For example, you can convert expressions that 
// use thisComp or this_comp references to specific 
// comp("...") references so that pre-composing the layers 
// that contain those expressions, which refer to layers 
// that are not pre-composed, will still work. You can also 
// process disabled expressions by enabling or removing 
// them easily.
// 
// You can choose to update the expressions in the 
// current composition, selected compositions, or all 
// compositions in the Project panel.
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




// rd_ExprTweaker()
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
(function rd_ExprTweaker(thisObj)
{
	// Globals
	
	var rd_ExprTweakerData = new Object();	// Store globals in an object
	rd_ExprTweakerData.scriptName = "rd: Expression Tweaker";
	rd_ExprTweakerData.scriptTitle = rd_ExprTweakerData.scriptName + " v3.0";
	
	rd_ExprTweakerData.changeThisComp;		// These three are the tweak settings
	rd_ExprTweakerData.disabledExprsOp;
	
	rd_ExprTweakerData.currCompNameRef;		// Keeps track of the current comp's name reference
	
	rd_ExprTweakerData.strTweaksPnl = {en: "Tweaks"};
	rd_ExprTweakerData.strChangeThisComp = {en: "Change this_comp and thisComp to comp(\"\u2026\")"};
	rd_ExprTweakerData.strDisabledExprs = {en: "Disabled Expressions:"};
	rd_ExprTweakerData.strDisabledExprsOpts = {en: ["Don't Change Disable State", "Remove", "Enable"]};
	rd_ExprTweakerData.strProcess = {en: "Process"};
	rd_ExprTweakerData.strProcessCurrComp = {en: "Current Comp"};
	rd_ExprTweakerData.strProcessSelComps = {en: "Selected Comps"};
	rd_ExprTweakerData.strProcessAllComps = {en: "All Comps"};
	rd_ExprTweakerData.strErrNoOp = {en: "No expression tweaks were selected. Select at least one tweak, and try again."};
	rd_ExprTweakerData.strErrNoCompSel = {en: "Cannot perform operation. Please select a single composition in the Project panel, and try again."};
	rd_ExprTweakerData.strErrNoMulCompSel = {en: "Cannot perform operation. Please select at least one composition in the Project panel, and try again."};
	rd_ExprTweakerData.strErrNoComps = {en: "Cannot perform operation. Please create at least one composition in the Project panel, and try again."};
	rd_ExprTweakerData.strUpdateExprs = {en: "Update Expressions"};
	rd_ExprTweakerData.strHelp = {en: "?"};
	rd_ExprTweakerData.strMinAE100 = {en: "This script requires Adobe After Effects CS5 or later."};
	rd_ExprTweakerData.strHelpText = 
	{
		en: "Copyright (c) 2005-2013 redefinery (Jeffrey R. Almasol). \n" +
		"All rights reserved.\n" +
		"\n" +
		"This script modifies expressions based on specific settings. For example, you can convert expressions that use thisComp or this_comp references to specific comp(\"...\") references so that pre-composing the layers that contain those expressions, which refer to layers that are not pre-composed, will still work. You can also process disabled expressions by enabling or removing them easily.\n" +
		"\n" +
		"You can choose to update the expressions in the current composition, selected compositions, or all compositions in the Project panel.\n" +
		"\n" +
		"Note: This version of the script requires After Effects CS5 or later. It can be used as a dockable panel by placing the script in a ScriptUI Panels subfolder of the Scripts folder, and then choosing this script from the Window menu."
	};
	
	
	
	
	// rd_ExprTweaker_localize()
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
	function rd_ExprTweaker_localize(strVar)
	{
		return strVar["en"];
	}
	
	
	
	
	// rd_ExprTweaker_buildUI()
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
	function rd_ExprTweaker_buildUI(thisObj)
	{
		var pal = (thisObj instanceof Panel) ? thisObj : new Window("palette", rd_ExprTweakerData.scriptName, undefined, {resizeable:true});
		
		if (pal !== null)
		{
			var res = 
			"group { \
				orientation:'column', alignment:['fill','top'], \
				header: Group { \
					alignment:['fill','top'], \
					title: StaticText { text:'" + rd_ExprTweakerData.scriptName + "', alignment:['fill','center'] }, \
					help: Button { text:'" + rd_ExprTweaker_localize(rd_ExprTweakerData.strHelp) +"', maximumSize:[30,20], alignment:['right','center'] }, \
				}, \
				tweaksPnl: Panel { \
					text:'" + rd_ExprTweaker_localize(rd_ExprTweakerData.strTweaksPnl) + "', alignment:['fill','top'], spacing:5, \
					changeThisComp: Checkbox { text:'" + rd_ExprTweaker_localize(rd_ExprTweakerData.strChangeThisComp) + "', alignment:['fill','top'] }, \
					grp: Group { \
						margins:[0,0,0,0], alignment:['fill','top'], \
						disabledExprs: StaticText { text:'" + rd_ExprTweaker_localize(rd_ExprTweakerData.strDisabledExprs) + "', alignment:['left','center'] }, \
						disabledExprsList: DropDownList { alignment:['fill','center'], preferredSize:[-1,20] }, \
					}, \
				}, \
				processPnl: Panel { \
					text:'" + rd_ExprTweaker_localize(rd_ExprTweakerData.strProcess) + "', orientation:'row', alignment:['fill','top'], alignChildren:['fill','top'], \
					currComp: RadioButton { text:'" + rd_ExprTweaker_localize(rd_ExprTweakerData.strProcessCurrComp) + "', value:true }, \
					selComps: RadioButton { text:'" + rd_ExprTweaker_localize(rd_ExprTweakerData.strProcessSelComps) + "' }, \
					allComps: RadioButton { text:'" + rd_ExprTweaker_localize(rd_ExprTweakerData.strProcessAllComps) + "' }, \
				}, \
				cmds: Group { \
					alignment:['right','top'], \
					updateExprsBtn: Button { text:'" + rd_ExprTweaker_localize(rd_ExprTweakerData.strUpdateExprs) + "', preferredSize:[-1,20] }, \
				}, \
			}";
			pal.grp = pal.add(res);
			
			pal.grp.tweaksPnl.changeThisComp.value = true;
			
			var items = rd_ExprTweaker_localize(rd_ExprTweakerData.strDisabledExprsOpts);
			for (var i=0; i<items.length; i++)
				pal.grp.tweaksPnl.grp.disabledExprsList.add("item", items[i]);
			pal.grp.tweaksPnl.grp.disabledExprsList.selection = 0;
			
			pal.layout.layout(true);
			pal.grp.minimumSize = pal.grp.size;
			pal.layout.resize();
			pal.onResizing = pal.onResize = function () {this.layout.resize();}
			
			pal.grp.header.help.onClick = function () {alert(rd_ExprTweakerData.scriptTitle + "\n" + rd_ExprTweaker_localize(rd_ExprTweakerData.strHelpText), rd_ExprTweakerData.scriptName);}
			pal.grp.cmds.updateExprsBtn.onClick = rd_ExprTweaker_doUpdateExprs;
		}
		
		return pal;
	}
	
	
	
	
	// rd_ExprTweaker_doUpdateExprs()
	// 
	// Description:
	// This function performs the actual tweaking of expressions.
	// 
	// Parameters:
	// None.
	// 
	// Returns:
	// Nothing.
	//
	function rd_ExprTweaker_doUpdateExprs()
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
		
		
		
		
		// tweakExprsForProps()
		// 
		// Description:
		// This function iterates over a property's children properties, changing the properties'
		// expressions as needed. Call this function recursively for indexed/named property groups.
		// 
		// Parameters:
		//   propParent - PropertyGroup object whose children Property objects' expressions to tweak.
		// 
		// Returns:
		// Nothing.
		//
		function tweakExprsForProps(propParent)
		{
			if (propParent !== null)
			{
				var prop, exprState;
				
				for (var i=1; i<=propParent.numProperties; i++)
				{
					prop = propParent.property(i);
					if ((prop.propertyType === PropertyType.PROPERTY) && (prop.expression !== "") && prop.canSetExpression)
					{
						if (!prop.expressionEnabled)							// How to handle disabled expressions
						{
							if (rd_ExprTweakerData.disabledExprsOp === 1)			// ...Remove
							{
								prop.expression = "";
								continue;										// ...No sense in doing anything else for this property if expression was removed
							}
							else if (rd_ExprTweakerData.disabledExprsOp === 2)		// ...Enable
								prop.expressionEnabled = true;
						}
						
						if (rd_ExprTweakerData.changeThisComp)						// Convert this_comp and thisComp references
						{
							exprState = prop.expressionEnabled;					// Keep track of expression enabled state, because updating expression will enable it
							prop.expression = prop.expression.replace(/(thisComp|this_comp)/g, rd_ExprTweakerData.currCompNameRef);
							prop.expressionEnabled = exprState;					// Restore state
						}
					}
					else if ((prop.propertyType === PropertyType.INDEXED_GROUP) || (prop.propertyType === PropertyType.NAMED_GROUP))
						tweakExprsForProps(prop);
				}
			}
		}
		
		
		// Change that there is actually something to do
		if (!this.parent.parent.tweaksPnl.changeThisComp.value && (this.parent.parent.tweaksPnl.grp.disabledExprsList.selection === 0))
		{
			alert(rd_ExprTweaker_localize(rd_ExprTweakerData.strErrNoOp), rd_ExprTweakerData.scriptName);
			return;
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
				alert(rd_ExprTweaker_localize(rd_ExprTweakerData.strErrNoCompSel), rd_ExprTweakerData.scriptName);
				return;
			}
		}
		else if (this.parent.parent.processPnl.selComps.value)
		{
			comps = getSelectedComps();
			if (comps.length === 0)
			{
				alert(rd_ExprTweaker_localize(rd_ExprTweakerData.strErrNoMulCompSel), rd_ExprTweakerData.scriptName);
				return;
			}
		}
		else if (this.parent.parent.processPnl.allComps.value)
		{
			comps = getAllComps();
			if (comps.length === 0)
			{
				alert(rd_ExprTweaker_localize(rd_ExprTweakerData.strErrNoComps), rd_ExprTweakerData.scriptName);
				return;
			}
		}
		
		// Process the specified comps
		app.beginUndoGroup(rd_ExprTweakerData.scriptName);
		
		rd_ExprTweakerData.changeThisComp = this.parent.parent.tweaksPnl.changeThisComp.value;
		rd_ExprTweakerData.disabledExprsOp = this.parent.parent.tweaksPnl.grp.disabledExprsList.selection.index;
		
		for (var i=0; i<comps.length; i++)
		{
			comp = comps[i];
			rd_ExprTweakerData.currCompNameRef = "comp(\"" + comp.name + "\")";			// Keeps track of the current comp's name reference

			// Process the text layers in the current comp
			for (var j=1; j<=comp.numLayers; j++)
				tweakExprsForProps(comp.layer(j));
		}
		
		app.endUndoGroup();
	}
	
	
	
	
	// main code:
	//
	
	// Prerequisites check
	if (parseFloat(app.version) < 10.0)
		alert(rd_ExprTweaker_localize(rd_ExprTweakerData.strMinAE100), rd_ExprTweakerData.scriptName);
	else
	{
		// Build and show the console's floating palette
		var rdetPal = rd_ExprTweaker_buildUI(thisObj);
		if (rdetPal !== null)
		{
			if (rdetPal instanceof Window)
			{
				rdetPal.center();
				rdetPal.show();
			}
			else
				rdetPal.layout.layout(true);
		}
	}
})(this);
