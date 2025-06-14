import { Request, Response, NextFunction } from 'express';
import sharp from 'sharp';
import path from 'path';
import fs from 'fs';

export const validateImageParams = (req: Request, res: Response, next: NextFunction): void => {
  const { filename, width, height } = req.query;

  if (!filename || !width || !height) {
    res.status(400).json({ error: 'Missing required parameters: filename, width, height' });
    return;
  }

  if (typeof filename !== 'string') {
    res.status(400).json({ error: 'Filename must be a string' });
    return;
  }

  const widthNum = parseInt(width as string, 10);
  const heightNum = parseInt(height as string, 10);

  if (isNaN(widthNum) || isNaN(heightNum) || widthNum <= 0 || heightNum <= 0) {
    res.status(400).json({ error: 'Width and height must be positive numbers' });
    return;
  }

  next();
};

export const processImage = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const { filename, width, height } = req.query;
    const widthNum = parseInt(width as string, 10);
    const heightNum = parseInt(height as string, 10);

    const inputPath = path.join(__dirname, '../../frontend/public/images', filename as string);
    const outputPath = path.join(
      __dirname,
      '../../frontend/public/thumbnails',
      `${filename}-${width}x${height}.jpg`,
    );

    if (fs.existsSync(outputPath)) {
      res.sendFile(outputPath);
      return;
    }

    if (!fs.existsSync(inputPath)) {
      res.status(404).json({ error: 'Image not found' });
      return;
    }

    await sharp(inputPath).resize(widthNum, heightNum).toFormat('jpeg').toFile(outputPath);

    res.sendFile(outputPath);
  } catch (error) {
    next(error);
  }
};
