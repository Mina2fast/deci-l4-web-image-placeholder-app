"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const upload_controller_1 = require("../../src/backend/controllers/upload.controller");
describe('Upload Controller', () => {
    it('should return 400 if no file is uploaded', async () => {
        const req = { file: undefined };
        const res = { status: jasmine.createSpy('status').and.returnValue({ json: jasmine.createSpy('json') }) };
        const next = jasmine.createSpy('next');
        await (0, upload_controller_1.uploadImage)(req, res, next);
        expect(res.status).toHaveBeenCalledWith(400);
    });
});
