# ⚡️ 5 分钟发布到 MCP Registry

## ✅ 准备工作已完成

- ✅ `parseflow-core@1.0.1` 在 npm 上
- ✅ MCP Server 已构建
- ✅ `package.json` 有 `mcpName` 字段
- ✅ `server.json` 已创建

---

## 🚀 现在要做（5 步）

### 1️⃣ 发布 MCP Server 到 npm

```bash
cd d:\ParseFlow\packages\mcp-server
npm login
npm publish --access public
```

**验证**: 访问 https://www.npmjs.com/package/@parseflow/mcp-server

---

### 2️⃣ 下载 mcp-publisher

```powershell
Invoke-WebRequest -Uri "https://github.com/modelcontextprotocol/registry/releases/latest/download/mcp-publisher_windows_amd64.tar.gz" -OutFile "mcp-publisher.tar.gz"
tar xf mcp-publisher.tar.gz
.\mcp-publisher.exe --help
```

---

### 3️⃣ 登录 GitHub

```bash
cd d:\ParseFlow\packages\mcp-server
.\mcp-publisher.exe login github
```

按提示访问 GitHub 授权。

---

### 4️⃣ 发布到 Registry

```bash
.\mcp-publisher.exe publish
```

**成功输出**:
```
✓ Successfully published
✓ Server io.github.libres-coder/parseflow version 1.0.0
```

---

### 5️⃣ 验证

访问: https://registry.modelcontextprotocol.io/

搜索 "parseflow"

---

## 📖 需要详细说明？

查看: [MCP_REGISTRY_PUBLISH_GUIDE.md](MCP_REGISTRY_PUBLISH_GUIDE.md)

---

**总共 5 分钟！开始吧！** 🚀
