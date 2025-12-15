# 📄 ParseFlow

<div align="center">

**Universal Document Parsing Library for PDF, Word, and Excel Files**

[![npm version](https://img.shields.io/npm/v/parseflow-core.svg)](https://www.npmjs.com/package/parseflow-core)
[![MCP Server](https://img.shields.io/badge/MCP-Server-blue)](https://www.npmjs.com/package/parseflow-mcp-server)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

[中文](./README.md) | **English** | [Examples](./OFFICE_EXAMPLES.md)

</div>

---

ParseFlow is a comprehensive document parsing solution that supports **PDF**, **Word (docx)**, and **Excel (xlsx/xls)** files. It provides both a standalone library and an MCP (Model Context Protocol) server for AI assistants.

## ✨ Features

### 📄 PDF Support
- ✅ Text extraction with multiple strategies (raw, formatted, clean)
- ✅ Page-specific and range-based extraction
- ✅ Metadata retrieval (title, author, dates, page count)
- ✅ Full-text search with context

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

### 🎯 PowerPoint (pptx) Support
- ✅ Slide text extraction
- ✅ Text search across slides

### 🤖 MCP Server
- ✅ 11 tools for AI assistants
- ✅ Works with Claude Desktop, Windsurf, Cursor
- ✅ Path security with allowlist

---

## 📦 Installation

### Core Library

```bash
npm install parseflow-core
```

### MCP Server

```bash
npm install -g parseflow-mcp-server
# Or use with npx
npx parseflow-mcp-server
```

---

## 🚀 Quick Start

### PDF Parsing

```typescript
import { PDFParser } from 'parseflow-core';

const parser = new PDFParser();
const text = await parser.extractText('document.pdf');
const results = await parser.search('document.pdf', 'keyword');
```

### Word Parsing

```typescript
import { WordParser } from 'parseflow-core';

const parser = new WordParser();
const result = await parser.extractText('report.docx');
const html = await parser.extractHTML('report.docx');
```

### Excel Parsing

```typescript
import { ExcelParser } from 'parseflow-core';

const parser = new ExcelParser();
const data = await parser.extractData('spreadsheet.xlsx');
const results = await parser.searchText('data.xlsx', 'revenue');
```

### PowerPoint Parsing

```typescript
import { PowerPointParser } from 'parseflow-core';

const parser = new PowerPointParser();
const result = await parser.extractText('presentation.pptx');
const results = await parser.searchText('slides.pptx', 'keyword');
```

---

## 🛠️ MCP Server Configuration

### Claude Desktop

Add to `claude_desktop_config.json`:

```json
{
  "mcpServers": {
    "parseflow": {
      "command": "npx",
      "args": ["-y", "parseflow-mcp-server"]
    }
  }
}
```

### Available Tools (11)

| Tool | Description |
|------|-------------|
| `extract_text` | Extract text from PDF |
| `get_metadata` | Get PDF metadata |
| `search_pdf` | Search in PDF |
| `extract_images` | Extract images from PDF |
| `get_toc` | Get PDF table of contents |
| `extract_word` | Extract text from Word |
| `search_word` | Search in Word |
| `extract_excel` | Extract data from Excel |
| `search_excel` | Search in Excel |
| `extract_powerpoint` | Extract text from PowerPoint |
| `search_powerpoint` | Search in PowerPoint |

---

## 📈 Roadmap

### v1.1.0 (Current) ✅
- ✅ Word (docx) support
- ✅ Excel (xlsx/xls) support
- ✅ PowerPoint (pptx) support
- ✅ 11 MCP tools

### v1.2.0 (Planned)
- ⏳ OCR text recognition
- ⏳ Batch processing
- ⏳ Encrypted PDF support

---

## 🔗 Links

- **npm Core**: https://www.npmjs.com/package/parseflow-core
- **npm MCP**: https://www.npmjs.com/package/parseflow-mcp-server
- **GitHub**: https://github.com/Libres-coder/ParseFlow

---

## 📄 License

MIT License - see [LICENSE](./LICENSE)

---

**Made with ❤️ by Libres-coder**
