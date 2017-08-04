// apply on Orientation

L = effect("Layer Control")("Layer");

offset = 5000; //offset controls smoothness of turning

Lx = L.transform.position[0];
Ly = L.transform.position[1];
Lz = L.transform.position[2] - offset;

target = [Lx, Ly, Lz];

lookAt(target, position)
