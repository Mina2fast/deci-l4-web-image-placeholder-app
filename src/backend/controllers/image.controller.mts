import { Request, Response, NextFunction } from 'express';
import sharp from 'sharp';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
export const validateImageParams = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const { filename, width, height } = req.query;

  if (!filename || !width || !height) {
    res.status(400).json({ error: 'Missing required parameters: filename, width, height' });
    return;
  }

  if (typeof filename !== 'string') {
    res.status(400).json({ error: 'Filename must be a string' });
    return;
  }

  const widthNum = parseInt(width as string);
  const heightNum = parseInt(height as string);

  if (isNaN(widthNum)) {
    res.status(400).json({ error: 'Width must be a number' });
    return;
  }

  if (isNaN(heightNum)) {
    res.status(400).json({ error: 'Height must be a number' });
    return;
  }

  if (widthNum <= 0 || heightNum <= 0) {
    res.status(400).json({ error: 'Width and height must be positive numbers' });
    return;
  }

  next();
};

export const processImage = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { filename, width, height } = req.query;
    const widthNum = parseInt(width as string);
    const heightNum = parseInt(height as string);

    const inputPath = path.join(
      __dirname,
      '../../frontend/public/images',
      filename as string
    );
    const outputPath = path.join(
      __dirname,
      '../../frontend/public/thumbnails',
      `${filename}-${width}x${height}.jpg`
    );

    // Check if resized image already exists
    if (fs.existsSync(outputPath)) {
      res.sendFile(outputPath);
      return;
    }

    // Check if original image exists
    if (!fs.existsSync(inputPath)) {
      res.status(404).json({ error: 'Image not found' });
      return;
    }

    // Resize and save image
    await sharp(inputPath)
      .resize(widthNum, heightNum)
      .toFormat('jpeg')
      .toFile(outputPath);

    res.sendFile(outputPath);
  } catch (error) {
    next(error);
  }
};