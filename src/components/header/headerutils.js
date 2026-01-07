export const createImageFromInitials = (size, name, color) => {
    const canvas=document.createElement('canvas')
    const context=canvas.getContext('2d')
    canvas.width=canvas.height=size
    context.fillStyle="#ffffff"
    context.fillRect(0,0,size,size)

    context.fillStyle=color;
    context.fillRect(0,0,size,size)

    
    // context.fill();
    context.fillStyle="#ffffff"
    // context.fillStyle=color;
    context.textBaseline='middle'
    context.textAlign='center'
    context.font =`600 ${size/2}px sans-serif`
    context.fillText(name,(size/2),(size/1.8))

    return canvas.toDataURL()
};

export function getRandomColor(h, s, l, a) {
    const hue = getRandomNumber(h[0], h[1]);
    const saturation = getRandomNumber(s[0], s[1]);
    const lightness = getRandomNumber(l[0], l[1]);
    const alpha = getRandomNumber(a[0] * 100, a[1] * 100) / 100;
    return `hsl(${hue}, ${saturation}%, ${lightness}%, ${alpha})`;
}

function getRandomNumber(low, high) {
    var r = Math.floor(Math.random() * (high - low + 1)) + low;
    return r;
}