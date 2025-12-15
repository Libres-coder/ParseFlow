// @ts-ignore - node-pptx-parser has incorrect type definitions
import PptxParserDefault from 'node-pptx-parser';
import * as fs from 'fs/promises';
import * as path from 'path';

const PptxParser = PptxParserDefault as unknown as new (filePath: string) => {
  parse(): Promise<any>;
  extractText(): Promise<Array<{ slideNumber: number; text: string[] }>>;
};

/**
 * Options for PowerPoint text extraction
 */
export interface PowerPointExtractOptions {
  /**
   * Preserve slide structure
   * @default true
   */
  preserveSlideStructure?: boolean;

  /**
   * Include speaker notes
   * @default false
   */
  includeNotes?: boolean;
}

/**
 * Result of PowerPoint text extraction
 */
export interface PowerPointExtractResult {
  /**
   * Extracted text content
   */
  text: string;

  /**
   * Array of slides with their content
   */
  slides: Array<{
    slideNumber: number;
    content: string;
  }>;

  /**
   * Total number of slides
   */
  totalSlides: number;

  /**
   * Metadata if available
   */
  metadata?: {
    [key: string]: any;
  };
}

/**
 * Result of PowerPoint metadata extraction
 */
export interface PowerPointMetadataResult {
  fileName: string;
  filePath: string;
  fileSize: number;
  lastModified: Date;
  totalSlides: number;
  /**
   * Additional metadata from document properties
   */
  properties?: {
    [key: string]: any;
  };
}

/**
 * Search result from PowerPoint
 */
export interface PowerPointSearchResult {
  match: string;
  context: string;
  slideNumber: number;
  position: number;
}

/**
 * Parser for PowerPoint (pptx) presentations
 */
export class PowerPointParser {
  /**
   * Extract text from a PowerPoint presentation
   * 
   * @param filePath - Absolute path to the .pptx file
   * @param options - Extraction options
   * @returns Extracted text and slide content
   * 
   * @example
   * ```typescript
   * const parser = new PowerPointParser();
   * const result = await parser.extractText('presentation.pptx');
   * console.log(result.text);
   * console.log(result.slides);
   * ```
   */
  async extractText(
    filePath: string,
    options: PowerPointExtractOptions = {}
  ): Promise<PowerPointExtractResult> {
    const {
      preserveSlideStructure = true,
      includeNotes = false
    } = options;

    try {
      // Create parser instance and extract text
      const pptxParser = new PptxParser(filePath);
      const slideContents = await pptxParser.extractText();

      const slides: Array<{ slideNumber: number; content: string }> = [];
      let fullText = '';

      slideContents.forEach((slideContent: any, index: number) => {
        const slideText = Array.isArray(slideContent.text) 
          ? slideContent.text.join('\n') 
          : (slideContent.text || '');
        
        slides.push({
          slideNumber: index + 1,
          content: slideText
        });
        
        if (preserveSlideStructure) {
          fullText += `--- Slide ${index + 1} ---\n${slideText}\n\n`;
        } else {
          fullText += slideText + '\n';
        }
      });

      return {
        text: fullText.trim(),
        slides,
        totalSlides: slides.length,
        metadata: {
          extractedAt: new Date().toISOString(),
          preserveSlideStructure,
          includeNotes
        }
      };
    } catch (error) {
      throw new Error(
        `Failed to extract text from PowerPoint: ${
          error instanceof Error ? error.message : String(error)
        }`
      );
    }
  }

  /**
   * Extract text from a specific slide
   * 
   * @param filePath - Absolute path to the .pptx file
   * @param slideNumber - Slide number (1-indexed)
   * @returns Text content of the specified slide
   */
  async extractSlide(filePath: string, slideNumber: number): Promise<string> {
    const result = await this.extractText(filePath);
    
    const slide = result.slides.find(s => s.slideNumber === slideNumber);
    if (!slide) {
      throw new Error(`Slide ${slideNumber} not found. Total slides: ${result.totalSlides}`);
    }
    
    return slide.content;
  }

  /**
   * Get metadata from a PowerPoint presentation
   * 
   * @param filePath - Absolute path to the .pptx file
   * @returns Presentation metadata
   * 
   * @example
   * ```typescript
   * const parser = new PowerPointParser();
   * const metadata = await parser.getMetadata('presentation.pptx');
   * console.log(metadata.totalSlides);
   * ```
   */
  async getMetadata(filePath: string): Promise<PowerPointMetadataResult> {
    try {
      const stats = await fs.stat(filePath);
      const result = await this.extractText(filePath);

      return {
        fileName: path.basename(filePath),
        filePath: path.resolve(filePath),
        fileSize: stats.size,
        lastModified: stats.mtime,
        totalSlides: result.totalSlides,
        properties: {
          extension: path.extname(filePath),
          isFile: stats.isFile()
        }
      };
    } catch (error) {
      throw new Error(
        `Failed to get PowerPoint metadata: ${
          error instanceof Error ? error.message : String(error)
        }`
      );
    }
  }

  /**
   * Search for text in a PowerPoint presentation
   * 
   * @param filePath - Absolute path to the .pptx file
   * @param query - Search query
   * @param caseSensitive - Whether the search should be case-sensitive
   * @returns Array of match positions and context
   */
  async searchText(
    filePath: string,
    query: string,
    caseSensitive: boolean = false
  ): Promise<PowerPointSearchResult[]> {
    const result = await this.extractText(filePath, { preserveSlideStructure: false });
    const results: PowerPointSearchResult[] = [];

    for (const slide of result.slides) {
      const searchText = caseSensitive ? slide.content : slide.content.toLowerCase();
      const searchQuery = caseSensitive ? query : query.toLowerCase();

      let position = 0;
      while ((position = searchText.indexOf(searchQuery, position)) !== -1) {
        const contextStart = Math.max(0, position - 50);
        const contextEnd = Math.min(slide.content.length, position + query.length + 50);
        const context = slide.content.substring(contextStart, contextEnd);

        results.push({
          match: slide.content.substring(position, position + query.length),
          context: `...${context}...`,
          slideNumber: slide.slideNumber,
          position
        });

        position += query.length;
      }
    }

    return results;
  }
}
