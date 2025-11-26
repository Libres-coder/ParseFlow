# ParseFlow API 文档

## 📋 目录

- [1. MCP Resources API](#1-mcp-resources-api)
- [2. MCP Tools API](#2-mcp-tools-api)
- [3. 核心库 API](#3-核心库-api)
- [4. 配置 API](#4-配置-api)
- [5. 错误码参考](#5-错误码参考)

---

## 1. MCP Resources API

### 1.1 Resource URI 格式

ParseFlow 使用自定义 URI 方案来访问 PDF 资源：

```
pdf://[path][?options]
```

**参数说明：**

| 部分 | 说明 | 必需 | 示例 |
|------|------|------|------|
| `pdf://` | 协议标识符 | 是 | - |
| `path` | PDF 文件的绝对路径 | 是 | `D:/docs/manual.pdf` |
| `options` | 查询参数（可选） | 否 | `?page=5&format=markdown` |

**查询参数：**

| 参数 | 类型 | 说明 | 示例 |
|------|------|------|------|
| `page` | number | 提取指定页码 | `?page=5` |
| `range` | string | 提取页码范围 | `?range=1-10` |
| `section` | string | 提取指定章节（根据书签） | `?section=chapter-1` |
| `format` | string | 输出格式（`text`/`markdown`/`json`） | `?format=markdown` |

**URI 示例：**

```typescript
// 完整 PDF 内容
"pdf://D:/documents/report.pdf"

// 第 5 页
"pdf://D:/documents/report.pdf?page=5"

// 第 1-10 页
"pdf://D:/documents/report.pdf?range=1-10"

// 指定章节
"pdf://D:/documents/report.pdf?section=introduction"

// Markdown 格式输出
"pdf://D:/documents/report.pdf?format=markdown"

// 组合参数
"pdf://D:/documents/report.pdf?range=1-5&format=json"
```

### 1.2 List Resources

**请求：**

```json
{
  "jsonrpc": "2.0",
  "method": "resources/list",
  "params": {},
  "id": 1
}
```

**响应：**

```json
{
  "jsonrpc": "2.0",
  "result": {
    "resources": [
      {
        "uri": "pdf://D:/documents/report.pdf",
        "name": "Annual Report 2024",
        "description": "Company annual financial report",
        "mimeType": "application/pdf",
        "metadata": {
          "pageCount": 120,
          "author": "Finance Department",
          "creationDate": "2024-01-15T08:00:00Z"
        }
      }
    ]
  },
  "id": 1
}
```

### 1.3 Read Resource

**请求：**

```json
{
  "jsonrpc": "2.0",
  "method": "resources/read",
  "params": {
    "uri": "pdf://D:/documents/report.pdf?page=5"
  },
  "id": 2
}
```

**响应：**

```json
{
  "jsonrpc": "2.0",
  "result": {
    "contents": [
      {
        "uri": "pdf://D:/documents/report.pdf?page=5",
        "mimeType": "text/plain",
        "text": "Page 5 content here...\n\nFinancial Summary\n\nRevenue: $10M\nProfit: $2M\n..."
      }
    ]
  },
  "id": 2
}
```

**错误响应：**

```json
{
  "jsonrpc": "2.0",
  "error": {
    "code": -32001,
    "message": "File not found",
    "data": {
      "uri": "pdf://D:/documents/missing.pdf",
      "path": "D:/documents/missing.pdf"
    }
  },
  "id": 2
}
```

---

## 2. MCP Tools API

### 2.1 List Tools

**请求：**

```json
{
  "jsonrpc": "2.0",
  "method": "tools/list",
  "params": {},
  "id": 3
}
```

**响应：**

```json
{
  "jsonrpc": "2.0",
  "result": {
    "tools": [
      {
        "name": "extract_text",
        "description": "从 PDF 提取文本内容",
        "inputSchema": {
          "type": "object",
          "properties": {
            "path": {
              "type": "string",
              "description": "PDF 文件路径"
            },
            "page": {
              "type": "number",
              "description": "页码（可选，从 1 开始）"
            },
            "range": {
              "type": "string",
              "description": "页码范围（可选，格式：'1-10'）"
            },
            "strategy": {
              "type": "string",
              "enum": ["raw", "formatted", "clean"],
              "description": "提取策略",
              "default": "formatted"
            }
          },
          "required": ["path"]
        }
      },
      {
        "name": "search_pdf",
        "description": "在 PDF 中搜索关键词",
        "inputSchema": {
          "type": "object",
          "properties": {
            "path": { "type": "string" },
            "query": { "type": "string" },
            "caseSensitive": { "type": "boolean", "default": false },
            "maxResults": { "type": "number", "default": 10 }
          },
          "required": ["path", "query"]
        }
      },
      {
        "name": "get_metadata",
        "description": "获取 PDF 元数据",
        "inputSchema": {
          "type": "object",
          "properties": {
            "path": { "type": "string" }
          },
          "required": ["path"]
        }
      },
      {
        "name": "extract_images",
        "description": "提取 PDF 中的图片",
        "inputSchema": {
          "type": "object",
          "properties": {
            "path": { "type": "string" },
            "outputDir": { "type": "string" },
            "format": {
              "type": "string",
              "enum": ["png", "jpg"],
              "default": "png"
            }
          },
          "required": ["path", "outputDir"]
        }
      },
      {
        "name": "get_toc",
        "description": "获取 PDF 目录结构",
        "inputSchema": {
          "type": "object",
          "properties": {
            "path": { "type": "string" }
          },
          "required": ["path"]
        }
      }
    ]
  },
  "id": 3
}
```

### 2.2 工具详细说明

#### 2.2.1 extract_text

提取 PDF 文本内容。

**输入：**

```typescript
interface ExtractTextInput {
  path: string;                    // PDF 文件路径
  page?: number;                   // 页码（可选）
  range?: string;                  // 页码范围（可选，如 "1-10"）
  strategy?: "raw" | "formatted" | "clean";  // 提取策略
}
```

**调用示例：**

```json
{
  "jsonrpc": "2.0",
  "method": "tools/call",
  "params": {
    "name": "extract_text",
    "arguments": {
      "path": "D:/documents/report.pdf",
      "page": 5,
      "strategy": "formatted"
    }
  },
  "id": 4
}
```

**返回：**

```json
{
  "jsonrpc": "2.0",
  "result": {
    "content": [
      {
        "type": "text",
        "text": "Page 5 content with preserved formatting...\n\nFinancial Summary\n\nRevenue: $10M\nProfit: $2M"
      }
    ]
  },
  "id": 4
}
```

**策略说明：**

- `raw`: 原始文本，保留所有空格和换行
- `formatted`: 格式化文本，保留段落结构，规范化空白
- `clean`: 清理文本，移除多余空白，合并行

#### 2.2.2 search_pdf

在 PDF 中搜索关键词。

**输入：**

```typescript
interface SearchPdfInput {
  path: string;              // PDF 文件路径
  query: string;             // 搜索关键词
  caseSensitive?: boolean;   // 是否区分大小写（默认 false）
  maxResults?: number;       // 最大结果数（默认 10）
  contextLength?: number;    // 上下文长度（默认 50 字符）
}
```

**调用示例：**

```json
{
  "jsonrpc": "2.0",
  "method": "tools/call",
  "params": {
    "name": "search_pdf",
    "arguments": {
      "path": "D:/documents/report.pdf",
      "query": "revenue",
      "caseSensitive": false,
      "maxResults": 5
    }
  },
  "id": 5
}
```

**返回：**

```json
{
  "jsonrpc": "2.0",
  "result": {
    "content": [
      {
        "type": "text",
        "text": "找到 3 个结果：\n\n[1] 第 5 页\n...total revenue increased by 15%...\n\n[2] 第 12 页\n...revenue breakdown by product...\n\n[3] 第 20 页\n...projected revenue for next year..."
      }
    ]
  },
  "id": 5
}
```

#### 2.2.3 get_metadata

获取 PDF 元数据。

**输入：**

```typescript
interface GetMetadataInput {
  path: string;  // PDF 文件路径
}
```

**调用示例：**

```json
{
  "jsonrpc": "2.0",
  "method": "tools/call",
  "params": {
    "name": "get_metadata",
    "arguments": {
      "path": "D:/documents/report.pdf"
    }
  },
  "id": 6
}
```

**返回：**

```json
{
  "jsonrpc": "2.0",
  "result": {
    "content": [
      {
        "type": "text",
        "text": "PDF 元数据：\n\n标题: Annual Report 2024\n作者: Finance Department\n主题: Financial Report\n创建日期: 2024-01-15\n修改日期: 2024-01-20\n页数: 120\n文件大小: 5.2 MB\nPDF 版本: 1.7\n加密: 否"
      }
    ]
  },
  "id": 6
}
```

#### 2.2.4 extract_images

提取 PDF 中的图片。

**输入：**

```typescript
interface ExtractImagesInput {
  path: string;                // PDF 文件路径
  outputDir: string;           // 输出目录
  format?: "png" | "jpg";      // 图片格式（默认 png）
  minWidth?: number;           // 最小宽度（过滤小图标）
  minHeight?: number;          // 最小高度
}
```

**调用示例：**

```json
{
  "jsonrpc": "2.0",
  "method": "tools/call",
  "params": {
    "name": "extract_images",
    "arguments": {
      "path": "D:/documents/report.pdf",
      "outputDir": "D:/output/images",
      "format": "png",
      "minWidth": 100,
      "minHeight": 100
    }
  },
  "id": 7
}
```

**返回：**

```json
{
  "jsonrpc": "2.0",
  "result": {
    "content": [
      {
        "type": "text",
        "text": "提取了 5 张图片：\n\nD:/output/images/page1_img0.png\nD:/output/images/page3_img0.png\nD:/output/images/page5_img0.png\nD:/output/images/page10_img0.png\nD:/output/images/page15_img0.png"
      }
    ]
  },
  "id": 7
}
```

#### 2.2.5 get_toc

获取 PDF 目录结构（Table of Contents）。

**输入：**

```typescript
interface GetTocInput {
  path: string;  // PDF 文件路径
}
```

**调用示例：**

```json
{
  "jsonrpc": "2.0",
  "method": "tools/call",
  "params": {
    "name": "get_toc",
    "arguments": {
      "path": "D:/documents/report.pdf"
    }
  },
  "id": 8
}
```

**返回：**

```json
{
  "jsonrpc": "2.0",
  "result": {
    "content": [
      {
        "type": "text",
        "text": "目录结构：\n\n1. Introduction (第 1 页)\n2. Executive Summary (第 3 页)\n3. Financial Overview (第 5 页)\n   3.1 Revenue Analysis (第 6 页)\n   3.2 Expense Breakdown (第 10 页)\n4. Market Analysis (第 15 页)\n5. Conclusion (第 20 页)"
      }
    ]
  },
  "id": 8
}
```

---

## 3. 核心库 API

如果你想在自己的代码中直接使用 ParseFlow 核心库（而不是通过 MCP）：

### 3.1 安装

```bash
npm install @parseflow/core
```

### 3.2 基本使用

```typescript
import { PDFParser } from '@parseflow/core';

const parser = new PDFParser({
  cache: {
    enabled: true,
    ttl: 3600000  // 1 小时
  }
});

// 提取文本
const text = await parser.extractText('path/to/file.pdf');
console.log(text);

// 提取单页
const page5 = await parser.extractPage('path/to/file.pdf', 5);

// 提取范围
const pages = await parser.extractRange('path/to/file.pdf', '1-10');

// 搜索
const results = await parser.search('path/to/file.pdf', 'keyword');

// 获取元数据
const metadata = await parser.getMetadata('path/to/file.pdf');

// 提取图片
const imagePaths = await parser.extractImages(
  'path/to/file.pdf',
  'output/dir'
);

// 获取目录
const toc = await parser.getTOC('path/to/file.pdf');
```

### 3.3 PDFParser 类

#### 构造函数

```typescript
constructor(config?: ParserConfig)
```

**ParserConfig：**

```typescript
interface ParserConfig {
  cache?: {
    enabled: boolean;
    ttl?: number;              // 缓存过期时间（毫秒）
    maxSize?: number;          // 最大缓存大小（字节）
    directory?: string;        // 缓存目录
  };
  parser?: {
    preserveFormatting?: boolean;
    includeHeaders?: boolean;
    includeFooters?: boolean;
  };
  security?: {
    maxFileSize?: number;      // 最大文件大小（字节）
    allowedPaths?: string[];   // 允许的路径列表
  };
  ocr?: {
    enabled?: boolean;
    language?: string;         // 语言代码（如 'eng+chi_sim'）
  };
}
```

#### 方法

##### extractText

```typescript
async extractText(
  path: string,
  options?: ExtractOptions
): Promise<string>
```

**ExtractOptions：**

```typescript
interface ExtractOptions {
  strategy?: "raw" | "formatted" | "clean";
  preserveFormatting?: boolean;
  includeHeaders?: boolean;
  includeFooters?: boolean;
}
```

##### extractPage

```typescript
async extractPage(
  path: string,
  page: number
): Promise<string>
```

##### extractRange

```typescript
async extractRange(
  path: string,
  range: string  // 格式：'1-10'
): Promise<string>
```

##### search

```typescript
async search(
  path: string,
  query: string,
  options?: SearchOptions
): Promise<SearchResult[]>
```

**SearchOptions：**

```typescript
interface SearchOptions {
  caseSensitive?: boolean;
  maxResults?: number;
  contextLength?: number;
}
```

**SearchResult：**

```typescript
interface SearchResult {
  page: number;
  snippet: string;
  context: string;
  position: number;
}
```

##### getMetadata

```typescript
async getMetadata(path: string): Promise<PDFMetadata>
```

**PDFMetadata：**

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
  };
}
```

##### extractImages

```typescript
async extractImages(
  path: string,
  outputDir: string,
  options?: ImageExtractOptions
): Promise<string[]>
```

**ImageExtractOptions：**

```typescript
interface ImageExtractOptions {
  format?: "png" | "jpg";
  minWidth?: number;
  minHeight?: number;
}
```

##### getTOC

```typescript
async getTOC(path: string): Promise<TOCItem[]>
```

**TOCItem：**

```typescript
interface TOCItem {
  title: string;
  page: number;
  level: number;
  children?: TOCItem[];
}
```

---

## 4. 配置 API

### 4.1 环境变量

| 变量名 | 类型 | 默认值 | 说明 |
|--------|------|--------|------|
| `PARSEFLOW_CACHE_DIR` | string | `~/.parseflow/cache` | 缓存目录 |
| `PARSEFLOW_MAX_FILE_SIZE` | number | `50` | 最大文件大小（MB） |
| `PARSEFLOW_ENABLE_OCR` | boolean | `false` | 是否启用 OCR |
| `PARSEFLOW_OCR_LANGUAGE` | string | `eng` | OCR 语言 |
| `PARSEFLOW_LOG_LEVEL` | string | `info` | 日志级别 |
| `PARSEFLOW_ALLOWED_PATHS` | string | - | 允许的路径（用`;`分隔） |

### 4.2 配置文件

在项目根目录或用户主目录创建 `parseflow.config.json`：

```json
{
  "parser": {
    "preserveFormatting": true,
    "includeHeaders": false,
    "includeFooters": false
  },
  "cache": {
    "enabled": true,
    "ttl": 3600000,
    "maxSize": 104857600,
    "directory": "~/.parseflow/cache"
  },
  "security": {
    "maxFileSize": 52428800,
    "allowedPaths": [
      "D:\\Documents",
      "C:\\Users\\YourName\\Projects"
    ]
  },
  "ocr": {
    "enabled": false,
    "language": "eng+chi_sim"
  },
  "logging": {
    "level": "info",
    "file": "~/.parseflow/logs/parseflow.log"
  }
}
```

---

## 5. 错误码参考

### 5.1 标准 JSON-RPC 错误

| 错误码 | 消息 | 说明 |
|--------|------|------|
| `-32700` | Parse error | 无效的 JSON |
| `-32600` | Invalid Request | 无效的请求对象 |
| `-32601` | Method not found | 方法不存在 |
| `-32602` | Invalid params | 无效的参数 |
| `-32603` | Internal error | 内部错误 |

### 5.2 ParseFlow 自定义错误

| 错误码 | 消息 | 说明 |
|--------|------|------|
| `-32001` | File not found | 文件不存在 |
| `-32002` | Invalid PDF | 无效的 PDF 文件 |
| `-32003` | Parse error | 解析错误 |
| `-32004` | Permission denied | 权限不足 |
| `-32005` | File too large | 文件超过大小限制 |
| `-32006` | Unsupported format | 不支持的格式 |
| `-32007` | Cache error | 缓存错误 |
| `-32008` | OCR error | OCR 处理错误 |
| `-32009` | Invalid page number | 无效的页码 |
| `-32010` | Invalid range | 无效的页码范围 |

### 5.3 错误响应示例

```json
{
  "jsonrpc": "2.0",
  "error": {
    "code": -32002,
    "message": "Invalid PDF",
    "data": {
      "path": "D:/documents/corrupted.pdf",
      "reason": "文件已损坏或不是有效的 PDF 格式",
      "details": "PDF header not found"
    }
  },
  "id": 1
}
```

---

## 6. 使用示例

### 6.1 在 Windsurf 中使用

```typescript
// Windsurf 会自动调用，你只需要问：
"请帮我分析 D:/reports/annual-report.pdf 的内容"

// Windsurf 内部会：
// 1. 调用 get_metadata 获取基本信息
// 2. 调用 extract_text 提取文本
// 3. 分析并返回摘要
```

### 6.2 直接调用 MCP（使用 MCP SDK）

```typescript
import { Client } from '@modelcontextprotocol/sdk/client/index.js';
import { StdioClientTransport } from '@modelcontextprotocol/sdk/client/stdio.js';

const transport = new StdioClientTransport({
  command: 'node',
  args: ['path/to/parseflow/dist/index.js']
});

const client = new Client({
  name: 'my-app',
  version: '1.0.0'
}, {
  capabilities: {}
});

await client.connect(transport);

// 调用工具
const result = await client.callTool({
  name: 'extract_text',
  arguments: {
    path: 'D:/documents/report.pdf',
    page: 5
  }
});

console.log(result.content[0].text);
```

### 6.3 使用核心库

```typescript
import { PDFParser } from '@parseflow/core';

const parser = new PDFParser();

// 分析整个 PDF
const text = await parser.extractText('report.pdf');
const metadata = await parser.getMetadata('report.pdf');
const toc = await parser.getTOC('report.pdf');

console.log(`标题: ${metadata.info.Title}`);
console.log(`页数: ${metadata.metadata.pageCount}`);
console.log(`目录: ${JSON.stringify(toc, null, 2)}`);

// 搜索关键词
const results = await parser.search('report.pdf', 'revenue');
results.forEach((result, i) => {
  console.log(`[${i + 1}] 第 ${result.page} 页: ${result.snippet}`);
});

// 提取图片
const images = await parser.extractImages('report.pdf', './output');
console.log(`提取了 ${images.length} 张图片`);
```

---

## 7. 最佳实践

### 7.1 性能优化

1. **启用缓存**：对于频繁访问的 PDF，启用缓存可以显著提高性能
2. **按需提取**：使用 `page` 或 `range` 参数只提取需要的部分
3. **批量处理**：如果需要处理多个文件，使用并行处理

```typescript
// 不推荐：顺序处理
for (const file of files) {
  await parser.extractText(file);
}

// 推荐：并行处理
await Promise.all(
  files.map(file => parser.extractText(file))
);
```

### 7.2 错误处理

```typescript
try {
  const text = await parser.extractText('path/to/file.pdf');
} catch (error) {
  if (error.code === -32001) {
    console.error('文件不存在');
  } else if (error.code === -32002) {
    console.error('无效的 PDF 文件');
  } else {
    console.error('未知错误', error);
  }
}
```

### 7.3 安全建议

1. **限制访问路径**：配置 `allowedPaths` 限制可访问的目录
2. **文件大小限制**：设置 `maxFileSize` 防止处理过大文件
3. **输入验证**：始终验证用户输入的路径和参数

---

## 8. 更新日志

### v1.0.0 (2024-01-20)
- 初始版本
- 支持文本提取、搜索、元数据读取
- 实现 MCP Resources 和 Tools
- 添加缓存机制

---

## 9. 相关资源

- [架构设计文档](./ARCHITECTURE.md)
- [开发指南](./DEVELOPMENT.md)
- [部署指南](./DEPLOYMENT.md)
- [MCP 协议规范](https://modelcontextprotocol.io)
- [问题反馈](https://github.com/your-username/ParseFlow/issues)
