# 常见问题解答 (FAQ)

## 📌 安装和配置

### Q1: 如何在 Windsurf 中配置 ParseFlow？

**A:** 参考 [QUICK_START.md](../QUICK_START.md)，主要步骤：
1. 编辑 `%APPDATA%\Windsurf\mcp_config.json`
2. 添加 ParseFlow 配置
3. 重启 Windsurf

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

### Q4: 如何更新到最新版本？

**A:** 
```powershell
git pull origin main
pnpm install
pnpm build
```
然后重启 Windsurf。

---

## 📄 PDF 解析

### Q5: 支持哪些 PDF 格式？

**A:** 
- ✅ 标准 PDF（文本类型）
- ✅ PDF 1.0 - 1.7 版本
- ⚠️ 扫描版 PDF（需要 OCR，未实现）
- ⚠️ 加密 PDF（需要密码，未实现）

### Q6: 能处理多大的 PDF 文件？

**A:** 
- 默认限制：50MB
- 可在 `.env` 中修改：`PARSEFLOW_MAX_FILE_SIZE=104857600` (100MB)
- 建议：超大文件（>100MB）可能导致内存问题

### Q7: 文本提取乱码怎么办？

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
  "PARSEFLOW_LOG_FILE": "D:\\ParseFlow\\logs\\debug.log"
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

## 💬 获取帮助

如果以上没有解决您的问题：

1. **查看文档**：
   - [README](../README.md)
   - [API 文档](./API.md)
   - [开发指南](./DEVELOPMENT.md)

2. **社区支持**：
   - GitHub Issues
   - GitHub Discussions

3. **联系维护者**：
   - Email: your-email@example.com
   - GitHub: @your-username

---

**最后更新**: 2024-11-26
