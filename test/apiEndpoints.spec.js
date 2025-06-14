"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const supertest_1 = __importDefault(require("supertest"));
const server_1 = __importDefault(require("../src/backend/server"));
describe('API Endpoint Tests', () => {
    it('GET /api/image should return 400 if missing params', async () => {
        const res = await (0, supertest_1.default)(server_1.default).get('/api/image');
        expect(res.status).toBe(400);
    });
    it('GET /api/image?filename=test&width=200&height=200 should return 404 for missing image', async () => {
        const res = await (0, supertest_1.default)(server_1.default).get('/api/image?filename=notfound&width=200&height=200');
        expect(res.status).toBe(404);
    });
    it('POST /api/upload should reject empty form', async () => {
        const res = await (0, supertest_1.default)(server_1.default).post('/api/upload');
        expect(res.status).toBeGreaterThanOrEqual(400);
    });
});
