////// SIMPLIFIED //////

// Increases value over time. Full expression on Github.
var spd = effect("Speed")("Slider");
var val = value;
if (time > spd.key(1).time) {
    for (var frameIndex = timeToFrames(time); frameIndex > timeToFrames(spd.key(1).time); frameIndex--) {
        val = val + (1 * spd.valueAtTime(framesToTime(frameIndex)));
    }
}
if (val < 0) val = 0;
val.toFixed(0)
