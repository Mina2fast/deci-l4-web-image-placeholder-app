const { uploadImage } = require('../dist/backend/controllers/upload.controller.js');

describe('Upload Controller', () => {
  it('should return 400 if no file is uploaded', async () => {
    const req = { file: undefined };
    const res = { status: jasmine.createSpy('status').and.returnValue({ json: jasmine.createSpy('json') }) };
    const next = jasmine.createSpy('next');

    await uploadImage(req, res, next);
    expect(res.status).toHaveBeenCalledWith(400);
  });
});
