import express from 'express';
import { resizeImage } from '../controllers/imageController';
import upload from '../middleware/multerConfig';

const router = express.Router();

router.get('/images', resizeImage);
router.post('/upload', upload.single('image'), (req, res) => {
  res.status(200).json({ message: 'Upload successful', file: req.file });
});

export default router;

