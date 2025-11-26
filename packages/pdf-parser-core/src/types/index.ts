/**
 * 类型定义
 */

export interface ParserConfig {
  cache?: {
    enabled?: boolean;
    ttl?: number;
    maxSize?: number;
    directory?: string;
  };
  parser?: {
    preserveFormatting?: boolean;
    includeHeaders?: boolean;
    includeFooters?: boolean;
  };
  security?: {
    maxFileSize?: number;
    allowedPaths?: string[];
  };
  ocr?: {
    enabled?: boolean;
    language?: string;
  };
}

export interface ExtractOptions {
  strategy?: 'raw' | 'formatted' | 'clean';
  preserveFormatting?: boolean;
  includeHeaders?: boolean;
  includeFooters?: boolean;
}

export interface SearchOptions {
  caseSensitive?: boolean;
  maxResults?: number;
  contextLength?: number;
}

export interface SearchResult {
  page: number;
  snippet: string;
  context: string;
  position: number;
}

export interface PDFMetadata {
  info: {
    Title?: string;
    Author?: string;
    Subject?: string;
    Keywords?: string;
    Creator?: string;
    Producer?: string;
    CreationDate?: Date;
    ModDate?: Date;
  };
  metadata: {
    pageCount: number;
    fileSize: number;
    pdfVersion: string;
    isEncrypted: boolean;
  };
}

export interface TOCItem {
  title: string;
  page: number;
  level: number;
  children?: TOCItem[];
}

export interface ImageExtractOptions {
  format?: 'png' | 'jpg';
  minWidth?: number;
  minHeight?: number;
}

export interface CachedData {
  text?: string;
  metadata?: PDFMetadata;
  toc?: TOCItem[];
  timestamp: number;
}
