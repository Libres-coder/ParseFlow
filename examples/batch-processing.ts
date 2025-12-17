/**
 * 批量处理示例
 * 演示如何使用 BatchProcessor 并行处理多个文件
 */

import { BatchProcessor } from 'parseflow-core';
import * as path from 'path';

const batchProcessor = new BatchProcessor();

async function example1_processMultipleFiles() {
  console.log('\n=== Example 1: Process Multiple Files ===\n');

  const filePaths = [
    path.join(__dirname, '../tests/sample1.pdf'),
    path.join(__dirname, '../tests/sample2.pdf'),
    path.join(__dirname, '../tests/document.docx'),
    path.join(__dirname, '../tests/data.xlsx'),
  ];

  const result = await batchProcessor.processFiles(filePaths, {
    concurrency: 3, // 并发处理 3 个文件
    includeMetadata: false,
    onProgress: (completed, total, current) => {
      console.log(`Progress: ${completed}/${total} - Processing: ${path.basename(current)}`);
    },
  });

  console.log(`\n✅ Results:`);
  console.log(`- Total: ${result.total}`);
  console.log(`- Successful: ${result.successful}`);
  console.log(`- Failed: ${result.failed}`);
  console.log(`- Duration: ${(result.duration / 1000).toFixed(2)}s\n`);

  // 显示每个文件的结果
  result.results.forEach((file, index) => {
    console.log(`[${index + 1}] ${path.basename(file.path)}`);
    console.log(`    Type: ${file.type}`);
    console.log(`    Status: ${file.success ? '✅ Success' : '❌ Failed'}`);
    if (file.text) {
      console.log(`    Preview: ${file.text.substring(0, 100)}...`);
    }
    if (file.error) {
      console.log(`    Error: ${file.error}`);
    }
    console.log('');
  });
}

async function example2_processDirectory() {
  console.log('\n=== Example 2: Process Directory ===\n');

  const dirPath = path.join(__dirname, '../tests');

  const result = await batchProcessor.processDirectory(dirPath, {
    recursive: true, // 递归扫描子目录
    concurrency: 5,
    includeMetadata: true,
    onProgress: (completed, total, current) => {
      console.log(`Processing (${completed}/${total}): ${path.basename(current)}`);
    },
  });

  console.log(`\n✅ Directory Processing Complete:`);
  console.log(`- Total files: ${result.total}`);
  console.log(`- Successful: ${result.successful}`);
  console.log(`- Failed: ${result.failed}`);
  console.log(`- Duration: ${(result.duration / 1000).toFixed(2)}s\n`);

  // 按文件类型分组统计
  const typeStats = result.results.reduce((acc, file) => {
    acc[file.type] = (acc[file.type] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  console.log('File Type Statistics:');
  Object.entries(typeStats).forEach(([type, count]) => {
    console.log(`  ${type}: ${count} files`);
  });
}

async function example3_batchSearch() {
  console.log('\n=== Example 3: Batch Search ===\n');

  const filePaths = [
    path.join(__dirname, '../tests/sample1.pdf'),
    path.join(__dirname, '../tests/sample2.pdf'),
    path.join(__dirname, '../tests/document.docx'),
    path.join(__dirname, '../tests/presentation.pptx'),
  ];

  const query = 'contract'; // 搜索关键词

  console.log(`Searching for "${query}" in ${filePaths.length} files...\n`);

  const result = await batchProcessor.searchFiles(filePaths, query, {
    caseSensitive: false,
    concurrency: 3,
  });

  console.log(`✅ Search Complete:`);
  console.log(`- Total files searched: ${result.total}`);
  console.log(`- Files with matches: ${result.filesWithMatches}\n`);

  if (result.filesWithMatches === 0) {
    console.log(`No matches found for "${query}"`);
  } else {
    console.log('Matches found in:');
    result.results.forEach((file) => {
      console.log(`\n📄 ${path.basename(file.path)} (${file.type})`);
      console.log(`   Found ${file.matches.length} matches:`);
      file.matches.forEach((match, index) => {
        console.log(`   [${index + 1}] ${match.text}`);
        if (match.context) {
          console.log(`       Context: ${match.context}`);
        }
      });
    });
  }
}

async function example4_withErrorHandling() {
  console.log('\n=== Example 4: Error Handling ===\n');

  const filePaths = [
    path.join(__dirname, '../tests/valid.pdf'),
    path.join(__dirname, '../tests/not-exist.pdf'), // 不存在的文件
    path.join(__dirname, '../tests/corrupted.pdf'), // 损坏的文件
    path.join(__dirname, '../tests/document.docx'),
  ];

  const result = await batchProcessor.processFiles(filePaths, {
    concurrency: 2,
  });

  console.log('Processing Results:\n');

  // 分别显示成功和失败的文件
  const successful = result.results.filter((r) => r.success);
  const failed = result.results.filter((r) => !r.success);

  console.log(`✅ Successful (${successful.length}):`);
  successful.forEach((file) => {
    console.log(`   - ${path.basename(file.path)}`);
  });

  console.log(`\n❌ Failed (${failed.length}):`);
  failed.forEach((file) => {
    console.log(`   - ${path.basename(file.path)}`);
    console.log(`     Error: ${file.error}`);
  });
}

// 运行所有示例
async function runAll() {
  try {
    await example1_processMultipleFiles();
    await example2_processDirectory();
    await example3_batchSearch();
    await example4_withErrorHandling();

    console.log('\n✅ All examples completed!\n');
  } catch (error) {
    console.error('Error running examples:', error);
  }
}

// 如果直接运行此文件
if (require.main === module) {
  runAll();
}

export {
  example1_processMultipleFiles,
  example2_processDirectory,
  example3_batchSearch,
  example4_withErrorHandling,
};
