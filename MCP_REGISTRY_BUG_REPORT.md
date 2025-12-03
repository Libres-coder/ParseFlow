# Bug Report for mcp-publisher

**Repository**: https://github.com/modelcontextprotocol/registry/issues

---

## Title
`mcp-publisher` converts `registryType` to `registry_type` causing 422 validation error

---

## Description

When using `mcp-publisher` v1.0.0 to publish a server to MCP Registry, the tool incorrectly converts camelCase field names to snake_case, causing validation errors.

## Version
- **Tool**: mcp-publisher 1.0.0 (commit: f975e68cf25c776160d4e837919884ca02602706)
- **OS**: Windows 10/11
- **Schema**: https://static.modelcontextprotocol.io/schemas/2025-07-09/server.schema.json

## Steps to Reproduce

1. Create a valid `server.json`:
```json
{
  "$schema": "https://static.modelcontextprotocol.io/schemas/2025-07-09/server.schema.json",
  "name": "io.github.Libres-coder/parseflow",
  "description": "Document parsing for PDF, Word, and Excel with text extraction, metadata, and search via MCP",
  "repository": {
    "url": "https://github.com/Libres-coder/ParseFlow",
    "source": "github"
  },
  "version": "1.1.0",
  "packages": [
    {
      "registryType": "npm",
      "identifier": "parseflow-mcp-server",
      "version": "1.1.0",
      "transport": {
        "type": "stdio"
      }
    }
  ]
}
```

2. Authenticate:
```bash
mcp-publisher login github
# Successfully authenticated
```

3. Publish:
```bash
mcp-publisher publish
```

## Expected Behavior

The tool should send the JSON with field names as-is (camelCase):
```json
{
  "packages": [
    {
      "registryType": "npm",  // ✅ Expected
      ...
    }
  ]
}
```

## Actual Behavior

The tool converts field names to snake_case:
```json
{
  "packages": [
    {
      "registry_type": "",  // ❌ Actual
      ...
    }
  ]
}
```

## Error Message

```
Publishing to https://registry.modelcontextprotocol.io...
Error: publish failed: server returned status 422: {
  "title": "Unprocessable Entity",
  "status": 422,
  "detail": "validation failed",
  "errors": [
    {
      "message": "expected required property registryType to be present",
      "location": "body.packages[0]",
      "value": {
        "identifier": "parseflow-mcp-server",
        "registry_type": "",  // ❌ Tool sent this
        "transport": {"type": "stdio"},
        "version": "1.1.0"
      }
    },
    {
      "message": "unexpected property",
      "location": "body.packages[0].registry_type",
      "value": {...}
    }
  ]
}
```

## Analysis

The error shows that:
1. Server expects `registryType` (camelCase)
2. Tool sends `registry_type` (snake_case)
3. The tool is performing automatic field name conversion

This appears to be a serialization issue in the tool's HTTP client.

## Impact

- **Severity**: Medium
- **Workaround**: None found
- **Affected users**: Anyone trying to publish npm-based MCP servers
- **User impact**: Cannot publish to MCP Registry, but servers still work via npm

## Possible Fix

The tool should preserve JSON field names exactly as provided in `server.json`, without any case conversion.

Check if the HTTP client or JSON serializer has an option like:
- `preserveFieldNames: true`
- `useJsonTagNames: true`
- Or disable automatic snake_case conversion

## Additional Context

- Package successfully published to npm: https://www.npmjs.com/package/parseflow-mcp-server
- GitHub Release created: https://github.com/Libres-coder/ParseFlow/releases/tag/v1.1.0
- Only MCP Registry publication is blocked by this issue

## Related Files

- server.json validation: Works correctly locally
- PowerShell verification: Confirms `registryType` is in the file
- Error message: Confirms tool sends `registry_type`

---

**Thank you for maintaining MCP Registry!** This is the only blocker preventing our server from being discoverable in the registry. The server itself works perfectly via npm installation.
