# Naming Conventions

**English** (Original)

> **Note**: This document does not exist in Chinese version. It's created based on the project's existing code style.

---

## 📋 Overview

This document outlines the naming conventions used in the ParseFlow project to maintain consistency and readability.

---

## 1. TypeScript/JavaScript

### 1.1 Variables & Functions

**Style**: `camelCase`

```typescript
// Variables
const pdfParser = new PDFParser();
const maxFileSize = 52428800;
const isValid = true;

// Functions
function extractText(path: string): Promise<string> { }
async function getMetadata(path: string): Promise<Metadata> { }
```

### 1.2 Classes & Interfaces

**Style**: `PascalCase`

```typescript
// Classes
class PDFParser { }
class CacheManager { }
class SearchEngine { }

// Interfaces
interface ParserOptions { }
interface SearchResult { }
interface PDFMetadata { }
```

### 1.3 Constants

**Style**: `UPPER_SNAKE_CASE`

```typescript
const MAX_FILE_SIZE = 52428800;
const DEFAULT_CACHE_TTL = 3600000;
const SUPPORTED_VERSIONS = ['1.0', '1.1'];
```

### 1.4 Private Members

**Prefix**: `_` (underscore)

```typescript
class PDFParser {
  private _cache: CacheManager;
  private _config: ParserConfig;
  
  private _validatePath(path: string): boolean { }
}
```

### 1.5 Type Parameters

**Style**: Single uppercase letter or `T` prefix

```typescript
// Generic types
function identity<T>(arg: T): T { }
class Container<TValue> { }

// Multiple type parameters
function merge<T, U>(obj1: T, obj2: U): T & U { }
```

---

## 2. Files & Directories

### 2.1 Source Files

**Style**: `kebab-case`

```
packages/
├── mcp-server/
│   ├── src/
│   │   ├── index.ts
│   │   ├── server.ts
│   │   ├── extract-text.ts
│   │   ├── search-pdf.ts
│   │   └── get-metadata.ts
```

### 2.2 Test Files

**Suffix**: `.test.ts` or `.spec.ts`

```
tests/
├── parser.test.ts
├── cache.test.ts
└── search.spec.ts
```

### 2.3 Type Definition Files

**Suffix**: `.d.ts` or `types.ts`

```
src/
├── types/
│   ├── index.ts
│   ├── parser.types.ts
│   └── mcp.types.ts
```

### 2.4 Configuration Files

**Style**: Lowercase with appropriate extension

```
.env
.env.example
tsconfig.json
package.json
.eslintrc.js
```

---

## 3. Documentation

### 3.1 Markdown Files

**Style**: `UPPER_SNAKE_CASE` for root-level, `kebab-case` for others

```
Root level:
README.md
CONTRIBUTING.md
LICENSE
CHANGELOG.md

Documentation:
docs/
├── guides/
│   ├── quick-start.md
│   ├── faq.md
│   └── examples.md
├── development/
│   ├── api.md
│   ├── architecture.md
│   └── development.md
```

---

## 4. Git Conventions

### 4.1 Branch Names

**Style**: `type/description-in-kebab-case`

```bash
feature/add-ocr-support
fix/memory-leak-parser
docs/update-api-reference
chore/upgrade-dependencies
```

### 4.2 Commit Messages

**Format**: [Conventional Commits](https://www.conventionalcommits.org/)

```
<type>(<scope>): <subject>

<body>

<footer>
```

**Types**:
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation
- `style`: Code style (formatting)
- `refactor`: Code refactoring
- `test`: Tests
- `chore`: Build process, dependencies

**Examples**:
```
feat(parser): add OCR support for scanned PDFs
fix(cache): resolve memory leak in cache manager
docs(api): update extract_text documentation
test(search): add unit tests for search engine
```

---

## 5. MCP Tools & Resources

### 5.1 Tool Names

**Style**: `snake_case`

```typescript
// MCP Tools
extract_text
get_metadata
search_pdf
extract_images
get_toc
```

### 5.2 Resource URIs

**Format**: `scheme://path`

```typescript
// Resource URIs
pdf://local/path/to/document.pdf
pdf://cache/abc123
```

---

## 6. Environment Variables

**Style**: `UPPER_SNAKE_CASE` with prefix

```env
# ParseFlow variables (PARSEFLOW_ prefix)
PARSEFLOW_CACHE_DIR=./cache
PARSEFLOW_MAX_FILE_SIZE=52428800
PARSEFLOW_ALLOWED_PATHS=D:\Documents

# Standard variables
NODE_ENV=development
LOG_LEVEL=debug
```

---

## 7. Package Names

### 7.1 npm Packages

**Style**: `@scope/kebab-case`

```json
{
  "name": "@parseflow/mcp-server",
  "name": "@parseflow/pdf-parser-core"
}
```

---

## 8. Error Names

**Style**: `PascalCase` with `Error` suffix

```typescript
class FileNotFoundError extends Error { }
class InvalidPDFError extends Error { }
class PermissionError extends Error { }
class FileSizeExceededError extends Error { }
```

---

## 9. Examples

### 9.1 Good Examples ✅

```typescript
// File: src/parsers/pdf-parser.ts
import { CacheManager } from '../cache/cache-manager';
import { TextExtractor } from '../extractors/text-extractor';

interface ParserOptions {
  cacheEnabled: boolean;
  maxFileSize: number;
}

class PDFParser {
  private _cache: CacheManager;
  private _textExtractor: TextExtractor;
  private readonly MAX_RETRIES = 3;
  
  constructor(options: ParserOptions) {
    this._cache = new CacheManager(options);
    this._textExtractor = new TextExtractor();
  }
  
  async extractText(filePath: string): Promise<string> {
    const cachedResult = await this._cache.get(filePath);
    if (cachedResult) return cachedResult;
    
    const text = await this._textExtractor.extract(filePath);
    await this._cache.set(filePath, text);
    
    return text;
  }
  
  private _validatePath(path: string): boolean {
    // Validation logic
    return true;
  }
}

export { PDFParser, ParserOptions };
```

### 9.2 Bad Examples ❌

```typescript
// ❌ Wrong: PascalCase for variables
const PDFParser = new parser();

// ❌ Wrong: snake_case for functions
function extract_pdf_text() { }

// ❌ Wrong: camelCase for classes
class pdfParser { }

// ❌ Wrong: lowercase for constants
const maxfilesize = 1000;

// ❌ Wrong: No underscore prefix for private
class Parser {
  private cache: Cache; // Should be _cache
}
```

---

## 10. Best Practices

1. **Be Consistent**: Follow conventions throughout the codebase
2. **Be Descriptive**: Use meaningful names that describe purpose
3. **Avoid Abbreviations**: Except for well-known ones (e.g., PDF, HTTP, URL)
4. **Use TypeScript**: Leverage type system for better naming
5. **Follow Standards**: Adhere to JavaScript/TypeScript community standards

---

## 11. Tools

### Linting

```bash
# Check code style
pnpm lint

# Fix automatically
pnpm lint:fix
```

### Formatting

```bash
# Format code
pnpm format

# Format specific files
pnpm format src/**/*.ts
```

---

## References

- [TypeScript Style Guide](https://google.github.io/styleguide/tsguide.html)
- [Conventional Commits](https://www.conventionalcommits.org/)
- [Semantic Versioning](https://semver.org/)

---

**Last Updated**: 2025-11-26  
**Status**: Active
