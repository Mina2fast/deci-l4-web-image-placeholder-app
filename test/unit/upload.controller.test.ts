import { Request, Response } from 'express';
import { uploadImage, getImagesList } from '../../src/backend/controllers/upload.controller';
import fs from 'fs';
import path from 'path';

describe('Upload Controller', () => {
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;
  let responseObject: any;

  beforeEach(() => {
    mockRequest = {};
    mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockImplementation((result) => {
        responseObject = result;
      }),
    };
  });

  describe('uploadImage', () => {
    it('should return 400 if no file is uploaded', () => {
      uploadImage(mockRequest as Request, mockResponse as Response);
      expect(mockResponse.status).toHaveBeenCalledWith(400);
      expect(responseObject.error).toBe('No file uploaded');
    });

    // Additional tests for successful upload would go here
  });

  describe('getImagesList', () => {
    it('should handle directory read error', () => {
      jest.spyOn(fs, 'readdir').mockImplementation((path, callback) => {
        callback(new Error('Test error'), []);
      });

      getImagesList(mockRequest as Request, mockResponse as Response);
      expect(mockResponse.status).toHaveBeenCalledWith(500);
      expect(responseObject.error).toBe('Error reading images directory');
    });

    // Additional tests for successful directory listing would go here
  });
});