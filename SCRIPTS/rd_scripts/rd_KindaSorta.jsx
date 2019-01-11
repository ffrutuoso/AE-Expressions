// rd_KindaSorta.jsx
// Copyright (c) 2006-2013 redefinery (Jeffrey R. Almasol). All rights reserved.
// check it: www.redefinery.com
// 
// Name: rd_KindaSorta
// Version: 2.0
// 
// Description:
// This script displays a palette with controls for sorting layers based
// on specific criteria.
// 
// If using only the Selected Layers in Comp (i.e., not all layers), the selected 
// layers are moved to the top of the comp as part of the sorting process.
// If sorting by Layer Name, layers that have not been renamed (i.e., their 
// names appear enclosed in brackets), the brackets will sort those layers 
// before renamed layers.
// 
// Note: The In and Out points of negatively stretched layers are identified
// by their positions in comp time (i.e., their out times are treated as In 
// points, and vice versa).
// 
// Note: This version of the script requires After Effects CS5 
// or later. It can be used as a dockable panel by placing the 
// script in a ScriptUI Panels subfolder of the Scripts folder, 
// and then choosing this script from the Window menu.
// 
// Originally requested by Phil Spitler.
// Enhancements inspired by nab (www.nabscripts.com) and djuna (dwahlrab).
// 
// Legal stuff:
// This script is provided "as is," without warranty of any kind, expressed
// or implied. In no event shall the author be held liable for any damages 
// arising in any way from the use of this script.
// 
// In other words, I'm just trying to share knowledge with and help out my
// fellow AE script heads, so don't blame me if my code doesn't rate. :-)




// rd_KindaSorta()
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
(function rd_KindaSorta(thisObj)
{
	// Globals
	
	var rd_KindaSortaData = new Object();	// Store globals in an object
	rd_KindaSortaData.scriptName = "rd: Kinda Sorta";
	rd_KindaSortaData.scriptTitle = rd_KindaSortaData.scriptName + " v2.0";
	
	rd_KindaSortaData.strAffect = {en: "Affect:"};
	rd_KindaSortaData.strAffectOpts = {en: '["All Layers in Comp", "Selected Layers in Comp"]'};
	rd_KindaSortaData.strOrderBy = {en: "Order By:"};
	rd_KindaSortaData.strOrderByOpts = {en: '["Random Order", "Selected Order", "In Point", "Out Point", "Layer Name", "Layer Z Position"]'};
	rd_KindaSortaData.strReversed = {en: "Reversed order"};
	rd_KindaSortaData.strSort = {en: "Sort"};
	rd_KindaSortaData.strHelp = {en: "?"}
	rd_KindaSortaData.strErrNoCompSel = {en: "Cannot perform operation. Please select or open a single composition in the Project panel, and try again."};
	rd_KindaSortaData.strErrNoLayerSel = {en: "Cannot perform operation. Please select at least one layer, and try again."};
	rd_KindaSortaData.strMinAE100 = {en: "This script requires Adobe After Effects CS5 or later."};
	rd_KindaSortaData.strHelpText = 
	{
		en: "Copyright (c) 2006-2013 redefinery (Jeffrey R. Almasol). \n" +
		"All rights reserved.\n" +
		"\n" +
		"This script displays a palette with controls for sorting layers based on specific criteria.\n" +
		"\n" +
		"If using only the Selected Layers in Comp (i.e., not all layers), the selected layers are moved to the top of the comp as part of the sorting process. If sorting by Layer Name, layers that have not been renamed (i.e., their names appear enclosed in brackets), the brackets will sort those layers before renamed layers.\n" +
		"\n" + 
		"Note: The In and Out points of negatively stretched layers are identified by their positions in comp time (i.e., their out times are treated as In points, and vice versa).\n" +
		"\n" + 
		"Note: This version of the script requires After Effects CS5 or later. It can be used as a dockable panel by placing the script in a ScriptUI Panels subfolder of the Scripts folder, and then choosing this script from the Window menu.\n" +
		"\n" +
		"Originally requested by Phil Spitler.\n" +
		"Enhancements inspired by nab (www.nabscripts.com) and djuna (dwahlrab)."
	};
	
	
	
	
	// rd_KindaSorta_localize()
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
	function rd_KindaSorta_localize(strVar)
	{
		return strVar["en"];
	}
	
	
	
	
	// rd_KindaSorta_buildUI()
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
	function rd_KindaSorta_buildUI(thisObj)
	{
		var pal = (thisObj instanceof Panel) ? thisObj : new Window("palette", rd_KindaSortaData.scriptName, undefined, {resizeable:true});
		
		if (pal !== null)
		{
			var res = 
			"group { \
				orientation:'column', alignment:['fill','top'], \
				header: Group { \
					alignment:['fill','top'], \
					title: StaticText { text:'" + rd_KindaSortaData.scriptName + "', alignment:['fill','center'] }, \
					help: Button { text:'" + rd_KindaSorta_localize(rd_KindaSortaData.strHelp) +"', maximumSize:[30,20], alignment:['right','center'] }, \
				}, \
				r1: Group { \
					alignment:['fill','top'], \
					affect: StaticText { text:'" + rd_KindaSorta_localize(rd_KindaSortaData.strAffect) + "' }, \
					affectOpts: DropDownList { properties:{items:" + rd_KindaSorta_localize(rd_KindaSortaData.strAffectOpts) + "}, alignment:['fill','top'], preferredSize:[-1,20] }, \
				}, \
				r2: Group { \
					alignment:['fill','top'], \
					orderBy: StaticText { text:'" + rd_KindaSorta_localize(rd_KindaSortaData.strOrderBy) + "' }, \
					orderByOpts: DropDownList { properties:{items:" + rd_KindaSorta_localize(rd_KindaSortaData.strOrderByOpts) + "}, alignment:['fill','top'], preferredSize:[-1,20] }, \
				}, \
				r3: Group { \
					alignment:['left','top'], \
					reverse: Checkbox { text:'" + rd_KindaSorta_localize(rd_KindaSortaData.strReversed) + "' }, \
				}, \
				cmds: Group { \
					alignment:['right','top'], \
					sortBtn: Button { text:'" + rd_KindaSorta_localize(rd_KindaSortaData.strSort) + "', preferredSize:[-1,20] }, \
				}, \
			}";
			pal.grp = pal.add(res);
			
			pal.grp.r1.affect.preferredSize.width = pal.grp.r2.orderBy.preferredSize.width;
			pal.grp.r3.indent = pal.grp.r2.orderBy.preferredSize.width + pal.grp.r2.spacing;
			pal.grp.r3.margins.top -= 5;
			
			pal.layout.layout(true);
			pal.grp.minimumSize = pal.grp.size;
			pal.layout.resize();
			pal.onResizing = pal.onResize = function () {this.layout.resize();}
			
			pal.grp.r1.affectOpts.selection = 0;
			pal.grp.r2.orderByOpts.selection = 1;
			
			pal.grp.r2.orderByOpts.onChange = function ()
			{
				if (this.selection.index === 0)
				{
					// If using Random Order, disable Reversed order option
					this.parent.parent.r3.reverse.value = false;
					this.parent.parent.r3.reverse.enabled = false;
				}
				else
				{
					this.parent.parent.r3.reverse.enabled = true;
					if (this.selection.index === 1)
					{
						// If using Selected Order, switch Affect to Selected Layers in Comp
						this.parent.parent.r1.affectOpts.selection = 1;
					}
				}
			}
			
			pal.grp.header.help.onClick = function () {alert(rd_KindaSortaData.scriptTitle + "\n" + rd_KindaSorta_localize(rd_KindaSortaData.strHelpText), rd_KindaSortaData.scriptName);}
			pal.grp.cmds.sortBtn.onClick = rd_KindaSorta_doKindaSorta;
		}
		
		return pal;
	}
	
	
	
	
	// rd_KindaSorta_doKindaSorta()
	// 
	// Description:
	// This function performs the actual sorting.
	// 
	// Parameters:
	// None.
	// 
	// Returns:
	// Nothing.
	//
	function rd_KindaSorta_doKindaSorta()
	{
		function rd_KindaSorta_sortByInPoint(a, b)
		{
			var aIn = (a.stretch < 0) ? a.outPoint : a.inPoint;
			var bIn = (b.stretch < 0) ? b.outPoint : b.inPoint;
			return (aIn - bIn);
		}
		
		function rd_KindaSorta_sortByOutPoint(a, b)
		{
			var aOut = (a.stretch < 0) ? a.inPoint : a.outPoint;
			var bOut = (b.stretch < 0) ? b.inPoint : b.outPoint;
			return (aOut - bOut);
		}
		
		function rd_KindaSorta_sortByLayerName(a, b)
		{
			if (a.name < b.name)
				return -1;
			else if (a.name > b.name)
				return 1;
			else
				return 0;
		}
		
		function rd_KindaSorta_sortByLayerZPos(a, b)
		{
			if (a.position.value[2] < b.position.value[2])
				return -1;
			else if (a.position.value[2] > b.position.value[2])
				return 1;
			else
				return 0;
		}
		
		// Check that a project exists
		if (app.project === null)
			return;
		
		// Get the current (active/frontmost) comp
		var comp = app.project.activeItem;
		
		if ((comp === null) || !(comp instanceof CompItem))
		{
			alert(rd_KindaSorta_localize(rd_KindaSortaData.strErrNoCompSel), rd_KindaSortaData.scriptName);
			return;
		}
		
		var affect = this.parent.parent.r1.affectOpts.selection.index;
		var orderBy = this.parent.parent.r2.orderByOpts.selection.index;
		var reverse = this.parent.parent.r3.reverse.value;
		
		// If no layers are selected (and using selected layers), nothing to do
		if ((affect === 1) && (comp.selectedLayers.length === 0))
		{
			alert(rd_KindaSorta_localize(rd_KindaSortaData.strErrNoLayerSel), rd_KindaSortaData.scriptName);
			return;
		}
		
		// Determine layers to process
		var layers = new Array();
		if (affect === 0)			// All Layers in Comp
		{
			// Assign layers to a 0-based array
			for (var i=1; i<=comp.numLayers; i++)
				layers[layers.length] = comp.layer(i);
		}
		else if (affect === 1)		// Selected Layers in Comp
		{
			if (orderBy !== 1)		// if not using Selected Order for reordering, capture from top to bottom
			{
				// Capture selected layers from top to bottom
				for (var i=1; i<=comp.numLayers; i++)
					if (comp.layer(i).selected)
						layers[layers.length] = comp.layer(i);
			}
			else							// otherwise, capture selected order directly
			{
				for (var i=0; i<comp.selectedLayers.length; i++)
					layers[layers.length] = comp.selectedLayers[i];
			}
		}
		
		// Sort the layers
		app.beginUndoGroup(rd_KindaSortaData.scriptName);
		
		if (orderBy === 0)			// Random Order
		{
			var lIndex;
			for (var i=1; i<layers.length; i++)	// start at 1, effectively skipping if comp has only 1 layer
			{
				do {
					lIndex = 1 + Math.round(Math.random() * (comp.numLayers - 1));
				} while (lIndex === layers[i].index);
				if (Math.random() > 0.5)
					layers[i].moveBefore(comp.layer(lIndex));
				else
					layers[i].moveAfter(comp.layer(lIndex));
			}
		}
		else
		{
			if (orderBy === 1)	// Selected Order
			{
			}
			else if (orderBy === 2)	// In Point
			{
				layers.sort(rd_KindaSorta_sortByInPoint);
			}
			else if (orderBy === 3)	// Out Point
			{
				layers.sort(rd_KindaSorta_sortByOutPoint);
			}
			else if (orderBy === 4)	// Layer Name
			{
				layers.sort(rd_KindaSorta_sortByLayerName);
			}
			else if (orderBy === 5)	// Layer Z Position
			{
				layers.sort(rd_KindaSorta_sortByLayerZPos);
			}
			
			// Reverse layers?
			if (reverse)
			{
				for (var i=0; i<layers.length; i++)
					layers[i].moveToBeginning();
			}
			else
			{
				for (var i=layers.length-1; i>=0; i--)
					layers[i].moveToBeginning();
			}
		}
		
		app.endUndoGroup();
	}
	
	
	
	
	// main code:
	//
	
	// Prerequisites check
	if (parseFloat(app.version) < 10.0)
		alert(rd_KindaSorta_localize(rd_KindaSortaData.strMinAE100), rd_KindaSortaData.scriptName);
	else
	{
		// Build and show the console's floating palette
		var rdksPal = rd_KindaSorta_buildUI(thisObj);
		if (rdksPal !== null)
		{
			// Update UI values, if saved in the settings
			if (app.settings.haveSetting("redefinery", "rd_KindaSorta_affectOpts"))
				rdksPal.grp.r1.affectOpts.selection = parseInt(app.settings.getSetting("redefinery", "rd_KindaSorta_affectOpts"));
			if (app.settings.haveSetting("redefinery", "rd_KindaSorta_orderByOpts"))
				rdksPal.grp.r2.orderByOpts.selection = parseInt(app.settings.getSetting("redefinery", "rd_KindaSorta_orderByOpts"));
			if (app.settings.haveSetting("redefinery", "rd_KindaSorta_reverse"))
				rdksPal.grp.r3.reverse.value = !(app.settings.getSetting("redefinery", "rd_KindaSorta_reverse") === "false");
			if (rdksPal.grp.r2.orderByOpts.selection.index === 0)
			{
				// If using Random Order, disable Reversed order option
				rdksPal.grp.r3.reverse.value = false;
				rdksPal.grp.r3.reverse.enabled = false;
			}
			else if (rdksPal.grp.r2.orderByOpts.selection === 1)
			{
				// If using Selected Order, switch Affect to Selected Layers in Comp
				rdksPal.grp.r1.affectOpts.selection = 1;
			}
			
			// Save current UI settings upon closing the palette
			rdksPal.onClose = function()
			{
				app.settings.saveSetting("redefinery", "rd_KindaSorta_affectOpts", rdksPal.grp.r1.affectOpts.selection.index);
				app.settings.saveSetting("redefinery", "rd_KindaSorta_orderByOpts", rdksPal.grp.r2.orderByOpts.selection.index);
				app.settings.saveSetting("redefinery", "rd_KindaSorta_reverse", rdksPal.grp.r3.reverse.value);
			}
			
			if (rdksPal instanceof Window)
			{
				// Show the palette
				rdksPal.center();
				rdksPal.show();
			}
			else
				rdksPal.layout.layout(true);
		}
	}
})(this);
