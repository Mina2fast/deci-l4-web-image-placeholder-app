import supertest from 'supertest';
// @ts-ignore
import app from '../backend/server.js';
describe('API Endpoint Tests', () => {
    it('GET /api/image should return 400 if missing params', async () => {
        const res = await supertest(app).get('/api/image');
        expect(res.status).toBe(400);
    });
    it('GET /api/image?filename=test&width=200&height=200 should return 404 for missing image', async () => {
        const res = await supertest(app).get('/api/image?filename=notfound&width=200&height=200');
        expect(res.status).toBe(404);
    });
    it('POST /api/upload should reject empty form', async () => {
        const res = await supertest(app).post('/api/upload');
        expect(res.status).toBeGreaterThanOrEqual(400);
    });
});
