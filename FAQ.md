# 常见问题解答 (FAQ)

## 📌 安装和配置

### Q1: ParseFlow 支持哪些 IDE？

**A:** ParseFlow 支持两种 IDE：
- ✅ **Windsurf**（推荐）- 自动识别，无需明确指示
- ✅ **Cursor**（0.45.x+）- 需在 Agent 模式明确指示

详细配置参考：
- Windsurf: [WINDSURF_SETUP.md](WINDSURF_SETUP.md)
- Cursor: [CURSOR_SETUP.md](CURSOR_SETUP.md)

### Q2: 如何配置 ParseFlow？

**A:** 根据你的 IDE 选择配置文件：

**Windsurf**（推荐）：
- 配置文件: `C:\Users\<用户名>\.codeium\windsurf\mcp_config.json`
- 参考: [QUICK_START.md](QUICK_START.md)

**Cursor**：
- 配置文件: `C:\Users\<用户名>\.cursor\mcp.json`
- 参考: [CURSOR_SETUP.md](CURSOR_SETUP.md)

### Q2: 配置后 Windsurf 没有调用 ParseFlow？

**A:** 检查以下几点：
- [ ] 配置文件 JSON 格式正确（使用 jsonlint.com 验证）
- [ ] `args` 中的路径指向正确的 `dist/index.js`
- [ ] 已完全重启 Windsurf（检查任务管理器）
- [ ] 手动运行 `node packages\mcp-server\dist\index.js` 能否启动

### Q3: 提示 "Cannot find module"？

**A:** 运行以下命令重新构建：
```powershell
cd D:\ParseFlow
pnpm install
pnpm build
```

### Q4: 在 Cursor 中无法使用 ParseFlow？

**A:** Cursor 的 MCP 使用有特殊要求：

1. **必须在 Agent 模式**
   - 在 Composer 中切换到 Agent 模式
   - Chat 模式下无法使用 MCP

2. **必须明确指示工具**
   - ❌ 错误："分析 D:\report.pdf"
   - ✅ 正确："请使用 parseflow 工具读取 D:\report.pdf"

3. **确认配置正确**
   - 配置文件: `C:\Users\<用户名>\.cursor\mcp.json`
   - 参考: [CURSOR_SETUP.md](CURSOR_SETUP.md)

### Q5: Windsurf 和 Cursor 哪个更好用？

**A:** **推荐使用 Windsurf**，原因：
- ✅ 自动识别 MCP 工具，无需明确指示
- ✅ Chat 和 Agent 模式都可用
- ✅ 更智能的工具调用
- ✅ 无工具数量限制

Cursor 也可用，但需要：
- ⚠️ 必须在 Agent 模式
- ⚠️ 必须明确指示工具名称

### Q6: 如何更新到最新版本？

**A:** 
```powershell
git pull origin main
pnpm install
pnpm build
```
然后重启你的 IDE。

---

## 📄 PDF 解析

### Q7: 支持哪些 PDF 格式？

**A:** 
- ✅ 标准 PDF（文本类型）
- ✅ PDF 1.0 - 1.7 版本
- ⚠️ 扫描版 PDF（需要 OCR，未实现）
- ⚠️ 加密 PDF（需要密码，未实现）

### Q8: 能处理多大的 PDF 文件？

**A:** 
- 默认限制：50MB
- 可在 `.env` 中修改：`PARSEFLOW_MAX_FILE_SIZE=104857600` (100MB)
- 建议：超大文件（>100MB）可能导致内存问题

### Q9: 文本提取乱码怎么办？

**A:** 尝试不同的提取策略：
```javascript
// 策略 1: raw（原始）
await parser.extractText(path, { strategy: 'raw' });

// 策略 2: formatted（格式化）
await parser.extractText(path, { strategy: 'formatted' });

// 策略 3: clean（清理）
await parser.extractText(path, { strategy: 'clean' });
```

### Q8: 如何提取 PDF 中的图片？

**A:** 当前版本不支持图片提取，这是计划中的功能。
- 需要实现：基于 `pdfjs-dist` 的图片提取器
- 预计工作量：2-3 天
- 可以提交 Feature Request

### Q9: 搜索功能支持正则表达式吗？

**A:** 当前仅支持普通关键词搜索。正则表达式支持在计划中。

### Q10: 能提取 PDF 的目录结构吗？

**A:** 当前版本返回空数组，完整实现需要 `pdfjs-dist`，在计划中。

---

## 🔒 安全性

### Q11: 如何限制 ParseFlow 访问的目录？

**A:** 在配置中设置 `PARSEFLOW_ALLOWED_PATHS`：
```json
"env": {
  "PARSEFLOW_ALLOWED_PATHS": "D:\\Documents;D:\\Projects"
}
```
只允许访问列出的目录。

### Q12: ParseFlow 会上传我的 PDF 吗？

**A:** **不会。** ParseFlow 完全本地运行，所有处理都在您的机器上完成。

### Q13: 如何处理敏感文档？

**A:** 
- ParseFlow 不记录文档内容
- 可以禁用缓存：`cache: { enabled: false }`
- 查看日志确认无内容泄露

---

## ⚡ 性能

### Q14: 解析速度慢怎么办？

**A:** 
1. **启用缓存**：重复解析同一文件会更快
2. **只提取需要的部分**：使用 `extractPage()` 而不是 `extractText()`
3. **调整缓存大小**：
   ```json
   "PARSEFLOW_CACHE_MAX_SIZE": "100"
   ```

### Q15: 内存占用太高？

**A:** 
1. 限制文件大小：`PARSEFLOW_MAX_FILE_SIZE`
2. 减少缓存：`PARSEFLOW_CACHE_MAX_SIZE`
3. 处理完后清理缓存：
   ```powershell
   Remove-Item D:\ParseFlow\.cache\* -Recurse
   ```

### Q16: 能并行处理多个 PDF 吗？

**A:** 当前设计支持并发请求，但受 Node.js 单线程限制。
- 未来可能支持 Worker Threads
- 目前建议：逐个处理或使用多个 MCP Server 实例

---

## 🛠️ 开发

### Q17: 如何参与开发？

**A:** 参考 [CONTRIBUTING.md](../CONTRIBUTING.md)：
1. Fork 项目
2. 创建功能分支
3. 提交 Pull Request

### Q18: 如何调试 MCP Server？

**A:** 
1. **直接运行**：
   ```powershell
   node packages\mcp-server\dist\index.js
   ```

2. **使用 MCP Inspector**：
   ```powershell
   npx @modelcontextprotocol/inspector node packages\mcp-server\dist\index.js
   ```
   浏览器打开 http://localhost:5173

3. **查看日志**：
   ```powershell
   tail -f parseflow.log
   ```

### Q19: 如何添加新功能？

**A:** 
1. 在 `packages/pdf-parser-core/src/` 实现核心功能
2. 在 `packages/mcp-server/src/tools/` 添加 MCP Tool
3. 编写测试
4. 更新文档

### Q20: 测试覆盖率要求？

**A:** 
- 目标：> 80%
- 运行：`pnpm test:coverage`
- 查看：`coverage/lcov-report/index.html`

---

## 🐛 故障排除

### Q21: 遇到 "EACCES: permission denied" 错误？

**A:** 
- 检查文件权限
- 确认目录在 `PARSEFLOW_ALLOWED_PATHS` 中
- 尝试以管理员身份运行 Windsurf

### Q22: 日志显示 "Path traversal attempt detected"？

**A:** 这是安全保护机制。确保：
- 使用绝对路径
- 不使用 `..` 等路径遍历符
- 路径在允许列表中

### Q23: "Invalid PDF" 错误？

**A:** 
- 确认文件是有效的 PDF
- 尝试用 Adobe Reader 打开验证
- 检查文件是否损坏
- 某些特殊 PDF（如加密、受保护）可能不支持

### Q24: 如何清除缓存？

**A:** 
```powershell
# Windows
Remove-Item D:\ParseFlow\.cache\* -Recurse -Force

# 或在配置中禁用缓存
"env": {
  "PARSEFLOW_CACHE_ENABLED": "false"
}
```

### Q25: 如何查看详细日志？

**A:** 设置日志级别为 debug：
```json
"env": {
  "LOG_LEVEL": "debug",
  "PARSEFLOW_LOG_FILE": "<项目根目录>\\logs\\debug.log"
}
```

---

## 📚 其他

### Q26: 支持哪些操作系统？

**A:** 
- ✅ Windows 10/11
- ✅ macOS (未测试)
- ✅ Linux (未测试)

需要 Node.js >= 18.0.0

### Q27: 可以用在商业项目中吗？

**A:** 可以，ParseFlow 使用 MIT 许可证，可自由用于商业和个人项目。

### Q28: 有 Web 界面吗？

**A:** 当前没有，但在计划中。可以：
- 使用 MCP Inspector 作为临时界面
- 通过 Windsurf 交互
- 等待 Web UI 功能

### Q29: 能集成到其他 IDE 吗？

**A:** 
- ✅ 任何支持 MCP 的 IDE
- ✅ 作为 npm 包集成到自己的项目
- ❓ VSCode 插件（需要单独开发）

### Q30: 如何报告 Bug？

**A:** 
1. 在 GitHub Issues 创建新 Issue
2. 提供：
   - 错误描述
   - 复现步骤
   - 日志文件
   - 环境信息（OS、Node 版本）

---

## 🚀 未来计划

### Q31: 会有 MCP Marketplace 版本吗？

**A:** ✅ **是的！这是高优先级计划**

**计划内容**：
- 发布到 npm 公开包
- 提交到官方 MCP Registry
- 用户可以一键安装 ParseFlow

**收益**：
- ✅ 无需手动配置
- ✅ 自动版本管理
- ✅ 官方认可

**优先级**: ⭐⭐⭐⭐⭐

**参考**: [TODO.md](../TODO.md) 和 [DISTRIBUTION_ANALYSIS.md](./DISTRIBUTION_ANALYSIS.md)

### Q32: 能通过 VSCode 扩展（VSIX）安装吗？

**A:** ✅ **可以，已列入计划**

**技术上完全可行**：
- Windsurf 和 Cursor 都基于 VSCode
- 支持加载 VSCode 扩展
- 扩展可以自动管理 MCP 配置

**功能设计**：
- ✅ 一键安装配置
- ✅ 自动管理 MCP 配置文件
- ✅ MCP Server 启停控制
- ✅ 版本更新管理

**⚠️ 重要说明**：
```
✅ 可以改善：安装和配置体验
❌ 不能改变：AI 的工具选择行为

即使通过扩展安装：
- Windsurf 仍然自动识别 ✅
- Cursor 仍需 Agent 模式明确指示 ⚠️

因为 AI 工具选择是 IDE 内部逻辑，
扩展无法改变。
```

**优先级**: ⭐⭐⭐⭐（高）  
**前置条件**: MCP Marketplace 发布后

**参考**: [DISTRIBUTION_ANALYSIS.md](./DISTRIBUTION_ANALYSIS.md)

### Q33: VSCode 扩展能让 Cursor 自动使用 ParseFlow 吗？

**A:** ❌ **不能，这是技术限制**

**原因解释**：

**1. AI 工具选择由 IDE 决定**
```
AI 如何选择工具 = IDE 内部的 AI 层逻辑

无论通过什么方式：
❌ VSCode 扩展
❌ MCP 配置
❌ 外部脚本

都无法改变 AI 的决策行为
```

**2. Cursor Agent 模式是设计**
- 这是 Cursor 团队的产品设计
- 采用保守的工具选择策略
- 需要明确指示避免误调用

**3. 只有 Cursor 自己能改变**
- ✅ 未来 Cursor 可能改进
- ✅ 可能扩展到 Chat 模式
- ✅ 可能更智能的自动选择

**结论**：
```
VSCode 扩展能做的：
✅ 改善安装体验
✅ 自动配置管理
✅ 版本更新

VSCode 扩展不能做的：
❌ 改变 Cursor 的工具选择行为
❌ 让 Cursor 自动调用工具
❌ 绕过 Agent 模式要求
```

**建议**：
- 如果希望自动调用，使用 Windsurf
- 如果使用 Cursor，接受需要明确指示
- 或等待 Cursor 团队未来改进

**详细技术分析**: [DISTRIBUTION_ANALYSIS.md](./DISTRIBUTION_ANALYSIS.md)

### Q34: 未来有什么新功能？

**A:** 查看完整路线图：[TODO.md](../TODO.md)

**高优先级**：
- ⭐⭐⭐⭐⭐ MCP Marketplace 发布
- ⭐⭐⭐⭐ VSCode 扩展开发

**计划中**：
- 目录（TOC）提取
- 图像导出
- 高级搜索功能
- 性能优化
- 错误处理改进

**未来考虑**：
- OCR 支持（扫描件）
- AI 文档分析
- Web 界面（可选）

---

## 💬 获取帮助

如果以上没有解决您的问题：

1. **查看文档**：
   - [README](../README.md)
   - [API 文档](./API.md)
   - [开发指南](./DEVELOPMENT.md)

2. **提交 Issue**：
   - [GitHub Issues](https://github.com/Libres-coder/ParseFlow/issues)
   - 描述问题和错误日志

3. **查看日志**：
   - 检查 `logs/parseflow.log`
   - 检查 Windsurf 日志

---

**最后更新**: 2025-11-26
