# ParseFlow Examples

This directory contains comprehensive examples demonstrating how to use ParseFlow in various scenarios.

## 📚 Available Examples

### 1. Basic Usage (`basic-usage/`)
Simple examples for getting started with parseflow-core.

**Examples:**
- `extract-text.js` - Extract text from PDF files
- `get-metadata.js` - Get PDF metadata and information
- `search-pdf.js` - Search for keywords in PDFs

**Usage:**
- ✅ 搜索关键词
- ✅ 使用不同的提取策略

**运行方式**：

```bash
# 使用 tsx
npx tsx examples/basic-usage.ts

# 或编译后运行
tsc examples/basic-usage.ts
node examples/basic-usage.js
```

### 2. mcp-client-example.ts

**MCP 客户端调用示例**

展示如何：

- ✅ 创建 MCP 客户端
- ✅ 连接到 ParseFlow MCP Server
- ✅ 调用 MCP Tools
- ✅ 读取 MCP Resources

**前置要求**：

```bash
npm install @modelcontextprotocol/sdk
```

**运行方式**：

```bash
# 取消注释代码后
npx tsx examples/mcp-client-example.ts
```

---

## 🎯 最佳实践

### 实际使用 ParseFlow

**推荐方式**：通过 Windsurf IDE 的 MCP 集成使用

1. **配置 Windsurf**（参考 [QUICK_START.md](../QUICK_START.md)）

   ```json
   // C:\Users\<你的用户名>\.codeium\windsurf\mcp_config.json
   {
     "mcpServers": {
       "parseflow": {
         "command": "node",
         "args": ["<项目根目录>\\packages\\mcp-server\\dist\\index.js"]
       }
     }
   }
   ```

2. **在 Windsurf 中使用**

   ```
   你：分析 D:\report.pdf
   Cascade：[自动调用 ParseFlow extract_text]

   你：这个 PDF 有多少页？
   Cascade：[自动调用 ParseFlow get_metadata]

   你：搜索"重要条款"
   Cascade：[自动调用 ParseFlow search_pdf]
   ```

---

## 🔧 开发者使用

### 在你的项目中使用 PDF Parser

```typescript
// 1. 导入（根据你的项目结构调整路径）
import { PDFParser } from '../packages/pdf-parser-core/src/parser';

// 2. 创建实例
const parser = new PDFParser({
  cache: { enabled: true },
  security: { maxFileSize: 50 * 1024 * 1024 },
});

// 3. 使用
const text = await parser.extractText('path/to/file.pdf');
const metadata = await parser.getMetadata('path/to/file.pdf');
const results = await parser.search('path/to/file.pdf', 'keyword');
```

---

## 📖 更多资源

- [README.md](../README.md) - 项目介绍
- [QUICK_START.md](../QUICK_START.md) - 快速开始
- [WINDSURF_SETUP.md](../WINDSURF_SETUP.md) - 详细配置指南
- [docs/API.md](../docs/API.md) - 完整 API 文档
- [docs/EXAMPLES.md](../docs/EXAMPLES.md) - 更多使用示例

---

## ⚠️ 注意事项

1. **导入路径**：示例使用相对路径，根据你的项目结构调整
2. **类型安全**：示例已添加 TypeScript 类型注解
3. **依赖**：MCP 客户端示例需要额外安装 `@modelcontextprotocol/sdk`
4. **PDF 文件**：示例中的文件路径需要替换为实际路径

---

## 🎓 学习建议

1. **先看 basic-usage.ts**：了解核心 API
2. **再看 mcp-client-example.ts**：了解 MCP 协议使用
3. **阅读 API 文档**：深入了解所有功能
4. **在 Windsurf 中实践**：体验最佳使用方式

---

**提示**：这些示例是为了帮助你理解 ParseFlow 的 API 设计，实际使用时推荐通过 Windsurf 的 MCP 集成。
