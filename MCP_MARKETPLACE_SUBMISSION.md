# MCP Marketplace 提交指南

## 📋 提交材料清单

### ✅ 已准备完成

- [x] **npm 包发布**: `parseflow-mcp-server@1.7.0`
- [x] **server.json**: 已更新到 v1.7.0
- [x] **README.md**: 完整的中文文档
- [x] **README_EN.md**: 完整的英文文档
- [x] **CHANGELOG.md**: 版本历史记录
- [x] **示例代码**: examples/batch-processing.ts
- [x] **GitHub 仓库**: https://github.com/Libres-coder/ParseFlow
- [x] **开源许可**: MIT License

---

## 🚀 提交步骤

### Step 1: Fork 官方仓库

访问并 Fork: https://github.com/modelcontextprotocol/servers

### Step 2: 创建服务器配置文件

在 Fork 的仓库中，创建 `src/parseflow/index.json`:

```json
{
  "$schema": "https://static.modelcontextprotocol.io/schemas/2025-07-09/server.schema.json",
  "name": "io.github.Libres-coder/parseflow",
  "description": "AI-powered document parsing with 20 tools: PDF, Word, Excel, PowerPoint, OCR, semantic search, and batch processing",
  "repository": {
    "url": "https://github.com/Libres-coder/ParseFlow",
    "source": "github"
  },
  "version": "1.7.0",
  "vendor": "Libres-coder",
  "sourceType": "community",
  "packages": [
    {
      "registryType": "npm",
      "identifier": "parseflow-mcp-server",
      "version": "1.7.0",
      "transport": {
        "type": "stdio"
      }
    }
  ],
  "license": "MIT",
  "homepage": "https://github.com/Libres-coder/ParseFlow",
  "tags": ["pdf", "document", "parsing", "word", "excel", "powerpoint", "ocr", "ai", "semantic-search", "batch-processing"]
}
```

创建 `src/parseflow/README.md`:

```markdown
# ParseFlow MCP Server

AI-powered universal document parsing library with 20 MCP tools.

## Features

- **PDF**: Text extraction, metadata, search, merge/split, encrypted PDFs
- **Office**: Word (.docx), Excel (.xlsx), PowerPoint (.pptx)
- **OCR**: Image text recognition (12 languages)
- **AI**: Semantic search with vector embeddings
- **Batch**: Parallel processing of multiple files

## Installation

npx parseflow-mcp-server

## Available Tools (20)

PDF (8), Word (2), Excel (2), PowerPoint (2), OCR (2), AI (2), Batch (2)

## Documentation

https://github.com/Libres-coder/ParseFlow
```

### Step 3: 创建 Pull Request

**PR Title**:
```
Add ParseFlow - AI-powered document parsing server
```

**PR Description**:
```markdown
## ParseFlow MCP Server

### Overview
ParseFlow provides 20 MCP tools for comprehensive document processing.

### Features
- ✅ 20 MCP Tools
- ✅ 5 File Types (PDF, Word, Excel, PowerPoint, Images)
- ✅ AI Semantic Search
- ✅ Batch Processing
- ✅ Production Ready (v1.7.0)

### Package
- npm: parseflow-mcp-server@1.7.0
- GitHub: https://github.com/Libres-coder/ParseFlow
- License: MIT

### Testing
- ✅ Claude Desktop
- ✅ Windsurf IDE
- ✅ Cursor IDE

### Links
- npm: https://www.npmjs.com/package/parseflow-mcp-server
- Docs: https://github.com/Libres-coder/ParseFlow
```

---

## 📝 提交检查清单

- [x] npm 包已发布
- [x] server.json 格式正确
- [x] README 完整
- [x] GitHub 公开
- [x] MIT 许可
- [x] 版本一致 (1.7.0)

---

## ✅ 准备完毕

所有材料已就绪，可以开始提交到 MCP Marketplace！
