import multer from 'multer';
import imageUtil from '../../src/backend/utilities/image.util';

describe('Image Utility', () => {
  it('should be configured as a Multer instance', () => {
    expect(imageUtil).toBeInstanceOf(multer);
  });

  // Additional tests for file filter and storage configuration would go here
});