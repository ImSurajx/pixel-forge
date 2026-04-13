// all the requried field to get image into img container
let selectImg = document.querySelector('#choose-image');
let imgContainer = document.querySelector('.img-container');
let imageInputLable = document.querySelector('#img-label');

// varible for zoom-in or zoom-out effect
let scale = 1;
let zoomIn = document.querySelector('.ri-zoom-in-line');
let zoomOut = document.querySelector('.ri-zoom-out-line');
let zoom = document.querySelector('.zoom');

// track image present of not
let isImage = false;

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
    }
})

zoomIn.addEventListener("click", (e) => {
    console.log(e);
    if (scale =< 2) scale += 0.05;
    else scale = 1;
    document.querySelector('#cont-img').style.scale = `${scale}`;
    zoom.textContent = `${Math.floor(scale * 100)}%`;
})
zoomOut.addEventListener("click", (e) => {
    console.log(e);
    if (scale >= 0) scale -= 0.05;
    else scale = 1;
    document.querySelector('#cont-img').style.scale = `${scale}`;
    zoom.textContent = `${Math.floor(scale * 100)}%`;
})
