/**
 * 使用自定义路径测试图片提取
 *
 * 使用方法：
 * 1. 在 PowerShell 中运行: (Get-Command pdfimages).Source
 * 2. 将输出的路径替换下面的 PDFIMAGES_PATH
 * 3. 运行: npx tsx test-with-path.ts
 */

import { ImageExtractorExternal } from './packages/pdf-parser-core/src/extractors/image-extractor-external.js';
import { existsSync } from 'fs';

async function test() {
  console.log('🧪 测试图片提取（使用自定义路径）\n');

  // pdfimages 完整路径
  const PDFIMAGES_PATH = 'D:\\poppler\\poppler-24.07.0\\Library\\bin\\pdfimages.exe';

  const pdfPath = './PDF测试文档.pdf';
  const outputDir = './output/test-images';

  console.log(`📄 PDF: ${pdfPath}`);
  console.log(`📁 输出: ${outputDir}`);
  console.log(`🔧 pdfimages 路径: ${PDFIMAGES_PATH}\n`);

  if (!existsSync(pdfPath)) {
    console.error(`❌ PDF 文件不存在: ${pdfPath}`);
    process.exit(1);
  }

  // 创建提取器（传入自定义路径）
  const extractor = new ImageExtractorExternal(PDFIMAGES_PATH);

  // 检查可用性
  console.log('🔍 检查 pdfimages...');
  const available = await extractor.isAvailable();

  if (!available) {
    console.error('❌ pdfimages 不可用');
    console.log('\n请确保：');
    console.log('1. pdfimages 已安装');
    console.log('2. 路径正确');
    console.log('\n在 PowerShell 中运行查找路径：');
    console.log('   (Get-Command pdfimages).Source');
    process.exit(1);
  }

  console.log('✅ pdfimages 可用\n');

  // 提取图片
  try {
    console.log('🖼️  开始提取图片...');
    const images = await extractor.extract(pdfPath, outputDir, {
      format: 'png',
    });

    console.log(`\n✅ 提取成功！共 ${images.length} 张图片:\n`);
    images.forEach((img, i) => console.log(`  ${i + 1}. ${img}`));
    console.log(`\n📁 保存在: ${outputDir}`);
  } catch (error) {
    console.error('\n❌ 提取失败:', error);
    process.exit(1);
  }
}

test();
