// rd_Movement.jsx
// Copyright (c) 2006-2013 redefinery (Jeffrey R. Almasol). All rights reserved.
// check it: www.redefinery.com
// 
// Name: rd_Movement
// Version: 3.0
// 
// Description:
// This script displays a palette with controls for jumping to different
// times in the composition. There are buttons for jumping a specific
// number of frames forward or back from the current time, as well as 7
// favorite buttons for capturing different times (set from the current 
// time) and jumping to them easily.
// 
// Change the frame offsets by entering new values in any of the four
// fields.
// 
// For the favorites buttons, captured times are in seconds. Also, 
// although you can capture negative time values, After Effects 
// restricts the minimum time value to 0 seconds (start of the 
// composition); the maximum time is 10,800 seconds.
// 
// Your frame offsets and captured time favorites are saved as settings 
// for use in subsequent sessions.
// 
// Note: This version of the script requires After Effects CS5 
// or later. It can be used as a dockable panel by placing the 
// script in a ScriptUI Panels subfolder of the Scripts folder, 
// and then choosing this script from the Window menu.
// 
// Originally requested by Scott Hudziak at DIGITALKITCHEN.
// 
// Legal stuff:
// This script is provided "as is," without warranty of any kind, expressed
// or implied. In no event shall the author be held liable for any damages 
// arising in any way from the use of this script.
// 
// In other words, I'm just trying to share knowledge with and help out my
// fellow AE script heads, so don't blame me if my code doesn't rate. :-)




// rd_Movement()
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
(function rd_Movement(thisObj)
{
	// Globals
	
	var rd_MovementData = new Object();	// Store globals in an object
	rd_MovementData.scriptName = "rd: Movement";
	rd_MovementData.scriptTitle = rd_MovementData.scriptName + " v3.0";
	
	rd_MovementData.numFaves = 7;			// Number of favorite buttons
	rd_MovementData.minCompSecs = 0;		// Minimum and maximum number of seconds that we can jump to for a comp
	rd_MovementData.maxCompSecs = 10800;
	
	rd_MovementData.strRew = {en: "<<"};
	rd_MovementData.strPrev = {en: "<"};
	rd_MovementData.strNext = {en: ">"};
	rd_MovementData.strFwd = {en: ">>"};
	rd_MovementData.strFavorites = {en: "Favorites"};
	rd_MovementData.strTimeSet = {en: "v"};
	rd_MovementData.strHelp = {en: "?"};
	rd_MovementData.strErrNoCompSel = {en: "Cannot perform operation. Please select or open a single composition in the Project window, and try again."};
	rd_MovementData.strMinAE100 = {en: "This script requires Adobe After Effects CS5 or later."};
	rd_MovementData.strHelpText = 
	{
		en: "Copyright (c) 2006-2013 redefinery (Jeffrey R. Almasol). \n" +
		"All rights reserved.\n" +
		"\n" +
		"This script displays a palette with controls for jumping to different times in the composition. There are buttons for jumping a specific number of frames forward or back from the current time, as well as 7 favorite buttons for capturing different times (set from the current time) and jumping to them easily.\n" +
		"\n" +
		"Change the frame offsets by entering new values in any of the four fields.\n" +
		"\n" +
		"For the favorites buttons, captured times are in seconds. Also, although you can capture negative time values, After Effects restricts the minimum time value to 0 seconds (start of the composition); the maximum time is 10,800 seconds.\n" +
		"\n" +
		"Your frame offsets and captured time favorites are saved as settings for use in subsequent sessions.\n" +
		"\n" +
		"Note: This version of the script requires After Effects CS5 or later. It can be used as a dockable panel by placing the script in a ScriptUI Panels subfolder of the Scripts folder, and then choosing this script from the Window menu.\n" +
		"\n" +
		"Originally requested by Scott Hudziak at DIGITALKITCHEN.\n"
	};
	
	
	
	
	// rd_Movement_localize()
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
	function rd_Movement_localize(strVar)
	{
		return strVar["en"];
	}
	
	
	
	
	// rd_Movement_buildUI()
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
	function rd_Movement_buildUI(thisObj)
	{
		var pal = (thisObj instanceof Panel) ? thisObj : new Window("palette", rd_MovementData.scriptName, undefined, {resizeable:true});
		
		if (pal !== null)
		{
			var res = 
			"group { \
				orientation:'column', alignment:['fill','top'], \
				header: Group { \
					alignment:['fill','top'], \
					title: StaticText { text:'" + rd_MovementData.scriptName + "', alignment:['fill','center'] }, \
					help: Button { text:'" + rd_Movement_localize(rd_MovementData.strHelp) +"', maximumSize:[30,20], alignment:['right','center'] }, \
				}, \
				flds: Group { \
					alignment:['fill','top'], \
					rewVal: EditText { text:'10', alignment:['fill','top'], justify:'center', preferredSize:[-1,20] }, \
					prevVal: EditText { text:'1', alignment:['fill','top'], justify:'center', preferredSize:[-1,20] }, \
					nextVal: EditText { text:'1', alignment:['fill','top'], justify:'center', preferredSize:[-1,20] }, \
					fwdVal: EditText { text:'10', alignment:['fill','top'], justify:'center', preferredSize:[-1,20] }, \
				}, \
				btns: Group { \
					alignment:['fill','top'], \
					rew: Button { text:'" + rd_Movement_localize(rd_MovementData.strRew) + "', alignment:['fill','top'], preferredSize:[30,20] }, \
					prev: Button { text:'" + rd_Movement_localize(rd_MovementData.strPrev) + "', alignment:['fill','top'], preferredSize:[30,20] }, \
					next: Button { text:'" + rd_Movement_localize(rd_MovementData.strNext) + "', alignment:['fill','top'], preferredSize:[30,20] }, \
					fwd: Button { text:'" + rd_Movement_localize(rd_MovementData.strFwd) + "', alignment:['fill','top'], preferredSize:[30,20] }, \
				}, \
				sep: Group { \
					orientation:'row', alignment:['fill','top'], \
					rule: Panel { \
						height: 2, alignment:['fill','center'], \
					}, \
					label: Group { \
						alignment:['center','center'], \
						lbl: StaticText { text:'" + rd_Movement_localize(rd_MovementData.strFavorites) + "', alignment:['center','center'] }, \
					}, \
					rule2: Panel { \
						height: 2, alignment:['fill','center'], \
					}, \
				}, \
				faveValBtns: Group { \
					alignment:['fill','top'], ";
			for (var i=0; i<rd_MovementData.numFaves; i++)
				res += "valBtn"+i.toString()+": Button { text:'" + rd_Movement_localize(rd_MovementData.strTimeSet) + "', alignment:['fill','top'], preferredSize:[25,16] }, ";
			res += " \
				}, \
				faveBtns: Group { \
					alignment:['fill','top'], ";
			for (var i=0; i<rd_MovementData.numFaves; i++)
				res += "btn"+i.toString()+": Button { text:'" + (i+1).toString() + "', alignment:['fill','top'], preferredSize:[25,20] }, ";
			res +=	" \
				}, \
			}";
			pal.grp = pal.add(res);
			
			pal.grp.btns.margins.top = -(pal.grp.spacing - 2);
			pal.grp.sep.label.margins.left = pal.grp.sep.label.margins.right = 10;
			pal.grp.faveBtns.margins.top = -(pal.grp.spacing - 2);
			
			pal.grp.flds.rewVal.onChange = rd_Movement_doValidatePosNum;
			pal.grp.btns.rew.onClick = function() {rd_Movement_doJumpFrames(-this.parent.parent.flds.rewVal.text);}
			pal.grp.flds.prevVal.onChange = rd_Movement_doValidatePosNum;
			pal.grp.btns.prev.onClick = function() {rd_Movement_doJumpFrames(-this.parent.parent.flds.prevVal.text);}
			pal.grp.flds.nextVal.onChange = rd_Movement_doValidatePosNum;
			pal.grp.btns.next.onClick = function() {rd_Movement_doJumpFrames(this.parent.parent.flds.nextVal.text);}
			pal.grp.flds.fwdVal.onChange = rd_Movement_doValidatePosNum;
			pal.grp.btns.fwd.onClick = function() {rd_Movement_doJumpFrames(this.parent.parent.flds.fwdVal.text);}
			
			for (var i=0; i<rd_MovementData.numFaves; i++)
			{
				eval("pal.grp.faveBtns.btn" + i + ".stateId = " + (i+1) + ";");
				eval("pal.grp.faveBtns.btn" + i + ".enabled = false;");
				eval("pal.grp.faveBtns.btn" + i + ".onClick = function() {rd_Movement_doGoToFave(parseInt(this.stateId), pal);}");
				
				eval("pal.grp.faveValBtns.valBtn" + i + ".stateId = " + (i+1) + ";");
				eval("pal.grp.faveValBtns.valBtn" + i + ".time = undefined;");
				eval("pal.grp.faveValBtns.valBtn" + i + ".onClick = function() {rd_Movement_doSetFave(parseInt(this.stateId), pal);}");
			}
			
			pal.grp.btns.rew.preferredSize.width = pal.grp.flds.rewVal.preferredSize.width;
			pal.grp.btns.prev.preferredSize.width = pal.grp.flds.prevVal.preferredSize.width;
			pal.grp.btns.next.preferredSize.width = pal.grp.flds.nextVal.preferredSize.width;
			pal.grp.btns.fwd.preferredSize.width = pal.grp.flds.fwdVal.preferredSize.width;
			
			pal.layout.layout(true);
			pal.grp.minimumSize = pal.grp.size;
			pal.layout.resize();
			pal.onResizing = pal.onResize = function () {this.layout.resize();}
			
			pal.grp.header.help.onClick = function () {alert(rd_MovementData.scriptTitle + "\n" + rd_Movement_localize(rd_MovementData.strHelpText), rd_MovementData.scriptName);}
		}
		
		return pal;
	}
	
	
	
	
	// rd_Movement_doValidatePosNum()
	// 
	// Description:
	// This callback function assures that the entered value is a
	// positive number.
	// 
	// Parameters:
	// None.
	// 
	// Returns:
	// Nothing.
	//
	function rd_Movement_doValidatePosNum()
	{
		var enteredValue = this.text;
		
		// If not a number or less than 0, reset to 1
		if (isNaN(enteredValue) || (enteredValue <= 0))
			this.text = "1";
		else
			this.text = parseInt(enteredValue).toString();
	}
	
	
	
	
	// rd_Movement_doJumpFrames()
	// 
	// Description:
	// This function moves the current-time indicator (CTI) by the
	// specified number of frames.
	// 
	// Parameters:
	//   frames - Number of frames to jump.
	// 
	// Returns:
	// Nothing.
	//
	function rd_Movement_doJumpFrames(offset)
	{
		// Check if offseting time
		offset = parseFloat(offset);
		if (offset === 0)
			return;
		
		// Check that a project exists
		if (app.project === null)
			return;
		
		// Get the current (active/frontmost) comp
		var comp = app.project.activeItem;
		
		if ((comp === null) || !(comp instanceof CompItem))
		{
			alert(rd_Movement_localize(rd_MovementData.strErrNoCompSel), rd_MovementData.scriptName);
			return;
		}
		
		// Jump to the new time
		app.beginUndoGroup(rd_MovementData.scriptName);
		
		var newTime = comp.time + offset * comp.frameDuration;
		if (newTime < rd_MovementData.minCompSecs)			// Clip time value to valid range used by Composition time attribute
			newTime = rd_MovementData.minCompSecs;
		else if (newTime > rd_MovementData.maxCompSecs)
			newTime = rd_MovementData.maxCompSecs;
		comp.time = newTime;
		
		app.endUndoGroup();
	}
	
	
	
	
	// rd_Movement_doSetFave()
	// 
	// Description:
	// This function captures the current time (in seconds) to the specified favorite button.
	// 
	// Parameters:
	//   faveNum - The selected favorite to use.
	//   pal - The palette (Window object) itself.
	// 
	// Returns:
	// Nothing.
	//
	function rd_Movement_doSetFave(faveNum, pal)
	{
		// Check that a project exists
		if (app.project === null)
			return;
		
		// Get the current (active/frontmost) comp
		var comp = app.project.activeItem;
		
		if ((comp === null) || !(comp instanceof CompItem))
		{
			alert(rd_Movement_localize(rd_MovementData.strErrNoCompSel), rd_MovementData.scriptName);
			return;
		}
		
		// Capture the current time (in seconds)
		eval("pal.grp.faveValBtns.valBtn" + (faveNum-1) + ".time = comp.time;");
		
		// Enable the "set" button
		eval("pal.grp.faveBtns.btn" + (faveNum-1) + ".enabled = true;");
		eval("pal.grp.faveBtns.btn" + (faveNum-1) + ".helpTip = comp.time.toString() + ' seconds';");
	}
	
	
	
	
	// rd_Movement_doGoToFave()
	// 
	// Description:
	// This function jumps to the time set for the selected favorite button.
	// 
	// Parameters:
	//   faveNum - The selected favorite to use.
	//   pal - The palette (Window object) itself.
	// 
	// Returns:
	// Nothing.
	//
	function rd_Movement_doGoToFave(faveNum, pal)
	{
		// Check that a project exists
		if (app.project === null)
			return;
		
		// Get the current (active/frontmost) comp
		var comp = app.project.activeItem;
		
		if ((comp === null) || !(comp instanceof CompItem))
		{
			alert(rd_Movement_localize(rd_MovementData.strErrNoCompSel), rd_MovementData.scriptName);
			return;
		}
		
		// Check that the specified favorite button has a value
		eval("var time = pal.grp.faveValBtns.valBtn" + (faveNum-1) + ".time;");
		if (time === undefined)
		{
			alert("not set", rd_MovementData.scriptName);
			return;
		}
		
		// Jump to the time associated with the specified button
		app.beginUndoGroup(rd_MovementData.scriptName);
		
		var newTime = parseFloat(time);
		if (newTime < rd_MovementData.minCompSecs)			// Clip time value to valid range used by Composition time attribute
			newTime = rd_MovementData.minCompSecs;
		else if (newTime > rd_MovementData.maxCompSecs)
			newTime = rd_MovementData.maxCompSecs;
		comp.time = newTime;
		
		app.endUndoGroup();
	}
	
	
	
	
	// main code:
	//
	
	// Prerequisites check
	if (parseFloat(app.version) < 10.0)
		alert(rd_Movement_localize(rd_MovementData.strMinAE100), rd_MovementData.scriptName);
	else
	{
		// Build and show the console's floating palette
		var rdmPal = rd_Movement_buildUI(thisObj);
		if (rdmPal !== null)
		{
			// Update UI values, if saved in the settings
			if (app.settings.haveSetting("redefinery", "rd_Movement_rewValue"))
				rdmPal.grp.flds.rewVal.text = app.settings.getSetting("redefinery", "rd_Movement_rewValue").toString();
			if (app.settings.haveSetting("redefinery", "rd_Movement_prevValue"))
				rdmPal.grp.flds.prevVal.text = app.settings.getSetting("redefinery", "rd_Movement_prevValue").toString();
			if (app.settings.haveSetting("redefinery", "rd_Movement_nextValue"))
				rdmPal.grp.flds.nextVal.text = app.settings.getSetting("redefinery", "rd_Movement_nextValue").toString();
			if (app.settings.haveSetting("redefinery", "rd_Movement_fwdValue"))
				rdmPal.grp.flds.fwdVal.text = app.settings.getSetting("redefinery", "rd_Movement_fwdValue").toString();
			var faveVal;
			for (var i=0; i<rd_MovementData.numFaves; i++)
			{
				if (app.settings.haveSetting("redefinery", "rd_Movement_fave_"+(i+1)))
				{
					faveVal = app.settings.getSetting("redefinery", "rd_Movement_fave_"+(i+1).toString()).toString();
					if (faveVal !== "undefined")
					{
						eval("rdmPal.grp.faveBtns.btn"+i+".enabled = true;");
						eval("rdmPal.grp.faveBtns.btn"+i+".helpTip = '" + parseFloat(faveVal) + " seconds';");
						eval("rdmPal.grp.faveValBtns.valBtn"+i+".time = " + parseFloat(faveVal) + ";");
					}
					else
						eval("rdmPal.grp.faveValBtns.valBtn"+i+".time = undefined;");
				}
			}
			
			// Save current UI settings upon closing the palette
			rdmPal.onClose = function()
			{
				app.settings.saveSetting("redefinery", "rd_Movement_rewValue", rdmPal.grp.flds.rewVal.text);
				app.settings.saveSetting("redefinery", "rd_Movement_prevValue", rdmPal.grp.flds.prevVal.text);
				app.settings.saveSetting("redefinery", "rd_Movement_nextValue", rdmPal.grp.flds.nextVal.text);
				app.settings.saveSetting("redefinery", "rd_Movement_fwdValue", rdmPal.grp.flds.fwdVal.text);
				
				var faveVal, faveBtnTime;
				for (var i=0; i<rd_MovementData.numFaves; i++)
				{
					eval("faveBtnTime = rdmPal.grp.faveValBtns.valBtn"+i+".time;");
					app.settings.saveSetting("redefinery", "rd_Movement_fave_"+(i+1), (faveBtnTime !== undefined) ? faveBtnTime.toString() : "undefined");
				}
			}
			
			if (rdmPal instanceof Window)
			{
				// Show the palette
				rdmPal.center();
				rdmPal.show();
			}
			else
				rdmPal.layout.layout(true);
		}
	}
})(this);
