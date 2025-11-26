# ParseFlow 开发指南

## 📋 目录

- [1. 开发环境设置](#1-开发环境设置)
- [2. 项目结构](#2-项目结构)
- [3. 开发流程](#3-开发流程)
- [4. 测试指南](#4-测试指南)
- [5. 调试技巧](#5-调试技巧)
- [6. 贡献指南](#6-贡献指南)

---

## 1. 开发环境设置

### 1.1 前置要求

- **Node.js**: >= 18.0.0
- **npm**: >= 9.0.0 或 **pnpm**: >= 8.0.0（推荐）
- **Git**: >= 2.30.0
- **编辑器**: VSCode、WebStorm 或 Windsurf（推荐）

### 1.2 克隆项目

```bash
git clone https://github.com/your-username/ParseFlow.git
cd ParseFlow
```

### 1.3 安装依赖

```bash
# 使用 pnpm（推荐）
pnpm install

# 或使用 npm
npm install
```

### 1.4 配置开发环境

#### 创建环境变量文件

```bash
cp .env.example .env
```

编辑 `.env`：

```env
# 开发环境配置
NODE_ENV=development
LOG_LEVEL=debug

# 缓存配置
PARSEFLOW_CACHE_DIR=./cache
PARSEFLOW_CACHE_TTL=3600000

# 安全配置
PARSEFLOW_MAX_FILE_SIZE=52428800
PARSEFLOW_ALLOWED_PATHS=D:\Documents;D:\Projects

# OCR 配置（可选）
PARSEFLOW_ENABLE_OCR=false
PARSEFLOW_OCR_LANGUAGE=eng+chi_sim
```

#### VSCode 配置

创建 `.vscode/settings.json`：

```json
{
  "typescript.tsdk": "node_modules/typescript/lib",
  "editor.formatOnSave": true,
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": true
  },
  "files.exclude": {
    "**/node_modules": true,
    "**/dist": true,
    "**/.cache": true
  }
}
```

创建 `.vscode/launch.json`（调试配置）：

```json
{
  "version": "0.2.0",
  "configurations": [
    {
      "type": "node",
      "request": "launch",
      "name": "Debug MCP Server",
      "program": "${workspaceFolder}/packages/mcp-server/src/index.ts",
      "preLaunchTask": "npm: build",
      "outFiles": ["${workspaceFolder}/dist/**/*.js"],
      "runtimeArgs": ["--expose-gc"],
      "env": {
        "NODE_ENV": "development",
        "LOG_LEVEL": "debug"
      }
    },
    {
      "type": "node",
      "request": "launch",
      "name": "Run Tests",
      "program": "${workspaceFolder}/node_modules/.bin/jest",
      "args": ["--runInBand", "--no-cache"],
      "console": "integratedTerminal"
    }
  ]
}
```

---

## 2. 项目结构

```
ParseFlow/
├── packages/
│   ├── mcp-server/              # MCP 服务器包
│   │   ├── src/
│   │   │   ├── index.ts         # 入口文件
│   │   │   ├── server.ts        # MCP 服务器核心
│   │   │   ├── resources/       # Resource 处理器
│   │   │   │   ├── index.ts
│   │   │   │   ├── handler.ts
│   │   │   │   └── types.ts
│   │   │   ├── tools/           # Tool 处理器
│   │   │   │   ├── index.ts
│   │   │   │   ├── extract-text.ts
│   │   │   │   ├── search-pdf.ts
│   │   │   │   ├── get-metadata.ts
│   │   │   │   ├── extract-images.ts
│   │   │   │   └── get-toc.ts
│   │   │   ├── utils/           # 工具函数
│   │   │   │   ├── logger.ts
│   │   │   │   ├── path-resolver.ts
│   │   │   │   └── error-handler.ts
│   │   │   └── types/           # TypeScript 类型定义
│   │   │       └── index.ts
│   │   ├── tests/               # 测试文件
│   │   ├── package.json
│   │   └── tsconfig.json
│   │
│   └── pdf-parser-core/         # PDF 解析核心库
│       ├── src/
│       │   ├── index.ts         # 导出入口
│       │   ├── parser.ts        # 主解析器类
│       │   ├── extractors/      # 提取器
│       │   │   ├── text-extractor.ts
│       │   │   ├── image-extractor.ts
│       │   │   ├── metadata-extractor.ts
│       │   │   └── toc-extractor.ts
│       │   ├── search/          # 搜索引擎
│       │   │   ├── keyword-search.ts
│       │   │   └── semantic-search.ts
│       │   ├── cache/           # 缓存管理
│       │   │   ├── cache-manager.ts
│       │   │   ├── memory-cache.ts
│       │   │   └── disk-cache.ts
│       │   ├── utils/           # 工具函数
│       │   │   ├── pdf-utils.ts
│       │   │   └── file-utils.ts
│       │   └── types/           # 类型定义
│       │       └── index.ts
│       ├── tests/
│       ├── package.json
│       └── tsconfig.json
│
├── docs/                        # 文档
│   ├── ARCHITECTURE.md
│   ├── API.md
│   ├── DEVELOPMENT.md           # 本文件
│   └── DEPLOYMENT.md
│
├── examples/                    # 示例代码
│   ├── basic-usage.ts
│   ├── mcp-client.ts
│   └── advanced-search.ts
│
├── tests/                       # 集成测试
│   ├── integration/
│   ├── fixtures/                # 测试用 PDF 文件
│   └── e2e/
│
├── scripts/                     # 构建和部署脚本
│   ├── build.js
│   ├── test.js
│   └── publish.js
│
├── .github/                     # GitHub 配置
│   └── workflows/
│       ├── ci.yml
│       └── release.yml
│
├── .vscode/                     # VSCode 配置
│   ├── settings.json
│   ├── launch.json
│   └── extensions.json
│
├── .windsurfrules             # Windsurf 规则
├── .env.example                # 环境变量示例
├── .eslintrc.js                # ESLint 配置
├── .prettierrc                 # Prettier 配置
├── jest.config.js              # Jest 配置
├── package.json                # 根 package.json（工作区配置）
├── pnpm-workspace.yaml         # pnpm 工作区配置
├── tsconfig.json               # 根 TypeScript 配置
├── tsconfig.build.json         # 构建配置
├── LICENSE                     # MIT 许可证
└── README.md                   # 项目说明
```

### 2.1 核心模块说明

#### packages/mcp-server

MCP 服务器的实现，负责：
- 处理 MCP 协议通信
- 路由 Resource 和 Tool 请求
- 错误处理和日志记录
- 与核心库的集成

#### packages/pdf-parser-core

PDF 解析核心库，可独立使用，负责：
- PDF 文件读取和解析
- 文本、图片、元数据提取
- 搜索功能实现
- 缓存管理

---

## 3. 开发流程

### 3.1 开发模式

```bash
# 启动开发模式（自动重启）
pnpm dev

# 或分别启动各包
cd packages/mcp-server
pnpm dev
```

### 3.2 构建项目

```bash
# 构建所有包
pnpm build

# 清理并重新构建
pnpm clean && pnpm build
```

### 3.3 代码规范

#### ESLint

```bash
# 检查代码
pnpm lint

# 自动修复
pnpm lint:fix
```

#### Prettier

```bash
# 格式化代码
pnpm format
```

### 3.4 提交规范

使用 Conventional Commits 规范：

```bash
# 功能
git commit -m "feat(parser): add OCR support"

# 修复
git commit -m "fix(server): handle invalid PDF files"

# 文档
git commit -m "docs(api): update search API examples"

# 样式
git commit -m "style: format code with prettier"

# 重构
git commit -m "refactor(cache): improve cache key generation"

# 测试
git commit -m "test(parser): add unit tests for text extraction"

# 构建
git commit -m "build: upgrade dependencies"
```

---

## 4. 测试指南

### 4.1 测试结构

```
tests/
├── unit/                    # 单元测试
│   ├── parser.test.ts
│   ├── cache.test.ts
│   └── extractors/
│       ├── text.test.ts
│       └── metadata.test.ts
├── integration/             # 集成测试
│   ├── mcp-server.test.ts
│   └── end-to-end.test.ts
├── fixtures/                # 测试数据
│   ├── sample.pdf
│   ├── encrypted.pdf
│   └── corrupted.pdf
└── helpers/                 # 测试辅助函数
    └── test-utils.ts
```

### 4.2 运行测试

```bash
# 运行所有测试
pnpm test

# 运行单元测试
pnpm test:unit

# 运行集成测试
pnpm test:integration

# 监听模式
pnpm test:watch

# 生成覆盖率报告
pnpm test:coverage
```

### 4.3 编写测试

#### 单元测试示例

```typescript
// tests/unit/parser.test.ts
import { PDFParser } from '@parseflow/core';
import { readFileSync } from 'fs';
import { join } from 'path';

describe('PDFParser', () => {
  let parser: PDFParser;
  const testPdfPath = join(__dirname, '../fixtures/sample.pdf');

  beforeEach(() => {
    parser = new PDFParser();
  });

  describe('extractText', () => {
    it('should extract text from valid PDF', async () => {
      const text = await parser.extractText(testPdfPath);
      expect(text).toBeTruthy();
      expect(text.length).toBeGreaterThan(0);
    });

    it('should throw error for non-existent file', async () => {
      await expect(
        parser.extractText('non-existent.pdf')
      ).rejects.toThrow('File not found');
    });

    it('should extract specific page', async () => {
      const text = await parser.extractPage(testPdfPath, 1);
      expect(text).toBeTruthy();
    });
  });

  describe('getMetadata', () => {
    it('should return PDF metadata', async () => {
      const metadata = await parser.getMetadata(testPdfPath);
      expect(metadata).toHaveProperty('info');
      expect(metadata).toHaveProperty('metadata');
      expect(metadata.metadata.pageCount).toBeGreaterThan(0);
    });
  });
});
```

#### 集成测试示例

```typescript
// tests/integration/mcp-server.test.ts
import { Client } from '@modelcontextprotocol/sdk/client/index.js';
import { StdioClientTransport } from '@modelcontextprotocol/sdk/client/stdio.js';
import { spawn } from 'child_process';

describe('MCP Server Integration', () => {
  let client: Client;
  let transport: StdioClientTransport;

  beforeAll(async () => {
    transport = new StdioClientTransport({
      command: 'node',
      args: ['../../dist/index.js']
    });

    client = new Client({
      name: 'test-client',
      version: '1.0.0'
    }, {
      capabilities: {}
    });

    await client.connect(transport);
  });

  afterAll(async () => {
    await transport.close();
  });

  it('should list available tools', async () => {
    const result = await client.listTools();
    expect(result.tools).toHaveLength(5);
    expect(result.tools.map(t => t.name)).toContain('extract_text');
  });

  it('should extract text using tool', async () => {
    const result = await client.callTool({
      name: 'extract_text',
      arguments: {
        path: './tests/fixtures/sample.pdf'
      }
    });

    expect(result.content).toBeTruthy();
    expect(result.content[0].type).toBe('text');
  });
});
```

### 4.4 测试覆盖率

目标覆盖率：
- 语句覆盖率：> 80%
- 分支覆盖率：> 75%
- 函数覆盖率：> 80%
- 行覆盖率：> 80%

```bash
# 查看覆盖率报告
pnpm test:coverage
open coverage/index.html
```

---

## 5. 调试技巧

### 5.1 调试 MCP 服务器

#### 方法 1: 使用 MCP Inspector

```bash
# 安装 MCP Inspector
npm install -g @modelcontextprotocol/inspector

# 启动 Inspector
mcp-inspector node dist/index.js
```

浏览器打开 http://localhost:5173，可以：
- 查看 Resources 列表
- 测试 Tools 调用
- 查看请求/响应日志

#### 方法 2: 使用 VSCode 调试器

1. 在代码中设置断点
2. 按 F5 或选择 "Debug MCP Server" 配置
3. 查看变量、调用栈等信息

#### 方法 3: 日志调试

```typescript
// 在代码中添加日志
import { logger } from './utils/logger';

logger.debug('Processing request', { uri, params });
logger.info('PDF parsed successfully', { pageCount });
logger.error('Failed to parse PDF', { error, path });
```

### 5.2 调试 PDF 解析

```typescript
// 详细日志
const parser = new PDFParser({
  logging: {
    level: 'debug',
    enablePerformance: true
  }
});

// 性能分析
console.time('extract-text');
const text = await parser.extractText('large.pdf');
console.timeEnd('extract-text');

// 内存监控
const before = process.memoryUsage();
await parser.extractText('large.pdf');
const after = process.memoryUsage();
console.log('Memory usage:', {
  heapUsed: (after.heapUsed - before.heapUsed) / 1024 / 1024,
  external: (after.external - before.external) / 1024 / 1024
});
```

### 5.3 常见问题

#### Q: MCP 服务器无响应

**解决方案：**
```bash
# 检查日志
tail -f ~/.parseflow/logs/parseflow.log

# 检查进程
ps aux | grep parseflow

# 重启服务器
pkill -f parseflow
node dist/index.js
```

#### Q: PDF 解析失败

**解决方案：**
```typescript
// 检查 PDF 是否有效
import pdf from 'pdf-parse';

try {
  const buffer = fs.readFileSync('test.pdf');
  const data = await pdf(buffer);
  console.log('PDF is valid', data.numpages);
} catch (error) {
  console.error('Invalid PDF', error);
}
```

#### Q: 缓存问题

**解决方案：**
```bash
# 清除缓存
rm -rf ~/.parseflow/cache/*

# 禁用缓存调试
PARSEFLOW_CACHE_ENABLED=false node dist/index.js
```

---

## 6. 贡献指南

### 6.1 分支策略

- `main`: 稳定版本
- `develop`: 开发分支
- `feature/*`: 功能分支
- `fix/*`: 修复分支
- `docs/*`: 文档分支

### 6.2 Pull Request 流程

1. Fork 项目并克隆到本地
2. 创建功能分支：`git checkout -b feature/amazing-feature`
3. 提交更改：`git commit -m "feat: add amazing feature"`
4. 推送到远程：`git push origin feature/amazing-feature`
5. 创建 Pull Request

### 6.3 PR 检查清单

- [ ] 代码通过 ESLint 检查
- [ ] 代码通过 Prettier 格式化
- [ ] 所有测试通过
- [ ] 测试覆盖率 > 80%
- [ ] 更新相关文档
- [ ] 添加 CHANGELOG 条目
- [ ] Commit 消息符合规范

### 6.4 代码审查标准

1. **功能性**
   - 代码是否实现了预期功能
   - 是否有边界情况处理
   - 错误处理是否完善

2. **可读性**
   - 命名是否清晰
   - 注释是否充分
   - 逻辑是否易懂

3. **性能**
   - 是否有性能瓶颈
   - 内存使用是否合理
   - 是否需要优化

4. **安全性**
   - 是否有安全漏洞
   - 输入验证是否充分
   - 敏感信息是否泄露

5. **测试**
   - 测试覆盖是否充分
   - 测试用例是否合理
   - 是否包含边界测试

---

## 7. 发布流程

### 7.1 版本号规范

使用 [语义化版本](https://semver.org/lang/zh-CN/)：

- `MAJOR`: 不兼容的 API 修改
- `MINOR`: 向下兼容的功能性新增
- `PATCH`: 向下兼容的问题修正

### 7.2 发布步骤

```bash
# 1. 确保在 main 分支且代码最新
git checkout main
git pull origin main

# 2. 运行测试
pnpm test

# 3. 更新版本号
pnpm version patch # 或 minor, major

# 4. 构建
pnpm build

# 5. 发布到 npm
pnpm publish

# 6. 推送到 GitHub
git push origin main --tags

# 7. 创建 GitHub Release
gh release create v1.0.0 --notes "Release notes here"
```

---

## 8. 性能优化指南

### 8.1 缓存优化

```typescript
// 使用 LRU 缓存
import LRU from 'lru-cache';

const cache = new LRU({
  max: 100,
  maxSize: 100 * 1024 * 1024, // 100MB
  ttl: 1000 * 60 * 60,         // 1 小时
  sizeCalculation: (value) => {
    return Buffer.byteLength(JSON.stringify(value));
  }
});
```

### 8.2 并行处理

```typescript
// Worker Threads
import { Worker } from 'worker_threads';

async function extractPagesParallel(
  pdfPath: string,
  pages: number[]
): Promise<Map<number, string>> {
  const workers = pages.map(page => {
    return new Promise((resolve, reject) => {
      const worker = new Worker('./worker.js', {
        workerData: { pdfPath, page }
      });
      worker.on('message', resolve);
      worker.on('error', reject);
    });
  });

  const results = await Promise.all(workers);
  return new Map(results.map((text, i) => [pages[i], text]));
}
```

### 8.3 流式处理

```typescript
// 避免内存溢出
async function* streamPages(pdfPath: string) {
  const doc = await pdfjsLib.getDocument(pdfPath).promise;
  for (let i = 1; i <= doc.numPages; i++) {
    yield await extractPage(doc, i);
  }
}

// 使用
for await (const pageText of streamPages('large.pdf')) {
  process(pageText);
}
```

---

## 9. 相关资源

- [架构设计](./ARCHITECTURE.md)
- [API 文档](./API.md)
- [部署指南](./DEPLOYMENT.md)
- [MCP 协议](https://modelcontextprotocol.io)
- [TypeScript 文档](https://www.typescriptlang.org/docs/)
- [Jest 文档](https://jestjs.io/docs/getting-started)
