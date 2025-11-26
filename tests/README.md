# ParseFlow 测试指南

## 快速测试

### 1. 准备测试 PDF 文件

找一个您系统中的 PDF 文件，例如：
- `D:\documents\report.pdf`
- `C:\Users\YourName\Downloads\manual.pdf`
- 或任何其他 PDF 文件

### 2. 运行基础功能测试

```powershell
# 在项目根目录执行
node tests/test-basic.js <您的PDF文件路径>

# 示例
node tests/test-basic.js D:\documents\report.pdf
```

### 3. 测试内容

测试脚本会验证以下功能：
- ✅ 获取 PDF 元数据（标题、作者、页数等）
- ✅ 提取第一页文本
- ✅ 提取完整文本
- ✅ 搜索关键词

### 4. 预期输出

```
🧪 ParseFlow 基础功能测试

📄 测试文件: D:\documents\report.pdf

1️⃣ 测试获取元数据...
✅ 成功
   - 标题: Annual Report 2024
   - 作者: Finance Team
   - 页数: 50
   - 大小: 5.23 MB
   - PDF 版本: 1.7

2️⃣ 测试提取第一页文本...
✅ 成功
   - 文本长度: 1234 字符
   - 前 100 字符: Annual Report...

3️⃣ 测试提取完整文本...
✅ 成功
   - 总文本长度: 45678 字符

4️⃣ 测试搜索功能...
✅ 找到 5 个结果
   [1] 第 3 页: ...revenue increased...
   [2] 第 7 页: ...revenue breakdown...

🎉 所有测试通过！ParseFlow 工作正常！
```

## MCP Server 测试

### 1. 使用 MCP Inspector

```powershell
# 安装 MCP Inspector（如果没有）
npm install -g @modelcontextprotocol/inspector

# 启动 Inspector 测试 MCP Server
npx @modelcontextprotocol/inspector node packages/mcp-server/dist/index.js
```

### 2. 浏览器测试

打开 http://localhost:5173，您可以：
- 查看可用的 Tools
- 测试 extract_text 工具
- 测试 search_pdf 工具
- 测试 get_metadata 工具

## 单元测试（TODO）

```powershell
# 运行单元测试
pnpm test

# 运行测试并生成覆盖率报告
pnpm test:coverage
```

## 集成测试（TODO）

完整的集成测试正在开发中...

## 故障排除

### 问题 1: 找不到 PDF 文件
```
❌ 错误: ENOENT: no such file or directory
```
**解决**: 确保 PDF 文件路径正确，使用绝对路径

### 问题 2: 无法解析 PDF
```
❌ 错误: Invalid PDF
```
**解决**: 确保 PDF 文件未损坏，尝试用其他 PDF 阅读器打开验证

### 问题 3: 文件过大
```
❌ 错误: File too large
```
**解决**: 默认限制 50MB，可在 `.env` 中修改 `PARSEFLOW_MAX_FILE_SIZE`
