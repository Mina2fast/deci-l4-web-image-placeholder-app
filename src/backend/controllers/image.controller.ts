import { Request, Response, NextFunction } from 'express';
import sharp from 'sharp';
import path from 'path';
import fs from 'fs';

export const validateImageParams = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const { filename, width, height } = req.query;

  if (!filename || !width || !height) {
    return res.status(400).json({
      error: 'Missing required parameters: filename, width, height',
    });
  }

  const widthNum = parseInt(width as string);
  const heightNum = parseInt(height as string);

  if (isNaN(widthNum) || isNaN(heightNum) || widthNum <= 0 || heightNum <= 0) {
    return res.status(400).json({
      error: 'Width and height must be positive numbers',
    });
  }

  next();
};

export const processImage = async (req: Request, res: Response) => {
  try {
    const { filename, width, height } = req.query;
    const widthNum = parseInt(width as string);
    const heightNum = parseInt(height as string);

    const inputPath = path.join(
      __dirname,
      '../../../frontend/public/images',
      filename as string,
    );
    const outputPath = path.join(
      __dirname,
      '../../../frontend/public/thumbnails',
      `${filename}-${width}x${height}.jpg`,
    );

    // Check if resized image already exists
    if (fs.existsSync(outputPath)) {
      return res.sendFile(outputPath);
    }

    // Check if original image exists
    if (!fs.existsSync(inputPath)) {
      return res.status(404).json({
        error: 'Image not found',
      });
    }

    // Resize and save image
    await sharp(inputPath)
      .resize(widthNum, heightNum)
      .toFormat('jpeg')
      .toFile(outputPath);

    res.sendFile(outputPath);
  } catch (error) {
    console.error('Image processing error:', error);
    res.status(500).json({
      error: 'Error processing image',
    });
  }
};