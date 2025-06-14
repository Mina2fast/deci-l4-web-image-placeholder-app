"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const supertest_1 = __importDefault(require("supertest"));
const server_mjs_1 = __importDefault(require("../../src/backend/server.mjs"));
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
describe('API Routes Integration Tests', () => {
    const testImagePath = path_1.default.join(__dirname, '../../src/frontend/public/images/test.jpg');
    const thumbnailsDir = path_1.default.join(__dirname, '../../src/frontend/public/thumbnails');
    beforeAll(() => {
        // Create test image if it doesn't exist
        if (!fs_1.default.existsSync(testImagePath)) {
            fs_1.default.writeFileSync(testImagePath, 'test image content');
        }
        // Ensure thumbnails directory exists
        if (!fs_1.default.existsSync(thumbnailsDir)) {
            fs_1.default.mkdirSync(thumbnailsDir, { recursive: true });
        }
    });
    afterAll(() => {
        // Clean up test files
        if (fs_1.default.existsSync(testImagePath)) {
            fs_1.default.unlinkSync(testImagePath);
        }
        const testThumbnail = path_1.default.join(thumbnailsDir, 'test-100x100.jpg');
        if (fs_1.default.existsSync(testThumbnail)) {
            fs_1.default.unlinkSync(testThumbnail);
        }
    });
    describe('GET /api/images', () => {
        it('should return 400 if parameters are missing', async () => {
            const response = await (0, supertest_1.default)(server_mjs_1.default).get('/api/images');
            expect(response.status).toBe(400);
        });
        it('should return 400 if width or height are invalid', async () => {
            const response = await (0, supertest_1.default)(server_mjs_1.default)
                .get('/api/images')
                .query({ filename: 'test.jpg', width: 'abc', height: 'def' });
            expect(response.status).toBe(400);
        });
        it('should return 404 if image does not exist', async () => {
            const response = await (0, supertest_1.default)(server_mjs_1.default)
                .get('/api/images')
                .query({ filename: 'nonexistent.jpg', width: '100', height: '100' });
            expect(response.status).toBe(404);
        });
        it('should process and return the resized image', async () => {
            const response = await (0, supertest_1.default)(server_mjs_1.default)
                .get('/api/images')
                .query({ filename: 'test.jpg', width: '100', height: '100' });
            expect(response.status).toBe(200);
            expect(response.headers['content-type']).toMatch(/image/);
        });
    });
    describe('POST /api/upload', () => {
        it('should return 400 if no file is uploaded', async () => {
            const response = await (0, supertest_1.default)(server_mjs_1.default).post('/api/upload');
            expect(response.status).toBe(400);
        });
    });
    describe('GET /api/images-list', () => {
        it('should return a list of images', async () => {
            const response = await (0, supertest_1.default)(server_mjs_1.default).get('/api/images-list');
            expect(response.status).toBe(200);
            expect(Array.isArray(response.body)).toBe(true);
        });
    });
});
