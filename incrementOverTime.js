var spd = effect("Speed")("Slider");
var timeInFrames = timeToFrames(time);

// procurar o primeiro keyframe
var timeKey1 = spd.key(1).time; //300
var framesKey1 = timeToFrames(timeKey1);

// iniciar valor
var val = value;

// se estamos à frente do key 1
if (time > timeKey1) {

    // loop desde o primeiro key até ao tempo actual
    for (var frameIndex = timeInFrames; frameIndex > framesKey1; frameIndex--) {

        // numero de frames desde o primeiro key
        var normalizedIndex = frameIndex - framesKey1;

        // ir buscar velocidade no tempo do frame i
        var speedAtTime = spd.valueAtTime(framesToTime(frameIndex));

        // calcular valor. Incrementar e adicionar o tempo multiplicado pela velocidade
        val = val + (1 * speedAtTime);
    }
}

// Lock negatives
if (val < 0) val = 0;

// Remove decimals
val.toFixed(0)