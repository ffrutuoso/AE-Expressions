// Loop Out values, controlled by a slider
// 0 - 100% influence from the slider

var perc = effect("Grow Influence %")("Slider")/100;

(loopOut('pingpong')-value) * perc + value
