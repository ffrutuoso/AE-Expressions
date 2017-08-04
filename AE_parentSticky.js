// UNDER CONSTRUCTION

p = thisComp.layer("01 Landing").transform.position[1];

thres = 110;

x = 0;
y = value[1];

if (p + y > thres) {
  y = y + p
} else {
  y = thres
}

[x, y]
