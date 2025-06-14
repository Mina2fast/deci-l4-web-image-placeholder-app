import { Router } from 'express';
import { processImage, validateImageParams, } from '../controllers/image.controller.mjs';
import { uploadImage, getImagesList } from '../controllers/upload.controller.mjs';
import upload from '../utilities/image.util.mjs';
const router = Router();
router.get('/images', validateImageParams, processImage);
router.get('/images-list', getImagesList);
router.post('/upload', upload.single('image'), uploadImage);
export default router;
