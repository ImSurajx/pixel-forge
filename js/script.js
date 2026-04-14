// genral variables
let imgElement = null;

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

// this function update image according to user tool
function updateImage() {
    imgElement.style.transform = `rotate(${rotation}deg) scale(${scale})`;
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
        img.src = URL.createObjectURL(file);
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
    if(rotation >= 360) rotation = 0;
    else rotation -= 90;
    updateImage();
})
