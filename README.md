# 📄 ParseFlow

**Universal document parsing library for PDF, Word, and Excel files**

[![npm version](https://img.shields.io/npm/v/parseflow-core.svg)](https://www.npmjs.com/package/parseflow-core)
[![MCP Server](https://img.shields.io/badge/MCP-Server-blue)](https://www.npmjs.com/package/parseflow-mcp-server)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

ParseFlow is a comprehensive document parsing solution that supports **PDF**, **Word (docx)**, and **Excel (xlsx/xls)** files. It provides both a standalone library and an MCP (Model Context Protocol) server for AI assistants.

[中文文档](./README_EN.md) | [Examples](./OFFICE_EXAMPLES.md) | [GitHub](https://github.com/Libres-coder/ParseFlow)

---

## ✨ Features

### 📄 PDF Support
- ✅ Text extraction with multiple strategies (raw, formatted, clean)
- ✅ Page-specific and range-based extraction
- ✅ Metadata retrieval (title, author, dates, page count)
- ✅ Full-text search with context
- ✅ Image extraction (placeholder)
- ✅ Table of contents (TOC) extraction (placeholder)

### 📝 Word (docx) Support
- ✅ Text extraction
- ✅ HTML conversion
- ✅ Metadata retrieval
- ✅ Text search with context

### 📊 Excel (xlsx/xls) Support
- ✅ Multi-sheet data extraction
- ✅ Multiple output formats (JSON, CSV, Text)
- ✅ Sheet-specific extraction
- ✅ Cell-based search
- ✅ Range extraction
- ✅ Workbook metadata

### 🤖 MCP Server
- ✅ 9 tools for AI assistants (5 PDF + 2 Word + 2 Excel)
- ✅ Works with Claude Desktop and other MCP clients
- ✅ Path security with allowlist support

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

## 🛠️ MCP Server Usage

### Configuration for Claude Desktop

Add to `claude_desktop_config.json`:

```json
{
  "mcpServers": {
    "parseflow": {
      "command": "npx",
      "args": ["-y", "parseflow-mcp-server"],
      "env": {
        "PARSEFLOW_ALLOWED_PATHS": "C:\\Documents;D:\\Projects"
      }
    }
  }
}
```

### Available Tools

#### PDF Tools
- `extract_text` - Extract text from PDF files
- `search_pdf` - Search for keywords in PDF
- `get_metadata` - Get PDF metadata
- `extract_images` - Extract images from PDF
- `get_toc` - Get table of contents

#### Word Tools
- `extract_word` - Extract text/HTML from Word documents
- `search_word` - Search in Word documents

#### Excel Tools
- `extract_excel` - Extract data from Excel spreadsheets
- `search_excel` - Search in Excel cells

### Example Usage in Claude

```
"请读取 report.docx 文件的内容"
→ Uses extract_word tool

"在 sales.xlsx 中查找 '产品A'"
→ Uses search_excel tool

"提取 document.pdf 的元数据"
→ Uses get_metadata tool
```

---

## 📚 Documentation

- **[Office Examples](./OFFICE_EXAMPLES.md)** - Word and Excel usage examples
- **[Release Guide](./RELEASE_GUIDE.md)** - How to publish new versions
- **[Contributing](./CONTRIBUTING.md)** - Contribution guidelines
- **[Security Policy](./SECURITY.md)** - Security vulnerability reporting
- **[Code of Conduct](./CODE_OF_CONDUCT.md)** - Community guidelines

---

## 🏗️ Project Structure

```
ParseFlow/
├── packages/
│   ├── pdf-parser-core/      # Core library (parseflow-core)
│   │   ├── src/
│   │   │   ├── parser.ts     # PDF parser
│   │   │   ├── WordParser.ts # Word parser
│   │   │   └── ExcelParser.ts # Excel parser
│   │   └── package.json
│   └── mcp-server/           # MCP server (parseflow-mcp-server)
│       ├── src/
│       │   ├── index.ts      # Server entry
│       │   └── tools/        # MCP tools
│       └── package.json
├── docs/                     # Documentation
├── examples/                 # Usage examples
├── tests/                    # Test files
└── scripts/                  # Build scripts
```

---

## 🧪 Testing

```bash
# Run all tests
pnpm test

# Test coverage
pnpm test:coverage

# Run specific test
pnpm test parser.test.ts
```

### Test Files
- **Word测试文件.docx** - Word test document
- **Excel测试文件.xlsx** - Excel test workbook (3 sheets)
- **PDF测试文档.pdf** - PDF test document

---

## 🔧 Development

```bash
# Install dependencies
pnpm install

# Build all packages
pnpm build

# Watch mode
pnpm dev

# Lint
pnpm lint

# Type check
pnpm type-check
```

---

## 📈 Roadmap

### v1.1.0 (Current)
- ✅ Word (docx) support
- ✅ Excel (xlsx/xls) support
- ✅ 9 MCP tools

### v1.2.0 (Planned)
- [ ] Encrypted PDF support
- [ ] OCR text recognition
- [ ] PowerPoint (pptx) support
- [ ] Batch processing optimization

### v2.0.0 (Future)
- [ ] Plugin system
- [ ] More document formats (CSV, TXT, RTF)
- [ ] Advanced table extraction
- [ ] Document conversion

---

## 🤝 Contributing

We welcome contributions! Please see [CONTRIBUTING.md](./CONTRIBUTING.md) for details.

### Ways to Contribute
- 🐛 Report bugs
- 💡 Suggest features
- 📝 Improve documentation
- 🔧 Submit pull requests

---

## 📦 Packages

| Package | Version | Description |
|---------|---------|-------------|
| [parseflow-core](https://www.npmjs.com/package/parseflow-core) | 1.0.1 | Core parsing library |
| [parseflow-mcp-server](https://www.npmjs.com/package/parseflow-mcp-server) | 1.0.2 | MCP server for AI |

---

## 🔗 Links

- **npm Core**: https://www.npmjs.com/package/parseflow-core
- **npm MCP**: https://www.npmjs.com/package/parseflow-mcp-server
- **GitHub**: https://github.com/Libres-coder/ParseFlow
- **Issues**: https://github.com/Libres-coder/ParseFlow/issues
- **MCP Registry**: https://registry.modelcontextprotocol.io/

---

## 📄 License

MIT License - see [LICENSE](./LICENSE) file for details.

---

## 🙏 Acknowledgments

- **pdf-parse** - PDF parsing
- **pdf-lib** - PDF manipulation
- **mammoth** - Word document parsing
- **xlsx** - Excel spreadsheet parsing
- **MCP SDK** - Model Context Protocol

---

## 📊 Stats

- **Test Coverage**: 83%+
- **Supported Formats**: 3 (PDF, Word, Excel)
- **MCP Tools**: 9
- **Dependencies**: Minimal and well-maintained

---

## 💬 Community

- **Issues**: [GitHub Issues](https://github.com/Libres-coder/ParseFlow/issues)
- **Discussions**: [GitHub Discussions](https://github.com/Libres-coder/ParseFlow/discussions)

---

**Made with ❤️ by Libres-coder**

**Status**: 🎉 Production Ready (v1.1.0)
