# 🧪 测试指南

本文档说明 ParseFlow 项目的测试策略、运行方法和注意事项。

---

## 📋 目录

- [测试概述](#测试概述)
- [快速开始](#快速开始)
- [测试类型](#测试类型)
- [集成测试 PDF 说明](#集成测试-pdf-说明)
- [运行测试](#运行测试)
- [编写测试](#编写测试)
- [覆盖率](#覆盖率)
- [CI/CD](#cicd)

---

## 📊 测试概述

### 当前状态

```
总测试数:     22 tests
单元测试:     14 tests (必须通过)
集成测试:     8 tests  (可选，需要 PDF)
覆盖率:       94.56% statements
             80.32% branches
             100% functions
```

### 测试框架

- **Jest** - 测试框架
- **ts-jest** - TypeScript 支持
- **@types/jest** - 类型定义

---

## 🚀 快速开始

### 运行所有测试

```bash
pnpm test
```

### 运行测试并查看覆盖率

```bash
pnpm test:coverage
```

### 监视模式（开发时）

```bash
pnpm test:watch
```

---

## 🎯 测试类型

### 1. 单元测试

**位置**: `packages/*/src/__tests__/*.test.ts`

**特点**:
- ✅ 无需外部依赖
- ✅ 快速执行
- ✅ 在 CI 中必须通过

**示例**:
```typescript
// packages/pdf-parser-core/src/__tests__/parser.test.ts
describe('PDFParser', () => {
  it('should create a parser instance', () => {
    const parser = new PDFParser();
    expect(parser).toBeDefined();
  });
});
```

### 2. 集成测试

**位置**: `packages/*/src/__tests__/*.integration.test.ts`

**特点**:
- ⚠️ 需要真实 PDF 文件
- ⚠️ 在 CI 中会自动跳过
- ✅ 开发时可选运行

**示例**:
```typescript
// packages/pdf-parser-core/src/__tests__/parser.integration.test.ts
describeIntegration('PDFParser Integration Tests', () => {
  it('should extract text from real PDF', async () => {
    const result = await parser.extractText(testPdfPath);
    expect(result).toBeDefined();
  });
});
```

---

## 📄 集成测试 PDF 说明

### ⚠️ 重要提示

集成测试需要测试 PDF 文件才能运行。这是**可选的**，不会影响 CI 通过。

### 为什么需要测试 PDF？

集成测试验证 PDF 解析的真实功能：
- 文本提取是否正确
- 元数据读取是否准确
- 搜索功能是否有效
- 分页提取是否正常

### 测试 PDF 位置

```
tests/fixtures/test.pdf
```

### 如何添加测试 PDF？

#### 方法 1: 使用你自己的 PDF（推荐）

```bash
# 将任意 PDF 文件复制到测试目录
cp /path/to/your/test.pdf tests/fixtures/test.pdf
```

**优点**:
- ✅ 使用真实场景的 PDF
- ✅ 测试你关心的内容
- ✅ 不需要额外下载

#### 方法 2: 创建简单测试 PDF

如果没有现成的 PDF，可以：
1. 在 Word 中创建简单文档
2. 另存为 PDF
3. 复制到 `tests/fixtures/test.pdf`

**内容建议**:
```
标题：Test Document
作者：Test Author
内容：
  第 1 页：Hello World
  第 2 页：This is a test
  第 3 页：The quick brown fox
```

### 测试行为说明

#### 🔹 有 PDF 时

```bash
$ pnpm test

✅ Test Suites: 3 passed, 3 total
✅ Tests:       22 passed, 22 total

单元测试: 14 passing
集成测试: 8 passing ← PDF 存在，运行集成测试
```

#### 🔹 无 PDF 时

```bash
$ pnpm test

⚠️  Integration tests skipped: test.pdf not found
   Expected location: tests/fixtures/test.pdf
   Place a test PDF at tests/fixtures/test.pdf to run these tests

✅ Test Suites: 1 skipped, 2 passed, 2 of 3 total
✅ Tests:       8 skipped, 14 passed, 22 total

单元测试: 14 passing ← 仍然通过
集成测试: 8 skipped  ← PDF 不存在，自动跳过
```

**关键点**:
- ✅ 退出码仍然是 0（成功）
- ✅ CI 不会失败
- ✅ 只是跳过集成测试

### 为什么不提交测试 PDF？

1. **体积原因** - PDF 是二进制文件，会增大仓库大小
2. **隐私考虑** - 避免意外提交敏感内容
3. **灵活性** - 开发者可以使用自己的测试文件
4. **CI 优化** - 不需要下载大文件

### 技术实现

集成测试使用条件跳过机制：

```typescript
// 检查 PDF 是否存在
const hasPdf = existsSync(testPdfPath);

// 条件跳过整个测试套件
const describeIntegration = hasPdf ? describe : describe.skip;

if (!hasPdf) {
  console.warn('⚠️  Integration tests skipped: test.pdf not found');
}

describeIntegration('PDFParser Integration Tests', () => {
  // 只有 PDF 存在时才运行这些测试
});
```

---

## 🏃 运行测试

### 本地开发

```bash
# 运行所有测试（单元 + 集成）
pnpm test

# 只运行单元测试
pnpm test -- --testPathIgnorePatterns=integration

# 只运行集成测试（需要 PDF）
pnpm test -- --testPathPattern=integration

# 监视模式
pnpm test:watch

# 查看覆盖率
pnpm test:coverage
```

### CI 环境

CI 会自动运行：
```bash
pnpm test        # 单元测试通过，集成测试跳过
pnpm test:coverage  # 生成覆盖率报告
```

**CI 行为**:
- ✅ 单元测试必须全部通过
- ⏭️ 集成测试自动跳过（无 PDF）
- ✅ 覆盖率基于单元测试
- ✅ 退出码 0 = CI 通过

---

## ✍️ 编写测试

### 单元测试示例

```typescript
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { PDFParser } from '../parser';

describe('PDFParser', () => {
  let parser: PDFParser;

  beforeEach(() => {
    parser = new PDFParser();
  });

  describe('constructor', () => {
    it('should create instance with default config', () => {
      expect(parser).toBeDefined();
      expect(parser).toBeInstanceOf(PDFParser);
    });
  });

  describe('validation', () => {
    it('should throw error for invalid page number', async () => {
      await expect(parser.extractPage('test.pdf', 0))
        .rejects.toThrow('Page number must be >= 1');
    });
  });
});
```

### 集成测试示例

```typescript
import { PDFParser } from '../parser';
import { join } from 'path';
import { existsSync } from 'fs';

const testPdfPath = join(__dirname, '../../../../tests/fixtures/test.pdf');
const hasPdf = existsSync(testPdfPath);

// 条件测试套件
const describeIntegration = hasPdf ? describe : describe.skip;

if (!hasPdf) {
  console.warn('⚠️  Integration tests skipped: test.pdf not found');
}

describeIntegration('PDFParser Integration Tests', () => {
  let parser: PDFParser;

  beforeEach(() => {
    parser = new PDFParser();
  });

  describe('extractText', () => {
    it('should extract text from real PDF', async () => {
      const result = await parser.extractText(testPdfPath);
      
      expect(result).toBeDefined();
      expect(typeof result).toBe('string');
      expect(result.length).toBeGreaterThan(0);
    });
  });
});
```

### 测试最佳实践

1. **测试命名**
   ```typescript
   // ✅ 好的命名
   it('should throw error for invalid page number', ...)
   
   // ❌ 不好的命名
   it('test 1', ...)
   ```

2. **ESLint 禁用**
   ```typescript
   // Jest 全局函数需要禁用这些规则
   /* eslint-disable @typescript-eslint/no-unsafe-assignment */
   /* eslint-disable @typescript-eslint/no-unsafe-call */
   /* eslint-disable @typescript-eslint/no-unsafe-member-access */
   ```

3. **异步测试**
   ```typescript
   // ✅ 使用 async/await
   it('should extract text', async () => {
     await expect(parser.extractText('test.pdf'))
       .rejects.toThrow();
   });
   ```

---

## 📊 覆盖率

### 当前覆盖率

```
File                    | % Stmts | % Branch | % Funcs | % Lines
------------------------|---------|----------|---------|--------
All files               |   94.56 |    80.32 |     100 |   94.38
 src                    |   94.33 |    86.11 |     100 |   94.11
  parser.ts             |   94.33 |    86.11 |     100 |   94.11
 src/extractors         |   89.47 |    58.33 |     100 |   89.47
  metadata-extractor.ts |     100 |       50 |     100 |     100
  text-extractor.ts     |   85.71 |    66.66 |     100 |   85.71
 src/search             |     100 |    84.61 |     100 |     100
  keyword-search.ts     |     100 |    84.61 |     100 |     100
```

### 覆盖率阈值

```javascript
// jest.config.cjs
coverageThreshold: {
  global: {
    branches: 20,
    functions: 30,
    lines: 25,
    statements: 25,
  },
}
```

**说明**: 阈值设置较低是因为：
- 项目刚开始添加测试
- 覆盖率会逐步提高
- 当前实际覆盖率远超阈值

### 查看覆盖率报告

```bash
# 生成覆盖率报告
pnpm test:coverage

# 查看 HTML 报告
open coverage/lcov-report/index.html
```

---

## 🔄 CI/CD

### GitHub Actions 工作流

```yaml
# .github/workflows/ci.yml
test:
  runs-on: ubuntu-latest
  steps:
    - name: Run tests
      run: pnpm test
      
    - name: Run coverage
      run: pnpm test:coverage
```

### CI 测试行为

1. **安装依赖**: `pnpm install`
2. **构建项目**: `pnpm build`
3. **运行测试**: `pnpm test`
   - ✅ 单元测试: 14 passing
   - ⏭️ 集成测试: 8 skipped
4. **检查覆盖率**: `pnpm test:coverage`
   - ✅ 覆盖率满足阈值

### CI 成功标准

```
✅ 所有单元测试通过
✅ 覆盖率满足阈值（20-30%）
✅ 退出码 0
⏭️ 集成测试自动跳过（无 PDF）
```

---

## 🔧 故障排除

### 问题 1: 测试失败 "test.pdf not found"

**症状**:
```
❌ 8 tests failed
ENOENT: no such file or directory
```

**原因**: 运行了集成测试但没有 PDF 文件

**解决**:
1. 添加 PDF 到 `tests/fixtures/test.pdf`
2. 或者只运行单元测试:
   ```bash
   pnpm test -- --testPathIgnorePatterns=integration
   ```

### 问题 2: Jest globals any 类型错误

**症状**:
```
❌ Unsafe call of any typed value
```

**解决**: 在测试文件顶部添加:
```typescript
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
```

### 问题 3: 覆盖率不满足阈值

**症状**:
```
❌ Jest: "global" coverage threshold not met
```

**解决**:
1. 添加更多测试
2. 或临时降低阈值（不推荐）

---

## 📚 相关资源

- [Jest 文档](https://jestjs.io/)
- [ts-jest 文档](https://kulshekhar.github.io/ts-jest/)
- [测试最佳实践](https://testingjavascript.com/)

---

## 🎯 下一步

1. **扩展测试覆盖**: 添加更多单元测试
2. **集成测试**: 使用自己的 PDF 运行集成测试
3. **E2E 测试**: 添加端到端测试（计划中）

---

<div align="center">

**Happy Testing!** 🧪

如有问题，请查看 [FAQ](../guides/faq.md) 或提交 [Issue](https://github.com/Libres-coder/ParseFlow/issues)

</div>
