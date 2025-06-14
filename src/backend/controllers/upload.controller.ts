import { Request, Response, NextFunction } from 'express';
import path from 'path';
import fs from 'fs';

const imagesDir = path.join(__dirname, '../../frontend/public/images');

export const uploadImage = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    if (!req.file) {
      res.status(400).json({ error: 'No file uploaded' });
      return;
    }
    res.status(201).json({
      message: 'File uploaded successfully',
      filename: req.file.filename,
    });
  } catch (error) {
    next(error);
  }
};

export const getImagesList = async (
  _req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    fs.readdir(imagesDir, (err, files) => {
      if (err) {
        next(new Error('Error reading images directory'));
        return;
      }
      const imageFiles = files.filter(
        (file) =>
          file.toLowerCase().endsWith('.jpg') ||
          file.toLowerCase().endsWith('.jpeg') ||
          file.toLowerCase().endsWith('.png'),
      );
      res.json(imageFiles);
    });
  } catch (error) {
    next(error);
  }
};
