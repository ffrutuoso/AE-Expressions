// rd_CompSheet.jsx
// Copyright (c) 2006-2013 redefinery (Jeffrey R. Almasol). All rights reserved.
// check it: www.redefinery.com
// 
// Name: rd_CompSheet
// Version: 3.0
// 
// Description:
// This script displays a palette with controls for building a 
// "contact sheet" composition based on "style frames" in the 
// current composition. Use this script to view different frames 
// of a composition at a glance.
// 
// To use this script:
//  1. Define style frames by creating layer markers on a layer 
// named "style frames".
//  2. Specify the grid dimensions (rows and columns), scaling of 
// style frames, and cell spacing for the contact sheet 
// composition.
//  3. (Optional) To use a custom layout for each frame, and an 
// optional caption, enter the cell template comp's name in the 
// Template field. If the template comp contains a "caption" text 
// layer, specify the content for that text layer. More information 
// below.
//  4. Click Create Comp Sheet.
// 
// The script will generate a new composition whose name is the 
// same as the current composition's name, with " Sheet" 
// appended. Open this comp to view the results. Comps for 
// each cell are placed in a folder the same as the composition, 
// with " Cells" appended.
// 
// The created style frame cells are live instances of the 
// composition at the corresponding marker positions, so you 
// can rearrange them in the original composition and watch 
// them update accordingly. However, if you add or remove 
// markers, or change the marker comments (and are using 
// marker comments for "caption" layers in a cell template), you 
// will need to regenerate the comp sheet.
// 
// Custom layout for each cell can be defined with a comp that 
// has a solid layer named "picture", and an optional text layer 
// named "caption". The "picture" solid layer will be replaced by 
// the associated style frame (with layer transforms and 2D/3D 
// state applied). Use a solid that has the same aspect ratio as 
// your selected comp, unless you want to distort the style 
// frames in the sheet. The "caption" text layer will be updated 
// based on the selected Caption setting.
// 
// Note: This version of the script requires After Effects CS5 
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




// rd_CompSheet()
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
(function rd_CompSheet(thisObj)
{
	// Globals
	
	var rd_CompSheetData = new Object();	// Store globals in an object
	rd_CompSheetData.scriptName = "rd: Comp Sheet";
	rd_CompSheetData.scriptTitle = rd_CompSheetData.scriptName + " v3.0";
	
	rd_CompSheetData.strSheet = {en: "Sheet"};
	rd_CompSheetData.strRows = {en: "Rows:"};
	rd_CompSheetData.strCols = {en: "Columns:"};
	rd_CompSheetData.strScale = {en: "Scale (%):"};
	rd_CompSheetData.strSpacingX = {en: "X Spacing:"};
	rd_CompSheetData.strSpacingY = {en: "Y Spacing:"};
	rd_CompSheetData.strCell = {en: "Cell"};
	rd_CompSheetData.strTemplate = {en: "Template:"};
	rd_CompSheetData.strCaption = {en: "Caption:"};
	rd_CompSheetData.strCaptionOpts = {en: '["Custom Name", "Marker Comment", "Frame Number (Linked)", "Frame Time (Linked)", "Cell Number"]'};
	rd_CompSheetData.strCreateSheet = {en: "Create Comp Sheet"};
	rd_CompSheetData.strHelp = {en: "?"}
	rd_CompSheetData.strErrNoLayerMarkers = {en: "No \"style frames\" defined. Please create at least one marker on a layer named \"style frames\", and try again."};
	rd_CompSheetData.strErrNoCompSel = {en: "Cannot perform operation. Please select or open a single composition in the Project panel, and try again."};
	rd_CompSheetData.strMinAE100 = {en: "This script requires Adobe After Effects CS5 or later."};
	rd_CompSheetData.strHelpText = 
	{
		en: "Copyright (c) 2006-2013 redefinery (Jeffrey R. Almasol). \n" +
		"All rights reserved.\n" +
		"\n" +
		"This script displays a palette with controls for building a \"contact sheet\" composition based on \"style frames\" in the current composition. Use this script to view different frames of a composition at a glance.\n" +
		"\n" +
		"To use this script:\n" +
		" 1. Define style frames by creating layer markers on a layer named \"style frames\".\n" +
		" 2. Specify the grid dimensions (rows and columns), scaling of style frames, and cell spacing for the contact sheet composition.\n" +
		" 3. (Optional) To use a custom layout for each frame, and an optional caption, enter the cell template comp's name in the Template field. If the template comp contains a \"caption\" text layer, specify the content for that text layer. More information below.\n" +
		" 4. Click Create Comp Sheet.\n" +
		"\n" +
		"The script will generate a new composition whose name is the same as the current composition's name, with \" Sheet\" appended. Open this comp to view the results. Comps for each cell are placed in a folder the same as the composition, with \" Cells\" appended.\n" +
		"\n" +
		"The created style frame cells are live instances of the composition at the corresponding marker positions, so you can rearrange them in the original composition and watch them update accordingly. However, if you add or remove markers, or change the marker comments (and are using marker comments for \"caption\" layers in a cell template), you will need to regenerate the comp sheet.\n" +
		"\n" +
		"Custom layout for each cell can be defined with a comp that has a solid layer named \"picture\", and an optional text layer named \"caption\". The \"picture\" solid layer will be replaced by the associated style frame (with layer transforms and 2D/3D state applied). Use a solid that has the same aspect ratio as your selected comp, unless you want to distort the style frames in the sheet. The \"caption\" text layer will be updated based on the selected Caption setting.\n" +
		"\n" +
		"Note: This version of the script requires After Effects CS5 or later. It can be used as a dockable panel by placing the script in a ScriptUI Panels subfolder of the Scripts folder, and then choosing this script from the Window menu.\n" +
		"\n" +
		"Originally requested by Matt Silverman."
	};	
	
	
	
	
	// rd_CompSheet_localize()
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
	function rd_CompSheet_localize(strVar)
	{
		return strVar["en"];
	}
	
	
	
	
	// rd_CompSheet_buildUI()
	// 
	// Description:
	// This function builds the user interface.
	// 
	// Parameters:
	// thisObj - Panel object (if script is launched from Window menu); null otherwise.
	// 
	// Returns:
	// Window object representing the built user interface.
	//
	function rd_CompSheet_buildUI(thisObj)
	{
		var pal = (thisObj instanceof Panel) ? thisObj : new Window("palette", rd_CompSheetData.scriptName, undefined, {resizeable:true});
		
		if (pal !== null)
		{
			var res = 
			"group { \
				orientation:'column', alignment:['fill','top'], \
				header: Group { \
					alignment:['fill','top'], \
					title: StaticText { text:'" + rd_CompSheetData.scriptName + "', alignment:['fill','center'] }, \
					help: Button { text:'" + rd_CompSheet_localize(rd_CompSheetData.strHelp) +"', maximumSize:[30,20], alignment:['right','center'] }, \
				}, \
				sheet: Panel { \
					text:'" + rd_CompSheet_localize(rd_CompSheetData.strSheet) + "', alignment:['fill','top'], spacing:5, \
					rows: Group { \
						alignment:['fill','top'], \
						lbl: StaticText { text:'" + rd_CompSheet_localize(rd_CompSheetData.strRows) + "', alignment:['left','center'] }, \
						fld: EditText { text:'2', characters:3, alignment:['left','center'], preferredSize:[-1,20] }, \
						sld: Slider { value:2, minvalue:1, maxvalue:20, alignment:['fill','center'] }, \
					}, \
					cols: Group { \
						alignment:['fill','top'], \
						lbl: StaticText { text:'" + rd_CompSheet_localize(rd_CompSheetData.strCols) + "', alignment:['left','center'] }, \
						fld: EditText { text:'4', characters:3, alignment:['left','center'], preferredSize:[-1,20] }, \
						sld: Slider { value:4, minvalue:1, maxvalue:20, alignment:['fill','center'] }, \
					}, \
					ssize: Group { \
						alignment:['fill','top'], \
						lbl: StaticText { text:'" + rd_CompSheet_localize(rd_CompSheetData.strScale) + "', alignment:['left','center'] }, \
						fld: EditText { text:'50', characters:3, alignment:['left','center'], preferredSize:[-1,20] }, \
						sld: Slider { value:50, minvalue:1, maxvalue:200, alignment:['fill','center'] }, \
					}, \
					xgap: Group { \
						alignment:['fill','top'], \
						lbl: StaticText { text:'" + rd_CompSheet_localize(rd_CompSheetData.strSpacingX) + "', alignment:['left','center'] }, \
						fld: EditText { text:'20', characters:3, alignment:['left','center'], preferredSize:[-1,20] }, \
						sld: Slider { value:20, minvalue:0, maxvalue:200, alignment:['fill','center'] }, \
					}, \
					ygap: Group { \
						alignment:['fill','top'], \
						lbl: StaticText { text:'" + rd_CompSheet_localize(rd_CompSheetData.strSpacingY) + "', alignment:['left','center'] }, \
						fld: EditText { text:'20', characters:3, alignment:['left','center'], preferredSize:[-1,20] }, \
						sld: Slider { value:20, minvalue:0, maxvalue:200, alignment:['fill','center'] }, \
					}, \
				}, \
				cell: Panel { \
					text:'" + rd_CompSheet_localize(rd_CompSheetData.strCell) + "', alignment:['fill','top'], spacing:5, \
					tpl: Group { \
						alignment:['fill','top'], \
						lbl: StaticText { text:'" + rd_CompSheet_localize(rd_CompSheetData.strTemplate) + "', alignment:['left','center'] }, \
						fld: EditText { text:'', characters:10, alignment:['fill','center'], preferredSize:[-1,20] }, \
					}, \
					caption: Group { \
						alignment:['fill','top'], \
						lbl: StaticText { text:'" + rd_CompSheet_localize(rd_CompSheetData.strCaption) + "', alignment:['left','center'] }, \
						lst: DropDownList { properties:{items:" + rd_CompSheet_localize(rd_CompSheetData.strCaptionOpts) + " }, alignment:['fill','center'], preferredSize:[-1,20] }, \
					}, \
					captionName: Group { \
						alignment:['fill','top'], \
						fld: EditText { text:'', characters:10, alignment:['right','center'], preferredSize:[-1,20] }, \
					}, \
				}, \
				cmds: Group { \
					alignment:['right','top'], \
					createSheetBtn: Button { text:'" + rd_CompSheet_localize(rd_CompSheetData.strCreateSheet) + "', preferredSize:[-1,20] }, \
				}, \
			}";
			pal.grp = pal.add(res);
			
			pal.grp.sheet.rows.sld.preferredSize.height = 
				pal.grp.sheet.cols.sld.preferredSize.height = 
				pal.grp.sheet.ssize.sld.preferredSize.height =
				pal.grp.sheet.xgap.sld.preferredSize.height =
				pal.grp.sheet.ygap.sld.preferredSize.height = 20;
			pal.grp.sheet.rows.lbl.preferredSize = 
				pal.grp.sheet.cols.lbl.preferredSize = 
				pal.grp.sheet.ssize.lbl.preferredSize = 
				pal.grp.sheet.xgap.lbl.preferredSize = 
				pal.grp.cell.tpl.lbl.preferredSize = 
				pal.grp.cell.tpl.lbl.preferredSize = 
				pal.grp.cell.caption.lbl.preferredSize = pal.grp.sheet.ygap.lbl.preferredSize;
			pal.grp.sheet.ssize.margins.top = 
				pal.grp.sheet.xgap.margins.top =
				pal.grp.cell.caption.margins.top = 5;
			
			pal.layout.layout(true);
			pal.grp.minimumSize = pal.grp.size;
			pal.layout.resize();
			pal.onResizing = pal.onResize = function ()
			{
				this.layout.resize();
				this.grp.cell.captionName.fld.bounds.left = this.grp.cell.caption.lst.bounds.left;
			}
			
			pal.grp.sheet.rows.fld.onChange =
			pal.grp.sheet.cols.fld.onChange = 
			pal.grp.sheet.ssize.fld.onChange = 
			pal.grp.sheet.xgap.fld.onChange = 
			pal.grp.sheet.ygap.fld.onChange = function ()
			{
				var value = parseInt(this.text);
				if (isNaN(value))
					value = this.parent.sld.value;
				else if (value < this.parent.sld.minvalue)
					value = this.parent.sld.minvalue;
				else if (value > this.parent.sld.maxvalue)
					value = this.parent.sld.maxvalue;
				this.text = value.toString();
				this.parent.sld.value = value;
			}
			pal.grp.sheet.rows.sld.onChange = pal.grp.sheet.rows.sld.onChanging = 
			pal.grp.sheet.cols.sld.onChange = pal.grp.sheet.cols.sld.onChanging = 
			pal.grp.sheet.ssize.sld.onChange = pal.grp.sheet.ssize.sld.onChanging = 
			pal.grp.sheet.xgap.sld.onChange = pal.grp.sheet.xgap.sld.onChanging = 
			pal.grp.sheet.ygap.sld.onChange = pal.grp.sheet.ygap.sld.onChanging = function () {
				var value = parseInt(this.value);
				
				if (isNaN(value))
					value = parseInt(this.parent.fld.text);
				this.value = value;
				this.parent.fld.text = value.toString();
			}
			
			/*
			pal.grp.sheet.ssize.fld.onChange = function ()
			{
				var value = parseInt(this.text);
				if (isNaN(value))
					value = this.parent.sld.value;
				else if (value < this.parent.sld.minimumValue)
					value = this.parent.sld.minimumValue;
				else if (value > this.parent.sld.maximumValue)
					value = this.parent.sld.maximumValue;
				this.text = value.toString();
				this.parent.sld.value = value;
			}
			pal.grp.sheet.ssize.sld.onChange = pal.grp.sheet.ssize.sld.onChanging = function () {this.parent.fld.text = this.value.toString();}
			
			pal.grp.sheet.xgap.fld.onChange = function ()
			{
				var value = parseInt(this.text);
				if (isNaN(value))
					value = this.parent.sld.value;
				else if (value < this.parent.sld.minimumValue)
					value = this.parent.sld.minimumValue;
				else if (value > this.parent.sld.maximumValue)
					value = this.parent.sld.maximumValue;
				this.text = value.toString();
				this.parent.sld.value = value;
			}
			pal.grp.sheet.xgap.sld.onChange = pal.grp.sheet.xgap.sld.onChanging = function () {this.parent.fld.text = this.value.toString();}
			
			pal.grp.sheet.ygap.fld.onChange = function ()
			{
				var value = parseInt(this.text);
				if (isNaN(value))
					value = this.parent.sld.value;
				else if (value < this.parent.sld.minimumValue)
					value = this.parent.sld.minimumValue;
				else if (value > this.parent.sld.maximumValue)
					value = this.parent.sld.maximumValue;
				this.text = value.toString();
				this.parent.sld.value = value;
			}
			pal.grp.sheet.ygap.sld.onChange = pal.grp.sheet.ygap.sld.onChanging = function () {this.parent.fld.text = this.value.toString();}
			*/
			
			pal.grp.cell.caption.lst.selection = 3;
			pal.grp.cell.caption.lst.onChange = function () {this.parent.parent.captionName.fld.enabled = (this.selection.index === 0);}
			
			pal.grp.header.help.onClick = function () {alert(rd_CompSheetData.scriptTitle + "\n" + rd_CompSheet_localize(rd_CompSheetData.strHelpText), rd_CompSheetData.scriptName);}
			pal.grp.cmds.createSheetBtn.onClick = rd_CompSheet_doCreateCompSheet;
		}
		
		return pal;
	}
	
	
	
	
	// rd_CompSheet_doCreateCompSheet()
	// 
	// Description:
	// This function performs the actual creation of the comp contact sheet.
	// 
	// Parameters:
	// None.
	// 
	// Returns:
	// Nothing.
	//
	function rd_CompSheet_doCreateCompSheet()
	{
		// Check that a project exists
		if (app.project === null)
			return;
		
		// Get the current (active/frontmost) comp
		var comp = app.project.activeItem;
		
		if ((comp === null) || !(comp instanceof CompItem))
		{
			alert(rd_CompSheet_localize(rd_CompSheetData.strErrNoCompSel), rd_CompSheetData.scriptName);
			return;
		}
		
		// Find the topmost 'style frames' layer that has at least one marker
		var markerLayer = null;
		var layer;
		
		for (var i=1; i<=comp.numLayers; i++)
		{
			layer = comp.layer(i);
			if ((layer.name === "style frames") && (layer.property("Marker") !== null) && (layer.property("Marker").numKeys > 0))
			{
				markerLayer = layer;
				break;
			}
		}
		
		if (markerLayer === null)
		{
			alert(rd_CompSheet_localize(rd_CompSheetData.strErrNoLayerMarkers), rd_CompSheetData.scriptName);
			return;
		}
		
		var markerStream = markerLayer.property("Marker");
		
		// Perform operation as a single undoable event
		app.beginUndoGroup(rd_CompSheetData.scriptName);
		
		// Create the comp contact sheet
		var rows = parseInt(this.parent.parent.sheet.rows.fld.text);
		var cols = parseInt(this.parent.parent.sheet.cols.fld.text);
		var spacingX = parseInt(this.parent.parent.sheet.xgap.fld.text);
		var spacingY = parseInt(this.parent.parent.sheet.ygap.fld.text);
		
		// Determine the comp sheet dimensions
		var cellTplName = this.parent.parent.cell.tpl.fld.text, cellTpl = null;
		var compWidth, compHeight, cellWidth, cellHeight;
		var sizeFactor = parseInt(this.parent.parent.sheet.ssize.fld.text) / 100;
		
		if (cellTplName !== "")																// Comp cell template defined, so look for it
		{
			// Look for the named comp template
			for (var i=1; i<=app.project.numItems; i++)
				if (app.project.item(i).name === cellTplName)
				{
					cellTpl = app.project.item(i);
					break;
				}
			
			cellWidth = parseInt(((cellTpl !== null) ? cellTpl.width : comp.width) * sizeFactor);
			cellHeight = parseInt(((cellTpl !== null) ? cellTpl.height : comp.height) * sizeFactor);
			
			// If not found, use the selected comp's dimensions, else the selected comp's dimensions
			compWidth = cellWidth * cols + spacingX * (cols + 1);
			compHeight = cellHeight * rows + spacingY * (rows + 1);
		}
		else																					// No comp cell template, so match cell to comp size
		{
			cellWidth = parseInt(comp.width * sizeFactor);
			cellHeight = parseInt(comp.height * sizeFactor);
			
			compWidth = cellWidth * cols + spacingX * (cols + 1);
			compHeight = cellHeight * rows + spacingY * (rows + 1);
		}
		
		var compFrames = Math.ceil(markerStream.numKeys / (rows * cols));				// Max number of sheets (frames)
		
		// Create the contact sheet comp; remove existing first
		var compSheetName = comp.name + " Sheet";
		var compSheet;
		
		for (var i=1; i<=comp.parentFolder.numItems; i++)								// Locate cell comp in same folder as comp
		{
			compSheet = comp.parentFolder.item(i);
			if ((compSheet instanceof CompItem) && (compSheet.name === compSheetName))
			{
				compSheet.remove();															// Delete cell comp
				break;
			}
		}
																								// Create cell comp
		compSheet = app.project.items.addComp(compSheetName, compWidth, compHeight, comp.pixelAspect, compFrames / comp.frameRate, comp.frameRate);
		compSheet.parentFolder = comp.parentFolder;										// Move comp sheet in same folder as original comp
		
		var startX = cellWidth / 2 + spacingX;
		var startY = cellHeight / 2 + spacingY;
		var posXOffset = cellWidth + spacingX;
		var posYOffset = cellHeight + spacingY;
		var currFrame, cell, cellLayer, currMarkerIndex, currMarkerTime, timeRemapStream, timeRemapKeyIndex;
		var caption = parseInt(this.parent.parent.cell.caption.lst.selection.index);
		var captionName = this.parent.parent.cell.captionName.fld.text;
		var picture, pictureLayer, captionLayer, captionText;
		var xformsGroup, xform;
		
		// Create the subfolder for storing the cell comps; remove existing first
		var cellFolderName = comp.name + " Cells";
		var cellFolder;
		
		for (var i=1; i<=comp.parentFolder.numItems; i++)								// Locate cell folder in same folder as comp
		{
			cellFolder = comp.parentFolder.item(i);
			if ((cellFolder instanceof FolderItem) && (cellFolder.name === cellFolderName))
			{
				cellFolder.remove();															// Delete cell folder
				break;
			}
		}
		
		cellFolder = app.project.items.addFolder(cellFolderName);						// Create cell folder
		cellFolder.parentFolder = comp.parentFolder;										// Move cell folder to same folder as original comp
		
		// Loop through the number of sheets (frames) to create
		currFrame = 0;
		currMarkerIndex = 1;
		
		for (var s=1; s<=compFrames; s++)
		{
			// Loop through rows and columns in each sheet
			for (var r=0; r<rows; r++)
			{
				for (var c=1; c<=cols; c++)
				{
					// Stop creating cells if we run out of 'style frames' (markers)
					if (currMarkerIndex > markerStream.numKeys)
						break;
					
					// Create new cell
					if (cellTpl !== null)														// Duplicate cell template comp, or original comp (if no template)
						cell = cellTpl.duplicate();	
					else
						cell = app.project.items.addComp("temp", comp.width, comp.height, comp.pixelAspect, comp.duration, comp.frameRate);
					cell.name = "sheet " + s + ", row " + (r+1) + ", col " + c;		// Name cell based on sheet coordinates
					cell.selected = false;													// Deselect cell comp
					cell.parentFolder = cellFolder;										// Move comp to cell folder
					
					// Add cell comp to comp sheet
					cellLayer = compSheet.layers.add(cell, compSheet.frameDuration);
					cellLayer.duration = compSheet.frameDuration;						// Shorten cell layer to one frame
					cellLayer.inPoint = currFrame;											// Shift the cell layer to the correct sheet offset
					cellLayer.selected = false;												// Desaelext cell layer
					cellLayer.moveToEnd();													// Move to bottom of comp
					
					// Update picture contents, if picture layer exists
					pictureLayer = cell.layer("picture");
					if (pictureLayer !== null)
					{
						picture = cell.layers.add(comp, comp.duration);					// Insert comp into template
						picture.moveBefore(pictureLayer);									// Move comp layer above picture layer
						
						picture.threeDLayer = pictureLayer.threeDLayer;					// Set layer to 3D if template layer is 3D
						
						xformsGroup = picture.property("ADBE Transform Group");		// Copy basic layer transforms to picture layer
						for (var i=1; i<=xformsGroup.numProperties; i++)
						{
							xform = xformsGroup.property(i).matchName;					// Get the match name for the property
							try
							{
								if (pictureLayer.property("ADBE Transform Group").property(xform).isModified)
									picture.property("ADBE Transform Group").property(xform).setValue(pictureLayer.property("ADBE Transform Group").property(xform).value);
							}
							catch (e)
							{}
						}
						
						pictureLayer.remove();												// Remove the picture layer template
					}
					else if (cellTpl === null)												// Add comp to cell only if didn't start with a cell template
						picture = cell.layers.add(comp, comp.duration);
					
					// Update caption contents, if caption layer exists
					captionLayer = cell.layer("caption");
					if (captionLayer !== null)
					{
						switch (caption)
						{
							case 0:															// Custom Name
								if (captionName !== "")
									captionLayer.property("Source Text").setValue(new TextDocument(captionName));
								break;
							case 1:															// Marker Comment
								captionText = markerStream.keyValue(currMarkerIndex).comment;
								if (captionText !== "")
									captionLayer.property("Source Text").setValue(new TextDocument(captionText));
								break;
							case 2:															// Frame Number
								captionLayer.property("Source Text").expression = "comp(\"" + comp.name + "\").layer(\"style frames\").marker.key(" + currMarkerIndex + ").time / comp(\"" + comp.name + "\").frameDuration";
								captionLayer.property("Source Text").expressionEnabled = true;
								//captionText = parseInt(markerStream.keyTime(currMarkerIndex) * comp.frameRate);
								break;
							case 3:															// Frame Time
								captionLayer.property("Source Text").expression = "timeToCurrentFormat(comp(\"" + comp.name + "\").layer(\"style frames\").marker.key(" + currMarkerIndex + ").time, 1 / comp(\"" + comp.name + "\").frameDuration, false)";
								captionLayer.property("Source Text").expressionEnabled = true;
								//captionText = timeToCurrentFormat(markerStream.keyTime(currMarkerIndex), comp.frameRate, false	);
								break;
							case 4:															// Cell Number
								captionLayer.property("Source Text").setValue(new TextDocument(currMarkerIndex.toString()));
								break;
							default:
								captionText = "";
						}
					}
					
					// Shrink and reposition the cell layer
					cellLayer.property("Scale").setValue([sizeFactor * 100, sizeFactor * 100]);
					cellLayer.property("Position").setValue([startX + posXOffset * (c-1), startY + posYOffset * r]);
					
					// Set time remapping for the current marker time
					currMarkerTime = markerStream.keyTime(currMarkerIndex);			// Determine the marker time
					
					cellLayer.timeRemapEnabled = true;										// Enable time remapping on layer
					timeRemapStream = cellLayer.property("ADBE Time Remapping");
																								// Link time remap property to associated marker time
					timeRemapStream.expression = "comp(\"" + comp.name + "\").layer(\"style frames\").marker.key(" + currMarkerIndex + ").time";
					timeRemapStream.expressionEnabled = true;
					
					// Go to the next marker
					currMarkerIndex++;
				}
				
				// Stop creating cells if we run out of 'style frames' (markers)
				if (currMarkerIndex > markerStream.numKeys)
					break;
			}
			
			// Advance to the next sheet (frame)
			currFrame += compSheet.frameDuration;
		}
		
		comp.selected = false;
		compSheet.selected = true;
		
		app.endUndoGroup();
	}
	
	
	
	
	// main code:
	//
	
	if (parseFloat(app.version) < 10.0)
		alert(rd_CompSheet_localize(rd_CompSheetData.strMinAE100), rd_CompSheetData.scriptName);
	else
	{
		// Build and show the console's floating palette
		var rdcsPal = rd_CompSheet_buildUI(thisObj);
		if (rdcsPal !== null)
		{
			// Update UI values, if saved in the settings
			if (app.settings.haveSetting("redefinery", "rd_CompSheet_rows"))
			{
				rdcsPal.grp.sheet.rows.fld.text = app.settings.getSetting("redefinery", "rd_CompSheet_rows").toString();
				rdcsPal.grp.sheet.rows.sld.value = parseInt(rdcsPal.grp.sheet.rows.fld.text);
			}
			if (app.settings.haveSetting("redefinery", "rd_CompSheet_cols"))
			{
				rdcsPal.grp.sheet.cols.fld.text = app.settings.getSetting("redefinery", "rd_CompSheet_cols").toString();
				rdcsPal.grp.sheet.cols.sld.value = parseInt(rdcsPal.grp.sheet.cols.fld.text);
			}
			if (app.settings.haveSetting("redefinery", "rd_CompSheet_scale"))
			{
				rdcsPal.grp.sheet.ssize.fld.text = app.settings.getSetting("redefinery", "rd_CompSheet_scale").toString();
				rdcsPal.grp.sheet.ssize.sld.value = parseInt(rdcsPal.grp.sheet.ssize.fld.text);
			}
			if (app.settings.haveSetting("redefinery", "rd_CompSheet_xgap"))
			{
				rdcsPal.grp.sheet.xgap.fld.text = app.settings.getSetting("redefinery", "rd_CompSheet_xgap").toString();
				rdcsPal.grp.sheet.xgap.sld.value = parseInt(rdcsPal.grp.sheet.xgap.fld.text);
			}
			if (app.settings.haveSetting("redefinery", "rd_CompSheet_ygap"))
			{
				rdcsPal.grp.sheet.ygap.fld.text = app.settings.getSetting("redefinery", "rd_CompSheet_ygap").toString();
				rdcsPal.grp.sheet.ygap.sld.value = parseInt(rdcsPal.grp.sheet.ygap.fld.text);
			}
			if (app.settings.haveSetting("redefinery", "rd_CompSheet_tpl"))
				rdcsPal.grp.cell.tpl.fld.text = app.settings.getSetting("redefinery", "rd_CompSheet_tpl").toString();
			if (app.settings.haveSetting("redefinery", "rd_CompSheet_caption"))
			{
				rdcsPal.grp.cell.caption.lst.selection = parseInt(app.settings.getSetting("redefinery", "rd_CompSheet_caption"));
				rdcsPal.grp.cell.captionName.fld.enabled = (rdcsPal.grp.cell.caption.lst.selection.index === 0);
			}
			if (app.settings.haveSetting("redefinery", "rd_CompSheet_captionName"))
				rdcsPal.grp.cell.captionName.fld.text = app.settings.getSetting("redefinery", "rd_CompSheet_captionName").toString();
			
			// Save current UI settings upon closing the palette
			rdcsPal.onClose = function()
			{
				app.settings.saveSetting("redefinery", "rd_CompSheet_rows", rdcsPal.grp.sheet.rows.fld.text);
				app.settings.saveSetting("redefinery", "rd_CompSheet_cols", rdcsPal.grp.sheet.cols.fld.text);
				app.settings.saveSetting("redefinery", "rd_CompSheet_scale", rdcsPal.grp.sheet.ssize.fld.text);
				app.settings.saveSetting("redefinery", "rd_CompSheet_xgap", rdcsPal.grp.sheet.xgap.fld.text);
				app.settings.saveSetting("redefinery", "rd_CompSheet_ygap", rdcsPal.grp.sheet.ygap.fld.text);
				app.settings.saveSetting("redefinery", "rd_CompSheet_tpl", rdcsPal.grp.cell.tpl.fld.text);
				app.settings.saveSetting("redefinery", "rd_CompSheet_caption", rdcsPal.grp.cell.caption.lst.selection.index);
				app.settings.saveSetting("redefinery", "rd_CompSheet_captionName", rdcsPal.grp.cell.captionName.fld.text);
			}
			
			if (rdcsPal instanceof Window)
			{
				// Show the palette
				rdcsPal.center();
				rdcsPal.show();
			}
			else
				rdcsPal.layout.layout(true);
		}
	}
})(this);
