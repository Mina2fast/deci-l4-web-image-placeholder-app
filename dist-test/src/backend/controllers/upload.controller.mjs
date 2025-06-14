import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const uploadsPath = path.join(__dirname, '..', '..', 'uploads');
// Ensure uploads directory exists
if (!fs.existsSync(uploadsPath)) {
    fs.mkdirSync(uploadsPath, { recursive: true });
}
export const uploadImage = async (req, res, next) => {
    try {
        if (!req.file) {
            res.status(400).json({ error: 'No file uploaded' });
            return;
        }
        res.status(201).json({
            message: 'File uploaded successfully',
            filename: req.file.filename,
        });
    }
    catch (error) {
        next(error);
    }
};
export const getImagesList = async (req, res, next) => {
    try {
        const imagesDir = path.join(__dirname, '../../frontend/public/images');
        fs.readdir(imagesDir, (err, files) => {
            if (err) {
                throw new Error('Error reading images directory');
            }
            const imageFiles = files.filter(file => file.toLowerCase().endsWith('.jpg') ||
                file.toLowerCase().endsWith('.jpeg') ||
                file.toLowerCase().endsWith('.png'));
            res.json(imageFiles);
        });
    }
    catch (error) {
        next(error);
    }
};
