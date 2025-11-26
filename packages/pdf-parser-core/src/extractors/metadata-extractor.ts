/**
 * 元数据提取器
 */

import pdf from 'pdf-parse';
import type { PDFMetadata } from '../types/index.js';

export class MetadataExtractor {
  /**
   * 提取元数据
   */
  async extract(buffer: Buffer, fileSize: number): Promise<PDFMetadata> {
    const data = await pdf(buffer);
    const info = data.info;

    return {
      info: {
        Title: info.Title,
        Author: info.Author,
        Subject: info.Subject,
        Keywords: info.Keywords,
        Creator: info.Creator,
        Producer: info.Producer,
        CreationDate: info.CreationDate ? new Date(info.CreationDate) : undefined,
        ModDate: info.ModDate ? new Date(info.ModDate) : undefined,
      },
      metadata: {
        pageCount: data.numpages,
        fileSize,
        pdfVersion: data.version || '1.7',
        isEncrypted: false, // pdf-parse 不支持加密检测
      },
    };
  }
}
