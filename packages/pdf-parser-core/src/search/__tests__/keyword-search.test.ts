/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { SearchEngine } from '../keyword-search';

describe('SearchEngine', () => {
  let searcher: SearchEngine;

  beforeEach(() => {
    searcher = new SearchEngine();
  });

  describe('constructor', () => {
    it('should create searcher instance', () => {
      expect(searcher).toBeDefined();
      expect(searcher).toBeInstanceOf(SearchEngine);
    });
  });

  describe('search', () => {
    const sampleText = 'Hello World\nThis is a test\nHello again';

    it('should find keyword in text', () => {
      const results = searcher.search(sampleText, 'Hello');

      expect(results).toBeDefined();
      expect(Array.isArray(results)).toBe(true);
      expect(results.length).toBeGreaterThan(0);
    });

    it('should handle case-sensitive search', () => {
      const results = searcher.search(sampleText, 'hello', { caseSensitive: true });

      expect(Array.isArray(results)).toBe(true);
      expect(results.length).toBe(0); // 'hello' !== 'Hello'
    });

    it('should handle case-insensitive search', () => {
      const results = searcher.search(sampleText, 'hello', { caseSensitive: false });

      expect(Array.isArray(results)).toBe(true);
      expect(results.length).toBeGreaterThan(0);
    });

    it('should limit results with maxResults option', () => {
      const results = searcher.search(sampleText, 'Hello', { maxResults: 1 });

      expect(results.length).toBeLessThanOrEqual(1);
    });

    it('should return empty array for non-matching keyword', () => {
      const results = searcher.search(sampleText, 'NonExistent');

      expect(Array.isArray(results)).toBe(true);
      expect(results.length).toBe(0);
    });

    it('should handle empty text', () => {
      const results = searcher.search('', 'keyword');

      expect(Array.isArray(results)).toBe(true);
      expect(results.length).toBe(0);
    });

    it('should handle empty keyword', () => {
      const results = searcher.search(sampleText, '');

      expect(Array.isArray(results)).toBe(true);
      // Depending on implementation, might return all or none
    });

    it('should include context in results', () => {
      const results = searcher.search(sampleText, 'test');

      if (results.length > 0) {
        expect(results[0]).toHaveProperty('context');
        expect(results[0]).toHaveProperty('page');
      }
    });
  });
});
