// rd_GimmePropInfo.jsx
// Copyright (c) 2006-2014 redefinery (Jeffrey R. Almasol). All rights reserved.
// check it: www.redefinery.com
// 
// Name: rd_GimmePropInfo
// Version: 0.9
// 
// Description:
// This script displays a selected property's information useful for
// script authors.
// 
// Select only a single property or property group; selection of some
// properties also select the parent property group, which is fine.
// Selection of multiple properties or property groups at the same
// property depth are not allowed. However, for multiple properties or
// property groups of different depths, the deepest property or property
// group will be used.
// 
// For keyframed properties, you can browse keyframes using the Key Info
// slider.
// 
// Note: This version of the script requires After Effects CS6 
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




// rd_GimmePropInfo()
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
(function rd_GimmePropInfo(thisObj)
{
	// Globals
	
	var rd_GimmePropInfoData = new Object();	// Store globals in an object
	rd_GimmePropInfoData.scriptName = "rd: Gimme Prop Info";
	rd_GimmePropInfoData.scriptTitle = rd_GimmePropInfoData.scriptName + " v0.9";
	rd_GimmePropInfoData.strIdStatus = {en: "Identification / Status"};
	rd_GimmePropInfoData.strValue = {en: "Value"};
	rd_GimmePropInfoData.strExprValue = {en: "Expression"};
	rd_GimmePropInfoData.strKeys = {en: "Keys"};
	rd_GimmePropInfoData.strKeyInfo = {en: "Key Info     "};
	rd_GimmePropInfoData.strKeyMofN = {en: " of "};
	rd_GimmePropInfoData.strGetPropInfo = {en: "Get Property Info"};
	rd_GimmePropInfoData.strHelp = {en: "?"};
	rd_GimmePropInfoData.strErrNoCompSel = {en: "Cannot perform operation. Please select or open a single composition in the Project window, and try again."};
	rd_GimmePropInfoData.strErrNoSinglePropSel = {en: "Cannot perform operation. Please select only one property or property group, and try again."};
	rd_GimmePropInfoData.strMinAE110 = {en: "This script requires Adobe After Effects CS6 or later."};
	rd_GimmePropInfoData.strErrExprNotFunc = {en: "NOT FUNCTIONAL"};
	rd_GimmePropInfoData.strHelpText = 
	{
		en: "Copyright (c) 2006-2014 redefinery (Jeffrey R. Almasol). \n" +
		"All rights reserved.\n" +
		"\n" +
		"This script displays a selected property's information useful for script authors.\n" +
		"\n" +
		"Select only a single property or property group; selection of some properties also select the parent property group, which is fine. Selection of multiple properties or property groups at the same property depth are not allowed. However, for multiple properties or property groups of different depths, the deepest property or property group will be used.\n" +
		"\n" +
		"For keyframed properties, you can browse keyframes using the Key Info slider.\n" +
		"\n" +
		"Note: This version of the script requires After Effects CS6 or later. It can be used as a dockable panel by placing the script in a ScriptUI Panels subfolder of the Scripts folder, and then choosing this script from the Window menu."
	};
	
	rd_GimmePropInfoData.propertyTypeMappings =
	{
		5812: "PropertyType.PROPERTY (" + PropertyType.PROPERTY + ")",
		5814: "PropertyType.INDEXED_GROUP (" + PropertyType.INDEXED_GROUP + ")",
		5813: "PropertyType.NAMED_GROUP (" + PropertyType.NAMED_GROUP + ")",
	};
	
	rd_GimmePropInfoData.propertyValueTypeMappings =
	{
		6012: "PropertyValueType.NO_VALUE (" + PropertyValueType.NO_VALUE + ")",
		6013: "PropertyValueType.ThreeD_SPATIAL (" + PropertyValueType.ThreeD_SPATIAL + ")",
		6014: "PropertyValueType.ThreeD (" + PropertyValueType.ThreeD + ")",
		6015: "PropertyValueType.TwoD_SPATIAL (" + PropertyValueType.TwoD_SPATIAL + ")",
		6016: "PropertyValueType.TwoD (" + PropertyValueType.TwoD + ")",
		6017: "PropertyValueType.OneD (" + PropertyValueType.OneD + ")",
		6018: "PropertyValueType.COLOR (" + PropertyValueType.COLOR + ")",
		6019: "PropertyValueType.CUSTOM_VALUE (" + PropertyValueType.CUSTOM_VALUE + ")",
		6020: "PropertyValueType.MARKER (" + PropertyValueType.MARKER + ")",
		6021: "PropertyValueType.LAYER_INDEX (" + PropertyValueType.LAYER_INDEX + ")",
		6022: "PropertyValueType.MASK_INDEX (" + PropertyValueType.MASK_INDEX + ")",
		6023: "PropertyValueType.SHAPE (" + PropertyValueType.SHAPE + ")",
		6024: "PropertyValueType.TEXT_DOCUMENT (" + PropertyValueType.TEXT_DOCUMENT + ")",
	};
	
	rd_GimmePropInfoData.keyInterpTypeMappings =
	{
		6212: "KeyframeInterpolationType.LINEAR (" + KeyframeInterpolationType.LINEAR + ")",
		6213: "KeyframeInterpolationType.BEZIER (" + KeyframeInterpolationType.BEZIER + ")",
		6214: "KeyframeInterpolationType.HOLD (" + KeyframeInterpolationType.HOLD + ")",
	};
	
	
	
	
	// rd_GimmePropInfo_localize()
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
	function rd_GimmePropInfo_localize(strVar)
	{
		return strVar["en"];
	}
	
	
	
	
	// rd_GimmePropInfo_buildUI()
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
	function rd_GimmePropInfo_buildUI(thisObj)
	{
		var pal = (thisObj instanceof Panel) ? thisObj : new Window("palette", rd_GimmePropInfoData.scriptName, undefined, {resizeable:true});
		
		if (pal !== null)
		{
			var res = 
			"""group {
				orientation:'column', alignment:['fill','fill'],
				header: Group {
					alignment:['fill','top'],
					title: StaticText { text:'""" + rd_GimmePropInfoData.scriptName + """', alignment:['fill','center'] },
					help: Button { text:'""" + rd_GimmePropInfo_localize(rd_GimmePropInfoData.strHelp) + """', maximumSize:[30,20], alignment:['right','center'] },
				},
				body: Group {
					alignment:['fill','fill'], alignChildren:['left','center'], orientation:'row',
					ident: Group {
						alignment:['fill','fill'], orientation:'column', spacing:2,
						lb: StaticText { text:'""" + rd_GimmePropInfo_localize(rd_GimmePropInfoData.strIdStatus) + """', alignment:['left','top'] }, 
						et: EditText { text:'', properties:{multiline:true}, alignment:['fill','fill'], preferredSize:[300,400] },
					},
					val: Group {
						alignment:['fill','fill'], orientation:'column', spacing:2,
						lb: StaticText { text:'""" + rd_GimmePropInfo_localize(rd_GimmePropInfoData.strValue) + """', alignment:['left','top'] }, 
						et: EditText { text:'', properties:{multiline:true}, alignment:['fill','top'], preferredSize:[300,300] },
						lb2: StaticText { text:'""" + rd_GimmePropInfo_localize(rd_GimmePropInfoData.strExprValue) + """', alignment:['left','top'] }, 
						et2: EditText { text:'', properties:{multiline:true}, alignment:['fill','fill'], preferredSize:[300,100] },
					},
					keys: Group {
						alignment:['fill','fill'], orientation:'column', spacing:2,
						lb: StaticText { text:'""" + rd_GimmePropInfo_localize(rd_GimmePropInfoData.strKeys) + """', alignment:['left','top'] }, 
						et: EditText { text:'', properties:{multiline:true}, alignment:['fill','top'], preferredSize:[300,50] },
						head: Group {
							alignment:['fill','top'], orientation:'row',
							lb2: StaticText { text:'""" + rd_GimmePropInfo_localize(rd_GimmePropInfoData.strKeyInfo) + """', alignment:['left','top'] }, 
							sl: Slider { value:1, minvalue:1, maxvalue:1, alignment:['fill','top'], preferredSize:[-1,20] }, 
							mofn: StaticText { text:'', characters:4, alignment:['right','top'] }, 
						},
						et2: EditText { text:'', properties:{multiline:true}, alignment:['fill','fill'], preferredSize:[300,350] },
					},
				},
				cmds: Group {
					alignment:['fill','bottom'],
					getPropPathBtn: Button { text:'""" + rd_GimmePropInfo_localize(rd_GimmePropInfoData.strGetPropInfo) + """', alignment:['right','top'], preferredSize:[-1,20] },
				},
			}
			""";
			pal.grp = pal.add(res);
			
			pal.layout.layout(true);
			pal.grp.minimumSize = pal.grp.size;
			pal.layout.resize();
			pal.onResizing = pal.onResize = function () {this.layout.resize();}
			
			pal.grp.body.keys.head.sl.onChange = pal.grp.body.keys.head.sl.onChanging = function ()
			{
				var val = parseInt(this.value);
				var prop = rd_GimmePropInfoData.lastQueriedProp;
				var inSpatialStr, outSpatialStr, inEase, outEase, rovingStr, spatialABStr, spatialContrStr, bezStr;
				
				this.value = val;
				
				this.parent.mofn.text = val.toString();
				
				// jump to key time (might not be exact for roving keys)
				//var comp = prop.propertyGroup(prop.propertyDepth).containingComp;
				//comp.time = prop.keyTime(val);
				
				if ((prop.propertyValueType === PropertyValueType.TwoD_SPATIAL) || (prop.propertyValueType === PropertyValueType.ThreeD_SPATIAL))
				{
					inSpatialStr = prop.keyInSpatialTangent(val).toString();
					outSpatialStr = prop.keyOutSpatialTangent(val).toString();
					rovingStr = prop.keyRoving(val).toString();
					spatialABStr = prop.keySpatialAutoBezier(val).toString();
					spatialContrStr = prop.keySpatialContinuous(val).toString();
				}
				else
				{
					inSpatialStr = "n/a";
					outSpatialStr = "n/a";
					rovingStr = "n/a";
					spatialABStr = "n/a";
					spatialContrStr = "n/a";
				}
				
				if ((prop.keyInInterpolationType(val) === KeyframeInterpolationType.BEZIER) && (prop.keyOutInterpolationType(val) === KeyframeInterpolationType.BEZIER))
				{
					bezStr = "keyTemporalAutoBezier: " + prop.keyTemporalAutoBezier(val).toString() + "\n" +
						"keyTemporalContinuous: " + prop.keyTemporalContinuous(val).toString() + "\n";
				}
				else
				{
					bezStr = "keyTemporalAutoBezier: n/a\n" +
						"keyTemporalContinuous: n/a\n";
				}
				
				inEase = "keyInTemporalEase: ";
				outEase = "keyOutTemporalEase: ";
				if (prop.keyOutInterpolationType(val) !== KeyframeInterpolationType.HOLD)
				{
					inEase += "\n";
					outEase += "\n";
					for (var i=0; i<prop.keyInTemporalEase(val).length; i++)
					{
						inEase += "    [" + i + "] speed: " + prop.keyInTemporalEase(val)[i].speed.toString() + "\n" +
							"    [" + i + "] influence: " + prop.keyInTemporalEase(val)[i].influence.toString() + "\n";	
						outEase += "    [" + i + "] speed: " + prop.keyOutTemporalEase(val)[i].speed.toString() + "\n" +
							"    [" + i + "] influence: " + prop.keyOutTemporalEase(val)[i].influence.toString() + "\n";	
					}
				}
				else
				{
					inEase += "n/a\n";
					outEase += "n/a\n";
				}
				
				this.parent.parent.et2.text = 
					"keySelected: " + prop.keySelected(val) + "\n" +
					"\n" +
					"keyTime: " + prop.keyTime(val) + "\n" +
					"keyValue: " + prop.keyValue(val).toString() + "\n" +
					"\n" +
					"keyInInterpolationType: \n" + 
					"    " + rd_GimmePropInfoData.keyInterpTypeMappings[prop.keyInInterpolationType(val)] + "\n" +
					"keyInSpatialTangent: " + inSpatialStr + "\n" +
					inEase +
					"keyOutInterpolationType: \n" + 
					"    " + rd_GimmePropInfoData.keyInterpTypeMappings[prop.keyOutInterpolationType(val)] + "\n" +
					"keyOutSpatialTangent: " + outSpatialStr + "\n" +
					outEase +
					"\n" +
					"keyRoving: " + rovingStr + "\n" +
					"\n" +
					"keySpatialAutoBezier: " + spatialABStr + "\n" +
					"keySpatialContinuous: " + spatialContrStr + "\n" +
					"\n" +
					bezStr;
			}
			
			pal.grp.header.help.onClick = function () {alert(rd_GimmePropInfoData.scriptTitle + "\n" + rd_GimmePropInfo_localize(rd_GimmePropInfoData.strHelpText), rd_GimmePropInfoData.scriptName);}
			pal.grp.cmds.getPropPathBtn.onClick = rd_GimmePropInfo_doGetPropInfo;
		}
		
		return pal;
	}
	
	
	
	
	// rd_GimmePropInfo_doGetPropInfo()
	// 
	// Description:
	// This callback function retrieves the currently selected property or property
	// group, and displays scripting-baed info about it.
	// 
	// Parameters:
	// None.
	// 
	// Returns:
	// Nothing.
	//
	function rd_GimmePropInfo_doGetPropInfo()
	{
		// rd_GimmePropInfo_findDeepestSelectedProp()
		// 
		// Description:
		// This function determines the deepest selected property or property group.
		// Assumes a single composition is selected or active.
		// 
		// Parameters:
		// None
		// 
		// Returns:
		// Property or PropertyGroup object if successful; null if no property or
		// property group, or if multiple of them, are selected.
		// 
		function rd_GimmePropInfo_findDeepestSelectedProp()
		{
			var comp = app.project.activeItem;
			var deepestProp, numDeepestProps = 0, deepestPropDepth = 0;
			var prop;
			
			for (var i=0; i<comp.selectedProperties.length; i++)
			{
				prop = comp.selectedProperties[i];
				
				if (prop.propertyDepth >= deepestPropDepth)
				{
					if (prop.propertyDepth > deepestPropDepth)
						numDeepestProps = 0;
					deepestProp = prop;
					numDeepestProps++;
					deepestPropDepth = prop.propertyDepth;
				}
				else
					continue;
			}
			
			return (numDeepestProps > 1) ? null : deepestProp;
		}
		
		
		var prop;
		var rootObj;
		
		// Check that a single comp is selected or active
		if ((app.project.activeItem === null) || !(app.project.activeItem instanceof CompItem))
		{
			alert(rd_GimmePropInfo_localize(rd_GimmePropInfoData.strErrNoCompSel), rd_GimmePropInfoData.scriptName);
			return;
		}
		
		// Check that a single deep property is selected
		prop = rd_GimmePropInfo_findDeepestSelectedProp();
		if (!prop || (prop === null))
		{
			alert(rd_GimmePropInfo_localize(rd_GimmePropInfoData.strErrNoSinglePropSel), rd_GimmePropInfoData.scriptName);
			return;
		}
		rd_GimmePropInfoData.lastQueriedProp = prop;
		
		//alert("deepest prop/group = '"+prop.name+"' (depth="+prop.propertyDepth+")");
		
		
		
		this.parent.parent.body.ident.et.text =
			"name: " + prop.name + "\n" +
			"matchName: " + prop.matchName + "\n" +
			"propertyType: \n" +
			"    " + rd_GimmePropInfoData.propertyTypeMappings[prop.propertyType] + "\n" +
			"\n" +
			"active: " + prop.active.toString() + "\n" +
			"\n" +
			"enabled: " + prop.enabled.toString() + "\n" +
			"canSetEnabled: " + prop.canSetEnabled.toString() + "\n" +
			"\n" +
			"elided: " + prop.elided.toString() + "\n" +
			"selected: " + prop.selected.toString() + "\n" +
			"\n" +
			"isEffect: " + prop.isEffect.toString() + "\n" +
			"isMask: " + prop.isMask.toString() + "\n" +
			"\n" +
			"isModified: " + prop.isModified.toString() + "\n" +
			"\n" +
			"parentProperty: " + prop.parentProperty.toString() + " (" + prop.parentProperty.name + ")\n" +
			"propertyDepth: " + prop.propertyDepth + "\n" +
			"propertyIndex: " + prop.propertyIndex + "\n" +
			"\n" +
			"numProperties: " + prop.numProperties + "\n";
		if (prop.propertyType === PropertyType.PROPERTY)
		{
			this.parent.parent.body.val.et.text =
				"value: " + prop.value.toString() + "\n" +
				"propertyValueType: \n" + 
				"    " + rd_GimmePropInfoData.propertyValueTypeMappings[prop.propertyValueType] + "\n" +
				"\n" +
				"hasMin: " + prop.hasMin.toString() + "\n" +
				"minValue: " + (prop.hasMin ? prop.minValue.toString() : "n/a") + "\n" +
				"hasMax: " + prop.hasMax.toString() + "\n" +
				"maxValue: " + (prop.hasMax ? prop.maxValue.toString() : "n/a") + "\n" +
				"\n" +
				"isSpatial: " + prop.isSpatial.toString() + "\n" +
				"\n" +
				"canVaryOverTime: " + prop.canVaryOverTime.toString() + "\n" +
				"isTimeVarying: " + prop.isTimeVarying.toString() + "\n" +
				"\n" +
				"dimensionsSeparated: " + prop.dimensionsSeparated.toString() + "\n" + 
				"separationDimension: " + (prop.dimensionsSeparated ? prop.separationDimension.toString() : "n/a") + "\n" +
				"isSeparationFollower: " + (prop.dimensionsSeparated ? prop.isSeparationFollower.toString() : "n/a") + "\n" +
				"isSeparationLeader: " + (prop.dimensionsSeparated ? prop.isSeparationLeader.toString() : "n/a") + "\n" +
				"separationLeader: " + (prop.dimensionsSeparated ? prop.separationLeader.toString() : "n/a") + "\n";
			this.parent.parent.body.val.et2.text =
				"expression: " + prop.expression + "\n" +
				"\n" +
				"expressionEnabled: " + prop.expressionEnabled + "\n" +
				"expressionError: " + prop.expressionError + "\n" +
				"canSetExpression: " + prop.canSetExpression.toString() + "\n";
			this.parent.parent.body.keys.et.text =
				"numKeys: " + prop.numKeys + "\n" +
				"selectedKeys (length): " + prop.selectedKeys.length + "\n" +
				"\n";
			
			if (prop.numKeys > 0)
			{
				this.parent.parent.body.keys.head.lb2.enabled = this.parent.parent.body.keys.et2.enabled =
					this.parent.parent.body.keys.head.mofn.enabled = this.parent.parent.body.keys.head.sl.enabled = true;
				
				this.parent.parent.body.keys.head.mofn.text = "1";
				this.parent.parent.body.keys.head.sl.value = 1;
				this.parent.parent.body.keys.head.sl.maxvalue = prop.numKeys;
			}
			else
			{
				this.parent.parent.body.keys.head.lb2.enabled = this.parent.parent.body.keys.et2.enabled =
					this.parent.parent.body.keys.head.mofn.enabled = this.parent.parent.body.keys.head.sl.enabled = false;
				
				this.parent.parent.body.keys.head.mofn.text = "";
				this.parent.parent.body.keys.head.sl.value = 1;
				this.parent.parent.body.keys.head.sl.maxvalue = 1;				
				this.parent.parent.body.keys.et2.text = "n/a";
			}
			this.parent.parent.body.keys.head.sl.notify("onChange");
		}
		else
		{
			this.parent.parent.body.val.et.text = this.parent.parent.body.val.et2.text = this.parent.parent.body.keys.et.text = this.parent.parent.body.keys.et2.text = "n/a";
		}
		this.parent.parent.body.val.enabled = this.parent.parent.body.keys.enabled = (prop.propertyType === PropertyType.PROPERTY);
	}
	
	
	
	
	// main code:
	//
	
	// Prerequisites check
	if (parseFloat(app.version) < 11.0)
		alert(rd_GimmePropInfo_localize(rd_GimmePropInfoData.strMinAE110), rd_GimmePropInfoData.scriptName);
	else
	{
		// Build and show the palette
		var rdgpiPal  = rd_GimmePropInfo_buildUI(thisObj);
		if (rdgpiPal !== null)
		{
			if (rdgpiPal instanceof Window)
			{
				// Show the palette
				rdgpiPal.center();
				rdgpiPal.show();
			}
			else
				rdgpiPal.layout.layout(true);
		}
	}
})(this);
