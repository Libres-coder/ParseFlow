/**
 * 目录（TOC）提取器
 *
 * 从 PDF 的书签/大纲（Outline）中提取目录结构
 */

import pdf from 'pdf-parse';
import type { TOCItem } from '../types/index.js';

export class TOCExtractor {
  /**
   * 提取目录
   *
   * @param buffer - PDF 文件 buffer
   * @returns 目录项数组
   *
   * @note 当前使用 pdf-parse，功能有限。完整的目录提取需要 pdfjs-dist
   */
  async extract(buffer: Buffer): Promise<TOCItem[]> {
    try {
      // 使用 pdf-parse 解析（功能有限）
      const data = await pdf(buffer);

      // pdf-parse 不直接支持目录提取
      // 未来可以集成 pdfjs-dist 来实现完整功能

      // 现在返回空数组，避免测试和构建问题
      // TODO: 集成 pdfjs-dist 以提取真实目录
      if (data.info) {
        // 文档存在，但我们暂时无法提取目录
      }

      return [];
    } catch (error) {
      throw new Error(
        `Failed to extract TOC: ${error instanceof Error ? error.message : String(error)}`
      );
    }
  }

  // 以下方法将在集成 pdfjs-dist 后实现
  // 注意：pdfjs-dist 在 Jest/Node.js 环境中有兼容性问题
  // 可能需要使用单独的 Node.js 兼容包或在运行时动态加载
}
