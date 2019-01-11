// rd_ShapesToMasks.jsx
// Copyright (c) 2007-2013 redefinery (Jeffrey R. Almasol). All rights reserved.
// check it: www.redefinery.com
// 
// Name: rd_ShapesToMasks
// Version: 1.1
// 
// Description:
// This script creates masks outlines for the selected shape layer's paths, 
// which can be helpful if you have converted a text layer to outlines (using 
// the Layer > Create Outlines menu command), but prefer mask paths 
// instead.
// 
// This version of the script will create a white solid with the created 
// masks on them. Other current issues:
// -- This script assumes you have just used the Create Outlines menu 
// command, so any shape filters or restructuring of the shape layer's 
// Contents will either be ignored or cause problems.
// -- Only the transforms at the current time are copied over; keyframes 
// and expressions on them are not used.
// ...and probably other issues I don't know yet. :-/
// 
// Note: This script requires After Effects CS3 or later.
// 
// Originally requested by Rob Birnholz and Trish Meyer.
// Enhancements suggested by nab.
// 
// Legal stuff:
// This script is provided "as is," without warranty of any kind, expressed
// or implied. In no event shall the author be held liable for any damages 
// arising in any way from the use of this script.
// 
// In other words, I'm just trying to share knowledge with and help out my
// fellow AE script heads, so don't blame me if my code doesn't rate. :-)




// rd_ShapesToMasks()
// 
// Description:
// This function contains the main logic for this script.
// 
// Parameters:
// None.
// 
// Returns:
// Nothing.
//
(function rd_ShapesToMasks(thisObj)
{
    // Globals
    
    var onWindows = ($.os.indexOf("Windows") !== -1);
    
    var rd_ShapesToMasksData = new Object();	// Store globals in an object
    rd_ShapesToMasksData.scriptName = "rd: Shapes to Masks";
    rd_ShapesToMasksData.scriptTitle = rd_ShapesToMasksData.scriptName + " v1.1";
    
    rd_ShapesToMasksData.strHelp = {en: "?"};
    rd_ShapesToMasksData.strMinAE80 = {en: "This script requires Adobe After Effects CS3 or later."};
    rd_ShapesToMasksData.strErrNoCompSel = {en: "Cannot perform operation. Please select or open a single composition in the Project panel, and try again."};
    rd_ShapesToMasksData.strNoSelLayer = {en: "Cannot perform operation. Please select a single shape layer, and try again."};
    rd_ShapesToMasksData.strHelpText = 
    {
        en: "Copyright (c) 2007-2013 redefinery (Jeffrey R. Almasol). \n" +
        "All rights reserved.\n" +
        "\n" +
        "This script creates masks outlines for the selected shape layer's paths, which can be helpful if you have converted a text layer to outlines (using the Layer > Create Outlines menu command), but prefer mask paths instead.\n" +
        "\n" +
        "This version of the script will create a white solid with the created masks on them. Other current issues:\n" +
        "-- This script assumes you have just used the Create Outlines menu command, so any shape filters or restructuring of the shape layer's Contents will either be ignored or cause problems.\n" +
        "-- Only the transforms at the current time are copied over; keyframes and expressions on them are not used.\n" +
        "...and probably other issues I don't know yet. :-/\n" +
        "\n" +
        "Note: This script requires After Effects CS3 or later.\n" +
        "\n" +
        "Originally requested by Rob Birnholz and Trish Meyer.\n" +
        "Enhancements suggested by nab.\n"
    };
    
    
    
    
    // rd_ShapesToMasks_localize()
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
    function rd_ShapesToMasks_localize(strVar)
    {
        return strVar["en"];
    }
    
    
    
    
    // rd_ShapesToMasks_doIt()
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
    function rd_ShapesToMasks_doIt()
    {
        var comp = app.project.activeItem;
        var shapeLayer = comp.selectedLayers[0];
        
        app.beginUndoGroup(rd_ShapesToMasksData.scriptName);
        
        // Create a comp-sized solid layer, but square PAR
        var suffix = " Masks";
        var layerName = shapeLayer.name.substr(0,31-suffix.length) + suffix;
        var layer = comp.layers.addSolid([1,1,1], layerName, comp.width, comp.height, 1.0, comp.duration);
        layer.moveBefore(shapeLayer);
        
        // Match the shape layer's transforms
        layer.transform.position.setValue(shapeLayer.transform.position.value);
        layer.transform.scale.setValue(shapeLayer.transform.scale.value);
        if (shapeLayer.threeDLayer)
        {
            layer.threeDLayer = true;
            layer.transform.xRotation.setValue(shapeLayer.transform.xRotation.value);
            layer.transform.yRotation.setValue(shapeLayer.transform.yRotation.value);
            layer.transform.zRotation.setValue(shapeLayer.transform.zRotation.value);
            layer.transform.orientation.setValue(shapeLayer.transform.orientation.value);
        }
        else
        {
            layer.transform.rotation.setValue(shapeLayer.transform.rotation.value);
        }
        layer.transform.opacity.setValue(shapeLayer.transform.opacity.value);
        
        // Get the mask group for the target solid layer
        var maskGroup = layer.property("ADBE Mask Parade");
        var mask, maskPath, maskVertices;
        
        // Iterate over the shape layer's paths, converting them to masks
        var shapeContents = shapeLayer.property("ADBE Root Vectors Group");
        var shapeGroup, shapeGroupContents, shapeGroupProp, shapePath;
        for (var g=1; g<=shapeContents.numProperties; g++)
        {
            shapeGroup = shapeContents.property(g);
            // Only process groups
            if (shapeGroup.matchName !== "ADBE Vector Group")
                continue;
            
            // Get the mask vertex offsets based on the shape group's position
            var vertexXOffset = 0, vertexYOffset = 0;
            try
            {
                // Get the vector group's transforms, specifically the Position property
                vecGroupPos = shapeGroup.property("ADBE Vector Transform Group").property("ADBE Vector Position");
                vecGroupAPt = shapeGroup.property("ADBE Vector Transform Group").property("ADBE Vector Anchor");
                
                // Calculate the offset to apply to each mask vertex
                vertexXOffset = -vecGroupPos.value[0] + vecGroupAPt.value[0]; //comp.width/2 - vecGroupPos.value[0];
                vertexYOffset = -vecGroupPos.value[1] + vecGroupAPt.value[1]; //comp.height/2 - vecGroupPos.value[1];
            }
            catch (e)
            {}
            
            // Look in each group for shape paths. These will be converted to masks
            shapeGroupContents = shapeGroup.property("Contents");
            for (var gp=1; gp<=shapeGroupContents.numProperties; gp++)
            {
                shapeGroupProp = shapeGroupContents.property(gp);
                // Process shape paths
                if (shapeGroupProp.matchName === "ADBE Vector Shape - Group")
                {
                    try
                    {
                        // Get the shape path info
                        shapePath = shapeGroupProp.property("ADBE Vector Shape");
                        
                        // Create a mask based on the shape path; name it the same
                        mask = maskGroup.addProperty("ADBE Mask Atom");
                        if (mask !== null)
                        {
                            maskVertices = new Array();
                            for (var i=0; i<shapePath.value.vertices.length; i++)
                                maskVertices[maskVertices.length] = [shapePath.value.vertices[i][0]+comp.width/2 - vertexXOffset, shapePath.value.vertices[i][1]+comp.height/2 - vertexYOffset];
                            //maskVertices = shapePath.value.vertices;
                            
                            maskPath = new Shape();
                            maskPath.vertices = maskVertices;
                            maskPath.inTangents = shapePath.value.inTangents;
                            maskPath.outTangents = shapePath.value.outTangents;
                            maskPath.closed = shapePath.value.closed;
                            mask.property("ADBE Mask Shape").setValue(maskPath);
                            
                            mask.name = shapeGroupProp.name;
                            
                            if (gp > 1)
                                mask.maskMode = MaskMode.DIFFERENCE;
                        }
                    }
                    catch (e)
                    {}
                }
            }
        }
        
        // Mute the shape layer
        shapeLayer.enabled = false;
        
        app.endUndoGroup();
    }
    
    
    
    
    // main code:
    //
    
    // Prerequisites check
    if (parseFloat(app.version) < 8.0)
        alert(rd_ShapesToMasks_localize(rd_ShapesToMasksData.strMinAE80), rd_ShapesToMasksData.scriptName);
    else
    {
        // Make sure only a single comp is selected
        if (app.project === null)
            return;
        
        // Get the current (active/frontmost) comp
        var comp = app.project.activeItem;
        
        if ((comp === null) || !(comp instanceof CompItem))
        {
            alert(rd_ShapesToMasks_localize(rd_ShapesToMasksData.strErrNoCompSel), rd_ShapesToMasksData.scriptName);
            return;
        }
        
        // Make sure there is a single selected shape layer
        if (comp.selectedLayers.length !== 1)
        {
            alert(rd_ShapesToMasks_localize(rd_ShapesToMasksData.strNoSelLayer), rd_ShapesToMasksData.scriptName);
            return;
        }
        
        if (!(comp.selectedLayers[0] instanceof ShapeLayer))
        {
            alert(rd_ShapesToMasks_localize(rd_ShapesToMasksData.strNoSelLayer), rd_ShapesToMasksData.scriptName);
            return;
        }
        
        rd_ShapesToMasks_doIt();
    }
})(this);
