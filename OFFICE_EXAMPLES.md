# 📄 Office Documents Support - Examples

ParseFlow now supports **Word (docx)** and **Excel (xlsx/xls)** files in addition to PDF!

---

## 📚 Table of Contents

- [Word Document Parsing](#word-document-parsing)
- [Excel Spreadsheet Parsing](#excel-spreadsheet-parsing)
- [MCP Server Tools](#mcp-server-tools)
- [Real-world Examples](#real-world-examples)

---

## 📄 Word Document Parsing

### Basic Text Extraction

```typescript
import { WordParser } from 'parseflow-core';

const parser = new WordParser();

// Extract text from Word document
const result = await parser.extractText('report.docx');
console.log(result.text);

// Check for warnings
if (result.warnings) {
  console.log('Warnings:', result.warnings);
}
```

### Extract as HTML

```typescript
// Get HTML version of the document
const html = await parser.extractHTML('document.docx');
console.log(html);
```

### Get Metadata

```typescript
// Get file information
const metadata = await parser.getMetadata('report.docx');
console.log(`File: ${metadata.fileName}`);
console.log(`Size: ${metadata.fileSize} bytes`);
console.log(`Modified: ${metadata.lastModified}`);
```

### Search Text

```typescript
// Search for keywords
const results = await parser.searchText('document.docx', 'important', false);
console.log(`Found ${results.length} matches`);

results.forEach((match, i) => {
  console.log(`[${i + 1}] Position ${match.position}`);
  console.log(`Context: ${match.context}`);
});
```

---

## 📊 Excel Spreadsheet Parsing

### Extract All Data (JSON)

```typescript
import { ExcelParser } from 'parseflow-core';

const parser = new ExcelParser();

// Extract all sheets as JSON
const data = await parser.extractData('spreadsheet.xlsx');

data.forEach(sheet => {
  console.log(`Sheet: ${sheet.sheetName}`);
  console.log(`Size: ${sheet.rowCount} rows × ${sheet.columnCount} cols`);
  console.log('Data:', sheet.data);
});
```

### Extract Specific Sheet

```typescript
// By name
const salesData = await parser.extractData('data.xlsx', {
  sheetName: 'Sales',
  format: 'json'
});

// By index (0-based)
const firstSheet = await parser.extractData('data.xlsx', {
  sheetIndex: 0,
  format: 'json'
});
```

### Export as CSV

```typescript
// Get CSV format
const csv = await parser.extractData('data.xlsx', {
  sheetName: 'Q4 Results',
  format: 'csv'
});

console.log(csv[0].data);
// Output:
// Name,Revenue,Profit
// Product A,1200,450
// Product B,2500,800
```

### Get Sheet Names

```typescript
// List all sheets
const sheets = await parser.getSheetNames('workbook.xlsx');
console.log('Available sheets:', sheets);
// Output: ['Summary', 'Details', 'Charts']
```

### Get Metadata

```typescript
// Get workbook information
const metadata = await parser.getMetadata('data.xlsx');
console.log(`File: ${metadata.fileName}`);
console.log(`Sheets: ${metadata.sheetNames.join(', ')}`);
console.log(`Total sheets: ${metadata.sheetCount}`);
```

### Search in Cells

```typescript
// Search across all sheets
const results = await parser.searchText('data.xlsx', 'revenue', false);

results.forEach(match => {
  console.log(`Sheet: ${match.sheetName}`);
  console.log(`Cell: ${match.cellRef} (Row ${match.row}, Col ${match.col})`);
  console.log(`Value: ${match.value}`);
});
```

### Extract Specific Range

```typescript
// Extract cells A1:C10
const range = await parser.extractRange('data.xlsx', 'Sheet1', 'A1:C10');
console.log(range);
```

---

## 🛠️ MCP Server Tools

When using ParseFlow MCP Server with Claude Desktop or other MCP clients:

### Word Tools

#### `extract_word`
Extract text or HTML from Word documents.

```json
{
  "path": "D:\\documents\\report.docx",
  "format": "text"  // or "html"
}
```

#### `search_word`
Search for text in Word documents.

```json
{
  "path": "D:\\documents\\report.docx",
  "query": "conclusion",
  "caseSensitive": false
}
```

### Excel Tools

#### `extract_excel`
Extract data from Excel spreadsheets.

```json
{
  "path": "D:\\data\\sales.xlsx",
  "sheetName": "Q4",      // Optional
  "format": "json"        // or "csv", "text"
}
```

#### `search_excel`
Search for values in Excel spreadsheets.

```json
{
  "path": "D:\\data\\sales.xlsx",
  "query": "product",
  "caseSensitive": false
}
```

---

## 🌟 Real-world Examples

### Example 1: Extract Sales Report

```typescript
import { ExcelParser } from 'parseflow-core';

const parser = new ExcelParser();

// Read Q4 sales data
const data = await parser.extractData('Q4_Sales.xlsx', {
  sheetName: 'Regional Sales',
  format: 'json'
});

// Calculate total revenue
const totalRevenue = data[0].data.reduce(
  (sum, row) => sum + (row['Revenue'] || 0), 
  0
);

console.log(`Total Q4 Revenue: $${totalRevenue.toLocaleString()}`);
```

### Example 2: Process Multiple Reports

```typescript
import { WordParser } from 'parseflow-core';

const parser = new WordParser();
const reports = ['report1.docx', 'report2.docx', 'report3.docx'];

for (const report of reports) {
  const { text } = await parser.extractText(report);
  const results = await parser.searchText(report, 'risk', false);
  
  console.log(`${report}: ${results.length} risk mentions`);
}
```

### Example 3: Convert Word to HTML

```typescript
import { WordParser } from 'parseflow-core';
import * as fs from 'fs/promises';

const parser = new WordParser();

// Convert document to HTML
const html = await parser.extractHTML('document.docx');

// Add styling and save
const styledHtml = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    body { font-family: Arial, sans-serif; max-width: 800px; margin: 0 auto; }
  </style>
</head>
<body>
  ${html}
</body>
</html>
`;

await fs.writeFile('output.html', styledHtml);
console.log('✅ HTML file created: output.html');
```

### Example 4: Data Validation

```typescript
import { ExcelParser } from 'parseflow-core';

const parser = new ExcelParser();

// Read employee data
const data = await parser.extractData('employees.xlsx', {
  sheetName: 'Active',
  format: 'json'
});

// Validate required fields
const employees = data[0].data;
const invalid = employees.filter(emp => 
  !emp.Name || !emp.Department || !emp.Email
);

if (invalid.length > 0) {
  console.log(`⚠️ Found ${invalid.length} invalid records`);
  invalid.forEach(emp => console.log(emp));
} else {
  console.log('✅ All records valid');
}
```

### Example 5: Search Across Documents

```typescript
import { WordParser, ExcelParser } from 'parseflow-core';

const wordParser = new WordParser();
const excelParser = new ExcelParser();

async function searchInDocuments(query: string) {
  const results = [];
  
  // Search in Word documents
  const wordDocs = ['doc1.docx', 'doc2.docx'];
  for (const doc of wordDocs) {
    const matches = await wordParser.searchText(doc, query, false);
    results.push({ file: doc, type: 'Word', count: matches.length });
  }
  
  // Search in Excel spreadsheets
  const excelDocs = ['data1.xlsx', 'data2.xlsx'];
  for (const doc of excelDocs) {
    const matches = await excelParser.searchText(doc, query, false);
    results.push({ file: doc, type: 'Excel', count: matches.length });
  }
  
  return results;
}

const results = await searchInDocuments('budget');
console.table(results);
```

---

## 📊 Supported Formats

| Format | Extension | Read | Search | Metadata |
|--------|-----------|------|--------|----------|
| Word   | .docx     | ✅   | ✅     | ✅       |
| Excel  | .xlsx     | ✅   | ✅     | ✅       |
| Excel  | .xls      | ✅   | ✅     | ✅       |

---

## 🚀 Performance Tips

1. **Large Files**: For large Excel files, extract specific sheets instead of all sheets
2. **Search**: Use case-sensitive search for faster results if possible
3. **Format**: JSON format is slower but more structured; use CSV for simple data
4. **Caching**: Cache metadata if you need it multiple times

---

## 🐛 Common Issues

### Issue: "Cannot read properties of undefined"
**Solution**: Update to latest version and ensure file path is correct

### Issue: Excel text format shows garbled characters
**Solution**: Use JSON or CSV format instead - text format has limitations

### Issue: Word document has warnings
**Solution**: Warnings are informational and usually safe to ignore. The text is still extracted.

---

## 📚 More Information

- [API Documentation](./docs/api/)
- [GitHub Repository](https://github.com/Libres-coder/ParseFlow)
- [Report Issues](https://github.com/Libres-coder/ParseFlow/issues)

---

**Version**: 1.1.0  
**Last Updated**: 2025-12-03
