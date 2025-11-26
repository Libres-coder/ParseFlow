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

    return {
      info: {
        Title: data.info?.Title,
        Author: data.info?.Author,
        Subject: data.info?.Subject,
        Keywords: data.info?.Keywords,
        Creator: data.info?.Creator,
        Producer: data.info?.Producer,
        CreationDate: data.info?.CreationDate ? new Date(data.info.CreationDate) : undefined,
        ModDate: data.info?.ModDate ? new Date(data.info.ModDate) : undefined,
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
