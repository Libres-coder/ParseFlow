import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

async function test() {
  console.log('测试 pdfimages 命令...\n');

  // 测试 1: 直接执行
  console.log('=== 测试 1: 直接执行 ===');
  try {
    console.log('执行: pdfimages -v');
    const { stdout, stderr } = await execAsync('pdfimages -v');
    console.log('✅ 成功');
    console.log('stdout:', stdout);
    console.log('stderr:', stderr);
  } catch (error: any) {
    console.log('❌ 失败');
    console.log('error:', error.message);
    console.log('stderr:', error.stderr);
  }

  // 测试 2: PowerShell 执行
  console.log('\n=== 测试 2: PowerShell 执行 ===');
  try {
    console.log('执行: powershell.exe -Command "pdfimages -v"');
    const { stdout, stderr } = await execAsync('powershell.exe -Command "pdfimages -v"');
    console.log('✅ 成功');
    console.log('stdout:', stdout);
    console.log('stderr:', stderr);
  } catch (error: any) {
    console.log('❌ 失败');
    console.log('error:', error.message);
    console.log('stderr:', error.stderr);
  }

  // 测试 3: 完整路径（如果用户提供）
  console.log('\n=== 测试 3: 获取 PATH ===');
  console.log('process.env.PATH:', process.env.PATH?.split(';').slice(0, 5).join('\n'));
}

test();
