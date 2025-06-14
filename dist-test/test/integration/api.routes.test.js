"use strict";
describe('API Routes Integration Tests', () => {
    const request = require('supertest');
    const app = require('../../src/backend/server.js').default;
    const path = require('path');
    const fs = require('fs');
    const testImagePath = path.join(__dirname, '../../../src/frontend/public/images/test.jpg');
    const thumbnailsDir = path.join(__dirname, '../../../src/frontend/public/thumbnails');
    beforeAll(() => {
        // Create test image if it doesn't exist
        if (!fs.existsSync(testImagePath)) {
            fs.writeFileSync(testImagePath, 'test image content');
        }
        // Ensure thumbnails directory exists
        if (!fs.existsSync(thumbnailsDir)) {
            fs.mkdirSync(thumbnailsDir, { recursive: true });
        }
    });
    afterAll(() => {
        // Clean up test files
        if (fs.existsSync(testImagePath)) {
            fs.unlinkSync(testImagePath);
        }
        const testThumbnail = path.join(thumbnailsDir, 'test-100x100.jpg');
        if (fs.existsSync(testThumbnail)) {
            fs.unlinkSync(testThumbnail);
        }
    });
    describe('GET /api/images', () => {
        it('should return 404 if parameters are missing', async () => {
            const response = await request(app).get('/api/images');
            expect(response.status).toBe(404);
        });
        it('should return 404 if width or height are invalid', async () => {
            const response = await request(app)
                .get('/api/images')
                .query({ filename: 'test', width: 'abc', height: '100' });
            expect(response.status).toBe(404);
        });
        it('should process and return the resized image', async () => {
            const response = await request(app)
                .get('/api/images')
                .query({ filename: 'test', width: '100', height: '100' });
            expect(response.status).toBe(200);
            expect(response.headers['content-type']).toMatch(/image/);
        });
    });
    describe('POST /api/upload', () => {
        it('should return 400 if no file is uploaded', async () => {
            const response = await request(app).post('/api/upload');
            expect(response.status).toBe(400);
        });
    });
    describe('GET /api/images-list', () => {
        it('should return a list of images', async () => {
            const response = await request(app).get('/api/images-list');
            expect(response.status).toBe(200);
            expect(Array.isArray(response.body)).toBe(true);
        });
    });
});
