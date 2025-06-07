import supertest from 'supertest';
import app from '../backend/app'; // Needs small refactor to export app

describe('Image API', () => {
  it('should return 400 if missing parameters', async () => {
    const res = await supertest(app).get('/api/images');
    expect(res.status).toBe(400);
  });
});
