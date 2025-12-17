/**
 * PDF 工具类 - 合并、拆分等操作
 */

import { PDFDocument, degrees } from 'pdf-lib';
import * as fs from 'fs/promises';

export interface MergeOptions {
  outputPath?: string;
}

export interface SplitOptions {
  outputDir: string;
  prefix?: string;
}

export interface SplitRangeOptions {
  outputPath: string;
}

export interface PDFUtilsResult {
  success: boolean;
  outputPath?: string;
  outputPaths?: string[];
  pageCount?: number;
  message: string;
}

export class PDFUtils {
  /**
   * 合并多个 PDF 文件
   * @param inputPaths - 输入 PDF 文件路径数组
   * @param outputPath - 输出文件路径
   */
  async merge(inputPaths: string[], outputPath: string): Promise<PDFUtilsResult> {
    if (inputPaths.length < 2) {
      throw new Error('At least 2 PDF files are required for merging');
    }

    const mergedPdf = await PDFDocument.create();

    for (const inputPath of inputPaths) {
      const pdfBytes = await fs.readFile(inputPath);
      const pdf = await PDFDocument.load(pdfBytes);
      const pages = await mergedPdf.copyPages(pdf, pdf.getPageIndices());
      pages.forEach((page) => mergedPdf.addPage(page));
    }

    const mergedBytes = await mergedPdf.save();
    await fs.writeFile(outputPath, mergedBytes);

    return {
      success: true,
      outputPath,
      pageCount: mergedPdf.getPageCount(),
      message: `Successfully merged ${inputPaths.length} PDFs into ${outputPath} (${mergedPdf.getPageCount()} pages)`,
    };
  }

  /**
   * 拆分 PDF 为单页文件
   * @param inputPath - 输入 PDF 文件路径
   * @param options - 拆分选项
   */
  async splitToPages(inputPath: string, options: SplitOptions): Promise<PDFUtilsResult> {
    const { outputDir, prefix = 'page' } = options;

    // 确保输出目录存在
    await fs.mkdir(outputDir, { recursive: true });

    const pdfBytes = await fs.readFile(inputPath);
    const pdf = await PDFDocument.load(pdfBytes);
    const pageCount = pdf.getPageCount();
    const outputPaths: string[] = [];

    for (let i = 0; i < pageCount; i++) {
      const newPdf = await PDFDocument.create();
      const [page] = await newPdf.copyPages(pdf, [i]);
      newPdf.addPage(page);

      const outputPath = `${outputDir}/${prefix}_${String(i + 1).padStart(3, '0')}.pdf`;
      const newPdfBytes = await newPdf.save();
      await fs.writeFile(outputPath, newPdfBytes);
      outputPaths.push(outputPath);
    }

    return {
      success: true,
      outputPaths,
      pageCount,
      message: `Successfully split PDF into ${pageCount} pages in ${outputDir}`,
    };
  }

  /**
   * 提取 PDF 指定页码范围
   * @param inputPath - 输入 PDF 文件路径
   * @param range - 页码范围，如 "1-5" 或 "1,3,5-7"
   * @param outputPath - 输出文件路径
   */
  async extractPages(inputPath: string, range: string, outputPath: string): Promise<PDFUtilsResult> {
    const pdfBytes = await fs.readFile(inputPath);
    const pdf = await PDFDocument.load(pdfBytes);
    const totalPages = pdf.getPageCount();

    // 解析页码范围
    const pageIndices = this.parsePageRange(range, totalPages);

    if (pageIndices.length === 0) {
      throw new Error(`Invalid page range: ${range}`);
    }

    const newPdf = await PDFDocument.create();
    const pages = await newPdf.copyPages(pdf, pageIndices);
    pages.forEach((page) => newPdf.addPage(page));

    const newPdfBytes = await newPdf.save();
    await fs.writeFile(outputPath, newPdfBytes);

    return {
      success: true,
      outputPath,
      pageCount: newPdf.getPageCount(),
      message: `Successfully extracted ${newPdf.getPageCount()} pages to ${outputPath}`,
    };
  }

  /**
   * 旋转 PDF 页面
   * @param inputPath - 输入 PDF 文件路径
   * @param degrees - 旋转角度 (90, 180, 270)
   * @param outputPath - 输出文件路径
   * @param pages - 可选，指定要旋转的页码，默认旋转所有页面
   */
  async rotatePages(
    inputPath: string,
    rotationDegrees: 90 | 180 | 270,
    outputPath: string,
    pages?: number[]
  ): Promise<PDFUtilsResult> {
    const pdfBytes = await fs.readFile(inputPath);
    const pdf = await PDFDocument.load(pdfBytes);
    const totalPages = pdf.getPageCount();

    const pagesToRotate = pages || Array.from({ length: totalPages }, (_, i) => i + 1);

    for (const pageNum of pagesToRotate) {
      if (pageNum < 1 || pageNum > totalPages) {
        throw new Error(`Invalid page number: ${pageNum}`);
      }
      const page = pdf.getPage(pageNum - 1);
      const currentRotation = page.getRotation().angle;
      page.setRotation(degrees((currentRotation + rotationDegrees) % 360));
    }

    const rotatedBytes = await pdf.save();
    await fs.writeFile(outputPath, rotatedBytes);

    return {
      success: true,
      outputPath,
      pageCount: totalPages,
      message: `Successfully rotated ${pagesToRotate.length} pages by ${rotationDegrees} degrees`,
    };
  }

  /**
   * 获取 PDF 页数
   */
  async getPageCount(inputPath: string): Promise<number> {
    const pdfBytes = await fs.readFile(inputPath);
    const pdf = await PDFDocument.load(pdfBytes);
    return pdf.getPageCount();
  }

  /**
   * 解析页码范围字符串
   * 支持格式: "1-5", "1,3,5", "1-3,5,7-9"
   */
  private parsePageRange(range: string, totalPages: number): number[] {
    const indices: Set<number> = new Set();
    const parts = range.split(',').map((p) => p.trim());

    for (const part of parts) {
      if (part.includes('-')) {
        const [start, end] = part.split('-').map((n) => parseInt(n.trim()));
        if (isNaN(start) || isNaN(end) || start < 1 || end > totalPages || start > end) {
          continue;
        }
        for (let i = start; i <= end; i++) {
          indices.add(i - 1); // 转为 0-indexed
        }
      } else {
        const pageNum = parseInt(part);
        if (!isNaN(pageNum) && pageNum >= 1 && pageNum <= totalPages) {
          indices.add(pageNum - 1); // 转为 0-indexed
        }
      }
    }

    return Array.from(indices).sort((a, b) => a - b);
  }
}
