# ParseFlow 项目结构重组脚本
# 自动化执行文档重组任务

param(
    [switch]$DryRun = $false,  # 模拟运行，不实际修改
    [switch]$Backup = $true     # 是否创建备份
)

$ErrorActionPreference = "Stop"

Write-Host "=" -NoNewline -ForegroundColor Cyan
for ($i = 0; $i -lt 70; $i++) { Write-Host "=" -NoNewline -ForegroundColor Cyan }
Write-Host ""
Write-Host "  ParseFlow 项目结构重组工具  " -ForegroundColor Cyan
Write-Host "=" -NoNewline -ForegroundColor Cyan
for ($i = 0; $i -lt 70; $i++) { Write-Host "=" -NoNewline -ForegroundColor Cyan }
Write-Host ""

if ($DryRun) {
    Write-Host "`n⚠️  模拟运行模式 - 不会实际修改文件" -ForegroundColor Yellow
}

# 获取项目根目录
$projectRoot = Split-Path -Parent $PSScriptRoot

# ==================== 阶段 0: 备份 ====================
function Backup-Project {
    Write-Host "`n📦 创建备份..." -ForegroundColor Cyan
    
    if (-not $DryRun) {
        try {
            Set-Location $projectRoot
            git add -A
            git commit -m "Backup before project structure reorganization" -q
            Write-Host "   ✅ Git 备份提交成功" -ForegroundColor Green
        }
        catch {
            Write-Host "   ⚠️  Git 备份失败: $_" -ForegroundColor Yellow
            $response = Read-Host "继续执行吗？(y/n)"
            if ($response -ne 'y') {
                exit 1
            }
        }
    }
    else {
        Write-Host "   [模拟] 创建 Git 备份" -ForegroundColor Gray
    }
}

# ==================== 阶段 1: 清理临时文件 ====================
function Clean-TemporaryFiles {
    Write-Host "`n🗑️  阶段 1: 清理临时文件" -ForegroundColor Cyan
    
    $tempFiles = @(
        "DOCS_REVIEW_FINAL.md",
        "FILE_NAMING_AUDIT.md",
        "SCRIPTS_REVIEW.md",
        "UPDATE_SUMMARY.md",
        "BUGFIX_INVALID_DATE.md",
        "CHECK_WINDSURF_VERSION.md",
        "MCP_WORKING_OPTIMIZATION.md",
        "NEXT_STEPS.md",
        "QUESTIONS_ANSWERED.md",
        "WHY_NOT_WORKING.md",
        "RESTART-WINDSURF.ps1"
    )
    
    foreach ($file in $tempFiles) {
        $filePath = Join-Path $projectRoot $file
        if (Test-Path $filePath) {
            if (-not $DryRun) {
                Remove-Item $filePath -Force
                Write-Host "   ✅ 删除: $file" -ForegroundColor Green
            }
            else {
                Write-Host "   [模拟] 删除: $file" -ForegroundColor Gray
            }
        }
        else {
            Write-Host "   ⏭️  跳过: $file (不存在)" -ForegroundColor DarkGray
        }
    }
}

# ==================== 阶段 2: 解决文档重复 ====================
function Resolve-DuplicateFiles {
    Write-Host "`n📄 阶段 2: 解决文档重复" -ForegroundColor Cyan
    
    $rootFAQ = Join-Path $projectRoot "FAQ.md"
    $docsFAQ = Join-Path $projectRoot "docs\FAQ.md"
    
    if ((Test-Path $rootFAQ) -and (Test-Path $docsFAQ)) {
        Write-Host "   ⚠️  发现重复的 FAQ.md" -ForegroundColor Yellow
        
        $rootSize = (Get-Item $rootFAQ).Length
        $docsSize = (Get-Item $docsFAQ).Length
        
        Write-Host "      根目录 FAQ.md: $rootSize bytes" -ForegroundColor Gray
        Write-Host "      docs/FAQ.md:   $docsSize bytes" -ForegroundColor Gray
        
        if (-not $DryRun) {
            # 删除 docs/FAQ.md（较旧的版本）
            Remove-Item $docsFAQ -Force
            Write-Host "   ✅ 删除: docs/FAQ.md (保留根目录版本)" -ForegroundColor Green
        }
        else {
            Write-Host "   [模拟] 删除 docs/FAQ.md" -ForegroundColor Gray
        }
    }
    else {
        Write-Host "   ✅ 没有发现重复文件" -ForegroundColor Green
    }
}

# ==================== 阶段 3: 创建目录结构 ====================
function Create-DirectoryStructure {
    Write-Host "`n📁 阶段 3: 创建新目录结构" -ForegroundColor Cyan
    
    $directories = @(
        "docs\guides",
        "docs\setup",
        "docs\development",
        "docs\planning"
    )
    
    foreach ($dir in $directories) {
        $dirPath = Join-Path $projectRoot $dir
        if (-not (Test-Path $dirPath)) {
            if (-not $DryRun) {
                New-Item -Path $dirPath -ItemType Directory -Force | Out-Null
                Write-Host "   ✅ 创建: $dir" -ForegroundColor Green
            }
            else {
                Write-Host "   [模拟] 创建: $dir" -ForegroundColor Gray
            }
        }
        else {
            Write-Host "   ⏭️  跳过: $dir (已存在)" -ForegroundColor DarkGray
        }
    }
}

# ==================== 阶段 4: 移动文档文件 ====================
function Move-DocumentationFiles {
    Write-Host "`n📤 阶段 4: 移动和重命名文档" -ForegroundColor Cyan
    
    $moves = @(
        # 移动到 guides/
        @{ From = "FAQ.md"; To = "docs\guides\faq.md" },
        @{ From = "QUICK_START.md"; To = "docs\guides\quick-start.md" },
        @{ From = "docs\EXAMPLES.md"; To = "docs\guides\examples.md" },
        
        # 移动到 setup/
        @{ From = "WINDSURF_SETUP.md"; To = "docs\setup\windsurf.md" },
        @{ From = "CURSOR_SETUP.md"; To = "docs\setup\cursor.md" },
        
        # 移动到 development/ (重命名)
        @{ From = "docs\DEVELOPMENT.md"; To = "docs\development\development.md" },
        @{ From = "docs\ARCHITECTURE.md"; To = "docs\development\architecture.md" },
        @{ From = "docs\API.md"; To = "docs\development\api.md" },
        @{ From = "docs\NAMING_CONVENTIONS.md"; To = "docs\development\naming-conventions.md" },
        
        # 移动到 planning/
        @{ From = "TODO.md"; To = "docs\planning\todo.md" },
        @{ From = "docs\DISTRIBUTION_ANALYSIS.md"; To = "docs\planning\distribution-analysis.md" }
    )
    
    foreach ($move in $moves) {
        $source = Join-Path $projectRoot $move.From
        $dest = Join-Path $projectRoot $move.To
        
        if (Test-Path $source) {
            if (-not $DryRun) {
                # 确保目标目录存在
                $destDir = Split-Path -Parent $dest
                if (-not (Test-Path $destDir)) {
                    New-Item -Path $destDir -ItemType Directory -Force | Out-Null
                }
                
                Move-Item -Path $source -Destination $dest -Force
                Write-Host "   ✅ 移动: $($move.From) → $($move.To)" -ForegroundColor Green
            }
            else {
                Write-Host "   [模拟] 移动: $($move.From) → $($move.To)" -ForegroundColor Gray
            }
        }
        else {
            Write-Host "   ⏭️  跳过: $($move.From) (不存在)" -ForegroundColor DarkGray
        }
    }
}

# ==================== 阶段 5: 创建目录索引 ====================
function Create-DirectoryIndexes {
    Write-Host "`n📋 阶段 5: 创建目录索引" -ForegroundColor Cyan
    
    # 主文档索引
    $docsIndexContent = @"
# ParseFlow 文档中心

欢迎查阅 ParseFlow 文档！

## 📖 用户指南

- [快速开始](guides/quick-start.md) - 5分钟上手 ParseFlow
- [常见问题](guides/faq.md) - 常见问题解答
- [使用示例](guides/examples.md) - 代码示例和最佳实践

## ⚙️ 环境配置

- [Windsurf 配置](setup/windsurf.md) - Windsurf IDE 配置指南
- [Cursor 配置](setup/cursor.md) - Cursor IDE 配置指南

## 🛠️ 开发文档

- [开发指南](development/development.md) - 如何参与开发
- [架构设计](development/architecture.md) - 系统架构说明
- [API 文档](development/api.md) - API 参考文档
- [命名规范](development/naming-conventions.md) - 代码和文件命名规范

## 📋 项目规划

- [待办事项](planning/todo.md) - 功能路线图和待办清单
- [分发分析](planning/distribution-analysis.md) - 发布和分发计划

## 🔗 其他资源

- [项目主页](../README.md)
- [贡献指南](../CONTRIBUTING.md)
- [变更日志](../CHANGELOG.md)
- [许可证](../LICENSE)

---

**提示**: 如果你是新用户，建议从 [快速开始](guides/quick-start.md) 开始。
"@
    
    $indexes = @{
        "docs\README.md" = $docsIndexContent
    }
    
    foreach ($file in $indexes.Keys) {
        $filePath = Join-Path $projectRoot $file
        
        if (-not $DryRun) {
            Set-Content -Path $filePath -Value $indexes[$file] -Encoding UTF8
            Write-Host "   ✅ 创建: $file" -ForegroundColor Green
        }
        else {
            Write-Host "   [模拟] 创建: $file" -ForegroundColor Gray
        }
    }
}

# ==================== 阶段 6: 更新文档链接警告 ====================
function Show-LinkUpdateWarning {
    Write-Host "`n⚠️  阶段 6: 需要手动更新文档链接" -ForegroundColor Yellow
    
    Write-Host "`n   需要更新链接的文件:" -ForegroundColor White
    Write-Host "   • README.md - 更新所有文档链接" -ForegroundColor Gray
    Write-Host "   • CONTRIBUTING.md - 更新开发文档链接" -ForegroundColor Gray
    Write-Host "   • 各文档内部的相互引用链接" -ForegroundColor Gray
    
    Write-Host "`n   建议使用全局搜索替换:" -ForegroundColor White
    Write-Host "   • FAQ.md → docs/guides/faq.md" -ForegroundColor Gray
    Write-Host "   • QUICK_START.md → docs/guides/quick-start.md" -ForegroundColor Gray
    Write-Host "   • TODO.md → docs/planning/todo.md" -ForegroundColor Gray
    Write-Host "   • 等等..." -ForegroundColor Gray
}

# ==================== 主执行流程 ====================
function Main {
    Write-Host "`n开始执行项目重组..." -ForegroundColor Cyan
    
    try {
        # 阶段 0: 备份
        if ($Backup) {
            Backup-Project
        }
        
        # 阶段 1: 清理临时文件
        Clean-TemporaryFiles
        
        # 阶段 2: 解决文档重复
        Resolve-DuplicateFiles
        
        # 阶段 3: 创建目录结构
        Create-DirectoryStructure
        
        # 阶段 4: 移动文档文件
        Move-DocumentationFiles
        
        # 阶段 5: 创建目录索引
        Create-DirectoryIndexes
        
        # 阶段 6: 链接更新警告
        Show-LinkUpdateWarning
        
        Write-Host "`n" -NoNewline
        Write-Host "=" -NoNewline -ForegroundColor Green
        for ($i = 0; $i -lt 70; $i++) { Write-Host "=" -NoNewline -ForegroundColor Green }
        Write-Host ""
        
        if ($DryRun) {
            Write-Host "  ✅ 模拟运行完成！可以使用 -DryRun:`$false 执行实际操作  " -ForegroundColor Yellow
        }
        else {
            Write-Host "  ✅ 项目重组完成！请手动更新文档链接  " -ForegroundColor Green
        }
        
        Write-Host "=" -NoNewline -ForegroundColor Green
        for ($i = 0; $i -lt 70; $i++) { Write-Host "=" -NoNewline -ForegroundColor Green }
        Write-Host ""
        
        Write-Host "`n📝 下一步:" -ForegroundColor Cyan
        Write-Host "   1. 检查移动后的文件" -ForegroundColor White
        Write-Host "   2. 更新 README.md 中的链接" -ForegroundColor White
        Write-Host "   3. 更新其他文档中的链接" -ForegroundColor White
        Write-Host "   4. 测试所有链接是否正常" -ForegroundColor White
        Write-Host "   5. 提交更改: git commit -m 'Reorganize project structure'" -ForegroundColor White
    }
    catch {
        Write-Host "`n❌ 错误: $_" -ForegroundColor Red
        Write-Host "`n💡 提示: 使用 -DryRun 参数先模拟运行" -ForegroundColor Yellow
        exit 1
    }
}

# 执行主流程
Main
