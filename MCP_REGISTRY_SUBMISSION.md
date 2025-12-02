# ParseFlow MCP Registry 提交指南

## 📝 提交信息

### 基本信息
```yaml
name: parseflow
description: PDF parsing and analysis server for Model Context Protocol
repository: https://github.com/Libres-coder/ParseFlow
author: Libres-coder
license: MIT
```

### 服务器详情
```json
{
  "name": "parseflow",
  "description": "A comprehensive PDF parsing and analysis server that supports text extraction, metadata retrieval, keyword search, image extraction, and table of contents extraction through the Model Context Protocol.",
  "icon": "📄",
  "repository": {
    "type": "git",
    "url": "https://github.com/Libres-coder/ParseFlow"
  },
  "author": {
    "name": "Libres-coder",
    "url": "https://github.com/Libres-coder"
  },
  "license": "MIT",
  "homepage": "https://github.com/Libres-coder/ParseFlow#readme",
  "categories": ["productivity", "document-processing"],
  "tags": ["pdf", "parsing", "extraction", "documents", "analysis"]
}
```

---

## 🎯 功能特性（用于描述）

### English Description
```markdown
# ParseFlow

A powerful PDF parsing and analysis server for Model Context Protocol (MCP).

## Features

- 📄 **Text Extraction** - Extract text from PDFs with multiple strategies (raw, formatted, clean)
- 📊 **Metadata Extraction** - Get comprehensive document information (title, author, page count, dates, etc.)
- 🔍 **Keyword Search** - Search for specific content in PDFs with context snippets
- 🖼️ **Image Extraction** - Extract images from PDFs (requires poppler-utils)
- 📑 **Table of Contents** - Extract PDF bookmarks and outline structure (requires pdftk/pdfinfo)

## Tools

- `extract_text` - Extract text from PDF files
- `get_metadata` - Get PDF metadata and information
- `search_pdf` - Search for keywords in PDF files
- `extract_images` - Extract images from PDF files
- `get_toc` - Get table of contents from PDF files

## Resources

- `pdf://` - Access PDF content as resources

## Installation

### For Windsurf
```json
{
  "mcpServers": {
    "parseflow": {
      "command": "node",
      "args": ["/path/to/ParseFlow/packages/mcp-server/dist/index.js"]
    }
  }
}
```

### For Cursor
```json
{
  "mcpServers": {
    "parseflow": {
      "command": "node",
      "args": ["/path/to/ParseFlow/packages/mcp-server/dist/index.js"]
    }
  }
}
```

## Requirements

- Node.js >= 18.0.0
- Optional: poppler-utils (for image extraction)
- Optional: pdftk or pdfinfo (for TOC extraction)

## Documentation

- [GitHub Repository](https://github.com/Libres-coder/ParseFlow)
- [README (English)](https://github.com/Libres-coder/ParseFlow/blob/main/README_EN.md)
- [README (中文)](https://github.com/Libres-coder/ParseFlow/blob/main/README.md)
- [npm Package](https://www.npmjs.com/package/parseflow-core)
```

---

## 🔗 提交步骤

### 1. Fork MCP Servers Repository
访问: https://github.com/modelcontextprotocol/servers
点击右上角的 "Fork" 按钮

### 2. Clone Your Fork
```bash
git clone https://github.com/YOUR_USERNAME/servers.git
cd servers
```

### 3. 创建新分支
```bash
git checkout -b add-parseflow-server
```

### 4. 添加服务器信息

**方式 A: 在 README 中添加**

编辑 `README.md`，在适当位置添加：

```markdown
### 📄 ParseFlow
**PDF parsing and analysis**
- Extract text, metadata, and images from PDF files
- Search keywords in PDFs
- Extract table of contents
- [Repository](https://github.com/Libres-coder/ParseFlow)
```

**方式 B: 创建服务器目录（如果仓库有此结构）**

```bash
mkdir -p src/parseflow
```

创建 `src/parseflow/README.md`：
```markdown
# ParseFlow MCP Server

A comprehensive PDF parsing and analysis server.

## Features
- Text extraction with multiple strategies
- Metadata extraction
- Keyword search with context
- Image extraction (requires poppler-utils)
- Table of contents extraction (requires pdftk/pdfinfo)

## Installation
[Installation instructions here]

## Configuration
[Configuration examples here]
```

### 5. 提交更改
```bash
git add .
git commit -m "Add ParseFlow - PDF parsing and analysis server"
git push origin add-parseflow-server
```

### 6. 创建 Pull Request
1. 访问你的 fork: `https://github.com/YOUR_USERNAME/servers`
2. 点击 "Compare & pull request"
3. 填写 PR 标题和描述
4. 提交 PR

---

## ✍️ PR 描述模板

```markdown
## Add ParseFlow Server

### Overview
This PR adds ParseFlow, a comprehensive PDF parsing and analysis server for MCP.

### Features
- 📄 Text extraction with multiple strategies
- 📊 Complete metadata extraction
- 🔍 Keyword search with context snippets
- 🖼️ Image extraction (optional external tool)
- 📑 Table of contents extraction (optional external tool)

### Repository
https://github.com/Libres-coder/ParseFlow

### Additional Information
- License: MIT
- Node.js >= 18.0.0
- Well-tested (83% coverage, 52 tests)
- TypeScript with full type definitions
- Dual package: MCP server + npm library

### Checklist
- [x] Server is functional and tested
- [x] Documentation is complete
- [x] License is appropriate (MIT)
- [x] README includes installation instructions
- [x] Examples provided
```

---

## 📋 提交前检查清单

- [ ] Repository 是公开的
- [ ] README 完整且清晰
- [ ] 有明确的安装说明
- [ ] 有使用示例
- [ ] License 文件存在
- [ ] 代码质量良好
- [ ] 测试覆盖充分
- [ ] 文档是最新的

---

## 🎯 预期结果

提交成功后：
- ✅ ParseFlow 会出现在 MCP Registry
- ✅ 用户可以在 Windsurf/Cursor 中更容易找到
- ✅ 增加项目可见度
- ✅ 吸引更多用户和贡献者

---

## 📊 提交后跟进

### 监控 PR 状态
- 及时回复维护者的评论
- 根据反馈调整
- 保持礼貌和专业

### 推广
一旦 PR 被合并：
- 在 README 中添加 "Listed on MCP Registry" 徽章
- 在社交媒体分享
- 更新项目文档

---

**准备好了就可以提交了！** 🚀

如果需要帮助或有问题，可以：
1. 查看其他已提交的服务器作为参考
2. 在 MCP Discord 寻求帮助
3. 参考 MCP 文档
