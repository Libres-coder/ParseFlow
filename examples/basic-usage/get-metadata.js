/**
 * Get PDF Metadata Example
 * 
 * This example shows how to extract metadata from a PDF file.
 */

import { PDFParser } from 'parseflow-core';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

async function main() {
  const parser = new PDFParser();
  const pdfPath = join(__dirname, '../sample.pdf');
  
  console.log('📊 Getting PDF metadata...\n');
  
  try {
    const metadata = await parser.getMetadata(pdfPath);
    
    console.log('✅ Metadata retrieved!\n');
    console.log('📄 Document Information:');
    console.log(`   Title:        ${metadata.info?.Title || 'N/A'}`);
    console.log(`   Author:       ${metadata.info?.Author || 'N/A'}`);
    console.log(`   Subject:      ${metadata.info?.Subject || 'N/A'}`);
    console.log(`   Creator:      ${metadata.info?.Creator || 'N/A'}`);
    console.log(`   Producer:     ${metadata.info?.Producer || 'N/A'}`);
    console.log(`   Created:      ${metadata.info?.CreationDate || 'N/A'}`);
    console.log(`   Modified:     ${metadata.info?.ModDate || 'N/A'}`);
    console.log(`\n📑 Document Stats:`);
    console.log(`   Pages:        ${metadata.numPages}`);
    console.log(`   PDF Version:  ${metadata.version || 'N/A'}`);
    
    if (metadata.metadata) {
      console.log(`\n🔍 Additional Metadata:`);
      console.log(JSON.stringify(metadata.metadata, null, 2));
    }
    
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

main();
