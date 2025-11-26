/**
 * ParseFlow 基本使用示例
 */

import { PDFParser } from '@parseflow/core';

async function main() {
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
    results.forEach((result, i) => {
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

main();
