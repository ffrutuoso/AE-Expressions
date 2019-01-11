// rd_Watermark.jsx
// Copyright (c) 2008-2013 redefinery (Jeffrey R. Almasol). All rights reserved.
// check it: www.redefinery.com
// 
// Name: rd_Watermark
// Version: 1.0
// 
// Description:
// This script adds the topmost selected composition to all other selected 
// compositions as the topmost layer. You can use this script to add a 
// watermark to a bunch of comps. If you want to apply the watermark 
// to a bunch of footage, just import the footage files, and drag them 
// to the New Composition button (selecting to create Multiple 
// Compositions).
// 
// Note: The watermark comp will be centered within the other 
// comps. No control over blending mode is available at this time.
// Also, you should make sure that the watermark comp's duration is
// at least as long as the longest composition you want to add it to.
// 
// Note: This version of the script requires After Effects CS3 
// or later.
// 
// Originally requested by Randy McWilson.
// 
// Legal stuff:
// This script is provided "as is," without warranty of any kind, expressed
// or implied. In no event shall the author be held liable for any damages 
// arising in any way from the use of this script.
// 
// In other words, I'm just trying to share knowledge with and help out my
// fellow AE script heads, so don't blame me if my code doesn't rate. :-)




// rd_Watermark()
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
(function rd_Watermark(thisObj)
{
    // Globals
    
    var rd_WatermarkData = new Object();	// Store globals in an object
    rd_WatermarkData.scriptName = "rd: Watermark";
    rd_WatermarkData.scriptTitle = rd_WatermarkData.scriptName + " v1.0";
    
    rd_WatermarkData.strHelp = {"en": "?"};
    rd_WatermarkData.strErrNoProj = {en: "Cannot perform operation. Please create or open a project, and try again."};
    rd_WatermarkData.strErrNoMinTwoCompsSel = {en: "Cannot perform operation. Please select at least two compositions in the Project panel, and try again."};
    rd_WatermarkData.strImDone = {en: "All done. The watermark comp has been deselected, so that you can easily add the watermarked comps to the Render Queue."};
    rd_WatermarkData.strMinAE80 = {en: "This script requires Adobe After Effects CS3 or later."};
    rd_WatermarkData.strHelpText = 
    {
        "en": "Copyright (c) 2008 redefinery (Jeffrey R. Almasol). \n" +
        "All rights reserved.\n" +
        "\n" +
        "This script adds the topmost selected composition to all other selected compositions as the topmost layer. You can use this script to add a watermark to a bunch of comps. If you want to apply the watermark to a bunch of footage, just import the footage files, and drag them to the New Composition button (selecting to create Multiple Compositions).\n" + 
        "\n" +
        "Note: The watermark comp will be centered within the other comps. No control over blending mode is available at this time. Also, you should make sure that the watermark comp's duration is at least as long as the longest composition you want to add it to.\n" +
        "\n" +
        "Note: This version of the script requires After Effects CS3 or later.\n" + 
        "\n" +
        "Originally requested by Randy McWilson.\n"
    };
    
    
    
    
    // rd_Watermark_localize()
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
    function rd_Watermark_localize(strVar)
    {
        return strVar["en"];
    }
    
    
    
    
    // rd_Watermark_doIt()
    // 
    // Description:
    // This function performs the actual work.
    // 
    // Parameters:
    // None.
    // 
    // Returns:
    // Nothing.
    //
    function rd_Watermark_doIt()
    {
        // Check that a project exists
        if (app.project === null)
        {
            alert(rd_Watermark_localize(rd_WatermarkData.strErrNoProj), rd_WatermarkData.scriptName);
            return;
        }
        
        var proj = app.project;
        
        // Get the list of selected comps; make sure at least two
        var comps = new Array();
        for (var i=0; i<proj.selection.length; i++)
        {
            if (proj.selection[i] instanceof CompItem)
                comps[comps.length] = proj.selection[i];
        }
        
        if (comps.length < 2)
        {
            alert(rd_Watermark_localize(rd_WatermarkData.strErrNoMinTwoCompsSel), rd_WatermarkData.scriptName);
            return;
        }
        
        // Do the work
        app.beginUndoGroup(rd_WatermarkData.scriptName);
        
        var watermarkComp = comps[0], watermarkLayer;
        for (var i=1; i<comps.length; i++)
        {
            // Add watermark comp as layer to each other selected comp
            try
            {
                watermarkLayer = comps[i].layers.add(watermarkComp, watermarkComp.duration);
            }
            catch (e)
            {
                // Assuming we could add the layer. Yeah, I know. I'll get better error handling in later.
            }
        }
        
        // Deselect the watermark comp so that it's easier to add the modified comps to the render queue
        watermarkComp.selected = false;
        
        app.endUndoGroup();
        
        // Let the user know we're done
        alert(rd_Watermark_localize(rd_WatermarkData.strImDone), rd_WatermarkData.scriptName);
    }
    
    
    
    
    // main code:
    //
    
    // Prerequisites check
    if (parseFloat(app.version) < 8.0)
        alert(rd_Watermark_localize(rd_WatermarkData.strMinAE80), rd_WatermarkData.scriptName);
    else
    {
        rd_Watermark_doIt();
    }
})(this);
