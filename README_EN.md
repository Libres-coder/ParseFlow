# ParseFlow

<div align="center">

**🚀 High-Performance PDF Parsing MCP Server**

[![License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)
[![Node](https://img.shields.io/badge/node-%3E%3D18.0.0-brightgreen.svg)](https://nodejs.org)
[![MCP](https://img.shields.io/badge/MCP-1.0-purple.svg)](https://modelcontextprotocol.io)
[![Version](https://img.shields.io/badge/version-1.0.0-orange.svg)](CHANGELOG.md)

[中文](README.md) | **English**

</div>

---

## 📖 Overview

ParseFlow is a high-performance **MCP (Model Context Protocol) Server** for PDF document parsing and analysis, designed specifically for AI assistants in **Windsurf** and **Cursor** IDEs.

Through MCP protocol, AI can directly call ParseFlow tools to:

- 📄 Extract text content from PDF files
- 🔍 Search for keywords in PDFs
- 📊 Get PDF metadata (title, author, pages, dates, etc.)
- 🎯 Support multiple extraction strategies (raw, formatted, clean)

---

## ✨ Key Features

### 🎯 Core Capabilities

- **Fast PDF Parsing**: Extract text content in seconds
- **Intelligent Search**: Keyword search with context snippets
- **Metadata Extraction**: Get complete PDF file information
- **Multiple Strategies**: Support raw, formatted, and clean text extraction
- **Large File Support**: Handle PDFs up to 50MB (configurable)

### 🔌 MCP Integration

- **Windsurf Support**: Native MCP integration, automatic tool recognition
- **Cursor Support**: MCP support in Agent mode
- **Real-time Interaction**: AI directly calls PDF parsing tools
- **No Manual Operations**: Fully automated PDF processing

### 💪 Technical Advantages

- **TypeScript Development**: Type-safe, maintainable
- **Monorepo Architecture**: Clear modular structure
- **Comprehensive Testing**: Unit and integration tests
- **Complete Documentation**: Detailed guides and API reference

---

## 🚀 Quick Start

### Prerequisites

- Node.js >= 18.0.0
- pnpm >= 8.0.0
- Windsurf or Cursor IDE

### Installation

```bash
# 1. Clone repository
git clone https://github.com/Libres-coder/ParseFlow.git
cd ParseFlow

# 2. Install dependencies
pnpm install

# 3. Build project
pnpm build
```

### Configuration

Choose your IDE:

#### Option 1: Windsurf (Recommended)

```bash
# Run auto-configuration script
.\scripts\setup-windsurf.ps1
```

**Or configure manually**:

1. Open Windsurf settings
2. Find MCP Server configuration
3. Add ParseFlow configuration (see [Windsurf Setup Guide](docs/en/setup/windsurf.md))

#### Option 2: Cursor

```bash
# Run auto-configuration script
.\scripts\setup-cursor.ps1
```

**Or configure manually**:

1. Edit `C:\Users\<username>\.cursor\mcp.json`
2. Add ParseFlow configuration (see [Cursor Setup Guide](docs/en/setup/cursor.md))

### Testing

Restart your IDE and try in the chat:

**In Windsurf**:

```
Extract text from D:\document.pdf
```

**In Cursor** (Agent mode):

```
Use parseflow tool to extract text from D:\document.pdf
```

---

## 📚 Documentation

### 📖 User Guides

- [Quick Start](docs/en/guides/quick-start.md) - Get started in 5 minutes
- [FAQ](docs/en/guides/faq.md) - Frequently asked questions
- [Examples](docs/en/guides/examples.md) - Code examples and best practices

### ⚙️ Setup Guides

- [Windsurf Setup](docs/en/setup/windsurf.md) - Windsurf IDE configuration (Recommended)
- [Cursor Setup](docs/en/setup/cursor.md) - Cursor IDE configuration

### 🛠️ Development Documentation

- [API Reference](docs/en/development/api.md) - Complete API documentation
- [Architecture](docs/en/development/architecture.md) - System architecture
- [Development Guide](docs/en/development/development.md) - How to contribute
- [Naming Conventions](docs/en/development/naming-conventions.md) - Code standards

### 📋 Project Planning

- [TODO](docs/en/planning/todo.md) - Feature roadmap
- [Distribution Analysis](docs/en/planning/distribution-analysis.md) - Release plans

### 📂 Documentation Index

- [Complete Documentation](docs/en/README.md) - Full documentation index

---

## 🎯 Usage Examples

### Text Extraction

```
Q: Extract text from D:\report.pdf
A: [Parsed text content...]
```

### Keyword Search

```
Q: Search for "contract" in D:\document.pdf
A: Found 3 results:
   Page 1: ...contract terms...
   Page 3: ...contract signed...
   Page 5: ...contract expires...
```

### Metadata Retrieval

```
Q: What's the author of D:\document.pdf?
A: Author: Unknown, Created: 2025-01-15
```

---

## 🛠️ Project Structure

```
ParseFlow/
├── packages/
│   ├── mcp-server/              # MCP Server
│   │   ├── src/
│   │   │   ├── index.ts         # Entry point
│   │   │   ├── server.ts        # MCP Server core
│   │   │   ├── tools/           # MCP tools
│   │   │   ├── resources/       # MCP resources
│   │   │   └── utils/           # Utilities
│   │   └── dist/                # Build output
│   └── pdf-parser-core/         # PDF parsing core
│       ├── src/
│       │   ├── parser.ts        # Main parser
│       │   ├── extractors/      # Text extractors
│       │   ├── search/          # Search functionality
│       │   └── types/           # Type definitions
│       └── dist/                # Build output
├── docs/                        # Documentation
│   ├── zh/                      # Chinese docs
│   └── en/                      # English docs
├── examples/                    # Usage examples
├── tests/                       # Test files
└── scripts/                     # Utility scripts
```

---

## 🔧 MCP Tools

ParseFlow provides the following MCP tools:

| Tool           | Description            | Parameters                                       |
| -------------- | ---------------------- | ------------------------------------------------ |
| `extract_text` | Extract text from PDF  | `path`, `page?`, `range?`, `strategy?`           |
| `get_metadata` | Get PDF metadata       | `path`                                           |
| `search_pdf`   | Search keywords in PDF | `path`, `query`, `caseSensitive?`, `maxResults?` |

For detailed API documentation, see [API Reference](docs/en/development/api.md)

---

## 🚀 Future Plans

### High Priority

#### ⭐ MCP Marketplace Release

Enable one-click installation of ParseFlow!

**Plans**:

- Publish to npm
- Submit to official MCP Registry
- Automated installation and configuration

**Priority**: ⭐⭐⭐⭐⭐

#### ⭐ VSCode Extension

Improve installation and usage experience

**Features**:

- One-click installation
- Automatic version management
- Status monitoring UI

**Note**: VSCode extension can only improve installation experience, not change AI's tool selection behavior

**Priority**: ⭐⭐⭐⭐

### Planned

- Table of Contents (TOC) extraction
- Image export functionality
- Advanced search features
- Performance optimization

### Future Considerations

- OCR support (for scanned documents)
- AI document analysis
- More IDE integrations

**Detailed Roadmap**: [docs/en/planning/todo.md](docs/en/planning/todo.md)  
**Technical Analysis**: [docs/en/planning/distribution-analysis.md](docs/en/planning/distribution-analysis.md)

---

## 🤝 Contributing

Contributions welcome! Please see [CONTRIBUTING.md](CONTRIBUTING.md)

### Contribution Process

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 🐛 Issue Reporting

If you encounter problems:

1. Check [docs/en/guides/faq.md](docs/en/guides/faq.md) for common issues
2. Check [logs/parseflow.log](logs/) log file
3. Submit an [Issue](https://github.com/Libres-coder/ParseFlow/issues)

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details

---

## 🙏 Acknowledgments

- [Model Context Protocol](https://modelcontextprotocol.io) - MCP protocol standard
- [pdf-parse](https://www.npmjs.com/package/pdf-parse) - PDF text extraction library
- Windsurf Community - Testing and feedback

---

## 📮 Resources

- [MCP Protocol Documentation](https://modelcontextprotocol.io)
- [Windsurf IDE](https://codeium.com/windsurf)
- [Project Documentation](docs/en/)

---

<div align="center">

**Made with ❤️ by ParseFlow Team**

</div>
