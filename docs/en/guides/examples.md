# ParseFlow Usage Examples

[中文](../../guides/examples.md) | **English**

## 📚 Table of Contents

- [Basic Usage](#basic-usage)
- [Using in Windsurf](#using-in-windsurf)
- [Using as a Library](#using-as-a-library)
- [Advanced Scenarios](#advanced-scenarios)
- [Real-world Cases](#real-world-cases)

---

## Basic Usage

### Example 1: Quick PDF Info

```javascript
import { PDFParser } from '@parseflow/core';

const parser = new PDFParser();
const metadata = await parser.getMetadata('document.pdf');

console.log(`Title: ${metadata.info.Title}`);
console.log(`Pages: ${metadata.metadata.pageCount}`);
console.log(`Author: ${metadata.info.Author}`);
```

### Example 2: Extract All Text

```javascript
const parser = new PDFParser();
const text = await parser.extractText('document.pdf');
console.log(text);
```

### Example 3: Extract Specific Pages

```javascript
// Extract page 5
const page5 = await parser.extractPage('document.pdf', 5);

// Extract pages 10-20
const range = await parser.extractRange('document.pdf', 10, 20);
```

### Example 4: Search Keywords

```javascript
const results = await parser.search('document.pdf', 'important notice', {
  caseSensitive: false,
  maxResults: 10,
});

results.forEach((r) => {
  console.log(`Page ${r.page}: ${r.context}`);
});
```

---

## Using in Windsurf

### Scenario 1: Document Review

**Your Question:**

```
Please review D:\contracts\agreement.pdf, focus on payment terms
```

**Windsurf Will:**

1. Call ParseFlow to extract full text
2. Use AI to analyze content
3. Highlight payment-related clauses

### Scenario 2: Quick Search

**Your Question:**

```
Find all mentions of "API key" in all PDFs under D:\manuals\
```

**Windsurf Will:**

1. Traverse the folder
2. Call search on each PDF
3. Aggregate results

### Scenario 3: Document Comparison

**Your Question:**

```
Compare differences between D:\v1.pdf and D:\v2.pdf
```

**Windsurf Will:**

1. Extract text from both documents
2. Perform difference analysis
3. Summarize major changes

### Scenario 4: Content Summary

**Your Question:**

```
Summarize key points of D:\report.pdf in 5 bullet points
```

**Windsurf Will:**

1. Extract full text
2. AI analyze and summarize
3. Format output

---

## Using as a Library

### Example 5: Use in Express App

```javascript
import express from 'express';
import { PDFParser } from '@parseflow/core';
import multer from 'multer';

const app = express();
const upload = multer({ dest: 'uploads/' });
const parser = new PDFParser();

// Upload and parse PDF
app.post('/api/pdf/upload', upload.single('pdf'), async (req, res) => {
  try {
    const metadata = await parser.getMetadata(req.file.path);
    const text = await parser.extractText(req.file.path);

    res.json({
      success: true,
      metadata,
      textLength: text.length,
      preview: text.substring(0, 200),
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Search PDF
app.get('/api/pdf/search', async (req, res) => {
  const { file, query } = req.query;
  const results = await parser.search(file, query);
  res.json(results);
});

app.listen(3000);
```

### Example 6: Batch Processing

```javascript
import { PDFParser } from '@parseflow/core';
import { readdir } from 'fs/promises';
import { join } from 'path';

async function processBatch(directory) {
  const parser = new PDFParser();
  const files = await readdir(directory);
  const pdfFiles = files.filter((f) => f.endsWith('.pdf'));

  const results = [];

  for (const file of pdfFiles) {
    const filePath = join(directory, file);
    try {
      const metadata = await parser.getMetadata(filePath);
      const text = await parser.extractText(filePath);

      results.push({
        file,
        pageCount: metadata.metadata.pageCount,
        textLength: text.length,
        author: metadata.info.Author,
      });

      console.log(`✅ Processed: ${file}`);
    } catch (error) {
      console.error(`❌ Failed: ${file}`, error.message);
    }
  }

  return results;
}

// Usage
const results = await processBatch('D:\\documents');
console.log(`Processed ${results.length} files`);
```

### Example 7: Custom Caching

```javascript
import { PDFParser } from '@parseflow/core';

const parser = new PDFParser({
  cache: {
    enabled: true,
    maxSize: 50, // Cache 50 files
    maxAge: 3600000, // Expire after 1 hour
    directory: './my-cache',
  },
});

// First call - parse and cache
const text1 = await parser.extractText('large.pdf');

// Second call - read from cache (fast)
const text2 = await parser.extractText('large.pdf');
```

---

## Advanced Scenarios

### Example 8: RAG with LangChain

```javascript
import { PDFParser } from '@parseflow/core';
import { RecursiveCharacterTextSplitter } from 'langchain/text_splitter';
import { MemoryVectorStore } from 'langchain/vectorstores/memory';
import { OpenAIEmbeddings } from 'langchain/embeddings/openai';

async function createPDFVectorStore(pdfPath) {
  // 1. Extract PDF text
  const parser = new PDFParser();
  const text = await parser.extractText(pdfPath);

  // 2. Split text
  const splitter = new RecursiveCharacterTextSplitter({
    chunkSize: 1000,
    chunkOverlap: 200,
  });
  const docs = await splitter.createDocuments([text]);

  // 3. Create vector store
  const vectorStore = await MemoryVectorStore.fromDocuments(docs, new OpenAIEmbeddings());

  return vectorStore;
}

// Usage
const store = await createPDFVectorStore('knowledge.pdf');
const results = await store.similaritySearch('How to use API?', 3);
```

### Example 9: PDF Content Monitoring

```javascript
import { PDFParser } from '@parseflow/core';
import { watch } from 'chokidar';

const parser = new PDFParser();

// Monitor PDF changes in directory
const watcher = watch('D:\\documents\\*.pdf', {
  persistent: true,
});

watcher.on('add', async (path) => {
  console.log(`New file: ${path}`);
  const metadata = await parser.getMetadata(path);
  console.log(`Pages: ${metadata.metadata.pageCount}`);

  // Check for keywords
  const hasKeyword = await checkKeyword(path, 'urgent');
  if (hasKeyword) {
    console.log('⚠️ Found document containing "urgent"!');
    // Send notification...
  }
});

async function checkKeyword(path, keyword) {
  const results = await parser.search(path, keyword);
  return results.length > 0;
}
```

### Example 10: PDF to Markdown Conversion

```javascript
import { PDFParser } from '@parseflow/core';
import { writeFile } from 'fs/promises';

async function pdfToMarkdown(pdfPath, mdPath) {
  const parser = new PDFParser();

  // Get metadata
  const metadata = await parser.getMetadata(pdfPath);

  // Extract text (formatted)
  const text = await parser.extractText(pdfPath, { strategy: 'formatted' });

  // Build Markdown
  const markdown = `# ${metadata.info.Title || 'Untitled Document'}

**Author**: ${metadata.info.Author || 'N/A'}
**Created**: ${metadata.info.CreationDate || 'N/A'}
**Pages**: ${metadata.metadata.pageCount}

---

${text}

---

*Automatically generated by ParseFlow*
`;

  await writeFile(mdPath, markdown, 'utf-8');
  console.log(`✅ Converted: ${mdPath}`);
}

// Usage
await pdfToMarkdown('report.pdf', 'report.md');
```

---

## Real-world Cases

### Case 1: Contract Management System

```javascript
// Automatically extract contract key information
async function extractContractInfo(pdfPath) {
  const parser = new PDFParser();
  const text = await parser.extractText(pdfPath);

  // Use regex to extract key info
  const partyA = text.match(/Party A[：:]\s*([^\n]+)/)?.[1];
  const partyB = text.match(/Party B[：:]\s*([^\n]+)/)?.[1];
  const amount = text.match(/Contract Amount[：:]\s*([^\n]+)/)?.[1];
  const date = text.match(/Signing Date[：:]\s*([^\n]+)/)?.[1];

  return { partyA, partyB, amount, date };
}
```

### Case 2: Academic Paper Analysis

```javascript
// Extract abstract and keywords from paper
async function analyzePaper(pdfPath) {
  const parser = new PDFParser();
  const page1 = await parser.extractPage(pdfPath, 1);

  const abstract = page1.match(/Abstract(.+?)Keywords/s)?.[1]?.trim();
  const keywords = page1.match(/Keywords[：:]\s*([^\n]+)/)?.[1];

  const metadata = await parser.getMetadata(pdfPath);

  return {
    title: metadata.info.Title,
    author: metadata.info.Author,
    abstract,
    keywords: keywords?.split(/[,;]/).map((k) => k.trim()),
  };
}
```

### Case 3: Invoice Batch Processing

```javascript
// Batch extract invoice information
async function processInvoices(directory) {
  const parser = new PDFParser();
  const files = await readdir(directory);
  const invoices = [];

  for (const file of files.filter((f) => f.endsWith('.pdf'))) {
    const path = join(directory, file);
    const text = await parser.extractText(path);

    // Extract invoice number, amount, etc.
    const invoiceNo = text.match(/Invoice No[：:]\s*(\d+)/)?.[1];
    const amount = text.match(/Total Amount[：:]\s*\$?([\d,.]+)/)?.[1];
    const date = text.match(/Invoice Date[：:]\s*([\d-/]+)/)?.[1];

    invoices.push({ file, invoiceNo, amount, date });
  }

  return invoices;
}
```

---

## 💡 Best Practices

### 1. Error Handling

```javascript
try {
  const text = await parser.extractText(path);
} catch (error) {
  if (error.code === 'ENOENT') {
    console.error('File not found');
  } else if (error.message.includes('Invalid PDF')) {
    console.error('PDF file is corrupted');
  } else {
    console.error('Unknown error:', error);
  }
}
```

### 2. Performance Optimization

```javascript
// ✅ Good: Extract only needed pages
const page1 = await parser.extractPage(path, 1);

// ❌ Bad: Extract all then use only first page
const allText = await parser.extractText(path);
const page1Text = allText.split('\n\n\n')[0];
```

### 3. Resource Management

```javascript
// When processing many files, create multiple parser instances
const parsers = Array.from({ length: 5 }, () => new PDFParser());

async function processWithPool(files) {
  let index = 0;
  for (const file of files) {
    const parser = parsers[index % parsers.length];
    await parser.extractText(file);
    index++;
  }
}
```

---

## 🔗 More Resources

- [Complete API Documentation](../development/api.md)
- [Architecture Design](../development/architecture.md)
- [FAQ](faq.md)

---

**Last Updated**: 2025-11-26
