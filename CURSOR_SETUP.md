# ParseFlow - Cursor 配置指南

## 📖 概述

**好消息**：ParseFlow 完全支持 Cursor IDE！

从 Cursor 0.45.x 版本开始，Cursor 引入了 MCP（Model Context Protocol）支持，现在你可以在 Cursor 中使用 ParseFlow 来解析 PDF 文件。

---

## ⚠️ 重要说明

### Cursor MCP 的特点

| 特性 | 说明 |
|------|------|
| **支持版本** | Cursor 0.45.x+ (推荐 1.0+) |
| **配置文件** | `C:\Users\<用户名>\.cursor\mcp.json` |
| **使用模式** | **必须在 Composer 的 Agent 模式下使用** |
| **工具限制** | 最多支持约 40 个工具 |
| **资源支持** | 暂不支持 MCP Resources |

### 为什么 Cursor 必须在 Agent 模式明确指示？

**这不是限制，而是设计差异**。让我们深入理解：

#### 技术原因

**1. MCP 集成层级不同**
```
Windsurf (Cascade):
├── Chat 模式: ✅ MCP 完全集成
└── Agent 模式: ✅ MCP 完全集成

Cursor (当前版本):
├── Chat 模式: ❌ 暂无 MCP 集成
└── Agent 模式: ✅ MCP 支持
```

**2. AI 工具选择策略不同**
- **Windsurf Cascade**: 使用激进的自动工具选择，会主动分析上下文并自动调用合适的 MCP 工具
- **Cursor Agent**: 使用保守的工具选择策略，需要用户明确指示以避免误调用

**3. 版本演进**

| Cursor 版本 | MCP 功能 |
|------------|---------|
| 0.44.x 之前 | ❌ 不支持 MCP |
| 0.45.x | ✅ Agent 模式引入 MCP |
| 1.0+ | ✅ 增强 Agent 模式 |
| 未来版本？ | 可能扩展到 Chat 模式 |

#### 不能改变的原因

⚠️ **重要理解**：

```
AI 的工具选择行为 = IDE 内部的 AI 层决定

无论是：
❌ VSCode 扩展
❌ MCP 配置
❌ 外部脚本

都无法改变 AI 如何选择和调用工具。

这是 Cursor 团队的设计决定。
```

#### 未来可能

- ✅ Cursor 可能在未来版本改进 MCP 集成
- ✅ 可能扩展到 Chat 模式
- ✅ 可能支持更智能的自动工具选择

但这取决于 **Cursor 团队的开发计划**，用户和第三方开发者无法控制。

**📚 详细分析**: 参考 [DISTRIBUTION_ANALYSIS.md](docs/DISTRIBUTION_ANALYSIS.md)

---

### 关键区别：Cursor vs Windsurf

| 方面 | Cursor | Windsurf |
|------|--------|----------|
| 配置文件 | `.cursor\mcp.json` | `.codeium\windsurf\mcp_config.json` |
| 使用方式 | 必须在 Agent 模式 | Chat 和 Agent 都可用 |
| 工具调用 | 需要明确指示 | 自动识别 |
| MCP 集成 | 基础支持 | 完整集成 |
| 用户体验 | ⭐⭐⭐ 良好 | ⭐⭐⭐⭐⭐ 优秀 |

---

## 🚀 快速配置（5分钟）

### 方法 1：手动配置（推荐）

#### 步骤 1：确保项目已构建

```bash
cd D:\ParseFlow
pnpm install
pnpm build
```

确认文件存在：
```
D:\ParseFlow\packages\mcp-server\dist\index.js
```

#### 步骤 2：编辑 Cursor 配置文件

**配置文件位置**：
```
C:\Users\<你的用户名>\.cursor\mcp.json
```

**打开方式**：
```powershell
# 使用记事本打开
notepad C:\Users\<你的用户名>\.cursor\mcp.json
```

#### 步骤 3：添加 ParseFlow 配置

在 `mcp.json` 中添加：

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

**注意**：
- 将 `<项目根目录>` 替换为实际路径（如 `D:\\ParseFlow`）
- 使用双反斜杠 `\\` 或单斜杠 `/`

#### 步骤 4：重启 Cursor

**完全退出** Cursor，然后重新启动。

#### 步骤 5：在 Agent 模式中测试

⚠️ **关键**：在 Cursor Composer 中，**必须切换到 Agent 模式**！

**测试方式**：
```
1. 打开 Cursor Composer
2. 切换到 Agent 模式（重要！）
3. 输入：请使用 parseflow 工具读取 D:\report.pdf 的内容
```

---

## 🎯 使用方法

### 在 Cursor Agent 模式中使用

**重要**：ParseFlow MCP 工具只能在 **Composer 的 Agent 模式**下使用！

#### 1. 切换到 Agent 模式

在 Cursor Composer 中：
- 找到模式切换按钮
- 选择 "Agent" 模式
- 确认已切换成功

#### 2. 明确指示使用 ParseFlow

由于 Cursor 不会自动识别，需要明确告诉 AI：

**推荐提问方式**：

```
❌ 错误（不够明确）：
"分析 D:\report.pdf"

✅ 正确（明确指示）：
"请使用 parseflow 工具读取 D:\report.pdf 的内容"
"使用 parseflow 的 get_metadata 工具查看 D:\document.pdf 的信息"
"用 parseflow 搜索 D:\contract.pdf 中的关键词"
```

#### 3. 可用的命令示例

**提取文本**：
```
请使用 parseflow 的 extract_text 工具提取 D:\report.pdf 的全部内容
```

**获取元数据**：
```
请使用 parseflow 的 get_metadata 工具查看 D:\document.pdf 有多少页
```

**搜索关键词**：
```
使用 parseflow 的 search_pdf 工具在 D:\contract.pdf 中搜索"违约责任"
```

**提取特定页**：
```
用 parseflow 提取 D:\manual.pdf 的第 5 页内容
```

---

## 🔧 自动配置脚本

### 使用 PowerShell 脚本配置

创建 `setup-cursor.ps1` 脚本：

```powershell
# ParseFlow Cursor 自动配置脚本

Write-Host "🚀 ParseFlow Cursor 配置向导" -ForegroundColor Cyan

# 1. 检查构建
if (-not (Test-Path "packages\mcp-server\dist\index.js")) {
    Write-Host "❌ 项目未构建，请先运行 pnpm build" -ForegroundColor Red
    exit 1
}

# 2. 配置文件路径
$cursorConfig = "$env:USERPROFILE\.cursor\mcp.json"

if (-not (Test-Path "$env:USERPROFILE\.cursor")) {
    New-Item -ItemType Directory -Path "$env:USERPROFILE\.cursor" -Force | Out-Null
}

# 3. 读取或创建配置
$currentPath = (Get-Location).Path
$parseflowConfig = @{
    command = "node"
    args = @("$currentPath\packages\mcp-server\dist\index.js")
    env = @{
        PARSEFLOW_CACHE_DIR = "$currentPath\.cache"
        PARSEFLOW_MAX_FILE_SIZE = "52428800"
        PARSEFLOW_ALLOWED_PATHS = "D:\;C:\Users"
        LOG_LEVEL = "info"
        PARSEFLOW_LOG_FILE = "$currentPath\logs\parseflow.log"
        PARSEFLOW_ERROR_LOG_FILE = "$currentPath\logs\error.log"
    }
}

if (Test-Path $cursorConfig) {
    $config = Get-Content $cursorConfig -Raw | ConvertFrom-Json
    $config.mcpServers | Add-Member -NotePropertyName "parseflow" -NotePropertyValue $parseflowConfig -Force
    $config | ConvertTo-Json -Depth 10 | Set-Content $cursorConfig
} else {
    $newConfig = @{
        mcpServers = @{
            parseflow = $parseflowConfig
        }
    }
    $newConfig | ConvertTo-Json -Depth 10 | Set-Content $cursorConfig
}

Write-Host "✅ 配置完成！" -ForegroundColor Green
Write-Host "配置文件: $cursorConfig" -ForegroundColor White
Write-Host "`n下一步:" -ForegroundColor Cyan
Write-Host "1. 重启 Cursor" -ForegroundColor White
Write-Host "2. 在 Composer 中切换到 Agent 模式" -ForegroundColor White
Write-Host "3. 测试: '请使用 parseflow 工具读取 PDF 文件'" -ForegroundColor White
```

运行脚本：
```powershell
cd D:\ParseFlow
.\setup-cursor.ps1
```

---

## 📋 可用的 MCP 工具

ParseFlow 提供以下 MCP 工具：

### 1. extract_text
提取 PDF 文本内容

**参数**：
- `path` (必需): PDF 文件路径
- `page` (可选): 特定页码
- `range` (可选): 页码范围（如 "1-5"）
- `strategy` (可选): 提取策略 - "raw", "formatted", "clean"

**使用示例**：
```
请使用 parseflow 的 extract_text 工具提取 D:\document.pdf 的内容
```

### 2. get_metadata
获取 PDF 元数据

**参数**：
- `path` (必需): PDF 文件路径

**使用示例**：
```
使用 parseflow 的 get_metadata 工具查看 D:\report.pdf 的信息
```

### 3. search_pdf
在 PDF 中搜索关键词

**参数**：
- `path` (必需): PDF 文件路径
- `query` (必需): 搜索关键词
- `caseSensitive` (可选): 是否区分大小写
- `maxResults` (可选): 最大结果数

**使用示例**：
```
用 parseflow 搜索 D:\contract.pdf 中的"重要条款"
```

---

## 🔍 故障排除

### 问题 1：Agent 模式找不到 parseflow 工具

**原因**：
- Cursor 未重启
- 配置文件格式错误
- 未在 Agent 模式

**解决**：
1. 完全退出 Cursor 并重启
2. 检查 `mcp.json` 格式（使用 jsonlint.com）
3. 确认在 Composer 的 Agent 模式

### 问题 2：提示 "Cannot find module"

**原因**：MCP Server 未构建或路径错误

**解决**：
```bash
cd D:\ParseFlow
pnpm install
pnpm build
# 确认文件存在
dir packages\mcp-server\dist\index.js
```

### 问题 3：AI 不调用 parseflow

**原因**：提问不够明确

**解决**：使用明确的指令：
```
❌ "分析这个 PDF"
✅ "请使用 parseflow 工具读取 D:\report.pdf"
```

### 问题 4：在 Chat 模式下无法使用

**原因**：Cursor MCP 只在 Agent 模式可用

**解决**：切换到 Composer 的 Agent 模式

---

## 💡 最佳实践

### 1. 明确指示工具

由于 Cursor 不会自动选择 MCP 工具，始终明确指示：

```
✅ 好的提问：
"请使用 parseflow 的 extract_text 工具读取 D:\report.pdf 第 3 页"
"用 parseflow 查看 D:\document.pdf 的元数据"

❌ 不够明确：
"读取这个 PDF"
"查看文档信息"
```

### 2. 使用完整路径

```
✅ 使用完整路径：
"D:\documents\report.pdf"

❌ 避免相对路径：
"./report.pdf"
```

### 3. 分步骤执行

对于复杂任务，分步骤进行：

```
步骤 1: "用 parseflow 获取 D:\report.pdf 的元数据"
步骤 2: "提取第 1-5 页的内容"
步骤 3: "搜索关键词"
```

---

## 📊 Cursor vs Windsurf 对比

| 特性 | Cursor | Windsurf |
|------|--------|----------|
| **配置文件** | `.cursor\mcp.json` | `.codeium\windsurf\mcp_config.json` |
| **配置方式** | 手动编辑 | 手动编辑 + 自动脚本 |
| **使用模式** | 仅 Agent 模式 | Chat 和 Agent 都可用 |
| **工具调用** | 需明确指示 | 自动识别（推荐） |
| **工具数量限制** | ~40 个工具 | 无限制 |
| **Resource 支持** | 不支持 | 支持 |
| **用户体验** | 需要明确命令 | 自动化程度高 |

**建议**：
- 如果使用 **Cursor**：按本指南配置，在 Agent 模式明确指示
- 如果使用 **Windsurf**：推荐使用，体验更好（参考 WINDSURF_SETUP.md）

---

## 📚 相关文档

- [QUICK_START.md](QUICK_START.md) - 通用快速开始
- [WINDSURF_SETUP.md](WINDSURF_SETUP.md) - Windsurf 详细配置
- [FAQ.md](FAQ.md) - 常见问题
- [docs/API.md](docs/API.md) - API 文档

---

## ⚙️ 配置文件示例

### 最小配置
```json
{
  "mcpServers": {
    "parseflow": {
      "command": "node",
      "args": ["D:\\ParseFlow\\packages\\mcp-server\\dist\\index.js"]
    }
  }
}
```

### 完整配置
```json
{
  "mcpServers": {
    "parseflow": {
      "command": "node",
      "args": [
        "D:\\ParseFlow\\packages\\mcp-server\\dist\\index.js"
      ],
      "env": {
        "PARSEFLOW_CACHE_DIR": "D:\\ParseFlow\\.cache",
        "PARSEFLOW_MAX_FILE_SIZE": "52428800",
        "PARSEFLOW_ALLOWED_PATHS": "D:\\;C:\\Users;E:\\Projects",
        "LOG_LEVEL": "info",
        "PARSEFLOW_LOG_FILE": "D:\\ParseFlow\\logs\\parseflow.log",
        "PARSEFLOW_ERROR_LOG_FILE": "D:\\ParseFlow\\logs\\error.log"
      }
    }
  }
}
```

### 多服务器配置
```json
{
  "mcpServers": {
    "parseflow": {
      "command": "node",
      "args": ["D:\\ParseFlow\\packages\\mcp-server\\dist\\index.js"]
    },
    "other-mcp-server": {
      "command": "python",
      "args": ["path/to/other/server.py"]
    }
  }
}
```

---

## 🎯 快速参考

### 配置路径
```
Cursor: C:\Users\<用户名>\.cursor\mcp.json
Windsurf: C:\Users\<用户名>\.codeium\windsurf\mcp_config.json
```

### 使用要点
- ✅ 必须在 **Agent 模式**
- ✅ 必须**明确指示**使用 parseflow
- ✅ 使用**完整路径**
- ✅ 重启 Cursor 后生效

### 测试命令
```
请使用 parseflow 的 get_metadata 工具查看 D:\test.pdf 的信息
```

---

## ✅ 总结

ParseFlow **完全支持 Cursor**，配置方式与 Windsurf 类似，但需要注意：

1. ⚠️ **必须在 Agent 模式**使用
2. ⚠️ **必须明确指示**工具名称
3. ⚠️ 配置文件路径不同（`.cursor\mcp.json`）

**推荐使用 Windsurf**：如果两个 IDE 都有，Windsurf 的 MCP 集成体验更好（自动识别，无需明确指示）。

---

**更新日期**: 2025-11-26  
**ParseFlow 版本**: v1.0.0  
**Cursor 支持版本**: 0.45.x+  
**配置文件**: `.cursor\mcp.json`
