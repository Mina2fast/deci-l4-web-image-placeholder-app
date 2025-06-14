"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getImagesList = exports.uploadImage = void 0;
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
const imagesDir = path_1.default.join(__dirname, '../../frontend/public/images');
const uploadImage = async (req, res, next) => {
    try {
        if (!req.file) {
            res.status(400).json({ error: 'No file uploaded' });
            return;
        }
        res.status(201).json({
            message: 'File uploaded successfully',
            filename: req.file.filename,
        });
    }
    catch (error) {
        next(error);
    }
};
exports.uploadImage = uploadImage;
const getImagesList = async (_req, res, next) => {
    try {
        fs_1.default.readdir(imagesDir, (err, files) => {
            if (err) {
                next(new Error('Error reading images directory'));
                return;
            }
            const imageFiles = files.filter((file) => file.toLowerCase().endsWith('.jpg') ||
                file.toLowerCase().endsWith('.jpeg') ||
                file.toLowerCase().endsWith('.png'));
            res.json(imageFiles);
        });
    }
    catch (error) {
        next(error);
    }
};
exports.getImagesList = getImagesList;
