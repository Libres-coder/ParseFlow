# 贡献指南

感谢您对 ParseFlow 项目的关注！我们欢迎各种形式的贡献。

## 🤝 如何贡献

### 报告 Bug

如果您发现了 Bug，请：

1. 检查 [Issues](https://github.com/Libres-coder/ParseFlow/issues) 确认该问题是否已被报告
2. 如果没有，创建新 Issue 并提供：
   - 清晰的标题和描述
   - 复现步骤
   - 预期行为 vs 实际行为
   - 环境信息（OS、Node 版本等）
   - 错误日志或截图

### 提出功能建议

1. 在 Issues 中创建 Feature Request
2. 描述您的使用场景
3. 说明为什么这个功能有用
4. 如果可以，提供设计方案

### 提交代码

#### 开发流程

1. **Fork 项目**

   ```bash
   # 在 GitHub 上 Fork 项目
   # 然后克隆到本地
   git clone https://github.com/your-username/ParseFlow.git
   cd ParseFlow
   ```

2. **创建分支**

   ```bash
   git checkout -b feature/your-feature-name
   # 或
   git checkout -b fix/bug-description
   ```

3. **安装依赖**

   ```bash
   pnpm install
   ```

4. **开发并测试**

   ```bash
   # 开发模式
   pnpm dev

   # 运行测试
   pnpm test

   # 代码检查
   pnpm lint
   ```

5. **提交代码**

   ```bash
   git add .
   git commit -m "feat: add amazing feature"
   ```

   使用 [Conventional Commits](https://www.conventionalcommits.org/) 规范：
   - `feat`: 新功能
   - `fix`: Bug 修复
   - `docs`: 文档更新
   - `style`: 代码格式（不影响功能）
   - `refactor`: 重构
   - `test`: 测试
   - `chore`: 构建/工具

6. **推送分支**

   ```bash
   git push origin feature/your-feature-name
   ```

7. **创建 Pull Request**
   - 在 GitHub 上创建 PR
   - 填写 PR 模板
   - 等待代码审查

## 📋 代码规范

### TypeScript

- 使用 TypeScript 严格模式
- 所有公共 API 必须有类型定义
- 所有公共函数必须有 JSDoc 注释

```typescript
/**
 * 从 PDF 提取文本
 * @param path - PDF 文件路径
 * @param options - 提取选项
 * @returns 提取的文本内容
 */
async extractText(path: string, options?: ExtractOptions): Promise<string> {
  // ...
}
```

### 代码风格

- 使用 ESLint 和 Prettier
- 2 空格缩进
- 单引号
- 分号结尾
- 运行 `pnpm lint:fix` 自动修复

### 命名约定

- 变量和函数：`camelCase`
- 类和接口：`PascalCase`
- 常量：`UPPER_SNAKE_CASE`
- 私有成员：`_prefixWithUnderscore`

### 测试

- 所有新功能必须有测试
- Bug 修复必须有回归测试
- 测试覆盖率 > 80%
- 使用描述性测试名称

```typescript
describe('PDFParser', () => {
  it('should extract text from valid PDF', async () => {
    // ...
  });

  it('should throw error for non-existent file', async () => {
    // ...
  });
});
```

## 🔍 代码审查标准

我们会从以下方面审查代码：

### 1. 功能性

- ✅ 实现了预期功能
- ✅ 处理了边界情况
- ✅ 错误处理完善

### 2. 代码质量

- ✅ 代码清晰易读
- ✅ 适当的注释
- ✅ 避免重复代码

### 3. 性能

- ✅ 无明显性能问题
- ✅ 合理使用资源
- ✅ 考虑了大文件处理

### 4. 安全性

- ✅ 输入验证充分
- ✅ 无明显安全漏洞
- ✅ 敏感信息处理得当

### 5. 测试

- ✅ 测试覆盖充分
- ✅ 测试用例合理
- ✅ 包含边界测试

### 6. 文档

- ✅ API 文档完整
- ✅ 代码注释清晰
- ✅ README 已更新

## 📚 开发资源

### 文档

- [架构设计](./docs/development/architecture.md)
- [API 文档](./docs/development/api.md)
- [开发指南](./docs/development/development.md)
- [命名规范](./docs/development/naming-conventions.md)

### 相关技术

- [MCP 协议](https://modelcontextprotocol.io)
- [PDF.js](https://mozilla.github.io/pdf.js/)
- [pdf-parse](https://www.npmjs.com/package/pdf-parse)

### 开发工具

- [MCP Inspector](https://github.com/modelcontextprotocol/inspector) - 测试 MCP 服务器
- [Jest](https://jestjs.io/) - 测试框架
- [ESLint](https://eslint.org/) - 代码检查
- [Prettier](https://prettier.io/) - 代码格式化

## 🎯 当前优先级

我们目前最需要帮助的领域：

### 高优先级

- ⭐ 完善单元测试和集成测试
- ⭐ 实现图片提取功能（基于 pdfjs-dist）
- ⭐ 实现目录（TOC）提取功能
- ⭐ 添加 OCR 支持（Tesseract.js）

### 中优先级

- 🔹 性能优化（并行处理、流式处理）
- 🔹 支持更多文档格式（Word、Excel）
- 🔹 语义搜索（基于向量嵌入）
- 🔹 改进缓存机制

### 低优先级

- 🔸 Web UI 界面
- 🔸 CLI 工具增强
- 🔸 插件系统
- 🔸 国际化支持

## ❓ 需要帮助？

如果您有任何问题：

1. 查看 [文档](./docs)
2. 搜索 [Issues](https://github.com/Libres-coder/ParseFlow/issues)
3. 在 Issue 中提问
4. 联系维护者

## 📜 许可证

贡献代码即表示您同意代码以 MIT 许可证发布。

---

**再次感谢您的贡献！** 🎉
