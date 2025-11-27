/**
 * 图片提取器
 *
 * 注意：完整的图片提取需要外部工具或库
 *
 * 推荐方案：
 * 1. 使用 ImageExtractorExternal (需要 poppler-utils)
 * 2. 集成 pdfjs-dist (浏览器环境)
 */

import type { ImageExtractOptions } from '../types/index.js';

export class ImageExtractor {
  /**
   * 提取 PDF 中的图片（从 buffer）
   *
   * @param buffer - PDF 文件 buffer
   * @param outputDir - 输出目录
   * @param options - 提取选项
   * @returns 提取的图片路径数组
   *
   * @throws Error - 功能未实现，建议使用 ImageExtractorExternal
   */
  extract(_buffer: Buffer, _outputDir: string, _options?: ImageExtractOptions): Promise<string[]> {
    return Promise.reject(
      new Error(
        'Image extraction from Buffer is not yet implemented.\n\n' +
          'Recommended solutions:\n' +
          '1. Use ImageExtractorExternal with file path (requires poppler-utils):\n' +
          '   const extractor = new ImageExtractorExternal();\n' +
          '   const images = await extractor.extract(pdfPath, outputDir);\n\n' +
          '2. Install poppler-utils:\n' +
          '   - Ubuntu/Debian: sudo apt-get install poppler-utils\n' +
          '   - macOS: brew install poppler\n' +
          '   - Windows: https://github.com/oschwartz10612/poppler-windows/releases\n\n' +
          'See: packages/pdf-parser-core/src/extractors/image-extractor-external.ts'
      )
    );
  }

  // 以下方法将在实现完整功能时使用

  // private validateOutputDir(_dir: string): void {
  //   // TODO: 实现目录验证
  //   // - 检查目录是否存在
  //   // - 检查写权限
  //   // - 创建目录（如果不存在）
  // }

  // private async saveImage(
  //   _imageData: Uint8Array,
  //   _outputPath: string,
  //   _format: 'png' | 'jpg'
  // ): Promise<void> {
  //   // TODO: 实现图片保存
  //   // 使用 sharp 或其他图片处理库
  // }

  // private shouldIncludeImage(
  //   _width: number,
  //   _height: number,
  //   _options?: ImageExtractOptions
  // ): boolean {
  //   // TODO: 实现图片过滤
  //   // 根据最小宽度/高度过滤
  //   return true;
  // }
}
