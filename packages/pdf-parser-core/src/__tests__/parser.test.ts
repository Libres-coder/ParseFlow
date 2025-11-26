/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { PDFParser } from '../parser';

describe('PDFParser', () => {
  let parser!: PDFParser;

  beforeEach(() => {
    parser = new PDFParser();
  });

  describe('constructor', () => {
    it('should create a parser instance with default config', () => {
      expect(parser).toBeDefined();
      expect(parser).toBeInstanceOf(PDFParser);
    });

    it('should create a parser instance with custom config', () => {
      const customParser = new PDFParser({
        security: {
          maxFileSize: 10 * 1024 * 1024, // 10MB
          allowedPaths: ['/allowed'],
        },
      });

      expect(customParser).toBeDefined();
      expect(customParser).toBeInstanceOf(PDFParser);
    });
  });

  describe('extractPage validation', () => {
    it('should throw error for invalid page number (0)', async () => {
      await expect(parser.extractPage('test.pdf', 0)).rejects.toThrow('Page number must be >= 1');
    });

    it('should throw error for negative page number', async () => {
      await expect(parser.extractPage('test.pdf', -1)).rejects.toThrow('Page number must be >= 1');
    });
  });

  describe('extractRange validation', () => {
    it('should throw error for invalid range format', async () => {
      await expect(parser.extractRange('test.pdf', 'invalid')).rejects.toThrow('Invalid range');
    });

    it('should throw error for reversed range', async () => {
      await expect(parser.extractRange('test.pdf', '5-1')).rejects.toThrow('Invalid range');
    });

    it('should throw error for zero start page', async () => {
      await expect(parser.extractRange('test.pdf', '0-5')).rejects.toThrow('Invalid range');
    });
  });

  describe('extractImages', () => {
    it('should reject with not implemented error', async () => {
      await expect(parser.extractImages('test.pdf', '/tmp/output')).rejects.toThrow(
        'not implemented'
      );
    });
  });

  describe('getTOC', () => {
    it('should return empty array (not implemented)', async () => {
      const result = await parser.getTOC('test.pdf');

      expect(Array.isArray(result)).toBe(true);
      expect(result.length).toBe(0);
    });
  });
});
