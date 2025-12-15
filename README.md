# 📄 ParseFlow

<div align="center">

**PDF、Word、Excel 和 PowerPoint 文档解析库**

[![npm version](https://img.shields.io/npm/v/parseflow-core.svg)](https://www.npmjs.com/package/parseflow-core)
[![MCP Server](https://img.shields.io/badge/MCP-Server-blue)](https://www.npmjs.com/package/parseflow-mcp-server)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

[English](./README_EN.md) | **中文** | [示例](./OFFICE_EXAMPLES.md)

</div>

---

ParseFlow 是一个全面的文档解析解决方案，支持 **PDF**、**Word (docx)**、**Excel (xlsx/xls)** 和 **PowerPoint (pptx)** 文件。它提供独立的核心库和 MCP (Model Context Protocol) 服务器，可供 AI 助手使用。

## ✨ 功能特性

### 📄 PDF 支持
- ✅ 多策略文本提取（原始、格式化、清理）
- ✅ 按页或按范围提取
- ✅ 元数据获取（标题、作者、日期、页数）
- ✅ 全文搜索

### 📝 Word (docx) 支持
- ✅ 文本提取
- ✅ HTML 转换
- ✅ 元数据获取
- ✅ 文本搜索

### 📊 Excel (xlsx/xls) 支持
- ✅ 多工作表数据提取
- ✅ 多种输出格式（JSON、CSV、文本）
- ✅ 指定工作表提取
- ✅ 单元格搜索

### 🎯 PowerPoint (pptx) 支持
- ✅ 幻灯片文本提取
- ✅ 跨幻灯片搜索

### 🤖 MCP 服务器
- ✅ 11 个 AI 助手工具
- ✅ 支持 Claude Desktop、Windsurf、Cursor
- ✅ 路径安全白名单

---

## 📦 安装

### 核心库

```bash
npm install parseflow-core
```

### MCP 服务器

```bash
npm install -g parseflow-mcp-server
# 或使用 npx
npx parseflow-mcp-server
```

---

## 🚀 快速开始

### PDF 解析

```typescript
import { PDFParser } from 'parseflow-core';

const parser = new PDFParser();
const text = await parser.extractText('document.pdf');
const results = await parser.search('document.pdf', '关键词');
```

### Word 解析

```typescript
import { WordParser } from 'parseflow-core';

const parser = new WordParser();
const result = await parser.extractText('report.docx');
const html = await parser.extractHTML('report.docx');
```

### Excel 解析

```typescript
import { ExcelParser } from 'parseflow-core';

const parser = new ExcelParser();
const data = await parser.extractData('spreadsheet.xlsx');
const results = await parser.searchText('data.xlsx', '收入');
```

### PowerPoint 解析

```typescript
import { PowerPointParser } from 'parseflow-core';

const parser = new PowerPointParser();
const result = await parser.extractText('presentation.pptx');
const results = await parser.searchText('slides.pptx', '关键词');
```

---

## 🛠️ MCP 服务器配置

### Claude Desktop

在 `claude_desktop_config.json` 中添加：

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

### 可用工具（11 个）

| 工具 | 描述 |
|------|------|
| `extract_text` | 从 PDF 提取文本 |
| `get_metadata` | 获取 PDF 元数据 |
| `search_pdf` | 在 PDF 中搜索 |
| `extract_images` | 从 PDF 提取图片 |
| `get_toc` | 获取 PDF 目录 |
| `extract_word` | 从 Word 提取文本 |
| `search_word` | 在 Word 中搜索 |
| `extract_excel` | 从 Excel 提取数据 |
| `search_excel` | 在 Excel 中搜索 |
| `extract_powerpoint` | 从 PowerPoint 提取文本 |
| `search_powerpoint` | 在 PowerPoint 中搜索 |

---

## 📈 路线图

### v1.1.0（当前）✅
- ✅ Word (docx) 支持
- ✅ Excel (xlsx/xls) 支持
- ✅ PowerPoint (pptx) 支持
- ✅ 11 个 MCP 工具

### v1.2.0（计划中）
- ⏳ OCR 文字识别
- ⏳ 批量处理
- ⏳ 加密 PDF 支持

---

## 🔗 链接

- **npm Core**: https://www.npmjs.com/package/parseflow-core
- **npm MCP**: https://www.npmjs.com/package/parseflow-mcp-server
- **GitHub**: https://github.com/Libres-coder/ParseFlow

---

## 📄 许可证

MIT License - 详见 [LICENSE](./LICENSE)

---

**Made with ❤️ by Libres-coder**
