// rd_MarkerNavigator.jsx
// Copyright (c) 2005-2013 redefinery (Jeffrey R. Almasol). All rights reserved.
// check it: www.redefinery.com
// 
// Name: rd_MarkerNavigator
// Version: 3.0
// 
// Description:
// This script allows you to easily view and edit the info for the markers 
// on the selected layer. Click a marker in the list to jump to that
// particular marker in the current composition. Select multiple markers
// to modify their info quickly and easily; fields that have different 
// (mixed) information are blank and will not change unless you make a 
// change in those fields.
// 
// Click the More Options button (>>) to view and edit the selected marker's
// information. The button changes to a Less Options button (<<) tbat you
// can click if all you want is a simple navigator without any editing 
// capability. The state of this button is saved as a setting for future 
// sessions.
// 
// Note: If you select a different layer, modify the markers in the Layer Marker
// dialog box, change the frame rate or start timecode for the comp, or
// change the time display style for the project, you will need to press 
// the Refresh button to update the list of markers. 
// 
// Note: In compositions with fractional (29.97, 23.976, etc.) or changed
// frame rates (e.g., from 30 to 24), displayed marker times might not be 
// accurate, nor will the current time indicator jump to the expected
// location. This script tries to adjust marker times to match the times
// displayed in the Layer Marker dialog box, which might not be the same as
// shown in the Timeline.
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




// rd_MarkerNavigator()
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
(function rd_MarkerNavigator(thisObj)
{
	// Globals
	
	var rd_MarkerNavigatorData = new Object();	// Store globals in an object
	rd_MarkerNavigatorData.scriptName = "rd: Marker Navigator";
	rd_MarkerNavigatorData.scriptTitle = rd_MarkerNavigatorData.scriptName + " v3.0";
	
	rd_MarkerNavigatorData.strMarkersHeading = {en: "rd: Marker Navigator"};
	rd_MarkerNavigatorData.strComment = {en: "Comment:"};
	rd_MarkerNavigatorData.strTime = {en: "Time:"};
	rd_MarkerNavigatorData.strOptions = {en: "Chapter and Web Links"};
	rd_MarkerNavigatorData.strChapter = {en: "Chapter:"};
	rd_MarkerNavigatorData.strURL = {en: "URL:"};
	rd_MarkerNavigatorData.strFrameTarget = {en: "Frame Target:"};
	rd_MarkerNavigatorData.strDelete = {en: "Delete"};
	rd_MarkerNavigatorData.strRefresh = {en: "Refresh"};
	rd_MarkerNavigatorData.strMoreDetails = {en: ">>"};
	rd_MarkerNavigatorData.strLessDetails = {en: "<<"};
	rd_MarkerNavigatorData.strHelp = {en: "?"};
	rd_MarkerNavigatorData.strMinAE100 = {en: "This script requires Adobe After Effects CS5 or later."};
	rd_MarkerNavigatorData.strHelpText = 
	{
		en: "Copyright (c) 2005-2013 redefinery (Jeffrey R. Almasol). \n" +
		"All rights reserved.\n" +
		"\n" +
		"This script allows you to easily view and edit the info for the markers on the selected layer. Click a marker in the list to jump to that particular marker in the current composition. Select multiple markers to modify their info quickly and easily; fields that have different (mixed) information are blank and will not change unless you make a change in those fields.\n" +
		"\n" +
		"Click the More Options button (>>) to view and edit the selected marker's information. The button changes to a Less Options button (<<) that you can click if all you want is a simple navigator without any editing capability. The state of this button is saved as a setting for future sessions.\n" +
		"\n" +
		"Note: If you select a different layer, modify the markers in the Layer Marker dialog box, change the frame rate or start timecode for the comp, or change the time display style for the project, you will need to press the Refresh button to update the list of markers.\n" +
		"\n" +
		"Note: In compositions with fractional (29.97, 23.976, etc.) or changed frame rates (e.g., from 30 to 24), displayed marker times might not be accurate, nor will the current time indicator jump to the expected location. This script tries to adjust marker times to match the times displayed in the Layer Marker dialog box, which might not be the same as shown in the Timeline.\n" +
		"\n" +
		"Note: This version of the script requires After Effects CS5 or later. It can be used as a dockable panel by placing the script in a ScriptUI Panels subfolder of the Scripts folder, and then choosing this script from the Window menu.\n"
	};
	
	rd_MarkerNavigatorData.pal = null;
	
	
	
	
	// rd_MarkerNavigator_localize()
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
	function rd_MarkerNavigator_localize(strVar)
	{
		return strVar["en"];
	}
	
	
	
	
	// rd_MarkerNavigator_buildUI()
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
	function rd_MarkerNavigator_buildUI(thisObj)
	{
		var pal = (thisObj instanceof Panel) ? thisObj : new Window("palette", rd_MarkerNavigatorData.scriptName, undefined, {resizeable:true});
		
		if (pal !== null)
		{
			// Resize the window based on More/Less Details button state;
			var moreLessText;
			//alert("setting bounds; state="+rd_MarkerNavigatorData.showDetails);
			if (eval(rd_MarkerNavigatorData.showDetails) === false)		// Use eval() to match Boolean false and string "false" (which it is when read back from settings)
			{
				moreLessText = rd_MarkerNavigator_localize(rd_MarkerNavigatorData.strMoreDetails);
//					win.bounds.width = win.listBox.bounds.width + 20;
			}
			else
			{
				moreLessText = rd_MarkerNavigator_localize(rd_MarkerNavigatorData.strLessDetails);
//					win.bounds.width = 600;
			}
			
			var res = 
			"group { \
				alignment:['fill','fill'], \
				l: Group { \
					orientation:'column', alignment:['left','fill'], \
					header: Group { \
						alignment:['fill','top'], \
						title: StaticText { text:'" + rd_MarkerNavigatorData.scriptName + "', alignment:['fill','center'] }, \
						help: Button { text:'" + rd_MarkerNavigator_localize(rd_MarkerNavigatorData.strHelp) +"', maximumSize:[30,20], alignment:['right','center'] }, \
					}, \
					r1: Group { \
						alignment:['fill','fill'], \
						listBox: ListBox { properties:{multiselect:true}, alignment:['fill','fill'] }, \
					}, \
					cmds: Group { \
						alignment:['fill','bottom'], \
						refreshBtn: Button { text:'" + rd_MarkerNavigator_localize(rd_MarkerNavigatorData.strRefresh) + "', alignment:['fill','bottom'], preferredSize:[-1,20] }, \
					}, \
				}, \
				r: Group { \
					orientation:'column', alignment:['fill','top'], alignChildren:['fill','top'], \
					r1: Group { \
						timeText: StaticText { text:'" + rd_MarkerNavigator_localize(rd_MarkerNavigatorData.strTime) + "', enabled:false, alignment:['left','center'] }, \
						time: StaticText { text:'', enabled:false, alignment:['fill','center'] }, \
					}, \
					r2: Group { \
						commentText: StaticText { text:'" + rd_MarkerNavigator_localize(rd_MarkerNavigatorData.strComment) + "', enabled:false, alignment:['left','center'] }, \
						comment: EditText { text:'', characters:20, enabled:false, alignment:['fill','center'], preferredSize:[-1,20] }, \
					}, \
					optsPnl: Panel { \
						text:'" + rd_MarkerNavigator_localize(rd_MarkerNavigatorData.strOptions) + "', enabled:false, alignment:['fill','fill'], alignChildren:['fill','top'], \
						r1: Group { \
							chText: StaticText { text:'" + rd_MarkerNavigator_localize(rd_MarkerNavigatorData.strChapter) + "', enabled:false, alignment:['left','center'] }, \
							ch: EditText { text:'', characters:20, enabled:false, alignment:['fill','center'], preferredSize:[-1,20] }, \
						}, \
						r2: Group { \
							urlText: StaticText { text:'" + rd_MarkerNavigator_localize(rd_MarkerNavigatorData.strURL) + "', enabled:false, alignment:['left','center'] }, \
							url: EditText { text:'', characters:20, enabled:false, alignment:['fill','center'], preferredSize:[-1,20] }, \
						}, \
						r3: Group { \
							frmText: StaticText { text:'" + rd_MarkerNavigator_localize(rd_MarkerNavigatorData.strFrameTarget) + "', enabled:false, alignment:['left','center'] }, \
							frm: EditText { text:'', characters:20, enabled:false, alignment:['fill','center'], preferredSize:[-1,20] }, \
						}, \
					}, \
				}, \
			}";
			pal.grp = pal.add(res);
			
			for (var i=0; i<rd_MarkerNavigatorData.markersList.length; i++)
				pal.grp.l.r1.listBox.add("item", rd_MarkerNavigatorData.markersList[i]);
			pal.grp.l.r1.listBox.onChange = rd_MarkerNavigator_doShowSettings;
			
			pal.grp.l.minimumSize.width = 170;
//				pal.grp.l.r1.listBox.minimumSize.height = pal.grp.r.minimumSize.height;
			pal.grp.r.margins.left += 5;
			pal.grp.r.margins.top += pal.grp.l.header.help.preferredSize.height + pal.grp.l.header.spacing;
//				pal.grp.r.r1.margins.left += pal.grp.r.optsPnl.margins.left;
//				pal.grp.r.r2.margins.left += pal.grp.r.optsPnl.margins.left;
			pal.grp.r.r1.timeText.preferredSize.width = pal.grp.r.r2.commentText.preferredSize.width;
			pal.grp.r.optsPnl.r1.chText.preferredSize.width = pal.grp.r.optsPnl.r2.urlText.preferredSize.width = pal.grp.r.optsPnl.r3.frmText.preferredSize.width;
			
			pal.layout.layout(true);
			pal.grp.minimumSize = pal.grp.size;
			pal.layout.resize();
			pal.onResizing = pal.onResize = function () {this.layout.resize();}
			
			pal.grp.r.r2.comment.onChange = function ()
			{
				var currMarker;
				var newText = this.text.substr(0, 63);		// max length = 63
				var markerStream, markerValue, markerTime;
				
				app.beginUndoGroup(rd_MarkerNavigatorData.scriptName);
				
				for (var i=0; i<this.parent.parent.parent.l.r1.listBox.selection.length; i++)
				{
					currMarker = this.parent.parent.parent.l.r1.listBox.selection[i].index;
					
					// Update marker on layer
					markerStream = rd_MarkerNavigatorData.layer.property("Marker");
					markerValue = markerStream.keyValue(currMarker+1);
					markerValue.comment = newText;
					markerStream.setValueAtKey(currMarker+1, markerValue);
					
					// Update marker info in palette
					rd_MarkerNavigatorData.markers[currMarker].value.comment = newText;
					rd_MarkerNavigatorData.markersList[currMarker] = rd_MarkerNavigatorData.markersList[currMarker].substr(0,rd_MarkerNavigatorData.markersList[currMarker].indexOf("  ")+2) + newText;		// Keep the existing formatted timecode
				}
				
				// Reselect the marker (which was deselected by the refresh)
				rd_MarkerNavigator_refreshLayerMarkersList(this.parent.parent.parent.l.r1.listBox.selection);					// Refresh with new info
				
				app.endUndoGroup();
			}
			
			pal.grp.r.optsPnl.r1.ch.onChange = function ()
			{
				var currMarker;
				var newChapter = this.text.substr(0, 127);		// max length = 127
				var markerStream, markerValue;
				
				app.beginUndoGroup(rd_MarkerNavigatorData.scriptName);
				
				for (var i=0; i<this.parent.parent.parent.parent.l.r1.listBox.selection.length; i++)
				{
					currMarker = this.parent.parent.parent.parent.l.r1.listBox.selection[i].index;
					
					// Update marker on layer
					markerStream = rd_MarkerNavigatorData.layer.property("Marker");
					markerValue = markerStream.keyValue(currMarker+1);
					markerValue.chapter = this.text;
					markerStream.setValueAtKey(currMarker+1, markerValue);
					
					// Update marker info in palette
					rd_MarkerNavigatorData.markers[currMarker].value.chapter = this.text;
				}
				
				app.endUndoGroup();
			}
			
			pal.grp.r.optsPnl.r2.url.onChange = function ()
			{
				var currMarker;
				var markerStream, markerValue;
				
				app.beginUndoGroup(rd_MarkerNavigatorData.scriptName);
				
				for (var i=0; i<this.parent.parent.parent.parent.l.r1.listBox.selection.length; i++)
				{
					currMarker = this.parent.parent.parent.parent.l.r1.listBox.selection[i].index;
					
					// Update marker on layer
					markerStream = rd_MarkerNavigatorData.layer.property("Marker");
					markerValue = markerStream.keyValue(currMarker+1);
					markerValue.url = this.text.substr(0, 127);		// max length = 127
					markerStream.setValueAtKey(currMarker+1, markerValue);
					
					// Update marker info in palette
					rd_MarkerNavigatorData.markers[currMarker].value.url = this.text;
				}
				
				app.endUndoGroup();
			}
			
			pal.grp.r.optsPnl.r3.frm.onChange = function ()
			{
				var currMarker;
				var markerStream, markerValue;
				
				app.beginUndoGroup(rd_MarkerNavigatorData.scriptName);
				
				for (var i=0; i<this.parent.parent.parent.parent.l.r1.listBox.selection.length; i++)
				{
					currMarker = this.parent.parent.parent.parent.l.r1.listBox.selection[i].index;
					
					// Update marker on layer
					markerStream = rd_MarkerNavigatorData.layer.property("Marker");
					markerValue = markerStream.keyValue(currMarker+1);
					markerValue.frameTarget = this.text.substr(0, 127);		// max length = 127
					markerStream.setValueAtKey(currMarker+1, markerValue);
					
					// Update marker info in palette
					rd_MarkerNavigatorData.markers[currMarker].value.frameTarget = this.text;
				}
				
				app.endUndoGroup();
			}
			
			pal.grp.l.cmds.refreshBtn.onClick = function ()
			{
				// Remove the existing list entries
				rd_MarkerNavigatorData.pal.grp.l.r1.listBox.removeAll();
				
				rd_MarkerNavigator_updateLayerMarkers();
				rd_MarkerNavigator_refreshLayerMarkersList(null);
				this.parent.parent.r1.listBox.selection = null;
				rd_MarkerNavigator_doShowSettings();		// Update the marker settings fields
			}
			
			// Set the onClose callback for storing the last state of the showDetails button in settings for use in future sessions
			pal.onClose = function ()
			{
//				alert("saving state="+rd_MarkerNavigatorData.showDetails);
				app.settings.saveSetting("redefinery", "rd_MarkerNavigator_showDetails", rd_MarkerNavigatorData.showDetails);
			}
			
			pal.grp.l.header.help.onClick = function () {alert(rd_MarkerNavigatorData.scriptTitle + "\n" + rd_MarkerNavigator_localize(rd_MarkerNavigatorData.strHelpText), rd_MarkerNavigatorData.scriptName);}
		}
		
		return pal;
	}




	// rd_MarkerNavigator_doShowSettings()
	// 
	// Description:
	// This callback function updates the marker info fields based on the selected marker.
	// 
	// Parameters:
	// None.
	// 
	// Returns:
	// Nothing.
	//
	function rd_MarkerNavigator_doShowSettings()
	{
		var pal = rd_MarkerNavigatorData.pal.grp;
		//alert(this);
		//alert(this.parent);
		//alert(this.parent.listBox);
		//return;
		var selectedMarkers = pal.l.r1.listBox.selection;
		var markerSelected = (selectedMarkers !== null);
		
		// Enable or disable the marker fields as necessary
		pal.r.r2.commentText.enabled = markerSelected;
		pal.r.r2.comment.enabled = markerSelected;
		pal.r.r1.timeText.enabled = markerSelected;
		pal.r.r1.time.enabled = markerSelected;
		pal.r.optsPnl.enabled = markerSelected;
		pal.r.optsPnl.r1.chText.enabled = markerSelected;
		pal.r.optsPnl.r1.ch.enabled = markerSelected;
		pal.r.optsPnl.r2.urlText.enabled = markerSelected;
		pal.r.optsPnl.r2.url.enabled = markerSelected;
		pal.r.optsPnl.r3.frmText.enabled = markerSelected;
		pal.r.optsPnl.r3.frm.enabled = markerSelected;
		
		if (markerSelected)
		{
			// Show the selected markers' info (show blank for indeterminate/mixed values)
			
			// Scan the selected markers, updating the values to display
			var displayComment = rd_MarkerNavigatorData.markers[selectedMarkers[0].index].value.comment;
			var displayCh = rd_MarkerNavigatorData.markers[selectedMarkers[0].index].value.chapter;
			var displayUrl = rd_MarkerNavigatorData.markers[selectedMarkers[0].index].value.url;
			var displayFrm = rd_MarkerNavigatorData.markers[selectedMarkers[0].index].value.frameTarget;
			
			for (var i=1; i<selectedMarkers.length; i++)
			{
				if (rd_MarkerNavigatorData.markers[selectedMarkers[i].index].value.comment !== displayComment)
					displayComment = "";
				if (rd_MarkerNavigatorData.markers[selectedMarkers[i].index].value.chapter !== displayCh)
					displayCh = "";
				if (rd_MarkerNavigatorData.markers[selectedMarkers[i].index].value.url !== displayUrl)
					displayUrl = "";
				if (rd_MarkerNavigatorData.markers[selectedMarkers[i].index].value.frameTarget !== displayFrm)
					displayFrm = "";
			}
			
			// Show the marker info (blank for any indeterminate/mixed values)
			pal.r.r2.comment.text = displayComment;
			pal.r.optsPnl.r1.ch.text = displayCh;
			pal.r.optsPnl.r2.url.text = displayUrl;
			pal.r.optsPnl.r3.frm.text = displayFrm;
			
			var adjustedMarkerTime = rd_MarkerNavigatorData.markers[selectedMarkers[0].index].time + 0.0005;		// Add a slop factor; seems necessary with fractional frame rates
			if ((adjustedMarkerTime % rd_MarkerNavigatorData.comp.frameDuration) > 0.001)	// Adjust for markers not on frame boundaries; match timecode in Marker dialog box
				adjustedMarkerTime += rd_MarkerNavigatorData.comp.frameDuration;
//$.writeln("orig="+rd_MarkerNavigatorData.markers[i].time+", diff="+(adjustedMarkerTime % rd_MarkerNavigatorData.comp.frameDuration)+", adj="+adjustedMarkerTime);
			
			pal.r.r1.time.text = (selectedMarkers.length > 1) ? "different times" : timeToCurrentFormat(adjustedMarkerTime, rd_MarkerNavigatorData.comp.frameRate);
			
			// Move the CTI to the selected marker
			rd_MarkerNavigatorData.comp.time = adjustedMarkerTime;
		}
		else
		{
			// Blank out the marker fields
			pal.r.r2.comment.text = "";
			pal.r.r1.time.text = "";
			pal.r.optsPnl.r1.ch.text = "";
			pal.r.optsPnl.r2.url.text = "";
			pal.r.optsPnl.r3.frm.text = "";
		}
	}
	
	
	
	
	// rd_MarkerNavigator_updateLayerMarkers()
	// 
	// Description:
	// This function retrieves the markers on the selected layer, and builds the arrays of marker data and marker display info
	// 
	// Parameters:
	// None.
	// 
	// Returns:
	// Nothing.
	//
	function rd_MarkerNavigator_updateLayerMarkers()
	{
		var proj = app.project, comp, layer, markerProps, marker;
		
		rd_MarkerNavigatorData.markers = new Array();
		rd_MarkerNavigatorData.markersList = new Array();
		
		if (proj !== null)
		{
			comp = proj.activeItem;
			if ((comp !== null) && (comp instanceof CompItem))
			{
				if (comp.selectedLayers.length === 1)
				{
					var adjustedMarkerTime;
					
					layer = comp.selectedLayers[0];
					markerProps = layer.property("Marker");
					
					for (var i = 1; i <= markerProps.numKeys; i++)
					{
						marker = new Object;
						marker.time = markerProps.keyTime(i);
						marker.value = markerProps.keyValue(i);
						
						adjustedMarkerTime = marker.time + 0.0005;		// Add a slop factor; seems necessary with fractional frame rates
						if ((adjustedMarkerTime % comp.frameDuration) > 0.001)	// Adjust for markers not on frame boundaries; match timecode in Marker dialog box
							adjustedMarkerTime += comp.frameDuration;
						
						rd_MarkerNavigatorData.markers[rd_MarkerNavigatorData.markers.length] = marker;
						rd_MarkerNavigatorData.markersList[rd_MarkerNavigatorData.markersList.length] = timeToCurrentFormat(adjustedMarkerTime, comp.frameRate) + "  " + marker.value.comment;
					}
					
					rd_MarkerNavigatorData.layer = layer;
					rd_MarkerNavigatorData.comp = comp;
				}
			}
		}
	}
	
	
	
	
	// rd_MarkerNavigator_refreshLayerMarkersList()
	// 
	// Description:
	// This function updates the layer markers list.
	// 
	// Parameters:
	// Array of listbox items selected, or null if none selected.
	// 
	// Returns:
	// Nothing.
	//
	function rd_MarkerNavigator_refreshLayerMarkersList(selection)
	{
		var prevSelection = new Array();
		
		// Keep track of existing selection, to restore later
		if (selection !== null)
			for (var i=0; i<selection.length; i++)
				prevSelection[prevSelection.length] = selection[i].index;
		
		// Remove the existing list entries
		rd_MarkerNavigatorData.pal.grp.l.r1.listBox.removeAll();
		
		// Build the new list of markers
		for (var i=0; i<rd_MarkerNavigatorData.markersList.length; i++)
			rd_MarkerNavigatorData.pal.grp.l.r1.listBox.add("item", rd_MarkerNavigatorData.markersList[i]);
		
		// Restore the previous selected items
		for (var i=0; i<prevSelection.length; i++)
			rd_MarkerNavigatorData.pal.grp.l.r1.listBox.items[prevSelection[i]].selected = true;
	}
	
	
	
	
	// main code:
	//
	
	// Prerequisites check
	if (parseFloat(app.version) < 10.0)
		alert(rd_MarkerNavigator_localize(rd_MarkerNavigatorData.strMinAE100), rd_MarkerNavigatorData.scriptName);
	else
	{
		// Check if the More/Less Options button state is stored in the settings; use if so
		if (app.settings.haveSetting("redefinery", "rd_MarkerNavigator_showDetails"))
		{
			// Use eval() to convert string value to Boolean
			rd_MarkerNavigatorData.showDetails = eval(app.settings.getSetting("redefinery", "rd_MarkerNavigator_showDetails"));
			//alert("from settings="+app.settings.getSetting("redefinery", "rd_MarkerNavigator_showDetails"));
		}
		else
			rd_MarkerNavigatorData.showDetails = false;	// Initially, show no details
		
		// Update the markers list based on the layer selected (if any)
		rd_MarkerNavigator_updateLayerMarkers();
		
		// Build and show the dialog box
		rd_MarkerNavigatorData.pal = rd_MarkerNavigator_buildUI(thisObj);
		if (rd_MarkerNavigatorData.pal !== null)
		{
			if (rd_MarkerNavigatorData.pal instanceof Window)
			{
				rd_MarkerNavigatorData.pal.center();
				rd_MarkerNavigatorData.pal.show();
			}
			else
				rd_MarkerNavigatorData.pal.layout.layout(true);
		}
	}
})(this);
