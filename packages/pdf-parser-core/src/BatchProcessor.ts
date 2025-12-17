/**
 * 批量处理器 - 支持多文件并行处理
 */

import { PDFParser } from './parser.js';
import { WordParser } from './WordParser.js';
import { ExcelParser } from './ExcelParser.js';
import { PowerPointParser } from './PowerPointParser.js';
import { OCRParser } from './OCRParser.js';
import * as fs from 'fs/promises';
import * as path from 'path';

export interface BatchFileResult {
  path: string;
  success: boolean;
  type: string;
  text?: string;
  error?: string;
  metadata?: Record<string, unknown>;
}

export interface BatchResult {
  total: number;
  successful: number;
  failed: number;
  results: BatchFileResult[];
  duration: number;
}

export interface BatchOptions {
  concurrency?: number;  // 并行数量，默认 3
  includeMetadata?: boolean;  // 是否包含元数据
  onProgress?: (completed: number, total: number, current: string) => void;
}

type FileType = 'pdf' | 'docx' | 'xlsx' | 'xls' | 'pptx' | 'image' | 'unknown';

export class BatchProcessor {
  private pdfParser: PDFParser;
  private wordParser: WordParser;
  private excelParser: ExcelParser;
  private pptParser: PowerPointParser;
  private ocrParser: OCRParser;

  constructor() {
    this.pdfParser = new PDFParser();
    this.wordParser = new WordParser();
    this.excelParser = new ExcelParser();
    this.pptParser = new PowerPointParser();
    this.ocrParser = new OCRParser();
  }

  /**
   * 检测文件类型
   */
  private detectFileType(filePath: string): FileType {
    const ext = path.extname(filePath).toLowerCase();
    switch (ext) {
      case '.pdf':
        return 'pdf';
      case '.docx':
        return 'docx';
      case '.xlsx':
        return 'xlsx';
      case '.xls':
        return 'xls';
      case '.pptx':
        return 'pptx';
      case '.jpg':
      case '.jpeg':
      case '.png':
      case '.gif':
      case '.bmp':
      case '.webp':
        return 'image';
      default:
        return 'unknown';
    }
  }

  /**
   * 处理单个文件
   */
  private async processFile(
    filePath: string,
    includeMetadata: boolean
  ): Promise<BatchFileResult> {
    const fileType = this.detectFileType(filePath);
    
    try {
      // 检查文件是否存在
      await fs.access(filePath);
      
      let text = '';
      let metadata: Record<string, unknown> | undefined;

      switch (fileType) {
        case 'pdf':
          text = await this.pdfParser.extractText(filePath);
          if (includeMetadata) {
            const pdfMetadata = await this.pdfParser.getMetadata(filePath);
            metadata = { ...pdfMetadata.info, ...pdfMetadata.metadata };
          }
          break;
          
        case 'docx':
          const wordResult = await this.wordParser.extractText(filePath);
          text = wordResult.text;
          if (includeMetadata) {
            const wordMetadata = await this.wordParser.getMetadata(filePath);
            metadata = wordMetadata as unknown as Record<string, unknown>;
          }
          break;
          
        case 'xlsx':
        case 'xls':
          const excelResults = await this.excelParser.extractData(filePath, { format: 'text' });
          text = Array.isArray(excelResults) && excelResults[0] ? String(excelResults[0].data) : '';
          if (includeMetadata) {
            const excelMetadata = await this.excelParser.getMetadata(filePath);
            metadata = excelMetadata as unknown as Record<string, unknown>;
          }
          break;
          
        case 'pptx':
          const pptResult = await this.pptParser.extractText(filePath);
          text = pptResult.text;
          break;
          
        case 'image':
          const ocrResult = await this.ocrParser.extractText(filePath);
          text = ocrResult.text;
          break;
          
        default:
          return {
            path: filePath,
            success: false,
            type: 'unknown',
            error: `Unsupported file type: ${path.extname(filePath)}`,
          };
      }

      return {
        path: filePath,
        success: true,
        type: fileType,
        text,
        metadata,
      };
    } catch (error) {
      return {
        path: filePath,
        success: false,
        type: fileType,
        error: error instanceof Error ? error.message : String(error),
      };
    }
  }

  /**
   * 批量处理多个文件
   */
  async processFiles(
    filePaths: string[],
    options: BatchOptions = {}
  ): Promise<BatchResult> {
    const {
      concurrency = 3,
      includeMetadata = false,
      onProgress,
    } = options;

    const startTime = Date.now();
    const results: BatchFileResult[] = [];
    let completed = 0;

    // 分批并行处理
    for (let i = 0; i < filePaths.length; i += concurrency) {
      const batch = filePaths.slice(i, i + concurrency);
      const batchPromises = batch.map(async (filePath) => {
        const result = await this.processFile(filePath, includeMetadata);
        completed++;
        if (onProgress) {
          onProgress(completed, filePaths.length, filePath);
        }
        return result;
      });

      const batchResults = await Promise.all(batchPromises);
      results.push(...batchResults);
    }

    const successful = results.filter((r) => r.success).length;
    const failed = results.filter((r) => !r.success).length;

    return {
      total: filePaths.length,
      successful,
      failed,
      results,
      duration: Date.now() - startTime,
    };
  }

  /**
   * 批量处理目录中的所有支持文件
   */
  async processDirectory(
    dirPath: string,
    options: BatchOptions & { recursive?: boolean } = {}
  ): Promise<BatchResult> {
    const { recursive = false, ...batchOptions } = options;
    
    const supportedExtensions = ['.pdf', '.docx', '.xlsx', '.xls', '.pptx', '.jpg', '.jpeg', '.png', '.gif', '.bmp', '.webp'];
    const filePaths: string[] = [];

    const scanDir = async (dir: string) => {
      const entries = await fs.readdir(dir, { withFileTypes: true });
      
      for (const entry of entries) {
        const fullPath = path.join(dir, entry.name);
        
        if (entry.isDirectory() && recursive) {
          await scanDir(fullPath);
        } else if (entry.isFile()) {
          const ext = path.extname(entry.name).toLowerCase();
          if (supportedExtensions.includes(ext)) {
            filePaths.push(fullPath);
          }
        }
      }
    };

    await scanDir(dirPath);
    return this.processFiles(filePaths, batchOptions);
  }

  /**
   * 批量搜索多个文件
   */
  async searchFiles(
    filePaths: string[],
    query: string,
    options: { caseSensitive?: boolean; concurrency?: number } = {}
  ): Promise<{
    total: number;
    filesWithMatches: number;
    results: Array<{
      path: string;
      type: string;
      matches: Array<{ text: string; context?: string }>;
    }>;
  }> {
    const { caseSensitive = false, concurrency = 3 } = options;
    const results: Array<{
      path: string;
      type: string;
      matches: Array<{ text: string; context?: string }>;
    }> = [];

    for (let i = 0; i < filePaths.length; i += concurrency) {
      const batch = filePaths.slice(i, i + concurrency);
      const batchPromises = batch.map(async (filePath) => {
        const fileType = this.detectFileType(filePath);
        let matches: Array<{ text: string; context?: string }> = [];

        try {
          switch (fileType) {
            case 'pdf':
              const pdfResults = await this.pdfParser.search(filePath, query, { caseSensitive });
              matches = pdfResults.map((r) => ({ text: r.snippet, context: r.context }));
              break;
            case 'docx':
              const wordResults = await this.wordParser.searchText(filePath, query, caseSensitive);
              matches = wordResults.map((r) => ({ text: r.match, context: r.context }));
              break;
            case 'xlsx':
            case 'xls':
              const excelResults = await this.excelParser.searchText(filePath, query, caseSensitive);
              matches = excelResults.map((r) => ({ 
                text: String(r.value), 
                context: `Sheet: ${r.sheetName}, Cell: ${r.cellRef}` 
              }));
              break;
            case 'pptx':
              const pptResults = await this.pptParser.searchText(filePath, query, caseSensitive);
              matches = pptResults.map((r) => ({ 
                text: r.match, 
                context: `Slide ${r.slideNumber}` 
              }));
              break;
          }
        } catch {
          // Skip files with errors
        }

        return { path: filePath, type: fileType, matches };
      });

      const batchResults = await Promise.all(batchPromises);
      results.push(...batchResults.filter((r) => r.matches.length > 0));
    }

    return {
      total: filePaths.length,
      filesWithMatches: results.length,
      results,
    };
  }
}
