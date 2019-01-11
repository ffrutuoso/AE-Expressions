// rd_SolidRenamer.jsx
// Copyright (c) 2005-2013 redefinery (Jeffrey R. Almasol). All rights reserved.
// check it: www.redefinery.com
// 
// Name: rd_SolidRenamer
// Version: 3.0
// 
// Description:
// This script displays a palette with controls for renaming the selected
// solid footage in the Project window. You can use this script to, for
// example, include the pixel dimensions, aspect ratio, and RGB color
// values in the name.
// 
// The Template field can use literal characters or any of the following
// tokens:
//     [name] - The current name for the solid footage.
//     [r] - The red component value for the solid color.
//     [g] - The green component value for the solid color.
//     [b] - The blue component value for the solid color.
//     [w] - The pixel width of the solid footage.
//     [h] - The pixel height of the solid footage.
//     [par] - The pixel aspect ratio of the solid footage.
// 
// Notes: Expressions that refer to the solid layers that haven't been renamed
// from their source solid footage names are not updated, so it's best 
// to use this script before referring to these layers in expressions.
// 
// Note: This version of the script requires After Effects CS5 
// or later. It can be used as a dockable panel by placing the 
// script in a ScriptUI Panels subfolder of the Scripts folder, 
// and then choosing this script from the Window menu.
// 
// Inspired by a request from Stu Maschwitz.
// 
// Legal stuff:
// This script is provided "as is," without warranty of any kind, expressed
// or implied. In no event shall the author be held liable for any damages 
// arising in any way from the use of this script.
// 
// In other words, I'm just trying to share knowledge with and help out my
// fellow AE script heads, so don't blame me if my code doesn't rate. :-)




// rd_SolidRenamer()
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
(function rd_SolidRenamer(thisObj)
{
    // Globals
    
    var rd_SolidRenamerData = new Object();	// Store globals in an object
    rd_SolidRenamerData.scriptName = "rd: Solid Renamer";
    rd_SolidRenamerData.scriptTitle = rd_SolidRenamerData.scriptName + " v3.0";
    
    rd_SolidRenamerData.strSelectPnl = {en: "Selection"};
    rd_SolidRenamerData.strOnlyWithSolidn = {en: "Only with \" Solid #\" Suffix"};
    rd_SolidRenamerData.strSelectSolids = {en: "Select Solids"};
    rd_SolidRenamerData.strNamingPnl = {en: "Naming"};
    rd_SolidRenamerData.strRemoveSolidn = {en: "Remove \" Solid #\" Suffix"};
    rd_SolidRenamerData.strTemplate = {en: "Template:"};
    rd_SolidRenamerData.strExample = {en: "Example:"};
    rd_SolidRenamerData.strRename = {en: "Rename"};
    rd_SolidRenamerData.strErrEmptyTemplate = {en: "Cannot perform operation because no template is defined."};
    rd_SolidRenamerData.strHelp = {en: "?"};
    rd_SolidRenamerData.strMinAE100 = {en: "This script requires Adobe After Effects CS5 or later."};
    rd_SolidRenamerData.strHelpText = 
    {
        en: "Copyright (c) 2005-2013 redefinery (Jeffrey R. Almasol). \n" +
        "All rights reserved.\n" +
        "\n" +
        "This script displays a palette with controls for renaming the selected solid footage in the Project window. You can use this script to, for example, include the pixel dimensions, aspect ratio, and RGB color values in the name.\n" +
        "\n" +
        "The Template field can use literal characters or any of the following tokens:\n" +
        "    [name] - The current name for the solid footage.\n" +
        "    [r] - The red component value for the solid color.\n" +
        "    [g] - The green component value for the solid color.\n" +
        "    [b] - The blue component value for the solid color.\n" +
        "    [w] - The pixel width of the solid footage.\n" +
        "    [h] - The pixel height of the solid footage.\n" +
        "    [par] - The pixel aspect ratio of the solid footage.\n" +
        "\n" +
        "Notes: Expressions that refer to the solid layers that haven't been renamed from their source solid footage names are not updated, so it's best to use this script before referring to these layers in expressions.\n" +
        "\n" +
        "Note: This version of the script requires After Effects CS5 or later. It can be used as a dockable panel by placing the script in a ScriptUI Panels subfolder of the Scripts folder, and then choosing this script from the Window menu.\n" +
        "\n" +
        "Inspired by a request from Stu Maschwitz.\n"
    };
    
    
    
    
    // rd_SolidRenamer_localize()
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
    function rd_SolidRenamer_localize(strVar)
    {
        return strVar["en"];
    }
    
    
    
    
    // rd_SolidRenamer_buildUI()
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
    function rd_SolidRenamer_buildUI(thisObj)
    {
        var pal = (thisObj instanceof Panel) ? thisObj : new Window("palette", rd_SolidRenamerData.scriptName, undefined, {resizeable:true});
        
        if (pal !== null)
        {
            var res = 
            "group { \
                orientation:'column', alignment:['fill','top'], \
                header: Group { \
                    alignment:['fill','top'], \
                    title: StaticText { text:'" + rd_SolidRenamerData.scriptName + "', alignment:['fill','center'] }, \
                    help: Button { text:'" + rd_SolidRenamer_localize(rd_SolidRenamerData.strHelp) +"', maximumSize:[30,20], alignment:['right','center'] }, \
                }, \
                selPnl: Panel { \
                    alignment:['fill','top'], alignChildren:['fill','top'], text:'" + rd_SolidRenamer_localize(rd_SolidRenamerData.strSelectPnl) + "', \
                    onlyWSn: Checkbox { text:'" + rd_SolidRenamer_localize(rd_SolidRenamerData.strOnlyWithSolidn) + "', value:true }, \
                    selectSolids: Button { text:'" + rd_SolidRenamer_localize(rd_SolidRenamerData.strSelectSolids) + "', alignment:['center','top'], preferredSize:[-1,20] }, \
                }, \
                namePnl: Panel { \
                    alignment:['fill','top'], alignChildren:['fill','top'], text:'" + rd_SolidRenamer_localize(rd_SolidRenamerData.strNamingPnl) + "', \
                    delSuffix: Checkbox { text:'" + rd_SolidRenamer_localize(rd_SolidRenamerData.strRemoveSolidn) + "', value:true }, \
                    r1: Group { \
                        alignment:['fill','top'], \
                        tplText: StaticText { text:'" + rd_SolidRenamer_localize(rd_SolidRenamerData.strTemplate) + "' }, \
                        tpl: EditText { text:'[name] ([r],[g],[b])', alignment:['fill','top'], preferredSize:[-1,20] }, \
                    }, \
                    r2: Group { \
                        alignment:['fill','top'], \
                        exText: StaticText { text:'" + rd_SolidRenamer_localize(rd_SolidRenamerData.strExample) + "' }, \
                        ex: StaticText { text:'', alignment:['fill','top'] }, \
                    }, \
                }, \
                cmds: Group { \
                    alignment:['right','top'], \
                    rename: Button { text:'" + rd_SolidRenamer_localize(rd_SolidRenamerData.strRename) + "', preferredSize:[-1,20] }, \
                }, \
            }";
            pal.grp = pal.add(res);
            
            pal.grp.namePnl.r2.exText.preferredSize.width = pal.grp.namePnl.r1.tplText.preferredSize.width;
            
            pal.grp.namePnl.r2.ex.text = rd_SolidRenamer_formatSolidName(pal.grp.namePnl.r1.tpl.text, "Deep Cyan Solid 1", pal.grp.namePnl.delSuffix.value, [0.04644775390625,0.61679077148438,0.62353515625], [640,480], 1.42);
            
            pal.layout.layout(true);
            pal.grp.minimumSize = pal.grp.size;
            pal.layout.resize();
            pal.onResizing = pal.onResize = function () {this.layout.resize();}
            
            pal.grp.selPnl.selectSolids.onClick = rd_SolidRenamer_doSelectSolids;
            pal.grp.namePnl.delSuffix.onClick = rd_SolidRenamer_doUpdateExample;
            pal.grp.namePnl.r1.tpl.onChange = rd_SolidRenamer_doUpdateExample;
            
            pal.grp.header.help.onClick = function () {alert(rd_SolidRenamerData.scriptTitle + "\n" + rd_SolidRenamer_localize(rd_SolidRenamerData.strHelpText), rd_SolidRenamerData.scriptName);}
            pal.grp.cmds.rename.onClick = rd_SolidRenamer_doRenameSolids;
        }
        
        return pal;
    }
    
    
    
    
    // rd_SolidRenamer_doSelectSolids()
    // 
    // Description:
    // This callback function selects the solid footage in the
    // Project window.
    // 
    // Parameters:
    // None.
    // 
    // Returns:
    // Nothing.
    //
    function rd_SolidRenamer_doSelectSolids()
    {
        if (app.project !== null)
        {
            var onlySolidns = this.parent.parent.selPnl.onlyWSn.value;
            var items = app.project.items, item, color;
            
            // Loop through all solids in the project
            for (var i = 1; i <= items.length; i++)
            {
                item = items[i];
                if (item.typeName === "Footage")
                {
                    try
                    {
                        // Skip disk footage and placeholders
                        if ((item.mainSource.file !== null) || !item.mainSource.isStill)
                            continue;
                        
                        color = item.mainSource.color;
                        
                        // Don't select solids that end in " Solid #"; otherwise do
                        if (onlySolidns)
                        {
                            if (item.name.match(/ Solid \d+$/))
                                item.selected = true;
                            else
                                item.selected = false;
                        }
                        else
                            item.selected = true;
                    }
                    catch (e)
                    {
                        continue;
                    }
                }
            }
        }
    }
    
    
    
    
    // rd_SolidRenamer_doRenameSolids()
    // 
    // Description:
    // This callback function renames the selected solid footage
    // based on the settings provided.
    // 
    // Parameters:
    // None.
    // 
    // Returns:
    // Nothing.
    //
    function rd_SolidRenamer_doRenameSolids()
    {
        if (app.project !== null)
        {
            var items = app.project.items, item, color;
            var tempItems = new Array();
            var delSuffix = this.parent.parent.namePnl.delSuffix.value;
            var template = this.parent.parent.namePnl.r1.tpl.text;
            
            // No work to do if the template is empty
            if (template === "")
            {
                alert(rd_SolidRenamer_localize(rd_SolidRenamerData.strErrEmptyTemplate), rd_SolidRenamerData.scriptName);
                return;
            }
            
            // Encapsulate all operations into a single undo event
            app.beginUndoGroup(rd_SolidRenamerData.scriptName);
            
            // Build a temp array of the solid footage, to avoid problems
            // during the renaming process (in which AE wants to keep the
            // list of solids sorted, which can mess up the indexing of 
            // items). Grrr!
            for (var i = 1; i <= items.length; i++)
            {
                item = items[i];
                if ((item.typeName === "Footage") && item.selected)
                {
                    try
                    {
                        // Skip disk footage and placeholders
                        if ((item.mainSource.file !== null) || !item.mainSource.isStill)
                            continue;
                        
                        color = item.mainSource.color;
                        tempItems[tempItems.length] = item;
                    }
                    catch (e)
                    {
                        continue;
                    }
                }
            }
            
            // Loop through the selected solid footage
            for (var i = 0; i < tempItems.length; i++)
            {
                item = tempItems[i];
                color = item.mainSource.color;
                
                // Update the solid's name
                item.name = rd_SolidRenamer_formatSolidName(template, item.name, delSuffix, color, [item.width,item.height], item.pixelAspect)
            }
            
            app.endUndoGroup();
        }
    }
    
    
    
    
    // rd_SolidRenamer_doUpdateExample()
    // 
    // Description:
    // This callback function updates the Example field based
    // on the current naming settings.
    // 
    // Parameters:
    // None.
    // 
    // Returns:
    // Nothing.
    //
    function rd_SolidRenamer_doUpdateExample()
    {
        this.parent.parent.r2.ex.text = rd_SolidRenamer_formatSolidName(this.text, "Deep Cyan Solid 1", this.parent.parent.delSuffix.value, [0.04644775390625,0.61679077148438,0.62353515625], [640,480], 1.42);
    }
    
    
    
    
    // rd_SolidRenamer_formatSolidName()
    // 
    // Description:
    // This function returns a solid footage name formatted
    // using the specified template.
    // 
    // Parameters:
    //   tpl - The naming template to use.
    //   name - The current name.
    //   noSuffix - Boolean identifying if the suffix should be removed first.
    //   color - Array of [r,g,b] values for the color.
    //   size - Array of [w,h] values for the solid's pixel dimensions.
    //   par - Number representing the solid's pixel aspect ratio.
    // 
    // Returns:
    // String.
    //
    function rd_SolidRenamer_formatSolidName(tpl, name, noSuffix, color, size, par)
    {
        var baseName = name, newName;
        var bitDepth = app.project.bitsPerChannel, maxBitDepth;
        
        // Get the maximum color bit depth, used for calculations
        switch (bitDepth)
        {
            case 16:
                maxBitDepth = 32768
                break;
            case 32:
                maxBitDepth = 1.0;
                break;
            case 8:
            default:
                maxBitDepth = 255;
                break;
        }
        
        // Delete the " Solid n" Suffix?
        if (noSuffix)
            baseName = baseName.replace(/ Solid \d+$/, "");
        
        // Start with the template
        newName = tpl;
        
        // Add name?
        if (newName.indexOf("[name]") !== -1)
            newName = newName.replace("[name]", baseName);
        
        // Add color value?
        if (newName.indexOf("[r]") !== -1)
            newName = newName.replace("[r]", bitDepth === 32 ? (Math.round(color[0] * 10000))/10000 : Math.round(color[0] * maxBitDepth));
        if (newName.indexOf("[g]") !== -1)
            newName = newName.replace("[g]", bitDepth === 32 ? (Math.round(color[1] * 10000))/10000 : Math.round(color[1] * maxBitDepth));
        if (newName.indexOf("[b]") !== -1)
            newName = newName.replace("[b]", bitDepth === 32 ? (Math.round(color[2] * 10000))/10000 : Math.round(color[2] * maxBitDepth));
        
        // Add size values?
        if (newName.indexOf("[w]") !== -1)
            newName = newName.replace("[w]", size[0]);
        if (newName.indexOf("[h]") !== -1)
            newName = newName.replace("[h]", size[1]);
        
        // Add pixel aspect ratio value?
        if (newName.indexOf("[par]") !== -1)
            newName = newName.replace("[par]", par);
        
        // Return the new name
        return newName;
    }
    
    
    
    
    // main code:
    //
    
    if (parseFloat(app.version) < 10.0)
        alert(rd_SolidRenamer_localize(rd_SolidRenamerData.strMinAE100), rd_SolidRenamerData.scriptName);
    else
    {
        // Build and show the console's floating palette
        var rdsrPal = rd_SolidRenamer_buildUI(thisObj);
        if (rdsrPal !== null)
        {
            if (rdsrPal instanceof Window)
            {
                rdsrPal.center();
                rdsrPal.show();
            }
            else
                rdsrPal.layout.layout(true);
        }
    }
})(this);
