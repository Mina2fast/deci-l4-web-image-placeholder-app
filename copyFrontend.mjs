import { promises as fs } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Required to emulate __dirname in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const srcDir = path.resolve(__dirname, 'src/frontend');
const destDir = path.resolve(__dirname, 'dist/frontend');

async function copyRecursive(src, dest) {
  try {
    await fs.mkdir(dest, { recursive: true });
    const entries = await fs.readdir(src, { withFileTypes: true });

    for (const entry of entries) {
      const srcPath = path.join(src, entry.name);
      const destPath = path.join(dest, entry.name);

      if (entry.isDirectory()) {
        await copyRecursive(srcPath, destPath);
      } else {
        await fs.copyFile(srcPath, destPath);
      }
    }
  } catch (err) {
    console.error('Error copying files:', err);
  }
}

copyRecursive(srcDir, destDir).then(() =>
  console.log('Copied src/frontend to dist/frontend')
);
