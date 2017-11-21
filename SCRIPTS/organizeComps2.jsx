// ##### WIP #####
{

  var thisFolder = app.project.activeItem; // global variable to shorten things

  // Makes sure a folder is selected
  function setComp() {
    if (!thisFolder || !(thisFolder instanceof FolderItem)) {
      alert("Gotta select a folder to organize");
      return false;
    } else {
      return true;
    }
  }

  function folderExists(theFolder, compName) {
    for (var i = 1; i < theFolder.numItems + 1; i++) {

      var foundFolder = false;
      var targetFolder;
      var thisObject = theFolder.item(i);

      //debug stuff
      // $.writeln(foundFolder);
      $.writeln(thisObject.name);

      // check if name matches and if is folder
      if (thisObject.name === compName && searchedItem instanceof FolderItem) {
        foundFolder = true;
        targetFolder = thisObject;
        return [foundFolder, targetFolder];
        break;
      }

      if (thisObject instanceof FolderItem) {
        folderExists(thisObject, thisObject);
      }

      return false;

    }
  }

  function isComp(searchedComp) {

    var compName = searchedComp.usedIn[0].name;

    folderExists(thisFolder, compName)

    // create folder if not existing
    if () {
      targetFolder = thisFolder.items.addFolder(theName);
    }

    // move object to the searched folder
    thisObject.parentFolder = targetFolder;

  }

  if (setComp()) {

    // begin undo group
    app.beginUndoGroup("Organize Folders");

    loopFolders(thisFolder, true);

    app.endUndoGroup();

  };

}
