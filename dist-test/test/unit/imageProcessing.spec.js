"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sharp_1 = __importDefault(require("sharp"));
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
describe('Image Processing Utility', () => {
    const inputPath = path_1.default.join(__dirname, '../../src/frontend/public/images/test.jpg');
    const outputPath = path_1.default.join(__dirname, '../../src/frontend/public/thumbnails/test-100x100.jpg');
    afterAll(() => {
        if (fs_1.default.existsSync(outputPath)) {
            fs_1.default.unlinkSync(outputPath);
        }
    });
    it('should resize an image and save it to disk', async () => {
        // This test expects test.jpg to exist in the images folder
        if (!fs_1.default.existsSync(inputPath)) {
            // eslint-disable-next-line no-undef
            pending('No test.jpg found in images folder');
            return;
        }
        await (0, sharp_1.default)(inputPath)
            .resize(100, 100)
            .toFormat('jpeg')
            .toFile(outputPath);
        expect(fs_1.default.existsSync(outputPath)).toBeTrue();
    });
});
