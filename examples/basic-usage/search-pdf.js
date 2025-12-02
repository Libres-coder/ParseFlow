/**
 * PDF Keyword Search Example
 * 
 * This example shows how to search for keywords in a PDF file.
 */

import { PDFParser } from 'parseflow-core';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

async function main() {
  const parser = new PDFParser();
  const pdfPath = join(__dirname, '../sample.pdf');
  
  // Keyword to search (change this to your keyword)
  const keyword = process.argv[2] || 'PDF';
  
  console.log(`🔍 Searching for "${keyword}" in PDF...\n`);
  
  try {
    const results = await parser.searchPDF(pdfPath, keyword, {
      caseSensitive: false,
      maxResults: 10
    });
    
    console.log(`✅ Search completed!\n`);
    console.log(`📊 Found ${results.length} matches:\n`);
    
    results.forEach((result, index) => {
      console.log(`${index + 1}. Page ${result.page}:`);
      console.log(`   Context: ...${result.context}...`);
      console.log();
    });
    
    if (results.length === 0) {
      console.log('   No matches found. Try a different keyword.');
    }
    
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

console.log('Usage: node search-pdf.js [keyword]');
console.log('Example: node search-pdf.js "document"\n');

main();
