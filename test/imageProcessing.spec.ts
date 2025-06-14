const sharp = require('sharp');
const path = require('path');
const fs = require('fs');

describe('Image Processing Utility', () => {
  const inputPath = path.join(__dirname, '../../src/frontend/public/images/test.jpg');
  const outputPath = path.join(__dirname, '../../src/frontend/public/thumbnails/test-100x100.jpg');

  afterAll(() => {
    if (fs.existsSync(outputPath)) {
      fs.unlinkSync(outputPath);
    }
  });

  it('should resize an image and save it to disk', async () => {
    // This test expects test.jpg to exist in the images folder
    if (!fs.existsSync(inputPath)) {
      pending('No test.jpg found in images folder');
      return;
    }
    await sharp(inputPath)
      .resize(100, 100)
      .toFormat('jpeg')
      .toFile(outputPath);
    expect(fs.existsSync(outputPath)).toBeTrue();
  });
});
