document.getElementById('resize-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const filename = document.getElementById('filename').value;
    const width = document.getElementById('width').value;
    const height = document.getElementById('height').value;
    const url = `/api/images?filename=${filename}&width=${width}&height=${height}`;
    document.getElementById('url').innerText = window.location.origin + url;
  });
  