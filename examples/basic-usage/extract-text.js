/**
 * Basic Text Extraction Example
 * 
 * This example shows how to extract text from a PDF file
 * using the parseflow-core library.
 */

import { PDFParser } from 'parseflow-core';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

async function main() {
  // Create parser instance
  const parser = new PDFParser();
  
  // Path to sample PDF (adjust this to your PDF file)
  const pdfPath = join(__dirname, '../sample.pdf');
  
  console.log('📄 Extracting text from PDF...\n');
  
  try {
    // Extract all text
    const result = await parser.extractText(pdfPath);
    
    console.log('✅ Extraction completed!\n');
    console.log('📊 Statistics:');
    console.log(`   - Total pages: ${result.numPages}`);
    console.log(`   - Text length: ${result.text.length} characters`);
    console.log(`   - Info: ${JSON.stringify(result.info, null, 2)}`);
    console.log('\n📝 First 500 characters:');
    console.log(result.text.substring(0, 500));
    console.log('...\n');
    
    // Extract specific page
    console.log('📄 Extracting page 1...\n');
    const page1 = await parser.extractText(pdfPath, { page: 1 });
    console.log('Page 1 content:');
    console.log(page1.text.substring(0, 300));
    
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

main();
