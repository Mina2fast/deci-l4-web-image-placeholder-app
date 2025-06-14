"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.processImage = exports.validateImageParams = void 0;
const sharp_1 = __importDefault(require("sharp"));
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
const validateImageParams = (req, res, next) => {
    const { filename, width, height } = req.query;
    if (!filename || !width || !height) {
        res.status(400).json({ error: 'Missing required parameters: filename, width, height' });
        return;
    }
    if (typeof filename !== 'string') {
        res.status(400).json({ error: 'Filename must be a string' });
        return;
    }
    const widthNum = parseInt(width, 10);
    const heightNum = parseInt(height, 10);
    if (isNaN(widthNum) || isNaN(heightNum) || widthNum <= 0 || heightNum <= 0) {
        res.status(400).json({ error: 'Width and height must be positive numbers' });
        return;
    }
    next();
};
exports.validateImageParams = validateImageParams;
const processImage = async (req, res, next) => {
    try {
        const { filename, width, height } = req.query;
        const widthNum = parseInt(width, 10);
        const heightNum = parseInt(height, 10);
        const inputPath = path_1.default.join(__dirname, '../../frontend/public/images', filename);
        const outputPath = path_1.default.join(__dirname, '../../frontend/public/thumbnails', `${filename}-${width}x${height}.jpg`);
        if (fs_1.default.existsSync(outputPath)) {
            res.sendFile(outputPath);
            return;
        }
        if (!fs_1.default.existsSync(inputPath)) {
            res.status(404).json({ error: 'Image not found' });
            return;
        }
        await (0, sharp_1.default)(inputPath).resize(widthNum, heightNum).toFormat('jpeg').toFile(outputPath);
        res.sendFile(outputPath);
    }
    catch (error) {
        next(error);
    }
};
exports.processImage = processImage;
