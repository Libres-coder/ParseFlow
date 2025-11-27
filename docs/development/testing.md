# 🧪 测试指南

本文档说明 ParseFlow 项目的测试策略、运行方法和注意事项。

---

## 📊 测试概述

### 当前状态

```
总测试数:     22 tests
单元测试:     14 tests (必须通过)
集成测试:     8 tests  (可选，需要 PDF)
覆盖率:       94.56% statements
```

### 测试框架

- **Jest** - 测试框架
- **ts-jest** - TypeScript 支持
- **@types/jest** - 类型定义

---

## 🚀 快速开始

```bash
# 运行所有测试
pnpm test

# 查看覆盖率
pnpm test:coverage
```

---

## 📄 集成测试 PDF 说明

### ⚠️ 重要提示

**集成测试需要测试 PDF 文件，但这是可选的！**

- ✅ **有 PDF**: 运行全部 22 个测试（14 单元 + 8 集成）
- ✅ **无 PDF**: 运行 14 个单元测试，跳过 8 个集成测试
- ✅ **CI 通过**: 两种情况都会通过，不影响 CI

### 测试 PDF 位置

```
tests/fixtures/test.pdf
```

### 如何添加测试 PDF？

#### 方法 1: 复制任意 PDF（推荐）

```bash
# Windows
copy "D:\your-document.pdf" "tests\fixtures\test.pdf"

# Linux/Mac
cp /path/to/your.pdf tests/fixtures/test.pdf
```

#### 方法 2: 创建简单测试 PDF

1. 在 Word 中创建简单文档
2. 另存为 PDF
3. 复制到 `tests/fixtures/test.pdf`

**建议内容**:
```
标题：Test Document
内容：
  第 1 页：Hello World
  第 2 页：This is a test
```

### 测试行为对比

#### 🔹 有 PDF 时

```bash
$ pnpm test

✅ Test Suites: 3 passed, 3 total
✅ Tests:       22 passed, 22 total

单元测试: 14 passing
集成测试: 8 passing  ← PDF 存在，运行集成测试
```

#### 🔹 无 PDF 时

```bash
$ pnpm test

⚠️  Integration tests skipped: test.pdf not found
   Expected location: /path/to/tests/fixtures/test.pdf
   Place a test PDF at tests/fixtures/test.pdf to run these tests

✅ Test Suites: 1 skipped, 2 passed, 2 of 3 total
✅ Tests:       8 skipped, 14 passed, 22 total

单元测试: 14 passing  ← 仍然通过
集成测试: 8 skipped   ← 自动跳过，不影响结果
```

**关键点**:
- ✅ 退出码仍是 0（成功）
- ✅ CI 不会失败
- ✅ 只是跳过集成测试

### 为什么不提交测试 PDF？

1. **体积** - PDF 是二进制文件，会增大仓库
2. **隐私** - 避免意外提交敏感内容
3. **灵活** - 开发者可用自己的测试文件
4. **CI 优化** - 无需下载大文件

### 技术实现

```typescript
// 检查 PDF 是否存在
const hasPdf = existsSync(testPdfPath);

// 条件跳过
const describeIntegration = hasPdf ? describe : describe.skip;

if (!hasPdf) {
  console.warn('⚠️  Integration tests skipped');
}

describeIntegration('Integration Tests', () => {
  // 只在 PDF 存在时运行
});
```

---

## 🏃 运行测试

### 本地开发

```bash
# 所有测试
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

```bash
pnpm test          # 单元测试通过，集成测试跳过
pnpm test:coverage # 生成覆盖率报告
```

---

## ✍️ 编写测试

### 单元测试示例

```typescript
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { PDFParser } from '../parser';

describe('PDFParser', () => {
  let parser: PDFParser;

  beforeEach(() => {
    parser = new PDFParser();
  });

  it('should create instance', () => {
    expect(parser).toBeDefined();
  });

  it('should validate page number', async () => {
    await expect(parser.extractPage('test.pdf', 0))
      .rejects.toThrow('Page number must be >= 1');
  });
});
```

### 集成测试示例

```typescript
import { existsSync } from 'fs';

const testPdfPath = join(__dirname, '../../../../tests/fixtures/test.pdf');
const hasPdf = existsSync(testPdfPath);
const describeIntegration = hasPdf ? describe : describe.skip;

if (!hasPdf) {
  console.warn('⚠️  Integration tests skipped: test.pdf not found');
}

describeIntegration('Integration Tests', () => {
  it('should extract text', async () => {
    const result = await parser.extractText(testPdfPath);
    expect(result.length).toBeGreaterThan(0);
  });
});
```

---

## 📊 覆盖率

### 当前覆盖率

```
File                  | % Stmts | % Branch | % Funcs | % Lines
----------------------|---------|----------|---------|--------
All files             |   94.56 |    80.32 |     100 |   94.38
 parser.ts            |   94.33 |    86.11 |     100 |   94.11
 text-extractor.ts    |   85.71 |    66.66 |     100 |   85.71
 keyword-search.ts    |     100 |    84.61 |     100 |     100
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

---

## 🔄 CI/CD

### CI 测试行为

1. **安装**: `pnpm install`
2. **构建**: `pnpm build`
3. **测试**: `pnpm test`
   - ✅ 单元测试: 14 passing
   - ⏭️ 集成测试: 8 skipped
4. **覆盖率**: `pnpm test:coverage`

### CI 成功标准

```
✅ 所有单元测试通过
✅ 覆盖率满足阈值
✅ 退出码 0
⏭️ 集成测试自动跳过
```

---

## 🔧 故障排除

### 问题: 测试失败 "test.pdf not found"

**如果看到**:
```
❌ 8 tests failed
ENOENT: no such file or directory
```

**解决方案**:
1. 添加 PDF: `cp your.pdf tests/fixtures/test.pdf`
2. 或只运行单元测试: `pnpm test -- --testPathIgnorePatterns=integration`

### 问题: Jest globals any 类型错误

**解决**: 在测试文件顶部添加:
```typescript
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
```

---

## 📚 相关资源

- [Jest 文档](https://jestjs.io/)
- [ts-jest 文档](https://kulshekhar.github.io/ts-jest/)
- [项目架构](./architecture.md)

---

<div align="center">

**Happy Testing!** 🧪

</div>
