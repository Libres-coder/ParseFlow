/**
 * PDF 解析器主类
 */

import { readFileSync, statSync } from 'fs';
import pdf from 'pdf-parse';
import type {
  ParserConfig,
  ExtractOptions,
  SearchOptions,
  SearchResult,
  PDFMetadata,
  TOCItem,
  ImageExtractOptions,
} from './types/index.js';
import { TextExtractor } from './extractors/text-extractor.js';
import { MetadataExtractor } from './extractors/metadata-extractor.js';
import { ImageExtractor } from './extractors/image-extractor.js';
import { TOCExtractor } from './extractors/toc-extractor.js';
import { SearchEngine } from './search/keyword-search.js';

/**
 * PDF 解析器
 */
export class PDFParser {
  private config: Required<ParserConfig>;
  private textExtractor: TextExtractor;
  private metadataExtractor: MetadataExtractor;
  private imageExtractor: ImageExtractor;
  private tocExtractor: TOCExtractor;
  private searchEngine: SearchEngine;

  constructor(config: ParserConfig = {}) {
    this.config = this.mergeConfig(config);
    this.textExtractor = new TextExtractor();
    this.metadataExtractor = new MetadataExtractor();
    this.imageExtractor = new ImageExtractor();
    this.tocExtractor = new TOCExtractor();
    this.searchEngine = new SearchEngine();
  }

  /**
   * 提取完整文本
   */
  async extractText(path: string, options?: ExtractOptions): Promise<string> {
    const buffer = this.readFile(path);
    return await this.textExtractor.extract(buffer, options);
  }

  /**
   * 提取单页
   */
  async extractPage(path: string, page: number): Promise<string> {
    if (page < 1) {
      throw new Error('Page number must be >= 1');
    }

    const buffer = this.readFile(path);
    const data = await pdf(buffer);

    if (page > data.numpages) {
      throw new Error(`Page ${page} not found (total pages: ${data.numpages})`);
    }

    // 使用 pdf-parse 无法直接提取单页，需要提取全部再切分
    // 这里简化实现，实际应使用 pdfjs-dist
    const fullText = data.text;
    const pages = this.splitIntoPages(fullText, data.numpages);

    return pages[page - 1] || '';
  }

  /**
   * 提取页码范围
   */
  async extractRange(path: string, range: string): Promise<string> {
    const [start, end] = range.split('-').map((n) => parseInt(n.trim()));

    if (isNaN(start) || isNaN(end) || start < 1 || end < start) {
      throw new Error(`Invalid range: ${range}`);
    }

    const buffer = this.readFile(path);
    const data = await pdf(buffer);

    if (end > data.numpages) {
      throw new Error(`Range end ${end} exceeds total pages ${data.numpages}`);
    }

    // 简化实现
    const fullText = data.text;
    const pages = this.splitIntoPages(fullText, data.numpages);

    return pages.slice(start - 1, end).join('\n\n--- Page Break ---\n\n');
  }

  /**
   * 获取元数据
   */
  async getMetadata(path: string): Promise<PDFMetadata> {
    const buffer = this.readFile(path);
    const stats = statSync(path);
    return await this.metadataExtractor.extract(buffer, stats.size);
  }

  /**
   * 搜索关键词
   */
  async search(path: string, query: string, options?: SearchOptions): Promise<SearchResult[]> {
    const text = await this.extractText(path);
    return this.searchEngine.search(text, query, options);
  }

  /**
   * 提取图片
   *
   * @param path - PDF 文件路径
   * @param outputDir - 输出目录
   * @param options - 提取选项
   * @returns 提取的图片路径数组
   *
   * @throws Error - 功能未完全实现，需要 pdfjs-dist
   */
  async extractImages(
    path: string,
    outputDir: string,
    options?: ImageExtractOptions
  ): Promise<string[]> {
    const buffer = this.readFile(path);
    return await this.imageExtractor.extract(buffer, outputDir, options);
  }

  /**
   * 获取目录
   *
   * @param path - PDF 文件路径
   * @returns 目录项数组
   *
   * @note 当前实现返回空数组，完整功能需要 pdfjs-dist
   */
  async getTOC(path: string): Promise<TOCItem[]> {
    const buffer = this.readFile(path);
    return await this.tocExtractor.extract(buffer);
  }

  /**
   * 读取文件
   */
  private readFile(path: string): Buffer {
    // 检查文件大小
    const stats = statSync(path);
    const maxSize = this.config.security.maxFileSize || 52428800; // 50MB

    if (stats.size > maxSize) {
      throw new Error(`File too large: ${stats.size} bytes (max ${maxSize} bytes)`);
    }

    return readFileSync(path);
  }

  /**
   * 将文本分割为页面（简化实现）
   */
  private splitIntoPages(text: string, pageCount: number): string[] {
    // 简化实现：平均分割
    // 实际应根据 PDF 的页面结构
    const charsPerPage = Math.ceil(text.length / pageCount);
    const pages: string[] = [];

    for (let i = 0; i < pageCount; i++) {
      const start = i * charsPerPage;
      const end = Math.min((i + 1) * charsPerPage, text.length);
      pages.push(text.substring(start, end));
    }

    return pages;
  }

  /**
   * 合并配置
   */
  private mergeConfig(config: ParserConfig): Required<ParserConfig> {
    return {
      cache: {
        enabled: config.cache?.enabled ?? true,
        ttl: config.cache?.ttl ?? 3600000,
        maxSize: config.cache?.maxSize ?? 104857600,
        directory: config.cache?.directory ?? './.cache',
      },
      parser: {
        preserveFormatting: config.parser?.preserveFormatting ?? true,
        includeHeaders: config.parser?.includeHeaders ?? false,
        includeFooters: config.parser?.includeFooters ?? false,
      },
      security: {
        maxFileSize: config.security?.maxFileSize ?? 52428800,
        allowedPaths: config.security?.allowedPaths ?? [],
      },
      ocr: {
        enabled: config.ocr?.enabled ?? false,
        language: config.ocr?.language ?? 'eng',
      },
    };
  }
}
