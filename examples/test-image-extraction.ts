/**
 * 测试图片提取功能
 */

import { ImageExtractorExternal } from './packages/pdf-parser-core/src/extractors/image-extractor-external.js';
import { existsSync, mkdirSync } from 'fs';
import { join } from 'path';

async function testImageExtraction() {
  console.log('🧪 测试图片提取功能\n');

  const pdfPath = './PDF测试文档.pdf';
  const outputDir = './output/test-images';

  // 检查 PDF 文件是否存在
  if (!existsSync(pdfPath)) {
    console.error(`❌ PDF 文件不存在: ${pdfPath}`);
    process.exit(1);
  }

  console.log(`📄 PDF 文件: ${pdfPath}`);
  console.log(`📁 输出目录: ${outputDir}\n`);

  // 创建提取器
  const extractor = new ImageExtractorExternal();

  // 1. 检查工具是否可用
  console.log('🔍 检查 pdfimages 是否可用...');
  const available = await extractor.isAvailable();

  if (!available) {
    console.error('❌ pdfimages 不可用');
    console.log(extractor.getUsageInfo());
    process.exit(1);
  }

  console.log('✅ pdfimages 可用\n');

  // 2. 提取图片
  try {
    console.log('🖼️  开始提取图片...');

    const images = await extractor.extract(pdfPath, outputDir, {
      format: 'png',
    });

    console.log(`\n✅ 提取成功！`);
    console.log(`📊 共提取 ${images.length} 张图片:\n`);

    images.forEach((img, index) => {
      console.log(`  ${index + 1}. ${img}`);
    });

    console.log(`\n📁 图片保存在: ${outputDir}`);
  } catch (error) {
    console.error('\n❌ 提取失败:');
    console.error(error instanceof Error ? error.message : String(error));
    process.exit(1);
  }
}

// 运行测试
testImageExtraction().catch((error) => {
  console.error('💥 测试失败:', error);
  process.exit(1);
});
