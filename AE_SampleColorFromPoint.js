// sample color

//WIP


anim = effect("Animator")("Slider");

if (anim > 99) {
  [252, 194, 1, 1];
} else if (anim >= 1) {
  targetLayer = thisComp.layer("Gradient_outer");
  samplePoint = position;
  sampleRadius = [1, 1];
  targetLayer.sampleImage(samplePoint, sampleRadius);
} else {
  value
}
