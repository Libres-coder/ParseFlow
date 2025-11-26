# ParseFlow - Windsurf 本地配置指南

## ⚠️ 重要说明

**ParseFlow 是本地项目，不在任何公开的 MCP Registry 或 Marketplace 中！**

您需要通过编辑 Windsurf 的配置文件 `mcp_config.json` 来手动配置。

---

## 📋 前提条件

### 1. 确保项目已构建
```powershell
cd D:\ParseFlow
pnpm install
pnpm build
```

### 2. 确认文件存在
检查 MCP Server 是否已编译：
```powershell
dir D:\ParseFlow\packages\mcp-server\dist\index.js
```

如果文件存在，继续下一步。

---

## 🔧 配置步骤

### 方法 A：自动配置（推荐）

使用提供的配置脚本：

```powershell
cd D:\ParseFlow
.\scripts\setup-windsurf.ps1
```

脚本会自动：
1. 检查环境
2. 构建项目
3. 找到 Windsurf 配置文件
4. 添加 ParseFlow 配置
5. 提示重启 Windsurf

---

### 方法 B：手动配置

如果自动脚本失败，手动配置：

#### 1. 找到配置文件

Windsurf 的 MCP 配置文件位置：
```
C:\Users\你的用户名\.codeium\windsurf\mcp_config.json
```

**注意**：不是 `AppData\Roaming\Windsurf\`！

#### 2. 编辑配置文件

打开 `mcp_config.json`：

```powershell
# 使用记事本打开（替换为你的用户名）
notepad C:\Users\<你的用户名>\.codeium\windsurf\mcp_config.json
```

#### 3. 添加 ParseFlow 配置

如果文件是空的，添加：

```json
{
  "mcpServers": {
    "parseflow": {
      "command": "node",
      "args": [
        "<项目根目录>\\packages\\mcp-server\\dist\\index.js"
      ],
      "env": {
        "PARSEFLOW_CACHE_DIR": "<项目根目录>\\.cache",
        "PARSEFLOW_MAX_FILE_SIZE": "52428800",
        "PARSEFLOW_ALLOWED_PATHS": "D:\\;C:\\Users",
        "LOG_LEVEL": "info",
        "PARSEFLOW_LOG_FILE": "<项目根目录>\\logs\\parseflow.log",
        "PARSEFLOW_ERROR_LOG_FILE": "<项目根目录>\\logs\\error.log"
      }
    }
  }
}
```

如果文件已有其他 MCP servers，添加到 `mcpServers` 对象中：

```json
{
  "mcpServers": {
    "existing-server": {
      ...
    },
    "parseflow": {
      "command": "node",
      "args": [
        "<项目根目录>\\packages\\mcp-server\\dist\\index.js"
      ],
      "env": {
        "PARSEFLOW_CACHE_DIR": "<项目根目录>\\.cache",
        "PARSEFLOW_MAX_FILE_SIZE": "52428800",
        "PARSEFLOW_ALLOWED_PATHS": "D:\\;C:\\Users",
        "LOG_LEVEL": "info",
        "PARSEFLOW_LOG_FILE": "<项目根目录>\\logs\\parseflow.log",
        "PARSEFLOW_ERROR_LOG_FILE": "<项目根目录>\\logs\\error.log"
      }
    }
  }
}
```

#### 4. 修改路径（如果需要）

**重要**：如果您的 ParseFlow 不在 `D:\ParseFlow`，需要修改：

- `args[0]`: 改为您的实际路径
- `PARSEFLOW_CACHE_DIR`: 改为您的缓存目录
- `PARSEFLOW_LOG_FILE`: 改为您的日志路径
- `PARSEFLOW_ERROR_LOG_FILE`: 改为您的错误日志路径

例如，如果在 `E:\MyProjects\ParseFlow`：

```json
{
  "command": "node",
  "args": [
    "E:\\MyProjects\\ParseFlow\\packages\\mcp-server\\dist\\index.js"
  ],
  "env": {
    "PARSEFLOW_CACHE_DIR": "E:\\MyProjects\\ParseFlow\\.cache",
    "PARSEFLOW_ALLOWED_PATHS": "E:\\;D:\\;C:\\Users",
    "LOG_LEVEL": "info",
    "PARSEFLOW_LOG_FILE": "E:\\MyProjects\\ParseFlow\\logs\\parseflow.log",
    "PARSEFLOW_ERROR_LOG_FILE": "E:\\MyProjects\\ParseFlow\\logs\\error.log"
  }
}
```

---

## 🔄 重启 Windsurf

**关键步骤**：必须完全重启 Windsurf！

### 选项 1：完全退出并重启

1. 关闭所有 Windsurf 窗口
2. 检查任务管理器，确保没有 `Windsurf.exe` 进程
3. 重新启动 Windsurf
4. 等待 10-20 秒让 MCP Server 加载

### 选项 2：使用脚本重启（Windows）

```powershell
# 杀掉所有 Windsurf 进程
Get-Process -Name "Windsurf" -ErrorAction SilentlyContinue | Stop-Process -Force

# 等待几秒
Start-Sleep -Seconds 3

# 重新启动（根据您的安装路径调整）
Start-Process "C:\Users\<你的用户名>\AppData\Local\Programs\Windsurf\Windsurf.exe"
```

---

## ✅ 验证配置

### 1. 检查日志

MCP Server 启动后会在日志文件中记录：

```powershell
# 查看日志
Get-Content D:\ParseFlow\logs\parseflow.log -Tail 20
```

应该看到：
```
[info] Starting ParseFlow MCP Server...
[info] ParseFlow MCP Server started successfully
```

### 2. 测试功能

在 Windsurf 的新对话中测试：

```
测试 1: "D:\7.pdf 有多少页？"
预期: Cascade 直接回答页数，不写脚本

测试 2: "分析 D:\17.pdf 的内容"
预期: Cascade 调用 extract_text 工具

测试 3: "在 D:\document.pdf 中搜索 '关键词'"
预期: Cascade 调用 search_pdf 工具
```

### 3. 查看 Cascade 的思考过程

成功的标志：
- ✅ 看到 "MCP Tool: parseflow / get_metadata" 或类似
- ✅ 直接返回结果，不写脚本
- ✅ 3-10 秒内完成

---

## 🔍 故障排除

### 问题 1：Windsurf 没有调用 ParseFlow

**可能原因**：
1. 没有完全重启 Windsurf
2. 配置文件路径错误
3. MCP Server 构建失败
4. 路径中包含特殊字符

**解决方法**：
```powershell
# 1. 检查配置文件
cat C:\Users\<你的用户名>\.codeium\windsurf\mcp_config.json

# 2. 检查 MCP Server 能否手动启动
node D:\ParseFlow\packages\mcp-server\dist\index.js

# 3. 查看日志
cat D:\ParseFlow\logs\parseflow.log

# 4. 使用诊断脚本
.\scripts\check-mcp-status.ps1
```

### 问题 2："Cannot find module" 错误

**原因**：MCP Server 未构建或路径错误

**解决**：
```powershell
cd D:\ParseFlow
pnpm install
pnpm build
```

### 问题 3：日志文件没有生成

**原因**：MCP Server 从未被 Windsurf 启动

**检查**：
1. 配置文件路径是否正确（`.codeium\windsurf\mcp_config.json`）
2. 配置文件 JSON 格式是否正确
3. 是否完全重启了 Windsurf

### 问题 4：权限错误

**原因**：没有访问指定路径的权限

**解决**：
- 确保 `PARSEFLOW_ALLOWED_PATHS` 包含您要访问的目录
- 确保 ParseFlow 目录有读写权限

---

## 📝 配置说明

### 环境变量说明

| 变量 | 默认值 | 说明 |
|------|--------|------|
| `PARSEFLOW_CACHE_DIR` | `.cache` | 缓存目录 |
| `PARSEFLOW_MAX_FILE_SIZE` | `52428800` | 最大文件 50MB |
| `PARSEFLOW_ALLOWED_PATHS` | 无 | 允许访问的路径，用 `;` 分隔 |
| `LOG_LEVEL` | `info` | 日志级别：`error`, `warn`, `info`, `debug` |
| `PARSEFLOW_LOG_FILE` | 无 | 日志文件路径 |
| `PARSEFLOW_ERROR_LOG_FILE` | 无 | 错误日志文件路径 |

### 路径格式

**Windows**：使用双反斜杠 `\\` 或单斜杠 `/`
```json
"<项目根目录>\\dist\\index.js"
或
"<项目根目录>/dist/index.js"
```

**允许的路径**：用分号分隔
```json
"PARSEFLOW_ALLOWED_PATHS": "D:\\;E:\\Projects;C:\\Users"
```

---

## 🎯 快速参考

### 配置文件位置
```
C:\Users\你的用户名\.codeium\windsurf\mcp_config.json
```

### 最小配置
```json
{
  "mcpServers": {
    "parseflow": {
      "command": "node",
      "args": ["<项目根目录>\\packages\\mcp-server\\dist\\index.js"]
    }
  }
}
```

### 完整配置（模板）
见上面的详细配置示例。

---

## 📚 相关文档

- [QUICK_START.md](QUICK_START.md) - 快速开始指南
- [FAQ.md](FAQ.md) - 常见问题解答
- [docs/API.md](docs/API.md) - API 文档
- [TODO.md](TODO.md) - 开发计划

---

## ⚠️ 注意事项

1. **本地项目**：ParseFlow 当前仅供本地使用，未发布到任何公开 registry
2. **手动配置**：必须手动编辑 `mcp_config.json`，不能通过 UI Marketplace 安装
3. **完全重启**：配置后必须完全重启 Windsurf，不能只是重新加载窗口
4. **路径正确**：确保所有路径都指向正确的位置，使用绝对路径
5. **环境隔离**：不同的 Windsurf 安装可能有不同的配置文件位置

---

**更新日期**: 2025-11-26  
**ParseFlow 版本**: 1.0.0  
**配置方式**: 本地 `mcp_config.json` 编辑
