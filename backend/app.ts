import express from 'express';
import imageRoutes from '/routes/imageRoutes';
import multer from 'multer';
import path from 'path';
import fs from 'fs';

const app = express();
const PORT = 3000;

app.use(express.json());
app.use('/api', imageRoutes);
app.use('/images', express.static(path.join(__dirname, 'images')));
app.use('/cache', express.static(path.join(__dirname, 'cache')));

// Ensure folders exist
['images', 'cache'].forEach((folder) => {
  const fullPath = path.join(__dirname, folder);
  if (!fs.existsSync(fullPath)) {
    fs.mkdirSync(fullPath);
  }
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
