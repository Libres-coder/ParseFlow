/**
 * TypeScript 类型定义
 */

export interface ServerConfig {
  name: string;
  version: string;
  cache?: {
    enabled?: boolean;
    directory?: string;
    ttl?: number;
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

export interface PDFResourceQuery {
  page?: number;
  range?: string;
  section?: string;
  format?: 'text' | 'markdown' | 'json';
}

export interface ParsedPDFResource {
  uri: string;
  name: string;
  description?: string;
  mimeType: string;
  text?: string;
  metadata?: Record<string, unknown>;
}
