# ParseFlow - Windsurf Local Configuration Guide

[中文](../../setup/windsurf.md) | **English**

## ⚠️ Important Notice

**ParseFlow is a local project and is NOT in any public MCP Registry or Marketplace!**

You need to manually configure it by editing Windsurf's `mcp_config.json` file.

---

## 📋 Prerequisites

### 1. Ensure Project is Built

```powershell
cd D:\ParseFlow
pnpm install
pnpm build
```

### 2. Verify File Exists

Check if the MCP Server has been compiled:

```powershell
dir D:\ParseFlow\packages\mcp-server\dist\index.js
```

If the file exists, proceed to the next step.

---

## 🔧 Configuration Steps

### Method A: Automatic Configuration (Recommended)

Use the provided configuration script:

```powershell
cd D:\ParseFlow
.\scripts\setup-windsurf.ps1
```

The script will automatically:

1. Check environment
2. Build the project
3. Locate Windsurf config file
4. Add ParseFlow configuration
5. Prompt to restart Windsurf

---

### Method B: Manual Configuration

If the automatic script fails, configure manually:

#### 1. Locate Configuration File

Windsurf's MCP configuration file location:

```
C:\Users\your-username\.codeium\windsurf\mcp_config.json
```

**Note**: NOT in `AppData\Roaming\Windsurf\`!

#### 2. Edit Configuration File

Open `mcp_config.json`:

```powershell
# Open with Notepad (replace with your username)
notepad C:\Users\<your-username>\.codeium\windsurf\mcp_config.json
```

#### 3. Add ParseFlow Configuration

If the file is empty, add:

```json
{
  "mcpServers": {
    "parseflow": {
      "command": "node",
      "args": ["<project-root>\\packages\\mcp-server\\dist\\index.js"],
      "env": {
        "PARSEFLOW_CACHE_DIR": "<project-root>\\.cache",
        "PARSEFLOW_MAX_FILE_SIZE": "52428800",
        "PARSEFLOW_ALLOWED_PATHS": "D:\\;C:\\Users",
        "LOG_LEVEL": "info",
        "PARSEFLOW_LOG_FILE": "<project-root>\\logs\\parseflow.log",
        "PARSEFLOW_ERROR_LOG_FILE": "<project-root>\\logs\\error.log"
      }
    }
  }
}
```

If the file already has other MCP servers, add to the `mcpServers` object:

```json
{
  "mcpServers": {
    "existing-server": {
      ...
    },
    "parseflow": {
      "command": "node",
      "args": [
        "<project-root>\\packages\\mcp-server\\dist\\index.js"
      ],
      "env": {
        "PARSEFLOW_CACHE_DIR": "<project-root>\\.cache",
        "PARSEFLOW_MAX_FILE_SIZE": "52428800",
        "PARSEFLOW_ALLOWED_PATHS": "D:\\;C:\\Users",
        "LOG_LEVEL": "info",
        "PARSEFLOW_LOG_FILE": "<project-root>\\logs\\parseflow.log",
        "PARSEFLOW_ERROR_LOG_FILE": "<project-root>\\logs\\error.log"
      }
    }
  }
}
```

#### 4. Modify Paths (If Needed)

**Important**: If your ParseFlow is not in `D:\ParseFlow`, you need to modify:

- `args[0]`: Change to your actual path
- `PARSEFLOW_CACHE_DIR`: Change to your cache directory
- `PARSEFLOW_LOG_FILE`: Change to your log path
- `PARSEFLOW_ERROR_LOG_FILE`: Change to your error log path

For example, if located in `E:\MyProjects\ParseFlow`:

```json
{
  "command": "node",
  "args": ["E:\\MyProjects\\ParseFlow\\packages\\mcp-server\\dist\\index.js"],
  "env": {
    "PARSEFLOW_CACHE_DIR": "E:\\MyProjects\\ParseFlow\\.cache",
    "PARSEFLOW_ALLOWED_PATHS": "E:\\;D:\\;C:\\Users",
    "LOG_LEVEL": "info",
    "PARSEFLOW_LOG_FILE": "E:\\MyProjects\\ParseFlow\\logs\\parseflow.log",
    "PARSEFLOW_ERROR_LOG_FILE": "E:\\MyProjects\\ParseFlow\\logs\\error.log"
  }
}
```

---

## 🔄 Restart Windsurf

**Critical Step**: You MUST completely restart Windsurf!

### Option 1: Complete Exit and Restart

1. Close all Windsurf windows
2. Check Task Manager to ensure no `Windsurf.exe` processes remain
3. Restart Windsurf
4. Wait 10-20 seconds for MCP Server to load

### Option 2: Use Script to Restart (Windows)

```powershell
# Kill all Windsurf processes
Get-Process -Name "Windsurf" -ErrorAction SilentlyContinue | Stop-Process -Force

# Wait a few seconds
Start-Sleep -Seconds 3

# Restart (adjust path based on your installation)
Start-Process "C:\Users\<your-username>\AppData\Local\Programs\Windsurf\Windsurf.exe"
```

---

## ✅ Verify Configuration

### 1. Check Logs

After MCP Server starts, it will log to the file:

```powershell
# View logs
Get-Content D:\ParseFlow\logs\parseflow.log -Tail 20
```

You should see:

```
[info] Starting ParseFlow MCP Server...
[info] ParseFlow MCP Server started successfully
```

### 2. Test Functionality

Test in a new Windsurf conversation:

```
Test 1: "How many pages does D:\document.pdf have?"
Expected: Cascade directly answers with page count, doesn't write scripts

Test 2: "Analyze the content of D:\report.pdf"
Expected: Cascade calls extract_text tool

Test 3: "Search for 'keyword' in D:\document.pdf"
Expected: Cascade calls search_pdf tool
```

### 3. Check Cascade's Thought Process

Success indicators:

- ✅ See "MCP Tool: parseflow / get_metadata" or similar
- ✅ Returns results directly, no script writing
- ✅ Completes in 3-10 seconds

---

## 🔍 Troubleshooting

### Issue 1: Windsurf Doesn't Call ParseFlow

**Possible Causes**:

1. Windsurf not completely restarted
2. Configuration file path incorrect
3. MCP Server build failed
4. Special characters in path

**Solutions**:

```powershell
# 1. Check configuration file
cat C:\Users\<your-username>\.codeium\windsurf\mcp_config.json

# 2. Check if MCP Server can start manually
node D:\ParseFlow\packages\mcp-server\dist\index.js

# 3. View logs
cat D:\ParseFlow\logs\parseflow.log

# 4. Use diagnostic script
.\scripts\check-mcp-status.ps1
```

### Issue 2: "Cannot find module" Error

**Cause**: MCP Server not built or path incorrect

**Solution**:

```powershell
cd D:\ParseFlow
pnpm install
pnpm build
```

### Issue 3: Log File Not Generated

**Cause**: MCP Server never started by Windsurf

**Check**:

1. Is config file path correct (`.codeium\windsurf\mcp_config.json`)?
2. Is config file JSON format correct?
3. Was Windsurf completely restarted?

### Issue 4: Permission Error

**Cause**: No permission to access specified paths

**Solution**:

- Ensure `PARSEFLOW_ALLOWED_PATHS` includes directories you want to access
- Ensure ParseFlow directory has read/write permissions

---

## 📝 Configuration Details

### Environment Variables

| Variable                   | Default    | Description                                 |
| -------------------------- | ---------- | ------------------------------------------- |
| `PARSEFLOW_CACHE_DIR`      | `.cache`   | Cache directory                             |
| `PARSEFLOW_MAX_FILE_SIZE`  | `52428800` | Max file size 50MB                          |
| `PARSEFLOW_ALLOWED_PATHS`  | None       | Allowed access paths, separated by `;`      |
| `LOG_LEVEL`                | `info`     | Log level: `error`, `warn`, `info`, `debug` |
| `PARSEFLOW_LOG_FILE`       | None       | Log file path                               |
| `PARSEFLOW_ERROR_LOG_FILE` | None       | Error log file path                         |

### Path Format

**Windows**: Use double backslash `\\` or single forward slash `/`

```json
"<project-root>\\dist\\index.js"
or
"<project-root>/dist/index.js"
```

**Allowed Paths**: Semicolon-separated

```json
"PARSEFLOW_ALLOWED_PATHS": "D:\\;E:\\Projects;C:\\Users"
```

---

## 🎯 Quick Reference

### Configuration File Location

```
C:\Users\your-username\.codeium\windsurf\mcp_config.json
```

### Minimal Configuration

```json
{
  "mcpServers": {
    "parseflow": {
      "command": "node",
      "args": ["<project-root>\\packages\\mcp-server\\dist\\index.js"]
    }
  }
}
```

### Full Configuration (Template)

See detailed configuration example above.

---

## 📚 Related Documentation

- [Quick Start Guide](../guides/quick-start.md) - 5-minute setup
- [FAQ](../guides/faq.md) - Common questions
- [API Documentation](../development/api.md) - API reference
- [TODO](../planning/todo.md) - Development roadmap

---

## ⚠️ Important Notes

1. **Local Project**: ParseFlow is currently for local use only, not published to any public registry
2. **Manual Configuration**: Must manually edit `mcp_config.json`, cannot install through UI Marketplace
3. **Complete Restart**: After configuration, must completely restart Windsurf, not just reload window
4. **Correct Paths**: Ensure all paths point to correct locations, use absolute paths
5. **Environment Isolation**: Different Windsurf installations may have different config file locations

---

**Last Updated**: 2025-11-26  
**ParseFlow Version**: 1.0.0  
**Configuration Method**: Local `mcp_config.json` editing
