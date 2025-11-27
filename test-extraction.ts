/**
 * 测试图片和目录提取功能
 */

import { ImageExtractorExternal } from './packages/pdf-parser-core/src/extractors/image-extractor-external.js';
import { TOCExtractorExternal } from './packages/pdf-parser-core/src/extractors/toc-extractor-external.js';
import { PDFParser } from './packages/pdf-parser-core/src/parser.js';

const testPdfPath = 'D:\\ParseFlow\\PDF测试文档.pdf';

async function testExtraction() {
  console.log('🧪 开始测试 PDF 提取功能\n');
  console.log('测试文件:', testPdfPath);
  console.log('='.repeat(60));

  // 1. 测试基础功能（内置）
  console.log('\n📄 测试基础功能 (PDFParser)...');
  try {
    const parser = new PDFParser();
    const metadata = await parser.getMetadata(testPdfPath);
    console.log('✅ 元数据提取成功:');
    console.log(`   - 页数: ${metadata.metadata.pageCount}`);
    console.log(`   - 文件大小: ${(metadata.metadata.fileSize / 1024).toFixed(2)} KB`);
    if (metadata.info.Title) {
      console.log(`   - 标题: ${metadata.info.Title}`);
    }
  } catch (error) {
    console.error('❌ 元数据提取失败:', error.message);
  }

  // 2. 测试图片提取（外部工具）
  console.log('\n🖼️  测试图片提取 (ImageExtractorExternal)...');
  try {
    const imgExtractor = new ImageExtractorExternal();
    
    // 检查工具是否可用
    const imgAvailable = await imgExtractor.isAvailable();
    console.log(`   工具状态: ${imgAvailable ? '✅ 可用' : '❌ 不可用'}`);
    
    if (imgAvailable) {
      const outputDir = './test-output/images';
      console.log(`   输出目录: ${outputDir}`);
      console.log('   开始提取...');
      
      const images = await imgExtractor.extract(testPdfPath, outputDir, {
        format: 'png',
      });
      
      console.log(`✅ 图片提取成功!`);
      console.log(`   提取数量: ${images.length} 张`);
      if (images.length > 0) {
        console.log('   图片列表:');
        images.forEach((img, i) => {
          console.log(`     ${i + 1}. ${img}`);
        });
      }
    } else {
      console.log('⚠️  pdfimages 未安装，跳过图片提取');
      console.log('\n   安装方法:');
      console.log('   - Ubuntu/Debian: sudo apt-get install poppler-utils');
      console.log('   - macOS: brew install poppler');
      console.log('   - Windows: https://github.com/oschwartz10612/poppler-windows/releases');
    }
  } catch (error) {
    console.error('❌ 图片提取失败:', error.message);
  }

  // 3. 测试目录提取（外部工具）
  console.log('\n📑 测试目录提取 (TOCExtractorExternal)...');
  try {
    const tocExtractor = new TOCExtractorExternal();
    
    // 检查工具是否可用
    const tocAvailable = await tocExtractor.isAvailable();
    console.log(`   工具状态:`);
    console.log(`     pdftk:   ${tocAvailable.pdftk ? '✅ 可用' : '❌ 不可用'}`);
    console.log(`     pdfinfo: ${tocAvailable.pdfinfo ? '✅ 可用' : '❌ 不可用'}`);
    
    if (tocAvailable.pdftk || tocAvailable.pdfinfo) {
      console.log('   开始提取...');
      const toc = await tocExtractor.extract(testPdfPath);
      
      if (toc.length === 0) {
        console.log('⚠️  PDF 没有书签/目录信息');
      } else {
        console.log(`✅ 目录提取成功!`);
        console.log(`   目录项数: ${toc.length}`);
        console.log('\n   目录结构:');
        printTOC(toc, 2);
      }
    } else {
      console.log('⚠️  pdftk/pdfinfo 未安装，跳过目录提取');
      console.log('\n   安装方法:');
      console.log('   - Ubuntu/Debian: sudo apt-get install pdftk poppler-utils');
      console.log('   - macOS: brew install pdftk-java poppler');
      console.log('   - Windows: 下载 PDFtk 和 Poppler');
    }
  } catch (error) {
    console.error('❌ 目录提取失败:', error.message);
  }

  console.log('\n' + '='.repeat(60));
  console.log('🎉 测试完成!');
}

function printTOC(items: any[], indent: number) {
  items.forEach((item) => {
    console.log(' '.repeat(indent) + `${item.page}: ${item.title}`);
    if (item.children && item.children.length > 0) {
      printTOC(item.children, indent + 2);
    }
  });
}

// 运行测试
testExtraction().catch((error) => {
  console.error('测试失败:', error);
  process.exit(1);
});
