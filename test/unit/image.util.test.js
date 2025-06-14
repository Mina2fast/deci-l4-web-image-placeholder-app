"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const image_util_mjs_1 = require("../../src/backend/utilities/image.util.mjs");
describe('fileFilter', () => {
    it('should accept valid image files', () => {
        const req = {};
        const file = { originalname: 'image.jpg' };
        const cb = jasmine.createSpy('cb');
        (0, image_util_mjs_1.fileFilter)(req, file, cb);
        expect(cb).toHaveBeenCalledWith(null, true);
    });
    it('should reject invalid file types', () => {
        const req = {};
        const file = { originalname: 'document.pdf' };
        const cb = jasmine.createSpy('cb');
        (0, image_util_mjs_1.fileFilter)(req, file, cb);
        expect(cb).toHaveBeenCalled();
        const [error, result] = cb.calls.mostRecent().args;
        expect(error instanceof Error).toBeTrue();
        expect(error.message).toBe('Only JPG, JPEG and PNG images are allowed');
        expect(result).toBeFalse();
    });
});
