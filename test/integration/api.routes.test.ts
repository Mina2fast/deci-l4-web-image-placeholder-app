import request from 'supertest';
import app from '../../src/backend/server.mts';
import path from 'path';
import fs from 'fs';

describe('API Routes Integration Tests', () => {
  const testImagePath = path.join(__dirname, '../../src/frontend/public/images/test.jpg');
  const thumbnailsDir = path.join(__dirname, '../../src/frontend/public/thumbnails');

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
    it('should return 400 if parameters are missing', async () => {
      const response = await request(app).get('/api/images');
      expect(response.status).toBe(400);
    });

    it('should return 400 if width or height are invalid', async () => {
      const response = await request(app)
        .get('/api/images')
        .query({ filename: 'test.jpg', width: 'abc', height: 'def' });
      expect(response.status).toBe(400);
    });

    it('should return 404 if image does not exist', async () => {
      const response = await request(app)
        .get('/api/images')
        .query({ filename: 'nonexistent.jpg', width: '100', height: '100' });
      expect(response.status).toBe(404);
    });

    it('should process and return the resized image', async () => {
      const response = await request(app)
        .get('/api/images')
        .query({ filename: 'test.jpg', width: '100', height: '100' });
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