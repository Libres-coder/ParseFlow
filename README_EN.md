# ParseFlow

<div align="center">

**🚀 High-Performance PDF Parsing MCP Server**

[![CI](https://github.com/Libres-coder/ParseFlow/actions/workflows/ci.yml/badge.svg)](https://github.com/Libres-coder/ParseFlow/actions/workflows/ci.yml)
[![License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)
[![Node](https://img.shields.io/badge/node-%3E%3D18.0.0-brightgreen.svg)](https://nodejs.org)
[![MCP](https://img.shields.io/badge/MCP-1.0-purple.svg)](https://modelcontextprotocol.io)
[![Version](https://img.shields.io/badge/version-1.0.0-orange.svg)](CHANGELOG.md)

[中文](README.md) | **English**

</div>

---

## ⚡ Quick Overview

> **3 Key Features**

✅ **Automatic Recognition** - No manual tool selection, AI automatically calls PDF parsing functions  
✅ **Dynamic Path Passing** - No hardcoding, specify different PDF files each time  
✅ **Local Deployment** - Deploy locally via configuration files, full data control

**Usage Example**:

```
In Windsurf, simply say:
"Analyze D:\report.pdf"
"How many pages does this PDF have?"
"Search for 'breach of contract' in the contract"
```

---

## 📖 Overview

ParseFlow is a high-performance **MCP (Model Context Protocol) Server** for PDF document parsing and analysis, designed specifically for AI assistants in **Windsurf** and **Cursor** IDEs.

### Core Features

- 📄 **Text Extraction**: Extract PDF text content with pagination and range support ✅
- 📊 **Metadata Reading**: Get title, author, page count, creation date, etc. ✅
- 🔍 **Keyword Search**: Search for specific content in PDFs ✅
- 🖼️ **Image Extraction**: Export images from PDFs (requires poppler-utils) ✅
- 📑 **Table of Contents**: Extract PDF bookmarks and TOC structure (requires pdftk/pdfinfo) ✅

### Technical Features

- ✅ **MCP Protocol Support**: Standard MCP Tools implementation
- ✅ **TypeScript Development**: Type-safe, maintainable
- ✅ **Monorepo Architecture**: Separate core library and server
- ✅ **Local Deployment**: Data stays local, secure and controllable

---

## 🏗️ Architecture

```
┌─────────────────────────────────────┐
│          Windsurf IDE               │
│       (MCP Client / Cascade)        │
└──────────────┬──────────────────────┘
               │ MCP Protocol (stdio)
┌──────────────▼──────────────────────┐
│      ParseFlow MCP Server           │
│  ┌─────────────────────────────┐   │
│  │   MCP Tools                 │   │
│  │  • extract_text         ✅  │   │
│  │  • search_pdf           ✅  │   │
│  │  • get_metadata         ✅  │   │
│  │  • extract_images       ✅  │   │
│  │  • get_toc              ✅  │   │
│  └─────────────────────────────┘   │
└──────────────┬──────────────────────┘
               │
┌──────────────▼──────────────────────┐
│    PDF Parser Core Library          │
│  • pdf-parse (text/metadata)        │
│  • pdf-lib (PDF operations)         │
│  • Keyword search engine            │
│  • External tools (optional)        │
│    - pdfimages (image extraction)   │
│    - pdftk/pdfinfo (TOC extraction) │
└─────────────────────────────────────┘
```

---

## 🚀 Quick Start

### Prerequisites

- Node.js >= 18.0.0
- pnpm >= 8.0.0
- Windsurf or Cursor IDE

### Optional Tools (for Image and TOC Extraction)

If you need image extraction and table of contents extraction features, please install:

**Windows**:
- [Poppler](https://github.com/oschwartz10612/poppler-windows/releases) - For image and TOC extraction
- Download and add to system PATH (e.g., `D:\poppler\Library\bin`)

**Ubuntu/Debian**:
```bash
sudo apt-get install poppler-utils pdftk
```

**macOS**:
```bash
brew install poppler pdftk-java
```

> 💡 You can still use text extraction, metadata, and search features without installing external tools. See [External Tools Guide](docs/guides/external-tools.md)

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

| Tool              | Description               | Parameters                                       | Status |
| ----------------- | ------------------------- | ------------------------------------------------ | ------ |
| `extract_text`    | Extract text from PDF     | `path`, `page?`, `range?`, `strategy?`           | ✅     |
| `get_metadata`    | Get PDF metadata          | `path`                                           | ✅     |
| `search_pdf`      | Search keywords in PDF    | `path`, `query`, `caseSensitive?`, `maxResults?` | ✅     |
| `extract_images`  | Extract images from PDF   | `path`, `outputDir`, `format?`                   | ✅     |
| `get_toc`         | Get table of contents     | `path`                                           | ✅     |

For detailed API documentation, see [API Reference](docs/en/development/api.md)

---

## 🚀 Future Plans

### ✅ Completed Features (v1.0.0)

- ✅ Text extraction
- ✅ Metadata extraction
- ✅ Keyword search
- ✅ Image extraction (external tool integration)
- ✅ Table of contents extraction (external tool integration)

### High Priority

#### ⭐ npm Package Release

Simplify installation and usage!

**Plans**:

- ✅ Core functionality complete
- ✅ Documentation complete
- ✅ Testing complete
- 📦 Ready to publish to npm
- 🎯 Submit to official MCP Registry

**Priority**: ⭐⭐⭐⭐⭐

#### ⭐ GitHub Release

Complete project release

**Plans**:

- 📋 Create release notes
- 📦 Package distribution
- 🎉 v1.0.0 release

**Priority**: ⭐⭐⭐⭐⭐

### Medium Priority

- 🔄 Performance optimization (large file handling)
- 📊 Advanced search features (fuzzy search, regex)
- 🎨 Better error messages and user feedback

### Future Considerations

- 📸 OCR support (for scanned documents)
- 🤖 AI-powered document analysis
- 🔄 PDF merge/split functionality
- 🔐 PDF encryption/decryption
- 🌐 More IDE integrations

**Detailed Roadmap**: [docs/en/planning/todo.md](docs/en/planning/todo.md)

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
- [pdf-lib](https://www.npmjs.com/package/pdf-lib) - PDF manipulation library
- [Poppler](https://poppler.freedesktop.org/) - PDF rendering library
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
