# ParseFlow Architecture Design

[中文](../../development/architecture.md) | **English**

## 📋 Table of Contents

- [1. Overall Architecture](#1-overall-architecture)
- [2. Core Components](#2-core-components)
- [3. MCP Protocol Integration](#3-mcp-protocol-integration)
- [4. PDF Parsing Engine](#4-pdf-parsing-engine)
- [5. Data Flow Design](#5-data-flow-design)
- [6. Performance Optimization](#6-performance-optimization)
- [7. Security Mechanisms](#7-security-mechanisms)
- [8. Extensibility Design](#8-extensibility-design)

---

## 1. Overall Architecture

### 1.1 System Layers

```
┌─────────────────────────────────────────────────────────────┐
│                  Application Layer                           │
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
│                    MCP Server Layer                            │
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
│  └──────────────────────┘  └──────────────────────────────┘  │
└──────────────────┬────────────────────────────────────────────┘
                   │
┌──────────────────▼────────────────────────────────────────────┐
│                 Business Logic Layer                           │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐        │
│  │ PDF Manager  │  │Cache Manager │  │Path Resolver │        │
│  └──────────────┘  └──────────────┘  └──────────────┘        │
└──────────────────┬────────────────────────────────────────────┘
                   │
┌──────────────────▼────────────────────────────────────────────┐
│                 Parser Engine Layer                            │
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
│                   Library Layer                                │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐        │
│  │   PDF.js     │  │  pdf-parse   │  │ Tesseract.js │        │
│  │  (Mozilla)   │  │              │  │    (OCR)     │        │
│  └──────────────┘  └──────────────┘  └──────────────┘        │
└───────────────────────────────────────────────────────────────┘
```

### 1.2 Core Design Principles

1. **Single Responsibility Principle (SRP)**
   - MCP Server: Protocol communication & request routing only
   - Parser Engine: PDF processing logic only
   - Clear component responsibilities

2. **Open/Closed Principle (OCP)**
   - Plugin-based extensibility
   - Add features without modifying core code

3. **Dependency Inversion Principle (DIP)**
   - High-level modules don't depend on low-level modules
   - Both depend on abstractions (TypeScript interfaces)

4. **Interface Segregation Principle (ISP)**
   - Fine-grained interfaces
   - Clients depend only on methods they use

---

## 2. Core Components

### 2.1 MCP Server Core

**Responsibility**: Handle MCP protocol, manage connections, route requests

**Core Class**:

```typescript
class ParseFlowServer {
  private server: Server;
  private resourceManager: ResourceManager;
  private toolManager: ToolManager;
  
  constructor(config: ServerConfig) {
    this.server = new Server(
      { name: "parseflow", version: "1.0.0" },
      { capabilities: { resources: {}, tools: {} } }
    );
    this.setupHandlers();
  }
  
  async start(): Promise<void> {
    const transport = new StdioServerTransport();
    await this.server.connect(transport);
  }
}
```

**Communication**: stdio (standard input/output)

### 2.2 PDF Parser Core

**Responsibility**: PDF file parsing and content extraction

**Key Components**:

```typescript
class PDFParser {
  private cache: CacheManager;
  private textExtractor: TextExtractor;
  private metadataExtractor: MetadataExtractor;
  private searchEngine: SearchEngine;
  
  async extractText(
    path: string, 
    options?: ExtractOptions
  ): Promise<string> {
    // Check cache
    const cached = await this.cache.get(path);
    if (cached) return cached;
    
    // Extract text
    const text = await this.textExtractor.extract(path, options);
    
    // Cache result
    await this.cache.set(path, text);
    
    return text;
  }
}
```

### 2.3 Cache Manager

**Responsibility**: Manage parsing result caching

**Strategy**: LRU (Least Recently Used)

```typescript
class CacheManager {
  private memoryCache: Map<string, CacheEntry>;
  private diskCache?: DiskCache;
  private maxSize: number;
  private ttl: number;
  
  async get(key: string): Promise<any | null> {
    // Try memory cache first
    const memCache = this.memoryCache.get(key);
    if (memCache && !this.isExpired(memCache)) {
      return memCache.value;
    }
    
    // Try disk cache
    if (this.diskCache) {
      return await this.diskCache.get(key);
    }
    
    return null;
  }
}
```

---

## 3. MCP Protocol Integration

### 3.1 Protocol Implementation

**Based on**: JSON-RPC 2.0

**Transport**: stdio (stdin/stdout)

**Message Format**:

```json
{
  "jsonrpc": "2.0",
  "id": 1,
  "method": "tools/call",
  "params": {
    "name": "extract_text",
    "arguments": {
      "path": "/path/to/document.pdf"
    }
  }
}
```

### 3.2 Supported Capabilities

**Tools** (5 total):
1. `extract_text` - Extract PDF text
2. `get_metadata` - Get PDF metadata
3. `search_pdf` - Search keywords
4. `extract_images` - Extract images (planned)
5. `get_toc` - Get table of contents (planned)

**Resources**:
- PDF file resources
- URI scheme: `pdf://`

---

## 4. PDF Parsing Engine

### 4.1 Text Extraction

**Strategies**:

1. **Raw**: Unprocessed text
2. **Formatted**: With formatting preserved
3. **Clean**: Cleaned and normalized

```typescript
interface TextExtractor {
  extract(
    path: string, 
    strategy: 'raw' | 'formatted' | 'clean'
  ): Promise<string>;
  
  extractPage(path: string, page: number): Promise<string>;
  extractRange(path: string, start: number, end: number): Promise<string>;
}
```

### 4.2 Metadata Extraction

**Extracted Information**:
- Title, Author, Subject
- Creation/Modification dates
- Page count, PDF version
- File size, encryption status

### 4.3 Search Engine

**Features**:
- Keyword search
- Case-sensitive/insensitive
- Page-level results
- Context snippets

```typescript
interface SearchResult {
  page: number;
  matches: number;
  context: string;
  position: { start: number; end: number };
}
```

---

## 5. Data Flow Design

### 5.1 Request Flow

```
IDE/Client
    ↓ (1) MCP Request
MCP Server
    ↓ (2) Parse & Validate
Tool Handler
    ↓ (3) Business Logic
PDF Parser
    ↓ (4) Check Cache
Cache Manager
    ↓ (5a) Cache Hit → Return
    ↓ (5b) Cache Miss → Parse
PDF Library (pdf-parse)
    ↓ (6) Extract Content
Cache Manager
    ↓ (7) Cache Result
Tool Handler
    ↓ (8) Format Response
MCP Server
    ↓ (9) MCP Response
IDE/Client
```

### 5.2 Error Handling Flow

```
Error Occurs
    ↓
Error Handler
    ├→ ValidationError → 400 Bad Request
    ├→ FileNotFoundError → 404 Not Found
    ├→ PermissionError → 403 Forbidden
    ├→ ParseError → 500 Internal Error
    └→ UnknownError → 500 + Log Details
    ↓
Format Error Response
    ↓
Return to Client
```

---

## 6. Performance Optimization

### 6.1 Caching Strategy

**Two-Level Cache**:

1. **Memory Cache** (L1):
   - Fast access
   - Limited size (default 50 items)
   - LRU eviction

2. **Disk Cache** (L2):
   - Larger capacity
   - Persistent across restarts
   - Slower but still faster than re-parsing

### 6.2 Lazy Loading

- PDF loaded only when needed
- Page-by-page extraction for large files
- Streaming for very large documents

### 6.3 Resource Management

```typescript
class ResourcePool<T> {
  private pool: T[];
  private maxSize: number;
  
  async acquire(): Promise<T> {
    if (this.pool.length > 0) {
      return this.pool.pop()!;
    }
    return this.create();
  }
  
  release(resource: T): void {
    if (this.pool.length < this.maxSize) {
      this.pool.push(resource);
    }
  }
}
```

---

## 7. Security Mechanisms

### 7.1 Path Validation

**Prevent**:
- Path traversal attacks
- Access to unauthorized directories

```typescript
function validatePath(path: string): boolean {
  // Check for path traversal
  if (path.includes('..')) return false;
  
  // Check against allowed paths
  return isPathAllowed(path);
}
```

### 7.2 File Size Limits

- Default: 50MB
- Configurable via environment variable
- Prevents memory exhaustion

### 7.3 Input Sanitization

- Validate all user inputs
- Escape special characters
- Prevent injection attacks

---

## 8. Extensibility Design

### 8.1 Plugin System

**Extractor Interface**:

```typescript
interface Extractor {
  name: string;
  version: string;
  
  canHandle(file: File): boolean;
  extract(file: File, options?: any): Promise<Result>;
}
```

**Register Custom Extractor**:

```typescript
extractorRegistry.register(new CustomExtractor());
```

### 8.2 Event System

```typescript
enum ParserEvent {
  PARSE_START = 'parse:start',
  PARSE_END = 'parse:end',
  PARSE_ERROR = 'parse:error',
  CACHE_HIT = 'cache:hit',
  CACHE_MISS = 'cache:miss'
}

parser.on(ParserEvent.PARSE_START, (file: string) => {
  logger.info(`Started parsing: ${file}`);
});
```

### 8.3 Format Support

**Current**: PDF only

**Extensible to**:
- Word documents (.docx)
- Excel spreadsheets (.xlsx)
- PowerPoint presentations (.pptx)
- Plain text (.txt)

---

## 9. Technology Stack

### Core Libraries

| Library | Purpose | Version |
|---------|---------|---------|
| `pdf-parse` | PDF parsing | ^1.1.1 |
| `@modelcontextprotocol/sdk` | MCP protocol | ^1.0.0 |
| `TypeScript` | Type safety | ^5.3.3 |

### Development Tools

| Tool | Purpose |
|------|---------|
| `Jest` | Testing framework |
| `ESLint` | Code linting |
| `Prettier` | Code formatting |
| `TypeDoc` | Documentation generation |

---

## 10. Deployment Architecture

### Standalone Mode

```
User Machine
├── Node.js Runtime
└── ParseFlow MCP Server
    ├── packages/mcp-server
    └── packages/pdf-parser-core
```

### IDE Integration

```
Windsurf/Cursor IDE
    ↓ Spawns process
Node.js Process
    ↓ Runs
ParseFlow MCP Server
    ↓ stdio communication
IDE <---> MCP Server
```

---

## 11. Future Enhancements

### Planned Features

1. **Distributed Processing**
   - Process large PDFs across multiple workers
   - Load balancing

2. **Cloud Storage Support**
   - S3, Azure Blob, Google Cloud Storage
   - Remote PDF processing

3. **Real-time Collaboration**
   - Multiple users viewing same document
   - Shared annotations

4. **Advanced Analytics**
   - Document similarity
   - Entity extraction
   - Sentiment analysis

---

## 12. References

### Documentation
- [MCP Protocol Specification](https://modelcontextprotocol.io)
- [pdf-parse Documentation](https://www.npmjs.com/package/pdf-parse)

### Related Docs
- [API Reference](api.md) - Complete API documentation
- [Development Guide](development.md) - Development setup
- [Contributing](../../CONTRIBUTING.md) - Contribution guidelines

---

**Last Updated**: 2025-11-26  
**Architecture Version**: 1.0  
**Status**: Production
