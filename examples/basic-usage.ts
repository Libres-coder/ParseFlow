/**
 * ParseFlow 基本使用示例
 *
 * 注意：这是一个参考模板，展示如何使用 ParseFlow PDF Parser
 * 在实际项目中，根据你的 monorepo 配置调整导入路径
 */

// 选项 1：使用相对路径（推荐用于开发）
import { PDFParser } from '../packages/pdf-parser-core/src/parser.js';

// 选项 2：如果配置了 workspace aliases
// import { PDFParser } from '@parseflow/pdf-parser-core';

/**
 * 主函数：演示 PDFParser 的基本用法
 */
async function main(): Promise<void> {
  // 创建解析器实例
  const parser = new PDFParser({
    cache: {
      enabled: true,
      ttl: 3600000, // 1 小时
    },
    security: {
      maxFileSize: 50 * 1024 * 1024, // 50MB
    },
  });

  // ⚠️ 替换为你的 PDF 文件路径
  const pdfPath = 'path/to/your/file.pdf';

  try {
    // 1. 提取完整文本
    console.log('=== 提取完整文本 ===');
    const fullText = await parser.extractText(pdfPath);
    console.log(fullText.substring(0, 500)); // 显示前 500 字符

    // 2. 提取单页
    console.log('\n=== 提取第 1 页 ===');
    const page1 = await parser.extractPage(pdfPath, 1);
    console.log(page1);

    // 3. 提取页码范围
    console.log('\n=== 提取第 1-3 页 ===');
    const pages = await parser.extractRange(pdfPath, '1-3');
    console.log(pages);

    // 4. 获取元数据
    console.log('\n=== PDF 元数据 ===');
    const metadata = await parser.getMetadata(pdfPath);
    console.log({
      title: metadata.info.Title,
      author: metadata.info.Author,
      pageCount: metadata.metadata.pageCount,
      fileSize: `${(metadata.metadata.fileSize / 1024 / 1024).toFixed(2)} MB`,
      creationDate: metadata.info.CreationDate,
    });

    // 5. 搜索关键词
    console.log('\n=== 搜索关键词 ===');
    const results = await parser.search(pdfPath, 'important', {
      caseSensitive: false,
      maxResults: 5,
    });
    console.log(`找到 ${results.length} 个结果`);
    results.forEach((result: any, i: number) => {
      console.log(`[${i + 1}] 第 ${result.page} 页: ${result.context}`);
    });

    // 6. 使用不同的提取策略
    console.log('\n=== 不同提取策略 ===');
    const rawText = await parser.extractText(pdfPath, { strategy: 'raw' });
    const formattedText = await parser.extractText(pdfPath, { strategy: 'formatted' });
    const cleanText = await parser.extractText(pdfPath, { strategy: 'clean' });
    console.log('Raw length:', rawText.length);
    console.log('Formatted length:', formattedText.length);
    console.log('Clean length:', cleanText.length);
  } catch (error) {
    console.error('Error:', error);
  }
}

// 运行示例
main();
