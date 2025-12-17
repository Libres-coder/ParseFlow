# 📄 ParseFlow

<div align="center">

**AI 驱动的全能文档解析库**

[![npm version](https://img.shields.io/npm/v/parseflow-core.svg)](https://www.npmjs.com/package/parseflow-core)
[![MCP Server](https://img.shields.io/badge/MCP-Server-blue)](https://www.npmjs.com/package/parseflow-mcp-server)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

[English](./README_EN.md) | **中文**

</div>

---

ParseFlow 是一个全面的文档解析解决方案，支持 **PDF**、**Word**、**Excel**、**PowerPoint** 和 **图片 OCR**。它提供独立的核心库和 MCP 服务器，可供 AI 助手使用。

## ✨ 功能特性

### 📄 PDF 支持
- ✅ 多策略文本提取（原始、格式化、清理）
- ✅ 按页或按范围提取
- ✅ 🔐 加密 PDF 密码支持
- ✅ 📄 PDF 合并、拆分、提取页面
- ✅ 元数据获取、全文搜索

### 📝 Word / 📊 Excel / 🎯 PowerPoint
- ✅ 文本提取和搜索
- ✅ HTML 转换（Word）
- ✅ 多工作表支持（Excel）
- ✅ 幻灯片提取（PowerPoint）

### 🔍 OCR 图片识别
- ✅ 支持 12 种语言
- ✅ 图片文字提取和搜索

### 🧠 语义搜索
- ✅ AI 向量嵌入
- ✅ 智能文档搜索（无需精确关键词）

### 🤖 MCP 服务器
- ✅ **18 个** AI 助手工具
- ✅ 支持 Claude Desktop、Windsurf、Cursor

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

### 可用工具（18 个）

| 类别 | 工具 | 描述 |
|------|------|------|
| **PDF** | `extract_text` | 提取文本（支持加密 PDF） |
| | `get_metadata` | 获取元数据 |
| | `search_pdf` | 全文搜索 |
| | `extract_images` | 提取图片 |
| | `get_toc` | 获取目录 |
| | `merge_pdf` | 合并多个 PDF |
| | `split_pdf` | 拆分为单页 |
| | `extract_pdf_pages` | 提取指定页码 |
| **Word** | `extract_word` | 提取文本/HTML |
| | `search_word` | 文本搜索 |
| **Excel** | `extract_excel` | 提取数据 |
| | `search_excel` | 单元格搜索 |
| **PPT** | `extract_powerpoint` | 提取幻灯片 |
| | `search_powerpoint` | 幻灯片搜索 |
| **OCR** | `extract_ocr` | 图片文字识别 |
| | `search_ocr` | OCR 文本搜索 |
| **AI** | `semantic_index` | 文档向量索引 |
| | `semantic_search` | 语义相似搜索 |

---

## 📈 版本历史

| 版本 | 功能 |
|------|------|
| v1.6.0 | 🧠 语义搜索（AI 向量嵌入） |
| v1.5.0 | 📄 PDF 合并/拆分/提取 |
| v1.4.0 | 🔐 加密 PDF 支持 |
| v1.3.0 | 🔍 OCR 图片文字识别 |
| v1.2.0 | 🎯 PowerPoint 支持 |
| v1.1.0 | 📝 Word + 📊 Excel 支持 |
| v1.0.0 | 📄 PDF 基础解析 |

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
