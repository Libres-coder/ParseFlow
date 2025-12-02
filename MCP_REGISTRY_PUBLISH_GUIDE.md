# 🚀 发布到 MCP Registry 完整指南

## ✅ 已完成的准备工作

- ✅ `packages/mcp-server/package.json` 已添加 `mcpName` 字段
- ✅ `packages/mcp-server/server.json` 已创建
- ✅ MCP 服务器已构建（`dist/` 目录）
- ✅ 所有更改已提交到 Git

---

## 📋 接下来要做的事

### 第 1 步：发布 MCP 服务器到 npm ⚠️

**重要**：MCP Registry 只存储元数据，实际的包必须先发布到 npm。

#### 1.1 检查构建产物

```bash
cd d:\ParseFlow\packages\mcp-server
ls dist
```

应该看到编译后的文件。

#### 1.2 测试本地安装

```bash
# 在 mcp-server 目录
npm pack

# 测试安装（可选）
npm install -g ./parseflow-mcp-server-1.0.0.tgz
```

#### 1.3 登录 npm（如果还没登录）

```bash
npm login
```

输入你的 npm 账号信息。

#### 1.4 发布到 npm

```bash
cd d:\ParseFlow\packages\mcp-server
npm publish --access public
```

**预期输出**：
```
+ @parseflow/mcp-server@1.0.0
```

#### 1.5 验证发布成功

访问：https://www.npmjs.com/package/@parseflow/mcp-server

或运行：
```bash
npm view @parseflow/mcp-server
```

---

### 第 2 步：安装 mcp-publisher CLI

#### Windows:

```powershell
# PowerShell
$arch = if ([System.Runtime.InteropServices.RuntimeInformation]::ProcessArchitecture -eq "Arm64") { "arm64" } else { "amd64" }
Invoke-WebRequest -Uri "https://github.com/modelcontextprotocol/registry/releases/latest/download/mcp-publisher_windows_$arch.tar.gz" -OutFile "mcp-publisher.tar.gz"
tar xf mcp-publisher.tar.gz mcp-publisher.exe
rm mcp-publisher.tar.gz

# 将 mcp-publisher.exe 移动到你的 PATH 目录
# 例如：C:\Windows\System32 或其他 PATH 目录
```

或者使用简化命令（推荐）：
```powershell
# 下载到当前目录
Invoke-WebRequest -Uri "https://github.com/modelcontextprotocol/registry/releases/latest/download/mcp-publisher_windows_amd64.tar.gz" -OutFile "mcp-publisher.tar.gz"
tar xf mcp-publisher.tar.gz
```

#### 验证安装

```bash
.\mcp-publisher.exe --help
```

或者，如果已添加到 PATH：
```bash
mcp-publisher --help
```

应该看到帮助信息。

---

### 第 3 步：使用 GitHub 认证登录

```bash
cd d:\ParseFlow\packages\mcp-server
.\mcp-publisher.exe login github
```

或者（如果已添加到 PATH）：
```bash
mcp-publisher login github
```

**预期输出**：
```
Logging in with github...

To authenticate, please:
1. Go to: https://github.com/login/device
2. Enter code: ABCD-1234
3. Authorize this application
Waiting for authorization...
```

**操作步骤**：
1. 在浏览器中访问：https://github.com/login/device
2. 输入终端显示的授权码（例如：ABCD-1234）
3. 点击授权

**预期成功输出**：
```
Successfully authenticated!
✓ Successfully logged in
```

---

### 第 4 步：发布到 MCP Registry

```bash
cd d:\ParseFlow\packages\mcp-server
.\mcp-publisher.exe publish
```

或者（如果已添加到 PATH）：
```bash
mcp-publisher publish
```

**预期输出**：
```
Publishing to https://registry.modelcontextprotocol.io...
✓ Successfully published
✓ Server io.github.libres-coder/parseflow version 1.0.0
```

---

### 第 5 步：验证发布成功

#### 5.1 通过 API 验证

```bash
curl "https://registry.modelcontextprotocol.io/v0.1/servers?search=parseflow"
```

应该看到你的服务器信息。

#### 5.2 通过网页验证

访问：https://registry.modelcontextprotocol.io/

搜索 "parseflow"，应该能找到你的服务器。

---

## 🔧 故障排查

### 问题 1：npm 发布失败

**错误**：`E403 Forbidden`
- **原因**：没有权限发布 scoped package
- **解决**：使用 `npm publish --access public`

**错误**：`E401 Unauthorized`
- **原因**：未登录
- **解决**：运行 `npm login`

---

### 问题 2：mcp-publisher 登录失败

**错误**：`Invalid or expired Registry JWT token`
- **原因**：token 过期
- **解决**：重新运行 `mcp-publisher login github`

---

### 问题 3：发布到 Registry 失败

**错误**：`Registry validation failed for package`
- **原因**：npm 包缺少 `mcpName` 字段
- **解决**：检查 `package.json` 是否有 `mcpName` 字段，并重新发布到 npm

**错误**：`You do not have permission to publish this server`
- **原因**：服务器名称与认证方式不匹配
- **解决**：使用 GitHub 认证时，服务器名称必须以 `io.github.你的用户名/` 开头

---

## 📊 检查清单

在发布前，确保：

- [ ] `parseflow-core` 已发布到 npm (v1.0.1) ✅
- [ ] `packages/mcp-server/package.json` 有 `mcpName` 字段 ✅
- [ ] `packages/mcp-server/server.json` 已创建 ✅
- [ ] MCP 服务器已构建 ✅
- [ ] 登录到 npm
- [ ] 发布 `@parseflow/mcp-server` 到 npm
- [ ] 安装 `mcp-publisher` CLI
- [ ] 使用 GitHub 登录 MCP Registry
- [ ] 发布到 MCP Registry
- [ ] 验证发布成功

---

## 🎯 下一步（发布后）

### 1. 推送到 GitHub

```bash
cd d:\ParseFlow
git push origin main
```

### 2. 创建 GitHub Release

1. 访问：https://github.com/Libres-coder/ParseFlow/releases/new
2. 创建新的 release（例如 v1.0.1）
3. 包含发布说明：
   - ✅ 发布到 npm
   - ✅ 发布到 MCP Registry
   - ✅ 添加了完整的使用示例

### 3. 更新 README

在主 README 中添加 MCP Registry 徽章：

```markdown
[![MCP Registry](https://img.shields.io/badge/MCP%20Registry-parseflow-blue)](https://registry.modelcontextprotocol.io/)
```

### 4. 推广

- 在 V2EX 分享
- 在掘金发布文章
- 在 Reddit r/mcp 社区分享
- 在 Twitter/X 宣传

---

## 💡 提示

1. **版本更新**：每次更新时，需要：
   - 更新 `package.json` 的 `version`
   - 更新 `server.json` 的 `version`
   - 重新发布到 npm
   - 重新发布到 MCP Registry

2. **测试**：发布前最好在本地测试：
   ```bash
   npm pack
   npm install -g ./parseflow-mcp-server-1.0.0.tgz
   parseflow --help
   ```

3. **文档**：确保 README.md 中有完整的安装和使用说明

---

## 📝 记录

**准备完成时间**：2025-12-03  
**状态**：✅ 准备工作完成，等待发布到 npm 和 MCP Registry

**文件位置**：
- 配置文件：`d:\ParseFlow\packages\mcp-server\package.json`
- Registry 配置：`d:\ParseFlow\packages\mcp-server\server.json`
- 构建产物：`d:\ParseFlow\packages\mcp-server\dist\`

---

**开始执行发布流程吧！从第 1 步开始** 🚀
