/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { PDFParser } from '../parser';
import { join } from 'path';

describe('PDFParser Integration Tests', () => {
  let parser: PDFParser;
  const testPdfPath = join(__dirname, '../../../../tests/fixtures/test.pdf');

  beforeEach(() => {
    parser = new PDFParser();
  });

  describe('extractText with real PDF', () => {
    it('should extract text from real PDF file', async () => {
      const result = await parser.extractText(testPdfPath);

      expect(result).toBeDefined();
      expect(typeof result).toBe('string');
      expect(result.length).toBeGreaterThan(0);
    });

    it('should extract text with formatted strategy', async () => {
      const result = await parser.extractText(testPdfPath, {
        strategy: 'formatted',
      });

      expect(result).toBeDefined();
      expect(typeof result).toBe('string');
      expect(result.length).toBeGreaterThan(0);
    });

    it('should extract text with clean strategy', async () => {
      const result = await parser.extractText(testPdfPath, {
        strategy: 'clean',
      });

      expect(result).toBeDefined();
      expect(typeof result).toBe('string');
      expect(result.length).toBeGreaterThan(0);
    });
  });

  describe('getMetadata with real PDF', () => {
    it('should extract metadata from real PDF', async () => {
      const result = await parser.getMetadata(testPdfPath);

      expect(result).toBeDefined();
      expect(result.info).toBeDefined();
      expect(result.metadata).toBeDefined();
      expect(result.metadata.pageCount).toBeGreaterThan(0);
      expect(result.metadata.fileSize).toBeGreaterThan(0);
    });
  });

  describe('extractPage with real PDF', () => {
    it('should extract first page', async () => {
      const result = await parser.extractPage(testPdfPath, 1);

      expect(result).toBeDefined();
      expect(typeof result).toBe('string');
      expect(result.length).toBeGreaterThan(0);
    });
  });

  describe('extractRange with real PDF', () => {
    it('should extract page range', async () => {
      const result = await parser.extractRange(testPdfPath, '1-1');

      expect(result).toBeDefined();
      expect(typeof result).toBe('string');
      expect(result.length).toBeGreaterThan(0);
    });
  });

  describe('search with real PDF', () => {
    it('should search for keywords', async () => {
      const results = await parser.search(testPdfPath, 'the');

      expect(Array.isArray(results)).toBe(true);
    });

    it('should handle empty search results', async () => {
      const results = await parser.search(testPdfPath, 'xyznonexistent123');

      expect(Array.isArray(results)).toBe(true);
      expect(results.length).toBe(0);
    });
  });
});
