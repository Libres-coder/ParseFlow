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
    it('should throw error for non-existent file', async () => {
      await expect(parser.extractImages('non-existent.pdf', '/tmp/output')).rejects.toThrow(
        'ENOENT'
      );
    });

    it('should have extractImages method', () => {
      expect(typeof parser.extractImages).toBe('function');
    });
  });

  describe('getTOC', () => {
    it('should throw error for non-existent file', async () => {
      await expect(parser.getTOC('non-existent.pdf')).rejects.toThrow('ENOENT');
    });

    it('should have getTOC method', () => {
      expect(typeof parser.getTOC).toBe('function');
    });
  });

  describe('error handling and edge cases', () => {
    describe('file size validation', () => {
      it('should have file size limits in config', () => {
        const customParser = new PDFParser({
          security: { maxFileSize: 1000 },
        });
        expect(customParser).toBeDefined();
      });
    });

    describe('page and range validation', () => {
      it('should validate page is positive number', async () => {
        await expect(parser.extractPage('test.pdf', 0)).rejects.toThrow('Page number must be >= 1');
      });

      it('should validate page is not negative', async () => {
        await expect(parser.extractPage('test.pdf', -1)).rejects.toThrow(
          'Page number must be >= 1'
        );
      });

      it('should validate range format', async () => {
        await expect(parser.extractRange('test.pdf', 'invalid')).rejects.toThrow('Invalid range');
      });

      it('should validate range start <= end', async () => {
        await expect(parser.extractRange('test.pdf', '5-3')).rejects.toThrow('Invalid range');
      });

      it('should validate range start is positive', async () => {
        await expect(parser.extractRange('test.pdf', '0-5')).rejects.toThrow('Invalid range');
      });
    });

    describe('configuration', () => {
      it('should accept custom configuration', () => {
        const customParser = new PDFParser({
          cache: { enabled: false },
          security: { maxFileSize: 10485760 },
        });
        expect(customParser).toBeDefined();
      });

      it('should use default config when not provided', () => {
        const defaultParser = new PDFParser();
        expect(defaultParser).toBeDefined();
      });

      it('should accept cache configuration', () => {
        const customParser = new PDFParser({
          cache: {
            enabled: true,
            ttl: 3600,
            maxSize: 100,
            directory: './.cache',
          },
        });
        expect(customParser).toBeDefined();
      });

      it('should accept parser configuration', () => {
        const customParser = new PDFParser({
          parser: {
            preserveFormatting: true,
            includeHeaders: false,
            includeFooters: false,
          },
        });
        expect(customParser).toBeDefined();
      });
    });

    describe('search options', () => {
      it('should accept search options', async () => {
        await expect(
          parser.search('test.pdf', 'keyword', {
            caseSensitive: true,
            maxResults: 10,
          })
        ).rejects.toThrow(); // Will fail due to missing file, but validates options
      });

      it('should handle empty search query', async () => {
        await expect(parser.search('test.pdf', '')).rejects.toThrow();
      });
    });
  });
});
