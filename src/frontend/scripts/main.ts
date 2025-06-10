// DOM Elements
const gallery = document.getElementById('gallery') as HTMLDivElement;
const uploadForm = document.getElementById('uploadForm') as HTMLFormElement;
const imageUpload = document.getElementById('imageUpload') as HTMLInputElement;
const uploadArea = document.getElementById('uploadArea') as HTMLDivElement;
const resizeForm = document.getElementById('resizeForm') as HTMLFormElement;
const widthInput = document.getElementById('width') as HTMLInputElement;
const heightInput = document.getElementById('height') as HTMLInputElement;
const resizeResult = document.getElementById('resizeResult') as HTMLDivElement;

let selectedImage: string | null = null;

// Event Listeners
document.addEventListener('DOMContentLoaded', initApp);
uploadForm.addEventListener('submit', handleUpload);
resizeForm.addEventListener('submit', handleResize);
uploadArea.addEventListener('click', () => imageUpload.click());
imageUpload.addEventListener('change', handleFileSelect);

// Initialize application
function initApp(): void {
  fetchImages();
  setupDragAndDrop();
}

// Setup drag and drop for upload area
function setupDragAndDrop(): void {
  uploadArea.addEventListener('dragover', (e) => {
    e.preventDefault();
    uploadArea.style.borderColor = '#4361ee';
    uploadArea.style.backgroundColor = 'rgba(67, 97, 238, 0.1)';
  });

  uploadArea.addEventListener('dragleave', () => {
    uploadArea.style.borderColor = '#ccc';
    uploadArea.style.backgroundColor = '';
  });

  uploadArea.addEventListener('drop', (e) => {
    e.preventDefault();
    uploadArea.style.borderColor = '#ccc';
    uploadArea.style.backgroundColor = '';

    if (e.dataTransfer?.files.length) {
      imageUpload.files = e.dataTransfer.files;
      handleFileSelect();
    }
  });
}

// Handle file selection
function handleFileSelect(): void {
  if (imageUpload.files?.length) {
    const file = imageUpload.files[0];
    uploadArea.innerHTML = `
      <i class="fas fa-file-image"></i>
      <p>${file.name}</p>
      <small>${(file.size / 1024 / 1024).toFixed(2)} MB</small>
    `;
  }
}

// Fetch all images from server
async function fetchImages(): Promise<void> {
  try {
    const response = await fetch('/api/images-list');
    if (!response.ok) throw new Error('Failed to fetch images');

    const images = await response.json();
    renderGallery(images);
  } catch (error) {
    showNotification('Error loading images', 'error');
    console.error('Error fetching images:', error);
  }
}

// Render image gallery
function renderGallery(images: string[]): void {
  gallery.innerHTML = '';

  if (images.length === 0) {
    gallery.innerHTML = '<p>No images found. Upload some images to get started!</p>';
    return;
  }

  images.forEach((image) => {
    const galleryItem = document.createElement('div');
    galleryItem.className = 'gallery-item';
    galleryItem.innerHTML = `
      <img src="/images/${image}" alt="${image}">
      <div class="name">${image}</div>
    `;

    galleryItem.addEventListener('click', () => {
      document.querySelectorAll('.gallery-item').forEach((item) => {
        item.classList.remove('selected');
      });
      galleryItem.classList.add('selected');
      selectedImage = image;
    });

    gallery.appendChild(galleryItem);
  });
}

// Handle image upload
async function handleUpload(e: Event): Promise<void> {
  e.preventDefault();

  if (!imageUpload.files?.length) {
    showNotification('Please select an image first', 'error');
    return;
  }

  const formData = new FormData();
  formData.append('image', imageUpload.files[0]);

  try {
    const response = await fetch('/api/upload', {
      method: 'POST',
      body: formData,
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.error || 'Upload failed');
    }

    // Reset upload area
    uploadArea.innerHTML = `
      <i class="fas fa-cloud-upload-alt"></i>
      <p>Drag & drop your image here or click to browse</p>
    `;
    imageUpload.value = '';

    // Refresh gallery
    fetchImages();
    showNotification('Image uploaded successfully!', 'success');
  } catch (error) {
    showNotification(error instanceof Error ? error.message : 'Upload failed', 'error');
    console.error('Upload error:', error);
  }
}

// Handle image resize
async function handleResize(e: Event): Promise<void> {
  e.preventDefault();

  if (!selectedImage) {
    showNotification('Please select an image first', 'error');
    return;
  }

  const width = widthInput.value;
  const height = heightInput.value;

  if (!width || !height) {
    showNotification('Please enter both width and height', 'error');
    return;
  }

  try {
    const url = `/api/images?filename=${encodeURIComponent(
      selectedImage,
    )}&width=${width}&height=${height}`;

    // Test if the image can be processed
    const testResponse = await fetch(url);
    if (!testResponse.ok) {
      throw new Error(await testResponse.text());
    }

    // Display result
    resizeResult.innerHTML = `
      <div class="success">
        <p><i class="fas fa-check-circle"></i> Image resized successfully!</p>
        <p>Access your image at: <a href="${url}" target="_blank">${url}</a></p>
        <img src="${url}" alt="Resized image">
      </div>
    `;
    resizeResult.classList.remove('hidden');
  } catch (error) {
    resizeResult.innerHTML = `
      <div class="error">
        <p><i class="fas fa-exclamation-circle"></i> Error resizing image: ${
          error instanceof Error ? error.message : 'Unknown error'
        }</p>
      </div>
    `;
    resizeResult.classList.remove('hidden');
  }
}

// Show notification
function showNotification(message: string, type: 'success' | 'error'): void {
  const notification = document.createElement('div');
  notification.className = `notification ${type}`;
  notification.innerHTML = `
    <i class="fas ${type === 'success' ? 'fa-check-circle' : 'fa-exclamation-circle'}"></i>
    ${message}
  `;

  document.body.appendChild(notification);

  // Remove notification after animation
  setTimeout(() => {
    notification.remove();
  }, 3500);
}