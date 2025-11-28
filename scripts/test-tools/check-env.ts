/**
 * 检查环境变量是否正确设置
 */

import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

async function checkEnv() {
  console.log('🔍 检查环境变量\n');

  // 1. 检查 PATH
  console.log('📋 当前 PATH 环境变量:');
  const paths = (process.env.PATH || '').split(';');
  
  const relevantPaths = paths.filter(p => 
    p.toLowerCase().includes('poppler') || 
    p.toLowerCase().includes('pdftk')
  );

  if (relevantPaths.length > 0) {
    console.log('✅ 找到 Poppler/PDFtk 相关路径:');
    relevantPaths.forEach(p => console.log(`  - ${p}`));
  } else {
    console.log('❌ 未找到 Poppler/PDFtk 路径');
    console.log('⚠️  可能需要重启 VS Code 以获取新的环境变量');
  }

  console.log('\n' + '='.repeat(60) + '\n');

  // 2. 测试直接执行
  console.log('🧪 测试命令执行:\n');

  // 测试 pdfimages
  console.log('1. pdfimages (直接执行):');
  try {
    await execAsync('pdfimages -v');
    console.log('   ✅ 可以直接执行（环境变量生效）');
  } catch {
    console.log('   ❌ 无法直接执行（环境变量未生效）');
    console.log('   💡 建议：重启 VS Code');
  }

  // 测试 pdftk
  console.log('\n2. pdftk (直接执行):');
  try {
    await execAsync('pdftk --version');
    console.log('   ✅ 可以直接执行（环境变量生效）');
  } catch {
    console.log('   ❌ 无法直接执行（环境变量未生效）');
    console.log('   💡 建议：重启 VS Code');
  }

  console.log('\n' + '='.repeat(60) + '\n');

  // 3. 解决方案
  console.log('💡 解决方案:\n');
  console.log('方案 1: 重启 VS Code（推荐）');
  console.log('  - 关闭 VS Code');
  console.log('  - 重新打开 VS Code');
  console.log('  - 环境变量将自动生效\n');
  
  console.log('方案 2: 使用完整路径（已实现）');
  console.log('  - 代码中指定完整路径');
  console.log('  - 不依赖环境变量');
  console.log('  - 已经在测试中使用\n');
}

checkEnv();
