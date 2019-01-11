// rd_SimpleConsole.jsx
// Copyright (c) 2005-2013 redefinery (Jeffrey R. Almasol). All rights reserved.
// check it: www.redefinery.com
// 
// Name: rd_SimpleConsole
// Version: 3.0
// 
// Description:
// This script displays a palette containing a text area in which you can
// enter JavaScript commands that will be evaluated. There is no capturing
// of errors or messages -- this console is just a simple way of entering
// commands without having to create a script first.
// 
// Note: The console field has a maximum capacity of 255 characters.
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




// rd_SimpleConsole()
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
(function rd_SimpleConsole(thisObj)
{
    // Globals
    
    var rd_SimpleConsoleData = new Object();	// Store globals in an object
    rd_SimpleConsoleData.scriptName = "rd: Simple Console";
    rd_SimpleConsoleData.scriptTitle = rd_SimpleConsoleData.scriptName + " v2.0";
    
    rd_SimpleConsoleData.strEvaluate = {en: "Evaluate"};
    rd_SimpleConsoleData.strClear = {en: "Clear"};
    rd_SimpleConsoleData.strHelp = {en: "?"};
    rd_SimpleConsoleData.strDefaultConsoleText = {en: "alert(\"hello world\");"};
    rd_SimpleConsoleData.strMinAE100 = {en: "This script requires Adobe After Effects CS5 or later."};
    rd_SimpleConsoleData.strHelpText = 
    {
        en: "Copyright (c) 2005-2013 redefinery (Jeffrey R. Almasol). \n" +
        "All rights reserved.\n" +
        "\n" +
        "This script displays a palette containing a text area in which you can enter JavaScript commands that will be evaluated. There is no capturing of errors or messages -- this console is just a simple way of entering commands without having to create a script first.\n" +
        "\n" +
        "Note: The console field has a maximum capacity of 255 characters.\n" +
        "\n" +
        "Note: This version of the script requires After Effects CS5 or later. It can be used as a dockable panel by placing the script in a ScriptUI Panels subfolder of the Scripts folder, and then choosing this script from the Window menu.\n"
    };
    
    
    
    
    // rd_SimpleConsole_localize()
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
    function rd_SimpleConsole_localize(strVar)
    {
        return strVar["en"];
    }
    
    
    
    
    // rd_SimpleConsole_buildUI()
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
    function rd_SimpleConsole_buildUI(thisObj)
    {
        var pal = (thisObj instanceof Panel) ? thisObj : new Window("palette", rd_SimpleConsoleData.scriptName, undefined, {resizeable:true});
        
        if (pal !== null)
        {
            var res =
            "group { \
                orientation:'column', alignment:['fill','fill'], \
                header: Group { \
                    alignment:['fill','top'], \
                    title: StaticText { text:'" + rd_SimpleConsoleData.scriptName + "', alignment:['fill','center'] }, \
                    help: Button { text:'" + rd_SimpleConsole_localize(rd_SimpleConsoleData.strHelp) +"', maximumSize:[30,20], alignment:['right','center'] }, \
                }, \
                main: Group { \
                    alignment:['fill','fill'], alignChildren:['fill','fill'], \
                    consoleEditText: EditText { text:'" + rd_SimpleConsole_localize(rd_SimpleConsoleData.strDefaultConsoleText) + "', properties:{multiline:true}, minimumSize:[70, 25] }, \
                }, \
                cmds: Group { \
                    alignment:['fill','bottom'], \
                    clearBtn: Button { text:'" + rd_SimpleConsole_localize(rd_SimpleConsoleData.strClear) + "', alignment:['left','bottom'], preferredSize:[-1,20] }, \
                    evaluateBtn: Button { text:'" + rd_SimpleConsole_localize(rd_SimpleConsoleData.strEvaluate) + "', alignment:['right','bottom'], preferredSize:[-1,20] }, \
                }, \
            }";
            pal.grp = pal.add(res);
            
            pal.layout.layout(true);
            pal.grp.minimumSize = pal.grp.size;
            pal.layout.resize();
            pal.onResizing = pal.onResize = function () {this.layout.resize();}
            
            pal.grp.header.help.onClick = function () {alert(rd_SimpleConsoleData.scriptTitle + "\n" + rd_SimpleConsole_localize(rd_SimpleConsoleData.strHelpText), rd_SimpleConsoleData.scriptName);}
            pal.grp.cmds.clearBtn.onClick = function () {this.parent.parent.main.consoleEditText.text = ""};
            pal.grp.cmds.evaluateBtn.onClick = function () {eval(this.parent.parent.main.consoleEditText.text);};
        }
        
        return pal;
    }		
    
    
    
    
    // main code:
    //
    
    // Prerequisites check
    if (parseFloat(app.version) < 10.0)
        alert(rd_SimpleConsole_localize(rd_SimpleConsoleData.strMinAE100), rd_SimpleConsoleData.scriptName);
    else
    {
        // Build and show the console's floating palette
        var rdscPal = rd_SimpleConsole_buildUI(thisObj);
        if (rdscPal !== null)
        {
            if (rdscPal instanceof Window)
            {
                // Show the palette
                rdscPal.center();
                rdscPal.show();
            }
            else
                rdscPal.layout.layout(true);
        }
    }
})(this);
