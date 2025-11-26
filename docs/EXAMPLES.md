# ParseFlow 使用示例

## 📚 目录

- [基础使用](#基础使用)
- [在 Windsurf 中使用](#在-windsurf-中使用)
- [作为库使用](#作为库使用)
- [高级场景](#高级场景)
- [实战案例](#实战案例)

---

## 基础使用

### 示例 1：快速查看 PDF 信息

```javascript
import { PDFParser } from '@parseflow/core';

const parser = new PDFParser();
const metadata = await parser.getMetadata('document.pdf');

console.log(`标题: ${metadata.info.Title}`);
console.log(`页数: ${metadata.metadata.pageCount}`);
console.log(`作者: ${metadata.info.Author}`);
```

### 示例 2：提取全部文本

```javascript
const parser = new PDFParser();
const text = await parser.extractText('document.pdf');
console.log(text);
```

### 示例 3：提取特定页面

```javascript
// 提取第 5 页
const page5 = await parser.extractPage('document.pdf', 5);

// 提取第 10-20 页
const range = await parser.extractRange('document.pdf', 10, 20);
```

### 示例 4：搜索关键词

```javascript
const results = await parser.search('document.pdf', '重要通知', {
  caseSensitive: false,
  maxResults: 10,
});

results.forEach((r) => {
  console.log(`第 ${r.page} 页: ${r.context}`);
});
```

---

## 在 Windsurf 中使用

### 场景 1：文档审阅

**你的问题：**
```
请帮我审阅 D:\contracts\agreement.pdf，重点关注付款条款
```

**Windsurf 会：**
1. 调用 ParseFlow 提取全文
2. 使用 AI 分析内容
3. 突出显示付款相关条款

### 场景 2：快速查找

**你的问题：**
```
在 D:\manuals\ 文件夹下的所有 PDF 中找到提到"API 密钥"的地方
```

**Windsurf 会：**
1. 遍历文件夹
2. 对每个 PDF 调用搜索
3. 汇总结果

### 场景 3：文档对比

**你的问题：**
```
对比 D:\v1.pdf 和 D:\v2.pdf 的差异
```

**Windsurf 会：**
1. 提取两个文档的文本
2. 进行差异分析
3. 总结主要变化

### 场景 4：内容总结

**你的问题：**
```
总结 D:\report.pdf 的核心观点，用 5 个要点列出
```

**Windsurf 会：**
1. 提取全文
2. AI 分析和总结
3. 格式化输出

---

## 作为库使用

### 示例 5：在 Express 应用中使用

```javascript
import express from 'express';
import { PDFParser } from '@parseflow/core';
import multer from 'multer';

const app = express();
const upload = multer({ dest: 'uploads/' });
const parser = new PDFParser();

// 上传并解析 PDF
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

// 搜索 PDF
app.get('/api/pdf/search', async (req, res) => {
  const { file, query } = req.query;
  const results = await parser.search(file, query);
  res.json(results);
});

app.listen(3000);
```

### 示例 6：批量处理

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

      console.log(`✅ 处理完成: ${file}`);
    } catch (error) {
      console.error(`❌ 处理失败: ${file}`, error.message);
    }
  }

  return results;
}

// 使用
const results = await processBatch('D:\\documents');
console.log(`共处理 ${results.length} 个文件`);
```

### 示例 7：自定义缓存

```javascript
import { PDFParser } from '@parseflow/core';

const parser = new PDFParser({
  cache: {
    enabled: true,
    maxSize: 50, // 缓存 50 个文件
    maxAge: 3600000, // 1 小时过期
    directory: './my-cache',
  },
});

// 第一次调用 - 解析并缓存
const text1 = await parser.extractText('large.pdf');

// 第二次调用 - 从缓存读取（快速）
const text2 = await parser.extractText('large.pdf');
```

---

## 高级场景

### 示例 8：结合 LangChain 实现 RAG

```javascript
import { PDFParser } from '@parseflow/core';
import { RecursiveCharacterTextSplitter } from 'langchain/text_splitter';
import { MemoryVectorStore } from 'langchain/vectorstores/memory';
import { OpenAIEmbeddings } from 'langchain/embeddings/openai';

async function createPDFVectorStore(pdfPath) {
  // 1. 提取 PDF 文本
  const parser = new PDFParser();
  const text = await parser.extractText(pdfPath);

  // 2. 分割文本
  const splitter = new RecursiveCharacterTextSplitter({
    chunkSize: 1000,
    chunkOverlap: 200,
  });
  const docs = await splitter.createDocuments([text]);

  // 3. 创建向量存储
  const vectorStore = await MemoryVectorStore.fromDocuments(docs, new OpenAIEmbeddings());

  return vectorStore;
}

// 使用
const store = await createPDFVectorStore('knowledge.pdf');
const results = await store.similaritySearch('如何使用 API？', 3);
```

### 示例 9：PDF 内容监控

```javascript
import { PDFParser } from '@parseflow/core';
import { watch } from 'chokidar';

const parser = new PDFParser();

// 监控目录中的 PDF 变化
const watcher = watch('D:\\documents\\*.pdf', {
  persistent: true,
});

watcher.on('add', async (path) => {
  console.log(`新文件: ${path}`);
  const metadata = await parser.getMetadata(path);
  console.log(`页数: ${metadata.metadata.pageCount}`);

  // 检查关键词
  const hasKeyword = await checkKeyword(path, '紧急');
  if (hasKeyword) {
    console.log('⚠️ 发现包含"紧急"的文档！');
    // 发送通知...
  }
});

async function checkKeyword(path, keyword) {
  const results = await parser.search(path, keyword);
  return results.length > 0;
}
```

### 示例 10：PDF 到 Markdown 转换

```javascript
import { PDFParser } from '@parseflow/core';
import { writeFile } from 'fs/promises';

async function pdfToMarkdown(pdfPath, mdPath) {
  const parser = new PDFParser();

  // 获取元数据
  const metadata = await parser.getMetadata(pdfPath);

  // 提取文本（格式化）
  const text = await parser.extractText(pdfPath, { strategy: 'formatted' });

  // 构建 Markdown
  const markdown = `# ${metadata.info.Title || '未命名文档'}

**作者**: ${metadata.info.Author || 'N/A'}
**创建日期**: ${metadata.info.CreationDate || 'N/A'}
**页数**: ${metadata.metadata.pageCount}

---

${text}

---

*由 ParseFlow 自动生成*
`;

  await writeFile(mdPath, markdown, 'utf-8');
  console.log(`✅ 已转换: ${mdPath}`);
}

// 使用
await pdfToMarkdown('report.pdf', 'report.md');
```

---

## 实战案例

### 案例 1：合同管理系统

```javascript
// 自动提取合同关键信息
async function extractContractInfo(pdfPath) {
  const parser = new PDFParser();
  const text = await parser.extractText(pdfPath);

  // 使用正则提取关键信息
  const partyA = text.match(/甲方[：:]\s*([^\n]+)/)?.[1];
  const partyB = text.match(/乙方[：:]\s*([^\n]+)/)?.[1];
  const amount = text.match(/合同金额[：:]\s*([^\n]+)/)?.[1];
  const date = text.match(/签订日期[：:]\s*([^\n]+)/)?.[1];

  return { partyA, partyB, amount, date };
}
```

### 案例 2：学术论文分析

```javascript
// 提取论文摘要和关键词
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
    keywords: keywords?.split(/[,，;；]/).map((k) => k.trim()),
  };
}
```

### 案例 3：发票批量处理

```javascript
// 批量提取发票信息
async function processInvoices(directory) {
  const parser = new PDFParser();
  const files = await readdir(directory);
  const invoices = [];

  for (const file of files.filter((f) => f.endsWith('.pdf'))) {
    const path = join(directory, file);
    const text = await parser.extractText(path);

    // 提取发票号、金额等
    const invoiceNo = text.match(/发票号码[：:]\s*(\d+)/)?.[1];
    const amount = text.match(/价税合计[：:]\s*¥?([\d,.]+)/)?.[1];
    const date = text.match(/开票日期[：:]\s*([\d-/]+)/)?.[1];

    invoices.push({ file, invoiceNo, amount, date });
  }

  return invoices;
}
```

---

## 💡 最佳实践

### 1. 错误处理

```javascript
try {
  const text = await parser.extractText(path);
} catch (error) {
  if (error.code === 'ENOENT') {
    console.error('文件不存在');
  } else if (error.message.includes('Invalid PDF')) {
    console.error('PDF 文件损坏');
  } else {
    console.error('未知错误:', error);
  }
}
```

### 2. 性能优化

```javascript
// ✅ 好：只提取需要的页面
const page1 = await parser.extractPage(path, 1);

// ❌ 差：提取全部然后只用第一页
const allText = await parser.extractText(path);
const page1Text = allText.split('\n\n\n')[0];
```

### 3. 资源管理

```javascript
// 处理大量文件时，创建多个 parser 实例
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

## 🔗 更多资源

- [API 完整文档](./API.md)
- [架构设计](./ARCHITECTURE.md)
- [常见问题](./FAQ.md)

---

**最后更新**: 2024-11-26
