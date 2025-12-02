/**
 * Batch PDF Processing Example
 * 
 * This example shows how to process multiple PDF files in batch,
 * extracting text and saving to individual text files.
 */

import { PDFParser } from 'parseflow-core';
import { readdir, writeFile, mkdir } from 'fs/promises';
import { join, basename, extname } from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

async function batchConvert(inputDir, outputDir) {
  const parser = new PDFParser();
  
  // Create output directory if it doesn't exist
  try {
    await mkdir(outputDir, { recursive: true });
  } catch (error) {
    // Directory already exists
  }
  
  console.log(`📂 Processing PDFs from: ${inputDir}`);
  console.log(`📁 Output directory: ${outputDir}\n`);
  
  try {
    // Read all files in input directory
    const files = await readdir(inputDir);
    const pdfFiles = files.filter(file => extname(file).toLowerCase() === '.pdf');
    
    if (pdfFiles.length === 0) {
      console.log('⚠️  No PDF files found in the input directory.');
      return;
    }
    
    console.log(`Found ${pdfFiles.length} PDF file(s)\n`);
    
    let successCount = 0;
    let errorCount = 0;
    
    // Process each PDF file
    for (let i = 0; i < pdfFiles.length; i++) {
      const filename = pdfFiles[i];
      const pdfPath = join(inputDir, filename);
      const baseName = basename(filename, '.pdf');
      const outputPath = join(outputDir, `${baseName}.txt`);
      
      console.log(`[${i + 1}/${pdfFiles.length}] Processing: ${filename}`);
      
      try {
        // Extract text
        const result = await parser.extractText(pdfPath);
        
        // Save to text file
        await writeFile(outputPath, result.text, 'utf-8');
        
        console.log(`   ✅ Success! Pages: ${result.numPages}, Output: ${basename(outputPath)}`);
        successCount++;
        
      } catch (error) {
        console.log(`   ❌ Error: ${error.message}`);
        errorCount++;
      }
      
      console.log();
    }
    
    // Summary
    console.log('═══════════════════════════════════════');
    console.log('📊 Batch Processing Summary');
    console.log('═══════════════════════════════════════');
    console.log(`Total files:     ${pdfFiles.length}`);
    console.log(`✅ Successful:    ${successCount}`);
    console.log(`❌ Failed:        ${errorCount}`);
    console.log(`📁 Output dir:    ${outputDir}`);
    console.log('═══════════════════════════════════════\n');
    
  } catch (error) {
    console.error('❌ Fatal error:', error.message);
    process.exit(1);
  }
}

// Main execution
const inputDir = process.argv[2] || join(__dirname, 'input');
const outputDir = process.argv[3] || join(__dirname, 'output');

console.log('╔═══════════════════════════════════════╗');
console.log('║   Batch PDF to Text Converter         ║');
console.log('╚═══════════════════════════════════════╝\n');

if (!process.argv[2]) {
  console.log('Usage: node batch-convert.js <input-dir> [output-dir]');
  console.log('Example: node batch-convert.js ./pdfs ./output\n');
  console.log('Using default directories:\n');
}

batchConvert(inputDir, outputDir);
