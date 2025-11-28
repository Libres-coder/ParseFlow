# 📦 npm 发布指南

**版本**: v1.0.0  
**状态**: GitHub Release ✅ 已完成，准备发布到 npm

---

## 📋 发布前检查清单

- [x] ✅ GitHub Release 已创建
- [x] ✅ 代码已推送
- [x] ✅ 测试通过
- [ ] ⏳ 检查 package.json
- [ ] ⏳ 登录 npm 账号
- [ ] ⏳ 构建项目
- [ ] ⏳ 发布到 npm

---

## 🎯 第一步：检查 package.json

### 1. 检查核心包

```bash
# 查看 pdf-parser-core 的配置
cat packages/pdf-parser-core/package.json
```

**需要确认**：
- ✅ `version`: "1.0.0"
- ✅ `name`: "@parseflow/core" 或 "parseflow-core"
- ✅ `main`: "dist/index.js"
- ✅ `types`: "dist/index.d.ts"
- ✅ `files`: ["dist"]
- ✅ `license`: "MIT"
- ✅ `repository`: GitHub 链接

### 2. 检查 MCP Server 包（如果要发布）

```bash
# 查看 mcp-server 的配置
cat packages/mcp-server/package.json
```

---

## 🎯 第二步：构建项目

```bash
# 清理之前的构建
pnpm clean  # 如果有这个命令

# 重新构建
pnpm build

# 验证构建输出
ls -la packages/pdf-parser-core/dist/
ls -la packages/mcp-server/dist/
```

**确认输出**：
- ✅ `dist/` 目录存在
- ✅ 包含 `.js` 文件
- ✅ 包含 `.d.ts` 类型定义
- ✅ 包含 `.js.map` source maps

---

## 🎯 第三步：测试打包

### 测试核心包

```bash
# 进入核心包目录
cd packages/pdf-parser-core

# 打包测试
npm pack

# 会生成类似: parseflow-core-1.0.0.tgz
```

### 检查包内容

```bash
# Windows PowerShell
tar -tzf parseflow-core-1.0.0.tgz | more

# 或解压查看
mkdir test-package
tar -xzf parseflow-core-1.0.0.tgz -C test-package
ls test-package/package/
```

**确认包含**：
- ✅ `package/dist/` - 编译后的代码
- ✅ `package/package.json` - 包配置
- ✅ `package/README.md` - 说明文档
- ❌ 不应包含 `src/` - 源代码
- ❌ 不应包含 `node_modules/` - 依赖

---

## 🎯 第四步：登录 npm

### 1. 检查是否登录

```bash
npm whoami
```

**如果未登录**，会显示错误。

### 2. 登录 npm

```bash
npm login
```

**输入信息**：
- Username: 你的 npm 用户名
- Password: 你的 npm 密码
- Email: 你的 npm 邮箱
- One-time password: (如果启用了 2FA)

### 3. 验证登录

```bash
npm whoami
# 应该显示你的用户名
```

---

## 🎯 第五步：发布到 npm

### 发布核心包

```bash
# 确保在正确的目录
cd packages/pdf-parser-core

# 发布（公开包）
npm publish --access public

# 如果包名是 scoped (@parseflow/core)，需要 --access public
# 如果包名不是 scoped (parseflow-core)，可以省略
```

### 发布 MCP Server 包（可选）

```bash
cd packages/mcp-server
npm publish --access public
```

---

## ✅ 发布成功验证

### 1. 检查 npm 网站

访问：
```
https://www.npmjs.com/package/@parseflow/core
# 或
https://www.npmjs.com/package/parseflow-core
```

**应该看到**：
- ✅ 版本 1.0.0
- ✅ 发布时间（刚刚）
- ✅ README 显示正确
- ✅ 可以看到文件列表

### 2. 测试安装

```bash
# 在临时目录测试安装
mkdir test-install
cd test-install
npm init -y
npm install @parseflow/core

# 验证安装
ls node_modules/@parseflow/core/
```

---

## 🚨 常见问题

### 问题 1: "You need to authorize this machine"

**解决**：
```bash
npm login
# 重新登录
```

### 问题 2: "Package name already exists"

**解决**：
- 更改 package.json 中的 `name`
- 或者使用 scoped name: `@你的用户名/parseflow-core`

### 问题 3: "402 Payment Required"

**解决**：
- Scoped packages 默认是私有的
- 使用 `--access public` 参数

### 问题 4: "Version already published"

**解决**：
- 更新版本号
- 运行 `npm version patch` 或 `npm version minor`

---

## 📝 发布后的工作

### 1. 添加 npm badge 到 README

在 `README.md` 顶部添加：

```markdown
[![npm version](https://badge.fury.io/js/%40parseflow%2Fcore.svg)](https://www.npmjs.com/package/@parseflow/core)
[![npm downloads](https://img.shields.io/npm/dm/@parseflow/core.svg)](https://www.npmjs.com/package/@parseflow/core)
```

### 2. 更新文档

在 README 中添加安装说明：

```markdown
## 📦 安装

### 使用 npm
\`\`\`bash
npm install @parseflow/core
\`\`\`

### 使用 pnpm
\`\`\`bash
pnpm add @parseflow/core
\`\`\`

### 使用 yarn
\`\`\`bash
yarn add @parseflow/core
\`\`\`
```

### 3. 宣传

- 在 Twitter/X 发布
- 在 GitHub Discussions 公告
- 在相关社区分享

---

## 🔄 后续版本发布流程

### 修复 bug（补丁版本 1.0.x）

```bash
# 修复 bug
git add .
git commit -m "fix: 修复某个问题"

# 更新版本号
npm version patch  # 1.0.0 -> 1.0.1

# 推送
git push origin main
git push --tags

# 构建和发布
pnpm build
cd packages/pdf-parser-core
npm publish
```

### 添加功能（次要版本 1.x.0）

```bash
npm version minor  # 1.0.0 -> 1.1.0
```

### 重大更新（主要版本 x.0.0）

```bash
npm version major  # 1.0.0 -> 2.0.0
```

---

## 💡 最佳实践

### 1. 自动化发布

考虑使用：
- **GitHub Actions** - 自动发布
- **semantic-release** - 自动化版本管理

### 2. 发布前测试

```bash
# 运行所有测试
pnpm test

# 检查代码质量
pnpm lint

# 检查类型
pnpm typecheck
```

### 3. 更新 CHANGELOG

在每次发布前更新 `CHANGELOG.md`

---

## 📞 需要帮助？

- npm 文档: https://docs.npmjs.com/
- 包名规则: https://docs.npmjs.com/cli/v10/configuring-npm/package-json#name
- 发布教程: https://docs.npmjs.com/cli/v10/commands/npm-publish

---

**准备好发布到 npm 了吗？按照步骤一步步来！** 🚀
