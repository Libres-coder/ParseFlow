#!/usr/bin/env node

/**
 * ParseFlow MCP Server
 *
 * 为 Windsurf 和其他 MCP 客户端提供 PDF 解析能力的服务器入口
 */

import { config } from 'dotenv';
import { ParseFlowServer } from './server.js';
import { logger } from './utils/logger.js';

// 加载环境变量
config();

/**
 * 启动 MCP 服务器
 */
async function main(): Promise<void> {
  try {
    logger.info('Starting ParseFlow MCP Server...');

    const server = new ParseFlowServer({
      name: 'parseflow',
      version: '1.0.0',
      cache: {
        enabled: process.env.PARSEFLOW_CACHE_ENABLED !== 'false',
        directory: process.env.PARSEFLOW_CACHE_DIR,
        ttl: parseInt(process.env.PARSEFLOW_CACHE_TTL || '3600000'),
      },
      security: {
        maxFileSize: parseInt(process.env.PARSEFLOW_MAX_FILE_SIZE || '52428800'),
        allowedPaths: process.env.PARSEFLOW_ALLOWED_PATHS?.split(';'),
      },
      ocr: {
        enabled: process.env.PARSEFLOW_ENABLE_OCR === 'true',
        language: process.env.PARSEFLOW_OCR_LANGUAGE || 'eng',
      },
    });

    await server.start();

    logger.info('ParseFlow MCP Server started successfully');

    // 优雅关闭
    process.on('SIGINT', async () => {
      logger.info('Shutting down ParseFlow MCP Server...');
      await server.stop();
      process.exit(0);
    });

    process.on('SIGTERM', async () => {
      logger.info('Shutting down ParseFlow MCP Server...');
      await server.stop();
      process.exit(0);
    });
  } catch (error) {
    logger.error('Failed to start ParseFlow MCP Server', { error });
    process.exit(1);
  }
}

// 运行服务器
main().catch((error) => {
  logger.error('Unhandled error', { error });
  process.exit(1);
});
