import { fileFilter } from '../../backend/utilities/image.util.mjs';
import { Request } from 'express';

describe('fileFilter', () => {
  it('should accept valid image files', () => {
    const req = {} as Request;
    const file = { originalname: 'image.jpg' } as Express.Multer.File;
    const cb = jasmine.createSpy('cb');

    fileFilter(req, file, cb);

    expect(cb).toHaveBeenCalledWith(null, true);
  });

  it('should reject invalid file types', () => {
    const req = {} as Request;
    const file = { originalname: 'document.pdf' } as Express.Multer.File;
    const cb = jasmine.createSpy('cb');

    fileFilter(req, file, cb);

    expect(cb).toHaveBeenCalled();
    const [error, result] = cb.calls.mostRecent().args;
    expect(error instanceof Error).toBeTrue();
    expect(error.message).toBe('Only JPG, JPEG and PNG images are allowed');
    expect(result).toBeFalse();
  });
});
