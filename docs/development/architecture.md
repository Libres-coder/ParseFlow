# ParseFlow 架构设计文档

## 📋 目录

- [1. 整体架构](#1-整体架构)
- [2. 核心组件](#2-核心组件)
- [3. MCP 协议集成](#3-mcp-协议集成)
- [4. PDF 解析引擎](#4-pdf-解析引擎)
- [5. 数据流设计](#5-数据流设计)
- [6. 性能优化](#6-性能优化)
- [7. 安全机制](#7-安全机制)
- [8. 扩展性设计](#8-扩展性设计)

---

## 1. 整体架构

### 1.1 系统分层

```
┌─────────────────────────────────────────────────────────────┐
│                    应用层 (Application)                      │
│  ┌───────────────┐  ┌───────────────┐  ┌───────────────┐   │
│  │   Windsurf    │  │Claude Desktop │  │  Other MCP    │   │
│  │     IDE       │  │               │  │    Clients    │   │
│  └───────┬───────┘  └───────┬───────┘  └───────┬───────┘   │
└──────────┼──────────────────┼──────────────────┼───────────┘
           │                  │                  │
           └──────────────────┼──────────────────┘
                              │ MCP Protocol (JSON-RPC 2.0)
                              │
┌─────────────────────────────▼─────────────────────────────────┐
│                    MCP 服务层 (MCP Server)                     │
│  ┌──────────────────────────────────────────────────────────┐ │
│  │              Server Core (server.ts)                     │ │
│  │  - Connection Management  - Request Router               │ │
│  │  - Protocol Handler       - Error Handling               │ │
│  └──────────────────────────────────────────────────────────┘ │
│  ┌──────────────────────┐  ┌──────────────────────────────┐  │
│  │   Resource Handler   │  │      Tool Handler            │  │
│  │  - PDF Resources     │  │  - extract_text              │  │
│  │  - URI Resolver      │  │  - search_pdf                │  │
│  │  - Content Provider  │  │  - get_metadata              │  │
│  │                      │  │  - extract_images            │  │
│  └──────────────────────┘  └──────────────────────────────┘  │
└──────────────────┬────────────────────────────────────────────┘
                   │
┌──────────────────▼────────────────────────────────────────────┐
│                 业务逻辑层 (Business Logic)                    │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐        │
│  │ PDF Manager  │  │Cache Manager │  │Path Resolver │        │
│  └──────────────┘  └──────────────┘  └──────────────┘        │
└──────────────────┬────────────────────────────────────────────┘
                   │
┌──────────────────▼────────────────────────────────────────────┐
│                 解析引擎层 (Parser Engine)                     │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐        │
│  │Text Extractor│  │Image Exporter│  │ Metadata     │        │
│  │              │  │              │  │ Reader       │        │
│  └──────────────┘  └──────────────┘  └──────────────┘        │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐        │
│  │Search Engine │  │ Structure    │  │   OCR        │        │
│  │              │  │ Analyzer     │  │  Engine      │        │
│  └──────────────┘  └──────────────┘  └──────────────┘        │
└──────────────────┬────────────────────────────────────────────┘
                   │
┌──────────────────▼────────────────────────────────────────────┐
│                   基础库层 (Libraries)                         │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐        │
│  │   PDF.js     │  │  pdf-parse   │  │ Tesseract.js │        │
│  │  (Mozilla)   │  │              │  │    (OCR)     │        │
│  └──────────────┘  └──────────────┘  └──────────────┘        │
└───────────────────────────────────────────────────────────────┘
```

### 1.2 核心设计原则

1. **单一职责原则 (SRP)**
   - MCP Server 只负责协议通信和请求路由
   - 解析引擎只负责 PDF 处理逻辑
   - 各组件职责清晰，易于测试和维护

2. **开闭原则 (OCP)**
   - 支持插件化扩展（新的文档格式、新的提取器）
   - 通过接口抽象，无需修改核心代码

3. **依赖倒置原则 (DIP)**
   - 高层模块不依赖低层模块，都依赖抽象
   - 使用 TypeScript 接口定义契约

4. **接口隔离原则 (ISP)**
   - 提供细粒度的接口，客户端只依赖需要的方法

---

## 2. 核心组件

### 2.1 MCP Server Core

**职责：** 处理 MCP 协议通信，管理连接，路由请求

**核心类：**

```typescript
class ParseFlowServer {
  private server: Server;
  private resourceManager: ResourceManager;
  private toolManager: ToolManager;

  constructor(config: ServerConfig) {
    this.server = new Server(
      { name: 'parseflow', version: '1.0.0' },
      { capabilities: { resources: {}, tools: {} } }
    );
    this.setupHandlers();
  }

  private setupHandlers(): void {
    // Resource 处理
    this.server.setRequestHandler(ListResourcesRequestSchema, this.handleListResources.bind(this));

    this.server.setRequestHandler(ReadResourceRequestSchema, this.handleReadResource.bind(this));

    // Tool 处理
    this.server.setRequestHandler(ListToolsRequestSchema, this.handleListTools.bind(this));

    this.server.setRequestHandler(CallToolRequestSchema, this.handleCallTool.bind(this));
  }

  async start(): Promise<void> {
    const transport = new StdioServerTransport();
    await this.server.connect(transport);
  }
}
```

**通信方式：**

- 使用 stdio (标准输入输出) 通信
- 支持 JSON-RPC 2.0 协议
- 异步非阻塞处理

### 2.2 Resource Manager

**职责：** 将 PDF 文件映射为 MCP Resources

**URI 设计：**

```typescript
interface PDFResourceURI {
  scheme: 'pdf'; // 协议
  path: string; // 文件路径
  query?: {
    page?: number; // 页码
    range?: string; // 页码范围 "1-10"
    section?: string; // 章节名
  };
}

// 示例：
// pdf://D:/docs/manual.pdf
// pdf://D:/docs/manual.pdf?page=5
// pdf://D:/docs/manual.pdf?range=1-10
// pdf://D:/docs/manual.pdf?section=chapter-1
```

**Resource 结构：**

```typescript
interface PDFResource {
  uri: string;
  name: string; // 显示名称
  description?: string; // 描述
  mimeType: 'application/pdf';
  metadata?: {
    pageCount: number;
    author?: string;
    title?: string;
    creationDate?: Date;
  };
}
```

### 2.3 Tool Manager

**职责：** 提供 PDF 操作工具

**工具定义：**

```typescript
interface PDFTool {
  name: string;
  description: string;
  inputSchema: JSONSchema;
}

// 工具列表
const TOOLS: PDFTool[] = [
  {
    name: 'extract_text',
    description: '从 PDF 提取文本内容',
    inputSchema: {
      type: 'object',
      properties: {
        path: { type: 'string', description: 'PDF 文件路径' },
        page: { type: 'number', description: '页码（可选）' },
        range: { type: 'string', description: '页码范围（可选）' },
      },
      required: ['path'],
    },
  },
  {
    name: 'search_pdf',
    description: '在 PDF 中搜索关键词',
    inputSchema: {
      type: 'object',
      properties: {
        path: { type: 'string' },
        query: { type: 'string', description: '搜索关键词' },
        caseSensitive: { type: 'boolean', default: false },
      },
      required: ['path', 'query'],
    },
  },
  // ... 其他工具
];
```

### 2.4 PDF Parser Core

**职责：** 核心解析引擎，处理所有 PDF 操作

**主类设计：**

```typescript
class PDFParser {
  private cache: CacheManager;
  private config: ParserConfig;

  constructor(config?: ParserConfig) {
    this.cache = new CacheManager(config?.cache);
    this.config = { ...DEFAULT_CONFIG, ...config };
  }

  // 主要方法
  async extractText(path: string, options?: ExtractOptions): Promise<string>;
  async extractPage(path: string, page: number): Promise<string>;
  async extractRange(path: string, range: string): Promise<string>;
  async getMetadata(path: string): Promise<PDFMetadata>;
  async search(path: string, query: string, options?: SearchOptions): Promise<SearchResult[]>;
  async extractImages(path: string, outputDir: string): Promise<string[]>;
  async getTOC(path: string): Promise<TOCItem[]>;
}
```

**支持的解析库：**

1. **pdf-parse**（主要）
   - 轻量级，易于使用
   - 适合文本提取
2. **pdfjs-dist**（备用）
   - Mozilla 维护，功能强大
   - 支持更复杂的 PDF 结构

3. **tesseract.js**（OCR）
   - 处理扫描版 PDF
   - 可选功能

---

## 3. MCP 协议集成

### 3.1 协议规范

ParseFlow 实现 MCP 1.0 标准，支持以下能力：

```typescript
const SERVER_CAPABILITIES = {
  resources: {
    subscribe: false, // 暂不支持订阅
    listChanged: false,
  },
  tools: {
    listChanged: false,
  },
};
```

### 3.2 消息流程

**Resource 读取流程：**

```
Client                          Server
  │                               │
  ├─── ListResourcesRequest ─────>│
  │<─── ListResourcesResponse ────┤
  │                               │
  ├─── ReadResourceRequest ───────>│
  │    { uri: "pdf://..." }       │
  │                               │
  │                          [解析 URI]
  │                          [读取文件]
  │                          [提取内容]
  │                               │
  │<─── ReadResourceResponse ─────┤
  │    { contents: [...] }        │
```

**Tool 调用流程：**

```
Client                          Server
  │                               │
  ├─── ListToolsRequest ─────────>│
  │<─── ListToolsResponse ────────┤
  │                               │
  ├─── CallToolRequest ──────────>│
  │    { name: "extract_text",    │
  │      arguments: {...} }       │
  │                               │
  │                          [执行工具]
  │                          [处理参数]
  │                          [返回结果]
  │                               │
  │<─── CallToolResponse ─────────┤
  │    { content: [...] }         │
```

### 3.3 错误处理

**错误码设计：**

```typescript
enum ParseFlowErrorCode {
  FILE_NOT_FOUND = -32001,
  INVALID_PDF = -32002,
  PARSE_ERROR = -32003,
  PERMISSION_DENIED = -32004,
  FILE_TOO_LARGE = -32005,
  UNSUPPORTED_FORMAT = -32006,
  CACHE_ERROR = -32007,
}
```

**错误响应示例：**

```json
{
  "jsonrpc": "2.0",
  "error": {
    "code": -32002,
    "message": "无效的 PDF 文件",
    "data": {
      "path": "D:/test.pdf",
      "reason": "文件已损坏或格式不正确"
    }
  },
  "id": 1
}
```

---

## 4. PDF 解析引擎

### 4.1 文本提取策略

**多策略提取：**

```typescript
enum ExtractionStrategy {
  RAW = 'raw', // 原始文本，保留所有空格和换行
  FORMATTED = 'formatted', // 格式化，保留段落结构
  CLEAN = 'clean', // 清理，移除多余空白
}

interface ExtractOptions {
  strategy?: ExtractionStrategy;
  preserveFormatting?: boolean;
  includeHeaders?: boolean;
  includeFooters?: boolean;
}
```

**实现细节：**

```typescript
class TextExtractor {
  async extract(buffer: Buffer, options: ExtractOptions): Promise<string> {
    const data = await pdf(buffer);
    let text = data.text;

    switch (options.strategy) {
      case ExtractionStrategy.RAW:
        return text;

      case ExtractionStrategy.FORMATTED:
        return this.formatText(text);

      case ExtractionStrategy.CLEAN:
        return this.cleanText(text);
    }
  }

  private formatText(text: string): string {
    // 保留段落，规范化空白
    return text
      .split('\n\n')
      .map((para) => para.replace(/\s+/g, ' ').trim())
      .join('\n\n');
  }

  private cleanText(text: string): string {
    // 移除多余空白，合并行
    return text.replace(/\s+/g, ' ').trim();
  }
}
```

### 4.2 元数据读取

**元数据结构：**

```typescript
interface PDFMetadata {
  info: {
    Title?: string;
    Author?: string;
    Subject?: string;
    Keywords?: string;
    Creator?: string;
    Producer?: string;
    CreationDate?: Date;
    ModDate?: Date;
  };
  metadata: {
    pageCount: number;
    fileSize: number;
    pdfVersion: string;
    isEncrypted: boolean;
    isLinearized: boolean;
  };
  permissions: {
    printing: boolean;
    modifying: boolean;
    copying: boolean;
    annotating: boolean;
  };
}
```

### 4.3 搜索引擎

**搜索算法：**

```typescript
interface SearchResult {
  page: number;
  snippet: string; // 匹配的文本片段
  context: string; // 上下文（前后各 50 字符）
  position: number; // 在页面中的位置
  score?: number; // 相关性评分（语义搜索）
}

class SearchEngine {
  // 关键词搜索（精确匹配）
  async keywordSearch(
    text: string,
    query: string,
    options: SearchOptions
  ): Promise<SearchResult[]> {
    const regex = new RegExp(options.caseSensitive ? query : query.toLowerCase(), 'g');
    // ... 实现
  }

  // 语义搜索（可选，使用向量嵌入）
  async semanticSearch(text: string, query: string): Promise<SearchResult[]> {
    // 使用 transformers.js 或调用嵌入 API
    // ... 实现
  }
}
```

### 4.4 图像提取

**提取流程：**

```typescript
class ImageExtractor {
  async extractImages(pdfPath: string, outputDir: string): Promise<string[]> {
    const doc = await pdfjsLib.getDocument(pdfPath).promise;
    const imagePaths: string[] = [];

    for (let i = 1; i <= doc.numPages; i++) {
      const page = await doc.getPage(i);
      const ops = await page.getOperatorList();

      // 查找图像操作符
      for (let j = 0; j < ops.fnArray.length; j++) {
        if (ops.fnArray[j] === pdfjsLib.OPS.paintImageXObject) {
          const imageName = ops.argsArray[j][0];
          const image = await this.extractImage(page, imageName);
          const path = await this.saveImage(image, outputDir, `page${i}_img${j}`);
          imagePaths.push(path);
        }
      }
    }

    return imagePaths;
  }
}
```

---

## 5. 数据流设计

### 5.1 读取流程

```
用户请求
   │
   ├──> URI 解析
   │      │
   │      ├──> 提取文件路径
   │      └──> 提取查询参数（页码、范围）
   │
   ├──> 路径解析
   │      │
   │      ├──> 规范化路径
   │      ├──> 安全检查（是否在允许的目录）
   │      └──> 文件存在性检查
   │
   ├──> 缓存查询
   │      │
   │      ├──> 命中缓存 ──> 返回缓存内容
   │      └──> 未命中 ──> 继续
   │
   ├──> 文件读取
   │      │
   │      └──> 读取 Buffer
   │
   ├──> PDF 解析
   │      │
   │      ├──> 验证 PDF 格式
   │      ├──> 提取文本/元数据/图片
   │      └──> 根据参数处理（分页、范围）
   │
   ├──> 缓存存储
   │
   └──> 返回结果
```

### 5.2 缓存策略

**多层缓存：**

```typescript
class CacheManager {
  private memoryCache: LRUCache<string, CachedData>; // 内存缓存
  private diskCache: DiskCache; // 磁盘缓存

  async get(key: string): Promise<CachedData | null> {
    // 先查内存
    let data = this.memoryCache.get(key);
    if (data) return data;

    // 再查磁盘
    data = await this.diskCache.get(key);
    if (data) {
      this.memoryCache.set(key, data);
      return data;
    }

    return null;
  }

  async set(key: string, data: CachedData, ttl?: number): Promise<void> {
    // 同时写入内存和磁盘
    this.memoryCache.set(key, data);
    await this.diskCache.set(key, data, ttl);
  }
}
```

**缓存键设计：**

```typescript
function generateCacheKey(path: string, options: ExtractOptions): string {
  const hash = crypto.createHash('md5');
  hash.update(path);
  hash.update(JSON.stringify(options));
  hash.update(fs.statSync(path).mtime.toISOString()); // 包含修改时间
  return hash.digest('hex');
}
```

---

## 6. 性能优化

### 6.1 异步处理

- 所有 I/O 操作使用异步 API
- 并行处理多页提取
- 使用 Worker Threads 处理 CPU 密集型任务

```typescript
class ParallelProcessor {
  private workers: Worker[];

  async extractPages(pdfPath: string, pages: number[]): Promise<Map<number, string>> {
    const tasks = pages.map((page) => ({
      type: 'extract',
      path: pdfPath,
      page,
    }));

    // 分配到多个 Worker
    const results = await Promise.all(tasks.map((task) => this.executeInWorker(task)));

    return new Map(results.map((r, i) => [pages[i], r]));
  }
}
```

### 6.2 流式处理

对于大文件，使用流式处理避免内存溢出：

```typescript
async function streamExtract(pdfPath: string): AsyncGenerator<string> {
  const doc = await pdfjsLib.getDocument(pdfPath).promise;

  for (let i = 1; i <= doc.numPages; i++) {
    const page = await doc.getPage(i);
    const content = await page.getTextContent();
    const text = content.items.map((item: any) => item.str).join(' ');
    yield text;
  }
}
```

### 6.3 内存管理

```typescript
class MemoryMonitor {
  private maxMemoryUsage = 500 * 1024 * 1024; // 500MB

  checkMemory(): void {
    const usage = process.memoryUsage();
    if (usage.heapUsed > this.maxMemoryUsage) {
      // 触发清理
      this.cache.clear();
      global.gc?.(); // 需要 --expose-gc 标志
    }
  }
}
```

---

## 7. 安全机制

### 7.1 路径安全

```typescript
class PathValidator {
  private allowedPaths: string[];

  validate(path: string): boolean {
    const resolved = path.resolve(path);

    // 检查路径遍历攻击
    if (resolved.includes('..')) {
      throw new Error('Invalid path: contains ".."');
    }

    // 检查是否在白名单目录
    const isAllowed = this.allowedPaths.some((allowed) => resolved.startsWith(allowed));

    if (!isAllowed) {
      throw new Error('Access denied: path not in allowed list');
    }

    return true;
  }
}
```

### 7.2 文件大小限制

```typescript
const MAX_FILE_SIZE = 50 * 1024 * 1024; // 50MB

async function validateFileSize(path: string): Promise<void> {
  const stats = await fs.promises.stat(path);
  if (stats.size > MAX_FILE_SIZE) {
    throw new Error(`File too large: ${stats.size} bytes (max ${MAX_FILE_SIZE})`);
  }
}
```

### 7.3 沙箱执行

```typescript
// 使用 VM2 沙箱执行不可信代码（如果需要）
import { VM } from 'vm2';

class SandboxExecutor {
  private vm: VM;

  constructor() {
    this.vm = new VM({
      timeout: 5000,
      sandbox: {},
      // 禁止访问文件系统、网络等
    });
  }

  execute(code: string): any {
    return this.vm.run(code);
  }
}
```

---

## 8. 扩展性设计

### 8.1 插件系统

```typescript
interface ParserPlugin {
  name: string;
  version: string;
  init(parser: PDFParser): void;
  extractors?: Record<string, Extractor>;
  tools?: Record<string, Tool>;
}

class PluginManager {
  private plugins: Map<string, ParserPlugin> = new Map();

  register(plugin: ParserPlugin): void {
    plugin.init(this.parser);
    this.plugins.set(plugin.name, plugin);
  }

  get(name: string): ParserPlugin | undefined {
    return this.plugins.get(name);
  }
}
```

### 8.2 自定义提取器

```typescript
interface Extractor {
  name: string;
  extract(buffer: Buffer, options?: any): Promise<any>;
}

// 示例：表格提取器
class TableExtractor implements Extractor {
  name = 'table';

  async extract(buffer: Buffer): Promise<Table[]> {
    // 使用 tabula-js 或自定义算法
    // ...
  }
}

// 注册
parser.registerExtractor(new TableExtractor());
```

### 8.3 支持其他文档格式

```typescript
// 未来可扩展为通用文档解析器
interface DocumentParser {
  canHandle(mimeType: string): boolean;
  parse(buffer: Buffer): Promise<ParsedDocument>;
}

class WordParser implements DocumentParser {
  canHandle(mimeType: string): boolean {
    return mimeType === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document';
  }

  async parse(buffer: Buffer): Promise<ParsedDocument> {
    // 使用 mammoth.js
  }
}
```

---

## 9. 监控与日志

### 9.1 日志系统

```typescript
import winston from 'winston';

const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || 'info',
  format: winston.format.combine(winston.format.timestamp(), winston.format.json()),
  transports: [
    new winston.transports.File({ filename: 'error.log', level: 'error' }),
    new winston.transports.File({ filename: 'combined.log' }),
  ],
});

// 使用
logger.info('PDF parsed', { path, pageCount, duration });
```

### 9.2 性能指标

```typescript
class PerformanceTracker {
  track<T>(name: string, fn: () => Promise<T>): Promise<T> {
    const start = performance.now();
    return fn().finally(() => {
      const duration = performance.now() - start;
      logger.info('Performance', { operation: name, duration });
    });
  }
}
```

---

## 10. 总结

ParseFlow 采用分层架构，清晰分离 MCP 协议层、业务逻辑层和解析引擎层。通过合理的抽象和接口设计，实现了高内聚低耦合，便于扩展和维护。

**关键技术亮点：**

- ✅ 原生 MCP 支持，无缝集成 Windsurf
- ✅ 多层缓存，高性能处理
- ✅ 完善的安全机制
- ✅ 插件化架构，易于扩展
- ✅ 异步并行处理，支持大文件

**下一步：**
参考 [DEVELOPMENT.md](./DEVELOPMENT.md) 开始开发实现。
