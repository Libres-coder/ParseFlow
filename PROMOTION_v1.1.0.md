# 📢 ParseFlow v1.1.0 推广文案

---

## 🐦 Twitter/X

### 版本 1 (简短)
```
🎉 ParseFlow v1.1.0 发布！

新增功能：
📝 Word (docx) 解析
📊 Excel (xlsx) 解析
🤖 9 个 MCP 工具

现在支持 PDF、Word、Excel 三种格式！

npm: parseflow-core@1.1.0
GitHub: github.com/Libres-coder/ParseFlow

#ParseFlow #MCP #OpenSource #NodeJS
```

### 版本 2 (详细)
```
📄 ParseFlow v1.1.0 - Major Update!

✨ New Features:
• Word document parsing (text, HTML, search)
• Excel spreadsheet parsing (JSON, CSV, search)
• 4 new MCP tools for AI assistants

📦 Supported formats: PDF, Word (.docx), Excel (.xlsx/.xls)

Try it: npm install parseflow-core@1.1.0

⭐ Star us: github.com/Libres-coder/ParseFlow

#DocumentParsing #MCP #TypeScript #AI
```

---

## 🇨🇳 V2EX

### 标题
```
[开源项目] ParseFlow v1.1.0 发布 - 支持 PDF/Word/Excel 文档解析的 MCP 服务器
```

### 正文
```markdown
# ParseFlow v1.1.0 - 支持 Office 文档！

大家好！我的开源项目 **ParseFlow** 发布了 v1.1.0 版本，这是一个重要的功能更新。

## 🎯 项目简介

ParseFlow 是一个文档解析库和 MCP 服务器，可以让 AI 助手（如 Claude）读取和分析各种文档。

## ✨ v1.1.0 新功能

### 1. Word (docx) 文档支持
- 文本提取
- HTML 转换
- 文档搜索
- 元数据获取

### 2. Excel (xlsx/xls) 表格支持
- 多工作表提取
- JSON/CSV/Text 多种格式
- 单元格搜索
- 数据分析

### 3. MCP 工具扩展
现在提供 **9 个工具**：
- 5 个 PDF 工具
- 2 个 Word 工具
- 2 个 Excel 工具

## 📦 安装使用

```bash
# 核心库
npm install parseflow-core@1.1.0

# MCP 服务器 (给 Claude Desktop 等用)
npm install -g parseflow-mcp-server@1.1.0
```

## 🔥 使用示例

```typescript
import { WordParser, ExcelParser } from 'parseflow-core';

// 解析 Word 文档
const wordParser = new WordParser();
const { text } = await wordParser.extractText('report.docx');

// 解析 Excel 表格
const excelParser = new ExcelParser();
const data = await excelParser.extractData('data.xlsx');
```

## 🌟 特性

- ✅ TypeScript 编写，类型安全
- ✅ 支持 PDF、Word、Excel 三种格式
- ✅ 完整的 MCP 服务器支持
- ✅ 测试覆盖率 83%+
- ✅ 详细的文档和示例

## 🔗 链接

- **GitHub**: https://github.com/Libres-coder/ParseFlow
- **npm (core)**: https://www.npmjs.com/package/parseflow-core
- **npm (MCP)**: https://www.npmjs.com/package/parseflow-mcp-server
- **MCP Registry**: https://registry.modelcontextprotocol.io/

## 📊 技术栈

- TypeScript
- Node.js
- pdf-parse (PDF 解析)
- mammoth (Word 解析)
- xlsx (Excel 解析)
- MCP SDK

## 🙏 欢迎

- ⭐ Star 支持
- 🐛 提 Issue
- 💡 建议功能
- 🔧 贡献代码

感谢大家的支持！🎉
```

---

## 📝 掘金

### 标题
```
ParseFlow v1.1.0 发布：新增 Word 和 Excel 文档解析支持
```

### 正文
```markdown
# ParseFlow v1.1.0：让 AI 助手读懂 Office 文档

## 🎉 发布公告

今天，我很高兴地宣布 **ParseFlow v1.1.0** 正式发布！这是一个重要的功能更新版本，新增了 **Word** 和 **Excel** 文档的完整解析支持。

## 📚 什么是 ParseFlow？

ParseFlow 是一个强大的文档解析库，专为 AI 时代设计。它提供：

1. **核心库**（`parseflow-core`）：用于解析 PDF、Word、Excel 文档
2. **MCP 服务器**（`parseflow-mcp-server`）：让 Claude 等 AI 助手能够读取文档

## ✨ v1.1.0 亮点功能

### 📝 Word 文档解析

```typescript
import { WordParser } from 'parseflow-core';

const parser = new WordParser();

// 提取文本
const result = await parser.extractText('report.docx');
console.log(result.text);

// 转换为 HTML
const html = await parser.extractHTML('report.docx');

// 搜索关键词
const matches = await parser.searchText('report.docx', '预算');
```

**功能特性**：
- ✅ 纯文本提取
- ✅ HTML 格式转换
- ✅ 元数据获取
- ✅ 全文搜索

### 📊 Excel 表格解析

```typescript
import { ExcelParser } from 'parseflow-core';

const parser = new ExcelParser();

// 提取所有工作表（JSON 格式）
const data = await parser.extractData('sales.xlsx');

// 提取特定工作表
const q4Data = await parser.extractData('data.xlsx', {
  sheetName: 'Q4 Sales',
  format: 'json'
});

// 搜索单元格
const results = await parser.searchText('data.xlsx', '产品');
```

**功能特性**：
- ✅ 多工作表提取
- ✅ JSON/CSV/Text 输出
- ✅ 单元格搜索（带坐标）
- ✅ 范围提取
- ✅ 工作簿元数据

### 🤖 MCP 工具升级

现在提供 **9 个 MCP 工具**（从 5 个增加到 9 个）：

**PDF 工具**（5 个）：
- `extract_text` - 文本提取
- `search_pdf` - 搜索
- `get_metadata` - 元数据
- `extract_images` - 图片提取
- `get_toc` - 目录

**Word 工具**（2 个）：
- `extract_word` - 文本/HTML 提取
- `search_word` - 搜索

**Excel 工具**（2 个）：
- `extract_excel` - 数据提取
- `search_excel` - 单元格搜索

## 🎯 实际应用场景

### 场景 1：报告分析

```typescript
// 自动分析季度报告
const wordParser = new WordParser();
const { text } = await wordParser.extractText('Q4-Report.docx');

// 提取关键指标
const metrics = text.match(/销售额：(.*?)元/g);
console.log(metrics);
```

### 场景 2：数据处理

```typescript
// 批量处理 Excel 数据
const excelParser = new ExcelParser();
const salesData = await excelParser.extractData('sales.xlsx', {
  sheetName: 'Regional Sales',
  format: 'json'
});

// 计算总营收
const totalRevenue = salesData[0].data.reduce(
  (sum, row) => sum + (row['Revenue'] || 0), 
  0
);
```

### 场景 3：AI 助手集成

在 Claude Desktop 中配置：

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

然后就可以：
```
"请帮我分析 sales-report.docx 中的关键发现"
"从 budget.xlsx 中提取各部门的预算数据"
```

## 📊 技术细节

### 依赖库

- **mammoth** (^1.11.0) - Word 解析
- **xlsx** (^0.18.5) - Excel 解析
- **pdf-parse** (^1.1.1) - PDF 解析

### 测试覆盖

- ✅ Word 解析：4/4 测试通过
- ✅ Excel 解析：8/8 测试通过
- ✅ 整体覆盖率：83%+

### 性能

| 操作 | 文件大小 | 耗时 |
|------|----------|------|
| Word 文本提取 | 6 MB | ~100ms |
| Excel 数据提取 | 19 KB (3 sheets) | ~50ms |
| PDF 文本提取 | 1 MB | ~200ms |

## 🚀 快速开始

### 1. 安装

```bash
npm install parseflow-core@1.1.0
```

### 2. 使用

```typescript
import { WordParser, ExcelParser } from 'parseflow-core';

// Word
const wordParser = new WordParser();
const text = await wordParser.extractText('doc.docx');

// Excel
const excelParser = new ExcelParser();
const data = await excelParser.extractData('sheet.xlsx');
```

### 3. MCP 集成（可选）

```bash
npm install -g parseflow-mcp-server@1.1.0
```

## 📈 未来规划

### v1.2.0（计划中）
- PowerPoint (pptx) 支持
- 加密文档支持
- OCR 文字识别

### v2.0.0（探索中）
- 插件系统
- Web API 服务
- 云端部署

## 🔗 相关链接

- 📦 **npm**: https://www.npmjs.com/package/parseflow-core
- 🐙 **GitHub**: https://github.com/Libres-coder/ParseFlow
- 📖 **文档**: https://github.com/Libres-coder/ParseFlow#readme
- 🤖 **MCP**: https://registry.modelcontextprotocol.io/

## 🙏 致谢

感谢开源社区的支持，特别是：
- mammoth - 优秀的 Word 解析库
- SheetJS (xlsx) - 强大的 Excel 处理
- MCP 社区 - 反馈和建议

## 💬 反馈

欢迎：
- ⭐ Star 项目
- 🐛 报告 Bug
- 💡 提出建议
- 🔧 贡献代码

---

**项目作者**：Libres-coder  
**开源协议**：MIT  
**发布日期**：2025-12-03
```

---

## 🌐 Reddit

### Subreddit: r/opensource

**Title:**
```
[Project Release] ParseFlow v1.1.0 - Document parsing library for PDF, Word, and Excel
```

**Body:**
```markdown
Hi r/opensource! 👋

I'm excited to share **ParseFlow v1.1.0**, a major update to my document parsing library!

## 🎯 What is ParseFlow?

ParseFlow is a TypeScript library for parsing documents (PDF, Word, Excel) with built-in MCP server support for AI assistants like Claude.

## ✨ What's New in v1.1.0

### New Features
- 📝 **Word (docx) support** - Text extraction, HTML conversion, search
- 📊 **Excel (xlsx/xls) support** - Multi-sheet data, JSON/CSV output, cell search
- 🤖 **4 new MCP tools** - Total 9 tools for AI integration

### Supported Formats
| Format | Read | Search | Metadata |
|--------|------|--------|----------|
| PDF | ✅ | ✅ | ✅ |
| Word | ✅ | ✅ | ✅ |
| Excel | ✅ | ✅ | ✅ |

## 💻 Quick Example

```typescript
import { WordParser, ExcelParser } from 'parseflow-core';

// Parse Word document
const wordParser = new WordParser();
const text = await wordParser.extractText('report.docx');

// Parse Excel spreadsheet
const excelParser = new ExcelParser();
const data = await excelParser.extractData('data.xlsx');
```

## 🔗 Links

- **GitHub**: https://github.com/Libres-coder/ParseFlow
- **npm**: https://www.npmjs.com/package/parseflow-core
- **Documentation**: Full examples and API docs in repo

## 📊 Project Stats

- TypeScript
- 83%+ test coverage
- MIT licensed
- Active development

## 🙏 Feedback Welcome!

Would love to hear your thoughts, suggestions, or bug reports!

⭐ Star if you find it useful!
```

---

## 📧 Email Template (For Newsletter)

**Subject**: ParseFlow v1.1.0 Released - Office Documents Support

**Body**:
```
Hi there,

We're excited to announce ParseFlow v1.1.0!

What's New:
• Word document parsing (docx)
• Excel spreadsheet parsing (xlsx/xls)
• 4 new MCP tools for AI assistants

Now supporting 3 document formats: PDF, Word, Excel

Get Started:
npm install parseflow-core@1.1.0

Learn More:
https://github.com/Libres-coder/ParseFlow

Thank you for your support!

Best regards,
ParseFlow Team
```

---

## 🎨 Social Media Images (Ideas)

### Image 1: Feature Comparison
```
Before (v1.0):     After (v1.1):
PDF ✅             PDF ✅
Word ❌            Word ✅
Excel ❌           Excel ✅

ParseFlow v1.1.0
Now supporting Office documents!
```

### Image 2: Code Example
```
[Screenshot of code with syntax highlighting]

Word & Excel Parsing Made Easy

parseflow-core@1.1.0
github.com/Libres-coder/ParseFlow
```

### Image 3: Stats
```
📊 ParseFlow v1.1.0

✅ 3 document formats
✅ 9 MCP tools
✅ 83%+ test coverage
✅ TypeScript
✅ MIT license

npm install parseflow-core
```

---

## 📅 发布时间表

### 最佳发布时间

| 平台 | 最佳时间 (UTC+8) | 原因 |
|------|------------------|------|
| Twitter/X | 10:00-11:00 | 欧美早晨 |
| V2EX | 09:00-10:00 | 国内上班时间 |
| 掘金 | 14:00-15:00 | 国内下午茶时间 |
| Reddit | 21:00-22:00 | 欧美工作时间 |

### 建议顺序

1. **GitHub Release** (立即)
2. **npm 发布** (立即)
3. **Twitter/X** (10:00)
4. **V2EX** (10:30)
5. **掘金** (14:00)
6. **Reddit** (21:00)

---

## 📊 追踪指标

创建一个简单的追踪表格：

| 日期 | npm 下载 | GitHub Stars | Issues | PR |
|------|----------|--------------|--------|-----|
| Day 1 | - | - | - | - |
| Day 3 | - | - | - | - |
| Day 7 | - | - | - | - |
| Day 14 | - | - | - | - |
| Day 30 | - | - | - | - |

---

**准备就绪！🚀**

这些文案可以在发布后根据需要调整和使用。
