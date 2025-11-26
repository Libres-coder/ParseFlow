# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Planned

- Image extraction using pdfjs-dist
- Table of Contents (TOC) extraction
- OCR support with Tesseract.js
- Semantic search with vector embeddings
- Performance optimization with streaming and parallel processing

## [1.0.0] - 2025-11-26

### Added

- Initial release of ParseFlow MCP Server
- **Local deployment only** - Configure via `mcp_config.json`, not available in public registries
- MCP Server implementation for Windsurf IDE integration
- PDF Parser Core library
- Text extraction with multiple strategies (raw, formatted, clean)
- Metadata extraction (title, author, page count, etc.)
- Keyword search functionality
- Page and range extraction
- MCP Resources and Tools API
- Comprehensive documentation (Architecture, API, Development guides)
- Example code and usage samples
- TypeScript support with strict mode
- ESLint and Prettier configuration
- Jest testing framework setup
- Monorepo structure with pnpm workspaces

### Features

- **Text Extraction**: Extract text from PDF files with preservation options
- **Metadata Reading**: Get PDF information like title, author, creation date
- **Search**: Find keywords in PDF documents with context
- **Page Selection**: Extract specific pages or page ranges
- **Caching**: Built-in caching mechanism for improved performance
- **Security**: Path validation and file size limits
- **Logging**: Winston-based logging system
- **Error Handling**: Comprehensive error handling with custom error codes

### Technical Details

- Node.js >= 18.0.0
- TypeScript 5.3+
- MCP Protocol 1.0
- pdf-parse for text extraction
- pdfjs-dist for advanced features (planned)

### Documentation

- README with quick start guide
- Architecture design document
- Complete API documentation
- Development guide with setup instructions
- Contributing guidelines
- MIT License

[Unreleased]: https://github.com/Libres-coder/ParseFlow/compare/v1.0.0...HEAD
[1.0.0]: https://github.com/Libres-coder/ParseFlow/releases/tag/v1.0.0
