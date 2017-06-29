// Source:
// https://forums.adobe.com/thread/1471138

function getCubicbeziers(){
  var curItem = app.project.activeItem;
  var selectedLayers = curItem.selectedLayers;
  var selectedProperties = app.project.activeItem.selectedProperties;
  if (selectedLayers == 0){
    alert("Please Select at least one Layer");
  } else if(selectedLayers !=0){
    for (var i = 0; i < selectedLayers.length; i++){
      for (var f in selectedProperties){
        var currentProperty = selectedProperties[f];
        if (currentProperty.numKeys > 1){
          for(var i = 1; i < currentProperty.numKeys; i++) {
            var t1 = currentProperty.keyTime(i);
            var t2 = currentProperty.keyTime(i+1);
            var val1 = currentProperty.keyValue(i);
            var val2 = currentProperty.keyValue(i+1);
            var delta_t = t2-t1;
            var delta = val2-val1;
            avSpeed = Math.abs(val2-val1)/(t2-t1);
            if (val1<val2){//, this should reproduce your website:
              x1 = currentProperty.keyOutTemporalEase(i)[0].influence /100;
              y1 = x1*currentProperty.keyOutTemporalEase(i)[0].speed / avSpeed;

              x2 = 1-currentProperty.keyInTemporalEase(i+1)[0].influence /100;
              y2 = 1-(1-x2)*(currentProperty.keyInTemporalEase(i+1)[0].speed / avSpeed);
            }
            if (val2<val1){//, to get a curve starting from point [0,1] going to point [1,0], it would be:
              x1 = currentProperty.keyOutTemporalEase(i)[0].influence /100;
              y1 = (-x1)*currentProperty.keyOutTemporalEase(i)[0].speed / avSpeed;
              x2 = currentProperty.keyInTemporalEase(i+1)[0].influence /100;
              y2 = 1+x2*(currentProperty.keyInTemporalEase(i+1)[0].speed / avSpeed);
              x2 = 1-x2;
            }
            if (val1==val2){
              x1 = currentProperty.keyOutTemporalEase(i)[0].influence /100;
              y1 = (-x1)*currentProperty.keyOutTemporalEase(i)[0].speed / ((currentProperty.maxValue-currentProperty.minValue)/(t2-t1)) ;
              x2 = currentProperty.keyInTemporalEase(i+1)[0].influence /100;
              y2 = 1+x2*(currentProperty.keyInTemporalEase(i+1)[0].speed / ((currentProperty.maxValue-currentProperty.minValue)/(t2-t1)));
              x2 = 1-x2;
            }
            alert("keyframe: " + i +" Cubic-bezier["+x1+", "+y1 +", "+x2+", "+y2 +"]");
          }
        }
      }
    }
  }
}

getCubicbeziers();
