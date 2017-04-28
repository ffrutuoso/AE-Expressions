// apply on opacity

L = effect("Layer Control")("Layer");
On = effect("Cursor")("Checkbox");
spd = L.effect("Anim").slider.velocity;
PT = time - thisLayer.inPoint;
F = Math.round(PT % 1);

if (F == 0 && On == 1) 100 else if (spd !=0 && On== 1) 100 else 0
