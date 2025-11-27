# 🪟 Windows 安装外部工具指南

为了在 Windows 上使用图片和目录提取功能，需要安装外部工具。

---

## 📦 方法 1: 使用 Scoop (推荐) ⭐

### 1. 安装 Scoop

```powershell
# 在 PowerShell 中运行
Set-ExecutionPolicy RemoteSigned -Scope CurrentUser
irm get.scoop.sh | iex
```

### 2. 安装工具

```powershell
# 安装 poppler (包含 pdfimages, pdfinfo)
scoop install poppler

# 安装 pdftk
scoop bucket add extras
scoop install pdftk
```

### 3. 验证安装

```powershell
pdfimages -v
pdftk --version
pdfinfo -v
```

---

## 📦 方法 2: 手动下载安装

### 1. 安装 Poppler

**下载**:
https://github.com/oschwartz10612/poppler-windows/releases

**步骤**:
1. 下载最新的 `Release-XX.XX.X-X.zip`
2. 解压到 `C:\poppler`
3. 添加到 PATH:
   - 右键"此电脑" → 属性 → 高级系统设置
   - 环境变量 → 系统变量 → Path → 编辑
   - 新建 → 输入 `C:\poppler\Library\bin`
   - 确定

**验证**:
```powershell
# 重启 PowerShell
pdfimages -v
# 应该显示版本信息
```

### 2. 安装 PDFtk

**下载**:
https://www.pdflabs.com/tools/pdftk-the-pdf-toolkit/

**步骤**:
1. 下载 PDFtk Free 安装程序
2. 运行安装程序
3. 安装完成后，PDFtk 会自动添加到 PATH

**验证**:
```powershell
pdftk --version
```

---

## 🧪 测试安装

安装完成后，运行测试脚本：

```powershell
cd D:\ParseFlow
node test-extraction.js
```

**期望输出**:
```
🖼️  测试图片提取 (ImageExtractorExternal)...
   工具状态: ✅ 可用
   ✅ 图片提取成功!
   提取数量: X 张

📑 测试目录提取 (TOCExtractorExternal)...
   工具状态:
     pdftk:   ✅ 可用
     pdfinfo: ✅ 可用
```

---

## ⚡ 快速开始（安装后）

```typescript
import { ImageExtractorExternal, TOCExtractorExternal } from '@parseflow/core';

// 图片提取
const imgExt = new ImageExtractorExternal();
if (await imgExt.isAvailable()) {
  const images = await imgExt.extract(
    'D:\\ParseFlow\\PDF测试文档.pdf',
    './output/images'
  );
  console.log(`提取了 ${images.length} 张图片`);
}

// 目录提取
const tocExt = new TOCExtractorExternal();
const available = await tocExt.isAvailable();
if (available.pdftk || available.pdfinfo) {
  const toc = await tocExt.extract('D:\\ParseFlow\\PDF测试文档.pdf');
  console.log(`提取了 ${toc.length} 个目录项`);
}
```

---

## 🔧 故障排除

### 问题 1: "不是内部或外部命令"

**原因**: PATH 未正确配置

**解决**:
1. 确认工具已安装
2. 检查 PATH 环境变量
3. 重启 PowerShell/终端
4. 重启 VS Code

### 问题 2: "pdfimages 不可用"

**检查**:
```powershell
where.exe pdfimages
# 应该显示路径，如: C:\poppler\Library\bin\pdfimages.exe
```

**如果没有显示**:
- 重新检查 PATH 配置
- 确认 poppler 安装目录正确

### 问题 3: 权限问题

**运行 PowerShell 时使用管理员权限**:
```powershell
# 右键 PowerShell → 以管理员身份运行
```

---

## 📊 验证清单

安装完成后，检查以下项目：

- [ ] `pdfimages -v` 显示版本信息
- [ ] `pdfinfo -v` 显示版本信息  
- [ ] `pdftk --version` 显示版本信息
- [ ] `node test-extraction.js` 运行成功
- [ ] 图片提取工具状态显示 ✅
- [ ] 目录提取工具状态显示 ✅

---

## 💡 提示

1. **Scoop 方法更简单** - 推荐使用 Scoop 包管理器
2. **重启终端** - 修改 PATH 后需要重启
3. **检查版本** - 确保使用最新版本的工具
4. **路径空格** - 如果路径包含空格，使用引号

---

**更新**: 2025-11-28  
**测试环境**: Windows 10/11

