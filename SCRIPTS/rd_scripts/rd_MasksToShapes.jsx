// rd_MasksToShapes.jsx
// Copyright (c) 2007-2013 redefinery (Jeffrey R. Almasol). All rights reserved.
// check it: www.redefinery.com
// 
// Name: rd_MasksToShapes
// Version: 1.0
// 
// Description:
// This script creates a shape layer with paths for each mask on the 
// selected layer.
// 
// This version of the script will create a shape layer with paths for each 
// mask on the selected layer. Other current issues:
// -- Only the transforms at the current time are copied over; keyframes 
// and expressions on them are not used.
// -- The shape layer might not have the same transforms of the selected 
// layer in all cases.
// -- Mask modes and mask opacity are ignored.
// ...and probably other issues I don't know yet. :-/
// 
// Note: This script requires After Effects CS3 or later.
// 
// Originally requested by Trish Meyer.
// 
// Legal stuff:
// This script is provided "as is," without warranty of any kind, expressed
// or implied. In no event shall the author be held liable for any damages 
// arising in any way from the use of this script.
// 
// In other words, I'm just trying to share knowledge with and help out my
// fellow AE script heads, so don't blame me if my code doesn't rate. :-)




// rd_MasksToShapes()
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
(function rd_MasksToShapes(thisObj)
{
    // Globals
    
    var onWindows = ($.os.indexOf("Windows") !== -1);
    
    var rd_MasksToShapesData = new Object();	// Store globals in an object
    rd_MasksToShapesData.scriptName = "rd: Masks to Shapes";
    rd_MasksToShapesData.scriptTitle = rd_MasksToShapesData.scriptName + " v1.0";
    
    rd_MasksToShapesData.strHelp = {en: "?"};
    rd_MasksToShapesData.strMinAE80 = {en: "This script requires Adobe After Effects CS3 or later."};
    rd_MasksToShapesData.strErrNoCompSel = {en: "Cannot perform operation. Please select or open a single composition in the Project panel, and try again."};
    rd_MasksToShapesData.strNoSelLayer = {en: "Cannot perform operation. Please select a single layer containing at least one mask, and try again."};
    rd_MasksToShapesData.strHelpText = 
    {
        en: "Copyright (c) 2007-2013 redefinery (Jeffrey R. Almasol). \n" +
        "All rights reserved.\n" +
        "\n" +
        "This script creates a shape layer with paths for each mask on the selected layer.\n" +
        "\n" +
        "This version of the script will create a shape layer with paths for each mask on the selected layer. Other current issues:\n" +
        "-- Only the transforms at the current time are copied over; keyframes and expressions on them are not used.\n" +
        "-- The shape layer might not have the same transforms of the selected layer in all cases.\n" +
        "-- Mask modes and mask opacity are ignored.\n" +
        "...and probably other issues I don't know yet. :-/\n" +
        "\n" +
        "Note: This script requires After Effects CS3 or later.\n" +
        "\n" +
        "Originally requested by Trish Meyer.\n"
    };
    
    
    
    
    // rd_MasksToShapes_localize()
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
    function rd_MasksToShapes_localize(strVar)
    {
        return strVar["en"];
    }
    
    
    
    
    // rd_MasksToShapes_doIt()
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
    function rd_MasksToShapes_doIt()
    {
        var comp = app.project.activeItem;
        var masksLayer = comp.selectedLayers[0];
        var masksGroup = masksLayer.property("ADBE Mask Parade");
        
        app.beginUndoGroup(rd_MasksToShapesData.scriptName);
        
        // Create an empty shape layer
        var suffix = " Shapes";
        var shapeLayer = comp.layers.addShape();
        shapeLayer.name =  masksLayer.name.substr(0,31-suffix.length) + suffix;
        shapeLayer.moveBefore(masksLayer);
        
        var shapeLayerContents = shapeLayer.property("ADBE Root Vectors Group");
        var shapeGroup = shapeLayerContents; //.addProperty("ADBE Vector Group");
        //shapeGroup.name = "Masks";
        var shapePathGroup, shapePath, shapePathData;
        
        // Get the mask layer's pixel aspect; if layer has no source, use comp's pixel aspect
        var pixelAspect = (masksLayer.source !== null) ? masksLayer.source.pixelAspect : 1.0; //comp.pixelAspect;
        
        // Iterate over the masks layer's masks, converting their paths to shape paths
        var mask, maskPath, vertices;
        for (var m=1; m<=masksGroup.numProperties; m++)
        {
            // Get mask info
            mask = masksGroup.property(m);
            maskPath = mask.property("ADBE Mask Shape");
            
            // Create new shape path using mask info
            shapePathGroup = shapeGroup.addProperty("ADBE Vector Shape - Group");
            shapePathGroup.name = mask.name;
            shapePath = shapePathGroup.property("ADBE Vector Shape");
            
            shapePathData = new Shape();
            
            // ...adjust mask vertices (x axis) by pixel aspect
            vertices = new Array();
            for (var v=0; v<maskPath.value.vertices.length; v++)
                vertices[vertices.length] = [maskPath.value.vertices[v][0] * pixelAspect, maskPath.value.vertices[v][1]];
            shapePathData.vertices = vertices;
            
            shapePathData.inTangents = maskPath.value.inTangents;
            shapePathData.outTangents = maskPath.value.outTangents;
            shapePathData.closed = maskPath.value.closed;
            shapePath.setValue(shapePathData);
        }
        
        // Match the mask layer's transforms
        shapeLayer.transform.anchorPoint.setValue(masksLayer.transform.anchorPoint.value);
        shapeLayer.transform.position.setValue(masksLayer.transform.position.value);
        shapeLayer.transform.scale.setValue(masksLayer.transform.scale.value);
        if (masksLayer.threeDLayer)
        {
            shapeLayer.threeDLayer = true;
            shapeLayer.transform.xRotation.setValue(masksLayer.transform.xRotation.value);
            shapeLayer.transform.yRotation.setValue(masksLayer.transform.yRotation.value);
            shapeLayer.transform.zRotation.setValue(masksLayer.transform.zRotation.value);
            shapeLayer.transform.orientation.setValue(masksLayer.transform.orientation.value);
        }
        else
        {
            shapeLayer.transform.rotation.setValue(masksLayer.transform.rotation.value);
        }
        shapeLayer.transform.opacity.setValue(masksLayer.transform.opacity.value);
        
        // Mute the mask layer
        masksLayer.enabled = false;
        
        app.endUndoGroup();
    }
    
    
    
    
    // main code:
    //
    
    // Prerequisites check
    if (parseFloat(app.version) < 8.0)
        alert(rd_MasksToShapes_localize(rd_MasksToShapesData.strMinAE80), rd_MasksToShapesData.scriptName);
    else
    {
        // Make sure only a single comp is selected
        if (app.project === null)
            return;
        
        // Get the current (active/frontmost) comp
        var comp = app.project.activeItem;
        
        if ((comp === null) || !(comp instanceof CompItem))
        {
            alert(rd_MasksToShapes_localize(rd_MasksToShapesData.strErrNoCompSel), rd_MasksToShapesData.scriptName);
            return;
        }
        
        // Make sure there is a single selected layer with at least one mask on it
        if (comp.selectedLayers.length !== 1)
        {
            alert(rd_MasksToShapes_localize(rd_MasksToShapesData.strNoSelLayer), rd_MasksToShapesData.scriptName);
            return;
        }
        
        var masksGroup = comp.selectedLayers[0].property("ADBE Mask Parade");
        if ((masksGroup === null) || (masksGroup.numProperties < 1))
        {
            alert(rd_MasksToShapes_localize(rd_MasksToShapesData.strNoSelLayer), rd_MasksToShapesData.scriptName);
            return;
        }
        
        rd_MasksToShapes_doIt();
    }
})(this);
