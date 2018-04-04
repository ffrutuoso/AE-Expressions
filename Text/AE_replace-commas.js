// WIP

parentSize = parent.content("Rectangle Path 1").size[0];

num = linear(parentSize, 0, 100, 0, 1.8);
roundNum = String(Math.round(num * 10) / 10);

roundNum.replace(".", ",") + " GB"
