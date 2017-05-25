// converts hex Color values to RGB

// apply to Color properties

h = ; //your hex value here

function hexToRgb(hex) {

    var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);

    return result ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16)
    } : null;
}

[hexToRgb(h).r,hexToRgb(h).g,hexToRgb(h).b]
