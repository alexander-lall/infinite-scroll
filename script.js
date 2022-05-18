const imageContainer = document.getElementById('image-container');
const loader = document.getElementById('loader');

let isAddingCompleted = false;
let isLastLargeImageLeftAligned = false;
let imagesAddedCount = 0;
let imagesToAdd = [];

const imagesPerGrid = 5
const initialRowCount = 2;
const standardRowCount = 6;
const apiKey = 'CHHw0kLqvnOUB7u-iK6mzQO_4Nfj7m57oxHO5t-fUco';
const initialApiUrl = `https://api.unsplash.com/photos/random?client_id=${apiKey}&count=${imagesPerGrid * initialRowCount}`;
const standardApiUrl = `https://api.unsplash.com/photos/random?client_id=${apiKey}&count=${imagesPerGrid * standardRowCount}`;

function imageLoaded() {
    imagesAddedCount++;
    if(imagesAddedCount == imagesToAdd.length) {
        isLoadingCompleted = true;
        loader.hidden = true;
    }
}

function getPhotosFromUnsplashApi(apiUrl) {
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
    for(let i = 0; i < imagesToAdd.length / imagesPerGrid; i++) {
        const index = i * imagesPerGrid; 

        // Image Grid
        let imageGrid = document.createElement('div');
        imageGrid.classList.add('image-grid');

        // Large image
        let largeImage = createImage(imagesToAdd[index]);
        largeImage.classList.add(isLastLargeImageLeftAligned ? 'large-right-aligned' : 'large-left-aligned')
        isLastLargeImageLeftAligned = !isLastLargeImageLeftAligned;
        imageGrid.appendChild(largeImage);

        // Other smaller images
        for(let j = 1; j < imagesPerGrid; j++) {
            imageGrid.appendChild(createImage(imagesToAdd[index + j]));
        }

        imageContainer.appendChild(imageGrid);
    }
}

// Helper Functions
function createImage(imgData) {
    // Create <a> to link to Unsplash
    let a = document.createElement('a');
    setAttributes(a, {
        href: imgData.links.html,
        target: '_blank'
    });
    // Create <img> for photo
    let img = document.createElement('img');
    setAttributes(img, {
        src: imgData.urls.small,
        alt: imgData.alt_description,
        title: imgData.alt_description
    });
    // Update state after picture is loaded
    img.addEventListener('load', imageLoaded);
    // Put <img> inside <a>, and return <a>
    a.appendChild(img);
    return a;
}

function setAttributes(element, attributes) {
    for (const key in attributes) {
        element.setAttribute(key, attributes[key]);
    }
}

// Event Listeners
window.addEventListener('scroll', () => {
    if(window.innerHeight + window.scrollY >= document.body.offsetHeight - 1000 && isLoadingCompleted) {
        imagesAddedCount = 0;
        isLoadingCompleted = false;
        getPhotosFromUnsplashApi(standardApiUrl);
    }
});

// On Load
getPhotosFromUnsplashApi(initialApiUrl);