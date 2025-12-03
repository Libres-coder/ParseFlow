import mammoth from 'mammoth';
import * as fs from 'fs/promises';
import * as path from 'path';

/**
 * Options for Word document text extraction
 */
export interface WordExtractOptions {
  /**
   * Preserve formatting (paragraphs, line breaks)
   * @default true
   */
  preserveFormatting?: boolean;

  /**
   * Include style information
   * @default false
   */
  includeStyleInfo?: boolean;
}

/**
 * Result of Word document text extraction
 */
export interface WordExtractResult {
  /**
   * Extracted text content
   */
  text: string;

  /**
   * Metadata if available
   */
  metadata?: {
    [key: string]: any;
  };

  /**
   * Any warnings from the extraction process
   */
  warnings?: string[];
}

/**
 * Result of Word document metadata extraction
 */
export interface WordMetadataResult {
  fileName: string;
  filePath: string;
  fileSize: number;
  lastModified: Date;
  /**
   * Additional metadata from document properties
   */
  properties?: {
    [key: string]: any;
  };
}

/**
 * Parser for Word (docx) documents
 */
export class WordParser {
  /**
   * Extract text from a Word document
   * 
   * @param filePath - Absolute path to the .docx file
   * @param options - Extraction options
   * @returns Extracted text and metadata
   * 
   * @example
   * ```typescript
   * const parser = new WordParser();
   * const result = await parser.extractText('document.docx');
   * console.log(result.text);
   * ```
   */
  async extractText(
    filePath: string,
    options: WordExtractOptions = {}
  ): Promise<WordExtractResult> {
    const {
      preserveFormatting = true,
      includeStyleInfo = false
    } = options;

    try {
      // Read the file as buffer
      const buffer = await fs.readFile(filePath);

      // Extract text using mammoth
      const result = await mammoth.extractRawText({ buffer });

      return {
        text: result.value,
        warnings: result.messages.length > 0 
          ? result.messages.map(m => m.message) 
          : undefined,
        metadata: {
          extractedAt: new Date().toISOString(),
          preserveFormatting,
          includeStyleInfo
        }
      };
    } catch (error) {
      throw new Error(
        `Failed to extract text from Word document: ${
          error instanceof Error ? error.message : String(error)
        }`
      );
    }
  }

  /**
   * Extract HTML from a Word document
   * 
   * @param filePath - Absolute path to the .docx file
   * @returns HTML content
   */
  async extractHTML(filePath: string): Promise<string> {
    try {
      const buffer = await fs.readFile(filePath);
      const result = await mammoth.convertToHtml({ buffer });
      return result.value;
    } catch (error) {
      throw new Error(
        `Failed to extract HTML from Word document: ${
          error instanceof Error ? error.message : String(error)
        }`
      );
    }
  }

  /**
   * Get metadata from a Word document
   * 
   * @param filePath - Absolute path to the .docx file
   * @returns Document metadata
   * 
   * @example
   * ```typescript
   * const parser = new WordParser();
   * const metadata = await parser.getMetadata('document.docx');
   * console.log(metadata.fileSize);
   * ```
   */
  async getMetadata(filePath: string): Promise<WordMetadataResult> {
    try {
      const stats = await fs.stat(filePath);

      return {
        fileName: path.basename(filePath),
        filePath: path.resolve(filePath),
        fileSize: stats.size,
        lastModified: stats.mtime,
        properties: {
          extension: path.extname(filePath),
          isFile: stats.isFile()
        }
      };
    } catch (error) {
      throw new Error(
        `Failed to get Word document metadata: ${
          error instanceof Error ? error.message : String(error)
        }`
      );
    }
  }

  /**
   * Search for text in a Word document
   * 
   * @param filePath - Absolute path to the .docx file
   * @param query - Search query
   * @param caseSensitive - Whether the search should be case-sensitive
   * @returns Array of match positions and context
   */
  async searchText(
    filePath: string,
    query: string,
    caseSensitive: boolean = false
  ): Promise<Array<{ match: string; context: string; position: number }>> {
    const { text } = await this.extractText(filePath);
    const results: Array<{ match: string; context: string; position: number }> = [];

    const searchText = caseSensitive ? text : text.toLowerCase();
    const searchQuery = caseSensitive ? query : query.toLowerCase();

    let position = 0;
    while ((position = searchText.indexOf(searchQuery, position)) !== -1) {
      const contextStart = Math.max(0, position - 50);
      const contextEnd = Math.min(text.length, position + query.length + 50);
      const context = text.substring(contextStart, contextEnd);

      results.push({
        match: text.substring(position, position + query.length),
        context: `...${context}...`,
        position
      });

      position += query.length;
    }

    return results;
  }
}
