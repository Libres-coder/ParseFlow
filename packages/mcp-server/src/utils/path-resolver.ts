/**
 * 路径解析和验证工具
 */

import { resolve, normalize, isAbsolute } from 'path';
import { existsSync } from 'fs';
import { logger } from './logger.js';

export class PathResolver {
  private allowedPaths: string[];

  constructor(allowedPaths?: string[]) {
    this.allowedPaths = allowedPaths?.map((p) => normalize(resolve(p))) ?? [];
  }

  /**
   * 解析并验证路径
   */
  resolve(path: string): string {
    // 规范化路径
    const normalized = normalize(path);
    const resolved = isAbsolute(normalized) ? normalized : resolve(normalized);

    // 安全检查
    if (resolved.includes('..')) {
      throw new Error('Invalid path: contains ".."');
    }

    // 检查是否在允许的路径列表中
    if (this.allowedPaths.length > 0) {
      const isAllowed = this.allowedPaths.some((allowed) => resolved.startsWith(allowed));
      if (!isAllowed) {
        logger.warn('Access denied', { path: resolved, allowedPaths: this.allowedPaths });
        throw new Error(`Access denied: path not in allowed list`);
      }
    }

    // 检查文件是否存在
    if (!existsSync(resolved)) {
      throw new Error(`File not found: ${resolved}`);
    }

    return resolved;
  }

  /**
   * 验证路径是否安全
   */
  isPathSafe(path: string): boolean {
    try {
      this.resolve(path);
      return true;
    } catch {
      return false;
    }
  }
}
