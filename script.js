const imageContainer = document.getElementById('image-container');
const loader = document.getElementById('loader');

let isAllImagesAdded = false;
let imagesAddedCount = 0;
let imagesToAdd = [];

const apiKey = 'CHHw0kLqvnOUB7u-iK6mzQO_4Nfj7m57oxHO5t-fUco';
let imagesPerRequest = 5;
const apiUrl = `https://api.unsplash.com/photos/random?client_id=${apiKey}&count=${imagesPerRequest}`;

function imageLoaded() {
    imagesAddedCount++;
    if(imagesAddedCount == imagesToAdd.length) {
        imagesPerRequest = 30;
        isAllImagesAdded = true;
        loader.hidden = true;
    }
}

function getPhotosFromUnsplashApi() {
    try {
        fetch(apiUrl)
        .then(response => response.json())
        .then(data => {
            imagesToAdd = data;
            addImagesToDom();
        });
    } catch(error) {
        alert(error);
    }
}

function addImagesToDom(){
    imagesToAdd.forEach(imgData => {
    // Create <a> to link to Unsplash
    let a = document.createElement('a');
    setAttributes(a, {
        href: imgData.links.html,
        target: '_blank'
    });
    // Create <img> for photo
    let img = document.createElement('img');
    setAttributes(img, {
        src: imgData.urls.thumb,
        alt: imgData.alt_description,
        title: imgData.alt_description
    });
    // Update state after picture is loaded
    img.addEventListener('load', imageLoaded);
    // Put <img> inside <a>, then <a> into the image container
    a.appendChild(img);
    imageContainer.appendChild(a);
    });
}

// Helper Functions
function setAttributes(element, attributes) {
    for (const key in attributes) {
        element.setAttribute(key, attributes[key]);
    }
}

// Event Listeners
window.addEventListener('scroll', () => {
    if(window.innerHeight + window.scrollY >= document.body.offsetHeight - 1000 && isAllImagesAdded) {
        imagesAddedCount = 0;
        isAllImagesAdded = false;
        getPhotosFromUnsplashApi();
    }
});

// On Load
getPhotosFromUnsplashApi();