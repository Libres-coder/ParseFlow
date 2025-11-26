# ParseFlow - Cursor Configuration Guide

[中文](../../setup/cursor.md) | **English**

## 📖 Overview

**Good News**: ParseFlow fully supports Cursor IDE!

Starting from Cursor 0.45.x, Cursor introduced MCP (Model Context Protocol) support. Now you can use ParseFlow in Cursor to parse PDF files.

---

## ⚠️ Important Information

### Cursor MCP Characteristics

| Feature               | Description                            |
| --------------------- | -------------------------------------- |
| **Supported Version** | Cursor 0.45.x+ (Recommended 1.0+)      |
| **Config File**       | `C:\Users\<username>\.cursor\mcp.json` |
| **Usage Mode**        | **Must use in Composer's Agent Mode**  |
| **Tool Limit**        | Max ~40 tools supported                |
| **Resource Support**  | MCP Resources not yet supported        |

### Why Must Cursor Use Agent Mode with Explicit Instructions?

**This is not a limitation, but a design difference**. Let's understand deeply:

#### Technical Reasons

**1. Different MCP Integration Levels**

```
Windsurf (Cascade):
├── Chat Mode: ✅ Full MCP integration
└── Agent Mode: ✅ Full MCP integration

Cursor (Current Version):
├── Chat Mode: ❌ No MCP integration yet
└── Agent Mode: ✅ MCP supported
```

**2. Different AI Tool Selection Strategies**

- **Windsurf Cascade**: Uses aggressive automatic tool selection, actively analyzes context and automatically calls appropriate MCP tools
- **Cursor Agent**: Uses conservative tool selection strategy, requires explicit user instructions to avoid mis-calls

**3. Version Evolution**

| Cursor Version   | MCP Functionality            |
| ---------------- | ---------------------------- |
| Before 0.44.x    | ❌ No MCP support            |
| 0.45.x           | ✅ Agent mode introduces MCP |
| 1.0+             | ✅ Enhanced Agent mode       |
| Future versions? | May extend to Chat mode      |

#### Why It Cannot Be Changed

⚠️ **Important Understanding**:

```
AI's tool selection behavior = Determined by IDE's internal AI layer

Cannot be changed by:
❌ VSCode extensions
❌ MCP configuration
❌ External scripts

This is a design decision by the Cursor team.
```

#### Future Possibilities

- ✅ Cursor may improve MCP integration in future versions
- ✅ May extend to Chat mode
- ✅ May support smarter automatic tool selection

But this depends on **Cursor team's development plans**, which users and third-party developers cannot control.

**📚 Detailed Analysis**: See [Distribution Analysis](../planning/distribution-analysis.md)

---

### Key Differences: Cursor vs Windsurf

| Aspect          | Cursor                        | Windsurf                            |
| --------------- | ----------------------------- | ----------------------------------- |
| Config File     | `.cursor\mcp.json`            | `.codeium\windsurf\mcp_config.json` |
| Usage Method    | Must in Agent mode            | Works in both Chat and Agent        |
| Tool Invocation | Requires explicit instruction | Automatic recognition               |
| MCP Integration | Basic support                 | Full integration                    |
| User Experience | ⭐⭐⭐ Good                   | ⭐⭐⭐⭐⭐ Excellent                |

---

## 🚀 Quick Setup (5 Minutes)

### Method 1: Manual Configuration (Recommended)

#### Step 1: Ensure Project is Built

```bash
cd D:\ParseFlow
pnpm install
pnpm build
```

Verify file exists:

```
D:\ParseFlow\packages\mcp-server\dist\index.js
```

#### Step 2: Edit Cursor Config File

**Config File Location**:

```
C:\Users\<your-username>\.cursor\mcp.json
```

**Open Method**:

```powershell
# Open with Notepad
notepad C:\Users\<your-username>\.cursor\mcp.json
```

#### Step 3: Add ParseFlow Configuration

Add to `mcp.json`:

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

**Note**:

- Replace `<project-root>` with actual path (e.g., `D:\\ParseFlow`)
- Use double backslash `\\` or single forward slash `/`

#### Step 4: Restart Cursor

**Completely exit** Cursor, then restart.

#### Step 5: Test in Agent Mode

⚠️ **Critical**: In Cursor Composer, **must switch to Agent mode**!

**Test Method**:

```
1. Open Cursor Composer
2. Switch to Agent mode (Important!)
3. Type: Please use parseflow tool to read D:\report.pdf
```

---

## 🎯 Usage Instructions

### Using in Cursor Agent Mode

**Important**: ParseFlow MCP tools can only be used in **Composer's Agent Mode**!

#### 1. Switch to Agent Mode

In Cursor Composer:

- Find the mode switch button
- Select "Agent" mode
- Confirm switch is successful

#### 2. Explicitly Instruct to Use ParseFlow

Since Cursor won't automatically recognize, you need to explicitly tell the AI:

**Recommended Question Formats**:

```
❌ Wrong (Not explicit enough):
"Analyze D:\report.pdf"

✅ Correct (Explicit instruction):
"Please use parseflow tool to read D:\report.pdf content"
"Use parseflow's get_metadata tool to view D:\document.pdf info"
"Use parseflow to search for keyword in D:\contract.pdf"
```

#### 3. Available Command Examples

**Extract Text**:

```
Please use parseflow's extract_text tool to extract all content from D:\report.pdf
```

**Get Metadata**:

```
Please use parseflow's get_metadata tool to see how many pages D:\document.pdf has
```

**Search Keywords**:

```
Use parseflow's search_pdf tool to search for "liability clause" in D:\contract.pdf
```

**Extract Specific Page**:

```
Use parseflow to extract page 5 content from D:\manual.pdf
```

---

## 📋 Available MCP Tools

ParseFlow provides the following MCP tools:

### 1. extract_text

Extract PDF text content

**Parameters**:

- `path` (required): PDF file path
- `page` (optional): Specific page number
- `range` (optional): Page range (e.g., "1-5")
- `strategy` (optional): Extraction strategy - "raw", "formatted", "clean"

**Usage Example**:

```
Please use parseflow's extract_text tool to extract D:\document.pdf content
```

### 2. get_metadata

Get PDF metadata

**Parameters**:

- `path` (required): PDF file path

**Usage Example**:

```
Use parseflow's get_metadata tool to view D:\report.pdf info
```

### 3. search_pdf

Search for keywords in PDF

**Parameters**:

- `path` (required): PDF file path
- `query` (required): Search keyword
- `caseSensitive` (optional): Case sensitive or not
- `maxResults` (optional): Maximum results

**Usage Example**:

```
Use parseflow to search for "important clause" in D:\contract.pdf
```

---

## 🔍 Troubleshooting

### Issue 1: Agent Mode Cannot Find parseflow Tool

**Causes**:

- Cursor not restarted
- Config file format error
- Not in Agent mode

**Solutions**:

1. Completely exit and restart Cursor
2. Check `mcp.json` format (use jsonlint.com)
3. Confirm in Composer's Agent mode

### Issue 2: "Cannot find module" Error

**Cause**: MCP Server not built or path incorrect

**Solution**:

```bash
cd D:\ParseFlow
pnpm install
pnpm build
# Verify file exists
dir packages\mcp-server\dist\index.js
```

### Issue 3: AI Doesn't Call parseflow

**Cause**: Question not explicit enough

**Solution**: Use explicit instructions:

```
❌ "Analyze this PDF"
✅ "Please use parseflow tool to read D:\report.pdf"
```

### Issue 4: Cannot Use in Chat Mode

**Cause**: Cursor MCP only available in Agent mode

**Solution**: Switch to Composer's Agent mode

---

## 💡 Best Practices

### 1. Explicitly Instruct Tool

Since Cursor won't automatically select MCP tools, always explicitly instruct:

```
✅ Good Questions:
"Please use parseflow's extract_text tool to read page 3 of D:\report.pdf"
"Use parseflow to view metadata of D:\document.pdf"

❌ Not Explicit Enough:
"Read this PDF"
"View document info"
```

### 2. Use Full Paths

```
✅ Use full paths:
"D:\documents\report.pdf"

❌ Avoid relative paths:
"./report.pdf"
```

### 3. Execute Step by Step

For complex tasks, proceed step by step:

```
Step 1: "Use parseflow to get metadata of D:\report.pdf"
Step 2: "Extract pages 1-5 content"
Step 3: "Search for keywords"
```

---

## 📊 Cursor vs Windsurf Comparison

| Feature                 | Cursor                      | Windsurf                            |
| ----------------------- | --------------------------- | ----------------------------------- |
| **Config File**         | `.cursor\mcp.json`          | `.codeium\windsurf\mcp_config.json` |
| **Configuration**       | Manual editing              | Manual + Auto script                |
| **Usage Mode**          | Agent mode only             | Chat and Agent both                 |
| **Tool Invocation**     | Explicit instruction needed | Auto-recognition (Recommended)      |
| **Tool Quantity Limit** | ~40 tools                   | Unlimited                           |
| **Resource Support**    | Not supported               | Supported                           |
| **User Experience**     | Requires explicit commands  | High automation                     |

**Recommendations**:

- If using **Cursor**: Configure per this guide, explicitly instruct in Agent mode
- If using **Windsurf**: Recommended, better experience (see windsurf.md)

---

## 📚 Related Documentation

- [Quick Start](../guides/quick-start.md) - General quick start
- [Windsurf Setup](windsurf.md) - Windsurf detailed configuration
- [FAQ](../guides/faq.md) - Frequently asked questions
- [API Documentation](../development/api.md) - API reference

---

## ⚙️ Configuration File Examples

### Minimal Configuration

```json
{
  "mcpServers": {
    "parseflow": {
      "command": "node",
      "args": ["D:\\ParseFlow\\packages\\mcp-server\\dist\\index.js"]
    }
  }
}
```

### Full Configuration

```json
{
  "mcpServers": {
    "parseflow": {
      "command": "node",
      "args": ["D:\\ParseFlow\\packages\\mcp-server\\dist\\index.js"],
      "env": {
        "PARSEFLOW_CACHE_DIR": "D:\\ParseFlow\\.cache",
        "PARSEFLOW_MAX_FILE_SIZE": "52428800",
        "PARSEFLOW_ALLOWED_PATHS": "D:\\;C:\\Users;E:\\Projects",
        "LOG_LEVEL": "info",
        "PARSEFLOW_LOG_FILE": "D:\\ParseFlow\\logs\\parseflow.log",
        "PARSEFLOW_ERROR_LOG_FILE": "D:\\ParseFlow\\logs\\error.log"
      }
    }
  }
}
```

### Multi-Server Configuration

```json
{
  "mcpServers": {
    "parseflow": {
      "command": "node",
      "args": ["D:\\ParseFlow\\packages\\mcp-server\\dist\\index.js"]
    },
    "other-mcp-server": {
      "command": "python",
      "args": ["path/to/other/server.py"]
    }
  }
}
```

---

## 🎯 Quick Reference

### Configuration Paths

```
Cursor: C:\Users\<username>\.cursor\mcp.json
Windsurf: C:\Users\<username>\.codeium\windsurf\mcp_config.json
```

### Key Points

- ✅ Must in **Agent Mode**
- ✅ Must **explicitly instruct** to use parseflow
- ✅ Use **full paths**
- ✅ Takes effect after restarting Cursor

### Test Command

```
Please use parseflow's get_metadata tool to view info of D:\test.pdf
```

---

## ✅ Summary

ParseFlow **fully supports Cursor**. Configuration is similar to Windsurf, but note:

1. ⚠️ **Must use in Agent mode**
2. ⚠️ **Must explicitly instruct** tool name
3. ⚠️ Different config file path (`.cursor\mcp.json`)

**Recommend Windsurf**: If you have both IDEs, Windsurf's MCP integration experience is better (auto-recognition, no explicit instructions needed).

---

**Last Updated**: 2025-11-26  
**ParseFlow Version**: v1.0.0  
**Cursor Support Version**: 0.45.x+  
**Config File**: `.cursor\mcp.json`
