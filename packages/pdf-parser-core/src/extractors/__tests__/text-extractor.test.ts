/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { TextExtractor } from '../text-extractor';

describe('TextExtractor', () => {
  let extractor: TextExtractor;

  beforeEach(() => {
    extractor = new TextExtractor();
  });

  describe('constructor', () => {
    it('should create extractor instance', () => {
      expect(extractor).toBeDefined();
      expect(extractor).toBeInstanceOf(TextExtractor);
    });
  });

  describe('extract', () => {
    it('should throw error for invalid buffer', async () => {
      const invalidBuffer = Buffer.from('not a pdf');

      await expect(extractor.extract(invalidBuffer)).rejects.toThrow();
    });

    it('should accept extraction options', async () => {
      const invalidBuffer = Buffer.from('not a pdf');

      // Test with different strategies
      await expect(extractor.extract(invalidBuffer, { strategy: 'raw' })).rejects.toThrow();

      await expect(extractor.extract(invalidBuffer, { strategy: 'formatted' })).rejects.toThrow();

      await expect(extractor.extract(invalidBuffer, { strategy: 'clean' })).rejects.toThrow();
    });
  });
});
