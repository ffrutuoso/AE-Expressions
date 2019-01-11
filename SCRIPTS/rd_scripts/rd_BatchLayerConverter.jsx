// rd_BatchLayerConverter.jsx
// Copyright (c) 2012-2013 redefinery (Jeffrey R. Almasol). All rights reserved.
// check it: www.redefinery.com
// 
// Name: rd_BatchLayerConverter
// Version: 0.9
// 
// Description:
// This script batch converts the selected layers to other 
// types of layers (for example, layered comps, editable text,
// shapes, or masks), by using the commands in the Layer menu.
// Each created layer is placed above its corresponding original
// layer, and layer switches are copied over.
// 
// This script is a superset of the rd: Batch Vector to Shape
// script.
// 
// Note: This version of the script requires After Effects CS6 
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




// rd_BatchLayerConverter()
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
(function rd_BatchLayerConverter(thisObj)
{
	// Globals

	var rd_BatchLayerConverterData = new Object();	// Store globals in an object
	rd_BatchLayerConverterData.scriptName = "rd: Batch Layer Converter";
	rd_BatchLayerConverterData.scriptTitle = rd_BatchLayerConverterData.scriptName + " v0.9";

	rd_BatchLayerConverterData.menuCommand = {
		en: ["Convert to Editable Text or Layered Comp", "Create Shapes from Text", "Create Masks from Text", "Create Shapes from Vector Layer"]
	};
	rd_BatchLayerConverterData.menuCommandID = {
		en: [3799, 3781, 2933, 3973]
	};

	rd_BatchLayerConverterData.strDeleteOrigLayer = {en: "Delete original layer if new one was created"};
	
	rd_BatchLayerConverterData.strHelp = {en: "?"};
	rd_BatchLayerConverterData.strNoCompSel = {en: "Select or open a composition, then try again."};
	rd_BatchLayerConverterData.strNoLayerSel = {en: "Select at least one layer, then try again."};
	rd_BatchLayerConverterData.strMinAE110 = {en: "This script requires Adobe After Effects CS6 or later."};
	rd_BatchLayerConverterData.strHelpText = 
	{
		en: "Copyright (c) 2012-2013 redefinery (Jeffrey R. Almasol).\n" +
		"All rights reserved.\n" +
		"\n" +
		"This script batch converts the selected layers to other types of layers (for example, layered comps, editable text, shapes, or masks), by using the commands in the Layer menu. Each created layer is placed above its corresponding original layer, and layer switches are copied over.\n" +
		"\n" +
		"This script is a superset of the older rd: Batch Vector to Shape script.\n" +
		"\n" +
		"Note: This version of the script requires After Effects CS6 or later. It can be used as a dockable panel by placing the script in a ScriptUI Panels subfolder of the Scripts folder, and then choosing this script from the Window menu."
	};




	// rd_BatchLayerConverter_localize()
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
	function rd_BatchLayerConverter_localize(strVar)
	{
		return strVar["en"];
	}
	
	
	
	
	// rd_BatchLayerConverter_buildUI()
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
	function rd_BatchLayerConverter_buildUI(thisObj)
	{
		var pal = (thisObj instanceof Panel) ? thisObj : new Window("palette", rd_BatchLayerConverterData.scriptName, undefined, {resizeable:true});
		
		if (pal !== null)
		{
			var res = 
			"""group { 
				orientation:'column', alignment:['fill','top'], alignChildren:['fill','top'], 
				header: Group { 
					alignment:['fill','top'], 
					title: StaticText { text:'""" + rd_BatchLayerConverterData.scriptName + """', alignment:['fill','center'] }, 
					help: Button { text:'""" + rd_BatchLayerConverter_localize(rd_BatchLayerConverterData.strHelp) + """', maximumSize:[30,20], alignment:['right','center'] }, 
				}, 
				cmds: Group {
					orientation:'column', alignment:['fill','top'], alignChildren:['fill','top'], spacing:5, """;
			
			var cmds = rd_BatchLayerConverter_localize(rd_BatchLayerConverterData.menuCommand);
			var cmdID = rd_BatchLayerConverter_localize(rd_BatchLayerConverterData.menuCommandID);
			for (var i=0; i<cmds.length; i++)
			{
				res += "cmd" + (i+1).toString() + ": Button { text:'" + cmds[i] + "', preferredSize:[-1,20], cmdIndex:" + i + " }, ";
			}
			
			res += """},
				removeOldLayer: Checkbox { alignment:['fill','top'], text:'""" + rd_BatchLayerConverter_localize(rd_BatchLayerConverterData.strDeleteOrigLayer) + """', value:false },
			}""";
			pal.grp = pal.add(res);
			
			pal.layout.layout(true);
			pal.grp.minimumSize = pal.grp.size;
			pal.layout.resize();
			pal.onResizing = pal.onResize = function () {this.layout.resize();}
			
			for (var i=0; i<cmds.length; i++)
			{
				eval("pal.grp.cmds.cmd" + (i+1).toString() + ".onClick = function () {rd_BatchLayerConverter_doIt(this.cmdIndex);}");
			}
			
			pal.grp.header.help.onClick = function () {alert(rd_BatchLayerConverterData.scriptTitle + "\n" + rd_BatchLayerConverter_localize(rd_BatchLayerConverterData.strHelpText), rd_BatchLayerConverterData.scriptName);}
		}
		
		return pal;
	}




	// rd_BatchLayerConverter_doIt()
	// 
	// Description:
	// This callback function performs the main operation.
	// 
	// Parameters:
	// cmdIndex - Array index representing the command selected.
	// 
	// Returns:
	// Nothing.
	//
	function rd_BatchLayerConverter_doIt(cmdIndex)
	{
		var comp = app.project.activeItem;
		if ((comp === null) || !(comp instanceof CompItem)) {
			alert(rd_BatchLayerConverter_localize(rd_BatchLayerConverterData.strNoCompSel));
			return;
		}
		if (comp.selectedLayers.length === 0) {
			alert(rd_BatchLayerConverter_localize(rd_BatchLayerConverterData.strNoLayerSel));
			return;
		}
		comp.openInViewer();	// just to make sure the comp's panel is frontmost

		// make a copy of the selected layers, in reverse layer order
		var selLayers = new Array();
		for (var i=comp.numLayers; i>0; i--) {
			if (comp.layer(i).selected) {
				selLayers[selLayers.length] = comp.layer(i);
				selLayers[selLayers.length-1].selected = false;	// deselect layers as we process them
			}
		}

		var cmdName = rd_BatchLayerConverter_localize(rd_BatchLayerConverterData.menuCommand)[cmdIndex];
		var cmdID = rd_BatchLayerConverter_localize(rd_BatchLayerConverterData.menuCommandID)[cmdIndex];
		var removeOld = rdblcPal.grp.removeOldLayer.value;
		
		var convertedLayers = new Array();	// keep track of converted layers (to select afterwards)
		
		app.beginUndoGroup(rd_BatchLayerConverterData.scriptName + ": " + cmdName);

		// loop through the previously selected layers
		var numLayersInComp = comp.numLayers;	// keep track of the original number of layers (so we know if any shape layer was actually created)
		//for (var i=0; i<selLayers.length; i++) {
		for (var i=selLayers.length-1; i>=0; i--) {
			var l = selLayers[i];	// select each layer to process
			l.selected = true;
			var lType = l.constructor;
			try {
				// invoke the menu command
				app.executeCommand(cmdID);
				
				if (((cmdIndex === 1) || (cmdIndex === 2) || (cmdIndex === 3)) &&
					(comp.numLayers !== numLayersInComp))
				{
					// converted layer is at the top of the comp, so move it just above the original vector layer
					var lv = comp.layer(1);
					lv.moveBefore(l);
					lv.selected = false;
					
					if ((cmdIndex === 1) && (lv instanceof ShapeLayer) && (l instanceof TextLayer))
						convertedLayers[convertedLayers.length] = lv;
					else if ((cmdIndex === 2) && (lv instanceof AVLayer) && (l instanceof TextLayer))
						convertedLayers[convertedLayers.length] = lv;
					else if ((cmdIndex === 3) && (lv instanceof ShapeLayer) && (l instanceof AVLayer))
						convertedLayers[convertedLayers.length] = lv;
					
					lv.motionBlur = l.motionBlur;	// retain original layer's motion blur setting
					
					if (removeOld)
						l.remove();
				}
				else {
					//alert("layer " + i.toString() + " skipped!");
					var lv = comp.selectedLayers[0];
					lv.selected = false;
					
					if ((cmdIndex === 0) && (((lv instanceof TextLayer) && (lType !== TextLayer)) || ((lv instanceof AVLayer) && (lv.source instanceof CompItem))))
						convertedLayers[convertedLayers.length] = lv;
				}
			}
			catch (e)
			{
				//alert("layer " + i.toString() + ": " + e.toString());
			}
			numLayersInComp = comp.numLayers;
		}
		
		// Select the converted layers
		for (var i=0; i<convertedLayers.length; i++)
			convertedLayers[i].selected = true;

		app.endUndoGroup();
	}




	// main code:
	//

	// Prerequisites check
	if (parseFloat(app.version) < 11.0)
		alert(rd_BatchLayerConverter_localize(rd_BatchLayerConverterData.strMinAE110), rd_BatchLayerConverterData.scriptName);
	else
	{
		// Build and show the console's floating palette
		var rdblcPal = rd_BatchLayerConverter_buildUI(thisObj);
		if (rdblcPal !== null)
		{
			if (rdblcPal instanceof Window)
			{
				// Show the palette
				rdblcPal.center();
				rdblcPal.show();
			}
			else
				rdblcPal.layout.layout(true);
		}
	}
})(this);
