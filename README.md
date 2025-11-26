# ParseFlow - Windsurf PDF 解析 MCP 服务器

<div align="center">

**为 Windsurf AI 提供强大的 PDF 检索和解析能力**

[![License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)
[![Node](https://img.shields.io/badge/node-%3E%3D18.0.0-brightgreen.svg)](https://nodejs.org)
[![MCP](https://img.shields.io/badge/MCP-1.0-purple.svg)](https://modelcontextprotocol.io)

</div>

---

## 📖 项目简介

ParseFlow 是一个基于 **Model Context Protocol (MCP)** 的 PDF 解析服务器，专为 Windsurf、Claude Desktop 等 AI 编程助手设计。它让 AI 能够：

- 📄 **读取 PDF 内容**：提取文本、元数据、目录结构
- 🔍 **智能检索**：语义搜索、关键词定位
- 📊 **结构化解析**：表格、图表、代码块识别
- 🖼️ **图像提取**：导出 PDF 中的图片和图表
- 🌐 **OCR 支持**：扫描版 PDF 文字识别（可选）

---

## 🎯 核心特性

### 1. 原生 MCP 支持
- 通过 MCP 协议暴露 Resources 和 Tools
- Windsurf 可直接调用，无需手动配置
- 支持流式响应，处理大文件更高效

### 2. 智能解析引擎
- **文本提取**：支持多语言、保留格式
- **元数据读取**：标题、作者、创建日期、页数
- **分页处理**：按页、按章节、按自定义范围提取
- **嵌入资源**：提取图片、字体、链接

### 3. 高级功能
- **语义搜索**：使用向量数据库实现智能检索
- **批量处理**：支持多文件并行解析
- **缓存机制**：避免重复解析，提升性能
- **安全隔离**：沙箱环境，防止恶意 PDF

---

## 🏗️ 架构设计

```
┌─────────────────────────────────────────────┐
│          Windsurf / Claude Desktop          │
│                 (MCP Client)                 │
└──────────────────┬──────────────────────────┘
                   │ MCP Protocol
                   │ (stdio/SSE)
┌──────────────────▼──────────────────────────┐
│           ParseFlow MCP Server              │
│  ┌────────────────────────────────────────┐ │
│  │     Resources (PDF as Resources)       │ │
│  │  - pdf://{path}  → Full content        │ │
│  │  - pdf://{path}#page=N → Page content  │ │
│  └────────────────────────────────────────┘ │
│  ┌────────────────────────────────────────┐ │
│  │     Tools (PDF Operations)             │ │
│  │  - extract_text   → 提取文本           │ │
│  │  - search_pdf     → 搜索内容           │ │
│  │  - get_metadata   → 获取元数据         │ │
│  │  - extract_images → 提取图片           │ │
│  └────────────────────────────────────────┘ │
└──────────────────┬──────────────────────────┘
                   │
┌──────────────────▼──────────────────────────┐
│         PDF Parser Core Library             │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  │
│  │ pdf.js   │  │pdf-parse │  │Tesseract │  │
│  │(Mozilla) │  │          │  │.js (OCR) │  │
│  └──────────┘  └──────────┘  └──────────┘  │
└─────────────────────────────────────────────┘
```

---

## 🚀 快速开始

### 前置要求

- Node.js >= 18.0.0
- npm >= 9.0.0 或 pnpm >= 8.0.0
- Windsurf IDE 或支持 MCP 的客户端

### 安装步骤

#### 1. 克隆项目
```bash
git clone https://github.com/your-username/ParseFlow.git
cd ParseFlow
```

#### 2. 安装依赖
```bash
npm install
# 或使用 pnpm
pnpm install
```

#### 3. 构建项目
```bash
npm run build
```

#### 4. 配置 Windsurf

在 Windsurf 配置文件中添加 MCP 服务器（位置：`%APPDATA%\Windsurf\mcp_config.json`）：

```json
{
  "mcpServers": {
    "parseflow": {
      "command": "node",
      "args": ["D:\\ParseFlow\\dist\\index.js"],
      "env": {
        "PARSEFLOW_CACHE_DIR": "${HOME}/.parseflow/cache",
        "PARSEFLOW_MAX_FILE_SIZE": "50"
      }
    }
  }
}
```

#### 5. 重启 Windsurf

配置生效后，Windsurf 可以直接使用 ParseFlow 的能力！

---

## 💡 使用示例

### 在 Windsurf 中使用

```plaintext
# 示例 1: 读取 PDF 内容
你：请帮我分析 D:\reports\annual-report-2024.pdf 的内容

Windsurf (自动调用 ParseFlow):
- 调用 extract_text 工具
- 提取全文并分析结构
- 返回摘要和关键信息

# 示例 2: 搜索特定内容
你：在这个 PDF 中找到所有关于"营收"的段落

Windsurf (自动调用 ParseFlow):
- 调用 search_pdf 工具
- 返回匹配的文本片段及页码

# 示例 3: 提取元数据
你：这个 PDF 是什么时候创建的？有多少页？

Windsurf (自动调用 ParseFlow):
- 调用 get_metadata 工具
- 返回文件信息
```

### 编程接口（直接使用核心库）

```typescript
import { PDFParser } from '@parseflow/core';

const parser = new PDFParser();

// 提取文本
const text = await parser.extractText('path/to/file.pdf');

// 按页提取
const page5 = await parser.extractPage('path/to/file.pdf', 5);

// 搜索内容
const results = await parser.search('path/to/file.pdf', '关键词');

// 获取元数据
const metadata = await parser.getMetadata('path/to/file.pdf');
```

---

## 📚 API 文档

详见 [API.md](./docs/API.md)

### MCP Resources

| URI 格式 | 描述 | 示例 |
|---------|------|------|
| `pdf://path/to/file.pdf` | 完整 PDF 内容 | `pdf://D:/docs/manual.pdf` |
| `pdf://path?page=N` | 第 N 页内容 | `pdf://D:/docs/manual.pdf?page=5` |
| `pdf://path?range=N-M` | 第 N 到 M 页 | `pdf://D:/docs/manual.pdf?range=1-10` |

### MCP Tools

| 工具名 | 参数 | 返回值 |
|--------|------|--------|
| `extract_text` | `path`, `page?`, `range?` | 文本内容 |
| `search_pdf` | `path`, `query`, `caseSensitive?` | 搜索结果数组 |
| `get_metadata` | `path` | 元数据对象 |
| `extract_images` | `path`, `outputDir` | 图片文件路径数组 |

---

## 🛠️ 开发指南

### 项目结构

```
ParseFlow/
├── packages/
│   ├── mcp-server/           # MCP 服务器主体
│   │   ├── src/
│   │   │   ├── index.ts      # 入口文件
│   │   │   ├── server.ts     # MCP 服务器实现
│   │   │   ├── resources/    # Resource 处理器
│   │   │   ├── tools/        # Tool 处理器
│   │   │   └── utils/        # 工具函数
│   │   └── package.json
│   └── pdf-parser-core/      # PDF 解析核心库
│       ├── src/
│       │   ├── parser.ts     # 主解析器
│       │   ├── extractors/   # 各类提取器
│       │   ├── cache/        # 缓存管理
│       │   └── types/        # TypeScript 类型
│       └── package.json
├── docs/                     # 文档目录
│   ├── ARCHITECTURE.md       # 架构设计
│   ├── API.md                # API 文档
│   ├── DEVELOPMENT.md        # 开发指南
│   └── DEPLOYMENT.md         # 部署指南
├── tests/                    # 测试文件
├── examples/                 # 示例代码
├── .windsurfrules           # Windsurf 规则配置
├── package.json             # 根配置
└── README.md                # 本文件
```

### 本地开发

```bash
# 安装依赖
pnpm install

# 开发模式（自动重启）
pnpm dev

# 运行测试
pnpm test

# 代码检查
pnpm lint

# 构建生产版本
pnpm build
```

### 测试 MCP 服务器

```bash
# 使用 MCP Inspector 测试
npx @modelcontextprotocol/inspector node dist/index.js
```

---

## 🔧 配置选项

### 环境变量

| 变量名 | 默认值 | 说明 |
|--------|--------|------|
| `PARSEFLOW_CACHE_DIR` | `~/.parseflow/cache` | 缓存目录 |
| `PARSEFLOW_MAX_FILE_SIZE` | `50` | 最大文件大小（MB） |
| `PARSEFLOW_ENABLE_OCR` | `false` | 是否启用 OCR |
| `PARSEFLOW_LOG_LEVEL` | `info` | 日志级别 |

### 配置文件

在项目根目录创建 `parseflow.config.json`：

```json
{
  "parser": {
    "preserveFormatting": true,
    "extractImages": true,
    "ocrLanguage": "eng+chi_sim"
  },
  "cache": {
    "enabled": true,
    "ttl": 3600000
  },
  "security": {
    "maxFileSize": 52428800,
    "allowedPaths": ["D:\\Documents", "C:\\Users"]
  }
}
```

---

## 🤝 贡献指南

欢迎提交 Issue 和 Pull Request！

1. Fork 本仓库
2. 创建特性分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 开启 Pull Request

详见 [CONTRIBUTING.md](./CONTRIBUTING.md)

---

## 📄 许可证

本项目采用 MIT 许可证 - 详见 [LICENSE](./LICENSE) 文件

---

## 🙏 致谢

- [Model Context Protocol](https://modelcontextprotocol.io) - MCP 协议
- [PDF.js](https://mozilla.github.io/pdf.js/) - Mozilla 的 PDF 渲染库
- [pdf-parse](https://www.npmjs.com/package/pdf-parse) - PDF 文本提取
- [Tesseract.js](https://tesseract.projectnaptha.com/) - OCR 引擎

---

## 📮 联系方式

- 项目主页: https://github.com/your-username/ParseFlow
- 问题反馈: https://github.com/your-username/ParseFlow/issues
- 电子邮件: your-email@example.com

---

<div align="center">

**用 ❤️ 为 Windsurf 社区打造**

</div>
