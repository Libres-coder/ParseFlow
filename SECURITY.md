# Security Policy

## 🔒 Reporting Security Vulnerabilities

We take the security of ParseFlow seriously. If you believe you have found a security vulnerability, please report it to us as described below.

### ⚠️ Please DO NOT:
- Open a public GitHub issue for security vulnerabilities
- Disclose the vulnerability publicly before it has been addressed

### ✅ Please DO:
1. **Email us directly** at: liudi1366@gmail.com
2. Include the following information:
   - Type of vulnerability
   - Full paths of source file(s) related to the vulnerability
   - Location of the affected source code (tag/branch/commit)
   - Step-by-step instructions to reproduce the issue
   - Proof-of-concept or exploit code (if possible)
   - Impact of the vulnerability

### 📧 Email Template

```
Subject: [SECURITY] Vulnerability in ParseFlow

Vulnerability Type: [e.g., XSS, Code Injection, Path Traversal]
Affected Version: [e.g., v1.0.2]
Severity: [Low/Medium/High/Critical]

Description:
[Detailed description]

Steps to Reproduce:
1. 
2. 
3. 

Impact:
[What could an attacker do with this vulnerability?]

Suggested Fix:
[If you have suggestions]

Additional Information:
[Any other relevant details]
```

## 🕐 Response Timeline

- **Initial Response**: Within 48 hours
- **Status Update**: Within 7 days
- **Fix Timeline**: Depends on severity
  - Critical: 1-7 days
  - High: 7-30 days
  - Medium: 30-90 days
  - Low: Next major release

## 🎖️ Recognition

We appreciate responsible disclosure and will:
- Acknowledge your contribution (with your permission)
- List you in our SECURITY.md (if you wish)
- Keep you updated on the fix progress

## 🔐 Supported Versions

We release patches for security vulnerabilities for the following versions:

| Version | Supported          |
| ------- | ------------------ |
| 1.0.x   | :white_check_mark: |
| < 1.0   | :x:                |

## 🛡️ Security Best Practices

When using ParseFlow:

### 1. PDF File Validation
- Always validate PDF files before processing
- Set reasonable file size limits
- Implement timeout mechanisms

### 2. Path Security
- Never pass user input directly as file paths
- Use absolute paths when possible
- Sanitize file paths

```javascript
// ❌ Bad
const result = await parser.extractText(userInput);

// ✅ Good
const safePath = path.resolve('/safe/directory', sanitize(userFilename));
const result = await parser.extractText(safePath);
```

### 3. Resource Limits
- Set memory limits for large files
- Implement request timeouts
- Monitor resource usage

```javascript
// Example: Set timeout
const parser = new PDFParser({
  timeout: 30000 // 30 seconds
});
```

### 4. Error Handling
- Don't expose internal paths in error messages
- Log security events
- Implement rate limiting in production

## 📚 Security Resources

- [OWASP PDF Security Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/PDF_Security_Cheat_Sheet.html)
- [Node.js Security Best Practices](https://nodejs.org/en/docs/guides/security/)
- [npm Security Best Practices](https://docs.npmjs.com/packages-and-modules/securing-your-code)

## 🔄 Security Updates

We will announce security updates through:
- GitHub Security Advisories
- Release notes
- npm package updates

Subscribe to our releases to stay informed:
https://github.com/Libres-coder/ParseFlow/releases

## 📜 Past Security Issues

None reported yet.

---

**Last Updated**: 2025-12-03  
**Contact**: liudi1366@gmail.com
