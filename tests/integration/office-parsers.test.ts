/**
 * 测试 Office 文档解析功能
 * 
 * 运行: tsx test-office-docs.ts
 */

import { WordParser, ExcelParser } from './packages/pdf-parser-core/dist/index.js';
import XLSX from 'xlsx';
import * as fs from 'fs/promises';

async function createExcelTestFile() {
  console.log('📊 创建 Excel 测试文件...');
  
  // 创建工作簿
  const workbook = XLSX.utils.book_new();
  
  // Sheet1: 销售数据
  const salesData = [
    ['产品名称', '销售额', '数量', '日期'],
    ['产品A', 1200, 50, '2025-01-01'],
    ['产品B', 2500, 80, '2025-01-02'],
    ['产品C', 1800, 60, '2025-01-03'],
    ['产品A', 1500, 55, '2025-01-04'],
    ['产品B', 2800, 85, '2025-01-05'],
  ];
  const sheet1 = XLSX.utils.aoa_to_sheet(salesData);
  XLSX.utils.book_append_sheet(workbook, sheet1, '销售数据');
  
  // Sheet2: 员工信息
  const employeeData = [
    ['姓名', '部门', '职位', '工资'],
    ['张三', '技术部', '工程师', 8000],
    ['李四', '销售部', '销售经理', 12000],
    ['王五', '技术部', '高级工程师', 15000],
    ['赵六', '人事部', 'HR', 7000],
  ];
  const sheet2 = XLSX.utils.aoa_to_sheet(employeeData);
  XLSX.utils.book_append_sheet(workbook, sheet2, '员工信息');
  
  // Sheet3: 统计数据
  const statsData = [
    ['指标', '数值', '备注'],
    ['总销售额', 9800, '本月累计'],
    ['平均销售额', 1960, '日均值'],
    ['员工总数', 4, '当前在职'],
    ['平均工资', 10500, '全公司平均'],
  ];
  const sheet3 = XLSX.utils.aoa_to_sheet(statsData);
  XLSX.utils.book_append_sheet(workbook, sheet3, '统计数据');
  
  // 保存文件
  const filePath = 'Excel测试文件.xlsx';
  XLSX.writeFile(workbook, filePath);
  console.log(`✅ Excel 测试文件已创建: ${filePath}`);
  
  return filePath;
}

async function testWordParser() {
  console.log('\n📄 测试 Word 解析器...\n');
  
  const parser = new WordParser();
  const wordFile = 'Word测试文件.docx';
  
  try {
    // 测试 1: 提取文本
    console.log('🔹 测试 1: 提取文本');
    const result = await parser.extractText(wordFile);
    console.log(`   文本长度: ${result.text.length} 字符`);
    console.log(`   前 200 字符: ${result.text.substring(0, 200)}...`);
    if (result.warnings) {
      console.log(`   警告: ${result.warnings.join(', ')}`);
    }
    
    // 测试 2: 获取元数据
    console.log('\n🔹 测试 2: 获取元数据');
    const metadata = await parser.getMetadata(wordFile);
    console.log(`   文件名: ${metadata.fileName}`);
    console.log(`   文件大小: ${(metadata.fileSize / 1024).toFixed(2)} KB`);
    console.log(`   最后修改: ${metadata.lastModified.toLocaleString('zh-CN')}`);
    
    // 测试 3: 搜索文本
    console.log('\n🔹 测试 3: 搜索文本');
    const searchResults = await parser.searchText(wordFile, '测试', false);
    console.log(`   找到 ${searchResults.length} 个匹配结果`);
    searchResults.slice(0, 3).forEach((r, i) => {
      console.log(`   [${i + 1}] 位置 ${r.position}: ${r.context.substring(0, 60)}...`);
    });
    
    // 测试 4: 提取 HTML
    console.log('\n🔹 测试 4: 提取 HTML');
    const html = await parser.extractHTML(wordFile);
    console.log(`   HTML 长度: ${html.length} 字符`);
    console.log(`   前 200 字符: ${html.substring(0, 200)}...`);
    
    console.log('\n✅ Word 解析器测试通过!\n');
  } catch (error) {
    console.error('❌ Word 解析器测试失败:', error);
  }
}

async function testExcelParser() {
  console.log('\n📊 测试 Excel 解析器...\n');
  
  const parser = new ExcelParser();
  const excelFile = 'Excel测试文件.xlsx';
  
  try {
    // 测试 1: 获取元数据
    console.log('🔹 测试 1: 获取元数据');
    const metadata = await parser.getMetadata(excelFile);
    console.log(`   文件名: ${metadata.fileName}`);
    console.log(`   文件大小: ${(metadata.fileSize / 1024).toFixed(2)} KB`);
    console.log(`   工作表数量: ${metadata.sheetCount}`);
    console.log(`   工作表名称: ${metadata.sheetNames.join(', ')}`);
    
    // 测试 2: 获取工作表名称
    console.log('\n🔹 测试 2: 获取工作表名称');
    const sheetNames = await parser.getSheetNames(excelFile);
    console.log(`   工作表: ${sheetNames.join(', ')}`);
    
    // 测试 3: 提取 JSON 格式数据（第一个工作表）
    console.log('\n🔹 测试 3: 提取 JSON 格式数据（销售数据）');
    const jsonResults = await parser.extractData(excelFile, {
      sheetName: '销售数据',
      format: 'json'
    });
    console.log(`   工作表: ${jsonResults[0].sheetName}`);
    console.log(`   行数: ${jsonResults[0].rowCount}, 列数: ${jsonResults[0].columnCount}`);
    console.log(`   数据预览: ${JSON.stringify(jsonResults[0].data.slice(0, 2), null, 2)}`);
    
    // 测试 4: 提取 CSV 格式数据
    console.log('\n🔹 测试 4: 提取 CSV 格式数据（员工信息）');
    const csvResults = await parser.extractData(excelFile, {
      sheetName: '员工信息',
      format: 'csv'
    });
    console.log(`   CSV 数据:\n${csvResults[0].data.split('\n').slice(0, 3).join('\n')}`);
    
    // 测试 5: 提取所有工作表
    console.log('\n🔹 测试 5: 提取所有工作表');
    const allResults = await parser.extractData(excelFile);
    console.log(`   提取了 ${allResults.length} 个工作表`);
    allResults.forEach(r => {
      console.log(`   - ${r.sheetName}: ${r.rowCount} 行 × ${r.columnCount} 列`);
    });
    
    // 测试 6: 搜索文本
    console.log('\n🔹 测试 6: 搜索文本');
    const searchResults = await parser.searchText(excelFile, '产品', false);
    console.log(`   找到 ${searchResults.length} 个匹配结果`);
    searchResults.slice(0, 5).forEach((r, i) => {
      console.log(`   [${i + 1}] ${r.sheetName} - ${r.cellRef} (行${r.row},列${r.col}): ${r.value}`);
    });
    
    // 测试 7: 提取文本格式
    console.log('\n🔹 测试 7: 提取文本格式');
    const textResults = await parser.extractData(excelFile, {
      sheetName: '统计数据',
      format: 'text'
    });
    console.log(`   文本数据:\n${textResults[0].data.split('\n').slice(0, 5).join('\n')}`);
    
    // 测试 8: 搜索数字
    console.log('\n🔹 测试 8: 搜索数字（工资相关）');
    const numSearch = await parser.searchText(excelFile, '8000', false);
    console.log(`   找到 ${numSearch.length} 个匹配结果`);
    numSearch.forEach((r, i) => {
      console.log(`   [${i + 1}] ${r.sheetName} - ${r.cellRef}: ${r.value}`);
    });
    
    console.log('\n✅ Excel 解析器测试通过!\n');
  } catch (error) {
    console.error('❌ Excel 解析器测试失败:', error);
  }
}

async function main() {
  console.log('🚀 开始测试 Office 文档解析功能\n');
  console.log('='.repeat(60));
  
  try {
    // 创建 Excel 测试文件
    await createExcelTestFile();
    
    console.log('\n' + '='.repeat(60));
    
    // 测试 Word 解析器
    await testWordParser();
    
    console.log('='.repeat(60));
    
    // 测试 Excel 解析器
    await testExcelParser();
    
    console.log('='.repeat(60));
    console.log('\n🎉 所有测试完成！');
    
  } catch (error) {
    console.error('\n❌ 测试过程中出现错误:', error);
    process.exit(1);
  }
}

main();
