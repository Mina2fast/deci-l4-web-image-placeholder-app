import { Request, Response } from 'express';
import path from 'path';
import fs from 'fs';
import sharp from 'sharp';

export const resizeImage = async (req: Request, res: Response) => {
  const { filename, width, height } = req.query;

  if (!filename || !width || !height) {
    return res.status(400).send('Missing required parameters');
  }

  const imgName = filename.toString();
  const w = parseInt(width.toString());
  const h = parseInt(height.toString());

  if (isNaN(w) || isNaN(h)) {
    return res.status(400).send('Invalid width or height');
  }

  const inputPath = path.join(__dirname, '../images', imgName);
  const outputName = `${imgName.split('.')[0]}_${w}x${h}.jpg`;
  const outputPath = path.join(__dirname, '../cache', outputName);

  if (fs.existsSync(outputPath)) {
    return res.sendFile(outputPath);
  }

  try {
    await sharp(inputPath).resize(w, h).toFile(outputPath);
    return res.sendFile(outputPath);
  } catch (err) {
    return res.status(500).send('Image processing failed');
  }
};
