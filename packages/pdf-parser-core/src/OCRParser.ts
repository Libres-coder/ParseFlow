import { createWorker, Worker } from 'tesseract.js';
import * as fs from 'fs/promises';

export interface OCRExtractOptions {
  language?: string;
  preserveLayout?: boolean;
}

export interface OCRExtractResult {
  text: string;
  confidence: number;
  words?: Array<{
    text: string;
    confidence: number;
    bbox: { x0: number; y0: number; x1: number; y1: number };
  }>;
  metadata: {
    language: string;
    extractedAt: string;
  };
}

export interface OCRSearchResult {
  text: string;
  confidence: number;
  position: number;
  context: string;
  bbox?: { x0: number; y0: number; x1: number; y1: number };
}

export class OCRParser {
  private worker: Worker | null = null;
  private currentLanguage: string = 'eng';

  /**
   * Initialize the OCR worker
   */
  private async getWorker(language: string = 'eng'): Promise<Worker> {
    if (this.worker && this.currentLanguage === language) {
      return this.worker;
    }

    if (this.worker) {
      await this.worker.terminate();
    }

    this.worker = await createWorker(language);
    this.currentLanguage = language;
    return this.worker;
  }

  /**
   * Extract text from an image file using OCR
   */
  async extractText(
    filePath: string,
    options: OCRExtractOptions = {}
  ): Promise<OCRExtractResult> {
    const { language = 'eng', preserveLayout = false } = options;

    try {
      // Verify file exists
      await fs.access(filePath);

      const worker = await this.getWorker(language);
      
      const result = await worker.recognize(filePath);
      
      // Extract words from result if available
      const resultData = result.data as { text: string; confidence: number; words?: Array<{ text: string; confidence: number; bbox: { x0: number; y0: number; x1: number; y1: number } }> };
      const words = resultData.words?.map((word: { text: string; confidence: number; bbox: { x0: number; y0: number; x1: number; y1: number } }) => ({
        text: word.text,
        confidence: word.confidence,
        bbox: word.bbox,
      }));

      let text = result.data.text;
      
      // Clean up text if not preserving layout
      if (!preserveLayout) {
        text = text
          .replace(/\n{3,}/g, '\n\n')
          .replace(/[ \t]+/g, ' ')
          .trim();
      }

      return {
        text,
        confidence: result.data.confidence,
        words,
        metadata: {
          language,
          extractedAt: new Date().toISOString(),
        },
      };
    } catch (error) {
      throw new Error(
        `Failed to extract text from image: ${
          error instanceof Error ? error.message : String(error)
        }`
      );
    }
  }

  /**
   * Extract text from multiple images
   */
  async extractFromMultiple(
    filePaths: string[],
    options: OCRExtractOptions = {}
  ): Promise<{ results: OCRExtractResult[]; combinedText: string }> {
    const results: OCRExtractResult[] = [];
    let combinedText = '';

    for (let i = 0; i < filePaths.length; i++) {
      const result = await this.extractText(filePaths[i], options);
      results.push(result);
      combinedText += `--- Page ${i + 1} ---\n${result.text}\n\n`;
    }

    return {
      results,
      combinedText: combinedText.trim(),
    };
  }

  /**
   * Search for text in an image
   */
  async searchText(
    filePath: string,
    query: string,
    caseSensitive: boolean = false,
    language: string = 'eng'
  ): Promise<OCRSearchResult[]> {
    const result = await this.extractText(filePath, { language });
    const results: OCRSearchResult[] = [];

    const searchText = caseSensitive ? result.text : result.text.toLowerCase();
    const searchQuery = caseSensitive ? query : query.toLowerCase();

    let position = 0;
    let index = searchText.indexOf(searchQuery, position);

    while (index !== -1) {
      // Get context around the match
      const contextStart = Math.max(0, index - 50);
      const contextEnd = Math.min(result.text.length, index + query.length + 50);
      const context = result.text.slice(contextStart, contextEnd);

      // Find word with matching position if available
      const matchingWord = result.words?.find(
        (w) =>
          w.text.toLowerCase().includes(searchQuery) ||
          searchQuery.includes(w.text.toLowerCase())
      );

      results.push({
        text: result.text.slice(index, index + query.length),
        confidence: matchingWord?.confidence ?? result.confidence,
        position: index,
        context: (contextStart > 0 ? '...' : '') + context + (contextEnd < result.text.length ? '...' : ''),
        bbox: matchingWord?.bbox,
      });

      position = index + 1;
      index = searchText.indexOf(searchQuery, position);
    }

    return results;
  }

  /**
   * Get supported languages
   */
  getSupportedLanguages(): string[] {
    return [
      'eng', // English
      'chi_sim', // Chinese Simplified
      'chi_tra', // Chinese Traditional
      'jpn', // Japanese
      'kor', // Korean
      'fra', // French
      'deu', // German
      'spa', // Spanish
      'rus', // Russian
      'ara', // Arabic
      'por', // Portuguese
      'ita', // Italian
    ];
  }

  /**
   * Terminate the worker to free resources
   */
  async terminate(): Promise<void> {
    if (this.worker) {
      await this.worker.terminate();
      this.worker = null;
    }
  }
}
