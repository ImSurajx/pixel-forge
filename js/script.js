// genral variables
let imgElement = null;
let url = null;

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

// creating a canvas in which i load the imgae.
function loadImageToCanvas() {
    return new Promise((resolve, reject) => {
        let image = new Image();
        image.src = url;
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
        url = URL.createObjectURL(file);
        img.src = url;
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

// canvas setup and image loading pipeline
async function brightness(value) {
    const canvas = await loadImageToCanvas();
    const ctx = canvas.getContext("2d");
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    console.log(imageData.data);
    for (let i = 0; i < imageData.data.length; i += 4) {
        imageData.data[i] = Math.max(0, Math.min(255, imageData.data[i] + value));
        imageData.data[i + 1] = Math.max(0, Math.min(255, imageData.data[i + 1] + value));
        imageData.data[i + 2] = Math.max(0, Math.min(255, imageData.data[i + 2] + value));
    }
    ctx.putImageData(imageData, 0, 0);
    let dataURL = canvas.toDataURL();
    imgElement.src = dataURL;
}

// each slider logic are present here
inputsRange.forEach((ele) => {
    if (ele.id === "brightness") {
        ele.addEventListener("input", (e) => {
            if (!imgElement) return;
            document.querySelector('.bright').textContent = `${e.target.value}%`;
            brightness((e.target.value - 100));
        })
    }
})


