# Windsurf 配置指南

## 🚀 将 ParseFlow 集成到 Windsurf

### 步骤 1：定位配置文件

配置文件位置：`%APPDATA%\Windsurf\mcp_config.json`

完整路径通常是：
```
C:\Users\你的用户名\AppData\Roaming\Windsurf\mcp_config.json
```

### 步骤 2：编辑配置文件

如果文件不存在，创建它；如果存在，添加以下内容：

```json
{
  "mcpServers": {
    "parseflow": {
      "command": "node",
      "args": ["D:\\ParseFlow\\packages\\mcp-server\\dist\\index.js"],
      "env": {
        "PARSEFLOW_CACHE_DIR": "D:\\ParseFlow\\.cache",
        "PARSEFLOW_MAX_FILE_SIZE": "52428800",
        "PARSEFLOW_ALLOWED_PATHS": "D:\\Documents;D:\\Downloads;D:\\Projects",
        "LOG_LEVEL": "info"
      }
    }
  }
}
```

**配置说明：**
- `command`: 使用 Node.js 运行
- `args`: MCP Server 入口文件路径（**请根据实际路径修改**）
- `PARSEFLOW_CACHE_DIR`: 缓存目录
- `PARSEFLOW_MAX_FILE_SIZE`: 最大文件 50MB
- `PARSEFLOW_ALLOWED_PATHS`: 允许访问的目录（用`;`分隔，**请根据需要修改**）
- `LOG_LEVEL`: 日志级别（debug/info/warn/error）

### 步骤 3：重启 Windsurf

保存配置文件后，完全退出并重启 Windsurf IDE。

### 步骤 4：测试是否生效

在 Windsurf 对话框中尝试：

```plaintext
你：请帮我分析 D:\7.pdf 这个文件的内容

Windsurf 应该会：
1. 自动调用 ParseFlow MCP Server
2. 使用 extract_text 或 get_metadata 工具
3. 返回 PDF 的内容分析
```

### 步骤 5：常用命令示例

**查看 PDF 元数据：**
```
你：D:\documents\report.pdf 这个文件有多少页？是谁创建的？
```

**提取特定页面：**
```
你：帮我提取 D:\manual.pdf 的第 5 页内容
```

**搜索关键词：**
```
你：在 D:\contract.pdf 中找到所有提到"金额"的地方
```

**分析整个 PDF：**
```
你：总结一下 D:\annual-report.pdf 的主要内容
```

---

## 🔧 故障排除

### 问题 1: Windsurf 没有调用 ParseFlow

**可能原因：**
- 配置文件路径错误
- JSON 格式错误
- 没有重启 Windsurf

**解决方案：**
1. 检查 `%APPDATA%\Windsurf\mcp_config.json` 是否存在
2. 用 JSON 验证器检查格式：https://jsonlint.com/
3. 完全退出 Windsurf（任务管理器确认进程已关闭）
4. 重新启动

### 问题 2: 提示"File not found"

**可能原因：**
- PDF 文件路径不在 `PARSEFLOW_ALLOWED_PATHS` 中
- 路径拼写错误

**解决方案：**
在 `mcp_config.json` 中添加 PDF 所在目录到 `PARSEFLOW_ALLOWED_PATHS`

### 问题 3: MCP Server 启动失败

**检查方法：**
手动运行 MCP Server 查看错误：
```powershell
node D:\ParseFlow\packages\mcp-server\dist\index.js
```

**常见错误：**
- 缺少 `node_modules/`：运行 `pnpm install`
- 没有 `dist/` 目录：运行 `pnpm build`

### 问题 4: 查看日志

日志文件位置：
- 默认：`parseflow.log`（项目根目录）
- 错误日志：`parseflow-error.log`

可以设置环境变量指定日志文件：
```json
"env": {
  "PARSEFLOW_LOG_FILE": "D:\\ParseFlow\\logs\\parseflow.log",
  "PARSEFLOW_ERROR_LOG_FILE": "D:\\ParseFlow\\logs\\error.log"
}
```

---

## 🎯 验证安装成功

运行以下测试：

```powershell
# 1. 手动测试 MCP Server
node D:\ParseFlow\packages\mcp-server\dist\index.js

# 2. 测试 PDF 解析
node D:\ParseFlow\test-quick.js D:\your-test.pdf

# 3. 使用 MCP Inspector
npx @modelcontextprotocol/inspector node D:\ParseFlow\packages\mcp-server\dist\index.js
# 然后在浏览器打开 http://localhost:5173
```

---

## 📚 更多资源

- [README.md](./README.md) - 项目介绍
- [API.md](./docs/API.md) - API 文档
- [ARCHITECTURE.md](./docs/ARCHITECTURE.md) - 架构设计

## ❓ 需要帮助？

如有问题，请：
1. 查看日志文件
2. 检查配置是否正确
3. 在 GitHub Issues 提问
