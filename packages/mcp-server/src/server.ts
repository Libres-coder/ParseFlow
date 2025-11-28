/**
 * ParseFlow MCP Server 核心实现
 */

import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import {
  ListResourcesRequestSchema,
  ReadResourceRequestSchema,
  ListToolsRequestSchema,
  CallToolRequestSchema,
} from '@modelcontextprotocol/sdk/types.js';
import { PDFParser } from 'parseflow-core';
import { logger } from './utils/logger.js';
import { ResourceHandler } from './resources/handler.js';
import { ToolHandler } from './tools/index.js';
import type { ServerConfig } from './types/index.js';

/**
 * ParseFlow MCP 服务器
 */
export class ParseFlowServer {
  private server: Server;
  private parser: PDFParser;
  private resourceHandler: ResourceHandler;
  private toolHandler: ToolHandler;
  private transport?: StdioServerTransport;

  constructor(config: ServerConfig) {
    // 初始化 MCP 服务器
    this.server = new Server(
      {
        name: config.name,
        version: config.version,
      },
      {
        capabilities: {
          resources: {},
          tools: {},
        },
      }
    );

    // 初始化 PDF 解析器
    this.parser = new PDFParser({
      cache: config.cache,
      security: config.security,
      ocr: config.ocr,
    });

    // 初始化处理器
    this.resourceHandler = new ResourceHandler(this.parser);
    this.toolHandler = new ToolHandler(this.parser);

    // 设置请求处理器
    this.setupHandlers();
  }

  /**
   * 设置 MCP 请求处理器
   */
  private setupHandlers(): void {
    // Resource 处理
    this.server.setRequestHandler(ListResourcesRequestSchema, () => this.resourceHandler.list());

    this.server.setRequestHandler(ReadResourceRequestSchema, async (request) =>
      this.resourceHandler.read(request.params.uri)
    );

    // Tool 处理
    this.server.setRequestHandler(ListToolsRequestSchema, () => this.toolHandler.list());

    this.server.setRequestHandler(CallToolRequestSchema, async (request) =>
      this.toolHandler.call(request.params.name, request.params.arguments ?? {})
    );

    // 错误处理
    this.server.onerror = (error) => {
      logger.error('MCP Server error', { error });
    };

    logger.info('MCP request handlers configured');
  }

  /**
   * 启动服务器
   */
  async start(): Promise<void> {
    this.transport = new StdioServerTransport();
    await this.server.connect(this.transport);
    logger.info('MCP Server connected via stdio transport');
  }

  /**
   * 停止服务器
   */
  async stop(): Promise<void> {
    if (this.transport) {
      await this.server.close();
      logger.info('MCP Server stopped');
    }
  }
}
