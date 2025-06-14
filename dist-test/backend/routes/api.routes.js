"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const image_controller_1 = require("../controllers/image.controller");
const upload_controller_1 = require("../controllers/upload.controller");
const image_util_1 = __importDefault(require("../utilities/image.util"));
const router = (0, express_1.Router)();
router.get('/image', image_controller_1.validateImageParams, image_controller_1.processImage);
router.get('/images-list', upload_controller_1.getImagesList);
router.post('/upload', image_util_1.default.single('image'), upload_controller_1.uploadImage);
exports.default = router;
