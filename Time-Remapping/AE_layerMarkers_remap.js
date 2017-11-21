//control layer actions by markers
//adapted from Dan Ebberts @ www.motionscript.com

//updated 2017/11/03

//apply to Time Remapping

var action = comp(name).layer("Control");
var n = 0;

if (marker.numKeys > 0){
  var n = marker.nearestKey(time).index; //nro do marker
  if (marker.key(n).time > time){ //se o tempo do marker for maior que o tempo actual
    n--; //tira um ao index do marker
  }
}

if (n == 0){
  0
} else {
  var m = marker.key(n);
  var myComment = m.comment;
  var t = time - m.time;
  try {
    var actMarker = action.marker.key(myComment);
    if (action.marker.numKeys > actMarker.index){ //se não for o último marker
      var tMax = action.marker.key(actMarker.index + 1).time - actMarker.time - framesToTime(1); //define o tempo máximo "d" tira um frame
    } else {
      var tMax = action.outPoint - actMarker.time - framesToTime(1);
    }
    t = Math.min(t, tMax);
    actMarker.time + t;
  } catch (err) {0}
}
