/**
 * ParseFlow Core - Document parsing library
 *
 * Exports main API for MCP Server or other applications
 */

// PDF Parser
export { PDFParser } from './parser.js';
export { ImageExtractorExternal } from './extractors/image-extractor-external.js';
export { TOCExtractorExternal } from './extractors/toc-extractor-external.js';

// Word Parser
export { WordParser } from './WordParser.js';
export type {
  WordExtractOptions,
  WordExtractResult,
  WordMetadataResult
} from './WordParser.js';

// Excel Parser
export { ExcelParser } from './ExcelParser.js';
export type {
  ExcelExtractOptions,
  ExcelExtractResult,
  ExcelMetadataResult
} from './ExcelParser.js';

// PowerPoint Parser
export { PowerPointParser } from './PowerPointParser.js';
export type {
  PowerPointExtractOptions,
  PowerPointExtractResult,
  PowerPointMetadataResult,
  PowerPointSearchResult
} from './PowerPointParser.js';

// PDF Types
export type {
  ParserConfig,
  ExtractOptions,
  SearchOptions,
  SearchResult,
  PDFMetadata,
  TOCItem,
  ImageExtractOptions,
} from './types/index.js';
