# Windsurf IDE Setup Guide

[中文](../../setup/windsurf.md) | **English**

> 🚧 **Translation In Progress**: This is a preliminary English version. Full translation coming soon.  
> For now, please refer to the [Chinese version](../../setup/windsurf.md) for complete details.

## Quick Setup

### 1. Configuration File

Edit: `C:\Users\<username>\.codeium\windsurf\mcp_config.json`

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

### 3. Restart Windsurf

Completely quit and restart Windsurf.

### 4. Test

In Windsurf chat:
```
Extract text from D:\document.pdf
```

---

**For complete setup instructions, see**:
- [Quick Start Guide](../guides/quick-start.md)
- [FAQ](../guides/faq.md)
- [Chinese Version (Complete)](../../setup/windsurf.md)

---

**Status**: 🚧 Translation in progress  
**Last Updated**: 2025-11-26
