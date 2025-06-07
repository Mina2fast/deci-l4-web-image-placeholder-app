import multer, { FileFilterCallback } from 'multer';
import path from 'path';
import { Request } from 'express';

// Storage configuration
const storage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    cb(null, path.join(__dirname, '../images'));
  },
  filename: (_req, file, cb) => {
    cb(null, file.originalname);
  },
});

// File filter configuration
const fileFilter = (_req: Request, file: Express.Multer.File, cb: FileFilterCallback): void => {
  if (file.mimetype === 'image/jpeg') {
    cb(null, true);
  } else {
    cb(null, false);
  }
};

// Multer middleware instance
const upload = multer({ storage, fileFilter });

export default upload;



