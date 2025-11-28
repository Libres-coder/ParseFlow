# parseflow-core

**Core PDF parsing library for ParseFlow** - Extract text, metadata, images, and TOC from PDF files.

[![npm version](https://img.shields.io/npm/v/parseflow-core.svg)](https://www.npmjs.com/package/parseflow-core)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

---

## ✨ Features

- 📄 **Text Extraction** - Extract text from PDF with multiple strategies (raw, formatted, clean)
- 📊 **Metadata Extraction** - Get title, author, page count, creation date, etc.
- 🔍 **Keyword Search** - Search for specific content in PDFs with context
- 🖼️ **Image Extraction** - Extract images from PDFs (requires poppler-utils)
- 📑 **Table of Contents** - Extract PDF bookmarks and outline structure (requires pdftk/pdfinfo)

---

## 📦 Installation

```bash
npm install parseflow-core
```

Or using pnpm:
```bash
pnpm add parseflow-core
```

Or using yarn:
```bash
yarn add parseflow-core
```

---

## 🚀 Quick Start

### Text Extraction

```typescript
import { PDFParser } from 'parseflow-core';

const parser = new PDFParser();

// Extract all text
const result = await parser.extractText('path/to/document.pdf');
console.log(result.text);

// Extract specific page
const page2 = await parser.extractText('path/to/document.pdf', { page: 2 });

// Extract page range
const pages = await parser.extractText('path/to/document.pdf', { range: '1-5' });
```

### Metadata Extraction

```typescript
const metadata = await parser.getMetadata('path/to/document.pdf');
console.log(metadata);
// {
//   title: 'Document Title',
//   author: 'Author Name',
//   pageCount: 10,
//   creationDate: '2025-01-01',
//   ...
// }
```

### Keyword Search

```typescript
const results = await parser.searchPDF('path/to/document.pdf', 'keyword', {
  caseSensitive: false,
  maxResults: 10
});

results.forEach(result => {
  console.log(`Found on page ${result.page}: ${result.context}`);
});
```

### Image Extraction (requires poppler-utils)

```typescript
import { ImageExtractorExternal } from 'parseflow-core';

const extractor = new ImageExtractorExternal();
const images = await extractor.extract('path/to/document.pdf', './output', {
  format: 'png'
});
```

### Table of Contents (requires pdftk or pdfinfo)

```typescript
import { TOCExtractorExternal } from 'parseflow-core';

const tocExtractor = new TOCExtractorExternal();
const toc = await tocExtractor.extract('path/to/document.pdf');
console.log(toc);
```

---

## 📚 API Reference

### PDFParser

Main parser class for PDF operations.

#### Methods

- `extractText(path, options?)` - Extract text from PDF
- `getMetadata(path)` - Get PDF metadata
- `searchPDF(path, query, options?)` - Search for keywords

### ImageExtractorExternal

Extract images from PDF using external tools.

#### Methods

- `isAvailable()` - Check if pdfimages is available
- `extract(pdfPath, outputDir, options?)` - Extract images

### TOCExtractorExternal

Extract table of contents from PDF.

#### Methods

- `isAvailable()` - Check if pdftk/pdfinfo is available
- `extract(pdfPath, options?)` - Extract TOC

---

## 🔧 External Tools

Some features require external tools:

### Image Extraction

**Windows:**
- Download [Poppler](https://github.com/oschwartz10612/poppler-windows/releases)
- Add to system PATH

**Linux:**
```bash
sudo apt-get install poppler-utils
```

**macOS:**
```bash
brew install poppler
```

### TOC Extraction

**Windows:**
- Download [Poppler](https://github.com/oschwartz10612/poppler-windows/releases) (includes pdfinfo)

**Linux:**
```bash
sudo apt-get install poppler-utils pdftk
```

**macOS:**
```bash
brew install poppler pdftk-java
```

---

## 💻 Requirements

- **Node.js**: >= 18.0.0
- **TypeScript**: >= 5.0.0 (for development)

---

## 📖 Documentation

For complete documentation, visit:
- [GitHub Repository](https://github.com/Libres-coder/ParseFlow)
- [API Documentation](https://github.com/Libres-coder/ParseFlow/tree/main/docs)
- [Examples](https://github.com/Libres-coder/ParseFlow/tree/main/examples)

---

## 🤝 Contributing

Contributions are welcome! Please see [CONTRIBUTING.md](https://github.com/Libres-coder/ParseFlow/blob/main/CONTRIBUTING.md) for details.

---

## 📄 License

MIT © Libres-coder

---

## 🙏 Acknowledgments

- [pdf-parse](https://www.npmjs.com/package/pdf-parse) - PDF text extraction
- [pdf-lib](https://www.npmjs.com/package/pdf-lib) - PDF manipulation
- [Poppler](https://poppler.freedesktop.org/) - PDF rendering library

---

## 🔗 Links

- [GitHub](https://github.com/Libres-coder/ParseFlow)
- [Issues](https://github.com/Libres-coder/ParseFlow/issues)
- [npm](https://www.npmjs.com/package/parseflow-core)

---

**Made with ❤️ by ParseFlow Team**
