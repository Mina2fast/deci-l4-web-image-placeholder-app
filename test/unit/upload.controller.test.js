"use strict";
// tests/upload.controller.test.ts
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const supertest_1 = __importDefault(require("supertest"));
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
const server_mts_1 = __importDefault(require("../../src/backend/server.mts"));
describe('POST /api/images/upload', () => {
    const imagePath = path_1.default.join(__dirname, 'test-image.jpg');
    const resizedImagePath = path_1.default.join(__dirname, '../../public/images/resized/test-image-300x300.jpg');
    beforeAll(() => {
        if (!fs_1.default.existsSync(imagePath)) {
            throw new Error('Test image not found: ' + imagePath);
        }
    });
    afterAll(() => {
        if (fs_1.default.existsSync(resizedImagePath)) {
            fs_1.default.unlinkSync(resizedImagePath);
        }
    });
    it('should upload and resize the image', async () => {
        const response = await (0, supertest_1.default)(server_mts_1.default)
            .post('/api/images/upload')
            .field('width', '300')
            .field('height', '300')
            .attach('image', imagePath);
        expect(response.status).toBe(200);
        // ✅ Use this if you're getting `toHaveProperty` errors in Jasmine:
        expect(response.body.resizedImagePath).toBeDefined();
        const outputPath = path_1.default.join(__dirname, '../../public', response.body.resizedImagePath);
        expect(fs_1.default.existsSync(outputPath)).toBe(true);
    });
    it('should return 400 if no file is uploaded', async () => {
        const response = await (0, supertest_1.default)(server_mts_1.default)
            .post('/api/images/upload')
            .field('width', '300')
            .field('height', '300');
        expect(response.status).toBe(400);
        expect(response.body.error).toBe('No file uploaded');
    });
    it('should return 400 for invalid file type', async () => {
        const invalidPath = path_1.default.join(__dirname, 'invalid.txt');
        fs_1.default.writeFileSync(invalidPath, 'not an image');
        const response = await (0, supertest_1.default)(server_mts_1.default)
            .post('/api/images/upload')
            .field('width', '300')
            .field('height', '300')
            .attach('image', invalidPath);
        expect(response.status).toBe(400);
        expect(response.body.error).toBe('Only image files are allowed!');
        fs_1.default.unlinkSync(invalidPath);
    });
});
