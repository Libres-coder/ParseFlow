# Release Notes for v1.0.2

**发布日期**: 2025-12-03  
**标签**: v1.0.2

---

## 🎉 What's New in v1.0.2

### ✨ New Features
- **Added Complete README for MCP Server**
  - Installation guide for Claude Desktop, Windsurf, and Cursor
  - API reference for all 5 tools
  - Usage examples and requirements
  - Quick start instructions

### 🧹 Project Improvements
- **Major Cleanup**: Removed 60+ temporary files (~19 MB)
- **Security**: Removed all sensitive tokens from Git history
- **Organization**: Improved project structure and documentation
- **Documentation**: Only essential docs remain (9 core files)

### 📦 Published Packages

#### parseflow-core@1.0.1
- Core PDF parsing library
- https://www.npmjs.com/package/parseflow-core

#### parseflow-mcp-server@1.0.2 (NEW)
- MCP server with complete documentation
- https://www.npmjs.com/package/parseflow-mcp-server
- Now includes comprehensive README

### 🌐 MCP Registry
- **Server Name**: io.github.Libres-coder/parseflow
- **Version**: 1.0.2
- **Search**: https://registry.modelcontextprotocol.io/

---

## 📖 Documentation

### Quick Start

**Install MCP Server:**
```bash
npm install -g parseflow-mcp-server
```

**Configure in Claude Desktop:**
```json
{
  "mcpServers": {
    "parseflow": {
      "command": "parseflow"
    }
  }
}
```

### Features
- ✅ Text extraction from PDFs
- ✅ Metadata retrieval (title, author, pages, etc.)
- ✅ Keyword search within documents
- ✅ Image extraction (requires poppler-utils)
- ✅ Table of contents extraction

---

## 🔗 Links

- **GitHub Repository**: https://github.com/Libres-coder/ParseFlow
- **npm (core)**: https://www.npmjs.com/package/parseflow-core
- **npm (server)**: https://www.npmjs.com/package/parseflow-mcp-server
- **MCP Registry**: https://registry.modelcontextprotocol.io/
- **Documentation**: [README.md](README.md) | [README_EN.md](README_EN.md)
- **Examples**: [examples/](examples/)

---

## 📝 Changelog

### Added
- Complete README.md for parseflow-mcp-server package
- PROJECT_STATUS.md - Project status and roadmap
- CLEANUP_COMPLETE.md - Cleanup report

### Changed
- Updated .gitignore with better rules for tokens and binaries
- Improved project organization

### Removed
- 43 empty markdown files (0 bytes)
- 6 temporary test files
- 2 sensitive token files
- 3 binary files (18.6 MB)
- 6 outdated documentation files

### Fixed
- Removed sensitive information from Git history
- Fixed npm package description warning

---

## 🎯 What's Next

- Monitor user feedback and GitHub issues
- Collect download statistics
- Plan community promotion
- Consider adding more PDF features in v1.1.0

---

## 🙏 Acknowledgments

Thank you to the Model Context Protocol community for the excellent framework and tools!

---

**Full Changelog**: https://github.com/Libres-coder/ParseFlow/blob/main/CHANGELOG.md
