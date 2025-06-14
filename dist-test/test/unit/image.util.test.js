"use strict";
describe('fileFilter', () => {
    const { fileFilter } = require('../../src/backend/utilities/image.util.js');
    it('should accept valid image files', () => {
        const req = {};
        const file = { originalname: 'image.jpg' };
        const cb = jasmine.createSpy('cb');
        fileFilter(req, file, cb);
        expect(cb).toHaveBeenCalledWith(null, true);
    });
    it('should reject invalid file types', () => {
        const req = {};
        const file = { originalname: 'document.pdf' };
        const cb = jasmine.createSpy('cb');
        fileFilter(req, file, cb);
        expect(cb).toHaveBeenCalledWith(null, false);
    });
});
