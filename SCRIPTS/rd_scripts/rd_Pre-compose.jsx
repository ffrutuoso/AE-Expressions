// rd_Pre-compose.jsx
// Copyright (c) 2007-2013 redefinery (Jeffrey R. Almasol). All rights reserved.
// check it: www.redefinery.com
// 
// Name: rd_Pre-compose
// Version: 1.0
// 
// Description:
// This script displays a dialog box for pre-composing one or 
// more layers (like the built-in Pre-compose dialog box), but 
// adds the ability to trim the pre-comp to the selected layer's 
// duration, with optional trim handles, and a batch mode 
// option for performing the same operation on each of the 
// selected layers.
// 
// Current issue:
// -- Using the "Leave all attributes" option on a single selected 
// negatively stretched layer doesn't trim the layer correctly.
// 
// Note: This version of the script requires After Effects CS5 
// or later.
// 
// Originally requested by Gary Jaeger.
// Enhancements requested by Jerzy Drozda Jr. (Maltaannon)
// and Colin Proctor.
// 
// Legal stuff:
// This script is provided "as is," without warranty of any kind, expressed
// or implied. In no event shall the author be held liable for any damages 
// arising in any way from the use of this script.
// 
// In other words, I'm just trying to share knowledge with and help out my
// fellow AE script heads, so don't blame me if my code doesn't rate. :-)




// rd_Precompose()
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
(function rd_Precompose(thisObj)
{
    // Globals
    
    var rd_PrecomposeData = new Object();	// Store globals in an object
    
    rd_PrecomposeData.scriptName = "rd: Pre-compose";
    rd_PrecomposeData.scriptTitle = rd_PrecomposeData.scriptName + " v1.0";
    
    rd_PrecomposeData.strNewCompName = {en: "New composition name:"};
    rd_PrecomposeData.strLeaveOpt = {en: "Leave all attributes in \\'%s\\'"};
    rd_PrecomposeData.strLeaveOpt2 = {en: "Leave all attributes in each selected layer"};
    rd_PrecomposeData.strLeaveOptDesc = {en: "Use this option to create a new intermediate composition with only \\'%s\\' in it. The new composition will become the source to the current layer."};
    rd_PrecomposeData.strMoveOpt = {en: "Move all attributes into the new composition"};
    rd_PrecomposeData.strMoveOptDesc = {en: "Use this option to place the currently selected layers together into a new intermediate composition."};
    rd_PrecomposeData.strMoveOptDescMulti = {en: "Use this option to place the currently selected layers together into a new intermediate composition.\n\nThe \"Leave all attributes\" option is not available because more than one layer is selected."};
    rd_PrecomposeData.strMoveOptDescNoSrc = {en: "Use this option to place the currently selected layer into a new intermediate composition.\n\nThe \"Leave all attributes\" option is not available because the selected layer does not have source footage."};
    rd_PrecomposeData.strBatchMode = {en: "Pre-compose each selected layer"};
    rd_PrecomposeData.strBatchModeLayerName = {en: "Use existing layer names for new composition names"};
    rd_PrecomposeData.strTrimLayers = {en: "Trim new composition to combined layers\\' duration"};
    rd_PrecomposeData.strHeadHandle = {en: "Head handle:"};
    rd_PrecomposeData.strTailHandle = {en: "Tail handle:"};
    rd_PrecomposeData.strHandleUOM = {en: "secs"};
    rd_PrecomposeData.strOK = {en: "OK"};
    rd_PrecomposeData.strCancel = {en: "Cancel"};
    rd_PrecomposeData.strHelp = {en: "?"};
    rd_PrecomposeData.strErrNoCompSel = {en: "Cannot perform operation. Please select or open a single composition in the Project panel, and try again."};
    rd_PrecomposeData.strErrNoLayerSel = {en: "Cannot perform operation. Please select at least one layer, and try again."};
    rd_PrecomposeData.strMinAE100 = {en: "This script requires Adobe After Effects CS5 or later."};
    rd_PrecomposeData.strHelpText = 
    {
        en: "Copyright (c) 2007-2013 redefinery (Jeffrey R. Almasol). \n" +
        "All rights reserved.\n" +
        "\n" +
        "This script displays a dialog box for pre-composing one or more layers (like the built-in Pre-compose dialog box), but adds the ability to trim the pre-comp to the selected layer's  duration, with optional trim handles, and a batch mode option for performing the same operation on each of the selected layers.\n" +
        "\n" +
        "Current issue:\n" +
        "-- Using the \"Leave all attributes\" option on a single selected negatively stretched layer doesn't trim the layer correctly.\n" +
        "\n" +
        "Note: This version of the script requires After Effects CS5 or later.\n" +
        "\n" +
        "Originally requested by Gary Jaeger.\n" + 
        "Enhancements requested by Jerzy Drozda Jr. (Maltaannon) and Colin Proctor.\n"
    };
    
    
    
    
    // rd_Precompose_localize()
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
    function rd_Precompose_localize(strVar)
    {
        return strVar["en"];
    }
    
    
    
    
    // rd_Precompose_buildUI()
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
    function rd_Precompose_buildUI(thisObj)
    {
        var pal = new Window("dialog", rd_PrecomposeData.scriptName, undefined);
        if (pal !== null)
        {
            var res = 
            "group { \
                orientation:'column', alignment:['fill','fill'], alignChildren:['fill','top'], \
                compName: Group { \
                    alignment:['center','top'], \
                    lbl: StaticText { text:'" + rd_Precompose_localize(rd_PrecomposeData.strNewCompName) + "' }, \
                    fld: EditText { text:'', characters:31, preferredSize:[-1,20] }, \
                }, \
                leaveOpt: RadioButton { text:'" + rd_Precompose_localize(rd_PrecomposeData.strLeaveOpt) + "', alignment:['fill','top'], value:true, helpTip:'" + rd_Precompose_localize(rd_PrecomposeData.strLeaveOptDesc) + "' }, \
                moveOpt: RadioButton { text:'" + rd_Precompose_localize(rd_PrecomposeData.strMoveOpt) + "', alignment:['fill','top'], helpTip:'" + rd_Precompose_localize(rd_PrecomposeData.strMoveOptDesc) + "' }, \
                opts: Group { \
                    orientation:'column', alignment:['fill','top'], \
                    batchMode: Checkbox { text:'" + rd_Precompose_localize(rd_PrecomposeData.strBatchMode) + "', alignment:['fill','top'] }, \
                    batchModeLayerNames: Checkbox { text:'" + rd_Precompose_localize(rd_PrecomposeData.strBatchModeLayerName) + "', alignment:['fill','top'] }, \
                    trimLayers: Checkbox { text:'" + rd_Precompose_localize(rd_PrecomposeData.strTrimLayers) + "', alignment:['fill','top'] }, \
                    handles: Group { \
                        orientation:'row', alignment:['left','fill'], alignChildren:['left','center'], \
                        headLbl: StaticText { text:'" + rd_Precompose_localize(rd_PrecomposeData.strHeadHandle) + "', enabled:false }, \
                        headVal: EditText { text:'0', characters:4, enabled:false, preferredSize:[-1,20] }, \
                        headUOM: StaticText { text:'" + rd_Precompose_localize(rd_PrecomposeData.strHandleUOM) + "', enabled:false }, \
                        spacer: StaticText { text:'    ', alignment:['fill','center'], enabled:false }, \
                        tailLbl: StaticText { text:'" + rd_Precompose_localize(rd_PrecomposeData.strTailHandle) + "', enabled:false }, \
                        tailVal: EditText { text:'0', characters:4, enabled:false, preferredSize:[-1,20] }, \
                        tailUOM: StaticText { text:'" + rd_Precompose_localize(rd_PrecomposeData.strHandleUOM) + "', enabled:false }, \
                    }, \
                }, \
                cmds: Group { \
                    alignment:['fill','top'], \
                    helpBtn: Button { text:'" + rd_Precompose_localize(rd_PrecomposeData.strHelp) + "', alignment:['left','top'], preferredSize:[-1,20] }, \
                    okBtn: Button { text:'" + rd_Precompose_localize(rd_PrecomposeData.strOK) + "', alignment:['right','top'], preferredSize:[-1,20] }, \
                    cancelBtn: Button { text:'" + rd_Precompose_localize(rd_PrecomposeData.strCancel) + "', alignment:['right','top'], preferredSize:[-1,20] }, \
                }, \
            }";
            
            pal.grp = pal.add(res);
            
            pal.grp.opts.margins.top = pal.grp.cmds.margins.top = 10;
            pal.grp.opts.handles.indent = 20;
            
            pal.grp.compName.fld.onChanging = function ()
            {
                if (this.text.length > 31)
                    this.text = this.text.substr(0, 31);
            }
            pal.grp.opts.batchMode.onClick = function ()
            {
                var enableState = this.value;
                
                this.parent.batchModeLayerNames.enabled = enableState;
            }
            pal.grp.opts.batchModeLayerNames.onClick = function ()
            {
                var enableState = this.value;
                
                this.parent.parent.compName.lbl.enabled = this.parent.parent.compName.fld.enabled = !enableState;
            }
            pal.grp.opts.trimLayers.onClick = function ()
            {
                var enableState = this.value;
                
                //this.parent.handles.enabled = enableState;	// doesn't work in AE CS6
                this.parent.handles.headLbl.enabled = enableState;
                this.parent.handles.headVal.enabled = enableState;
                this.parent.handles.headUOM.enabled = enableState;
                this.parent.handles.spacer.enabled = enableState;
                this.parent.handles.tailLbl.enabled = enableState;
                this.parent.handles.tailVal.enabled = enableState;
                this.parent.handles.tailUOM.enabled = enableState;
            }
            pal.grp.opts.handles.headVal.onChange = pal.grp.opts.handles.tailVal.onChange = function ()
            {
                var value = parseFloat(this.text);
                if (isNaN(value) || (value < 0.0))
                    value = 0;
                else if (value > 9999)
                    value = 9999;
                this.text = value.toString();
            }
            pal.grp.cmds.helpBtn.preferredSize.width = 25;
            pal.grp.cmds.helpBtn.onClick = function () {alert(rd_PrecomposeData.scriptTitle + "\n" + rd_Precompose_localize(rd_PrecomposeData.strHelpText), rd_PrecomposeData.scriptName);}
            pal.grp.cmds.okBtn.onClick = rd_Precompose_precomp;
            
            var comp = app.project.activeItem;
            pal.grp.leaveOpt.text = rd_Precompose_localize(rd_PrecomposeData.strLeaveOpt).replace("\\'%s\\'", "'"+comp.name+"'");
            pal.grp.leaveOpt.helpTip = rd_Precompose_localize(rd_PrecomposeData.strLeaveOptDesc).replace("\\'%s\\'", "'"+comp.selectedLayers[0].name+"'");
            if (comp.selectedLayers.length === 1)
            {
                // The "Leave all attributes" option is available only if the selected layer has source
                if (comp.selectedLayers[0].source === null)
                {
                    pal.grp.moveOpt.value = true;
                    pal.grp.moveOpt.helpTip = rd_Precompose_localize(rd_PrecomposeData.strMoveOptDescNoSrc);
                    pal.grp.leaveOpt.enabled = false;
                }
                pal.grp.compName.fld.text = comp.selectedLayers[0].name.substr(0, 31-(" Comp 1".length)) + " Comp 1";
                
                // No batch mode for a single selected layer
                pal.grp.opts.batchMode.enabled = pal.grp.opts.batchMode.value = pal.grp.opts.batchModeLayerNames.enabled = pal.grp.opts.batchModeLayerNames.value = false;
            }
            else
            {
                pal.grp.compName.fld.text = "Pre-comp 1";
                pal.grp.moveOpt.value = true;
                pal.grp.moveOpt.helpTip = rd_Precompose_localize(rd_PrecomposeData.strMoveOptDescMulti);
                pal.grp.leaveOpt.text = rd_Precompose_localize(rd_PrecomposeData.strLeaveOpt2);
                pal.grp.leaveOpt.enabled = false;
                
                // Batch mode is available for multiple selected layer, but off by default
                pal.grp.opts.batchMode.enabled = true;
                pal.grp.opts.batchMode.value = pal.grp.opts.batchModeLayerNames.value = false;
                pal.grp.opts.batchModeLayerNames.enabled = false;
            }
            
            pal.layout.layout(true);
        }
        
        return pal;
    }
    
    
    // rd_Precompose_precomp()
    // 
    // Description:
    // This function performs the actual pre-comp operation.
    // 
    // Parameters:
    // None.
    // 
    // Returns:
    // Nothing.
    //
    function rd_Precompose_precomp()
    {
        function processSelected(win)
        {
            var layerIndices = new Array(), layer, layerIn, layerOut;
            var earliest=comp.duration, latest=0;
            for (var i=0; i<comp.selectedLayers.length; i++)
            {
                layer = comp.selectedLayers[i];
                layerIndices[layerIndices.length] = layer.index;
                
                if (layer.stretch < 0)
                {
                    layerIn = layer.outPoint;
                    layerOut = layer.inPoint;
                }
                else
                {
                    layerIn = layer.inPoint;
                    layerOut = layer.outPoint;
                }
                
                if (layerIn < earliest)
                    earliest = layerIn;
                if (layerOut > latest)
                    latest = layerOut;
            }
            if (earliest < 0.0)
                earliest = 0.0;
            if (latest > comp.duration)
                latest = comp.duration;
            
            var precomp = comp.layers.precompose(layerIndices, compName, moveAttrs);
            var precompLayer = comp.selectedLayers[0];		// created precomp should be the single selected layer
            var totalDur = latest - earliest;
            
            // Check if need to trim the precomp
            var headHandle = 0.0;	// default amount of shifting of layers from start of pre-comp
            if (win.opts.trimLayers.value)
            {
                headHandle = parseFloat(win.opts.handles.headVal.text);
                var tailHandle = parseFloat(win.opts.handles.tailVal.text);
                totalDur = totalDur + headHandle + tailHandle;
            }
            
            // Shift pre-comped layers to start of comp
            for (var i=1; i<=precomp.numLayers; i++)
            {
                precomp.layer(i).startTime -= earliest - headHandle;
            }
            
            if (moveAttrs) {
                // Trim precomp to appropriate duration
                precomp.duration = totalDur;
            }
            
            // Shift pre-comp layer
            if (precompLayer.stretch < 0)
            {
                precompLayer.inPoint = latest;
                precompLayer.outPoint = earliest;
            }
            else
            {
                precompLayer.startTime = earliest - headHandle;
                precompLayer.inPoint = earliest;
                precompLayer.outPoint = latest;
            }
        }
        
        var compName = this.parent.parent.compName.fld.text.substr(0, 31);
        var moveAttrs = this.parent.parent.moveOpt.value;
        var batchMode = this.parent.parent.opts.batchMode.value;
        var batchModeLayerNames = this.parent.parent.opts.batchModeLayerNames.value;
        this.parent.parent.parent.close();
        
        app.beginUndoGroup(rd_PrecomposeData.scriptName);
        
        var comp = app.project.activeItem;
        
        if (batchMode)
        {
            // Save the originally selected layers, in case we are using batch mode
            var savedLayerIndices = new Array();
            for (var i=0; i<comp.selectedLayers.length; i++)
                savedLayerIndices[savedLayerIndices.length] = comp.selectedLayers[i].index;
            
            // Process each originally selected layer
            var prevLayerName;
            for (var i=0; i<savedLayerIndices.length; i++)
            {
                // First, deselect all layers
                for (var j=0; j<savedLayerIndices.length; j++)
                    comp.layer(savedLayerIndices[j]).selected = false;
                
                // Then, select the next layer to process, and then process it
                comp.layer(savedLayerIndices[i]).selected = true;
                prevLayerName = comp.layer(savedLayerIndices[i]).name;
                processSelected(this.parent.parent);
                
                // Name the comp based on the layer, if desired
                if (batchModeLayerNames)
                    comp.layer(savedLayerIndices[i]).source.name = prevLayerName;
            }
        }
        else
            processSelected(this.parent.parent);
        
        app.endUndoGroup();
    }
    
    
    // main:
    // 
    
    if (parseFloat(app.version) < 10.0)
        alert(rd_Precompose_localize(rd_PrecomposeData.strErrMinAE100), rd_PrecomposeData.scriptName);
    else
    {
        // Check that at least one layer is selected
        var comp = app.project.activeItem;
        if ((comp === null) || !(comp instanceof CompItem))
        {
            alert(rd_Precompose_localize(rd_PrecomposeData.strErrNoCompSel), rd_PrecomposeData.scriptName);
            return;
        }
        if (comp.selectedLayers.length < 1)
        {
            alert(rd_Precompose_localize(rd_PrecomposeData.strErrNoLayerSel), rd_PrecomposeData.scriptName);
            return;
        }
        
        // Build/show the user interface
        var rdpcPal = rd_Precompose_buildUI(thisObj);
        if (rdpcPal !== null)
        {
            rdpcPal.center();
            rdpcPal.show();
        }
    }
})(this);
