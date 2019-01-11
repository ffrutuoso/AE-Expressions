// rd_Shifter.jsx
// Copyright (c) 2005-2013 redefinery (Jeffrey R. Almasol). All rights reserved.
// check it: www.redefinery.com
// 
// Name: rd_Shifter
// Version: 3.0
// 
// Description:
// This script displays a palette with controls for shifting the selected
// layers in unison to specific points in time in the composition.
// 
// Note: This version of the script requires After Effects CS5 
// or later. It can be used as a dockable panel by placing the 
// script in a ScriptUI Panels subfolder of the Scripts folder, 
// and then choosing this script from the Window menu.
// 
// Originally requested by Gary Jaeger. Enhancements requested by Matt 
// Silverman.
// 
// Legal stuff:
// This script is provided "as is," without warranty of any kind, expressed
// or implied. In no event shall the author be held liable for any damages 
// arising in any way from the use of this script.
// 
// In other words, I'm just trying to share knowledge with and help out my
// fellow AE script heads, so don't blame me if my code doesn't rate. :-)




// rd_Shifter()
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
(function rd_Shifter(thisObj)
{
    // Globals
    
    var rd_ShifterData = new Object();	// Store globals in an object
    rd_ShifterData.scriptName = "rd: Shifter";
    rd_ShifterData.scriptTitle = rd_ShifterData.scriptName + " v3.0";
    
    rd_ShifterData.strRefLayer = {en: "Ref. Layer:"};
    rd_ShifterData.strRefLayerOpts = {en: '["Top Selected", "Bottom Selected", "First Selected", "Last Selected", "Earliest (In Point) Selected", "Latest (In Point) Selected"]'};
    rd_ShifterData.strShiftTo = {en: "Shift To:"};
    rd_ShifterData.strShiftToOpts = {en: '["Current Time", "Start of Composition", "Start of Work Area"]'};
    rd_ShifterData.strShift = {en: "Shift"};
    rd_ShifterData.strHelp = {en: "?"}
    rd_ShifterData.strErrNoCompSel = {en: "Cannot perform operation. Please select or open a single composition in the Project panel, and try again."};
    rd_ShifterData.strErrNoLayerSel = {en: "Cannot perform operation. Please select at least one layer, and try again."};
    rd_ShifterData.strMinAE100 = {en: "This script requires Adobe After Effects CS5 or later."};
    rd_ShifterData.strHelpText = 
    {
        en: "Copyright (c) 2005-2013 redefinery (Jeffrey R. Almasol). \n" +
        "All rights reserved.\n" +
        "\n" +
        "This script displays a palette with controls for shifting the selected layers in unison to specific points in time in the composition.\n" +
        "\n" +
        "Note: This version of the script requires After Effects CS5 or later. It can be used as a dockable panel by placing the script in a ScriptUI Panels subfolder of the Scripts folder, and then choosing this script from the Window menu.\n" +
        "\n" +
        "Originally requested by Gary Jaeger. Enhancements requested by Matt Silverman."
    };
    
    
    
    
    // rd_Shifter_localize()
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
    function rd_Shifter_localize(strVar)
    {
        return strVar["en"];
    }
    
    
    
    
    // rd_Shifter_buildUI()
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
    function rd_Shifter_buildUI(thisObj)
    {
        var pal = (thisObj instanceof Panel) ? thisObj : new Window("palette", rd_ShifterData.scriptName, undefined, {resizeable:true});
        
        if (pal !== null)
        {
            var res = 
            "group { \
                orientation:'column', alignment:['fill','top'], \
                header: Group { \
                    alignment:['fill','top'], \
                    title: StaticText { text:'" + rd_ShifterData.scriptName + "', alignment:['fill','center'] }, \
                    help: Button { text:'" + rd_Shifter_localize(rd_ShifterData.strHelp) +"', maximumSize:[30,20], alignment:['right','center'] }, \
                }, \
                r1: Group { \
                    alignment:['fill','top'], \
                    refLayer: StaticText { text:'" + rd_Shifter_localize(rd_ShifterData.strRefLayer) + "' }, \
                    refLayerOpts: DropDownList { properties:{items:" + rd_Shifter_localize(rd_ShifterData.strRefLayerOpts) + "}, alignment:['fill','top'], preferredSize:[-1,20] }, \
                }, \
                r2: Group { \
                    alignment:['fill','top'], \
                    shiftTo: StaticText { text:'" + rd_Shifter_localize(rd_ShifterData.strShiftTo) + "' }, \
                    shiftToOpts: DropDownList { properties:{items:" + rd_Shifter_localize(rd_ShifterData.strShiftToOpts) + "}, alignment:['fill','top'], preferredSize:[-1,20] }, \
                }, \
                cmds: Group { \
                    alignment:['right','top'], \
                    shiftBtn: Button { text:'" + rd_Shifter_localize(rd_ShifterData.strShift) + "', preferredSize:[-1,20] }, \
                }, \
            }";
            pal.grp = pal.add(res);
            
            pal.grp.r2.shiftTo.preferredSize.width = pal.grp.r1.refLayer.preferredSize.width;
            
            pal.layout.layout(true);
            pal.grp.minimumSize = pal.grp.size;
            pal.layout.resize();
            pal.onResizing = pal.onResize = function () {this.layout.resize();}
            
            pal.grp.r1.refLayerOpts.selection = 0;
            pal.grp.r2.shiftToOpts.selection = 0;
            
            pal.grp.header.help.onClick = function () {alert(rd_ShifterData.scriptTitle + "\n" + rd_Shifter_localize(rd_ShifterData.strHelpText), rd_ShifterData.scriptName);}
            pal.grp.cmds.shiftBtn.onClick = rd_Shifter_doShifter;
        }
        
        return pal;
    }
    
    
    
    
    // rd_Shifter_doShifter()
    // 
    // Description:
    // This function performs the actual shifting of the selected layers.
    // 
    // Parameters:
    // None.
    // 
    // Returns:
    // Nothing.
    //
    function rd_Shifter_doShifter()
    {
        var refLayerOpt;
        var shiftToOpt;
        
        refLayerOpt = this.parent.parent.r1.refLayerOpts.selection.index;
        shiftToOpt = this.parent.parent.r2.shiftToOpts.selection.index;
        
        // Check that a project exists
        if (app.project === null)
            return;
        
        // Get the current (active/frontmost) comp
        var comp = app.project.activeItem;
        
        if ((comp === null) || !(comp instanceof CompItem))
        {
            alert(rd_Shifter_localize(rd_ShifterData.strErrNoCompSel), rd_ShifterData.scriptName);
            return;
        }
        
        // If no layers are selected, nothing to do
        if (comp.selectedLayers.length === 0)
        {
            alert(rd_Shifter_localize(rd_ShifterData.strErrNoLayerSel), rd_ShifterData.scriptName);
            return;
        }
        
        // Determine layers to process
        var layers = new Array(), refLayerIndex = 0;
        if ((refLayerOpt === 0) || (refLayerOpt === 1))		// Top Selected or Bottom Selected
        {
            for (var i=1; i<=comp.layers.length; i++)		// Check for selected layers from top to bottom
                if (comp.layer(i).selected)
                    layers[layers.length] = comp.layer(i);
            
            if (refLayerOpt === 1)
                refLayerIndex = layers.length - 1;
        }
        else if (refLayerOpt === 2)				// First Selected
            layers = comp.selectedLayers;
        else if (refLayerOpt === 3)				// Last Selected
        {
            layers = comp.selectedLayers;
            refLayerIndex = layers.length - 1;
        }
        else if (refLayerOpt === 4)				// Earliest (In-Point) Selected
        {
            layers = comp.selectedLayers;
            for (var i=1; i<layers.length; i++)
                if (layers[i].inPoint < layers[refLayerIndex].inPoint)
                    refLayerIndex = i;
        }
        else if (refLayerOpt === 5)				// Latest (In-Point) Selected
        {
            layers = comp.selectedLayers;
            for (var i=1; i<layers.length; i++)
                if (layers[i].inPoint > layers[refLayerIndex].inPoint)
                    refLayerIndex = i;
        }
        
        // Determine offset from selected shift point to start of reference layer
        // (give special consideration to negatively stretched layers)
        var offset;
        if (shiftToOpt === 0)					// Current Time
            offset = comp.time - ((layers[refLayerIndex].stretch < 0) ? layers[refLayerIndex].outPoint : layers[refLayerIndex].inPoint);
        else if (shiftToOpt === 1)				// Start of Composition
            offset = -((layers[refLayerIndex].stretch < 0) ? layers[refLayerIndex].outPoint : layers[refLayerIndex].inPoint);
        else if (shiftToOpt === 2)				// Start of Work Area
            offset = comp.workAreaStart - ((layers[refLayerIndex].stretch < 0) ? layers[refLayerIndex].outPoint : layers[refLayerIndex].inPoint);
        
        // Shift the layers
        app.beginUndoGroup(rd_ShifterData.scriptName);
        
        for (var i=0; i<layers.length; i++)
            layers[i].startTime += offset;
        
        app.endUndoGroup();
    }
    
    
    
    
    // main code:
    //
    
    if (parseFloat(app.version) < 10.0)
        alert(rd_Shifter_localize(rd_ShifterData.strMinAE100), rd_ShifterData.scriptName);
    else
    {
        // Build and show the console's floating palette
        var rdshPal = rd_Shifter_buildUI(thisObj);
        if (rdshPal !== null)
        {
            // Update UI values, if saved in the settings
            var listOpt;
            
            if (app.settings.haveSetting("redefinery", "rd_Shifter_refLayerOpts"))
            {
                listOpt = parseInt(app.settings.getSetting("redefinery", "rd_Shifter_refLayerOpts"));
                rdshPal.grp.r1.refLayerOpts.selection = listOpt;
            }
            if (app.settings.haveSetting("redefinery", "rd_Shifter_shiftToOpts"))
            {
                listOpt = parseInt(app.settings.getSetting("redefinery", "rd_Shifter_shiftToOpts"));
                rdshPal.grp.r2.shiftToOpts.selection = listOpt;
            }
            
            // Save current UI settings upon closing the palette
            rdshPal.onClose = function()
            {
                app.settings.saveSetting("redefinery", "rd_Shifter_refLayerOpts", rdshPal.grp.r1.refLayerOpts.selection.index);
                app.settings.saveSetting("redefinery", "rd_Shifter_shiftToOpts", rdshPal.grp.r2.shiftToOpts.selection.index);
            }
            
            if (rdshPal instanceof Window)
            {
                // Show the palette
                rdshPal.center();
                rdshPal.show();
            }
            else
                rdshPal.layout.layout(true);
        }
    }
})(this);
