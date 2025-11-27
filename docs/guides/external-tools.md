# 🔧 使用外部工具提取图片和目录

ParseFlow 提供两种方式实现图片和目录提取：

1. **内置实现**（当前有限）- 使用 pdf-lib
2. **外部工具集成**（完整功能）- 使用 poppler-utils ⭐ 推荐

---

## 📦 安装外部工具

### Ubuntu/Debian

```bash
sudo apt-get update
sudo apt-get install poppler-utils pdftk
```

### macOS

```bash
brew install poppler pdftk-java
```

### Windows

1. **Poppler**: 
   - 下载：https://github.com/oschwartz10612/poppler-windows/releases
   - 解压到 `C:\poppler`
   - 添加 `C:\poppler\Library\bin` 到 PATH

2. **PDFtk**:
   - 下载：https://www.pdflabs.com/tools/pdftk-the-pdf-toolkit/
   - 安装并添加到 PATH

---

## 🖼️ 图片提取

### 方法 1: 使用 ImageExtractorExternal ⭐

```typescript
import { ImageExtractorExternal } from '@parseflow/core';

const extractor = new ImageExtractorExternal();

// 1. 检查工具是否可用
const available = await extractor.isAvailable();
if (!available) {
  console.error('pdfimages not found. Please install poppler-utils');
  console.log(extractor.getUsageInfo());
  process.exit(1);
}

// 2. 提取图片
try {
  const images = await extractor.extract(
    './document.pdf',
    './output/images',
    {
      format: 'png',  // 或 'jpg'
      minWidth: 100,   // 可选：最小宽度
      minHeight: 100,  // 可选：最小高度
    }
  );
  
  console.log(`提取了 ${images.length} 张图片:`);
  images.forEach((img) => console.log(`  - ${img}`));
} catch (error) {
  console.error('提取失败:', error.message);
}
```

### 方法 2: 直接使用 pdfimages 命令

```bash
# 提取为 PNG
pdfimages -png document.pdf output/image

# 提取为 JPG
pdfimages -jpg document.pdf output/image

# 提取所有格式
pdfimages -all document.pdf output/image
```

### 输出示例

```
output/images/
├── image-000.png
├── image-001.png
├── image-002.png
└── ...
```

---

## 📑 目录提取

### 方法 1: 使用 TOCExtractorExternal ⭐

```typescript
import { TOCExtractorExternal } from '@parseflow/core';

const extractor = new TOCExtractorExternal();

// 1. 检查工具是否可用
const available = await extractor.isAvailable();
console.log('Available tools:', available);
// { pdfinfo: true, pdftk: true }

if (!available.pdftk && !available.pdfinfo) {
  console.error('No TOC extraction tool found');
  console.log(extractor.getUsageInfo());
  process.exit(1);
}

// 2. 提取目录
try {
  const toc = await extractor.extract('./document.pdf');
  
  console.log('目录结构:');
  printTOC(toc, 0);
} catch (error) {
  console.error('提取失败:', error.message);
}

function printTOC(items: TOCItem[], indent: number) {
  items.forEach((item) => {
    console.log('  '.repeat(indent) + `${item.page}: ${item.title}`);
    if (item.children) {
      printTOC(item.children, indent + 1);
    }
  });
}
```

### 方法 2: 使用 pdftk 命令

```bash
# 导出目录和元数据
pdftk document.pdf dump_data output data.txt

# 查看目录
cat data.txt | grep -A 2 "Bookmark"
```

### 输出示例

```
目录结构:
1: 第一章 引言
  2: 1.1 背景
  5: 1.2 目标
8: 第二章 方法
  9: 2.1 数据收集
  12: 2.2 数据分析
```

---

## 🔄 在 PDFParser 中使用

虽然 `PDFParser` 的 `extractImages()` 和 `getTOC()` 方法功能有限，但你可以这样组合使用：

```typescript
import { PDFParser, ImageExtractorExternal, TOCExtractorExternal } from '@parseflow/core';
import { writeFileSync } from 'fs';

const pdfPath = './document.pdf';
const parser = new PDFParser();

// 1. 使用 PDFParser 提取文本和元数据
const text = await parser.extractText(pdfPath);
const metadata = await parser.getMetadata(pdfPath);

console.log('文本长度:', text.length);
console.log('页数:', metadata.metadata.pageCount);

// 2. 使用外部工具提取图片
const imageExtractor = new ImageExtractorExternal();
if (await imageExtractor.isAvailable()) {
  const images = await imageExtractor.extract(pdfPath, './output/images');
  console.log('提取图片:', images.length);
}

// 3. 使用外部工具提取目录
const tocExtractor = new TOCExtractorExternal();
const available = await tocExtractor.isAvailable();
if (available.pdftk || available.pdfinfo) {
  const toc = await tocExtractor.extract(pdfPath);
  console.log('目录项:', toc.length);
  
  // 保存为 JSON
  writeFileSync('./output/toc.json', JSON.stringify(toc, null, 2));
}
```

---

## ⚠️ 注意事项

### 1. 外部依赖

- **优点**: 功能完整、稳定可靠
- **缺点**: 需要用户安装外部工具
- **建议**: 在文档中清楚说明安装步骤

### 2. 路径问题

外部工具需要文件路径，不能直接使用 Buffer：

```typescript
// ❌ 不可行
const buffer = readFileSync('document.pdf');
await extractor.extract(buffer, './output');  // 错误！

// ✅ 正确
await extractor.extract('./document.pdf', './output');
```

### 3. 跨平台兼容性

- Windows 上 PATH 配置可能需要手动设置
- 建议提供 `isAvailable()` 检查并给出友好提示

### 4. 错误处理

```typescript
const extractor = new ImageExtractorExternal();

try {
  if (!(await extractor.isAvailable())) {
    throw new Error('pdfimages not available');
  }
  
  const images = await extractor.extract(pdfPath, outputDir);
  console.log('Success:', images);
} catch (error) {
  if (error.message.includes('not found')) {
    console.error('请安装 poppler-utils');
    console.error(extractor.getUsageInfo());
  } else {
    console.error('提取失败:', error);
  }
}
```

---

## 🎯 最佳实践

### 1. 优雅降级

```typescript
async function extractImagesWithFallback(pdfPath: string, outputDir: string) {
  const extractor = new ImageExtractorExternal();
  
  if (await extractor.isAvailable()) {
    // 使用外部工具
    return await extractor.extract(pdfPath, outputDir);
  } else {
    // 提示用户安装工具
    console.warn('pdfimages not available. Images will not be extracted.');
    console.warn('Install poppler-utils for image extraction support.');
    return [];
  }
}
```

### 2. 进度反馈

```typescript
async function extractWithProgress(pdfPath: string, outputDir: string) {
  console.log('检查工具...');
  const available = await extractor.isAvailable();
  
  if (!available) {
    throw new Error('Tool not available');
  }
  
  console.log('提取图片...');
  const images = await extractor.extract(pdfPath, outputDir);
  
  console.log(`✅ 成功提取 ${images.length} 张图片`);
  return images;
}
```

### 3. 批量处理

```typescript
import { glob } from 'glob';

async function batchExtract(pattern: string, outputBase: string) {
  const files = await glob(pattern);
  const extractor = new ImageExtractorExternal();
  
  for (const file of files) {
    const outputDir = `${outputBase}/${path.basename(file, '.pdf')}`;
    const images = await extractor.extract(file, outputDir);
    console.log(`${file}: ${images.length} images`);
  }
}

// 使用
await batchExtract('./pdfs/*.pdf', './output');
```

---

## 📚 相关资源

- [Poppler Utils 文档](https://poppler.freedesktop.org/)
- [PDFtk 文档](https://www.pdflabs.com/docs/pdftk-man-page/)
- [pdfimages 命令参考](https://linux.die.net/man/1/pdfimages)
- [pdfinfo 命令参考](https://linux.die.net/man/1/pdfinfo)

---

## 💡 FAQ

### Q: 为什么不内置这些功能？

A: pdfjs-dist 在 Node.js 环境中有兼容性问题。外部工具更稳定可靠。

### Q: 我必须安装外部工具吗？

A: 不是必须的。如果只需要文本提取和元数据，`PDFParser` 内置功能就够了。

### Q: 外部工具安全吗？

A: Poppler 和 PDFtk 都是开源的、广泛使用的工具，安全可靠。

### Q: 能否在浏览器中使用？

A: 外部工具版本不能在浏览器中使用。浏览器环境请使用 pdfjs-dist。

---

**更新**: 2025-11-28  
**版本**: 1.0.0

