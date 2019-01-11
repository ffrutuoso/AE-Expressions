// rd_GimmeProps.jsx
// Copyright (c) 2005-2013 redefinery (Jeffrey R. Almasol). All rights reserved.
// check it: www.redefinery.com
// 
// Name: rd_GimmeProps
// Version: 1.2
// 
// Description:
// This script dumps the name and matchName of the property hierarchy of
// the selected layers, in selected order. Use this information to retrieve
// the internal matchName for a property that you want to access in your 
// scripts.
// 
// Note: This script requires After Effects 7.0 or later.
// 
// Legal stuff:
// This script is provided "as is," without warranty of any kind, expressed
// or implied. In no event shall the author be held liable for any damages 
// arising in any way from the use of this script.
// 
// In other words, I'm just trying to share knowledge with and help out my
// fellow AE script heads, so don't blame me if my code doesn't rate. :-)




// rd_GimmeProps()
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
(function rd_GimmeProps(thisObj)
{
	// Globals
	
	var rd_GimmePropsData = new Object();	// Store globals in an object
	rd_GimmePropsData.scriptName = "rd: Gimme Props";
	rd_GimmePropsData.scriptTitle = rd_GimmePropsData.scriptName + " v1.2";
	
	rd_GimmePropsData.strErrNoCompSel = {en: "Cannot perform operation. Please select or open a single composition in the Project panel, and try again."};
	rd_GimmePropsData.strMinAE70 = {en: "This script requires Adobe After Effects 7.0 or later."};
	
	
	
	
	// rd_GimmeProps_localize()
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
	function rd_GimmeProps_localize(strVar)
	{
		return strVar["en"];
	}
	
	
	
	
	// rd_GimmeProps_dumpPropsChildren()
	// 
	// Description:
	// This function iterates over a property's children properties, dumping the
	// name and matchName for eacn property to the console.
	// 
	// Parameters:
	//   propParent - PropertyGroup object whose children Property object to dump.
	//   currIndent - String representing the current indentation.
	// 
	// Returns:
	// Nothing.
	//
	function rd_GimmeProps_dumpPropsChildren(propParent, currIndent)
	{
		if (propParent !== null)
		{
			var prop;
			
			currIndent += "    ";			// Indent four more spaces
			for (var i=1; i<=propParent.numProperties; i++)
			{
				prop = propParent.property(i);
				switch (prop.propertyType)
				{
					case PropertyType.PROPERTY:
						$.writeln(currIndent + prop.name + " ["+prop.matchName+"] (property)");
						break;
					case PropertyType.INDEXED_GROUP:
						$.writeln(currIndent + prop.name + " ["+prop.matchName+"] (indexed group)");
						rd_GimmeProps_dumpPropsChildren(prop, currIndent);
						break;
					case PropertyType.NAMED_GROUP:
						$.writeln(currIndent + prop.name + " ["+prop.matchName+"] (named group)");
						rd_GimmeProps_dumpPropsChildren(prop, currIndent);
						break;
					default:
						$.writeln(currIndent + prop.name + " ["+prop.matchName+"] (unknown type)");
						break;
				}
			}
		}
	}
	
	
	
	
	// main code:
	//
	
	// Prerequisites check
	if (parseFloat(app.version) < 7.0)
		alert(rd_GimmeProps_localize(rd_GimmePropsData.strMinAE70), rd_GimmePropsData.scriptName);
	else
	{
		// Get the current (active/frontmost) comp
		var comp = app.project.activeItem;
		
		if ((comp !== null) && (comp instanceof CompItem))
		{
			$.writeln(comp.name+" (comp)");
			for (var i=0; i<comp.selectedLayers.length; i++)
			{
				$.writeln("    "+comp.selectedLayers[i].name+" (layer)");
				rd_GimmeProps_dumpPropsChildren(comp.selectedLayers[i], "    ");
			}
			$.writeln("----------");
		}
		else
			alert(rd_GimmeProps_localize(rd_GimmePropsData.strErrNoCompSel));
	}
})();
