# Cursor IDE Setup Guide

[中文](../../setup/cursor.md) | **English**

> 🚧 **Translation In Progress**: This is a preliminary English version. Full translation coming soon.  
> For now, please refer to the [Chinese version](../../setup/cursor.md) for complete details.

## Quick Setup

### 1. Configuration File

Edit: `C:\Users\<username>\.cursor\mcp.json`

### 2. Add ParseFlow

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

### 3. Restart Cursor

Completely quit and restart Cursor.

### 4. Test in Agent Mode

In Cursor Composer (Agent Mode):
```
Use parseflow tool to extract text from D:\document.pdf
```

⚠️ **Important**: 
- Must use Agent mode in Composer
- Must explicitly mention "parseflow tool"

---

**For complete setup instructions, see**:
- [Quick Start Guide](../guides/quick-start.md)
- [FAQ](../guides/faq.md)
- [Chinese Version (Complete)](../../setup/cursor.md)

---

**Status**: 🚧 Translation in progress  
**Last Updated**: 2025-11-26
