// rd_Notation.jsx
// Copyright (c) 2008-2013 redefinery (Jeffrey R. Almasol). All rights reserved.
// check it: www.redefinery.com
// 
// Name: rd_Notation
// Version: 1.0
// 
// Description:
// This script displays an editable text box into which you can 
// jot notes that are retained between After Effects sessions.
// 
// Note: Only the first 1999 characters will be retained. In CS5.5 and 
// earlier, newlines are supported only on Windows (by pressing 
// Ctrl+Enter). In CS6 and later newlines can be entered by pressing 
// Enter.
// 
// Note: This script requires After Effects CS5 or later.
// It can be used as a dockable panel by placing the 
// script in a ScriptUI Panels subfolder of the Scripts folder, 
// and then choosing this script from the Window menu.
// 
// Originally requested by David Torno.
// Enhancements requested by Pascal.
// 
// Legal stuff:
// This script is provided "as is," without warranty of any kind, expressed
// or implied. In no event shall the author be held liable for any damages 
// arising in any way from the use of this script.
// 
// In other words, I'm just trying to share knowledge with and help out my
// fellow AE script heads, so don't blame me if my code doesn't rate. :-)




// rd_Notation()
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
(function rd_Notation(thisObj)
{
    // Globals
    
    var rd_NotationData = new Object();	// Store globals in an object
    
    rd_NotationData.scriptName = "rd: Notation";
    rd_NotationData.scriptTitle = rd_NotationData.scriptName + " v1.0";
    
    rd_NotationData.prefSection = "redefinery";
    rd_NotationData.prefKeyNotes = "rd_Notation_notes";
    
    rd_NotationData.strClear = {en: "Clear"};
    rd_NotationData.strSaveAs = {en: "Save As..."};
    rd_NotationData.strClearConfirm = {en: "Erase your notes? (cannot be undone)"};
    rd_NotationData.strSaveAsTitle = {en: "Save Notes As"};
    rd_NotationData.strOverwriteConfirm = {en: "Overwrite existing file?"};
    rd_NotationData.strHelp = {en: "?"};
    rd_NotationData.strMinAE100 = {en: "This script requires Adobe After Effects CS5 or later."};
    rd_NotationData.strHelpText = 
    {
        en: "Copyright (c) 2008-2013 redefinery (Jeffrey R. Almasol). \n" +
        "All rights reserved.\n" +
        "\n" +
        "This script displays an editable text box into which you can jot notes that are retained between After Effects sessions.\n" + 
        "\n" +
        "Note: Only the first 1999 characters will be retained. In CS5.5 and earlier, newlines are supported only on Windows (by pressing Ctrl+Enter). In CS6 and later newlines can be entered by pressing Enter..\n" +
        "\n" + 
        "Note: This script requires After Effects CS5 or later. It can be used as a dockable panel by placing the script in a ScriptUI Panels subfolder of the Scripts folder, and then choosing this script from the Window menu.\n" + 
        "\n" + 
        "Originally requested by David Torno.\n" +
        "Enhancements requested by Pascal.\n"
    };
    
    
    
    
    // rd_Notation_localize()
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
    function rd_Notation_localize(strVar)
    {
        return strVar["en"];
    }
    
    
    
    
    // rd_Notation_buildUI()
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
    function rd_Notation_buildUI(thisObj)
    {
        var pal = (thisObj instanceof Panel) ? thisObj : new Window("palette", rd_NotationData.scriptName, undefined, {resizeable:true});
        if (pal !== null)
        {
            var notesWantReturn = (parseFloat(app.version) >= 11) ? ", wantReturn: true" : "";
            var res = 
            """group {
                orientation:'column', alignment:['fill','fill'], alignChildren:['fill','top'],
                header: Group {
                    alignment:['fill','top'],
                    title: StaticText { text:'""" + rd_NotationData.scriptName + """', alignment:['fill','center'] },
                    clear: Button { text:'""" + rd_Notation_localize(rd_NotationData.strClear) + """', alignment:['right','center'], preferredSize:[-1,20] },
                    saveAs: Button { text:'""" + rd_Notation_localize(rd_NotationData.strSaveAs) + """', alignment:['right','center'], preferredSize:[-1,20] },
                    help: Button { text:'""" + rd_Notation_localize(rd_NotationData.strHelp) + """', maximumSize:[30,20], alignment:['right','center'], preferredSize:[-1,20] },
                },
                notes: EditText { alignment:['fill','fill'], properties:{multiline:true""" + notesWantReturn + """} },
            }""";
            
            pal.grp = pal.add(res);
            
            pal.margins = [10,10,10,10];
            pal.grp.notes.preferredSize = [300,120];
            
            pal.layout.layout(true);
            pal.grp.minimumSize = pal.grp.size;
            pal.layout.resize();
            pal.onResizing = pal.onResize = function () {this.layout.resize();}
            
            pal.grp.header.help.onClick = function () {alert(rd_NotationData.scriptTitle + "\n" + rd_Notation_localize(rd_NotationData.strHelpText), rd_NotationData.scriptName);}
            pal.grp.header.clear.onClick = function ()
            {
                if (confirm(rd_Notation_localize(rd_NotationData.strClearConfirm), rd_NotationData.scriptName))
                {
                    this.parent.parent.notes.text = "";
                    app.settings.saveSetting(rd_NotationData.prefSection, rd_NotationData.prefKeyNotes, "");
                }
            }
            pal.grp.header.saveAs.onClick = function ()
            {
                var notesFile = File.saveDialog(rd_Notation_localize(rd_NotationData.strSaveAsTitle));
                if (notesFile !== null) {
                    notesFile.open("w");
                    notesFile.write(this.parent.parent.notes.text);
                    notesFile.close();
                }
            }
            
            pal.grp.notes.onChange = pal.grp.notes.onChanging = function ()
            {
                app.settings.saveSetting(rd_NotationData.prefSection, rd_NotationData.prefKeyNotes, this.text);
            }
        }
        
        return pal;
    }
    
    
    // main:
    // 
    
    if (parseFloat(app.version) < 10.0)
        alert(rd_Notation_localize(rd_NotationData.strErrMinAE100), rd_NotationData.scriptName);
    else
    {
        // Build/show the user interface
        var rdnPal = rd_Notation_buildUI(thisObj);
        if (rdnPal !== null)
        {
            // Update UI values, if saved in the settings
            if (app.settings.haveSetting(rd_NotationData.prefSection, rd_NotationData.prefKeyNotes))
                rdnPal.grp.notes.text = app.settings.getSetting(rd_NotationData.prefSection, rd_NotationData.prefKeyNotes).toString().substr(0,1999);
            
            // Save current UI settings upon closing the palette
            rdnPal.onClose = function()
            {
                app.settings.saveSetting(rd_NotationData.prefSection, rd_NotationData.prefKeyNotes, rdnPal.grp.notes.text.substr(0,1999));
            }
            
            if (rdnPal instanceof Window)
            {
                rdnPal.center();
                rdnPal.show();
            }
        }
    }
})(this);
