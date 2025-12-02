/**
 * Express API Server Example
 * 
 * This example shows how to create a REST API for PDF parsing
 * using Express and parseflow-core.
 */

import express from 'express';
import multer from 'multer';
import { PDFParser } from 'parseflow-core';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { unlink } from 'fs/promises';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const upload = multer({ dest: 'uploads/' });
const parser = new PDFParser();

app.use(express.json());

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', service: 'PDF Parser API' });
});

// Extract text from uploaded PDF
app.post('/api/pdf/extract-text', upload.single('pdf'), async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No PDF file uploaded' });
  }
  
  try {
    const result = await parser.extractText(req.file.path);
    
    // Clean up uploaded file
    await unlink(req.file.path);
    
    res.json({
      success: true,
      data: {
        text: result.text,
        numPages: result.numPages,
        info: result.info
      }
    });
  } catch (error) {
    // Clean up uploaded file on error
    try {
      await unlink(req.file.path);
    } catch {}
    
    res.status(500).json({ 
      success: false,
      error: error.message 
    });
  }
});

// Get metadata from uploaded PDF
app.post('/api/pdf/metadata', upload.single('pdf'), async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No PDF file uploaded' });
  }
  
  try {
    const metadata = await parser.getMetadata(req.file.path);
    
    await unlink(req.file.path);
    
    res.json({
      success: true,
      data: metadata
    });
  } catch (error) {
    try {
      await unlink(req.file.path);
    } catch {}
    
    res.status(500).json({ 
      success: false,
      error: error.message 
    });
  }
});

// Search keywords in uploaded PDF
app.post('/api/pdf/search', upload.single('pdf'), async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No PDF file uploaded' });
  }
  
  const { keyword, caseSensitive = false, maxResults = 10 } = req.body;
  
  if (!keyword) {
    await unlink(req.file.path);
    return res.status(400).json({ error: 'Keyword is required' });
  }
  
  try {
    const results = await parser.searchPDF(req.file.path, keyword, {
      caseSensitive: caseSensitive === 'true' || caseSensitive === true,
      maxResults: parseInt(maxResults) || 10
    });
    
    await unlink(req.file.path);
    
    res.json({
      success: true,
      data: {
        keyword,
        matches: results.length,
        results
      }
    });
  } catch (error) {
    try {
      await unlink(req.file.path);
    } catch {}
    
    res.status(500).json({ 
      success: false,
      error: error.message 
    });
  }
});

// Error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ 
    success: false,
    error: 'Internal server error' 
  });
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`🚀 PDF Parser API running on http://localhost:${PORT}`);
  console.log(`\nAvailable endpoints:`);
  console.log(`  GET  /health                 - Health check`);
  console.log(`  POST /api/pdf/extract-text   - Extract text from PDF`);
  console.log(`  POST /api/pdf/metadata       - Get PDF metadata`);
  console.log(`  POST /api/pdf/search         - Search keywords in PDF`);
  console.log(`\nExample using curl:`);
  console.log(`  curl -X POST -F "pdf=@document.pdf" http://localhost:${PORT}/api/pdf/extract-text`);
});
