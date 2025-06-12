let selectedImage = null;

// DOM Elements
const gallery = document.getElementById('gallery');
const uploadForm = document.getElementById('uploadForm');
const imageUpload = document.getElementById('imageUpload');
const uploadMessage = document.getElementById('uploadMessage');
const resizeForm = document.getElementById('resizeForm');
const widthInput = document.getElementById('width');
const heightInput = document.getElementById('height');
const resizeResult = document.getElementById('resizeResult');

// Initialize app
document.addEventListener('DOMContentLoaded', () => {
  fetchImages();
});

// Fetch all images from server
async function fetchImages() {
  try {
    const response = await fetch('/api/images-list');
    if (!response.ok) throw new Error('Failed to fetch images');

    const images = await response.json();
    renderGallery(images);
  } catch (error) {
    showError('Error loading images');
    console.error('Error fetching images:', error);
  }
}

// Render image gallery
function renderGallery(images) {
  gallery.innerHTML = '';

  if (images.length === 0) {
    gallery.innerHTML = '<p>No images found. Upload some images to get started!</p>';
    return;
  }

  images.forEach(image => {
    const imgElement = document.createElement('img');
    imgElement.src = `/images/${image}`;
    imgElement.alt = image;
    imgElement.dataset.filename = image;

    imgElement.addEventListener('click', () => {
      document.querySelectorAll('#gallery img').forEach(img => {
        img.classList.remove('selected');
      });
      imgElement.classList.add('selected');
      selectedImage = image;
    });

    gallery.appendChild(imgElement);
  });
}

// Handle image upload
uploadForm.addEventListener('submit', async (e) => {
  e.preventDefault();

  if (!imageUpload.files || !imageUpload.files.length) {
    showError('Please select a file');
    return;
  }

  const formData = new FormData();
  formData.append('image', imageUpload.files[0]);

  try {
    const response = await fetch('/api/upload', {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      const result = await response.json();
      throw new Error(result.error || 'Upload failed');
    }

    uploadMessage.textContent = '';
    imageUpload.value = '';
    fetchImages(); // Refresh gallery
  } catch (error) {
    showError(error instanceof Error ? error.message : 'Upload failed');
  }
});

// Handle image resize
resizeForm.addEventListener('submit', async (e) => {
  e.preventDefault();

  if (!selectedImage) {
    showError('Please select an image first');
    return;
  }

  const width = widthInput.value;
  const height = heightInput.value;

  if (!width || !height) {
    showError('Please enter both width and height');
    return;
  }

  try {
    const url = `/api/images?filename=${encodeURIComponent(selectedImage)}&width=${width}&height=${height}`;

    const testResponse = await fetch(url);
    if (!testResponse.ok) {
      throw new Error(await testResponse.text());
    }

    resizeResult.innerHTML = `
      <p>Image resized successfully!</p>
      <p>Access your image at: <a href="${url}" target="_blank">${url}</a></p>
      <img src="${url}" alt="Resized image" style="max-width: 100%;">
    `;
  } catch (error) {
    showError(`Error resizing image: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
});

function showError(message) {
  const errorElement = uploadMessage || resizeResult;
  errorElement.textContent = message;
  errorElement.classList.add('error');
}
