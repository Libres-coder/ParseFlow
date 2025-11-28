/**
 * 目录提取器 - 使用外部工具实现
 *
 * 依赖 poppler-utils 的 pdfinfo 和 pdftk
 * 安装：
 * - Ubuntu/Debian: sudo apt-get install poppler-utils pdftk
 * - macOS: brew install poppler pdftk-java
 * - Windows: 下载相应工具
 */

import { exec } from 'child_process';
import { promisify } from 'util';
import type { TOCItem } from '../types/index.js';

const execAsync = promisify(exec);

export class TOCExtractorExternal {
  private pdfinfoPath: string;
  private pdftkPath: string;

  /**
   * @param pdftkPath - pdftk 可执行文件的完整路径（可选）
   * @param pdfinfoPath - pdfinfo 可执行文件的完整路径（可选）
   */
  constructor(pdftkPath?: string, pdfinfoPath?: string) {
    this.pdftkPath = pdftkPath || 'pdftk';
    this.pdfinfoPath = pdfinfoPath || 'pdfinfo';
  }

  /**
   * 检查工具是否可用
   */
  async isAvailable(): Promise<{ pdfinfo: boolean; pdftk: boolean }> {
    const checkPdfinfo = this.execCommand(`${this.pdfinfoPath} -v`)
      .then(() => true)
      .catch(() => false);
    const checkPdftk = this.execCommand(`${this.pdftkPath} --version`)
      .then(() => true)
      .catch(() => false);

    const [pdfinfo, pdftk] = await Promise.all([checkPdfinfo, checkPdftk]);
    return { pdfinfo, pdftk };
  }

  /**
   * 执行命令（支持 Windows PowerShell）
   */
  private async execCommand(cmd: string): Promise<{ stdout: string; stderr: string }> {
    const finalCmd = process.platform === 'win32' ? `powershell.exe -Command "${cmd}"` : cmd;
    return execAsync(finalCmd);
  }

  /**
   * 提取目录
   *
   * @param pdfPath - PDF 文件路径
   * @returns 目录项数组
   */
  async extract(pdfPath: string): Promise<TOCItem[]> {
    const available = await this.isAvailable();

    // 优先使用 pdftk（输出更详细）
    if (available.pdftk) {
      return this.extractWithPdftk(pdfPath);
    }

    // 退而使用 pdfinfo
    if (available.pdfinfo) {
      return this.extractWithPdfinfo(pdfPath);
    }

    throw new Error(
      'No TOC extraction tool found. Please install:\n' +
        '- Ubuntu/Debian: sudo apt-get install pdftk (or poppler-utils)\n' +
        '- macOS: brew install pdftk-java (or poppler)\n' +
        '- Windows: Download pdftk from https://www.pdflabs.com/tools/pdftk-the-pdf-toolkit/'
    );
  }

  /**
   * 使用 pdftk 提取目录
   */
  private async extractWithPdftk(pdfPath: string): Promise<TOCItem[]> {
    try {
      const { stdout } = await this.execCommand(`${this.pdftkPath} "${pdfPath}" dump_data`);

      // 解析 pdftk 输出
      const toc: TOCItem[] = [];
      const lines = stdout.split('\n');
      let currentItem: Partial<TOCItem> | null = null;

      for (const line of lines) {
        if (line.startsWith('BookmarkTitle: ')) {
          if (currentItem) {
            toc.push(currentItem as TOCItem);
          }
          currentItem = {
            title: line.substring('BookmarkTitle: '.length).trim(),
            page: 1,
            level: 0,
          };
        } else if (line.startsWith('BookmarkLevel: ') && currentItem) {
          currentItem.level = parseInt(line.substring('BookmarkLevel: '.length)) - 1;
        } else if (line.startsWith('BookmarkPageNumber: ') && currentItem) {
          currentItem.page = parseInt(line.substring('BookmarkPageNumber: '.length));
        }
      }

      if (currentItem) {
        toc.push(currentItem as TOCItem);
      }

      return this.buildHierarchy(toc);
    } catch (error) {
      throw new Error(
        `Failed to extract TOC with pdftk: ${error instanceof Error ? error.message : String(error)}`
      );
    }
  }

  /**
   * 使用 pdfinfo 提取目录（功能有限）
   */
  private async extractWithPdfinfo(pdfPath: string): Promise<TOCItem[]> {
    try {
      // pdfinfo 不直接提供目录，只能获取基本信息
      const { stdout } = await this.execCommand(`${this.pdfinfoPath} "${pdfPath}"`);

      // pdfinfo 没有目录信息，返回空数组
      // 可以考虑基于页面标题生成简单目录
      console.warn('pdfinfo does not provide bookmark/outline information');
      console.warn('PDF info:', stdout.split('\n').slice(0, 5).join('\n'));

      return [];
    } catch (error) {
      throw new Error(
        `Failed to extract TOC with pdfinfo: ${error instanceof Error ? error.message : String(error)}`
      );
    }
  }

  /**
   * 构建层级结构
   */
  private buildHierarchy(flatItems: TOCItem[]): TOCItem[] {
    if (flatItems.length === 0) return [];

    const root: TOCItem[] = [];
    const stack: TOCItem[] = [];

    for (const item of flatItems) {
      // 找到父节点
      while (stack.length > 0 && stack[stack.length - 1].level >= item.level) {
        stack.pop();
      }

      if (stack.length === 0) {
        // 顶层项
        root.push(item);
      } else {
        // 子项
        const parent = stack[stack.length - 1];
        if (!parent.children) {
          parent.children = [];
        }
        parent.children.push(item);
      }

      stack.push(item);
    }

    return root;
  }

  /**
   * 获取使用说明
   */
  getUsageInfo(): string {
    return `
TOC Extraction using pdftk or pdfinfo

Installation:
  Ubuntu/Debian: sudo apt-get install pdftk (or poppler-utils)
  macOS:         brew install pdftk-java (or poppler)
  Windows:       Download from https://www.pdflabs.com/tools/pdftk-the-pdf-toolkit/

Usage:
  const extractor = new TOCExtractorExternal();
  
  // Check availability
  const available = await extractor.isAvailable();
  console.log('Available tools:', available);
  
  // Extract TOC
  if (available.pdftk || available.pdfinfo) {
    const toc = await extractor.extract('file.pdf');
    console.log('TOC:', JSON.stringify(toc, null, 2));
  }
`;
  }
}
