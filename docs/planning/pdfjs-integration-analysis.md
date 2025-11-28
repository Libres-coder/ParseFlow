# 🔍 pdfjs-dist 集成分析

**日期**: 2025-11-27  
**问题**: 图片提取和目录提取功能实现挑战

---

## 📋 背景

在实现 `extractImages()` 和 `getTOC()` 功能时，尝试集成 `pdfjs-dist` 库以提供完整的 PDF 处理能力。然而，遇到了 Node.js/Jest 环境兼容性问题。

---

## ❌ 遇到的问题

### 1. Jest/Node.js 兼容性

```
SyntaxError: Cannot use 'import.meta' outside a module

at pdfjs-dist/legacy/build/pdf.mjs:11414
    const require = process.getBuiltinModule("module").createRequire(import.meta.url);
                                                                    ^^^^
```

**原因**:
- `pdfjs-dist` 主要是**浏览器库**
- 使用 ES模块 和 `import.meta`
- Jest 默认运行在 CommonJS 环境
- Node.js 环境缺少浏览器 API（Canvas, DOM 等）

### 2. 依赖问题

`pdfjs-dist` 在 Node.js 中需要额外依赖：
- `canvas` - 渲染 PDF 页面
- `path2d` - Path2D polyfill
- Worker 线程支持

### 3. 配置复杂

需要大量配置来让 pdfjs-dist 在 Node.js 中工作：
- Jest 配置
- Worker 配置
- 全局 polyfills
- 模块转换规则

---

## 🎯 当前实现状态

### ✅ 已完成

**图片提取 (`ImageExtractor`)**:
```typescript
extract(): Promise<string[]> {
  return Promise.reject(new Error(
    'Image extraction is not yet implemented. ' +
    'This feature requires pdfjs-dist library.'
  ));
}
```
- ✅ 清晰的错误消息
- ✅ 实现指导
- ✅ 框架就位

**目录提取 (`TOCExtractor`)**:
```typescript
async extract(buffer: Buffer): Promise<TOCItem[]> {
  const data = await pdf(buffer); // 使用 pdf-parse
  // pdf-parse 不支持目录提取
  return [];
}
```
- ✅ 基础实现
- ✅ 错误处理
- ⚠️ 功能有限（pdf-parse 限制）

### ✅ 测试和质量

```
✅ 52 tests passing
✅ 0 lint errors
✅ Build successful
✅ CI/CD ready
```

---

## 💡 替代方案

### 方案 1: 使用 pdf-lib ⭐⭐⭐⭐⭐ (推荐)

**优点**:
- ✅ Node.js 原生支持
- ✅ 无浏览器依赖
- ✅ 活跃维护
- ✅ 功能丰富（创建、修改、合并 PDF）

**缺点**:
- ❌ 目录提取功能有限
- ❌ 不支持图片提取（需要额外处理）

**实现**:
```bash
pnpm add pdf-lib
```

```typescript
import { PDFDocument } from 'pdf-lib';

async extract(buffer: Buffer): Promise<TOCItem[]> {
  const pdfDoc = await PDFDocument.load(buffer);
  const outline = pdfDoc.getOutline();
  return this.parseOutline(outline);
}
```

### 方案 2: Hummus (muhammara) ⭐⭐⭐⭐

**优点**:
- ✅ C++ 性能
- ✅ 功能强大
- ✅ 图片提取支持

**缺点**:
- ❌ 需要原生编译
- ❌ 平台兼容性问题
- ❌ 维护不够活跃

### 方案 3: Apache PDFBox (Java) ⭐⭐⭐

**优点**:
- ✅ 功能最完整
- ✅ Apache 官方支持
- ✅ 图片和目录完整支持

**缺点**:
- ❌ 需要 Java 运行时
- ❌ Node.js 集成复杂
- ❌ 性能开销大

**实现**:
```typescript
// 通过 child_process 调用 Java
import { exec } from 'child_process';

async extractImages(pdfPath: string): Promise<string[]> {
  return new Promise((resolve, reject) => {
    exec(`java -jar pdfbox.jar ExtractImages ${pdfPath}`, 
      (error, stdout) => {
        if (error) reject(error);
        resolve(parseOutput(stdout));
      }
    );
  });
}
```

### 方案 4: 分离浏览器/Node.js 实现 ⭐⭐⭐

**策略**: 创建两个实现
- `ImageExtractor.node.ts` - Node.js 版本
- `ImageExtractor.browser.ts` - 浏览器版本

**优点**:
- ✅ 各环境最优解
- ✅ 灵活性高

**缺点**:
- ❌ 维护负担翻倍
- ❌ 复杂度增加

### 方案 5: 运行时动态加载 ⭐⭐

**实现**:
```typescript
async extract(buffer: Buffer): Promise<string[]> {
  try {
    // 只在运行时加载，不在测试时加载
    if (process.env.NODE_ENV !== 'test') {
      const pdfjsLib = await import('pdfjs-dist/legacy/build/pdf.mjs');
      // ... 实现
    } else {
      throw new Error('Not available in test environment');
    }
  } catch (error) {
    return this.fallbackImplementation(buffer);
  }
}
```

**优点**:
- ✅ 测试不受影响
- ✅ 生产环境可用

**缺点**:
- ❌ 复杂度高
- ❌ 错误处理困难

---

## 🎯 推荐方案

### 短期（立即可行）

**使用 pdf-lib 实现目录提取**

```bash
pnpm add pdf-lib
pnpm remove pdfjs-dist
```

**步骤**:
1. 更新 `TOCExtractor` 使用 `pdf-lib`
2. 实现基础目录提取
3. 添加测试
4. 更新文档

**时间**: 1-2 小时  
**风险**: 低  
**收益**: 中等

### 中期（1周内）

**探索图片提取方案**

**选项 A**: 使用 `pdf-lib` + `sharp`
```typescript
// 提取页面为图片，然后从图片中提取
async extractImages(buffer: Buffer): Promise<string[]> {
  const pdfDoc = await PDFDocument.load(buffer);
  const pages = pdfDoc.getPages();
  
  // 转换页面为图片
  // 从图片中识别和提取图片区域
}
```

**选项 B**: 接受功能限制
```typescript
// 文档说明：
// "图片提取需要额外的库支持，当前版本不支持"
// "建议使用专用工具如 pdfimages (poppler-utils)"
```

### 长期（可选）

**创建专门的图片提取工具**
- 作为独立包发布
- 可选依赖
- 浏览器环境支持

---

## 📊 对比分析

| 方案 | 难度 | 时间 | 功能完整度 | Node.js兼容 | 维护成本 |
|------|------|------|-----------|-------------|---------|
| pdf-lib | ⭐⭐ | 1-2h | ⭐⭐⭐ | ⭐⭐⭐⭐⭐ | ⭐⭐ |
| muhammara | ⭐⭐⭐⭐ | 1天 | ⭐⭐⭐⭐ | ⭐⭐⭐ | ⭐⭐⭐⭐ |
| PDFBox | ⭐⭐⭐⭐⭐ | 2-3天 | ⭐⭐⭐⭐⭐ | ⭐⭐ | ⭐⭐⭐⭐⭐ |
| 分离实现 | ⭐⭐⭐ | 1周 | ⭐⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐⭐ |
| 当前状态 | ⭐ | 0 | ⭐ | ⭐⭐⭐⭐⭐ | ⭐ |

---

## 🚀 行动计划

### 立即执行 (今天)

1. **移除 pdfjs-dist**
   ```bash
   pnpm remove pdfjs-dist
   ```

2. **安装 pdf-lib**
   ```bash
   pnpm add pdf-lib
   ```

3. **实现 TOCExtractor**
   - 使用 pdf-lib 提取目录
   - 添加测试
   - 更新文档

4. **更新 ImageExtractor 说明**
   - 明确说明功能限制
   - 提供替代方案文档
   - 列出外部工具（pdfimages, ImageMagick）

### 本周内

5. **创建使用示例**
   - 展示目录提取
   - 展示如何使用外部工具提取图片
   - 集成到文档

6. **更新 README**
   - 功能说明更准确
   - 列出限制和替代方案
   - 添加外部工具指南

### 未来考虑

7. **图片提取探索**
   - 研究 pdf-lib + sharp 方案
   - 或接受功能限制
   - 或创建独立包

---

## 📝 经验教训

1. **选择合适的库很重要**
   - 浏览器库 ≠ Node.js 库
   - 查看运行环境支持
   - 检查测试兼容性

2. **渐进式实现**
   - 先框架，后功能
   - 测试先行
   - 文档同步

3. **明确限制**
   - 不要过度承诺
   - 清晰的错误消息
   - 提供替代方案

4. **工具链整合**
   - Jest 配置可能复杂
   - ESM/CommonJS 混合问题
   - 需要充分测试

---

## 🎯 结论

**当前最优策略**:
1. ✅ 使用 **pdf-lib** 实现目录提取
2. ✅ 图片提取：**文档说明** + **外部工具指南**
3. ✅ 保持测试通过和代码质量
4. ✅ 为未来扩展预留接口

**理由**:
- 快速可行（1-2小时）
- 测试友好
- 维护简单
- 满足大部分使用场景
- 可以后续扩展

---

**更新**: 2025-11-27 23:00  
**状态**: 待实施  
**优先级**: ⭐⭐⭐⭐⭐

