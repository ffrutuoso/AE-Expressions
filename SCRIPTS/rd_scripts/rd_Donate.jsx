// rd_Donate.jsx
// Copyright (c) 2006-2013 redefinery (Jeffrey R. Almasol). All rights reserved.
// check it: www.redefinery.com
// 
// Name: rd_Donate
// Version: 3.0
// 
// Description:
// Feeling charitable as you use my scripts in After 
// Effects? This script is for you! Of course, feel free 
// to donate to your favorite or local charity.
// 
// Note: This version of the script requires After Effects 
// CS3 or later. It can be used as a dockable panel by 
// placing the script in a ScriptUI Panels subfolder of 
// the Scripts folder, and then choosing this script 
// from the Window menu.
// 
// Note: Adjust the command to launch your Web 
// browser, as appropriate.
// 
// Originally requested by Wes Plate. :-)
// 
// Legal stuff:
// This script is provided "as is," without warranty of any kind, expressed
// or implied. In no event shall the author be held liable for any damages 
// arising in any way from the use of this script.
// 
// In other words, I'm just trying to share knowledge with and help out my
// fellow AE script heads, so don't blame me if my code doesn't rate. :-)




// rd_Donate()
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
(function rd_Donate(thisObj)
{
	// Globals
	
	var rd_DonateData = new Object();	// Store globals in an object
	rd_DonateData.scriptName = "rd: Donate";
	rd_DonateData.scriptTitle = rd_DonateData.scriptName + " v3.0";
	
	rd_DonateData.winBrowserCmd = "C:/Program Files/Internet Explorer/iexplore.exe";		// Use forward slashes
	rd_DonateData.macBrowserCmdStart = "osascript -e 'open location \"";
	rd_DonateData.macBrowserCmdEnd = "\"'";
	
	rd_DonateData.strDonateLbl = {en: "Donate To:"};
	rd_DonateData.strDonateOpts = {en: ["American Diabetes Association\u00AE", "The Leukemia & Lymphoma Society\u00AE", "The Nature Conservancy\u00AE", "VolunteerMatch"]};
	rd_DonateData.strDonateURLs = {en: ["http://www.diabetes.org/", "http://www.leukemia-lymphoma.org/", "http://www.nature.org/", "http://www.volunteermatch.org/"]};
	rd_DonateData.strDonate = {en: "Donate"};
	rd_DonateData.strThanks = {en: "Thanks!"};
	rd_DonateData.strHelp = {en: "?"};
	rd_DonateData.strMinAE100 = {en: "This script requires Adobe After Effects CS5 or later."};
	rd_DonateData.strHelpText = 
	{
		en: "Copyright (c) 2006-2013 redefinery (Jeffrey R. Almasol). \n" +
		"All rights reserved.\n" +
		"\n" +
		"Feeling charitable as you use my scripts in After Effects? This script is for you! Of course, feel free to donate to your favorite or local charity.\n" +
		"\n" +
		"Note: This version of the script requires After Effects CS5 or later. It can be used as a dockable panel by placing the script in a ScriptUI Panels subfolder of the Scripts folder, and then choosing this script from the Window menu.\n" +
		"\n" +
		"Note: Adjust the command to launch your Web browser, as appropriate.\n" +
		"\n" +
		"Originally requested by Wes Plate. :-)"
	};
	
	
	
	
	// rd_Donate_localize()
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
	function rd_Donate_localize(strVar)
	{
		return strVar["en"];
	}
	
	
	
	
	// rd_Donate_buildUI()
	// 
	// Description:
	// This function builds the user interface.
	// 
	// Parameters:
	// thisObj - Panel object
	// 
	// Returns:
	// Window or Panel object representing the built user interface.
	//
	function rd_Donate_buildUI(thisObj)
	{
		var pal = (thisObj instanceof Panel) ? thisObj : new Window("palette", rd_DonateData.scriptName, undefined, {resizeable:true});
		
		if (pal !== null)
		{
			var res =
			"group { \
				orientation:'column', alignment:['fill','top'], \
				header: Group { \
					alignment:['fill','top'], \
					title: StaticText { text:'" + rd_DonateData.scriptName + "', alignment:['fill','center'] }, \
					help: Button { text:'" + rd_Donate_localize(rd_DonateData.strHelp) +"', maximumSize:[30,20], alignment:['right','center'] }, \
				}, \
				main: Group { \
					alignment:['fill','top'], \
					lst: DropDownList { properties:{ }, alignment:['fill','center'], preferredSize:[-1,20] }, \
					donate: Button { text:'" + rd_Donate_localize(rd_DonateData.strDonate) + "', alignment:['right','center'], preferredSize:[-1,20] }, \
				}, \
			} \
			";
			pal.grp = pal.add(res);
			
			var listItems = rd_Donate_localize(rd_DonateData.strDonateOpts);
			for (var i=0; i<listItems.length; i++)
				pal.grp.main.lst.add("item", listItems[i]);
			pal.grp.main.lst.selection = 1;
			
			pal.layout.layout(true);
			pal.grp.minimumSize = pal.grp.size;
			pal.layout.resize();
			pal.onResizing = pal.onResize = function () {this.layout.resize();}
			
			pal.grp.header.help.onClick = function () {alert(rd_DonateData.scriptTitle + "\n" + rd_Donate_localize(rd_DonateData.strHelpText), rd_DonateData.scriptName);}
			pal.grp.main.donate.onClick = rd_Donate_doDonate;
		}
		
		return pal;
	}
	
	
	
	
	// rd_Donate_doDonate()
	// 
	// Description:
	// This function performs the actual donation redirect.
	// 
	// Parameters:
	// None.
	// 
	// Returns:
	// Nothing.
	//
	function rd_Donate_doDonate()
	{
		var donateToURL = rd_Donate_localize(rd_DonateData.strDonateURLs)[this.parent.lst.selection.index];
		
		if ($.os.indexOf("Windows") !== -1)
			system.callSystem(rd_DonateData.winBrowserCmd + " " + donateToURL);
		else
			system.callSystem(rd_DonateData.macBrowserCmdStart + donateToURL + rd_DonateData.macBrowserCmdEnd);
		
		alert(rd_Donate_localize(rd_DonateData.strThanks), rd_DonateData.scriptName);
	}
	
	
	
	
	// main code:
	//
	
	// Prerequisites check
	if (parseFloat(app.version) < 10.0)
		alert(rd_Donate_localize(rd_DonateData.strMinAE100), rd_DonateData.scriptName);
	else
	{
		// Build and show the console's floating palette
		var rddPal = rd_Donate_buildUI(thisObj);
		if (rddPal !== null)
		{
			// Update UI values, if saved in the settings
			if (app.settings.haveSetting("redefinery", "rd_Donate_donateTo"))
				rddPal.grp.main.lst.selection = parseInt(app.settings.getSetting("redefinery", "rd_Donate_donateTo"));
			
			// Save current UI settings upon closing the palette
			rddPal.onClose = function()
			{
				app.settings.saveSetting("redefinery", "rd_Donate_donateTo", rddPal.grp.main.lst.selection.index);
			}
			
			if (rddPal instanceof Window)
			{
				// Show the palette
				rddPal.center();
				rddPal.show();
			}
			else
				rddPal.layout.layout(true);
		}
	}
})(this);
