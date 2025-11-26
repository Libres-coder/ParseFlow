# ParseFlow Development Guide

[中文](../../development/development.md) | **English**

## 📋 Table of Contents

- [1. Development Environment Setup](#1-development-environment-setup)
- [2. Project Structure](#2-project-structure)
- [3. Development Workflow](#3-development-workflow)
- [4. Testing Guide](#4-testing-guide)
- [5. Debugging Tips](#5-debugging-tips)
- [6. Contribution Guidelines](#6-contribution-guidelines)

---

## 1. Development Environment Setup

### 1.1 Prerequisites

- **Node.js**: >= 18.0.0
- **npm**: >= 9.0.0 or **pnpm**: >= 8.0.0 (recommended)
- **Git**: >= 2.30.0
- **Editor**: VSCode, WebStorm, or Windsurf (recommended)

### 1.2 Clone Project

```bash
git clone https://github.com/Libres-coder/ParseFlow.git
cd ParseFlow
```

### 1.3 Install Dependencies

```bash
# Using pnpm (recommended)
pnpm install

# Or using npm
npm install
```

### 1.4 Build Project

```bash
pnpm build
```

---

## 2. Project Structure

```
ParseFlow/
├── packages/
│   ├── mcp-server/              # MCP Server package
│   │   ├── src/
│   │   │   ├── index.ts         # Entry point
│   │   │   ├── server.ts        # MCP Server core
│   │   │   ├── tools/           # Tool handlers
│   │   │   ├── resources/       # Resource handlers
│   │   │   └── utils/           # Utilities
│   │   └── tests/
│   │
│   └── pdf-parser-core/         # PDF parsing core
│       ├── src/
│       │   ├── parser.ts        # Main parser
│       │   ├── extractors/      # Text/image extractors
│       │   ├── search/          # Search engine
│       │   └── cache/           # Cache management
│       └── tests/
│
├── docs/                        # Documentation
├── examples/                    # Example code
├── tests/                       # Integration tests
└── scripts/                     # Build scripts
```

---

## 3. Development Workflow

### 3.1 Development Mode

```bash
# Watch mode
pnpm dev

# Run specific package
pnpm --filter @parseflow/mcp-server dev
```

### 3.2 Build

```bash
# Build all packages
pnpm build

# Build specific package
pnpm --filter @parseflow/pdf-parser-core build
```

### 3.3 Testing

```bash
# Run all tests
pnpm test

# Run with coverage
pnpm test:coverage

# Run specific test file
pnpm test path/to/test.ts
```

---

## 4. Testing Guide

### 4.1 Unit Tests

Located in `packages/*/tests/unit/`

```typescript
import { PDFParser } from '../src/parser';

describe('PDFParser', () => {
  it('should extract text from PDF', async () => {
    const parser = new PDFParser();
    const text = await parser.extractText('test.pdf');
    expect(text).toBeDefined();
  });
});
```

### 4.2 Integration Tests

Located in `tests/integration/`

```typescript
describe('MCP Server Integration', () => {
  it('should handle extract_text request', async () => {
    const response = await mcpClient.request('extract_text', {
      path: 'test.pdf'
    });
    expect(response.success).toBe(true);
  });
});
```

### 4.3 Test Coverage

Target: > 80%

```bash
pnpm test:coverage
```

View report: `coverage/lcov-report/index.html`

---

## 5. Debugging Tips

### 5.1 Debug MCP Server

```bash
# With inspector
node --inspect packages/mcp-server/dist/index.js

# With MCP Inspector
npx @modelcontextprotocol/inspector node packages/mcp-server/dist/index.js
```

### 5.2 VS Code Debugging

Use `.vscode/launch.json` configuration:

```json
{
  "type": "node",
  "request": "launch",
  "name": "Debug MCP Server",
  "program": "${workspaceFolder}/packages/mcp-server/src/index.ts",
  "outFiles": ["${workspaceFolder}/dist/**/*.js"]
}
```

### 5.3 Logging

```typescript
import { logger } from './utils/logger';

logger.debug('Debug message');
logger.info('Info message');
logger.warn('Warning message');
logger.error('Error message');
```

---

## 6. Contribution Guidelines

### 6.1 Code Style

- **TypeScript**: Strict mode enabled
- **Linting**: ESLint + Prettier
- **Naming**: camelCase for variables, PascalCase for classes

```bash
# Lint code
pnpm lint

# Fix linting issues
pnpm lint:fix

# Format code
pnpm format
```

### 6.2 Commit Messages

Follow [Conventional Commits](https://www.conventionalcommits.org/):

```
feat: add OCR support
fix: resolve memory leak in parser
docs: update API documentation
test: add unit tests for search
chore: update dependencies
```

### 6.3 Pull Request Process

1. **Fork & Clone**
   ```bash
   git clone https://github.com/your-username/ParseFlow.git
   ```

2. **Create Branch**
   ```bash
   git checkout -b feature/your-feature
   ```

3. **Make Changes**
   - Write code
   - Add tests
   - Update documentation

4. **Test**
   ```bash
   pnpm test
   pnpm lint
   ```

5. **Commit**
   ```bash
   git add .
   git commit -m "feat: your feature description"
   ```

6. **Push & Create PR**
   ```bash
   git push origin feature/your-feature
   ```

### 6.4 Code Review Checklist

- [ ] Code follows project style
- [ ] Tests added and passing
- [ ] Documentation updated
- [ ] No breaking changes (or documented)
- [ ] Performance considered
- [ ] Security reviewed

---

## 7. Release Process

### 7.1 Version Bump

```bash
# Bump version
npm version patch|minor|major

# Update CHANGELOG.md
```

### 7.2 Build & Test

```bash
pnpm clean
pnpm install
pnpm build
pnpm test
```

### 7.3 Publish

```bash
# Publish to npm
pnpm publish
```

---

## 8. Troubleshooting

### 8.1 Build Errors

```bash
# Clean and rebuild
pnpm clean
pnpm install
pnpm build
```

### 8.2 Test Failures

```bash
# Clear test cache
pnpm test --clearCache

# Run single test
pnpm test --testNamePattern="your test name"
```

### 8.3 Dependency Issues

```bash
# Remove node_modules and reinstall
rm -rf node_modules pnpm-lock.yaml
pnpm install
```

---

## 9. Resources

### Documentation
- [Architecture](architecture.md) - System architecture
- [API Reference](api.md) - Complete API docs
- [Contributing](../../CONTRIBUTING.md) - Contribution guidelines

### Tools
- [MCP Inspector](https://github.com/modelcontextprotocol/inspector) - MCP debugging
- [TypeDoc](https://typedoc.org/) - API documentation generator
- [Jest](https://jestjs.io/) - Testing framework

### Community
- [GitHub Issues](https://github.com/Libres-coder/ParseFlow/issues)
- [GitHub Discussions](https://github.com/Libres-coder/ParseFlow/discussions)

---

**Last Updated**: 2025-11-26  
**Status**: Active Development
