/**
 * 基础功能测试
 * 这是一个手动测试脚本，不是自动化测试
 */

/* eslint-disable no-console */
/* eslint-disable @typescript-eslint/explicit-function-return-type */

import { PDFParser } from '../packages/pdf-parser-core/dist/index.js';

async function main(): Promise<void> {
  console.log('🧪 ParseFlow 基础功能测试\n');

  const parser = new PDFParser({
    cache: {
      enabled: false, // 测试时禁用缓存
    },
  });

  // 测试 PDF 路径 - 请替换为你的实际 PDF 文件路径
  const testPdfPath = process.argv[2];

  if (!testPdfPath) {
    console.error('❌ 错误：请提供 PDF 文件路径');
    console.log('\n用法: node tests/test-basic.js <PDF文件路径>');
    console.log('示例: node tests/test-basic.js D:\\documents\\sample.pdf');
    process.exit(1);
  }

  try {
    console.log(`📄 测试文件: ${testPdfPath}\n`);

    // 测试 1: 获取元数据
    console.log('1️⃣ 测试获取元数据...');
    const metadata = await parser.getMetadata(testPdfPath);
    console.log('✅ 成功');
    console.log(`   - 标题: ${metadata.info.Title || 'N/A'}`);
    console.log(`   - 作者: ${metadata.info.Author || 'N/A'}`);
    console.log(`   - 页数: ${metadata.metadata.pageCount}`);
    console.log(`   - 大小: ${(metadata.metadata.fileSize / 1024 / 1024).toFixed(2)} MB`);
    console.log(`   - PDF 版本: ${metadata.metadata.pdfVersion}\n`);

    // 测试 2: 提取第一页文本
    console.log('2️⃣ 测试提取第一页文本...');
    const page1 = await parser.extractPage(testPdfPath, 1);
    console.log('✅ 成功');
    console.log(`   - 文本长度: ${page1.length} 字符`);
    console.log(`   - 前 100 字符: ${page1.substring(0, 100)}...\n`);

    // 测试 3: 提取完整文本（前 500 字符）
    console.log('3️⃣ 测试提取完整文本...');
    const fullText = await parser.extractText(testPdfPath);
    console.log('✅ 成功');
    console.log(`   - 总文本长度: ${fullText.length} 字符`);
    console.log(`   - 前 200 字符:\n${fullText.substring(0, 200)}...\n`);

    // 测试 4: 搜索关键词
    console.log('4️⃣ 测试搜索功能...');
    // 从文本中提取一个常见词进行搜索
    const searchWord = fullText.split(/\s+/).find((w) => w.length > 4) || 'test';
    console.log(`   - 搜索关键词: "${searchWord}"`);
    const results = await parser.search(testPdfPath, searchWord, {
      maxResults: 3,
    });
    console.log(`✅ 找到 ${results.length} 个结果`);
    results.slice(0, 3).forEach((r, i) => {
      console.log(`   [${i + 1}] 第 ${r.page} 页: ${r.context.substring(0, 50)}...`);
    });

    console.log('\n🎉 所有测试通过！ParseFlow 工作正常！\n');
  } catch (error) {
    console.error('\n❌ 测试失败:', error);
    process.exit(1);
  }
}

void main();
