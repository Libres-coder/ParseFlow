/**
 * 图片提取器 - 使用外部工具实现
 *
 * 依赖 poppler-utils 的 pdfimages 命令
 * 安装：
 * - Ubuntu/Debian: sudo apt-get install poppler-utils
 * - macOS: brew install poppler
 * - Windows: 下载 https://github.com/oschwartz10612/poppler-windows/releases
 */

import { exec } from 'child_process';
import { promisify } from 'util';
import { existsSync, mkdirSync, readdirSync } from 'fs';
import { join, basename } from 'path';
import type { ImageExtractOptions } from '../types/index.js';

const execAsync = promisify(exec);

export class ImageExtractorExternal {
  private pdfimagesPath: string;

  /**
   * @param pdfimagesPath - pdfimages 可执行文件的完整路径（可选）
   */
  constructor(pdfimagesPath?: string) {
    this.pdfimagesPath = pdfimagesPath || 'pdfimages';
  }

  /**
   * 检查 pdfimages 是否可用
   */
  async isAvailable(): Promise<boolean> {
    try {
      // Windows 上使用 PowerShell 执行命令
      const cmd =
        process.platform === 'win32'
          ? `powershell.exe -Command "${this.pdfimagesPath} -v"`
          : `${this.pdfimagesPath} -v`;

      await execAsync(cmd);
      return true;
    } catch {
      return false;
    }
  }

  /**
   * 提取 PDF 中的图片
   *
   * @param pdfPath - PDF 文件路径
   * @param outputDir - 输出目录
   * @param options - 提取选项
   * @returns 提取的图片路径数组
   */
  async extract(
    pdfPath: string,
    outputDir: string,
    options?: ImageExtractOptions
  ): Promise<string[]> {
    // 检查工具是否可用
    if (!(await this.isAvailable())) {
      throw new Error(
        'pdfimages not found. Please install poppler-utils:\n' +
          '- Ubuntu/Debian: sudo apt-get install poppler-utils\n' +
          '- macOS: brew install poppler\n' +
          '- Windows: https://github.com/oschwartz10612/poppler-windows/releases'
      );
    }

    // 创建输出目录
    if (!existsSync(outputDir)) {
      mkdirSync(outputDir, { recursive: true });
    }

    // 构建命令
    const imagePrefix = join(outputDir, 'image');
    const format = options?.format || 'png';
    const formatFlag = format === 'png' ? '-png' : '-jpg';

    try {
      // 执行 pdfimages
      const cmd =
        process.platform === 'win32'
          ? `powershell.exe -Command "${this.pdfimagesPath} ${formatFlag} '${pdfPath}' '${imagePrefix}'"`
          : `${this.pdfimagesPath} ${formatFlag} "${pdfPath}" "${imagePrefix}"`;

      await execAsync(cmd);

      // 列出生成的文件
      const files = readdirSync(outputDir);
      const imageFiles = files
        .filter((file) => file.startsWith(basename(imagePrefix)))
        .map((file) => join(outputDir, file));

      // 应用过滤器
      if (options?.minWidth || options?.minHeight) {
        // TODO: 使用 sharp 或其他库过滤图片大小
        // 现在直接返回所有图片
      }

      return imageFiles;
    } catch (error) {
      throw new Error(
        `Failed to extract images: ${error instanceof Error ? error.message : String(error)}`
      );
    }
  }

  /**
   * 获取使用说明
   */
  getUsageInfo(): string {
    return `
Image Extraction using pdfimages (poppler-utils)

Installation:
  Ubuntu/Debian: sudo apt-get install poppler-utils
  macOS:         brew install poppler  
  Windows:       Download from https://github.com/oschwartz10612/poppler-windows/releases

Usage:
  const extractor = new ImageExtractorExternal();
  
  // Check if available
  if (await extractor.isAvailable()) {
    const images = await extractor.extract('file.pdf', './output');
    console.log('Extracted images:', images);
  } else {
    console.log('pdfimages not found');
  }
`;
  }
}
