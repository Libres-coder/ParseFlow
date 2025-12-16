# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Planned

- OCR support with Tesseract.js
- Semantic search with vector embeddings
- PDF merge/split functionality
- PDF encryption/decryption
- Performance optimization with streaming and parallel processing

## [1.2.0] - 2025-12-16

### 🎉 PowerPoint Support Release

#### ✨ New Features

- ✅ **PowerPoint (pptx) Support**
  - Slide text extraction with node-pptx-parser
  - Per-slide extraction
  - Text search across slides with context
  - Presentation metadata retrieval
  - MCP tools: `extract_powerpoint`, `search_powerpoint`

#### 📦 New Packages

- `PowerPointParser` - Complete PowerPoint presentation parsing

#### 🔧 Dependencies

- Added `node-pptx-parser@^1.0.1` for PowerPoint parsing

#### 📝 Documentation

- Updated README.md (Chinese)
- Updated README_EN.md (English)
- Added PowerPoint examples

#### 🔢 Total MCP Tools: 11

- PDF: 5 tools
- Word: 2 tools
- Excel: 2 tools
- PowerPoint: 2 tools

## [1.1.0] - 2025-12-03

### 🎉 Major Feature Release - Office Documents Support

#### ✨ New Features

- ✅ **Word (docx) Support**
  - Text extraction with mammoth
  - HTML conversion
  - Document metadata retrieval
  - Text search with context
  - MCP tools: `extract_word`, `search_word`

- ✅ **Excel (xlsx/xls) Support**
  - Multi-sheet data extraction
  - Multiple output formats (JSON, CSV, Text)
  - Sheet-specific extraction
  - Cell-based search with coordinates
  - Range extraction
  - Workbook metadata
  - MCP tools: `extract_excel`, `search_excel`

#### 📦 New Packages

- `WordParser` - Complete Word document parsing
- `ExcelParser` - Complete Excel spreadsheet parsing

#### 🔧 Dependencies

- Added `mammoth@^1.11.0` for Word parsing
- Added `xlsx@^0.18.5` for Excel parsing

#### 📚 Documentation

- Added `OFFICE_EXAMPLES.md` with comprehensive usage examples
- Updated `README.md` with Office documents support
- Created test suite `test-office-docs.ts`
- Added test files (Word测试文件.docx, Excel测试文件.xlsx)

#### 🛠️ MCP Server

- Total tools increased from 5 to 9
- 5 PDF tools (existing)
- 2 Word tools (new)
- 2 Excel tools (new)

#### 🧹 Cleanup

- Removed 8 redundant documentation files (~35 KB)
- Simplified `PROJECT_STATUS.md`
- Improved project organization

#### 🐛 Bug Fixes

- Fixed Excel metadata extraction reliability
- Added null checks for sheet names
- Improved error handling for malformed files

## [1.0.0] - 2025-11-28

### 🎉 Major Release - All Core Features Completed

#### ✨ New Features

- ✅ **Image Extraction** - Extract images from PDF using poppler-utils (pdfimages)
  - Support PNG and JPG formats
  - Customizable output directory
  - Size filtering options
  - Windows/Linux/macOS support

- ✅ **Table of Contents (TOC) Extraction** - Extract PDF bookmarks and outline structure
  - Support pdftk (full features) and pdfinfo (basic)
  - Hierarchical TOC structure
  - Page number resolution
  - External tool integration

- ✅ **External Tools Integration**
  - `ImageExtractorExternal` - Image extraction via pdfimages
  - `TOCExtractorExternal` - TOC extraction via pdftk/pdfinfo
  - Automatic tool detection
  - Cross-platform support (Windows PowerShell, Linux, macOS)
  - Custom path configuration

#### 🔧 Improvements

- ✅ **Windows Compatibility**
  - PowerShell execution support
  - Environment variable inheritance fix
  - Custom tool path configuration

- ✅ **Testing**
  - Real PDF testing validation
  - 52 unit tests (100% passing)
  - Integration tests for external tools
  - 83.6% code coverage

- ✅ **Documentation**
  - External tools installation guide
  - Windows/Linux/macOS setup instructions
  - Complete API documentation
  - Usage examples and best practices

#### 📦 Technical Details

- **Dependencies**: 
  - Added `pdf-lib@1.17.1` for PDF operations
  - Removed `pdfjs-dist` (Node.js compatibility issues)
- **Architecture**: Monorepo with `pdf-parser-core` and `mcp-server`
- **Quality**: ESLint 0 errors, TypeScript strict mode
- **Platform**: Full Windows/Linux/macOS support

#### 🏗️ Architecture Updates

- Enhanced core library with external tool support
- Improved error messages and user guidance
- Better path handling for Windows environments
- Flexible configuration for external tools

### 📝 Breaking Changes

None - All changes are backward compatible

### 🐛 Bug Fixes

- Fixed Windows environment variable inheritance in Node.js processes
- Fixed `.gitignore` null byte issue
- Resolved Jest/pdfjs-dist ESM compatibility problems

### 🔄 Deprecated

- Direct pdfjs-dist integration (moved to external tools approach)

## [0.9.0] - 2025-11-26

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
[0.9.0]: https://github.com/Libres-coder/ParseFlow/releases/tag/v0.9.0
