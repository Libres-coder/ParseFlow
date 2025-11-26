# ParseFlow 快速开始指南

## 🚀 5 分钟上手

### 第 1 步：选择你的 IDE

ParseFlow 支持两种 IDE：

#### 选项 A：Windsurf（推荐，自动识别）
**配置文件位置**：
```
C:\Users\<你的用户名>\.codeium\windsurf\mcp_config.json
```

**打开方式**：
```powershell
notepad C:\Users\<你的用户名>\.codeium\windsurf\mcp_config.json
```

#### 选项 B：Cursor（需在 Agent 模式明确指示）
**配置文件位置**：
```
C:\Users\<你的用户名>\.cursor\mcp.json
```

**打开方式**：
```powershell
notepad C:\Users\<你的用户名>\.cursor\mcp.json
```

⚠️ **注意**：两个 IDE 的配置文件位置不同！

---

### 第 2 步：添加 ParseFlow 配置

将以下内容复制到配置文件（根据你选择的 IDE）：

```json
{
  "mcpServers": {
    "parseflow": {
      "command": "node",
      "args": ["<项目根目录>\\packages\\mcp-server\\dist\\index.js"],
      "env": {
        "PARSEFLOW_CACHE_DIR": "<项目根目录>\\.cache",
        "PARSEFLOW_MAX_FILE_SIZE": "52428800",
        "PARSEFLOW_ALLOWED_PATHS": "D:\\;C:\\Users",
        "LOG_LEVEL": "info"
      }
    }
  }
}
```

> ⚠️ **重要**：如果文件中已有其他 MCP 服务器配置，请保留它们，只添加 `"parseflow": {...}` 部分

### 第 3 步：重启 IDE

完全退出你的 IDE（确认任务管理器中进程已关闭），然后重新启动。

### 第 4 步：测试 PDF 解析

**如果使用 Windsurf**（自动识别）：
在对话框中直接输入：

```
请帮我分析 D:\7.pdf 的内容
```

或

```
D:\7.pdf 有多少页？
```

**如果使用 Cursor**（需在 Agent 模式明确指示）：
在 Composer 的 **Agent 模式**下输入：

```
请使用 parseflow 工具读取 D:\7.pdf 的内容
```

或

```
用 parseflow 的 get_metadata 工具查看 D:\7.pdf 有多少页
```

⚠️ **Cursor 注意事项**：
- 必须在 Composer 的 Agent 模式
- 必须明确指示使用 parseflow 工具

如果成功调用 ParseFlow 并返回结果，说明配置成功！

---

## 🧪 验证步骤清单

- [ ] 配置文件已创建/修改
- [ ] `args` 路径正确（指向你的项目路径）
- [ ] `PARSEFLOW_ALLOWED_PATHS` 包含你的 PDF 所在目录
- [ ] 已重启 IDE
- [ ] 测试 PDF 解析成功
- [ ] （Cursor 用户）确认在 Agent 模式

---

## 🔧 如果不工作？

### 检查 1：手动运行 MCP Server

```powershell
cd D:\ParseFlow
node packages\mcp-server\dist\index.js
```

应该看到服务器启动日志。按 `Ctrl+C` 停止。

### 检查 2：查看 Windsurf 日志

Windsurf 的日志通常在：
```
%APPDATA%\Windsurf\logs
```

查找与 MCP 相关的错误信息。

### 检查 3：验证构建

```powershell
cd D:\ParseFlow
pnpm build
```

确保无错误。

### 检查 4：测试 PDF 解析

```powershell
node test-quick.js D:\7.pdf
```

确保核心功能正常。

---

## 💡 常见使用场景

### 场景 1：快速查看 PDF 信息
```
你：D:\report.pdf 的基本信息是什么？
```

### 场景 2：提取特定内容
```
你：帮我提取 D:\contract.pdf 第 3-5 页的内容
```

### 场景 3：搜索关键词
```
你：在 D:\manual.pdf 中找到所有"注意事项"
```

### 场景 4：总结分析
```
你：总结 D:\article.pdf 的主要观点
```

### 场景 5：对比文档
```
你：对比 D:\v1.pdf 和 D:\v2.pdf 的差异
```

---

## 🎯 下一步

配置成功后，你可以：

1. **日常使用**：在工作中使用 Windsurf 分析 PDF
2. **优化配置**：根据需要调整 `PARSEFLOW_ALLOWED_PATHS` 等参数
3. **探索功能**：尝试不同的使用场景
4. **提供反馈**：记录使用中的问题和建议

---

## 📚 更多帮助

- [完整配置指南](./WINDSURF_SETUP.md)
- [常见问题](./FAQ.md)
- [API 文档](./docs/API.md)
- [架构设计](./docs/ARCHITECTURE.md)
