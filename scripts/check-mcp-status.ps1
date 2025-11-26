# Quick MCP Status Check

Write-Host "=== ParseFlow MCP Status ===" -ForegroundColor Cyan

# 1. Check if Windsurf is running
Write-Host "`n1. Windsurf Process:"
$windsurf = Get-Process -Name "Windsurf" -ErrorAction SilentlyContinue
if ($windsurf) {
    Write-Host "   FOUND: $($windsurf.Count) process(es) running" -ForegroundColor Yellow
    Write-Host "   ACTION: Close Windsurf completely and restart" -ForegroundColor Yellow
} else {
    Write-Host "   OK: Not running" -ForegroundColor Green
}

# 2. Check config file
Write-Host "`n2. MCP Config File:"
$configPath = "$env:USERPROFILE\.codeium\windsurf\mcp_config.json"
if (Test-Path $configPath) {
    Write-Host "   OK: Exists at $configPath" -ForegroundColor Green
    $config = Get-Content $configPath -Raw | ConvertFrom-Json
    if ($config.mcpServers.parseflow) {
        Write-Host "   OK: parseflow configured" -ForegroundColor Green
    } else {
        Write-Host "   ERROR: parseflow not found in config" -ForegroundColor Red
    }
} else {
    Write-Host "   ERROR: Config file not found" -ForegroundColor Red
}

# 3. Check MCP Server file
Write-Host "`n3. MCP Server File:"
$currentPath = (Get-Location).Path
$serverPath = "$currentPath\packages\mcp-server\dist\index.js"
if (Test-Path $serverPath) {
    Write-Host "   OK: Exists" -ForegroundColor Green
} else {
    Write-Host "   ERROR: Not found at $serverPath" -ForegroundColor Red
}

# 4. Test MCP Server startup
Write-Host "`n4. MCP Server Startup Test:"
$job = Start-Job -ScriptBlock { 
    param($path)
    node $path
} -ArgumentList $serverPath
Start-Sleep -Seconds 2
if ($job.State -eq "Running") {
    Write-Host "   OK: Can start" -ForegroundColor Green
    Stop-Job $job
} else {
    Write-Host "   ERROR: Failed to start" -ForegroundColor Red
}
Remove-Job $job -ErrorAction SilentlyContinue

# 5. Check logs
Write-Host "`n5. Log File:"
$logPath = "$currentPath\logs\parseflow.log"
if (Test-Path $logPath) {
    $logSize = (Get-Item $logPath).Length
    if ($logSize -eq 0) {
        Write-Host "   WARNING: Log file is empty (never used)" -ForegroundColor Yellow
    } else {
        Write-Host "   OK: Log file exists ($logSize bytes)" -ForegroundColor Green
        Write-Host "`n   Last 3 log entries:" -ForegroundColor Cyan
        Get-Content $logPath -Tail 3 | ForEach-Object {
            Write-Host "   $_" -ForegroundColor Gray
        }
    }
} else {
    Write-Host "   WARNING: No log file (never run)" -ForegroundColor Yellow
}

# Summary
Write-Host "`n=== NEXT STEPS ===" -ForegroundColor Cyan
Write-Host "1. Close ALL Windsurf windows"
Write-Host "2. Check Task Manager - end Windsurf.exe if running"
Write-Host "3. Restart Windsurf"
Write-Host "4. In Windsurf, ask: 'D:\7.pdf how many pages?'"
Write-Host "5. If it still doesn't work, check Windsurf output panel"

Write-Host "`nTest command:"
Write-Host "node $serverPath" -ForegroundColor Gray
Write-Host ""
