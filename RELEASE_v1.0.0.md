# ParseFlow v1.0.0 - Production Ready 🎉

**发布日期**: 2025-11-28  
**版本**: v1.0.0  
**状态**: 生产就绪

---

## 🎉 重大发布 - 所有核心功能已完成

ParseFlow v1.0.0 是一个功能完整、生产就绪的 PDF 解析 MCP 服务器，为 AI 编程助手（Windsurf 和 Cursor）提供强大的 PDF 处理能力。

---

## ✨ 新功能

### 🖼️ 图片提取
- 使用 poppler-utils (pdfimages) 提取 PDF 中的图片
- 支持 PNG 和 JPG 格式
- 可自定义输出目录和格式
- 支持尺寸过滤选项
- 跨平台支持 (Windows/Linux/macOS)

### 📑 目录提取
- 提取 PDF 书签和大纲结构
- 支持 pdftk (完整功能) 和 pdfinfo (基础功能)
- 层级化的目录结构
- 自动解析页码
- 外部工具集成

### 🔧 外部工具集成
- `ImageExtractorExternal` - 通过 pdfimages 提取图片
- `TOCExtractorExternal` - 通过 pdftk/pdfinfo 提取目录
- 自动工具检测
- 跨平台支持（Windows PowerShell、Linux、macOS）
- 支持自定义工具路径配置

---

## 📊 完整功能列表

### 核心功能 (100%)

| 功能 | 状态 | 实现方式 |
|------|------|---------|
| 📄 文本提取 | ✅ | pdf-parse |
| 📊 元数据提取 | ✅ | pdf-parse |
| 🔍 关键词搜索 | ✅ | 自研搜索引擎 |
| 🖼️ 图片提取 | ✅ | poppler-utils |
| 📑 目录提取 | ✅ | pdftk/pdfinfo |

---

## 🔧 改进

### Windows 兼容性
- ✅ PowerShell 命令执行支持
- ✅ 环境变量继承问题修复
- ✅ 自定义工具路径配置

### 测试完善
- ✅ 真实 PDF 测试验证
- ✅ 52 个单元测试（100% 通过）
- ✅ 外部工具集成测试
- ✅ 83.6% 代码覆盖率

### 文档完善
- ✅ 外部工具安装指南
- ✅ Windows/Linux/macOS 安装说明
- ✅ 完整的 API 文档
- ✅ 使用示例和最佳实践
- ✅ 中英文文档同步

---

## 📦 技术细节

### 依赖更新
- **新增**: `pdf-lib@1.17.1` - PDF 操作库
- **移除**: `pdfjs-dist` - 由于 Node.js 兼容性问题

### 架构
- **Monorepo**: `pdf-parser-core` + `mcp-server`
- **代码质量**: ESLint 0 错误，TypeScript 严格模式
- **平台支持**: 完整的 Windows/Linux/macOS 支持

### 质量指标
```
✅ 构建: 成功
✅ 测试: 52/52 通过 (100%)
✅ 覆盖率: 83.6%
✅ Lint: 0 错误
✅ TypeScript: 严格模式
```

---

## 🐛 Bug 修复

- 修复 Windows 环境下 Node.js 进程的环境变量继承问题
- 修复 `.gitignore` null 字节问题
- 解决 Jest/pdfjs-dist ESM 兼容性问题
- 删除误提交的编译文件

---

## 🚀 快速开始

### 安装

```bash
# 克隆仓库
git clone https://github.com/Libres-coder/ParseFlow.git
cd ParseFlow

# 安装依赖
pnpm install

# 构建项目
pnpm build
```

### 配置 Windsurf

编辑 `C:\Users\<用户名>\.codeium\windsurf\mcp_config.json`:

```json
{
  "mcpServers": {
    "parseflow": {
      "command": "node",
      "args": ["<项目根目录>\\packages\\mcp-server\\dist\\index.js"],
      "env": {
        "PARSEFLOW_CACHE_DIR": "<项目根目录>\\.cache",
        "PARSEFLOW_MAX_FILE_SIZE": "52428800",
        "PARSEFLOW_ALLOWED_PATHS": "D:\\;C:\\Users"
      }
    }
  }
}
```

### 使用

在 Windsurf 中直接说：
```
分析 D:\report.pdf
这个 PDF 有多少页？
在合同中搜索"违约责任"
```

---

## 📚 文档

### 用户指南
- [快速开始](docs/guides/quick-start.md)
- [常见问题 FAQ](docs/guides/faq.md)
- [使用示例](docs/guides/examples.md)
- [外部工具指南](docs/guides/external-tools.md)

### 开发文档
- [API 文档](docs/development/api.md)
- [架构设计](docs/development/architecture.md)
- [开发指南](docs/development/development.md)
- [测试指南](docs/development/testing.md)

### 配置指南
- [Windsurf 配置](docs/setup/windsurf.md)
- [Cursor 配置](docs/setup/cursor.md)

---

## 💻 系统要求

- **Node.js**: >= 18.0.0
- **pnpm**: >= 8.0.0
- **操作系统**: Windows 10/11, Ubuntu 20.04+, macOS 11+

### 可选工具（用于图片和目录提取）

**Windows**:
```
下载 Poppler: https://github.com/oschwartz10612/poppler-windows/releases
添加到系统 PATH
```

**Ubuntu/Debian**:
```bash
sudo apt-get install poppler-utils pdftk
```

**macOS**:
```bash
brew install poppler pdftk-java
```

---

## 🤝 贡献

欢迎贡献！请查看 [CONTRIBUTING.md](CONTRIBUTING.md)

### 贡献流程

1. Fork 仓库
2. 创建功能分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 开启 Pull Request

---

## 📝 Breaking Changes

无 - 所有更改都向后兼容

---

## 🔄 从旧版本升级

如果你使用的是早期版本：

1. 更新代码
   ```bash
   git pull origin main
   pnpm install
   pnpm build
   ```

2. 重启 IDE（Windsurf/Cursor）

3. 可选：安装外部工具以使用新功能

---

## 🙏 致谢

- [Model Context Protocol](https://modelcontextprotocol.io) - MCP 协议标准
- [pdf-parse](https://www.npmjs.com/package/pdf-parse) - PDF 文本提取库
- [pdf-lib](https://www.npmjs.com/package/pdf-lib) - PDF 操作库
- [Poppler](https://poppler.freedesktop.org/) - PDF 渲染库
- Windsurf 社区 - 测试和反馈

---

## 📄 许可证

本项目采用 MIT 许可证 - 详见 [LICENSE](LICENSE) 文件

---

## 📮 链接

- **GitHub**: https://github.com/Libres-coder/ParseFlow
- **问题反馈**: https://github.com/Libres-coder/ParseFlow/issues
- **讨论区**: https://github.com/Libres-coder/ParseFlow/discussions
- **文档**: [docs/](docs/)

---

<div align="center">

**Made with ❤️ by ParseFlow Team**

**如果这个项目对你有帮助，请给个 ⭐ Star！**

</div>
