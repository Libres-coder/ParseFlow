/**
 * 快速测试脚本（纯 JavaScript 版本）
 */

import { PDFParser } from './packages/pdf-parser-core/dist/index.js';

async function main() {
  console.log('🧪 ParseFlow 快速测试\n');

  const pdfPath = process.argv[2];

  if (!pdfPath) {
    console.error('❌ 错误：请提供 PDF 文件路径');
    console.log('\n用法: node test-quick.js <PDF文件路径>');
    console.log('示例: node test-quick.js D:\\7.pdf');
    process.exit(1);
  }

  const parser = new PDFParser({
    cache: { enabled: false },
  });

  try {
    console.log(`📄 测试文件: ${pdfPath}\n`);

    // 测试 1: 获取元数据
    console.log('1️⃣ 测试获取元数据...');
    const metadata = await parser.getMetadata(pdfPath);
    console.log('✅ 成功');
    console.log(`   - 标题: ${metadata.info.Title || 'N/A'}`);
    console.log(`   - 作者: ${metadata.info.Author || 'N/A'}`);
    console.log(`   - 页数: ${metadata.metadata.pageCount}`);
    console.log(`   - 大小: ${(metadata.metadata.fileSize / 1024 / 1024).toFixed(2)} MB`);
    console.log(`   - PDF 版本: ${metadata.metadata.pdfVersion}\n`);

    // 测试 2: 提取第一页文本
    console.log('2️⃣ 测试提取第一页文本...');
    const page1 = await parser.extractPage(pdfPath, 1);
    console.log('✅ 成功');
    console.log(`   - 文本长度: ${page1.length} 字符`);
    console.log(`   - 前 100 字符:\n   ${page1.substring(0, 100).replace(/\n/g, ' ')}...\n`);

    // 测试 3: 提取完整文本
    console.log('3️⃣ 测试提取完整文本...');
    const fullText = await parser.extractText(pdfPath);
    console.log('✅ 成功');
    console.log(`   - 总文本长度: ${fullText.length} 字符\n`);

    // 测试 4: 搜索关键词
    console.log('4️⃣ 测试搜索功能...');
    const words = fullText.split(/\s+/).filter(w => w.length > 3);
    const searchWord = words[0] || 'test';
    console.log(`   - 搜索关键词: "${searchWord}"`);
    const results = await parser.search(pdfPath, searchWord, { maxResults: 3 });
    console.log(`✅ 找到 ${results.length} 个结果`);
    results.slice(0, 3).forEach((r, i) => {
      const preview = r.context.substring(0, 60).replace(/\n/g, ' ');
      console.log(`   [${i + 1}] 第 ${r.page} 页: ${preview}...`);
    });

    console.log('\n🎉 所有测试通过！ParseFlow 工作正常！\n');
  } catch (error) {
    console.error('\n❌ 测试失败:');
    console.error(error.message);
    if (error.stack) {
      console.error('\n堆栈信息:');
      console.error(error.stack);
    }
    process.exit(1);
  }
}

main();
