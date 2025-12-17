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

// OCR Parser
export { OCRParser } from './OCRParser.js';
export type {
  OCRExtractOptions,
  OCRExtractResult,
  OCRSearchResult
} from './OCRParser.js';

// PDF Utils
export { PDFUtils } from './PDFUtils.js';
export type {
  MergeOptions,
  SplitOptions,
  PDFUtilsResult
} from './PDFUtils.js';

// Semantic Search
export { SemanticSearch } from './SemanticSearch.js';
export type {
  SemanticSearchOptions,
  SemanticSearchResult,
  DocumentChunk
} from './SemanticSearch.js';

// Batch Processor
export { BatchProcessor } from './BatchProcessor.js';
export type {
  BatchFileResult,
  BatchResult,
  BatchOptions
} from './BatchProcessor.js';

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
