# ParseFlow API Reference

[中文](../../development/api.md) | **English**

## 📋 Table of Contents

- [1. MCP Tools](#1-mcp-tools)
- [2. Core API](#2-core-api)
- [3. Configuration](#3-configuration)
- [4. Type Definitions](#4-type-definitions)
- [5. Error Handling](#5-error-handling)

---

## 1. MCP Tools

### 1.1 extract_text

Extract text content from PDF file.

**Syntax**:
```typescript
extract_text(params: ExtractTextParams): Promise<ExtractTextResult>
```

**Parameters**:

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `path` | `string` | Yes | Absolute path to PDF file |
| `page` | `number` | No | Specific page number (1-indexed) |
| `range` | `string` | No | Page range (e.g., "1-5", "3-10") |
| `strategy` | `'raw' \| 'formatted' \| 'clean'` | No | Extraction strategy (default: 'formatted') |

**Return Value**:

```typescript
{
  content: string;        // Extracted text
  pageCount: number;      // Total pages
  extractedPages: number; // Pages extracted
}
```

**Examples**:

```typescript
// Extract all text
const result = await extract_text({ 
  path: "D:\\document.pdf" 
});

// Extract specific page
const page5 = await extract_text({ 
  path: "D:\\document.pdf", 
  page: 5 
});

// Extract page range
const range = await extract_text({ 
  path: "D:\\document.pdf", 
  range: "1-10" 
});

// Use clean strategy
const clean = await extract_text({ 
  path: "D:\\document.pdf", 
  strategy: "clean" 
});
```

**Errors**:
- `FileNotFoundError`: File doesn't exist
- `InvalidPDFError`: Invalid PDF format
- `PermissionError`: No read permission
- `FileSizeExceededError`: File too large

---

### 1.2 get_metadata

Get PDF file metadata.

**Syntax**:
```typescript
get_metadata(params: GetMetadataParams): Promise<MetadataResult>
```

**Parameters**:

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `path` | `string` | Yes | Absolute path to PDF file |

**Return Value**:

```typescript
{
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
    pdfVersion: string;
    isEncrypted: boolean;
    hasAcroForm: boolean;
  };
  file: {
    path: string;
    size: number;
    mimeType: string;
  };
}
```

**Example**:

```typescript
const metadata = await get_metadata({ 
  path: "D:\\document.pdf" 
});

console.log(`Title: ${metadata.info.Title}`);
console.log(`Pages: ${metadata.metadata.pageCount}`);
console.log(`Author: ${metadata.info.Author}`);
```

---

### 1.3 search_pdf

Search for keywords in PDF.

**Syntax**:
```typescript
search_pdf(params: SearchParams): Promise<SearchResult[]>
```

**Parameters**:

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `path` | `string` | Yes | Absolute path to PDF file |
| `query` | `string` | Yes | Search keyword/phrase |
| `caseSensitive` | `boolean` | No | Case sensitive search (default: false) |
| `maxResults` | `number` | No | Max results to return (default: 10) |

**Return Value**:

```typescript
{
  page: number;       // Page number
  matches: number;    // Matches on this page
  context: string;    // Text context around match
  position: {
    start: number;    // Start position
    end: number;      // End position
  };
}[]
```

**Example**:

```typescript
const results = await search_pdf({
  path: "D:\\contract.pdf",
  query: "important clause",
  caseSensitive: false,
  maxResults: 20
});

results.forEach(result => {
  console.log(`Page ${result.page}: ${result.context}`);
});
```

---

### 1.4 extract_images

Extract images from PDF (Planned).

**Status**: 🚧 Not yet implemented

**Planned Syntax**:
```typescript
extract_images(params: ExtractImagesParams): Promise<ImageResult[]>
```

**Planned Parameters**:

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `path` | `string` | Yes | Absolute path to PDF file |
| `outputDir` | `string` | Yes | Output directory for images |
| `format` | `'png' \| 'jpg'` | No | Image format (default: 'png') |
| `pages` | `number[]` | No | Specific pages to extract from |

---

### 1.5 get_toc

Get table of contents from PDF (Planned).

**Status**: 🚧 Not yet implemented

**Planned Syntax**:
```typescript
get_toc(params: GetTOCParams): Promise<TOCEntry[]>
```

---

## 2. Core API

### 2.1 PDFParser Class

Main parser class for programmatic use.

**Constructor**:

```typescript
constructor(options?: ParserOptions)
```

**Options**:

```typescript
interface ParserOptions {
  cache?: {
    enabled?: boolean;
    maxSize?: number;
    ttl?: number;
    directory?: string;
  };
  security?: {
    maxFileSize?: number;
    allowedPaths?: string[];
  };
  performance?: {
    concurrency?: number;
    timeout?: number;
  };
}
```

**Example**:

```typescript
import { PDFParser } from '@parseflow/core';

const parser = new PDFParser({
  cache: {
    enabled: true,
    maxSize: 100,
    ttl: 3600000 // 1 hour
  },
  security: {
    maxFileSize: 52428800, // 50MB
    allowedPaths: ['D:\\Documents', 'D:\\Projects']
  }
});
```

### 2.2 Methods

#### extractText()

```typescript
async extractText(
  path: string,
  options?: {
    page?: number;
    range?: string;
    strategy?: 'raw' | 'formatted' | 'clean';
  }
): Promise<string>
```

#### extractPage()

```typescript
async extractPage(
  path: string,
  pageNumber: number
): Promise<string>
```

#### extractRange()

```typescript
async extractRange(
  path: string,
  startPage: number,
  endPage: number
): Promise<string>
```

#### getMetadata()

```typescript
async getMetadata(path: string): Promise<PDFMetadata>
```

#### search()

```typescript
async search(
  path: string,
  query: string,
  options?: {
    caseSensitive?: boolean;
    maxResults?: number;
  }
): Promise<SearchResult[]>
```

**Complete Example**:

```typescript
import { PDFParser } from '@parseflow/core';

async function processPDF() {
  const parser = new PDFParser();
  
  // Get metadata
  const metadata = await parser.getMetadata('document.pdf');
  console.log(`Pages: ${metadata.pageCount}`);
  
  // Extract text
  const text = await parser.extractText('document.pdf');
  console.log(text);
  
  // Search
  const results = await parser.search('document.pdf', 'keyword');
  console.log(`Found ${results.length} results`);
  
  // Extract specific page
  const page1 = await parser.extractPage('document.pdf', 1);
  console.log(page1);
}
```

---

## 3. Configuration

### 3.1 Environment Variables

| Variable | Type | Default | Description |
|----------|------|---------|-------------|
| `PARSEFLOW_CACHE_DIR` | `string` | `.cache` | Cache directory |
| `PARSEFLOW_CACHE_ENABLED` | `boolean` | `true` | Enable caching |
| `PARSEFLOW_CACHE_MAX_SIZE` | `number` | `50` | Max cached items |
| `PARSEFLOW_CACHE_TTL` | `number` | `3600000` | Cache TTL (ms) |
| `PARSEFLOW_MAX_FILE_SIZE` | `number` | `52428800` | Max file size (bytes) |
| `PARSEFLOW_ALLOWED_PATHS` | `string` | `""` | Allowed paths (semicolon-separated) |
| `LOG_LEVEL` | `string` | `info` | Log level (error/warn/info/debug) |
| `PARSEFLOW_LOG_FILE` | `string` | `""` | Log file path |
| `PARSEFLOW_ERROR_LOG_FILE` | `string` | `""` | Error log file path |

**Example `.env`**:

```env
PARSEFLOW_CACHE_DIR=./cache
PARSEFLOW_CACHE_MAX_SIZE=100
PARSEFLOW_MAX_FILE_SIZE=104857600
PARSEFLOW_ALLOWED_PATHS=D:\Documents;D:\Projects
LOG_LEVEL=debug
PARSEFLOW_LOG_FILE=./logs/parseflow.log
```

### 3.2 MCP Server Configuration

**Windsurf** (`mcp_config.json`):

```json
{
  "mcpServers": {
    "parseflow": {
      "command": "node",
      "args": ["D:\\ParseFlow\\packages\\mcp-server\\dist\\index.js"],
      "env": {
        "PARSEFLOW_CACHE_DIR": "D:\\ParseFlow\\.cache",
        "PARSEFLOW_MAX_FILE_SIZE": "52428800",
        "PARSEFLOW_ALLOWED_PATHS": "D:\\;C:\\Users",
        "LOG_LEVEL": "info"
      }
    }
  }
}
```

**Cursor** (`.cursor/mcp.json`):

```json
{
  "mcpServers": {
    "parseflow": {
      "command": "node",
      "args": ["D:\\ParseFlow\\packages\\mcp-server\\dist\\index.js"],
      "env": {
        "PARSEFLOW_CACHE_DIR": "D:\\ParseFlow\\.cache",
        "PARSEFLOW_MAX_FILE_SIZE": "52428800",
        "PARSEFLOW_ALLOWED_PATHS": "D:\\;C:\\Users",
        "LOG_LEVEL": "info"
      }
    }
  }
}
```

---

## 4. Type Definitions

### 4.1 Core Types

```typescript
// PDF Metadata
interface PDFMetadata {
  info: PDFInfo;
  metadata: PDFDocumentMetadata;
  file: FileInfo;
}

interface PDFInfo {
  Title?: string;
  Author?: string;
  Subject?: string;
  Keywords?: string;
  Creator?: string;
  Producer?: string;
  CreationDate?: Date;
  ModDate?: Date;
}

interface PDFDocumentMetadata {
  pageCount: number;
  pdfVersion: string;
  isEncrypted: boolean;
  hasAcroForm: boolean;
}

interface FileInfo {
  path: string;
  size: number;
  mimeType: string;
}

// Search Result
interface SearchResult {
  page: number;
  matches: number;
  context: string;
  position: {
    start: number;
    end: number;
  };
}

// Extraction Options
interface ExtractOptions {
  page?: number;
  range?: string;
  strategy?: 'raw' | 'formatted' | 'clean';
}

// Parser Options
interface ParserOptions {
  cache?: CacheOptions;
  security?: SecurityOptions;
  performance?: PerformanceOptions;
}

interface CacheOptions {
  enabled?: boolean;
  maxSize?: number;
  ttl?: number;
  directory?: string;
}

interface SecurityOptions {
  maxFileSize?: number;
  allowedPaths?: string[];
}

interface PerformanceOptions {
  concurrency?: number;
  timeout?: number;
}
```

---

## 5. Error Handling

### 5.1 Error Types

```typescript
class ParseFlowError extends Error {
  code: string;
  statusCode: number;
}

class FileNotFoundError extends ParseFlowError {
  code = 'FILE_NOT_FOUND';
  statusCode = 404;
}

class InvalidPDFError extends ParseFlowError {
  code = 'INVALID_PDF';
  statusCode = 400;
}

class PermissionError extends ParseFlowError {
  code = 'PERMISSION_DENIED';
  statusCode = 403;
}

class FileSizeExceededError extends ParseFlowError {
  code = 'FILE_SIZE_EXCEEDED';
  statusCode = 413;
}

class PathTraversalError extends ParseFlowError {
  code = 'PATH_TRAVERSAL';
  statusCode = 403;
}
```

### 5.2 Error Handling Example

```typescript
import { PDFParser, FileNotFoundError, InvalidPDFError } from '@parseflow/core';

async function safeParse(path: string) {
  const parser = new PDFParser();
  
  try {
    return await parser.extractText(path);
  } catch (error) {
    if (error instanceof FileNotFoundError) {
      console.error('File not found:', path);
    } else if (error instanceof InvalidPDFError) {
      console.error('Invalid PDF file:', path);
    } else {
      console.error('Unknown error:', error);
    }
    throw error;
  }
}
```

---

## 6. Advanced Usage

### 6.1 Batch Processing

```typescript
import { PDFParser } from '@parseflow/core';
import { readdir } from 'fs/promises';
import { join } from 'path';

async function batchProcess(directory: string) {
  const parser = new PDFParser();
  const files = await readdir(directory);
  const pdfFiles = files.filter(f => f.endsWith('.pdf'));
  
  const results = [];
  
  for (const file of pdfFiles) {
    try {
      const path = join(directory, file);
      const text = await parser.extractText(path);
      const metadata = await parser.getMetadata(path);
      
      results.push({
        file,
        textLength: text.length,
        pageCount: metadata.metadata.pageCount,
        success: true
      });
    } catch (error) {
      results.push({
        file,
        error: error.message,
        success: false
      });
    }
  }
  
  return results;
}
```

### 6.2 Stream Processing

```typescript
import { PDFParser } from '@parseflow/core';
import { createWriteStream } from 'fs';

async function streamExtract(pdfPath: string, outputPath: string) {
  const parser = new PDFParser();
  const writeStream = createWriteStream(outputPath);
  
  const metadata = await parser.getMetadata(pdfPath);
  const totalPages = metadata.metadata.pageCount;
  
  for (let page = 1; page <= totalPages; page++) {
    const text = await parser.extractPage(pdfPath, page);
    writeStream.write(`\n\n--- Page ${page} ---\n\n${text}`);
  }
  
  writeStream.end();
}
```

### 6.3 Custom Cache Implementation

```typescript
import { PDFParser, CacheManager } from '@parseflow/core';

class RedisCache implements CacheManager {
  private redis: RedisClient;
  
  async get(key: string): Promise<any> {
    const value = await this.redis.get(key);
    return value ? JSON.parse(value) : null;
  }
  
  async set(key: string, value: any, ttl?: number): Promise<void> {
    const serialized = JSON.stringify(value);
    if (ttl) {
      await this.redis.setex(key, ttl, serialized);
    } else {
      await this.redis.set(key, serialized);
    }
  }
  
  async delete(key: string): Promise<void> {
    await this.redis.del(key);
  }
}

const parser = new PDFParser({
  cache: new RedisCache()
});
```

---

## 7. Performance Tips

### 7.1 Optimize Cache Usage

```typescript
// Good: Enable cache for repeated access
const parser = new PDFParser({
  cache: { enabled: true, maxSize: 100 }
});

// Process same file multiple times
for (let i = 0; i < 10; i++) {
  await parser.extractText('large-document.pdf'); // Cached after first call
}
```

### 7.2 Extract Only What You Need

```typescript
// ❌ Bad: Extract all, use only page 1
const allText = await parser.extractText('huge.pdf');
const page1 = allText.split('\n\n')[0];

// ✅ Good: Extract only page 1
const page1 = await parser.extractPage('huge.pdf', 1);
```

### 7.3 Parallel Processing

```typescript
import { PDFParser } from '@parseflow/core';

async function parallelProcess(files: string[]) {
  const parser = new PDFParser();
  
  // Process in parallel (be mindful of memory)
  const results = await Promise.all(
    files.map(file => parser.extractText(file))
  );
  
  return results;
}
```

---

## 8. References

### Related Documentation
- [Architecture](architecture.md) - System architecture
- [Development Guide](development.md) - Development setup
- [Examples](../guides/examples.md) - Usage examples

### External Resources
- [MCP Protocol](https://modelcontextprotocol.io) - MCP specification
- [pdf-parse](https://www.npmjs.com/package/pdf-parse) - PDF parsing library

---

**Last Updated**: 2025-11-26  
**API Version**: 1.0.0  
**Status**: Production
