/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { MetadataExtractor } from '../metadata-extractor';

describe('MetadataExtractor', () => {
  let extractor: MetadataExtractor;

  beforeEach(() => {
    extractor = new MetadataExtractor();
  });

  describe('constructor', () => {
    it('should create extractor instance', () => {
      expect(extractor).toBeDefined();
      expect(extractor).toBeInstanceOf(MetadataExtractor);
    });
  });

  describe('extract', () => {
    it('should throw error for invalid buffer', async () => {
      const invalidBuffer = Buffer.from('not a pdf');
      const fileSize = invalidBuffer.length;
      
      await expect(extractor.extract(invalidBuffer, fileSize))
        .rejects.toThrow();
    });

    it('should handle empty buffer', async () => {
      const emptyBuffer = Buffer.from('');
      const fileSize = emptyBuffer.length;
      
      await expect(extractor.extract(emptyBuffer, fileSize))
        .rejects.toThrow();
    });

    it('should accept file size parameter', async () => {
      const buffer = Buffer.from('test');
      const fileSize = 1000;
      
      await expect(extractor.extract(buffer, fileSize))
        .rejects.toThrow(); // Will fail for invalid PDF
    });
  });
});
