# 📄 ParseFlow

<div align="center">

**AI-Powered Universal Document Parsing Library**

[![npm version](https://img.shields.io/npm/v/parseflow-core.svg)](https://www.npmjs.com/package/parseflow-core)
[![MCP Server](https://img.shields.io/badge/MCP-Server-blue)](https://www.npmjs.com/package/parseflow-mcp-server)
[![License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)
[![Version](https://img.shields.io/badge/version-1.6.0-orange.svg)](CHANGELOG.md)

[中文](README.md) | **English**

</div>

---

ParseFlow is a comprehensive document parsing solution that supports **PDF**, **Word**, **Excel**, **PowerPoint**, and **OCR**. It provides both a standalone library and an MCP server for AI assistants.

## ✨ Features

### 📄 PDF Support
- ✅ Text extraction with multiple strategies
- ✅ 🔐 Encrypted PDF password support
- ✅ 📄 PDF merge, split, extract pages
- ✅ Metadata, search, TOC extraction

### 📝 Word / 📊 Excel / 🎯 PowerPoint
- ✅ Text extraction and search
- ✅ HTML conversion (Word)
- ✅ Multi-sheet support (Excel)
- ✅ Slide extraction (PowerPoint)

### 🔍 OCR Image Recognition
- ✅ 12 languages supported
- ✅ Image text extraction and search

### 🧠 Semantic Search
- ✅ AI vector embeddings
- ✅ Intelligent document search (no exact keywords needed)

### 🤖 MCP Server
- ✅ **18 tools** for AI assistants
- ✅ Works with Claude Desktop, Windsurf, Cursor

---

## 📦 Installation

### Core Library

```bash
npm install parseflow-core
```

### MCP Server (Global)

```bash
npm install -g parseflow-mcp-server
```

Or use with npx:

```bash
npx parseflow-mcp-server
```

---

## 🚀 Quick Start

### PDF Parsing

```typescript
import { PDFParser } from 'parseflow-core';

const parser = new PDFParser();

// Extract all text
const text = await parser.extractText('document.pdf');

// Extract specific page
const page5 = await parser.extractPage('document.pdf', 5);

// Search
const results = await parser.search('document.pdf', 'keyword');

// Get metadata
const metadata = await parser.getMetadata('document.pdf');
```

### Word Parsing

```typescript
import { WordParser } from 'parseflow-core';

const parser = new WordParser();

// Extract text
const result = await parser.extractText('report.docx');
console.log(result.text);

// Convert to HTML
const html = await parser.extractHTML('report.docx');

// Search
const matches = await parser.searchText('report.docx', 'budget');
```

### Excel Parsing

```typescript
import { ExcelParser } from 'parseflow-core';

const parser = new ExcelParser();

// Extract all sheets (JSON format)
const data = await parser.extractData('spreadsheet.xlsx');

// Extract specific sheet
const sales = await parser.extractData('data.xlsx', {
  sheetName: 'Q4 Sales',
  format: 'json'
});

// Search in cells
const results = await parser.searchText('data.xlsx', 'revenue');
```

---

## 📚 Documentation

### 📖 User Guides

- [Quick Start](docs/en/guides/quick-start.md) - Get started in 5 minutes
- [FAQ](docs/en/guides/faq.md) - Frequently asked questions
- [Examples](docs/en/guides/examples.md) - Code examples and best practices

### ⚙️ Setup Guides

- [Windsurf Setup](docs/en/setup/windsurf.md) - Windsurf IDE configuration (Recommended)
- [Cursor Setup](docs/en/setup/cursor.md) - Cursor IDE configuration

### 🛠️ Development Documentation

- [API Reference](docs/en/development/api.md) - Complete API documentation
- [Architecture](docs/en/development/architecture.md) - System architecture
- [Development Guide](docs/en/development/development.md) - How to contribute
- [Naming Conventions](docs/en/development/naming-conventions.md) - Code standards

### 📋 Project Planning

- [TODO](docs/en/planning/todo.md) - Feature roadmap
- [Distribution Analysis](docs/en/planning/distribution-analysis.md) - Release plans

### 📂 Documentation Index

- [Complete Documentation](docs/en/README.md) - Full documentation index

---

## 🎯 Usage Examples

### Text Extraction

```
Q: Extract text from D:\report.pdf
A: [Parsed text content...]
```

### Keyword Search

```
Q: Search for "contract" in D:\document.pdf
A: Found 3 results:
   Page 1: ...contract terms...
   Page 3: ...contract signed...
   Page 5: ...contract expires...
```

### Metadata Retrieval

```
Q: What's the author of D:\document.pdf?
A: Author: Unknown, Created: 2025-01-15
```

---

## 🛠️ Project Structure

```
ParseFlow/
├── packages/
│   ├── mcp-server/              # MCP Server
│   │   ├── src/
│   │   │   ├── index.ts         # Entry point
│   │   │   ├── server.ts        # MCP Server core
│   │   │   ├── tools/           # MCP tools
│   │   │   ├── resources/       # MCP resources
│   │   │   └── utils/           # Utilities
│   │   └── dist/                # Build output
│   └── pdf-parser-core/         # PDF parsing core
│       ├── src/
│       │   ├── parser.ts        # Main parser
│       │   ├── extractors/      # Text extractors
│       │   ├── search/          # Search functionality
│       │   └── types/           # Type definitions
│       └── dist/                # Build output
├── docs/                        # Documentation
│   ├── zh/                      # Chinese docs
│   └── en/                      # English docs
├── examples/                    # Usage examples
├── tests/                       # Test files
└── scripts/                     # Utility scripts
```

---

## 🔧 MCP Tools

ParseFlow provides the following MCP tools:

| Tool              | Description               | Parameters                                       | Status |
| ----------------- | ------------------------- | ------------------------------------------------ | ------ |
| `extract_text`    | Extract text from PDF     | `path`, `page?`, `range?`, `strategy?`           | ✅     |
| `get_metadata`    | Get PDF metadata          | `path`                                           | ✅     |
| `search_pdf`      | Search keywords in PDF    | `path`, `query`, `caseSensitive?`, `maxResults?` | ✅     |
| `extract_images`  | Extract images from PDF   | `path`, `outputDir`, `format?`                   | ✅     |
| `get_toc`         | Get table of contents     | `path`                                           | ✅     |

For detailed API documentation, see [API Reference](docs/en/development/api.md)

---

## 🚀 Future Plans

### ✅ Completed Features (v1.0.0)

- ✅ Text extraction
- ✅ Metadata extraction
- ✅ Keyword search
- ✅ Image extraction (external tool integration)
- ✅ Table of contents extraction (external tool integration)

### High Priority

#### ⭐ npm Package Release

Simplify installation and usage!

**Plans**:

- ✅ Core functionality complete
- ✅ Documentation complete
- ✅ Testing complete
- 📦 Ready to publish to npm
- 🎯 Submit to official MCP Registry

**Priority**: ⭐⭐⭐⭐⭐

#### ⭐ GitHub Release

Complete project release

**Plans**:

- 📋 Create release notes
- 📦 Package distribution
- 🎉 v1.0.0 release

**Priority**: ⭐⭐⭐⭐⭐

### Medium Priority

- 🔄 Performance optimization (large file handling)
- 📊 Advanced search features (fuzzy search, regex)
- 🎨 Better error messages and user feedback

### Future Considerations

- 📸 OCR support (for scanned documents)
- 🤖 AI-powered document analysis
- 🔄 PDF merge/split functionality
- 🔐 PDF encryption/decryption
- 🌐 More IDE integrations

**Detailed Roadmap**: [docs/en/planning/todo.md](docs/en/planning/todo.md)

---

## 🤝 Contributing

Contributions welcome! Please see [CONTRIBUTING.md](CONTRIBUTING.md)

### Contribution Process

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 🐛 Issue Reporting

If you encounter problems:

1. Check [docs/en/guides/faq.md](docs/en/guides/faq.md) for common issues
2. Check [logs/parseflow.log](logs/) log file
3. Submit an [Issue](https://github.com/Libres-coder/ParseFlow/issues)

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details

---

## 🙏 Acknowledgments

- [Model Context Protocol](https://modelcontextprotocol.io) - MCP protocol standard
- [pdf-parse](https://www.npmjs.com/package/pdf-parse) - PDF text extraction library
- [pdf-lib](https://www.npmjs.com/package/pdf-lib) - PDF manipulation library
- [Poppler](https://poppler.freedesktop.org/) - PDF rendering library
- Windsurf Community - Testing and feedback

---

## 📮 Resources

- [MCP Protocol Documentation](https://modelcontextprotocol.io)
- [Windsurf IDE](https://codeium.com/windsurf)
- [Project Documentation](docs/en/)

---

<div align="center">

**Made with ❤️ by ParseFlow Team**

</div>
