// uses parent's properties, maintaining scale.

//apply on Scale


s = [];
parentScale = parent.transform.scale.value;
for (i = 0; i < parentScale.length; i++){
s[i] = value[i]*100/parentScale[i];
}
s
