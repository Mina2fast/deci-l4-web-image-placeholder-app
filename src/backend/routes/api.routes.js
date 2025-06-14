import { Router } from 'express';
import { processImage, validateImageParams } from '../controllers/image.controller';
import { uploadImage, getImagesList } from '../controllers/upload.controller';
import upload from '../utilities/image.util';
const router = Router();
router.get('/image', validateImageParams, processImage);
router.get('/images-list', getImagesList);
router.post('/upload', upload.single('image'), uploadImage);
export default router;
