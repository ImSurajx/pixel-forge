// genral variables
let imgElement = null;
let originalImage = null;

// all the requried field to get image into img container
let selectImg = document.querySelector('#choose-image');
let imgContainer = document.querySelector('.img-container');
let imageInputLable = document.querySelector('#img-label');

// varible for zoom-in or zoom-out effect
let scale = 1;
let zoomIn = document.querySelector('.ri-zoom-in-line');
let zoomOut = document.querySelector('.ri-zoom-out-line');
let zoom = document.querySelector('.zoom');
let minZoom = 0.1;
let maxZoom = 2;

// varibles for rotation
let antiClock = document.querySelector('.ri-anticlockwise-2-line');
let rotation = 0;

// varible for fliping the image
let mirror = document.querySelector('.ri-flip-horizontal-line');
let flipX = 1;

// adjustments
let inputsRange = document.querySelectorAll('input[type="range"]');

// filters
let allFilters = document.querySelectorAll('.filter-type-x');
let filterContainer = document.querySelector('.filter-container');


// create object for presets
const presets = {
    vivid: {
        brightness: 15,
        contrast: 30,
        saturation: 150,
        hue: 0,
        exposure: 105
    },

    mono: {
        brightness: 0,
        contrast: 20,
        saturation: 0,
        hue: 0,
        exposure: 100
    },

    sepia: {
        brightness: 10,
        contrast: 15,
        saturation: 60,
        hue: 25,
        exposure: 105
    },

    "cool-arctic": {
        brightness: 5,
        contrast: 10,
        saturation: 110,
        hue: 180,
        exposure: 100
    },

    "warm-glow": {
        brightness: 12,
        contrast: 15,
        saturation: 125,
        hue: 20,
        exposure: 110
    },

    cinematic: {
        brightness: -5,
        contrast: 35,
        saturation: 85,
        hue: -10,
        exposure: 95
    },

    vintage: {
        brightness: 8,
        contrast: 10,
        saturation: 70,
        hue: 18,
        exposure: 102
    },

    sunset: {
        brightness: 18,
        contrast: 20,
        saturation: 145,
        hue: 30,
        exposure: 108
    },

    "neon-pop": {
        brightness: 10,
        contrast: 40,
        saturation: 180,
        hue: 50,
        exposure: 100
    },

    "forest-tone": {
        brightness: 0,
        contrast: 18,
        saturation: 120,
        hue: 100,
        exposure: 98
    },

    "black-gold": {
        brightness: -8,
        contrast: 35,
        saturation: 65,
        hue: 35,
        exposure: 92
    },

    "soft-pastel": {
        brightness: 15,
        contrast: -10,
        saturation: 80,
        hue: 10,
        exposure: 112
    },

    "icy-blue": {
        brightness: 5,
        contrast: 12,
        saturation: 115,
        hue: 210,
        exposure: 102
    },

    dramatic: {
        brightness: -10,
        contrast: 45,
        saturation: 95,
        hue: 0,
        exposure: 90
    }
};


// global state for all the sliders
const state = {
    brightness: 0,
    contrast: 0,
    saturation: 100,
    hue: 0,
    exposure: 100,
}

// this function update image according to user tool
function updateImage() {
    imgElement.style.transform = `rotate(${rotation}deg) scaleX(${scale * flipX}) scaleY(${scale})`;
}

// this function make value witin the required range accoridng to RGB
function clamp(value) {
    return Math.max(0, Math.min(255, value))
}

// creating a canvas in which i load the imgae.
function loadImageToCanvas() {
    return new Promise((resolve, reject) => {
        let image = new Image();
        image.src = originalImage;
        image.onload = function () {
            let canvas = document.createElement('canvas');
            canvas.height = image.naturalHeight;
            canvas.width = image.naturalWidth;
            const ctx = canvas.getContext("2d");
            ctx.drawImage(image, 0, 0);
            resolve(canvas);
        }
        image.onerror = function () {
            reject(`image not loaded`);
        };
    })
}

// this function calculate the calculate the value of HUE
function calculateHue(R, G, B) {
    let H = 0;
    let r = R / 255;
    let g = G / 255;
    let b = B / 255;
    let max = Math.max(r, g, b);
    let min = Math.min(r, g, b);
    let delta = max - min;
    if (delta == 0) H = 0;
    else if (max == r) H = 60 * ((g - b) / delta % 6);
    else if (max == g) H = 60 * ((b - r) / delta + 2);
    else if (max == b) H = 60 * ((r - g) / delta + 4);
    if (H < 0) H += 360;
    return H;
}

// this function convert RGB color codes to HSL color codes
function rgbToHsl(R, G, B) {
    let hsl = {
        h: 0,
        s: 0,
        l: 0,
    }
    hsl.h = calculateHue(R, G, B);
    let r = R / 255;
    let g = G / 255;
    let b = B / 255;
    let max = Math.max(r, g, b);
    let min = Math.min(r, g, b);
    let delta = max - min;
    hsl.l = (max + min) / 2;
    if (delta == 0) hsl.s = 0;
    else {
        hsl.s = delta / (1 - Math.abs(2 * hsl.l - 1));
    }
    return hsl;
}

// this function convert HSL to RGB.
function hslToRgb(h, s, l) {
    let rgb = {
        r: 0,
        g: 0,
        b: 0,
    }
    let c = (1 - Math.abs((2 * l) - 1)) * s; // calculate chroma
    let x = c * (1 - Math.abs((h / 60) % 2 - 1));
    let m = l - c / 2;
    let r1 = 0, g1 = 0, b1 = 0;
    h = h % 360
    if (h < 0) h += 360;
    // choose sector based on hue.
    if (0 <= h && h < 60) {
        r1 = c;
        g1 = x;
        b1 = 0;
    }
    else if (60 <= h && h < 120) {
        r1 = x;
        g1 = c;
        b1 = 0;
    }
    else if (120 <= h && h < 180) {
        r1 = 0;
        g1 = c;
        b1 = x;
    }
    else if (180 <= h && h < 240) {
        r1 = 0;
        g1 = x;
        b1 = c;
    }
    else if (240 <= h && h < 300) {
        r1 = x;
        g1 = 0;
        b1 = c;
    }
    else if (300 <= h && h < 360) {
        r1 = c;
        g1 = 0;
        b1 = x;
    }
    rgb.r = (r1 + m) * 255;
    rgb.g = (g1 + m) * 255;
    rgb.b = (b1 + m) * 255;
    // making values with in the range of color codes
    rgb.r = clamp(rgb.r);
    rgb.g = clamp(rgb.g);
    rgb.b = clamp(rgb.b);
    // rounding off values before return 
    rgb.r = Math.round(rgb.r);
    rgb.g = Math.round(rgb.g);
    rgb.b = Math.round(rgb.b);
    return rgb;
}

// apply effects according to sliders
async function applyAllEffects(state) {
    if (!originalImage) return;
    const canvas = await loadImageToCanvas();
    const ctx = canvas.getContext("2d")
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    let brightnessValue = state.brightness;
    let contrastValue = state.contrast;
    const contrastFactor = (259 * (contrastValue + 255)) / (255 * (259 - contrastValue)); // 0 < 1 < 2+ ->  for contrast
    const saturationFactor = state.saturation / 100;
    const exposureFactor = 1 + (state.exposure - 100) / 100;
    for (let i = 0; i < imageData.data.length; i += 4) {
        let R = imageData.data[i];
        let G = imageData.data[i + 1];
        let B = imageData.data[i + 2];
        // this part of loop for update brightness
        R += brightnessValue;
        G += brightnessValue;
        B += brightnessValue;
        // this part of loop for update contrast
        R = (R - 128) * contrastFactor + 128;
        G = (G - 128) * contrastFactor + 128;
        B = (B - 128) * contrastFactor + 128;
        // this part of loop for the saturation
        let gray = (0.299 * R) + (0.587 * G) + (0.114 * B);
        R = gray + (R - gray) * saturationFactor;
        G = gray + (G - gray) * saturationFactor;
        B = gray + (B - gray) * saturationFactor;
        // this part of loop for the hue
        let hsl = rgbToHsl(R, G, B);
        hsl.h = (hsl.h + state.hue + 360) % 360;
        let rgb = hslToRgb(hsl.h, hsl.s, hsl.l)
        R = rgb.r;
        G = rgb.g;
        B = rgb.b;
        // this part of loop for the exposure
        R = 128 + (R - 128) * exposureFactor
        G = 128 + (G - 128) * exposureFactor
        B = 128 + (B - 128) * exposureFactor
        // this part make value with-in the range of the RGB
        imageData.data[i] = clamp(R);
        imageData.data[i + 1] = clamp(G);
        imageData.data[i + 2] = clamp(B);
    }
    ctx.putImageData(imageData, 0, 0);
    let dataURL = canvas.toDataURL();
    imgElement.src = dataURL;
}

// create image & replace it with our container.
selectImg.addEventListener("change", (e) => {
    let img = document.createElement('img');
    img.id = 'cont-img';
    const file = e.target.files[0];
    if (!file) {
        return
    }
    else {
        scale = 1;
        rotation = 0;
        flipX = 1;
        originalImage = URL.createObjectURL(file);
        img.src = originalImage;
        imageInputLable.hidden = true;
        imgContainer.appendChild(img);
        isImage = true;
        imgElement = img;
    }
})

// when user click zoom-in button this function will run
zoomIn.addEventListener("click", (e) => {
    if (!imgElement) return;
    if (scale < 2) scale += 0.05;
    updateImage();
    zoom.textContent = `${Math.floor(scale * 100)}%`;
})

// when user click zoom-out button this function will run
zoomOut.addEventListener("click", (e) => {
    if (!imgElement) return;
    if (scale > 0.1) scale -= 0.05;
    updateImage();
    zoom.textContent = `${Math.floor(scale * 100)}%`;
})

// when user click rotateIcon this function will run
antiClock.addEventListener("click", (e) => {
    if (!imgElement) return;
    if (rotation >= 360) rotation = 0;
    else rotation -= 90;
    updateImage();
})

// when user click on horizontal flip icon this function will run
mirror.addEventListener("click", (e) => {
    if (!imgElement) return;
    flipX = flipX * -1;
    updateImage();
})

// each slider logic are present here
inputsRange.forEach((ele) => {
    if (ele.id === "brightness") {
        ele.addEventListener("input", (e) => {
            if (!imgElement) return;
            document.querySelector('.bright').textContent = `${e.target.value}%`;
            state.brightness = Number(e.target.value) - 100;
            applyAllEffects(state);
        })
    }
    else if (ele.id === "contrast") {
        ele.addEventListener("input", (e) => {
            if (!imgElement) return;
            document.querySelector('.contra').textContent = `${e.target.value}%`;
            state.contrast = Number(e.target.value) - 100;
            applyAllEffects(state);
        })
    }
    else if (ele.id === "saturation") {
        ele.addEventListener("input", (e) => {
            if (!imgElement) return;
            document.querySelector('.satura').textContent = `${e.target.value}%`;
            state.saturation = Number(e.target.value);
            applyAllEffects(state);
        })
    }
    else if (ele.id === "exposure") {
        ele.addEventListener("input", (e) => {
            if (!imgElement) return;
            document.querySelector('.expo').textContent = `${e.target.value}%`;
            state.exposure = Number(e.target.value);
            applyAllEffects(state);
        })
    }
    else if (ele.id === "hue") {
        ele.addEventListener("input", (e) => {
            if (!imgElement) return;
            document.querySelector('.hue').textContent = `${e.target.value}°`;
            state.hue = Number(e.target.value);
            applyAllEffects(state);
        })
    }

})

// apply filters according to user click
filterContainer.addEventListener('click', (e) => {
    if(!imgElement) return;
    allFilters.forEach((ele) => {
        if(e.target == ele){
            applyAllEffects(presets[ele.id]);
        }
    })
})







