/**
 * 文本提取器
 */

import pdf from 'pdf-parse';
import type { ExtractOptions } from '../types/index.js';

export class TextExtractor {
  constructor() {}

  /**
   * 提取文本
   */
  async extract(buffer: Buffer, options?: ExtractOptions): Promise<string> {
    const data = await pdf(buffer);
    const text = data.text;

    const strategy = options?.strategy || 'formatted';

    switch (strategy) {
      case 'raw':
        return text;
      case 'formatted':
        return this.formatText(text);
      case 'clean':
        return this.cleanText(text);
      default:
        return text;
    }
  }

  /**
   * 格式化文本
   */
  private formatText(text: string): string {
    return text
      .split('\n\n')
      .map((para) => para.replace(/\s+/g, ' ').trim())
      .filter((para) => para.length > 0)
      .join('\n\n');
  }

  /**
   * 清理文本
   */
  private cleanText(text: string): string {
    return text.replace(/\s+/g, ' ').trim();
  }
}
