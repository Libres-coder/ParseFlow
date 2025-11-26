# Frequently Asked Questions (FAQ)

[中文](../../guides/faq.md) | **English**

## 📌 Installation & Configuration

### Q1: Which IDEs does ParseFlow support?

**A:** ParseFlow supports two IDEs:

- ✅ **Windsurf** (Recommended) - Auto-detect, no explicit instructions needed
- ✅ **Cursor** (0.45.x+) - Requires explicit tool calls in Agent mode

Detailed setup:

- Windsurf: [Windsurf Setup Guide](../setup/windsurf.md)
- Cursor: [Cursor Setup Guide](../setup/cursor.md)

### Q2: How do I configure ParseFlow?

**A:** Choose the config file based on your IDE:

**Windsurf** (Recommended):

- Config file: `C:\Users\<username>\.codeium\windsurf\mcp_config.json`
- Reference: [Quick Start](quick-start.md)

**Cursor**:

- Config file: `C:\Users\<username>\.cursor\mcp.json`
- Reference: [Cursor Setup](../setup/cursor.md)

### Q3: Windsurf doesn't call ParseFlow after configuration?

**A:** Check the following:

- [ ] Config file JSON format is correct (validate at jsonlint.com)
- [ ] `args` path points to the correct `dist/index.js`
- [ ] Windsurf completely restarted (check Task Manager)
- [ ] `node packages\mcp-server\dist\index.js` can start manually

### Q4: "Cannot find module" error?

**A:** Rebuild the project:

```powershell
cd D:\ParseFlow
pnpm install
pnpm build
```

### Q5: Can't use ParseFlow in Cursor?

**A:** Cursor MCP has special requirements:

1. **Must be in Agent Mode**
   - Switch to Agent mode in Composer
   - Chat mode doesn't support MCP

2. **Must explicitly specify tool**
   - ❌ Wrong: "Analyze D:\report.pdf"
   - ✅ Correct: "Please use parseflow tool to read D:\report.pdf"

3. **Verify configuration**
   - Config file: `C:\Users\<username>\.cursor\mcp.json`
   - Reference: [Cursor Setup](../setup/cursor.md)

### Q6: Which is better, Windsurf or Cursor?

**A:** **Windsurf is recommended** because:

- ✅ Auto-detect MCP tools, no explicit instructions needed
- ✅ Works in both Chat and Agent modes
- ✅ More intelligent tool calling
- ✅ No tool quantity limits

Cursor is also usable, but requires:

- ⚠️ Must be in Agent mode
- ⚠️ Must explicitly specify tool names

### Q7: How to update to the latest version?

**A:**

```powershell
git pull origin main
pnpm install
pnpm build
```

Then restart your IDE.

---

## 📄 PDF Parsing

### Q8: Which PDF formats are supported?

**A:**

- ✅ Standard PDF (text-based)
- ✅ PDF 1.0 - 1.7 versions
- ⚠️ Scanned PDFs (requires OCR, not implemented)
- ⚠️ Encrypted PDFs (requires password, not implemented)

### Q9: What's the max PDF file size?

**A:**

- Default limit: 50MB
- Can be modified in `.env`: `PARSEFLOW_MAX_FILE_SIZE=104857600` (100MB)
- Note: Very large files (>100MB) may cause memory issues

### Q10: Text extraction has garbled characters?

**A:** Try different extraction strategies:

```javascript
// Strategy 1: raw
await parser.extractText(path, { strategy: 'raw' });

// Strategy 2: formatted
await parser.extractText(path, { strategy: 'formatted' });

// Strategy 3: clean
await parser.extractText(path, { strategy: 'clean' });
```

### Q11: How to extract images from PDF?

**A:** Current version doesn't support image extraction, it's planned.

- Needs implementation: Image extractor based on `pdfjs-dist`
- Estimated effort: 2-3 days
- You can submit a Feature Request

### Q12: Does search support regex?

**A:** Currently only supports plain keyword search. Regex support is planned.

### Q13: Can I extract PDF table of contents?

**A:** Current version returns empty array. Full implementation requires `pdfjs-dist`, it's planned.

---

## 🔒 Security

### Q14: How to limit directories ParseFlow can access?

**A:** Set `PARSEFLOW_ALLOWED_PATHS` in config:

```json
"env": {
  "PARSEFLOW_ALLOWED_PATHS": "D:\\Documents;D:\\Projects"
}
```

Only listed directories will be accessible.

### Q15: Does ParseFlow upload my PDFs?

**A:** **No.** ParseFlow runs entirely locally, all processing is done on your machine.

### Q16: How to handle sensitive documents?

**A:**

- ParseFlow doesn't log document content
- Can disable cache: `cache: { enabled: false }`
- Check logs to confirm no content leakage

---

## ⚡ Performance

### Q17: Parsing is slow?

**A:**

1. **Enable caching**: Repeat parsing of same file will be faster
2. **Extract only what you need**: Use `extractPage()` instead of `extractText()`
3. **Adjust cache size**:
   ```json
   "PARSEFLOW_CACHE_MAX_SIZE": "100"
   ```

### Q18: High memory usage?

**A:**

1. Limit file size: `PARSEFLOW_MAX_FILE_SIZE`
2. Reduce cache: `PARSEFLOW_CACHE_MAX_SIZE`
3. Clear cache after processing:
   ```powershell
   Remove-Item D:\ParseFlow\.cache\* -Recurse
   ```

### Q19: Can I process multiple PDFs in parallel?

**A:** Current design supports concurrent requests, but limited by Node.js single-threading.

- Worker Threads support may be added in future
- Currently recommended: Process one by one or use multiple MCP Server instances

---

## 🛠️ Development

### Q20: How to contribute?

**A:** See [CONTRIBUTING.md](../../CONTRIBUTING.md):

1. Fork the project
2. Create feature branch
3. Submit Pull Request

### Q21: How to debug MCP Server?

**A:**

1. **Direct run**:

   ```powershell
   node packages\mcp-server\dist\index.js
   ```

2. **Use MCP Inspector**:

   ```powershell
   npx @modelcontextprotocol/inspector node packages\mcp-server\dist\index.js
   ```

   Open browser at http://localhost:5173

3. **Check logs**:
   ```powershell
   tail -f parseflow.log
   ```

### Q22: How to add new features?

**A:**

1. Implement core functionality in `packages/pdf-parser-core/src/`
2. Add MCP Tool in `packages/mcp-server/src/tools/`
3. Write tests
4. Update documentation

### Q23: Test coverage requirements?

**A:**

- Target: > 80%
- Run: `pnpm test:coverage`
- View: `coverage/lcov-report/index.html`

---

## 🐛 Troubleshooting

### Q24: "EACCES: permission denied" error?

**A:**

- Check file permissions
- Verify directory is in `PARSEFLOW_ALLOWED_PATHS`
- Try running Windsurf as administrator

### Q25: Log shows "Path traversal attempt detected"?

**A:** This is a security protection mechanism. Ensure:

- Use absolute paths
- Don't use `..` or other path traversal characters
- Path is in allowed list

### Q26: "Invalid PDF" error?

**A:**

- Confirm file is valid PDF
- Try opening with Adobe Reader to verify
- Check if file is corrupted
- Some special PDFs (encrypted, protected) may not be supported

### Q27: How to clear cache?

**A:**

```powershell
# Windows
Remove-Item D:\ParseFlow\.cache\* -Recurse -Force

# Or disable cache in config
"env": {
  "PARSEFLOW_CACHE_ENABLED": "false"
}
```

### Q28: How to view detailed logs?

**A:** Set log level to debug:

```json
"env": {
  "LOG_LEVEL": "debug",
  "PARSEFLOW_LOG_FILE": "<project-root>\\logs\\debug.log"
}
```

---

## 📚 Miscellaneous

### Q29: Which operating systems are supported?

**A:**

- ✅ Windows 10/11
- ✅ macOS (untested)
- ✅ Linux (untested)

Requires Node.js >= 18.0.0

### Q30: Can I use it in commercial projects?

**A:** Yes, ParseFlow uses MIT license, free for commercial and personal use.

### Q31: Is there a Web UI?

**A:** Not currently, but it's planned. You can:

- Use MCP Inspector as temporary UI
- Interact through Windsurf
- Wait for Web UI feature

### Q32: Can it integrate with other IDEs?

**A:**

- ✅ Any IDE supporting MCP
- ✅ As npm package in your own projects
- ❓ VSCode plugin (needs separate development)

### Q33: How to report bugs?

**A:**

1. Create new Issue on GitHub Issues
2. Provide:
   - Error description
   - Reproduction steps
   - Log files
   - Environment info (OS, Node version)

---

## 🚀 Future Plans

### Q34: Will there be an MCP Marketplace version?

**A:** ✅ **Yes! This is high priority**

**Plans**:

- Publish to npm as public package
- Submit to official MCP Registry
- Users can install ParseFlow with one click

**Benefits**:

- ✅ No manual configuration needed
- ✅ Automatic version management
- ✅ Official recognition

**Priority**: ⭐⭐⭐⭐⭐

**Reference**: [TODO](../planning/todo.md) and [Distribution Analysis](../planning/distribution-analysis.md)

### Q35: Can it be installed via VSCode extension (VSIX)?

**A:** ✅ **Yes, it's planned**

**Technically feasible**:

- Both Windsurf and Cursor are based on VSCode
- Support loading VSCode extensions
- Extension can auto-manage MCP configuration

**Features**:

- ✅ One-click installation
- ✅ Auto-manage MCP config files
- ✅ MCP Server start/stop control
- ✅ Version update management

**⚠️ Important Note**:

```
✅ Can improve: Installation and configuration experience
❌ Cannot change: AI's tool selection behavior

Even installed via extension:
- Windsurf still auto-detects ✅
- Cursor still requires Agent mode explicit calls ⚠️

Because AI tool selection is IDE internal logic,
extensions cannot change it.
```

**Priority**: ⭐⭐⭐⭐ (High)  
**Prerequisites**: After MCP Marketplace release

**Reference**: [Distribution Analysis](../planning/distribution-analysis.md)

### Q36: Can VSCode extension make Cursor auto-use ParseFlow?

**A:** ❌ **No, this is a technical limitation**

**Explanation**:

**1. AI tool selection is determined by IDE**

```
How AI selects tools = IDE's internal AI layer logic

No matter through what means:
❌ VSCode extension
❌ MCP configuration
❌ External scripts

Cannot change AI's decision-making behavior
```

**2. Cursor Agent mode is by design**

- This is Cursor team's product design
- Uses conservative tool selection strategy
- Requires explicit instructions to avoid mis-calls

**3. Only Cursor itself can change**

- ✅ Cursor may improve in future
- ✅ May extend to Chat mode
- ✅ May have smarter auto-selection

**Conclusion**:

```
What VSCode extension can do:
✅ Improve installation experience
✅ Auto configuration management
✅ Version updates

What VSCode extension cannot do:
❌ Change Cursor's tool selection behavior
❌ Make Cursor auto-call tools
❌ Bypass Agent mode requirement
```

**Recommendation**:

- If you want auto-calling, use Windsurf
- If using Cursor, accept explicit instructions needed
- Or wait for Cursor team's future improvements

**Detailed technical analysis**: [Distribution Analysis](../planning/distribution-analysis.md)

### Q37: What new features are planned?

**A:** See complete roadmap: [TODO](../planning/todo.md)

**High Priority**:

- ⭐⭐⭐⭐⭐ MCP Marketplace release
- ⭐⭐⭐⭐ VSCode extension development

**Planned**:

- Table of Contents (TOC) extraction
- Image export
- Advanced search features
- Performance optimization
- Error handling improvements

**Future Considerations**:

- OCR support (for scanned documents)
- AI document analysis
- Web UI (optional)

---

## 💬 Get Help

If the above doesn't solve your problem:

1. **Check Documentation**:
   - [README](../../README_EN.md)
   - [API Documentation](../development/api.md)
   - [Development Guide](../development/development.md)

2. **Submit Issue**:
   - [GitHub Issues](https://github.com/Libres-coder/ParseFlow/issues)
   - Describe problem and error logs

3. **Check Logs**:
   - Check `logs/parseflow.log`
   - Check Windsurf logs

---

**Last Updated**: 2025-11-26
