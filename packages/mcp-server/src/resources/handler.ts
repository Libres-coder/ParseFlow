/**
 * PDF Resource 处理器
 */

import { Resource } from '@modelcontextprotocol/sdk/types.js';
import { PDFParser } from '@parseflow/core';
import { logger } from '../utils/logger.js';
import { PathResolver } from '../utils/path-resolver.js';
import { handleError } from '../utils/error-handler.js';
import type { PDFResourceQuery } from '../types/index.js';

export class ResourceHandler {
  private pathResolver: PathResolver;

  constructor(private parser: PDFParser) {
    this.pathResolver = new PathResolver(
      process.env.PARSEFLOW_ALLOWED_PATHS?.split(';')
    );
  }

  /**
   * 列出可用的 PDF 资源
   */
  async list(): Promise<{ resources: Resource[] }> {
    try {
      logger.info('Listing PDF resources');
      
      // 暂时返回空列表，实际使用时由客户端通过 URI 直接访问
      // 未来可以实现扫描特定目录下的所有 PDF 文件
      return { resources: [] };
    } catch (error) {
      throw handleError(error, { operation: 'list_resources' });
    }
  }

  /**
   * 读取 PDF 资源
   */
  async read(uri: string): Promise<{ contents: Array<{ uri: string; mimeType: string; text: string }> }> {
    try {
      logger.info('Reading PDF resource', { uri });

      // 解析 URI
      const { path, query } = this.parseURI(uri);

      // 验证路径
      const resolvedPath = this.pathResolver.resolve(path);

      // 根据查询参数提取内容
      let text: string;

      if (query.page !== undefined) {
        text = await this.parser.extractPage(resolvedPath, query.page);
        logger.debug('Extracted page', { path: resolvedPath, page: query.page });
      } else if (query.range) {
        text = await this.parser.extractRange(resolvedPath, query.range);
        logger.debug('Extracted range', { path: resolvedPath, range: query.range });
      } else {
        text = await this.parser.extractText(resolvedPath);
        logger.debug('Extracted full text', { path: resolvedPath });
      }

      // 格式化输出
      if (query.format === 'markdown') {
        text = this.formatAsMarkdown(text);
      } else if (query.format === 'json') {
        text = JSON.stringify({ content: text }, null, 2);
      }

      return {
        contents: [
          {
            uri,
            mimeType: query.format === 'json' ? 'application/json' : 'text/plain',
            text,
          },
        ],
      };
    } catch (error) {
      throw handleError(error, { operation: 'read_resource', uri });
    }
  }

  /**
   * 解析 PDF URI
   * 格式: pdf://path/to/file.pdf?page=5&format=markdown
   */
  private parseURI(uri: string): { path: string; query: PDFResourceQuery } {
    if (!uri.startsWith('pdf://')) {
      throw new Error('Invalid URI: must start with pdf://');
    }

    const uriWithoutScheme = uri.substring(6); // 移除 'pdf://'
    const [path, queryString] = uriWithoutScheme.split('?');

    const query: PDFResourceQuery = {};

    if (queryString) {
      const params = new URLSearchParams(queryString);
      
      if (params.has('page')) {
        query.page = parseInt(params.get('page')!);
      }
      if (params.has('range')) {
        query.range = params.get('range')!;
      }
      if (params.has('section')) {
        query.section = params.get('section')!;
      }
      if (params.has('format')) {
        query.format = params.get('format') as 'text' | 'markdown' | 'json';
      }
    }

    return { path, query };
  }

  /**
   * 格式化为 Markdown
   */
  private formatAsMarkdown(text: string): string {
    // 简单的 Markdown 格式化
    // 未来可以添加更智能的格式识别
    return `# PDF Content\n\n${text}`;
  }
}
