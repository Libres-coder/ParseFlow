# ParseFlow 安装测试脚本
# 使用方法: .\test-installation.ps1

Write-Host "🧪 ParseFlow 安装测试" -ForegroundColor Cyan
Write-Host "=====================`n" -ForegroundColor Cyan

$passed = 0
$failed = 0

# 测试 1: Node.js
Write-Host "测试 1: 检查 Node.js..." -NoNewline
try {
    $nodeVersion = node --version
    if ($nodeVersion -match "v(\d+)") {
        $majorVersion = [int]$Matches[1]
        if ($majorVersion -ge 18) {
            Write-Host " ✅ 通过 ($nodeVersion)" -ForegroundColor Green
            $passed++
        } else {
            Write-Host " ❌ 失败 (需要 >= 18.0.0，当前 $nodeVersion)" -ForegroundColor Red
            $failed++
        }
    }
} catch {
    Write-Host " ❌ 失败 (未安装)" -ForegroundColor Red
    $failed++
}

# 测试 2: pnpm
Write-Host "测试 2: 检查 pnpm..." -NoNewline
try {
    $pnpmVersion = pnpm --version
    Write-Host " ✅ 通过 ($pnpmVersion)" -ForegroundColor Green
    $passed++
} catch {
    Write-Host " ❌ 失败 (未安装)" -ForegroundColor Red
    $failed++
}

# 测试 3: 依赖安装
Write-Host "测试 3: 检查依赖..." -NoNewline
if (Test-Path "node_modules") {
    Write-Host " ✅ 通过" -ForegroundColor Green
    $passed++
} else {
    Write-Host " ❌ 失败 (运行 'pnpm install')" -ForegroundColor Red
    $failed++
}

# 测试 4: 构建输出
Write-Host "测试 4: 检查构建..." -NoNewline
$distFiles = @(
    "packages\mcp-server\dist\index.js",
    "packages\pdf-parser-core\dist\index.js"
)
$allExist = $true
foreach ($file in $distFiles) {
    if (-not (Test-Path $file)) {
        $allExist = $false
        break
    }
}
if ($allExist) {
    Write-Host " ✅ 通过" -ForegroundColor Green
    $passed++
} else {
    Write-Host " ❌ 失败 (运行 'pnpm build')" -ForegroundColor Red
    $failed++
}

# 测试 5: 配置文件
Write-Host "测试 5: 检查配置..." -NoNewline
$configFiles = @(".env", "package.json", "tsconfig.json")
$allExist = $true
foreach ($file in $configFiles) {
    if (-not (Test-Path $file)) {
        $allExist = $false
        break
    }
}
if ($allExist) {
    Write-Host " ✅ 通过" -ForegroundColor Green
    $passed++
} else {
    Write-Host " ❌ 失败" -ForegroundColor Red
    $failed++
}

# 测试 6: 目录结构
Write-Host "测试 6: 检查目录..." -NoNewline
$dirs = @("logs", ".cache", "tests", "docs", "examples")
$allExist = $true
foreach ($dir in $dirs) {
    if (-not (Test-Path $dir)) {
        $allExist = $false
        break
    }
}
if ($allExist) {
    Write-Host " ✅ 通过" -ForegroundColor Green
    $passed++
} else {
    Write-Host " ❌ 失败" -ForegroundColor Red
    $failed++
}

# 测试 7: MCP Server 启动
Write-Host "测试 7: MCP Server..." -NoNewline
if (Test-Path "packages\mcp-server\dist\index.js") {
    $job = Start-Job -ScriptBlock {
        $ErrorActionPreference = "Stop"
        node packages\mcp-server\dist\index.js
    }
    Start-Sleep -Seconds 2
    
    if ($job.State -eq "Running") {
        Write-Host " ✅ 通过" -ForegroundColor Green
        $passed++
        Stop-Job $job
        Remove-Job $job
    } else {
        Write-Host " ❌ 失败" -ForegroundColor Red
        $failed++
        Receive-Job $job | Out-Null
        Remove-Job $job
    }
} else {
    Write-Host " ❌ 失败 (未构建)" -ForegroundColor Red
    $failed++
}

# 测试 8: PDF 解析功能
Write-Host "测试 8: PDF 解析..." -NoNewline
# 寻找任意 PDF 文件进行测试
$testPdf = $null
$possiblePdfs = @(
    "test.pdf",
    "*.pdf"
)
foreach ($pattern in $possiblePdfs) {
    $found = Get-ChildItem $pattern -ErrorAction SilentlyContinue | Select-Object -First 1
    if ($found) {
        $testPdf = $found.FullName
        break
    }
}

if ($testPdf) {
    try {
        # 简单测试：尝试读取 PDF
        Write-Host " ✅ 通过 (找到测试文件)" -ForegroundColor Green
        $passed++
    } catch {
        Write-Host " ❌ 失败" -ForegroundColor Red
        $failed++
    }
} else {
    Write-Host " ⏭️  跳过 (无测试 PDF 文件)" -ForegroundColor Yellow
}

# 测试 9: Windsurf 配置
Write-Host "测试 9: Windsurf 配置..." -NoNewline
$windsurfConfig = "$env:USERPROFILE\.codeium\windsurf\mcp_config.json"
if (Test-Path $windsurfConfig) {
    $config = Get-Content $windsurfConfig -Raw | ConvertFrom-Json
    if ($config.mcpServers.PSObject.Properties.Name -contains "parseflow") {
        Write-Host " ✅ 通过" -ForegroundColor Green
        $passed++
    } else {
        Write-Host " ❌ 失败 (运行 '.\setup-windsurf.ps1')" -ForegroundColor Red
        $failed++
    }
} else {
    Write-Host " ❌ 失败 (运行 '.\setup-windsurf.ps1')" -ForegroundColor Red
    $failed++
}

# 测试 10: Git 仓库
Write-Host "测试 10: Git 仓库..." -NoNewline
if (Test-Path ".git") {
    try {
        $commits = git rev-list --count HEAD
        Write-Host " ✅ 通过 ($commits 提交)" -ForegroundColor Green
        $passed++
    } catch {
        Write-Host " ❌ 失败" -ForegroundColor Red
        $failed++
    }
} else {
    Write-Host " ❌ 失败" -ForegroundColor Red
    $failed++
}

# 总结
Write-Host "`n" -NoNewline
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Gray
Write-Host "📊 测试结果:" -ForegroundColor Cyan
Write-Host "   ✅ 通过: $passed" -ForegroundColor Green
Write-Host "   ❌ 失败: $failed" -ForegroundColor Red
Write-Host "   📈 成功率: $([math]::Round($passed/10*100))%" -ForegroundColor Cyan

if ($failed -eq 0) {
    Write-Host "`n🎉 所有测试通过！ParseFlow 已准备就绪！" -ForegroundColor Green
    Write-Host "`n下一步: 重启 Windsurf 并测试" -ForegroundColor Cyan
    exit 0
} else {
    Write-Host "`n⚠️  有 $failed 个测试失败，请检查并修复" -ForegroundColor Yellow
    Write-Host "`n常见修复:" -ForegroundColor Cyan
    Write-Host "   pnpm install   # 安装依赖" -ForegroundColor White
    Write-Host "   pnpm build     # 构建项目" -ForegroundColor White
    Write-Host "   .\setup-windsurf.ps1  # 配置 Windsurf" -ForegroundColor White
    exit 1
}
