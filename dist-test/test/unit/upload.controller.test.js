"use strict";
// tests/upload.controller.test.ts
describe('POST /api/images/upload', () => {
    const request = require('supertest');
    const path = require('path');
    const fs = require('fs');
    const app = require('../../src/backend/server.js').default;
    const imagePath = path.join(__dirname, 'test-image.jpg');
    const resizedImagePath = path.join(__dirname, '../../../src/frontend/public/images/resized/test-image-300x300.jpg');
    beforeAll(() => {
        if (!fs.existsSync(imagePath)) {
            throw new Error('Test image not found: ' + imagePath);
        }
    });
    afterAll(() => {
        if (fs.existsSync(resizedImagePath)) {
            fs.unlinkSync(resizedImagePath);
        }
    });
    it('should upload and resize the image', async () => {
        const response = await request(app)
            .post('/api/images/upload')
            .field('width', '300')
            .field('height', '300')
            .attach('image', imagePath);
        expect(response.status).toBe(200);
        expect(response.body.resizedImagePath).toBeDefined();
        const outputPath = path.join(__dirname, '../../../src/frontend/public', response.body.resizedImagePath);
        expect(fs.existsSync(outputPath)).toBe(true);
    });
    it('should return 400 if no file is uploaded', async () => {
        const response = await request(app)
            .post('/api/images/upload')
            .field('width', '300')
            .field('height', '300');
        expect(response.status).toBe(400);
        expect(response.body.error).toBe('No file uploaded');
    });
    it('should return 400 for invalid file type', async () => {
        const invalidPath = path.join(__dirname, 'invalid.txt');
        fs.writeFileSync(invalidPath, 'not an image');
        const response = await request(app)
            .post('/api/images/upload')
            .field('width', '300')
            .field('height', '300')
            .attach('image', invalidPath);
        expect(response.status).toBe(400);
        expect(response.body.error).toBe('Only image files are allowed!');
        fs.unlinkSync(invalidPath);
    });
});
