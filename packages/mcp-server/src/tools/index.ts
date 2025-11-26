/**
 * PDF Tool 处理器
 */

import { Tool, TextContent } from '@modelcontextprotocol/sdk/types.js';
import { PDFParser } from '@parseflow/core';
import { logger } from '../utils/logger.js';
import { PathResolver } from '../utils/path-resolver.js';
import { handleError } from '../utils/error-handler.js';

export class ToolHandler {
  private pathResolver: PathResolver;
  private tools: Tool[];

  constructor(private parser: PDFParser) {
    this.pathResolver = new PathResolver(
      process.env.PARSEFLOW_ALLOWED_PATHS?.split(';')
    );
    this.tools = this.defineTools();
  }

  /**
   * 列出可用工具
   */
  async list(): Promise<{ tools: Tool[] }> {
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
        description: '从 PDF 提取文本内容',
        inputSchema: {
          type: 'object',
          properties: {
            path: {
              type: 'string',
              description: 'PDF 文件路径',
            },
            page: {
              type: 'number',
              description: '页码（可选，从 1 开始）',
            },
            range: {
              type: 'string',
              description: '页码范围（可选，格式：\'1-10\'）',
            },
            strategy: {
              type: 'string',
              enum: ['raw', 'formatted', 'clean'],
              description: '提取策略',
              default: 'formatted',
            },
          },
          required: ['path'],
        },
      },
      {
        name: 'search_pdf',
        description: '在 PDF 中搜索关键词',
        inputSchema: {
          type: 'object',
          properties: {
            path: {
              type: 'string',
              description: 'PDF 文件路径',
            },
            query: {
              type: 'string',
              description: '搜索关键词',
            },
            caseSensitive: {
              type: 'boolean',
              description: '是否区分大小写',
              default: false,
            },
            maxResults: {
              type: 'number',
              description: '最大结果数',
              default: 10,
            },
          },
          required: ['path', 'query'],
        },
      },
      {
        name: 'get_metadata',
        description: '获取 PDF 元数据',
        inputSchema: {
          type: 'object',
          properties: {
            path: {
              type: 'string',
              description: 'PDF 文件路径',
            },
          },
          required: ['path'],
        },
      },
      {
        name: 'extract_images',
        description: '提取 PDF 中的图片',
        inputSchema: {
          type: 'object',
          properties: {
            path: {
              type: 'string',
              description: 'PDF 文件路径',
            },
            outputDir: {
              type: 'string',
              description: '输出目录',
            },
            format: {
              type: 'string',
              enum: ['png', 'jpg'],
              description: '图片格式',
              default: 'png',
            },
          },
          required: ['path', 'outputDir'],
        },
      },
      {
        name: 'get_toc',
        description: '获取 PDF 目录结构',
        inputSchema: {
          type: 'object',
          properties: {
            path: {
              type: 'string',
              description: 'PDF 文件路径',
            },
          },
          required: ['path'],
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

    const text = results.length === 0
      ? '未找到匹配结果'
      : `找到 ${results.length} 个结果：\n\n${results
          .map(
            (r, i) =>
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

    const text = `PDF 元数据：

标题: ${metadata.info.Title ?? 'N/A'}
作者: ${metadata.info.Author ?? 'N/A'}
主题: ${metadata.info.Subject ?? 'N/A'}
创建日期: ${metadata.info.CreationDate?.toISOString() ?? 'N/A'}
修改日期: ${metadata.info.ModDate?.toISOString() ?? 'N/A'}
页数: ${metadata.metadata.pageCount}
文件大小: ${(metadata.metadata.fileSize / 1024 / 1024).toFixed(2)} MB
PDF 版本: ${metadata.metadata.pdfVersion}
加密: ${metadata.metadata.isEncrypted ? '是' : '否'}`;

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

    const text = imagePaths.length === 0
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

    const formatToc = (items: typeof toc, level = 0): string => {
      return items
        .map((item) => {
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
}
