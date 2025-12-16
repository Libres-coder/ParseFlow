/**
 * PDF Tool 处理器
 */

import { Tool, TextContent } from '@modelcontextprotocol/sdk/types.js';
import { PDFParser, WordParser, ExcelParser, PowerPointParser, OCRParser, type TOCItem } from 'parseflow-core';
import { logger } from '../utils/logger.js';
import { PathResolver } from '../utils/path-resolver.js';
import { handleError } from '../utils/error-handler.js';

export class ToolHandler {
  private pathResolver: PathResolver;
  private tools: Tool[];
  private wordParser: WordParser;
  private excelParser: ExcelParser;
  private pptParser: PowerPointParser;
  private ocrParser: OCRParser;

  constructor(private parser: PDFParser) {
    this.pathResolver = new PathResolver(process.env.PARSEFLOW_ALLOWED_PATHS?.split(';'));
    this.wordParser = new WordParser();
    this.excelParser = new ExcelParser();
    this.pptParser = new PowerPointParser();
    this.ocrParser = new OCRParser();
    this.tools = this.defineTools();
  }

  /**
   * 列出可用工具
   */
  list(): { tools: Tool[] } {
    logger.info('Listing available tools');
    return { tools: this.tools };
  }

  /**
   * 调用工具
   */
  async call(name: string, args: Record<string, unknown>): Promise<{ content: TextContent[] }> {
    try {
      logger.info('Calling tool', { name, args });

      switch (name) {
        case 'extract_text':
          return await this.extractText(args);
        case 'search_pdf':
          return await this.searchPdf(args);
        case 'get_metadata':
          return await this.getMetadata(args);
        case 'extract_images':
          return await this.extractImages(args);
        case 'get_toc':
          return await this.getToc(args);
        case 'extract_word':
          return await this.extractWord(args);
        case 'search_word':
          return await this.searchWord(args);
        case 'extract_excel':
          return await this.extractExcel(args);
        case 'search_excel':
          return await this.searchExcel(args);
        case 'extract_powerpoint':
          return await this.extractPowerPoint(args);
        case 'search_powerpoint':
          return await this.searchPowerPoint(args);
        case 'extract_ocr':
          return await this.extractOCR(args);
        case 'search_ocr':
          return await this.searchOCR(args);
        default:
          throw new Error(`Unknown tool: ${name}`);
      }
    } catch (error) {
      throw handleError(error, { operation: 'call_tool', tool: name, args });
    }
  }

  /**
   * 定义工具列表
   */
  private defineTools(): Tool[] {
    return [
      {
        name: 'extract_text',
        description:
          'Extract text content from PDF files. Use this tool when the user asks to read, analyze, summarize, or extract content from a PDF file. Supports extracting specific pages or page ranges. This is the primary tool for accessing PDF content.',
        inputSchema: {
          type: 'object',
          properties: {
            path: {
              type: 'string',
              description:
                'Absolute path to the PDF file (e.g., D:\\documents\\file.pdf or C:\\Users\\username\\file.pdf)',
            },
            page: {
              type: 'number',
              description:
                'Optional: Extract a specific page number (1-indexed). Use when user asks for a specific page.',
            },
            range: {
              type: 'string',
              description:
                'Optional: Extract a page range in format "start-end" (e.g., "1-10", "5-20"). Use when user wants multiple pages.',
            },
            strategy: {
              type: 'string',
              enum: ['raw', 'formatted', 'clean'],
              description:
                'Text extraction strategy: "raw" for unprocessed text, "formatted" (default) for cleaned and structured text, "clean" for minimal whitespace',
              default: 'formatted',
            },
          },
          required: ['path'],
        },
      },
      {
        name: 'search_pdf',
        description:
          'Search for keywords or phrases within a PDF file. Use this tool when the user wants to find specific text, locate information, or search for keywords in a PDF. Returns matching results with page numbers and context snippets.',
        inputSchema: {
          type: 'object',
          properties: {
            path: {
              type: 'string',
              description: 'Absolute path to the PDF file to search',
            },
            query: {
              type: 'string',
              description: 'The keyword or phrase to search for in the PDF',
            },
            caseSensitive: {
              type: 'boolean',
              description:
                'Whether the search should be case-sensitive. Default is false (case-insensitive)',
              default: false,
            },
            maxResults: {
              type: 'number',
              description: 'Maximum number of search results to return. Default is 10.',
              default: 10,
            },
          },
          required: ['path', 'query'],
        },
      },
      {
        name: 'get_metadata',
        description:
          'Get metadata and information about a PDF file without reading its content. Use this tool when the user asks about PDF properties like: number of pages, file size, title, author, creation date, PDF version, or other document information. This is faster than extract_text for just getting file info.',
        inputSchema: {
          type: 'object',
          properties: {
            path: {
              type: 'string',
              description: 'Absolute path to the PDF file',
            },
          },
          required: ['path'],
        },
      },
      {
        name: 'extract_images',
        description:
          'Extract images from a PDF file and save them to disk. Use this tool when the user wants to export, save, or extract images, figures, or graphics from a PDF. Note: This feature is currently a placeholder and requires pdfjs-dist implementation.',
        inputSchema: {
          type: 'object',
          properties: {
            path: {
              type: 'string',
              description: 'Absolute path to the PDF file',
            },
            outputDir: {
              type: 'string',
              description: 'Directory path where extracted images will be saved',
            },
            format: {
              type: 'string',
              enum: ['png', 'jpg'],
              description: 'Output image format (png or jpg). Default is png.',
              default: 'png',
            },
          },
          required: ['path', 'outputDir'],
        },
      },
      {
        name: 'get_toc',
        description:
          'Get the table of contents (TOC) or bookmarks from a PDF file. Use this tool when the user wants to see the document structure, chapters, sections, or bookmarks. Useful for navigating large PDFs. Note: This feature is currently a placeholder and requires pdfjs-dist implementation.',
        inputSchema: {
          type: 'object',
          properties: {
            path: {
              type: 'string',
              description: 'Absolute path to the PDF file',
            },
          },
          required: ['path'],
        },
      },
      {
        name: 'extract_word',
        description:
          'Extract text content from Word (docx) files. Use this tool when the user wants to read, analyze, or extract content from Word documents.',
        inputSchema: {
          type: 'object',
          properties: {
            path: {
              type: 'string',
              description: 'Absolute path to the Word file (e.g., D:\\documents\\file.docx)',
            },
            format: {
              type: 'string',
              enum: ['text', 'html'],
              description: 'Output format: "text" for plain text, "html" for HTML. Default is "text".',
              default: 'text',
            },
          },
          required: ['path'],
        },
      },
      {
        name: 'search_word',
        description:
          'Search for keywords or phrases within a Word document. Returns matching results with context.',
        inputSchema: {
          type: 'object',
          properties: {
            path: {
              type: 'string',
              description: 'Absolute path to the Word file',
            },
            query: {
              type: 'string',
              description: 'The keyword or phrase to search for',
            },
            caseSensitive: {
              type: 'boolean',
              description: 'Whether the search should be case-sensitive. Default is false.',
              default: false,
            },
          },
          required: ['path', 'query'],
        },
      },
      {
        name: 'extract_excel',
        description:
          'Extract data from Excel (xlsx/xls) files. Use this tool to read spreadsheet data, analyze tables, or extract specific sheets.',
        inputSchema: {
          type: 'object',
          properties: {
            path: {
              type: 'string',
              description: 'Absolute path to the Excel file (e.g., D:\\documents\\file.xlsx)',
            },
            sheetName: {
              type: 'string',
              description: 'Optional: Specific sheet name to extract',
            },
            sheetIndex: {
              type: 'number',
              description: 'Optional: Sheet index to extract (0-based)',
            },
            format: {
              type: 'string',
              enum: ['json', 'csv', 'text'],
              description: 'Output format: "json", "csv", or "text". Default is "json".',
              default: 'json',
            },
          },
          required: ['path'],
        },
      },
      {
        name: 'search_excel',
        description:
          'Search for keywords or phrases within an Excel file. Returns matching cells with sheet name, cell reference, and value.',
        inputSchema: {
          type: 'object',
          properties: {
            path: {
              type: 'string',
              description: 'Absolute path to the Excel file',
            },
            query: {
              type: 'string',
              description: 'The keyword or phrase to search for',
            },
            caseSensitive: {
              type: 'boolean',
              description: 'Whether the search should be case-sensitive. Default is false.',
              default: false,
            },
          },
          required: ['path', 'query'],
        },
      },
      {
        name: 'extract_powerpoint',
        description:
          'Extract text content from PowerPoint (pptx) files. Use this tool to read presentations, extract slide content, or analyze presentation text.',
        inputSchema: {
          type: 'object',
          properties: {
            path: {
              type: 'string',
              description: 'Absolute path to the PowerPoint file (e.g., D:\\documents\\presentation.pptx)',
            },
            slideNumber: {
              type: 'number',
              description: 'Optional: Extract a specific slide (1-indexed)',
            },
          },
          required: ['path'],
        },
      },
      {
        name: 'search_powerpoint',
        description:
          'Search for keywords or phrases within a PowerPoint presentation. Returns matching results with slide numbers and context.',
        inputSchema: {
          type: 'object',
          properties: {
            path: {
              type: 'string',
              description: 'Absolute path to the PowerPoint file',
            },
            query: {
              type: 'string',
              description: 'The keyword or phrase to search for',
            },
            caseSensitive: {
              type: 'boolean',
              description: 'Whether the search should be case-sensitive. Default is false.',
              default: false,
            },
          },
          required: ['path', 'query'],
        },
      },
      {
        name: 'extract_ocr',
        description:
          'Extract text from images using OCR (Optical Character Recognition). Supports common image formats (jpg, png, bmp, gif, webp). Use this tool when the user wants to read text from scanned documents, screenshots, or photos.',
        inputSchema: {
          type: 'object',
          properties: {
            path: {
              type: 'string',
              description: 'Absolute path to the image file (e.g., D:\\documents\\scan.png)',
            },
            language: {
              type: 'string',
              description: 'OCR language code. Default is "eng" (English). Supported: eng, chi_sim (Chinese Simplified), chi_tra (Chinese Traditional), jpn (Japanese), kor (Korean), fra (French), deu (German), spa (Spanish), rus (Russian)',
              default: 'eng',
            },
          },
          required: ['path'],
        },
      },
      {
        name: 'search_ocr',
        description:
          'Search for keywords in an image using OCR. First extracts text from the image, then searches for the query.',
        inputSchema: {
          type: 'object',
          properties: {
            path: {
              type: 'string',
              description: 'Absolute path to the image file',
            },
            query: {
              type: 'string',
              description: 'The keyword or phrase to search for',
            },
            language: {
              type: 'string',
              description: 'OCR language code. Default is "eng".',
              default: 'eng',
            },
            caseSensitive: {
              type: 'boolean',
              description: 'Whether the search should be case-sensitive. Default is false.',
              default: false,
            },
          },
          required: ['path', 'query'],
        },
      },
    ];
  }

  /**
   * 提取文本工具
   */
  private async extractText(args: Record<string, unknown>): Promise<{ content: TextContent[] }> {
    const path = this.pathResolver.resolve(args.path as string);
    const page = args.page as number | undefined;
    const range = args.range as string | undefined;

    let text: string;

    if (page !== undefined) {
      text = await this.parser.extractPage(path, page);
    } else if (range) {
      text = await this.parser.extractRange(path, range);
    } else {
      text = await this.parser.extractText(path);
    }

    return {
      content: [
        {
          type: 'text',
          text,
        },
      ],
    };
  }

  /**
   * 搜索 PDF 工具
   */
  private async searchPdf(args: Record<string, unknown>): Promise<{ content: TextContent[] }> {
    const path = this.pathResolver.resolve(args.path as string);
    const query = args.query as string;
    const caseSensitive = (args.caseSensitive as boolean) ?? false;
    const maxResults = (args.maxResults as number) ?? 10;

    const results = await this.parser.search(path, query, {
      caseSensitive,
      maxResults,
    });

    const text =
      results.length === 0
        ? '未找到匹配结果'
        : `找到 ${results.length} 个结果：\n\n${results
            .map(
              (r: { page: number; context: string }, i: number) =>
                `[${i + 1}] 第 ${r.page} 页\n${r.context}\n`
            )
            .join('\n')}`;

    return {
      content: [
        {
          type: 'text',
          text,
        },
      ],
    };
  }

  /**
   * 获取元数据工具
   */
  private async getMetadata(args: Record<string, unknown>): Promise<{ content: TextContent[] }> {
    const path = this.pathResolver.resolve(args.path as string);
    const metadata = await this.parser.getMetadata(path);

    // Helper function to safely format dates
    const formatDate = (date: Date | undefined | null): string => {
      if (!date) return 'N/A';
      try {
        // Check if date is valid
        if (isNaN(date.getTime())) return 'Invalid Date';
        return date.toISOString();
      } catch (error) {
        return 'Invalid Date';
      }
    };

    // Structured data for easy parsing
    const structuredData = {
      title: metadata.info.Title ?? 'N/A',
      author: metadata.info.Author ?? 'N/A',
      subject: metadata.info.Subject ?? 'N/A',
      creationDate: formatDate(metadata.info.CreationDate),
      modificationDate: formatDate(metadata.info.ModDate),
      pages: metadata.metadata.pageCount,
      fileSize: metadata.metadata.fileSize,
      fileSizeMB: parseFloat((metadata.metadata.fileSize / 1024 / 1024).toFixed(2)),
      pdfVersion: metadata.metadata.pdfVersion,
      isEncrypted: metadata.metadata.isEncrypted,
    };

    // Human-readable text
    const text = `PDF Metadata:

Title: ${structuredData.title}
Author: ${structuredData.author}
Subject: ${structuredData.subject}
Created: ${structuredData.creationDate}
Modified: ${structuredData.modificationDate}
Pages: ${structuredData.pages}
File Size: ${structuredData.fileSizeMB} MB
PDF Version: ${structuredData.pdfVersion}
Encrypted: ${structuredData.isEncrypted ? 'Yes' : 'No'}

---
Structured Data (JSON):
${JSON.stringify(structuredData, null, 2)}`;

    return {
      content: [
        {
          type: 'text',
          text,
        },
      ],
    };
  }

  /**
   * 提取图片工具
   */
  private async extractImages(args: Record<string, unknown>): Promise<{ content: TextContent[] }> {
    const path = this.pathResolver.resolve(args.path as string);
    const outputDir = args.outputDir as string;

    const imagePaths = await this.parser.extractImages(path, outputDir);

    const text =
      imagePaths.length === 0
        ? '未找到图片'
        : `提取了 ${imagePaths.length} 张图片：\n\n${imagePaths.join('\n')}`;

    return {
      content: [
        {
          type: 'text',
          text,
        },
      ],
    };
  }

  /**
   * 获取目录工具
   */
  private async getToc(args: Record<string, unknown>): Promise<{ content: TextContent[] }> {
    const path = this.pathResolver.resolve(args.path as string);
    const toc = await this.parser.getTOC(path);

    if (toc.length === 0) {
      return {
        content: [
          {
            type: 'text',
            text: '该 PDF 没有目录信息',
          },
        ],
      };
    }

    const formatToc = (items: TOCItem[], level = 0): string => {
      return items
        .map((item: TOCItem) => {
          const indent = '  '.repeat(level);
          let result = `${indent}${item.title} (第 ${item.page} 页)`;
          if (item.children && item.children.length > 0) {
            result += '\n' + formatToc(item.children, level + 1);
          }
          return result;
        })
        .join('\n');
    };

    const text = `目录结构：\n\n${formatToc(toc)}`;

    return {
      content: [
        {
          type: 'text',
          text,
        },
      ],
    };
  }

  /**
   * 提取 Word 文档工具
   */
  private async extractWord(args: Record<string, unknown>): Promise<{ content: TextContent[] }> {
    const path = this.pathResolver.resolve(args.path as string);
    const format = (args.format as string) ?? 'text';

    let text: string;
    if (format === 'html') {
      text = await this.wordParser.extractHTML(path);
    } else {
      const result = await this.wordParser.extractText(path);
      text = result.text;
      
      if (result.warnings && result.warnings.length > 0) {
        text += '\n\n---\nWarnings:\n' + result.warnings.join('\n');
      }
    }

    return {
      content: [
        {
          type: 'text',
          text,
        },
      ],
    };
  }

  /**
   * 搜索 Word 文档工具
   */
  private async searchWord(args: Record<string, unknown>): Promise<{ content: TextContent[] }> {
    const path = this.pathResolver.resolve(args.path as string);
    const query = args.query as string;
    const caseSensitive = (args.caseSensitive as boolean) ?? false;

    const results = await this.wordParser.searchText(path, query, caseSensitive);

    const text =
      results.length === 0
        ? 'No matches found'
        : `Found ${results.length} results:\n\n${results
            .map((r, i) => `[${i + 1}] Position ${r.position}\n${r.context}\n`)
            .join('\n')}`;

    return {
      content: [
        {
          type: 'text',
          text,
        },
      ],
    };
  }

  /**
   * 提取 Excel 数据工具
   */
  private async extractExcel(args: Record<string, unknown>): Promise<{ content: TextContent[] }> {
    const path = this.pathResolver.resolve(args.path as string);
    const sheetName = args.sheetName as string | undefined;
    const sheetIndex = args.sheetIndex as number | undefined;
    const format = (args.format as 'json' | 'csv' | 'text') ?? 'json';

    const results = await this.excelParser.extractData(path, {
      sheetName,
      sheetIndex,
      format,
    });

    let text: string;
    if (format === 'json') {
      text = results
        .map(
          r =>
            `=== Sheet: ${r.sheetName} ===\n` +
            `Rows: ${r.rowCount}, Columns: ${r.columnCount}\n` +
            `Data:\n${JSON.stringify(r.data, null, 2)}`
        )
        .join('\n\n');
    } else {
      text = results.map(r => `=== Sheet: ${r.sheetName} ===\n${r.data}`).join('\n\n');
    }

    return {
      content: [
        {
          type: 'text',
          text,
        },
      ],
    };
  }

  /**
   * 搜索 Excel 数据工具
   */
  private async searchExcel(args: Record<string, unknown>): Promise<{ content: TextContent[] }> {
    const path = this.pathResolver.resolve(args.path as string);
    const query = args.query as string;
    const caseSensitive = (args.caseSensitive as boolean) ?? false;

    const results = await this.excelParser.searchText(path, query, caseSensitive);

    const text =
      results.length === 0
        ? 'No matches found'
        : `Found ${results.length} results:\n\n${results
            .map(
              (r, i) =>
                `[${i + 1}] Sheet: ${r.sheetName}, Cell: ${r.cellRef} (Row ${r.row}, Col ${r.col})\n` +
                `Value: ${r.value}\n`
            )
            .join('\n')}`;

    return {
      content: [
        {
          type: 'text',
          text,
        },
      ],
    };
  }

  /**
   * 提取 PowerPoint 内容工具
   */
  private async extractPowerPoint(args: Record<string, unknown>): Promise<{ content: TextContent[] }> {
    const path = this.pathResolver.resolve(args.path as string);
    const slideNumber = args.slideNumber as number | undefined;

    let text: string;
    if (slideNumber !== undefined) {
      text = await this.pptParser.extractSlide(path, slideNumber);
    } else {
      const result = await this.pptParser.extractText(path);
      text = `Total Slides: ${result.totalSlides}\n\n${result.text}`;
    }

    return {
      content: [
        {
          type: 'text',
          text,
        },
      ],
    };
  }

  /**
   * 搜索 PowerPoint 内容工具
   */
  private async searchPowerPoint(args: Record<string, unknown>): Promise<{ content: TextContent[] }> {
    const path = this.pathResolver.resolve(args.path as string);
    const query = args.query as string;
    const caseSensitive = (args.caseSensitive as boolean) ?? false;

    const results = await this.pptParser.searchText(path, query, caseSensitive);

    const text =
      results.length === 0
        ? 'No matches found'
        : `Found ${results.length} results:\n\n${results
            .map(
              (r, i) =>
                `[${i + 1}] Slide ${r.slideNumber}, Position ${r.position}\n${r.context}\n`
            )
            .join('\n')}`;

    return {
      content: [
        {
          type: 'text',
          text,
        },
      ],
    };
  }

  /**
   * 提取 OCR 文本工具
   */
  private async extractOCR(args: Record<string, unknown>): Promise<{ content: TextContent[] }> {
    const path = this.pathResolver.resolve(args.path as string);
    const language = (args.language as string) ?? 'eng';

    const result = await this.ocrParser.extractText(path, { language });

    const text = `OCR Result (Confidence: ${result.confidence.toFixed(1)}%)\n` +
      `Language: ${result.metadata.language}\n\n` +
      `--- Extracted Text ---\n${result.text}`;

    return {
      content: [
        {
          type: 'text',
          text,
        },
      ],
    };
  }

  /**
   * 搜索 OCR 文本工具
   */
  private async searchOCR(args: Record<string, unknown>): Promise<{ content: TextContent[] }> {
    const path = this.pathResolver.resolve(args.path as string);
    const query = args.query as string;
    const language = (args.language as string) ?? 'eng';
    const caseSensitive = (args.caseSensitive as boolean) ?? false;

    const results = await this.ocrParser.searchText(path, query, caseSensitive, language);

    const text =
      results.length === 0
        ? 'No matches found'
        : `Found ${results.length} results:\n\n${results
            .map(
              (r, i) =>
                `[${i + 1}] Position ${r.position}, Confidence: ${r.confidence.toFixed(1)}%\n` +
                `Context: ${r.context}\n`
            )
            .join('\n')}`;

    return {
      content: [
        {
          type: 'text',
          text,
        },
      ],
    };
  }
}
