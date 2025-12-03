import * as XLSX from 'xlsx';
import * as fs from 'fs/promises';
import * as path from 'path';

/**
 * Options for Excel data extraction
 */
export interface ExcelExtractOptions {
  /**
   * Specific sheet name to extract (if not provided, all sheets are extracted)
   */
  sheetName?: string;

  /**
   * Sheet index to extract (0-based)
   */
  sheetIndex?: number;

  /**
   * Include empty cells in output
   * @default false
   */
  includeEmptyCells?: boolean;

  /**
   * Format for output
   * @default 'json'
   */
  format?: 'json' | 'csv' | 'html' | 'text';
}

/**
 * Result of Excel data extraction
 */
export interface ExcelExtractResult {
  /**
   * Sheet name
   */
  sheetName: string;

  /**
   * Extracted data (format depends on options)
   */
  data: any;

  /**
   * Number of rows
   */
  rowCount: number;

  /**
   * Number of columns
   */
  columnCount: number;
}

/**
 * Result of Excel metadata extraction
 */
export interface ExcelMetadataResult {
  fileName: string;
  filePath: string;
  fileSize: number;
  lastModified: Date;
  sheetNames: string[];
  sheetCount: number;
  properties?: {
    [key: string]: any;
  };
}

/**
 * Parser for Excel (xlsx/xls) documents
 */
export class ExcelParser {
  /**
   * Extract data from an Excel file
   * 
   * @param filePath - Absolute path to the Excel file
   * @param options - Extraction options
   * @returns Extracted data from sheet(s)
   * 
   * @example
   * ```typescript
   * const parser = new ExcelParser();
   * const results = await parser.extractData('spreadsheet.xlsx');
   * console.log(results[0].data);
   * ```
   */
  async extractData(
    filePath: string,
    options: ExcelExtractOptions = {}
  ): Promise<ExcelExtractResult[]> {
    const {
      sheetName,
      sheetIndex,
      includeEmptyCells = false,
      format = 'json'
    } = options;

    try {
      // Read the workbook
      const buffer = await fs.readFile(filePath);
      const workbook = XLSX.read(buffer, { type: 'buffer' });

      const results: ExcelExtractResult[] = [];

      // Determine which sheets to process
      let sheetsToProcess: string[] = [];
      
      if (sheetName) {
        if (workbook.SheetNames.includes(sheetName)) {
          sheetsToProcess = [sheetName];
        } else {
          throw new Error(`Sheet "${sheetName}" not found in workbook`);
        }
      } else if (sheetIndex !== undefined) {
        if (sheetIndex >= 0 && sheetIndex < workbook.SheetNames.length) {
          sheetsToProcess = [workbook.SheetNames[sheetIndex]];
        } else {
          throw new Error(`Sheet index ${sheetIndex} out of range`);
        }
      } else {
        // Process all sheets
        sheetsToProcess = workbook.SheetNames;
      }

      // Process each sheet
      for (const name of sheetsToProcess) {
        const worksheet = workbook.Sheets[name];
        
        let data: any;
        switch (format) {
          case 'json':
            data = XLSX.utils.sheet_to_json(worksheet, { 
              defval: includeEmptyCells ? null : undefined 
            });
            break;
          case 'csv':
            data = XLSX.utils.sheet_to_csv(worksheet);
            break;
          case 'html':
            data = XLSX.utils.sheet_to_html(worksheet);
            break;
          case 'text':
            data = XLSX.utils.sheet_to_txt(worksheet);
            break;
          default:
            data = XLSX.utils.sheet_to_json(worksheet);
        }

        // Get range info
        const range = XLSX.utils.decode_range(worksheet['!ref'] || 'A1');
        const rowCount = range.e.r - range.s.r + 1;
        const columnCount = range.e.c - range.s.c + 1;

        results.push({
          sheetName: name,
          data,
          rowCount,
          columnCount
        });
      }

      return results;
    } catch (error) {
      throw new Error(
        `Failed to extract data from Excel file: ${
          error instanceof Error ? error.message : String(error)
        }`
      );
    }
  }

  /**
   * Extract text from all sheets
   * 
   * @param filePath - Absolute path to the Excel file
   * @returns Concatenated text from all sheets
   */
  async extractText(filePath: string): Promise<string> {
    const results = await this.extractData(filePath, { format: 'text' });
    return results
      .map(r => `=== ${r.sheetName} ===\n${r.data}`)
      .join('\n\n');
  }

  /**
   * Get metadata from an Excel file
   * 
   * @param filePath - Absolute path to the Excel file
   * @returns Workbook metadata
   * 
   * @example
   * ```typescript
   * const parser = new ExcelParser();
   * const metadata = await parser.getMetadata('spreadsheet.xlsx');
   * console.log(metadata.sheetNames);
   * ```
   */
  async getMetadata(filePath: string): Promise<ExcelMetadataResult> {
    try {
      const stats = await fs.stat(filePath);
      const buffer = await fs.readFile(filePath);
      const workbook = XLSX.read(buffer, { type: 'buffer' });

      return {
        fileName: path.basename(filePath),
        filePath: path.resolve(filePath),
        fileSize: stats.size,
        lastModified: stats.mtime,
        sheetNames: workbook.SheetNames || [],
        sheetCount: (workbook.SheetNames || []).length,
        properties: {
          extension: path.extname(filePath),
          props: workbook.Props || {}
        }
      };
    } catch (error) {
      throw new Error(
        `Failed to get Excel file metadata: ${
          error instanceof Error ? error.message : String(error)
        }`
      );
    }
  }

  /**
   * Search for text in an Excel file
   * 
   * @param filePath - Absolute path to the Excel file
   * @param query - Search query
   * @param caseSensitive - Whether the search should be case-sensitive
   * @returns Array of matches with sheet name, cell reference, and value
   */
  async searchText(
    filePath: string,
    query: string,
    caseSensitive: boolean = false
  ): Promise<Array<{ 
    sheetName: string; 
    cellRef: string; 
    value: string; 
    row: number;
    col: number;
  }>> {
    const buffer = await fs.readFile(filePath);
    const workbook = XLSX.read(buffer, { type: 'buffer' });
    const results: Array<{ 
      sheetName: string; 
      cellRef: string; 
      value: string;
      row: number;
      col: number;
    }> = [];

    const searchQuery = caseSensitive ? query : query.toLowerCase();

    // Search in all sheets
    for (const sheetName of workbook.SheetNames) {
      const worksheet = workbook.Sheets[sheetName];
      const range = XLSX.utils.decode_range(worksheet['!ref'] || 'A1');

      // Iterate through all cells
      for (let row = range.s.r; row <= range.e.r; row++) {
        for (let col = range.s.c; col <= range.e.c; col++) {
          const cellRef = XLSX.utils.encode_cell({ r: row, c: col });
          const cell = worksheet[cellRef];

          if (cell && cell.v) {
            const cellValue = String(cell.v);
            const searchValue = caseSensitive ? cellValue : cellValue.toLowerCase();

            if (searchValue.includes(searchQuery)) {
              results.push({
                sheetName,
                cellRef,
                value: cellValue,
                row: row + 1, // 1-based for user-friendly output
                col: col + 1
              });
            }
          }
        }
      }
    }

    return results;
  }

  /**
   * Get specific sheet names
   * 
   * @param filePath - Absolute path to the Excel file
   * @returns Array of sheet names
   */
  async getSheetNames(filePath: string): Promise<string[]> {
    const buffer = await fs.readFile(filePath);
    const workbook = XLSX.read(buffer, { type: 'buffer' });
    return workbook.SheetNames || [];
  }

  /**
   * Extract specific cells by range
   * 
   * @param filePath - Absolute path to the Excel file
   * @param sheetName - Sheet name
   * @param range - Cell range (e.g., 'A1:C10')
   * @returns Data from specified range
   */
  async extractRange(
    filePath: string,
    sheetName: string,
    range: string
  ): Promise<any[]> {
    const buffer = await fs.readFile(filePath);
    const workbook = XLSX.read(buffer, { type: 'buffer' });

    if (!workbook.SheetNames.includes(sheetName)) {
      throw new Error(`Sheet "${sheetName}" not found`);
    }

    const worksheet = workbook.Sheets[sheetName];
    const data = XLSX.utils.sheet_to_json(worksheet, { range });

    return data;
  }
}
