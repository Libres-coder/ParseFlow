# ParseFlow 快速开始指南

## 🚀 5 分钟上手

### 第 1 步：打开 Windsurf 配置文件

按 `Win + R`，输入：
```
%APPDATA%\Windsurf
```

在打开的文件夹中，找到或创建 `mcp_config.json`

### 第 2 步：添加 ParseFlow 配置

将以下内容复制到 `mcp_config.json`：

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

> ⚠️ **重要**：如果文件中已有其他 MCP 服务器配置，请保留它们，只添加 `"parseflow": {...}` 部分

### 第 3 步：重启 Windsurf

完全退出 Windsurf（确认任务管理器中进程已关闭），然后重新启动。

### 第 4 步：测试 PDF 解析

在 Windsurf 对话框中输入：

```
请帮我分析 D:\7.pdf 的内容
```

或

```
D:\7.pdf 有多少页？
```

如果 Windsurf 成功调用了 ParseFlow 并返回结果，说明配置成功！

---

## 🧪 验证步骤清单

- [ ] 配置文件已创建/修改
- [ ] `args` 路径正确（指向你的项目路径）
- [ ] `PARSEFLOW_ALLOWED_PATHS` 包含你的 PDF 所在目录
- [ ] 已重启 Windsurf
- [ ] 测试 PDF 解析成功

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
- [API 文档](./docs/API.md)
- [架构设计](./docs/ARCHITECTURE.md)
- [常见问题](./docs/FAQ.md) *(待创建)*
