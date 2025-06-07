import multer from 'multer';
import path from 'path';

const storage = multer.diskStorage({
  destination: function (_req, _file, cb) {
    cb(null, path.join(__dirname, '../images'));
  },
  filename: function (_req, file, cb) {
    cb(null, file.originalname);
  },
});

const fileFilter = (_req: any, file: Express.Multer.File, cb: any) => {
  if (file.mimetype === 'image/jpeg') {
    cb(null, true);
  } else {
    cb(new Error('Only .jpg files are allowed'), false);
  }
};

const upload = multer({ storage: storage, fileFilter: fileFilter });

export default upload;
