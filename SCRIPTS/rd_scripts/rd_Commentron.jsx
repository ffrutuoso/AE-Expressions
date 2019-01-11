// rd_Commentron.jsx
// Copyright (c) 2005-2013 redefinery (Jeffrey R. Almasol). All rights reserved.
// check it: www.redefinery.com
// 
// Name: rd_Commentron
// Version: 3.0
// 
// Description:
// This script displays a palette with controls for setting 
// the comments of project items and layers (in the selected 
// composition). You can use this script to, for example, 
// display the full file name for disk-based footage items.
// 
// The Template field can use literal characters or any of 
// the following tokens:
//     [filename] - The full file name (with its path) of 
//         the disk-based footage item.
//     [fname] - The file name (without its path) of the 
//         disk-based footage item.
//     [fsize] - The file size (in bytes) of the disk-based 
//         footage item.
//     [w] - The pixel width of the footage item or layer.
//     [h] - The pixel height of the footage item or layer.
//     [par] - The pixel aspect ratio of the footage item or 
//         layer.
//     [fps] - The frame rate of the footage item or layer.
// 
// Note: This version of the script requires After Effects CS5 
// or later. It can be used as a dockable panel by placing the 
// script in a ScriptUI Panels subfolder of the Scripts folder, 
// and then choosing this script from the Window menu.
// 
// Originally requested by Ben Grossmann.
// 
// Legal stuff:
// This script is provided "as is," without warranty of any kind, expressed
// or implied. In no event shall the author be held liable for any damages 
// arising in any way from the use of this script.
// 
// In other words, I'm just trying to share knowledge with and help out my
// fellow AE script heads, so don't blame me if my code doesn't rate. :-)




// rd_Commentron()
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
(function rd_Commentron(thisObj)
{
	// Globals
	
	var rd_CommentronData = new Object();	// Store globals in an object
	rd_CommentronData.scriptName = "rd: Commentron";
	rd_CommentronData.scriptTitle = rd_CommentronData.scriptName + " v3.0";
	
	rd_CommentronData.strOptions = {en: "Options"};
	rd_CommentronData.strAffect = {en: "Affect:"};
	rd_CommentronData.strAffectAll = {en: "All"};
	rd_CommentronData.strAffectAllFootage = {en: "All Footage"};
	rd_CommentronData.strAffectAllDiskFootage = {en: "All Disk-based Footage"};
	rd_CommentronData.strAffectSelected = {en: "Selected"};
	rd_CommentronData.strTemplate = {en: "Template:"};
	rd_CommentronData.strChangeOnlyIfBlank = {en: "Change comment only if previously blank"};
	rd_CommentronData.strSetItemComment = {en: "Set Project Item Comments"};
	rd_CommentronData.strSetLayerComment = {en: "Set Layer Comments"};
	rd_CommentronData.strHelp = {en: "?"};
	rd_CommentronData.strErrNoCompSel = {en: "Cannot perform operation. Please select or open a single composition in the Project panel, and try again."};
	rd_CommentronData.strErrNoLayerSel = {en: "Cannot perform operation. Please select at least one layer, and try again."};
	rd_CommentronData.strMinAE100 = {en: "This script requires Adobe After Effects CS5 or later."};
	rd_CommentronData.strHelpText = 
	{
		en: "Copyright (c) 2005-2013 redefinery (Jeffrey R. Almasol). All rights reserved.\n" +
		"\n" +
		"This script displays a palette with controls for setting the comments of project items and layers (in the selected composition). You can use this script to, for example, display the full file name for disk-based footage items.\n" +
		"\n" +
		"The Template field can use literal characters or any of the following tokens:\n" +
		"    [filename] - The full file name (with its path) of \n" +
		"        the disk-based footage item.\n" +
		"    [fname] - The file name (without its path) of the \n" +
		"        disk-based footage item.\n" +
		"    [fsize] - The file size (in bytes) of the disk-based \n" +
		"        footage item.\n" +
		"    [w] - The pixel width of the footage item or layer.\n" +
		"    [h] - The pixel height of the footage item or layer.\n" +
		"    [par] - The pixel aspect ratio of the footage item or \n" +
		"        layer.\n" +
		"    [fps] - The frame rate of the footage item or layer.\n" +
		"\n" +
		"Note: This version of the script requires After Effects CS4 or later. It can be used as a dockable panel by placing the script in a ScriptUI Panels subfolder of the Scripts folder, and then choosing this script from the Window menu.\n" +
		"\n" +
		"Originally requested by Ben Grossmann.\n"
	};
	
	
	
	
	// rd_Commentron_localize()
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
	function rd_Commentron_localize(strVar)
	{
		return strVar["en"];
	}
	
	
	
	
	// rd_Commentron_buildUI()
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
	function rd_Commentron_buildUI(thisObj)
	{
		var pal = (thisObj instanceof Panel) ? thisObj : new Window("palette", rd_CommentronData.scriptName, undefined, {resizeable:true});
		
		if (pal !== null)
		{
			var res =
			"""group { 
				orientation:'column', alignment:['fill','top'], 
				header: Group { 
					alignment:['fill','top'], 
					title: StaticText { text:'""" + rd_CommentronData.scriptName + """', alignment:['fill','center'] }, 
					help: Button { text:'""" + rd_Commentron_localize(rd_CommentronData.strHelp) + """', maximumSize:[30,20], alignment:['right','center'] }, 
				}, 
				opts: Panel { 
					text: '""" + rd_Commentron_localize(rd_CommentronData.strOptions) + """', alignment:['fill','top'], 
					affect: Group { 
						alignment:['fill','top'], 
						lbl: StaticText { text:'""" + rd_Commentron_localize(rd_CommentronData.strAffect) + """', alignment:['left','center'] }, 
						lst: DropDownList { properties:{ }, alignment:['fill','center'], preferredSize:[-1,20] }, 
					}, 
					tpl: Group { 
						alignment:['fill','top'], 
						lbl: StaticText { text:'""" + rd_Commentron_localize(rd_CommentronData.strTemplate) + """', alignment:['left','center'] }, 
						fld: EditText { text:'[fname]', alignment:['fill','center'], preferredSize:[-1,20] }, 
					}, 
					ifBlank: Checkbox { text:'""" + rd_Commentron_localize(rd_CommentronData.strChangeOnlyIfBlank) + """', alignment:['fill','top'] }, 
				}, 
				cmds: Group { 
					alignment:['fill','top'], alignChildren:['fill','top'], 
					itemCommentsBtn: Button { text:'""" + rd_Commentron_localize(rd_CommentronData.strSetItemComment) + """', preferredSize:[-1,20] }, 
					layerCommentsBtn: Button { text:'""" + rd_Commentron_localize(rd_CommentronData.strSetLayerComment) + """', preferredSize:[-1,20] }, 
				}, 
			}""";
			pal.grp = pal.add(res);
			
			pal.grp.opts.affect.lst.add("item", rd_Commentron_localize(rd_CommentronData.strAffectAll));
			pal.grp.opts.affect.lst.add("item", rd_Commentron_localize(rd_CommentronData.strAffectAllFootage));
			pal.grp.opts.affect.lst.add("item", rd_Commentron_localize(rd_CommentronData.strAffectAllDiskFootage));
			pal.grp.opts.affect.lst.add("item", rd_Commentron_localize(rd_CommentronData.strAffectSelected));
			pal.grp.opts.affect.lst.selection = 2;
			
			pal.grp.opts.affect.lbl.preferredSize = pal.grp.opts.tpl.lbl.preferredSize;
			
			pal.layout.layout(true);
			pal.grp.minimumSize = pal.grp.size;
			pal.layout.resize();
			pal.onResizing = pal.onResize = function () {this.layout.resize();}
			
			pal.grp.header.help.onClick = function () {alert(rd_CommentronData.scriptTitle + "\n" + rd_Commentron_localize(rd_CommentronData.strHelpText), rd_CommentronData.scriptName);}
			pal.grp.cmds.itemCommentsBtn.onClick = function() {rd_Commentron_doCommentronItems(this.parent.parent);}
			pal.grp.cmds.layerCommentsBtn.onClick = function() {rd_Commentron_doCommentronLayers(this.parent.parent);}
		}
		
		return pal;
	}
	
	
	
	
	// rd_Commentron_doCommentronItems()
	// 
	// Description:
	// This function performs the actual commenting of project items.
	// 
	// Parameters:
	//   pal - The palette (Window or Panel object) itself.
	// 
	// Returns:
	// Nothing.
	//
	function rd_Commentron_doCommentronItems(pal)
	{
		// Check that a project exists
		var proj = app.project;
		
		if (proj === null)
			return;
		
		// Get the options
		var affect = pal.opts.affect.lst.selection.index;
		var tpl = pal.opts.tpl.fld.text;
		var updateBlanksOnly = pal.opts.ifBlank.value;
		
		// Build the array of items to possibly update
		var items = new Array();
		
		switch (affect)
		{
			case 0:		// All
				for (var i=1; i<=proj.numItems; i++)
					items[items.length] = proj.item(i);
				break;
			case 1:		// All Footage
				for (var i=1; i<=proj.numItems; i++)
					if (proj.item(i) instanceof FootageItem)
						items[items.length] = proj.item(i);
				break;
			case 2:		// All Disk-based Footage
				for (var i=1; i<=proj.numItems; i++)
					if (proj.item(i) instanceof FootageItem)
						if (proj.item(i).file !== null)
							items[items.length] = proj.item(i);
				break;
			case 3:		// Selected
				items = proj.selection;
				break;
			default:
				break;
		}
		
		// Process the items
		var newComment;
		
		app.beginUndoGroup(rd_CommentronData.scriptName);
		
		for (var i=0; i<items.length; i++)
		{
			// Skip non-blank comments, if requested to do so
			if (updateBlanksOnly && (items[i].comment !== ""))
				continue;
			
			// Start with the template
			newComment = tpl;
			
			// Add file name or file size?
			//if ((items[i] instanceof FootageItem) || (items[i] instanceof CompItem))
			if (items[i] instanceof FootageItem)
			{
				if (items[i].file !== null)
				{
					if (newComment.indexOf("[filename]") !== -1)
						newComment = newComment.replace("[filename]", items[i].file.fsName);
					if (newComment.indexOf("[fname]") !== -1)
						newComment = newComment.replace("[fname]", File.decode(items[i].file.name));
					if (newComment.indexOf("[fsize]") !== -1)
						newComment = newComment.replace("[fsize]", items[i].file.length);
				}
			
				// Add size or pixel aspect ratio values?
				if (newComment.indexOf("[w]") !== -1)
					newComment = newComment.replace("[w]", items[i].width);
				if (newComment.indexOf("[h]") !== -1)
					newComment = newComment.replace("[h]", items[i].height);
				
				if (newComment.indexOf("[par]") !== -1)
					newComment = newComment.replace("[par]", items[i].pixelAspect);
				if (newComment.indexOf("[fps]") !== -1)
					newComment = newComment.replace("[fps]", items[i].frameRate);
			}
			
			// Clean up any unused tokens
			newComment = newComment.replace("[filename]", "");
			newComment = newComment.replace("[fname]", "");
			newComment = newComment.replace("[fsize]", "");
			newComment = newComment.replace("[w]", "");
			newComment = newComment.replace("[h]", "");
			newComment = newComment.replace("[par]", "");
			newComment = newComment.replace("[fps]", "");
			
			// Update comment
			items[i].comment = newComment;
		}
		
		app.endUndoGroup();
	}
	
	
	
	
	// rd_Commentron_doCommentronLayers()
	// 
	// Description:
	// This function performs the actual commenting of layers in the current composition.
	// 
	// Parameters:
	//   pal - The palette (Window or Panel object) itself.
	// 
	// Returns:
	// Nothing.
	//
	function rd_Commentron_doCommentronLayers(pal)
	{
		// Check that a project exists
		var proj = app.project;
		
		if (proj === null)
			return;
		
		// Get the current (active/frontmost) comp
		var comp = proj.activeItem;
		
		if ((comp === null) || !(comp instanceof CompItem))
		{
			alert(rd_Commentron_localize(rd_CommentronData.strErrNoCompSel), rd_CommentronData.scriptName);
			return;
		}
		
		if (comp.numLayers === 0)				// Pre-check if any work can even be done
			return;
		
		// Get the options
		var affect = pal.opts.affect.lst.selection.index;
		var tpl = pal.opts.tpl.fld.text;
		var updateBlanksOnly = pal.opts.ifBlank.value;
		
		// Build the array of layers to possibly update
		var layers = new Array();
	
		switch (affect)
		{
			case 0:		// All
				for (var i=1; i<=comp.numLayers; i++)
					layers[layers.length] = comp.layer(i);
				break;
			case 1:		// All Footage
				for (var i=1; i<=comp.numLayers; i++)
					if (comp.layer(i) instanceof AVLayer)
						layers[layers.length] = comp.layer(i);
				break;
			case 2:		// All Disk-based Footage
				for (var i=1; i<=comp.numLayers; i++)
					if (comp.layer(i) instanceof AVLayer)
						if (comp.layer(i).source !== null)
							if (comp.layer(i).source instanceof FootageItem)
								if (comp.layer(i).source.file !== null)
									layers[layers.length] = comp.layer(i);
				break;
			case 3:		// Selected
				layers = comp.selectedLayers;
				break;
			default:
				break;
		}
		
		// Process the items
		var newComment, layer;
		
		app.beginUndoGroup(rd_CommentronData.scriptName);
		
		for (var i=0; i<layers.length; i++)
		{
			// Skip non-blank comments, if requested to do so
			if (updateBlanksOnly && (layers[i].comment !== ""))
				continue;
			
			// Start with the template
			newComment = tpl;
			
			layer = layers[i];
			
			if (layer instanceof AVLayer)			
				if (layer.source !== null)
				{
					//if ((layer.source instanceof FootageItem) || (layer.source instanceof CompItem))
					if (layer.source instanceof FootageItem)
					{
						// Add file name or file size?
						if (layer.source.file !== null)
						{
							if (newComment.indexOf("[filename]") !== -1)
								newComment = newComment.replace("[filename]", layer.source.file.fsName);
							if (newComment.indexOf("[fname]") !== -1)
								newComment = newComment.replace("[fname]", File.decode(layer.source.file.name));
							if (newComment.indexOf("[fsize]") !== -1)
								newComment = newComment.replace("[fsize]", layer.source.file.length);
						}
						
						if (newComment.indexOf("[w]") !== -1)
							newComment = newComment.replace("[w]", layer.source.width);
						if (newComment.indexOf("[h]") !== -1)
							newComment = newComment.replace("[h]", layer.source.height);
						
						if (newComment.indexOf("[par]") !== -1)
							newComment = newComment.replace("[par]", layer.source.pixelAspect);
						if (newComment.indexOf("[fps]") !== -1)
							newComment = newComment.replace("[fps]", layer.source.frameRate);
					}
				}
			
			// Clean up any unused tokens
			newComment = newComment.replace("[filename]", "");
			newComment = newComment.replace("[fname]", "");
			newComment = newComment.replace("[fsize]", "");
			newComment = newComment.replace("[w]", "");
			newComment = newComment.replace("[h]", "");
			newComment = newComment.replace("[par]", "");
			newComment = newComment.replace("[fps]", "");
			
			// Update comment
			layer.comment = newComment;
		}
		
		app.endUndoGroup();
	}
	
	
	
	
	// main code:
	//
	
	// Prerequisites check
	if (parseFloat(app.version) < 10.0)
		alert(rd_Commentron_localize(rd_CommentronData.strMinAE100), rd_CommentronData.scriptName);
	else
	{
		// Build and show the console's floating palette
		var rdcPal = rd_Commentron_buildUI(thisObj);
		if (rdcPal !== null)
		{
			if (rdcPal instanceof Window)
			{
				// Show the palette
				rdcPal.center();
				rdcPal.show();
			}
			else
				rdcPal.layout.layout(true);
		}
	}
})(this);
