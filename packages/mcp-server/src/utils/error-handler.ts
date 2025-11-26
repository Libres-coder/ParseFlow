/**
 * 错误处理工具
 */

import { McpError, ErrorCode } from '@modelcontextprotocol/sdk/types.js';
import { logger } from './logger.js';

/**
 * ParseFlow 自定义错误码
 */
export enum ParseFlowErrorCode {
  FILE_NOT_FOUND = -32001,
  INVALID_PDF = -32002,
  PARSE_ERROR = -32003,
  PERMISSION_DENIED = -32004,
  FILE_TOO_LARGE = -32005,
  UNSUPPORTED_FORMAT = -32006,
  CACHE_ERROR = -32007,
  OCR_ERROR = -32008,
  INVALID_PAGE_NUMBER = -32009,
  INVALID_RANGE = -32010,
}

/**
 * 处理错误并转换为 MCP 错误
 */
export function handleError(error: unknown, context?: Record<string, unknown>): McpError {
  logger.error('Error occurred', { error, context });

  if (error instanceof McpError) {
    return error;
  }

  if (error instanceof Error) {
    // 根据错误消息判断类型
    if (error.message.includes('not found')) {
      return new McpError(ParseFlowErrorCode.FILE_NOT_FOUND, error.message, context);
    }
    if (error.message.includes('Invalid PDF') || error.message.includes('corrupted')) {
      return new McpError(ParseFlowErrorCode.INVALID_PDF, error.message, context);
    }
    if (error.message.includes('Access denied') || error.message.includes('Permission')) {
      return new McpError(ParseFlowErrorCode.PERMISSION_DENIED, error.message, context);
    }
    if (error.message.includes('too large')) {
      return new McpError(ParseFlowErrorCode.FILE_TOO_LARGE, error.message, context);
    }
    if (error.message.includes('page')) {
      return new McpError(ParseFlowErrorCode.INVALID_PAGE_NUMBER, error.message, context);
    }

    // 默认解析错误
    return new McpError(ParseFlowErrorCode.PARSE_ERROR, error.message, context);
  }

  // 未知错误
  return new McpError(ErrorCode.InternalError, 'Internal error occurred', { context });
}
