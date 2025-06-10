import { Request, Response } from 'express';
import path from 'path';
import fs from 'fs';

export const uploadImage = (req: Request, res: Response) => {
  if (!req.file) {
    return res.status(400).json({
      error: 'No file uploaded',
    });
  }

  res.status(201).json({
    message: 'File uploaded successfully',
    filename: req.file.filename,
  });
};

export const getImagesList = (req: Request, res: Response) => {
  const imagesDir = path.join(__dirname, '../../../frontend/public/images');

  fs.readdir(imagesDir, (err, files) => {
    if (err) {
      return res.status(500).json({
        error: 'Error reading images directory',
      });
    }

    const imageFiles = files.filter((file) => {
      const ext = path.extname(file).toLowerCase();
      return ['.jpg', '.jpeg', '.png'].includes(ext);
    });

    res.json(imageFiles);
  });
};