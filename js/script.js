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
    let H = null;
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
    return H;
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

// global state for all the sliders
const state = {
    brightness: 0,
    contrast: 0,
    saturation: 100,
    hue: 0,
    exposure: 100,
}

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
    if (ele.id === "contrast") {
        ele.addEventListener("input", (e) => {
            if (!imgElement) return;
            document.querySelector('.contra').textContent = `${e.target.value}%`;
            state.contrast = Number(e.target.value) - 100;
            applyAllEffects(state);
        })
    }
    if (ele.id === "saturation") {
        ele.addEventListener("input", (e) => {
            if (!imgElement) return;
            document.querySelector('.satura').textContent = `${e.target.value}%`;
            state.saturation = Number(e.target.value);
            applyAllEffects(state);
        })
    }
    if (ele.id === "exposure") {
        ele.addEventListener("input", (e) => {
            if (!imgElement) return;
            document.querySelector('.expo').textContent = `${e.target.value}%`;
            state.exposure = Number(e.target.value);
            applyAllEffects(state);
        })
    }

})

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
        let H = calculateHue(R, G, B);
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


