# ParseFlow MCP Server

[![npm version](https://img.shields.io/npm/v/parseflow-mcp-server.svg)](https://www.npmjs.com/package/parseflow-mcp-server)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

Model Context Protocol (MCP) server for comprehensive PDF parsing and analysis.

## 🚀 Features

- **Text Extraction**: Extract text from PDF files with multiple formatting strategies
- **Metadata Retrieval**: Get PDF document information (title, author, pages, etc.)
- **Keyword Search**: Search for specific text within PDF documents
- **Image Extraction**: Extract images from PDF files (requires poppler-utils)
- **Table of Contents**: Get bookmarks and navigation structure

## 📦 Installation

### Global Installation (Recommended for MCP)

```bash
npm install -g parseflow-mcp-server
```

### Local Installation

```bash
npm install parseflow-mcp-server
```

## 🔧 Usage

### With Claude Desktop

Add to your Claude Desktop configuration file:

**macOS**: `~/Library/Application Support/Claude/claude_desktop_config.json`  
**Windows**: `%APPDATA%\Claude\claude_desktop_config.json`

```json
{
  "mcpServers": {
    "parseflow": {
      "command": "parseflow"
    }
  }
}
```

### With Windsurf / Cursor

Add to your MCP settings:

```json
{
  "mcpServers": {
    "parseflow": {
      "command": "parseflow",
      "args": []
    }
  }
}
```

### Standalone Usage

```bash
# Run the server
parseflow

# Or with custom options
node /path/to/parseflow-mcp-server/dist/index.js
```

## 🛠️ Available Tools

When connected via MCP, the following tools are available:

### 1. `extract_text`
Extract text content from PDF files.

**Parameters**:
- `path` (string, required): Absolute path to PDF file
- `page` (number, optional): Extract specific page
- `range` (string, optional): Extract page range (e.g., "1-10")
- `strategy` (string, optional): Extraction strategy - `raw`, `formatted`, or `clean`

### 2. `get_metadata`
Get PDF document metadata and properties.

**Parameters**:
- `path` (string, required): Absolute path to PDF file

### 3. `search_pdf`
Search for keywords or phrases within a PDF.

**Parameters**:
- `path` (string, required): Absolute path to PDF file
- `query` (string, required): Search term or phrase
- `caseSensitive` (boolean, optional): Case-sensitive search (default: false)
- `maxResults` (number, optional): Maximum results to return (default: 10)

### 4. `extract_images`
Extract images from PDF files (requires poppler-utils).

**Parameters**:
- `path` (string, required): Absolute path to PDF file
- `outputDir` (string, required): Directory to save extracted images
- `format` (string, optional): Output format - `png` or `jpg` (default: png)

### 5. `get_toc`
Get table of contents (bookmarks) from PDF.

**Parameters**:
- `path` (string, required): Absolute path to PDF file

## 📋 Requirements

- **Node.js**: >= 18.0.0
- **poppler-utils** (optional, for image extraction):
  - macOS: `brew install poppler`
  - Ubuntu/Debian: `apt-get install poppler-utils`
  - Windows: Download from [poppler releases](https://github.com/oschwartz10612/poppler-windows/releases)

## 🔗 Related Packages

- **[parseflow-core](https://www.npmjs.com/package/parseflow-core)**: Core PDF parsing library
- Use `parseflow-core` directly if you want to integrate PDF parsing into your Node.js applications

## 📖 Documentation

Full documentation: [https://github.com/Libres-coder/ParseFlow](https://github.com/Libres-coder/ParseFlow)

## 🐛 Bug Reports

Report issues: [https://github.com/Libres-coder/ParseFlow/issues](https://github.com/Libres-coder/ParseFlow/issues)

## 📄 License

MIT © [Libres-coder](https://github.com/Libres-coder)

## 🌟 MCP Registry

Find this server on the official MCP Registry:  
[https://registry.modelcontextprotocol.io/](https://registry.modelcontextprotocol.io/)

Search for: **parseflow**
