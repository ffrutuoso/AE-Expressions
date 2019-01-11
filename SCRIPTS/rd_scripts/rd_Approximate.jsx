// rd_Approximate.jsx
// Copyright (c) 2007-2013 redefinery (Jeffrey R. Almasol). All rights reserved.
// check it: www.redefinery.com
// 
// Name: rd_Approximate
// Version: 1.0
// 
// Description:
// This script creates, sets, or unsets proxies for the selected 
// footage and composition items.
// 
// If using a still or movie proxy, proxies will be rendered using 
// existing render settings and output module template, 
// preferably Best Settings / Photoshop for stills, 
// and Draft Settings / Lossless with Alpha for movies.
// 
// Note: If you want to use a still-frame or sequence proxy, make sure to set 
// the output module template to a still-image format. Conversely, 
// if you want to use a movie proxy, set the template to a movie file 
// format.
// 
// If using a file, you will be asked to select the file when you 
// click the Set Proxy button. If using stills or movies, you are 
// asked to select an output folder. Also, if using movies, you 
// can select to keep the proxy the same name as the source,
// but the source file's format must be the same as the selected 
// output module template's file format.
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




// rd_Approximate()
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
(function rd_Approximate(thisObj)
{
    // Globals
    
    var rd_ApproximateData = new Object();	// Store globals in an object
    rd_ApproximateData.scriptName = "rd: Approximate";
    rd_ApproximateData.scriptTitle = rd_ApproximateData.scriptName + " v1.0";
    
    rd_ApproximateData.strType = {en: "Proxy Type:"};
    rd_ApproximateData.strTypeOpts = {en: '["Still", "Movie", "File", "Placeholder", "Sequence"]'};
    rd_ApproximateData.strRSTemplate = {en: "Render Settings Template:"};
    rd_ApproximateData.strOMTemplate = {en: "Output Module Template:"};
    rd_ApproximateData.strRefresh = {en: "Refresh"};
    rd_ApproximateData.strOutFolder = {en: "Output Folder:"};
    rd_ApproximateData.strOutFolderBrowse = {en: "Browse..."};
    rd_ApproximateData.strOutName = {en: "Output Name Template:"}
    rd_ApproximateData.strUseSourceNameForProxy = {en: "Use source name for proxy"};
    rd_ApproximateData.strSetProxy = {en: "Set Proxy"};
    rd_ApproximateData.strSetProxyMore = {en: "Set Proxy..."};
    rd_ApproximateData.strUnsetProxy = {en: "Unset Proxy"};
    rd_ApproximateData.strFileTitle = {en: "Select the file to use as a proxy"};
    rd_ApproximateData.strSelectProxyFolder = {en: "Select the folder for storing rendered proxies."};
    rd_ApproximateData.strHelp = {en: "?"};
    rd_ApproximateData.strNoItemToProxy = {en: "Please select at least one footage or composition item, then try again."};
    rd_ApproximateData.strNoProxiedItemToUnset = {en: "Please select at least one proxied item, then try again."};
    rd_ApproximateData.strErrGetTpls = {en: "Couldn't retrieve the list of render settings and output module templates."};
    rd_ApproximateData.strErrRenameProxy = {en: "Could not rename proxy file to '%1'."};
    rd_ApproximateData.strMinAE100 = {en: "This script requires Adobe After Effects CS5 or later."};
    rd_ApproximateData.strHelpText = 
    {
        en: "Copyright (c) 2007-2013 redefinery (Jeffrey R. Almasol).\n" +
        "All rights reserved.\n" +
        "\n" +
        "This script creates, sets, or unsets proxies for the selected footage and composition items.\n" +
        "\n" +
        "If using a still or movie proxy, proxies will be rendered using existing render settings and output module template, preferably Best Settings / Photoshop for stills, and Draft Settings / Lossless with Alpha for movies.\n" +
        "\n" +
        "Note: If you want to use a still-frame or sequence proxy, make sure to set the output module template to a still-image format. Conversely, if you want to use a movie proxy, set the template to a movie file format.\n" + 
        "\n" + 
        "If using a file, you will be asked to select the file when you click the Set Proxy button. If using stills or movies, you are asked to select an output folder. Also, if using movies, you can select to keep the proxy the same name as the source, but the source file's format must be the same as the selected output module template's file format.\n" +
        "\n" +
        "Note: This version of the script requires After Effects CS5 or later. It can be used as a dockable panel by placing the script in a ScriptUI Panels subfolder of the Scripts folder, and then choosing this script from the Window menu."
    };
    
    
    
    
    // rd_Approximate_localize()
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
    function rd_Approximate_localize(strVar)
    {
        return strVar["en"];
    }
    
    
    
    
    // rd_Approximate_buildUI()
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
    function rd_Approximate_buildUI(thisObj)
    {
        var pal = (thisObj instanceof Panel) ? thisObj : new Window("palette", rd_ApproximateData.scriptName, undefined, {resizeable:true});
        
        if (pal !== null)
        {
            var res = 
            "group { \
                orientation:'column', alignment:['fill','top'], \
                header: Group { \
                    alignment:['fill','top'], \
                    title: StaticText { text:'" + rd_ApproximateData.scriptName + "', alignment:['fill','center'] }, \
                    help: Button { text:'" + rd_Approximate_localize(rd_ApproximateData.strHelp) +"', maximumSize:[30,20], alignment:['right','center'] }, \
                }, \
                r1: Group { \
                    alignment:['fill','top'], \
                    proxyType: StaticText { text:'" + rd_Approximate_localize(rd_ApproximateData.strType) + "' }, \
                    proxyTypeList: DropDownList { properties:{items:" + rd_Approximate_localize(rd_ApproximateData.strTypeOpts) + "}, alignment:['fill','top'], preferredSize:[-1,20] }, \
                }, \
                r4: Group { \
                    alignment:['fill','top'], \
                    r4left: Group { \
                        orientation:'column', alignment:['fill','center'], \
                        r4top: Group { \
                            alignment:['fill','top'], \
                            rsTpl: StaticText { text:'" + rd_Approximate_localize(rd_ApproximateData.strRSTemplate) + "' }, \
                            rsTplList: DropDownList { alignment:['fill','top'], alignment:['fill','top'], preferredSize:[-1,20] }, \
                        }, \
                        r4btm: Group { \
                            alignment:['fill','top'], \
                            omTpl: StaticText { text:'" + rd_Approximate_localize(rd_ApproximateData.strOMTemplate) + "' }, \
                            omTplList: DropDownList { alignment:['fill','top'], alignment:['fill','top'], preferredSize:[-1,20] }, \
                        }, \
                    }, \
                    refresh: Button { text:'" + rd_Approximate_localize(rd_ApproximateData.strRefresh) + "', alignment:['right','center'], preferredSize:[-1,20] }, \
                }, \
                r5: Group { \
                    alignment:['fill','top'], \
                    outFolder: StaticText { text:'" + rd_Approximate_localize(rd_ApproximateData.strOutFolder) + "' }, \
                    outFolderName: EditText { text:'', characters:20, alignment:['fill','top'], preferredSize:[-1,20] }, \
                    outFolderBrowse: Button { text:'" + rd_Approximate_localize(rd_ApproximateData.strOutFolderBrowse) + "', alignment:['right','top'], preferredSize:[-1,20] }, \
                }, \
                r6: Group { \
                    alignment:['fill','top'], \
                    outName: StaticText { text:'" + rd_Approximate_localize(rd_ApproximateData.strOutName) + "' }, \
                    outNameTpl: EditText { text:'[compName]_[layerName].[fileExtension]', characters:20, alignment:['fill','top'], preferredSize:[-1,20] }, \
                }, \
                r7: Group { \
                    alignment:['fill','top'], \
                    filler: StaticText { text:'' }, \
                    proxyNameSameAsSource: Checkbox { text:'" + rd_Approximate_localize( rd_ApproximateData.strUseSourceNameForProxy ) + "' }, \
                }, \
                cmds: Group { \
                    alignment:['right','top'], \
                    unsetProxyBtn: Button { text:'" + rd_Approximate_localize(rd_ApproximateData.strUnsetProxy) + "', preferredSize:[-1,20] }, \
                    setProxyBtn: Button { text:'" + rd_Approximate_localize(rd_ApproximateData.strSetProxy) + "', preferredSize:[-1,20] }, \
                }, \
            }";
            pal.grp = pal.add(res);
            
            pal.grp.r1.proxyType.preferredSize.width = 
                pal.grp.r4.r4left.r4btm.omTpl.preferredSize.width = 
                pal.grp.r5.outFolder.preferredSize.width = 
                pal.grp.r6.outName.preferredSize.width = 
                pal.grp.r7.filler.preferredSize.width = 
                pal.grp.r4.r4left.r4top.rsTpl.preferredSize.width;
            
            pal.grp.r4.r4left.r4btm.margins.top -= 5;
            pal.grp.cmds.margins.top += 5;
            
            pal.layout.layout(true);
            pal.grp.minimumSize = pal.grp.size;
            pal.layout.resize();
            pal.onResizing = pal.onResize = function () {this.layout.resize();}
            
            pal.grp.r1.proxyTypeList.selection = 0;
            pal.grp.r1.proxyTypeList.onChange = function ()
            {
                var proxyType = this.selection.index;
                
                if ((proxyType === 0) || (proxyType === 4))	// Still or Sequence
                {
                    // Try to auto-match a Best Settings RS / Photoshop OM template
                    var listItems = this.parent.parent.r4.r4left.r4top.rsTplList;
                    for (var i=0; i<listItems.items.length; i++)
                    {
                        if (listItems.items[i].text === "Best Settings")
                        {
                            listItems.selection = i;
                            break;
                        }
                    }
                    
                    listItems = this.parent.parent.r4.r4left.r4btm.omTplList;
                    for (var i=0; i<listItems.items.length; i++)
                    {
                        if (listItems.items[i].text === "Photoshop")
                        {
                            listItems.selection = i;
                            break;
                        }
                    }
                    
                    this.parent.parent.r6.outNameTpl.text = "[compName]_[#####].[fileExtension]";
                }
                else if (proxyType === 1)	// Movie
                {
                    // Try to auto-match a Draft Settings RS / Lossless with Alpha OM template
                    var listItems = this.parent.parent.r4.r4left.r4top.rsTplList;
                    for (var i=0; i<listItems.items.length; i++)
                    {
                        if (listItems.items[i].text === "Draft Settings")
                        {
                            listItems.selection = i;
                            break;
                        }
                    }
                    
                    listItems = this.parent.parent.r4.r4left.r4btm.omTplList;
                    for (var i=0; i<listItems.items.length; i++)
                    {
                        if (listItems.items[i].text === "Lossless with Alpha")
                        {
                            listItems.selection = i;
                            break;
                        }
                    }
                    
                    this.parent.parent.r6.outNameTpl.text = "[compName].[fileExtension]";
                }
                
                // Using a proxy file name the same as source is appropriate only for Movie mode
                this.parent.parent.r7.proxyNameSameAsSource.enabled = (proxyType === 1);
                
                // Enable or disable controls as appropriate
                var enableCtrls = ((proxyType === 0) || (proxyType === 1) || (proxyType === 4));
                this.parent.parent.r4.enabled = this.parent.parent.r5.enabled = this.parent.parent.r6.enabled = enableCtrls;					
                
                this.parent.parent.cmds.setProxyBtn.text = (proxyType === 2) ? rd_Approximate_localize(rd_ApproximateData.strSetProxyMore) : rd_Approximate_localize(rd_ApproximateData.strSetProxy);
            }
            
            pal.grp.r4.refresh.onClick = function ()
            {
                rd_Approximate_doRefreshTemplates(this.parent.parent.parent);
            }
            pal.grp.r5.outFolderBrowse.onClick = function ()
            {
                var defaultFolder = this.parent.outFolderName.text;
                if ((defaultFolder === "") && (app.project.file !== null))
                {
                    // Default to the current folder of the project file, so it's easier to create a subfolder for proxies next to the project file.
                    defaultFolder = app.project.file.path;
                }
                if ($.os.indexOf("Windows") !== -1)				// On Windows, escape backslashes first
                    defaultFolder = defaultFolder.replace("\\", "\\\\");
                
                var folder = Folder.selectDialog("Output To Folder", defaultFolder);
                if (folder !== null)
                    this.parent.outFolderName.text = folder.fsName;
            }
            
            pal.grp.r7.proxyNameSameAsSource.onClick = function ()
            {
                this.parent.parent.r6.outNameTpl.enabled = !this.value;
            }
            
            pal.grp.header.help.onClick = function () {alert(rd_ApproximateData.scriptTitle + "\n" + rd_Approximate_localize(rd_ApproximateData.strHelpText), rd_ApproximateData.scriptName);}
            pal.grp.cmds.unsetProxyBtn.onClick = rd_Approximate_doUnsetProxy;
            pal.grp.cmds.setProxyBtn.onClick = rd_Approximate_doApproximate;
            
            pal.grp.cmds.margins.top += 5;
        }
        
        return pal;
    }
    
    
    
    
    // rd_Approximate_doRefreshTemplates()
    // 
    // Description:
    // This callback function rescans the render settings and output module templates,
    // updating the user interface.
    // 
    // Parameters:
    //   pal - Window object representing the palette.
    // 
    // Returns:
    // Nothing.
    // 
    function rd_Approximate_doRefreshTemplates(pal)
    {
        var tempComp = app.project.items.addComp("tempComp", 4, 4, 1.0, 1.0, 30);
        if ((tempComp === null) || !(tempComp instanceof CompItem))
        {
            alert(rd_Approximate_localize(rd_ApproximateData.strErrGetTpls));
            return;
        }
        
        pal.grp.r4.r4left.r4top.rsTplList.selection = null;
        pal.grp.r4.r4left.r4top.rsTplList.removeAll();

        pal.grp.r4.r4left.r4btm.omTplList.selection = null;
        pal.grp.r4.r4left.r4btm.omTplList.removeAll();
        
        // Get the list of render settings and output module templates
        // (Need to add a dummy comp to the render queue to do this)
        var rqi = app.project.renderQueue.items.add(tempComp);
        var om = rqi.outputModule(1);								// Assumes at least one output module
        
        for (var i=0; i<rqi.templates.length; i++)
            if (rqi.templates[i].indexOf("_HIDDEN") !== 0)			// Don't add hidden templates, like for X-Factor
                pal.grp.r4.r4left.r4top.rsTplList.add("item", rqi.templates[i]);
        for (var i=0; i<om.templates.length; i++)
            if (om.templates[i].indexOf("_HIDDEN") !== 0)			// Don't add hidden templates, like for X-Factor
                pal.grp.r4.r4left.r4btm.omTplList.add("item", om.templates[i]);
        
        if (rqi.templates.length > 0)								// Select the first template in the list, if there is at least one
            pal.grp.r4.r4left.r4top.rsTplList.selection = 0;
        if (om.templates.length > 0)
            pal.grp.r4.r4left.r4btm.omTplList.selection = 0;
        
        rqi.remove();												// Remove the temp render queue item
        
        tempComp.remove();									// Remove the temp comp
    }
    
    
    
    
    // rd_Approximate_doUnsetProxy()
    // 
    // Description:
    // This callback function unsets all selected footage/comp items to no proxy.
    // 
    // Parameters:
    // None.
    // 
    // Returns:
    // Nothing.
    //
    function rd_Approximate_doUnsetProxy()
    {
        // Check that there's at least one selected footage or comp item
        var selItems = new Array();
        for (var i=0; i<app.project.selection.length; i++)
        {
            if ((app.project.selection[i] instanceof FootageItem) || (app.project.selection[i] instanceof CompItem))
                if (app.project.selection[i].proxySource !== null)
                    selItems[selItems.length] = app.project.selection[i];
        }
        if (selItems.length === 0)
        {
            alert(rd_Approximate_localize(rd_ApproximateData.strNoProxiedItemToUnset), rd_ApproximateData.scriptName);
            return;
        }
        
        // Encapsulate all operations into a single undo event
        app.beginUndoGroup(rd_ApproximateData.scriptName);
        
        // Loop through the selected items, skipping those that don't have a proxy
        for (var i=0; i<selItems.length; i++)
        {
            selItems[i].setProxyToNone();
        }
        
        app.endUndoGroup();
    }
    
    
    
    
    // rd_Approximate_doApproximate()
    // 
    // Description:
    // This callback function performs the main operation of creating the proxies.
    // 
    // Parameters:
    // None.
    // 
    // Returns:
    // Nothing.
    //
    function rd_Approximate_doApproximate()
    {
        // Check that there's at least one selected footage or comp item
        var selItems = new Array();
        for (var i=0; i<app.project.selection.length; i++)
        {
            if ((app.project.selection[i] instanceof FootageItem) || (app.project.selection[i] instanceof CompItem))
                selItems[selItems.length] = app.project.selection[i];
        }
        if (selItems.length === 0)
        {
            alert(rd_Approximate_localize(rd_ApproximateData.strNoItemToProxy), rd_ApproximateData.scriptName);
            return;
        }
        
        var typeList = this.parent.parent.r1.proxyTypeList.selection;
        var rsTpl = this.parent.parent.r4.r4left.r4top.rsTplList.selection;
        var omTpl = this.parent.parent.r4.r4left.r4btm.omTplList.selection;
        var renameProxy = this.parent.parent.r7.proxyNameSameAsSource.value;
        
        // If using still or moving footage proxy, specify output folder
        if ((typeList === 0) || (typeList === 1) || (typeList === 4))	// Still, Movie, Sequence
        {
            var outFolder = new Folder(this.parent.parent.r5.outFolderName.text);
            var outFName = this.parent.parent.r6.outNameTpl.text;
            if ((outFolder === null) || !outFolder.exists)
            {
                alert(rd_Approximate_localize(rd_ApproximateData.strSelectProxyFolder), rd_ApproximateData.scriptName);
                return;
            }
        }
        else if (typeList === 2)		// File
        {
            // If using a file as proxy, select it
            var proxyFile = File.openDialog(rd_Approximate_localize(rd_ApproximateData.strFileTitle));
            if ((proxyFile === null) || !proxyFile.exists)
                return;
        }
        else if (typeList === 3)		// Placeholder
        {}
        
        // Loop through the selected items that can be proxied
        if ((typeList === 0) || (typeList === 1) || (typeList === 4))	// Still, Movie, Sequence
        {
            try
            {
                // Create a temp folder for the temp comps used for the selected items
                var tempFolder = app.project.items.addFolder(rd_ApproximateData.scriptName + " comps");
                
                // Add each item to its own temp comp, then to the render queue
                var tempComp, tempItem, rqi, om;
                var rqiList = new Array();
                for (var i=0; i<selItems.length; i++)
                {
                    tempItem = selItems[i];
                    if (tempItem.duration === 0)
                    {
                        // Check if a still
                        if ((tempItem.mainSource !== null) && tempItem.mainSource.isStill)
                            tempComp = app.project.items.addComp(tempItem.name, tempItem.width, tempItem.height, tempItem.pixelAspect, 1/30, 30);
                        else
                            tempComp = app.project.items.addComp(tempItem.name, tempItem.width, tempItem.height, tempItem.pixelAspect, tempItem.duration, tempItem.frameRate);
                    }
                    else
                        tempComp = app.project.items.addComp(tempItem.name, tempItem.width, tempItem.height, tempItem.pixelAspect, tempItem.duration, tempItem.frameRate);
                    tempComp.parentFolder = tempFolder;
                    
                    tempComp.layers.add(tempItem);
                    
                    rqi = app.project.renderQueue.items.add(tempComp);
                    rqi.applyTemplate(rsTpl);
                    if (typeList === 0)	// Still
                    {
                        // For still proxies, set to the current frame for the item (which can be set in the Footage panel
                        rqi.timeSpanStart = tempItem.time;
                        rqi.timeSpanDuration = ((tempItem.frameRate !== 0) ? tempItem.frameDuration : 1/30);
                    }
                    om = rqi.outputModule(1);
                    om.applyTemplate(omTpl);
                    om.file = new File(outFolder.fsName + "/" + outFName);
                    
                    rqiList[rqiList.length] = {"rqItem":rqi, "itemNum":i};
                }
                
                // Render
                app.project.renderQueue.render();
            }
            catch (e)
            {
                alert(e, rd_ApproximateData.scriptName);
            }
            finally
            {
                var renderedFile;
                for (var i=0; i<rqiList.length; i++)
                {
                    renderedFile = new File(rqiList[i].rqItem.outputModule(1).file.fsName.replace("[#####]", "00000"));
                    
                    if ((typeList === 1) && renameProxy && (selItems[i].file !== null))	// Rename proxy movie based on source footage, if requested
                    {
                        if (!renderedFile.rename(selItems[i].file.name))
                        {
                            var tempStr = rd_localize(rd_ApproximateData.strErrRenameProxy).replace("%1", selItems[i].file.name);
                            alert(tempStr, rd_ApproximateData.scriptName);
                        }
                    }
                    
                    if ((renderedFile !== null) && renderedFile.exists)
                    {
                        if (typeList === 4)
                        {
                            selItems[rqiList[i].itemNum].setProxyWithSequence(renderedFile, false);
                        }
                        else
                        {
                            selItems[rqiList[i].itemNum].setProxy(renderedFile);
                        }
                    }
                }
                
                if (tempFolder)
                    tempFolder.remove();
            }
            
            // For some reason, the undo stack isn't set up correctly if I wrap this stuff into an undo group, so purge the undo cache just to be safe. :-(
            app.purge(PurgeTarget .UNDO_CACHES);
        }
        else if (typeList === 2)		// File
        {
            // Encapsulate all operations into a single undo event
            app.beginUndoGroup(rd_ApproximateData.scriptName);
            
            var tempItem;
            for (var i=0; i<selItems.length; i++)
            {
                tempItem = selItems[i];
                try
                {
                    tempItem.setProxy(proxyFile);
                }
                catch (e)
                {
                    break;
                }
            }
            
            app.endUndoGroup();
        }
        else if (typeList === 3)		// Placeholder
        {
            // Encapsulate all operations into a single undo event
            app.beginUndoGroup(rd_ApproximateData.scriptName);
            
            var tempItem, tempDur, tempFPS;
            for (var i=0; i<selItems.length; i++)
            {
                tempItem = selItems[i];
                
                tempDur = tempItem.duration;
                if (tempDur === 0)
                    tempDur = 30;
                
                tempFPS = tempItem.frameRate;
                if (tempFPS === 0)
                    tempFPS = 30;
                
                tempItem.setProxyWithPlaceholder(tempItem.name, tempItem.width, tempItem.height, tempFPS, tempDur);
            }
            
            app.endUndoGroup();
        }
    }		
    
    
    
    
    // main code:
    //
    
    // Prerequisites check
    if (parseFloat(app.version) < 10.0)
        alert(rd_Approximate_localize(rd_ApproximateData.strMinAE100), rd_ApproximateData.scriptName);
    else
    {
        var activeComp = app.project.activeItem;
        
        // Build and show the palette
        var rdapPal  = rd_Approximate_buildUI(thisObj);
        if (rdapPal !== null)
        {
            // Get the list of render settings and output module templates
            rd_Approximate_doRefreshTemplates(rdapPal);
            rdapPal.grp.r1.proxyTypeList.notify("onChange");	// Simulate selecting the default option
            
            // Use the last defined folder hierarchy (saved in the After Effects preferences file), if it exists
            if (app.settings.haveSetting("redefinery", "rd_Approximate_proxyTypeList"))
            {
                rdapPal.grp.r1.proxyTypeList.selection = parseInt(app.settings.getSetting("redefinery", "rd_Approximate_proxyTypeList"));
            }
            if (app.settings.haveSetting("redefinery", "rd_Approximate_rsTplList"))
            {
                rdapPal.grp.r4.r4left.r4top.rsTplList.selection = parseInt(app.settings.getSetting("redefinery", "rd_Approximate_rsTplList"));
            }
            if (app.settings.haveSetting("redefinery", "rd_Approximate_omTplList"))
            {
                rdapPal.grp.r4.r4left.r4btm.omTplList.selection = parseInt(app.settings.getSetting("redefinery", "rd_Approximate_omTplList"));
            }
            if (app.settings.haveSetting("redefinery", "rd_Approximate_outFolderName"))
            {
                rdapPal.grp.r5.outFolderName.text = app.settings.getSetting("redefinery", "rd_Approximate_outFolderName").toString();
            }
            if (app.settings.haveSetting("redefinery", "rd_Approximate_outNameTpl"))
            {
                rdapPal.grp.r6.outNameTpl.text = app.settings.getSetting("redefinery", "rd_Approximate_outNameTpl").toString();
            }
            if (app.settings.haveSetting("redefinery", "rd_Approximate_proxyNameSameAsSource"))
            {
                rdapPal.grp.r7.proxyNameSameAsSource.value = eval(app.settings.getSetting("redefinery", "rd_Approximate_proxyNameSameAsSource"));
            }
            
            // Save current folder hierarchy upon closing the palette
            rdapPal.onClose = function()
            {
                app.settings.saveSetting("redefinery", "rd_Approximate_proxyTypeList", rdapPal.grp.r1.proxyTypeList.selection.index.toString());
                app.settings.saveSetting("redefinery", "rd_Approximate_rsTplList", rdapPal.grp.r4.r4left.r4top.rsTplList.selection.index.toString());
                app.settings.saveSetting("redefinery", "rd_Approximate_omTplList", rdapPal.grp.r4.r4left.r4btm.omTplList.selection.index.toString());
                app.settings.saveSetting("redefinery", "rd_Approximate_outFolderName", rdapPal.grp.r5.outFolderName.text);
                app.settings.saveSetting("redefinery", "rd_Approximate_outNameTpl", rdapPal.grp.r6.outNameTpl.text);
                app.settings.saveSetting("redefinery", "rd_Approximate_proxyNameSameAsSource", rdapPal.grp.r7.proxyNameSameAsSource.value.toString());
            }
            
            if (rdapPal instanceof Window)
            {
                // Show the palette
                rdapPal.center();
                rdapPal.show();
            }
            else
                rdapPal.layout.layout(true);
        }
    }
})(this);
