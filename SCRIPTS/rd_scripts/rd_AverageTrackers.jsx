// rd_AverageTrackers.jsx
// Copyright (c) 2007-2013 redefinery (Jeffrey R. Almasol). All rights reserved.
// check it: www.redefinery.com
// 
// Name: rd_AverageTrackers
// Version: 2.0
// 
// Description:
// This script creates a null layer whose position is an 
// expression-driven value of the average of the selected 
// layer's motion tracker track points of your choosing. 
// A dialog box lists the track points on the layer, with the 
// enabled ones selected by default.
// 
// Note: This script requires After Effects CS4 or later.
// 
// Originally requested by Stu Maschwitz.
// 
// Legal stuff:
// This script is provided "as is," without warranty of any kind, expressed
// or implied. In no event shall the author be held liable for any damages 
// arising in any way from the use of this script.
// 
// In other words, I'm just trying to share knowledge with and help out my
// fellow AE script heads, so don't blame me if my code doesn't rate. :-)




// rd_AverageTrackers()
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
(function rd_AverageTrackers(thisObj)
{
	// Globals
	
	var onWindows = ($.os.indexOf("Windows") !== -1);
	
	var rd_AverageTrackersData = new Object();	// Store globals in an object
	rd_AverageTrackersData.scriptName = "rd: Average Trackers";
	rd_AverageTrackersData.scriptTitle = rd_AverageTrackersData.scriptName + " v2.0";
	
	rd_AverageTrackersData.strHeading = {en: "Select track points to average:"};
	rd_AverageTrackersData.strCaption = (onWindows) ? {en: "(Ctrl-click to select multiple track points)"} :  {en: "(Cmd-click to select multiple track points)"};
	rd_AverageTrackersData.strOK = {en: "OK"};
	rd_AverageTrackersData.strCancel = {en: "Cancel"};
	rd_AverageTrackersData.strHelp = {en: "?"};
	rd_AverageTrackersData.strMinAE90 = {en: "This script requires Adobe After Effects CS4 or later."};
	rd_AverageTrackersData.strErrNoCompSel = {en: "Cannot perform operation. Please select or open a single composition in the Project panel, and try again."};
	rd_AverageTrackersData.strNoSelLayer = {en: "Cannot perform operation. Please select a single layer with at least two motion tracker track points, and try again."};
	rd_AverageTrackersData.strHelpText = 
	{
		en: "Copyright (c) 2007-2013 redefinery (Jeffrey R. Almasol). All rights reserved.\n" +
		"\n" +
		"This script creates a null layer whose position is an expression-driven value of the average of the selected layer's motion tracker track points of your choosing. A dialog box lists the track points on the layer, with the enabled ones selected by default.\n" + 
		"\n" +
		"Note: This script requires After Effects CS4 or later.\n" +
		"\n" +
		"Originally requested by Stu Maschwitz.\n"
	};
	
	
	
	
	// rd_AverageTrackers_localize()
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
	function rd_AverageTrackers_localize(strVar)
	{
		return strVar["en"];
	}
	
	
	
	
	// rd_AverageTrackers_buildUI()
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
	function rd_AverageTrackers_buildUI(thisObj)
	{
		var pal = new Window("dialog", rd_AverageTrackersData.scriptName, undefined, {resizeable:true});
		
		if (pal !== null)
		{
			var res =
			"""group { 
				orientation:'column', alignment:['fill','fill'], 
				heading: StaticText { text:'""" + rd_AverageTrackers_localize(rd_AverageTrackersData.strHeading) + """', alignment:['fill','top'] }, 
				lst: ListBox { alignment:['fill','fill'], properties:{ multiselect:true } }, 
				cap: StaticText { text:'""" + rd_AverageTrackers_localize(rd_AverageTrackersData.strCaption) + """', alignment:['fill','bottom'] }, 
				cmds: Group { 
					alignment:['fill','bottom'], 
					help: Button { text:'""" + rd_AverageTrackers_localize(rd_AverageTrackersData.strHelp) + """', maximumSize:[30,20], alignment:['left','bottom'] }, 
			""";
			if (onWindows)
				res += """ 
					okBtn: Button { text:'""" + rd_AverageTrackers_localize(rd_AverageTrackersData.strOK) + """', alignment:['right','bottom'], preferredSize:[-1,20] }, 
					cancelBtn: Button { text:'""" + rd_AverageTrackers_localize(rd_AverageTrackersData.strCancel) + """', alignment:['right','bottom'], preferredSize:[-1,20] }, 
				""";
			else
				res += """ 
					cancelBtn: Button { text:'""" + rd_AverageTrackers_localize(rd_AverageTrackersData.strCancel) + """', alignment:['right','bottom'], preferredSize:[-1,20] }, 
					okBtn: Button { text:'""" + rd_AverageTrackers_localize(rd_AverageTrackersData.strOK) + """', alignment:['right','bottom'], preferredSize:[-1,20] }, 
				""";
			res += """ 
				}, 
			}""";
			pal.grp = pal.add(res);
			
			pal.grp.cmds.margins.top = 5;
			pal.grp.lst.preferredSize.height = 100;
			
			pal.layout.layout(true);
			pal.grp.minimumSize = pal.grp.size;
			pal.layout.resize();
			pal.onResizing = pal.onResize = function () {this.layout.resize();}
			
			pal.grp.cmds.help.onClick = function () {alert(rd_AverageTrackersData.scriptTitle + "\n" + rd_AverageTrackers_localize(rd_AverageTrackersData.strHelpText), rd_AverageTrackersData.scriptName);}
			pal.grp.cmds.okBtn.onClick = rd_AverageTrackers_doIt;
		}
		
		return pal;
	}
	
	
	
	
	// rd_AverageTrackers_getMTTrackPoints()
	// 
	// Description:
	// This function retrieves the motion tracker track points on the specified layer.
	// 
	// Parameters:
	//   layer - The layer to check.
	// 
	// Returns:
	// Array of motion tracker track points
	//
	function rd_AverageTrackers_getMTTrackPoints(layer)
	{
		var mtPts = new Array();
		
		if (layer !== null)
		{
			var mtGroup = layer("ADBE MTrackers");
			if (mtGroup !== null)
			{
				var mtracker;
				
				for (var i=1; i<=mtGroup.numProperties; i++)
				{
					mtracker = mtGroup.property(i);
					for (var j=1; j<=mtracker.numProperties; j++)
						mtPts[mtPts.length] = mtracker.property(j); 
				}
			}
		}
		
		return mtPts;
	}
	
	
	
	
	// rd_AverageTrackers_doIt()
	// 
	// Description:
	// This callback function performs the main operation.
	// 
	// Parameters:
	// None.
	// 
	// Returns:
	// Nothing
	//
	function rd_AverageTrackers_doIt()
	{
		var selection = this.parent.parent.lst.selection;
		
		app.beginUndoGroup(rd_AverageTrackersData.scriptName);
		
		var comp = app.project.activeItem;
		var layer = comp.selectedLayers[0];
		var nullLayer = comp.layers.addNull();
		
		nullLayer.name = "Average";
		
		var mt;
		var expr = "l = thisComp.layer(\"" + layer.name + "\");\n(";
		for (var i=0; i<selection.length; i++)
		{
			mt = rd_AverageTrackersData.mtPts[selection[i].index];
			if (i > 0)
				expr += " + ";
			expr += "l.motionTracker(\"" + mt.parentProperty.name + "\")(\"" + mt.name + "\").attachPoint+l.motionTracker(\"" + mt.parentProperty.name + "\")(\"" + mt.name + "\").attachPointOffset";
		}
		expr += ") / " + selection.length + ";";
		
		nullLayer.position.expression = expr;
		nullLayer.position.expressionEnabled = true;
		
		app.endUndoGroup();
		
		this.parent.parent.parent.close();
	}
	
	
	
	
	// main code:
	//
	
	// Prerequisites check
	if (parseFloat(app.version) < 9.0)
		alert(rd_AverageTrackers_localize(rd_AverageTrackersData.strMinAE90), rd_AverageTrackersData.scriptName);
	else
	{
		// Make sure only a single comp is selected
		if (app.project === null)
			return;
		
		// Get the current (active/frontmost) comp
		var comp = app.project.activeItem;
		
		if ((comp === null) || !(comp instanceof CompItem))
		{
			alert(rd_AverageTrackers_localize(rd_AverageTrackersData.strErrNoCompSel), rd_AverageTrackersData.scriptName);
			return;
		}
		
		// Make sure there is a selected layer with at least two motion tracker track points
		if (comp.selectedLayers.length !== 1)
		{
			alert(rd_AverageTrackers_localize(rd_AverageTrackersData.strNoSelLayer), rd_AverageTrackersData.scriptName);
			return;
		}
		
		var layer = comp.selectedLayers[0];
		rd_AverageTrackersData.mtPts = rd_AverageTrackers_getMTTrackPoints(layer);
		
		if (rd_AverageTrackersData.mtPts.length < 2)
		{
			alert(rd_AverageTrackers_localize(rd_AverageTrackersData.strNoSelLayer), rd_AverageTrackersData.scriptName);
			return;
		}
		
		var dlg = rd_AverageTrackers_buildUI(thisObj);
		if (dlg !== null)
		{
			// Add the list of motion tracker track points to the UI
			for (var i=0; i<rd_AverageTrackersData.mtPts.length; i++)
			{
				dlg.grp.lst.add("item", rd_AverageTrackersData.mtPts[i].parentProperty.name + " > " + rd_AverageTrackersData.mtPts[i].name);
				if (rd_AverageTrackersData.mtPts[i].enabled)
					dlg.grp.lst.items[i].selected = true;
			}
			
			// Show the dialog
			dlg.center();
			dlg.show();
		}
	}
})(this);
