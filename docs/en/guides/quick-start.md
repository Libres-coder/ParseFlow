# ParseFlow Quick Start Guide

[中文](../../guides/quick-start.md) | **English**

## 🚀 Get Started in 5 Minutes

### Step 1: Choose Your IDE

ParseFlow supports two IDEs:

#### Option A: Windsurf (Recommended, Auto-detect)

**Config File Location**:

```
C:\Users\<your-username>\.codeium\windsurf\mcp_config.json
```

**Open File**:

```powershell
notepad C:\Users\<your-username>\.codeium\windsurf\mcp_config.json
```

#### Option B: Cursor (Requires Explicit Tool Call in Agent Mode)

**Config File Location**:

```
C:\Users\<your-username>\.cursor\mcp.json
```

**Open File**:

```powershell
notepad C:\Users\<your-username>\.cursor\mcp.json
```

⚠️ **Note**: The config file locations are different for each IDE!

---

### Step 2: Add ParseFlow Configuration

Copy the following content to your config file (based on your chosen IDE):

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
        "LOG_LEVEL": "info"
      }
    }
  }
}
```

> ⚠️ **Important**: If your file already contains other MCP server configs, keep them and only add the `"parseflow": {...}` section

### Step 3: Restart Your IDE

Completely quit your IDE (verify process is closed in Task Manager), then restart.

### Step 4: Test PDF Parsing

**If Using Windsurf** (Auto-detect):
Simply type in the chat:

```
Please analyze the content of D:\document.pdf
```

Or

```
How many pages does D:\report.pdf have?
```

**If Using Cursor** (Requires Explicit Tool Call in Agent Mode):
In Composer's **Agent Mode**, type:

```
Please use parseflow tool to read D:\document.pdf
```

Or

```
Use parseflow's get_metadata tool to check how many pages D:\report.pdf has
```

⚠️ **Cursor Notes**:

- Must be in Composer's Agent Mode
- Must explicitly specify parseflow tool usage

If ParseFlow is successfully called and returns results, your setup is complete!

---

## 🧪 Verification Checklist

- [ ] Config file created/modified
- [ ] `args` path is correct (points to your project path)
- [ ] `PARSEFLOW_ALLOWED_PATHS` includes your PDF directory
- [ ] IDE restarted
- [ ] PDF parsing test successful
- [ ] (Cursor users) Confirmed Agent mode usage

---

## 🔧 Troubleshooting

### Check 1: Manually Run MCP Server

```powershell
cd D:\ParseFlow
node packages\mcp-server\dist\index.js
```

You should see server startup logs. Press `Ctrl+C` to stop.

### Check 2: Check Windsurf Logs

Windsurf logs are usually in:

```
%APPDATA%\Windsurf\logs
```

Look for MCP-related error messages.

### Check 3: Verify Build

```powershell
cd D:\ParseFlow
pnpm build
```

Ensure there are no errors.

### Check 4: Test PDF Parsing

```powershell
node test-quick.js D:\sample.pdf
```

Ensure core functionality works.

---

## 💡 Common Use Cases

### Scenario 1: Quick PDF Info

```
You: What's the basic info of D:\report.pdf?
```

### Scenario 2: Extract Specific Content

```
You: Extract pages 3-5 from D:\contract.pdf
```

### Scenario 3: Search Keywords

```
You: Find all "important notes" in D:\manual.pdf
```

### Scenario 4: Summarize & Analyze

```
You: Summarize the main points of D:\article.pdf
```

### Scenario 5: Compare Documents

```
You: Compare differences between D:\v1.pdf and D:\v2.pdf
```

---

## 🎯 Next Steps

After successful setup, you can:

1. **Daily Use**: Use Windsurf to analyze PDFs in your work
2. **Optimize Config**: Adjust `PARSEFLOW_ALLOWED_PATHS` and other parameters as needed
3. **Explore Features**: Try different use cases
4. **Provide Feedback**: Report issues and suggestions

---

## 📚 More Help

- [Complete Setup Guide - Windsurf](../setup/windsurf.md)
- [Complete Setup Guide - Cursor](../setup/cursor.md)
- [FAQ](faq.md)
- [API Documentation](../development/api.md)
- [Architecture](../development/architecture.md)

---

**Last Updated**: 2025-11-26  
**Status**: ✅ Complete
