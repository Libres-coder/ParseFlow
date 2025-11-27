/**
 * 图片提取器
 *
 * 注意：完整的图片提取需要 pdfjs-dist 库
 * 当前实现提供基础框架和错误处理
 */

import type { ImageExtractOptions } from '../types/index.js';

export class ImageExtractor {
  /**
   * 提取 PDF 中的图片
   *
   * @param buffer - PDF 文件 buffer
   * @param outputDir - 输出目录
   * @param options - 提取选项
   * @returns 提取的图片路径数组
   *
   * @throws Error - 功能未实现
   */
  extract(_buffer: Buffer, _outputDir: string, _options?: ImageExtractOptions): Promise<string[]> {
    // TODO: 实现图片提取
    // 需要安装 pdfjs-dist: pnpm add pdfjs-dist
    //
    // 实现步骤:
    // 1. 使用 pdfjs-dist 加载 PDF
    // 2. 遍历每一页
    // 3. 获取页面上的图片对象
    // 4. 转换为指定格式 (PNG/JPG)
    // 5. 保存到输出目录
    // 6. 返回文件路径列表

    return Promise.reject(
      new Error(
        'Image extraction is not yet implemented. ' +
          'This feature requires pdfjs-dist library. ' +
          'To implement: ' +
          '1. Install pdfjs-dist: pnpm add pdfjs-dist ' +
          '2. Implement extraction logic in ImageExtractor.extract()'
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
