# ParseFlow Cursor 自动配置脚本
# 使用方法: .\setup-cursor.ps1

Write-Host "🚀 ParseFlow Cursor 配置向导" -ForegroundColor Cyan
Write-Host "================================`n" -ForegroundColor Cyan

# 检查 Node.js
Write-Host "1️⃣ 检查环境..." -ForegroundColor Yellow
try {
    $nodeVersion = node --version
    Write-Host "   ✅ Node.js: $nodeVersion" -ForegroundColor Green
} catch {
    Write-Host "   ❌ 未安装 Node.js，请先安装" -ForegroundColor Red
    exit 1
}

# 检查构建
Write-Host "`n2️⃣ 检查项目构建..." -ForegroundColor Yellow
if (Test-Path "packages\mcp-server\dist\index.js") {
    Write-Host "   ✅ 项目已构建" -ForegroundColor Green
} else {
    Write-Host "   ⚠️  项目未构建，正在构建..." -ForegroundColor Yellow
    pnpm build
    if ($LASTEXITCODE -eq 0) {
        Write-Host "   ✅ 构建成功" -ForegroundColor Green
    } else {
        Write-Host "   ❌ 构建失败" -ForegroundColor Red
        exit 1
    }
}

# 定位 Cursor 配置目录
Write-Host "`n3️⃣ 定位 Cursor 配置..." -ForegroundColor Yellow
$cursorDir = "$env:USERPROFILE\.cursor"
$configPath = "$cursorDir\mcp.json"

Write-Host "   配置文件路径: $configPath" -ForegroundColor Gray

if (-not (Test-Path $cursorDir)) {
    Write-Host "   ⚠️  配置目录不存在，正在创建..." -ForegroundColor Yellow
    New-Item -ItemType Directory -Path $cursorDir -Force | Out-Null
    Write-Host "   ✅ 已创建配置目录" -ForegroundColor Green
} else {
    Write-Host "   ✅ 找到 Cursor 配置目录" -ForegroundColor Green
}

# 读取或创建配置
Write-Host "`n4️⃣ 配置 MCP Server..." -ForegroundColor Yellow

$currentPath = (Get-Location).Path
$mcpServerPath = "$currentPath\packages\mcp-server\dist\index.js"

# 构建配置对象
$parseflowConfig = @{
    command = "node"
    args = @($mcpServerPath)
    env = @{
        PARSEFLOW_CACHE_DIR = "$currentPath\.cache"
        PARSEFLOW_MAX_FILE_SIZE = "52428800"
        PARSEFLOW_ALLOWED_PATHS = "D:\;C:\Users"
        LOG_LEVEL = "info"
        PARSEFLOW_LOG_FILE = "$currentPath\logs\parseflow.log"
        PARSEFLOW_ERROR_LOG_FILE = "$currentPath\logs\error.log"
    }
}

# 检查现有配置
$skipConfig = $false
if (Test-Path $configPath) {
    Write-Host "   📝 发现现有配置文件" -ForegroundColor Cyan
    $existingConfig = Get-Content $configPath -Raw | ConvertFrom-Json
    
    if ($existingConfig.mcpServers.PSObject.Properties.Name -contains "parseflow") {
        Write-Host "   ⚠️  ParseFlow 配置已存在" -ForegroundColor Yellow
        $overwrite = Read-Host "   是否覆盖? (y/N)"
        if ($overwrite -ne "y") {
            Write-Host "   ⏭️  跳过配置" -ForegroundColor Yellow
            $skipConfig = $true
        }
    }
    
    if (-not $skipConfig) {
        $existingConfig.mcpServers | Add-Member -NotePropertyName "parseflow" -NotePropertyValue $parseflowConfig -Force
        $existingConfig | ConvertTo-Json -Depth 10 | Set-Content $configPath
        Write-Host "   ✅ 配置已更新" -ForegroundColor Green
    }
} else {
    # 创建新配置
    $newConfig = @{
        mcpServers = @{
            parseflow = $parseflowConfig
        }
    }
    $newConfig | ConvertTo-Json -Depth 10 | Set-Content $configPath
    Write-Host "   ✅ 配置文件已创建" -ForegroundColor Green
}

# 显示配置摘要
Write-Host "`n📋 配置摘要:" -ForegroundColor Cyan
Write-Host "   配置文件: $configPath" -ForegroundColor White
Write-Host "   MCP Server: $mcpServerPath" -ForegroundColor White
Write-Host "   缓存目录: $currentPath\.cache" -ForegroundColor White
Write-Host "   日志目录: $currentPath\logs" -ForegroundColor White

# 测试 MCP Server
Write-Host "`n5️⃣ 测试 MCP Server..." -ForegroundColor Yellow
Write-Host "   正在启动服务器 (按 Ctrl+C 停止)..." -ForegroundColor Cyan
Write-Host "   " -NoNewline

$job = Start-Job -ScriptBlock {
    param($serverPath)
    node $serverPath
} -ArgumentList $mcpServerPath

Start-Sleep -Seconds 3

if ($job.State -eq "Running") {
    Write-Host "✅ 服务器运行正常" -ForegroundColor Green
    Stop-Job $job
    Remove-Job $job
} else {
    Write-Host "❌ 服务器启动失败" -ForegroundColor Red
    Receive-Job $job
    Remove-Job $job
    exit 1
}

# 完成
Write-Host "`n✨ 配置完成!" -ForegroundColor Green
Write-Host "`n📖 下一步 (重要):" -ForegroundColor Cyan
Write-Host "   1. 完全退出 Cursor (确认任务管理器中无进程)" -ForegroundColor White
Write-Host "   2. 重新启动 Cursor" -ForegroundColor White
Write-Host "   3. 在 Composer 中切换到 Agent 模式 (重要!)" -ForegroundColor Yellow
Write-Host "   4. 测试命令:" -ForegroundColor White
Write-Host "      请使用 parseflow 工具读取 D:\test.pdf 的内容" -ForegroundColor Gray

Write-Host "`n⚠️  注意事项:" -ForegroundColor Yellow
Write-Host "   - Cursor MCP 只在 Agent 模式下可用" -ForegroundColor White
Write-Host "   - 必须明确指示使用 parseflow 工具" -ForegroundColor White
Write-Host "   - 不会像 Windsurf 一样自动识别" -ForegroundColor White

Write-Host "`n📚 更多帮助:" -ForegroundColor Cyan
Write-Host "   - Cursor 配置: CURSOR_SETUP.md" -ForegroundColor White
Write-Host "   - Windsurf 配置: WINDSURF_SETUP.md" -ForegroundColor White
Write-Host "   - 快速开始: QUICK_START.md" -ForegroundColor White
Write-Host "   - 常见问题: FAQ.md" -ForegroundColor White

Write-Host "`n💡 提示: 如果两个 IDE 都有，推荐使用 Windsurf (体验更好)" -ForegroundColor Cyan
Write-Host "`n🎉 祝您使用愉快!" -ForegroundColor Green
