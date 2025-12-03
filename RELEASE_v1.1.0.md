# ParseFlow v1.1.0 - Office Documents Support 📄📊

**Release Date**: 2025-12-03

We're excited to announce ParseFlow v1.1.0, a major feature release that adds **Word (docx)** and **Excel (xlsx/xls)** document parsing support! 🎉

---

## 🌟 What's New

### 📝 Word Document Support

ParseFlow now supports **Word (.docx)** documents with comprehensive parsing capabilities:

- ✅ **Text Extraction** - Extract plain text from Word documents
- ✅ **HTML Conversion** - Convert Word documents to HTML
- ✅ **Metadata Retrieval** - Get document properties and file information
- ✅ **Text Search** - Search for keywords with context snippets
- ✅ **MCP Tools** - 2 new tools for AI assistants (`extract_word`, `search_word`)

**Example:**
```typescript
import { WordParser } from 'parseflow-core';

const parser = new WordParser();
const result = await parser.extractText('report.docx');
console.log(result.text);
```

### 📊 Excel Spreadsheet Support

Full support for **Excel (.xlsx/.xls)** spreadsheets:

- ✅ **Multi-Sheet Extraction** - Extract data from all sheets or specific ones
- ✅ **Multiple Formats** - JSON, CSV, or plain text output
- ✅ **Cell Search** - Find values across all sheets with cell coordinates
- ✅ **Range Extraction** - Extract specific cell ranges (e.g., A1:C10)
- ✅ **Workbook Metadata** - Sheet names, counts, and properties
- ✅ **MCP Tools** - 2 new tools for AI assistants (`extract_excel`, `search_excel`)

**Example:**
```typescript
import { ExcelParser } from 'parseflow-core';

const parser = new ExcelParser();
const data = await parser.extractData('spreadsheet.xlsx', {
  sheetName: 'Sales',
  format: 'json'
});
console.log(data);
```

---

## 🛠️ MCP Server Updates

The MCP server now includes **9 tools** (up from 5):

### PDF Tools (Existing - 5 tools)
- `extract_text` - Extract text from PDF
- `search_pdf` - Search in PDF
- `get_metadata` - Get PDF metadata
- `extract_images` - Extract images
- `get_toc` - Get table of contents

### Word Tools (New - 2 tools)
- `extract_word` - Extract text/HTML from Word documents
- `search_word` - Search in Word documents

### Excel Tools (New - 2 tools)
- `extract_excel` - Extract data from Excel spreadsheets
- `search_excel` - Search in Excel cells

**Usage in Claude Desktop:**
```
"请读取 report.docx 文件的内容"
→ Uses extract_word tool

"在 sales.xlsx 中查找 '产品A'"
→ Uses search_excel tool
```

---

## 📦 Package Updates

### parseflow-core v1.1.0
- **New**: `WordParser` class for Word document parsing
- **New**: `ExcelParser` class for Excel spreadsheet parsing
- **Dependencies**: Added `mammoth@^1.11.0` and `xlsx@^0.18.5`
- **Updated**: Package description now mentions all supported formats

### parseflow-mcp-server v1.1.0
- **New**: 4 additional MCP tools (2 Word + 2 Excel)
- **Updated**: Server description updated to mention Office documents
- **Total**: 9 tools serving AI assistants

---

## 📚 Documentation

### New Documentation
- **[OFFICE_EXAMPLES.md](./OFFICE_EXAMPLES.md)** - Comprehensive guide with examples
  - Word parsing methods (4 approaches)
  - Excel parsing methods (8 approaches)
  - 5 real-world use cases
  - Performance tips and troubleshooting

### Updated Documentation
- **[README.md](./README.md)** - Completely rewritten
  - Feature overview for all formats
  - Quick start guides
  - MCP server configuration
  - Project structure

- **[CHANGELOG.md](./CHANGELOG.md)** - v1.1.0 entry added
  - Detailed feature list
  - Breaking changes (none!)
  - Upgrade guide

---

## 🧪 Testing

All new features are thoroughly tested:

- ✅ **Word Parser**: 4/4 tests passing
  - Text extraction
  - Metadata retrieval
  - Text search
  - HTML conversion

- ✅ **Excel Parser**: 8/8 tests passing
  - Multi-sheet extraction
  - Format conversion (JSON/CSV/Text)
  - Cell search
  - Metadata retrieval

**Test Files Included:**
- `Word测试文件.docx` (6 MB)
- `Excel测试文件.xlsx` (19 KB)

---

## 🚀 Installation

### npm

```bash
# Core library
npm install parseflow-core@1.1.0

# MCP Server (global)
npm install -g parseflow-mcp-server@1.1.0
```

### pnpm

```bash
pnpm add parseflow-core@1.1.0
pnpm add -g parseflow-mcp-server@1.1.0
```

---

## 📊 Supported Formats

| Format | Extension | Read | Search | Metadata | Tools |
|--------|-----------|------|--------|----------|-------|
| PDF    | .pdf      | ✅   | ✅     | ✅       | 5     |
| Word   | .docx     | ✅   | ✅     | ✅       | 2     |
| Excel  | .xlsx/.xls| ✅   | ✅     | ✅       | 2     |

---

## 🔧 Dependencies

### New Dependencies
- `mammoth@^1.11.0` - Word document parsing
- `xlsx@^0.18.5` - Excel spreadsheet parsing

### Existing Dependencies
- `pdf-parse@^1.1.1` - PDF parsing
- `pdf-lib@^1.17.1` - PDF manipulation
- `@modelcontextprotocol/sdk@^1.0.4` - MCP SDK

---

## 🐛 Bug Fixes

- Fixed Excel metadata extraction reliability
- Added null checks for sheet names in Excel parser
- Improved error handling for malformed Office files
- Better error messages for unsupported file types

---

## 🧹 Cleanup

- Removed 8 redundant documentation files (~35 KB)
- Simplified `PROJECT_STATUS.md`
- Improved project organization
- Updated `.gitignore` for test files

---

## 🔄 Upgrade Guide

### From v1.0.x

No breaking changes! Simply update:

```bash
npm install parseflow-core@latest
npm install -g parseflow-mcp-server@latest
```

### New Features

Import the new parsers:

```typescript
import { WordParser, ExcelParser } from 'parseflow-core';
```

For MCP users, the new tools are automatically available after updating.

---

## 📖 Examples

### Extract Text from Word Document

```typescript
import { WordParser } from 'parseflow-core';

const parser = new WordParser();
const result = await parser.extractText('document.docx');
console.log(result.text);
```

### Extract Data from Excel

```typescript
import { ExcelParser } from 'parseflow-core';

const parser = new ExcelParser();
const sheets = await parser.extractData('data.xlsx');

sheets.forEach(sheet => {
  console.log(`${sheet.sheetName}: ${sheet.rowCount} rows`);
});
```

### Search Across Documents

```typescript
const wordParser = new WordParser();
const excelParser = new ExcelParser();

// Search in Word
const wordMatches = await wordParser.searchText('report.docx', 'budget');

// Search in Excel
const excelMatches = await excelParser.searchText('data.xlsx', 'revenue');
```

More examples in [OFFICE_EXAMPLES.md](./OFFICE_EXAMPLES.md)!

---

## 🌐 Links

- **npm Core**: https://www.npmjs.com/package/parseflow-core
- **npm MCP**: https://www.npmjs.com/package/parseflow-mcp-server
- **GitHub**: https://github.com/Libres-coder/ParseFlow
- **MCP Registry**: https://registry.modelcontextprotocol.io/
- **Issues**: https://github.com/Libres-coder/ParseFlow/issues
- **Documentation**: https://github.com/Libres-coder/ParseFlow#readme

---

## 🙏 Acknowledgments

Special thanks to:
- **mammoth** - For excellent Word document parsing
- **xlsx (SheetJS)** - For comprehensive Excel support
- **MCP Community** - For feedback and support

---

## 📝 Full Changelog

See [CHANGELOG.md](./CHANGELOG.md) for complete details.

---

## 🎯 What's Next?

Looking ahead to v1.2.0:
- PowerPoint (pptx) support
- Encrypted document support
- OCR text recognition
- Performance optimizations

---

## 💬 Feedback

We'd love to hear from you!
- Report bugs: [GitHub Issues](https://github.com/Libres-coder/ParseFlow/issues)
- Request features: [GitHub Discussions](https://github.com/Libres-coder/ParseFlow/discussions)

---

**Made with ❤️ by Libres-coder**

Enjoy ParseFlow v1.1.0! 🎉
