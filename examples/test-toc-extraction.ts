/**
 * 测试目录提取功能
 */

import { TOCExtractorExternal } from './packages/pdf-parser-core/src/extractors/toc-extractor-external.js';
import { existsSync } from 'fs';

async function test() {
  console.log('🧪 测试目录提取功能\n');

  // 工具路径
  const PDFTK_PATH = 'pdftk'; // Windows 上 pdftk 通常已在 PATH 中
  const PDFINFO_PATH = 'D:\\poppler\\poppler-24.07.0\\Library\\bin\\pdfinfo.exe';

  const pdfPath = './PDF测试文档.pdf';

  console.log(`📄 PDF: ${pdfPath}`);
  console.log(`🔧 pdftk: ${PDFTK_PATH}`);
  console.log(`🔧 pdfinfo: ${PDFINFO_PATH}\n`);

  if (!existsSync(pdfPath)) {
    console.error(`❌ PDF 文件不存在: ${pdfPath}`);
    process.exit(1);
  }

  // 创建提取器
  const extractor = new TOCExtractorExternal(PDFTK_PATH, PDFINFO_PATH);

  // 检查可用性
  console.log('🔍 检查工具可用性...');
  const available = await extractor.isAvailable();
  console.log(`  pdftk: ${available.pdftk ? '✅' : '❌'}`);
  console.log(`  pdfinfo: ${available.pdfinfo ? '✅' : '❌'}\n`);

  if (!available.pdftk && !available.pdfinfo) {
    console.error('❌ 没有可用的工具');
    process.exit(1);
  }

  // 提取目录
  try {
    console.log('📑 开始提取目录...');
    const toc = await extractor.extract(pdfPath);

    console.log(`\n✅ 提取成功！共 ${toc.length} 个目录项:\n`);

    if (toc.length === 0) {
      console.log('  (此 PDF 没有书签/目录信息)');
    } else {
      printTOC(toc, 0);
    }
  } catch (error) {
    console.error('\n❌ 提取失败:', error);
    process.exit(1);
  }
}

function printTOC(items: any[], indent: number) {
  items.forEach((item) => {
    console.log('  '.repeat(indent) + `页 ${item.page}: ${item.title}`);
    if (item.children && item.children.length > 0) {
      printTOC(item.children, indent + 1);
    }
  });
}

test();
