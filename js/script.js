// all the requried field to get image into img container
let selectImg = document.querySelector('#choose-image');
let imgContainer = document.querySelector('.img-container');
let imageInputLable = document.querySelector('#img-label');

// create image & replace it with our container.
selectImg.addEventListener("change", (e) => {
    let img = document.createElement('img');
    const file = e.target.files[0];
    if (!file) {
        return
    }
    else{
        img.src = URL.createObjectURL(file);
        imageInputLable.hidden = true;
        imgContainer.appendChild(img);
    }
})
