# ParseFlow - PDF 解析 MCP 服务器

<div align="center">

**为 Windsurf AI 提供强大的 PDF 解析能力**

[![CI](https://github.com/Libres-coder/ParseFlow/actions/workflows/ci.yml/badge.svg)](https://github.com/Libres-coder/ParseFlow/actions/workflows/ci.yml)
[![License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)
[![Node](https://img.shields.io/badge/node-%3E%3D18.0.0-brightgreen.svg)](https://nodejs.org)
[![MCP](https://img.shields.io/badge/MCP-1.0-purple.svg)](https://modelcontextprotocol.io)
[![Version](https://img.shields.io/badge/version-1.0.0-orange.svg)](CHANGELOG.md)

**中文** | [English](README_EN.md)

</div>

---

## ⚡ 快速了解

> **3 个关键特点**

✅ **Cascade 自动识别** - 无需手动指定工具，自动调用 PDF 解析功能  
✅ **路径动态传递** - 无需硬编码，每次指定不同的 PDF 文件  
✅ **本地部署使用** - 通过配置文件本地部署，完全掌控数据

**使用示例**：

```
在 Windsurf 中直接说：
"分析 D:\report.pdf"
"这个 PDF 有多少页？"
"在合同中搜索'违约责任'"
```

---

## 📖 项目简介

ParseFlow 是基于 **Model Context Protocol (MCP)** 的 PDF 解析服务器，支持 **Windsurf** 和 **Cursor** 两大 AI 编程助手。

### 核心功能

- 📄 **文本提取**：提取 PDF 文本内容，支持分页和范围提取
- 📊 **元数据读取**：获取标题、作者、页数、创建日期等信息
- 🔍 **关键词搜索**：在 PDF 中搜索特定内容
- 🖼️ **图像提取**：导出 PDF 中的图片（计划中）
- 📑 **目录提取**：获取 PDF 书签和目录结构（计划中）

### 技术特点

- ✅ **MCP 协议支持**：标准 MCP Tools 实现
- ✅ **TypeScript 开发**：类型安全，易于维护
- ✅ **Monorepo 架构**：核心库和服务器分离
- ✅ **本地部署**：数据不外传，安全可控

---

## 🏗️ 架构设计

```
┌─────────────────────────────────────┐
│          Windsurf IDE               │
│       (MCP Client / Cascade)        │
└──────────────┬──────────────────────┘
               │ MCP Protocol (stdio)
┌──────────────▼──────────────────────┐
│      ParseFlow MCP Server           │
│  ┌─────────────────────────────┐   │
│  │   MCP Tools                 │   │
│  │  • extract_text             │   │
│  │  • search_pdf               │   │
│  │  • get_metadata             │   │
│  │  • extract_images (planned) │   │
│  │  • get_toc (planned)        │   │
│  └─────────────────────────────┘   │
└──────────────┬──────────────────────┘
               │
┌──────────────▼──────────────────────┐
│    PDF Parser Core Library          │
│  • pdf-parse (文本提取)             │
│  • 元数据解析                       │
│  • 关键词搜索                       │
└─────────────────────────────────────┘
```

---

## 🚀 快速开始

### 前置要求

- **Node.js** >= 18.0.0
- **pnpm** >= 8.0.0（推荐）或 npm >= 9.0.0
- **Windsurf IDE**（支持 MCP 的版本）

### 安装步骤

#### 1. 克隆项目

```bash
git clone https://github.com/your-org/ParseFlow.git
cd ParseFlow
```

#### 2. 安装依赖

```bash
pnpm install
```

#### 3. 构建项目

```bash
pnpm build
```

构建完成后，MCP Server 文件位于：

```
packages/mcp-server/dist/index.js
```

#### 4. 配置 IDE

**支持两种 IDE**：

##### 选项 A：Windsurf（推荐，自动识别）

**配置文件**：`C:\Users\<用户名>\.codeium\windsurf\mcp_config.json`

##### 选项 B：Cursor（需在 Agent 模式明确指示）

**配置文件**：`C:\Users\<用户名>\.cursor\mcp.json`

---

**Windsurf 配置示例**（推荐，使用体验更好）：

编辑该文件，添加 ParseFlow 配置：

```json
{
  "mcpServers": {
    "parseflow": {
      "command": "node",
      "args": ["<项目根目录>\\packages\\mcp-server\\dist\\index.js"],
      "env": {
        "PARSEFLOW_CACHE_DIR": "<项目根目录>\\.cache",
        "PARSEFLOW_MAX_FILE_SIZE": "52428800",
        "PARSEFLOW_ALLOWED_PATHS": "D:\\;C:\\Users",
        "LOG_LEVEL": "info"
      }
    }
  }
}
```

**注意**：

- 将 `<项目根目录>` 替换为你的实际项目路径（例如 `D:\\ParseFlow` 或 `E:\\Projects\\ParseFlow`）
- 使用双反斜杠 `\\` 或单斜杠 `/`
- `PARSEFLOW_ALLOWED_PATHS` 设置允许访问的目录

#### 5. 重启 Windsurf

**完全退出** Windsurf（确认任务管理器中进程已关闭），然后重新启动。

#### 6. 测试

在 Windsurf 对话框中输入：

```
D:\example.pdf 有多少页？
```

如果 Cascade 自动调用 ParseFlow 并返回结果，说明配置成功！

---

## 💡 使用示例

### 基本查询

```
问：D:\report.pdf 有多少页？
答：该 PDF 共有 25 页。
```

### 内容提取

```
问：请提取 D:\contract.pdf 第 5 页的内容
答：[返回第 5 页的文本内容]
```

### 关键词搜索

```
问：在 D:\manual.pdf 中搜索"安装步骤"
答：找到 3 处匹配：
   - 第 12 页：安装步骤详解
   - 第 15 页：高级安装步骤
   - 第 20 页：常见安装步骤问题
```

### 元数据获取

```
问：D:\document.pdf 的作者是谁？
答：作者：Unknown, 创建日期：2025-01-15
```

---

## 📚 文档

### 📖 用户指南

- [快速开始](docs/guides/quick-start.md) - 5 分钟上手 ParseFlow
- [常见问题](docs/guides/faq.md) - FAQ 和故障排除
- [使用示例](docs/guides/examples.md) - 代码示例和最佳实践

### ⚙️ 环境配置

- [Windsurf 配置](docs/setup/windsurf.md) - Windsurf IDE 配置指南（推荐）
- [Cursor 配置](docs/setup/cursor.md) - Cursor IDE 配置指南

### 🛠️ 开发文档

- [API 文档](docs/development/api.md) - 完整 API 参考
- [架构设计](docs/development/architecture.md) - 系统架构说明
- [开发指南](docs/development/development.md) - 如何参与开发
- [测试指南](docs/development/testing.md) - 测试策略和集成测试 PDF 说明 ⭐
- [命名规范](docs/development/naming-conventions.md) - 代码规范

### 📋 项目规划

- [待办事项](docs/planning/todo.md) - 功能路线图
- [分发分析](docs/planning/distribution-analysis.md) - 发布计划

### 📂 文档索引

- [完整文档目录](docs/README.md) - 所有文档的索引

---

## 🛠️ 项目结构

```
ParseFlow/
├── packages/
│   ├── mcp-server/              # MCP 服务器
│   │   ├── src/
│   │   │   ├── index.ts         # 入口文件
│   │   │   ├── server.ts        # MCP Server 实现
│   │   │   ├── tools/           # MCP Tools 处理器
│   │   │   └── utils/           # 工具函数
│   │   └── package.json
│   └── pdf-parser-core/         # PDF 解析核心库
│       ├── src/
│       │   ├── parser.ts        # 主解析器
│       │   ├── extractors/      # 文本/元数据提取器
│       │   ├── search/          # 搜索引擎
│       │   └── types/           # TypeScript 类型
│       └── package.json
├── scripts/                     # 配置和诊断脚本
├── docs/                        # 文档
├── examples/                    # 示例代码
├── tests/                       # 测试文件
└── README.md                    # 本文件
```

---

## 🔧 配置选项

### 环境变量

| 变量名                    | 说明                       | 默认值            |
| ------------------------- | -------------------------- | ----------------- |
| `PARSEFLOW_CACHE_DIR`     | 缓存目录                   | `.cache`          |
| `PARSEFLOW_MAX_FILE_SIZE` | 最大文件大小（字节）       | `52428800` (50MB) |
| `PARSEFLOW_ALLOWED_PATHS` | 允许访问的路径（`;` 分隔） | 无                |
| `LOG_LEVEL`               | 日志级别                   | `info`            |
| `PARSEFLOW_LOG_FILE`      | 日志文件路径               | 可选              |

### 配置示例

```json
{
  "env": {
    "PARSEFLOW_CACHE_DIR": "/path/to/cache",
    "PARSEFLOW_MAX_FILE_SIZE": "104857600",
    "PARSEFLOW_ALLOWED_PATHS": "D:\\Documents;E:\\Projects",
    "LOG_LEVEL": "debug"
  }
}
```

---

## 🧪 开发指南

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

# 构建
pnpm build
```

### 测试说明

#### 📊 测试概况

```
总测试数:   22 tests
单元测试:   14 tests (必须通过)
集成测试:   8 tests  (可选，需要 PDF)
当前覆盖率: 94.56%
```

#### ⚠️ 集成测试 PDF 提醒

**集成测试需要测试 PDF 文件，但这是可选的！**

```bash
# 位置
tests/fixtures/test.pdf

# 添加测试 PDF（任意 PDF 即可）
cp /path/to/your.pdf tests/fixtures/test.pdf
```

**测试行为**:
- ✅ **有 PDF**: 运行全部 22 个测试
- ✅ **无 PDF**: 运行 14 个单元测试，自动跳过 8 个集成测试
- ✅ **CI 通过**: 两种情况都通过，退出码 0

**为什么不提交 PDF?**
- 避免二进制文件增大仓库
- 开发者可使用自己的测试文件
- CI 无需下载大文件

```bash
# 无 PDF 时的输出示例
⚠️  Integration tests skipped: test.pdf not found
   Expected location: tests/fixtures/test.pdf
   Place a test PDF at tests/fixtures/test.pdf to run these tests

✅ Test Suites: 1 skipped, 2 passed, 2 of 3 total
✅ Tests:       8 skipped, 14 passed, 22 total
```

**详细说明**: 查看 [测试指南](docs/development/testing.md)

### 手动测试 MCP Server

```bash
# 直接运行
node packages/mcp-server/dist/index.js

# 使用 MCP Inspector
npx @modelcontextprotocol/inspector node packages/mcp-server/dist/index.js
```

### 使用配置脚本

```bash
# 自动配置 Windsurf
.\scripts\setup-windsurf.ps1

# 检查 MCP 状态
.\scripts\check-mcp-status.ps1

# 测试安装
.\scripts\test-installation.ps1
```

---

## 📋 MCP Tools 参考

### extract_text

提取 PDF 文本内容。

**参数**：

- `path` (string): PDF 文件路径
- `page` (number, 可选): 提取特定页
- `range` (string, 可选): 页码范围，如 "1-5"
- `strategy` (string, 可选): 提取策略 - "raw", "formatted", "clean"

**返回**：文本内容

### search_pdf

在 PDF 中搜索关键词。

**参数**：

- `path` (string): PDF 文件路径
- `query` (string): 搜索关键词
- `caseSensitive` (boolean, 可选): 是否区分大小写
- `maxResults` (number, 可选): 最大结果数

**返回**：搜索结果数组（包含页码和上下文）

### get_metadata

获取 PDF 元数据。

**参数**：

- `path` (string): PDF 文件路径

**返回**：元数据对象（标题、作者、页数、创建日期等）

---

## 🚀 未来计划

### 高优先级

#### ⭐ MCP Marketplace 发布

让用户一键安装 ParseFlow！

**计划**：

- 发布到 npm
- 提交到官方 MCP Registry
- 自动安装和配置

**优先级**: ⭐⭐⭐⭐⭐

#### ⭐ VSCode 扩展

改善安装和使用体验

**功能**：

- 一键安装配置
- 自动版本管理
- 状态监控 UI

**注意**: VSCode 扩展只能改善安装体验，不能改变 AI 的工具选择行为

**优先级**: ⭐⭐⭐⭐

### 计划中

- 目录（TOC）提取
- 图像导出功能
- 高级搜索功能
- 性能优化

### 未来考虑

- OCR 支持（扫描件识别）
- AI 文档分析
- 更多 IDE 集成

**详细路线图**: [docs/planning/todo.md](docs/planning/todo.md)  
**技术分析**: [docs/planning/distribution-analysis.md](docs/planning/distribution-analysis.md)

---

## 🤝 贡献指南

欢迎贡献！请查看 [CONTRIBUTING.md](CONTRIBUTING.md)

### 贡献流程

1. Fork 本仓库
2. 创建特性分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 开启 Pull Request

---

## 🐛 问题反馈

如果遇到问题：

1. 查看 [docs/guides/faq.md](docs/guides/faq.md) 常见问题
2. 查看 [logs/parseflow.log](logs/) 日志文件
3. 提交 [Issue](https://github.com/Libres-coder/ParseFlow/issues)

---

## 📄 许可证

本项目采用 MIT 许可证 - 详见 [LICENSE](LICENSE) 文件

---

## 🙏 致谢

- [Model Context Protocol](https://modelcontextprotocol.io) - MCP 协议标准
- [pdf-parse](https://www.npmjs.com/package/pdf-parse) - PDF 文本提取库
- Windsurf 社区 - 测试和反馈

---

## 📮 资源链接

- [MCP 协议文档](https://modelcontextprotocol.io)
- [Windsurf IDE](https://codeium.com/windsurf)
- [项目文档](docs/)

---

<div align="center">

**v1.0.0** | **2025-11-26** | **本地部署**

Made with ❤️ for Windsurf Community

</div>
