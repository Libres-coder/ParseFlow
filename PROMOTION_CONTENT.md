# ParseFlow 推广文案

---

## 🇨🇳 中文版

### V2EX 发帖

**标题**: [分享] ParseFlow - 让 Claude Desktop 支持 PDF 解析的 MCP 服务器

**正文**:
```markdown
大家好！

我开发了一个 MCP (Model Context Protocol) 服务器，可以让 Claude Desktop、Windsurf、Cursor 等 AI 工具直接解析和分析 PDF 文件。

## 🚀 功能特性

- ✅ 文本提取（支持多种格式策略）
- ✅ 元数据获取（标题、作者、页数等）
- ✅ 关键词搜索
- ✅ 图片提取
- ✅ 目录提取

## 📦 安装使用

```bash
npm install -g parseflow-mcp-server
```

在 Claude Desktop 配置文件中添加：
```json
{
  "mcpServers": {
    "parseflow": {
      "command": "parseflow"
    }
  }
}
```

## 🔗 链接

- GitHub: https://github.com/Libres-coder/ParseFlow
- npm: https://www.npmjs.com/package/parseflow-mcp-server
- MCP Registry: https://registry.modelcontextprotocol.io/

## 🎯 使用场景

- 让 AI 助手帮你总结 PDF 论文
- 从 PDF 合同中提取关键信息
- 批量处理 PDF 文档
- 搜索 PDF 中的特定内容

欢迎试用和反馈！⭐
```

---

### 掘金文章

**标题**: 实现一个支持 MCP 协议的 PDF 解析服务器

**大纲**:
```markdown
# 实现一个支持 MCP 协议的 PDF 解析服务器

## 前言
- MCP 协议简介
- 为什么需要 PDF 解析服务器
- 项目目标

## 技术选型
- TypeScript + Node.js
- pdf-lib 作为 PDF 解析引擎
- @modelcontextprotocol/sdk
- monorepo 架构（pnpm）

## 核心实现
### 1. PDF 解析核心库
- 文本提取实现
- 元数据获取
- 关键词搜索算法

### 2. MCP 服务器实现
- 工具注册
- 参数验证（Zod）
- 错误处理

### 3. 测试和文档
- Jest 单元测试
- 中英文文档
- 使用示例

## 发布流程
- npm 包发布
- MCP Registry 提交
- GitHub Release

## 使用示例
- 在 Claude Desktop 中使用
- 在 Windsurf/Cursor 中集成
- 作为库在项目中使用

## 总结
- 项目收获
- 未来计划
- 欢迎贡献

## 参考资料
- MCP 官方文档
- pdf-lib 文档
- 项目 GitHub
```

---

### 小红书（如果适用）

**标题**: Claude 竟然能直接读 PDF 了！MCP 服务器实战

**正文**:
```
姐妹们！我发现了一个超好用的工具 ✨

以前 Claude Desktop 不能直接读 PDF，每次都要复制粘贴好麻烦 😫

现在有了 ParseFlow MCP 服务器，Claude 可以：
📄 直接读取 PDF 内容
🔍 搜索关键词
📊 提取元数据
🖼️ 提取图片

安装超简单！一行命令搞定 👇
npm install -g parseflow-mcp-server

配置也很容易，在 Claude 配置文件里加几行就行 ✅

现在我用 Claude 总结论文、分析合同，效率提升 10 倍！🚀

项目开源，免费使用 💝
GitHub: Libres-coder/ParseFlow

有用的话记得点赞收藏哦~ 💖

#Claude #AI工具 #效率神器 #程序员日常
```

---

## 🇬🇧 English Version

### Reddit (r/mcp)

**Title**: [Release] ParseFlow - PDF Parsing MCP Server for Claude Desktop

**Content**:
```markdown
Hey everyone!

I've built an MCP server that enables Claude Desktop, Windsurf, and Cursor to parse and analyze PDF files directly.

## 🚀 Features

- Text extraction with multiple formatting strategies
- Metadata retrieval (title, author, pages, etc.)
- Keyword search within documents
- Image extraction (requires poppler-utils)
- Table of contents extraction

## 📦 Installation

```bash
npm install -g parseflow-mcp-server
```

Add to your Claude Desktop config:
```json
{
  "mcpServers": {
    "parseflow": {
      "command": "parseflow"
    }
  }
}
```

## 🔗 Links

- GitHub: https://github.com/Libres-coder/ParseFlow
- npm: https://www.npmjs.com/package/parseflow-mcp-server
- MCP Registry: https://registry.modelcontextprotocol.io/

## 🎯 Use Cases

- Summarize research papers with AI
- Extract information from PDF contracts
- Batch process PDF documents
- Search for specific content in PDFs

The project is open-source and MIT licensed. Would love to hear your feedback! ⭐
```

---

### Twitter/X

**推文 1** (项目介绍):
```
🚀 Just released ParseFlow - an MCP server for PDF parsing!

Now you can use @AnthropicAI Claude Desktop to:
📄 Extract text from PDFs
🔍 Search within documents  
📊 Get metadata
🖼️ Extract images

Open source & MIT licensed ✨

GitHub: https://github.com/Libres-coder/ParseFlow
npm: https://www.npmjs.com/package/parseflow-mcp-server

#MCP #ClaudeAI #AI #OpenSource
```

**推文 2** (使用场景):
```
📚 Use cases for ParseFlow MCP server:

✅ Summarize research papers with Claude
✅ Extract key info from contracts
✅ Batch process PDFs
✅ Search across multiple documents

Works with Claude Desktop, @windsurf_ai, and @cursor_ai

Try it: npm i -g parseflow-mcp-server

#AITools #Productivity
```

**推文 3** (技术栈):
```
⚙️ Tech stack for ParseFlow:

• TypeScript + Node.js
• pdf-lib for parsing
• @modelcontextprotocol SDK
• 83%+ test coverage
• Monorepo with pnpm

Full docs available on GitHub 📖

Building in public 🚀

#BuildInPublic #TypeScript #OpenSource
```

---

## 📧 Email 模板（给 MCP 相关项目维护者）

**主题**: ParseFlow - New PDF Parsing MCP Server

**正文**:
```
Hi [Name],

I recently built ParseFlow, an MCP server for PDF parsing, and thought it might be interesting for the MCP community.

ParseFlow enables AI assistants like Claude Desktop to:
- Extract and analyze PDF content
- Search within documents
- Retrieve metadata and images
- Handle batch processing

The project is:
✅ Open source (MIT license)
✅ Published on npm and MCP Registry
✅ Fully documented with examples
✅ 83%+ test coverage

Links:
- GitHub: https://github.com/Libres-coder/ParseFlow
- npm: https://www.npmjs.com/package/parseflow-mcp-server
- MCP Registry: Search for "parseflow"

Would appreciate any feedback or suggestions for improvement!

Best regards,
[Your Name]
```

---

## 📱 社交媒体配图建议

### 建议制作的图片：

1. **功能展示图**
   - 5 个主要功能的图标
   - 简洁的说明文字
   - 品牌色搭配

2. **安装流程图**
   - 3 步安装步骤
   - 代码截图
   - 配置示例

3. **使用场景图**
   - Claude Desktop 截图
   - PDF 文件示例
   - 对话示例

4. **技术栈图**
   - 使用的技术图标
   - 架构简图

### 推荐工具：
- Figma（设计）
- Canva（快速制图）
- Carbon（代码截图）
- Excalidraw（架构图）

---

## 🎯 推广时间表

### 第 1 天（今天）
- ✅ 创建 GitHub Release
- ✅ 发布 V2EX 帖子
- ✅ 发布 Twitter 推文

### 第 2-3 天
- [ ] 撰写掘金详细文章
- [ ] 在 Reddit r/mcp 分享
- [ ] 回复评论和反馈

### 第 1 周
- [ ] 收集用户反馈
- [ ] 修复发现的问题
- [ ] 更新文档

### 第 2-4 周
- [ ] 添加用户请求的功能
- [ ] 准备 v1.1.0 版本
- [ ] 持续推广

---

## 📊 推广效果追踪

建议追踪的指标：
- GitHub Stars 数量
- npm 下载量
- GitHub Issues/PR 数量
- 社区反馈
- 文章阅读量

---

祝推广顺利！🚀
