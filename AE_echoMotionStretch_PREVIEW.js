try {
  var parentPosition = Math.abs(parent.position.speed);
  var parentRotation = Math.abs(parent.rotation.speed) * 5.555555;
  var parentScale = Math.abs(parent.scale.velocity[0,1]) * 10;
  var layerPosition = Math.abs(position.speed);
  var layerRotation = Math.abs(rotation.speed) * 5.555555;
  var layerScale = Math.abs(scale.velocity[0,1]) * 10;
  var maxSpeed = [parentPosition, parentRotation, parentScale, layerPosition, layerRotation, layerScale];
  Math.max.apply(null, maxSpeed);
}

catch (error) {
  layerPosition = Math.abs(position.speed);
  layerRotation = Math.abs(rotation.speed) * 5.555555;
  layerScale = Math.abs(scale.velocity[0,1]) * 10;
  var maxSpeed = [layerPosition, layerRotation, layerScale];
  Math.max.apply(null, maxSpeed);
}

///////////////////////////

var totalSpeed = effect('Stretchy')('Speed');
var interpolation = effect('Stretchy')('Interpolation');
var length = effect('Stretchy')('Length');

if (totalSpeed > 500000)
  delay = 0.00004;
else if (totalSpeed > 2000)
    delay = 0.0002 / (totalSpeed / 100000);
else delay = 0.01;

delay = delay * length;

delay / (interpolation * (interpolation / 2));

///////////////////////////

var totalSpeed = effect('Stretchy')('Speed');
var interpolation = effect('Stretchy')('Interpolation');
var echoes = (totalSpeed / 5000) * (interpolation * (interpolation / 2));

if (interpolation > 10) clamp(echoes, 1024, 0);
else if (interpolation > 7.5) clamp(echoes, 512, 0);
else if (interpolation > 5) clamp(echoes, 256, 0);
else clamp(echoes, 128, 0);

///////////////////////////

var back = effect('Stretchy')('Has Back');
var front = effect('Stretchy')('Has Front');
var echoTime = effect('Stretchy')('Time');
if (back == 1 && front == 1) -(echoTime);
else if (back == 1 && front == 0) -(echoTime / 2);
else 0;

///////////////////////////

var back = effect('Stretchy')('Has Back');
var front = effect('Stretchy')('Has Front');
var echoes = effect('Stretchy')('Echoes');
if (back == 1 && front == 1) echoes;
else if (back == 1 && front == 0) echoes * 4; 
else 0;
