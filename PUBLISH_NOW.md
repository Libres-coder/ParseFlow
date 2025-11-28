# 🚀 现在就发布到 npm！

**状态**: ✅ 所有准备工作已完成，只差最后一步！

---

## ✅ 已完成的准备工作

```
✅ package.json 配置完善
✅ README.md 创建
✅ LICENSE 文件复制
✅ 项目构建成功
✅ 打包测试通过
✅ 文件大小: 16.9 kB
✅ 包含文件: 43 个
```

---

## 📦 包信息

```json
{
  "name": "@parseflow/core",
  "version": "1.0.0",
  "description": "Core PDF parsing library for ParseFlow",
  "size": "16.9 kB",
  "files": 43
}
```

**包内容**:
- ✅ dist/ - 编译后的代码
- ✅ README.md - 包文档
- ✅ LICENSE - MIT 许可证
- ✅ package.json - 包配置

---

## 🎯 最后一步：发布

### 1️⃣ 检查 npm 登录状态

在终端运行：
```bash
npm whoami
```

**如果显示用户名** → 已登录，跳到步骤 2  
**如果显示错误** → 需要登录，执行：

```bash
npm login
```

输入：
- **Username**: 你的 npm 用户名
- **Password**: 你的 npm 密码
- **Email**: 你的 npm 邮箱
- **OTP**: 如果启用了两步验证

---

### 2️⃣ 发布到 npm

```bash
cd packages/pdf-parser-core
npm publish --access public
```

**注意**: 
- `--access public` 是必须的（scoped package 默认私有）
- 发布需要几秒钟

---

### 3️⃣ 验证发布成功

访问：
```
https://www.npmjs.com/package/@parseflow/core
```

**应该看到**:
- ✅ 版本 1.0.0
- ✅ README 显示正确
- ✅ 刚刚发布（"published X seconds ago"）

或在终端查看：
```bash
npm view @parseflow/core
```

---

## 📝 完整命令（复制执行）

### PowerShell / CMD

```powershell
# 检查登录状态
npm whoami

# 如果未登录，先登录
# npm login

# 进入包目录
cd packages\pdf-parser-core

# 发布
npm publish --access public

# 返回根目录
cd ..\..

# 验证
npm view @parseflow/core
```

---

## ✅ 发布成功后

### 1. 测试安装

```bash
# 在临时目录测试
mkdir test-install
cd test-install
npm init -y
npm install @parseflow/core

# 查看安装的文件
ls node_modules/@parseflow/core
```

### 2. 更新 README 添加 npm badge

在根目录 `README.md` 顶部添加：

```markdown
[![npm version](https://img.shields.io/npm/v/@parseflow/core.svg)](https://www.npmjs.com/package/@parseflow/core)
[![npm downloads](https://img.shields.io/npm/dm/@parseflow/core.svg)](https://www.npmjs.com/package/@parseflow/core)
```

### 3. 推送更新到 GitHub

```bash
git push origin main
```

---

## 🎉 发布完成后的里程碑

```
✅ 开发完成
✅ 测试通过
✅ 文档完善
✅ GitHub Release 创建
✅ npm 包发布 ← 你即将完成这个！
⏳ MCP Registry 提交
```

---

## 🚨 常见问题

### 问题: "You do not have permission to publish"

**原因**: 包名已被占用或账号权限不足

**解决方案**:
1. 更改包名（在 package.json 中）
2. 或使用你的用户名作为 scope: `@你的用户名/core`

---

### 问题: "402 Payment Required"

**原因**: Scoped packages 默认是私有的（需要付费）

**解决方案**:
使用 `--access public` 参数（已包含在命令中）

---

### 问题: "npm ERR! need auth"

**原因**: 未登录或登录过期

**解决方案**:
```bash
npm login
```
重新登录

---

## 💡 提示

### 发布后无法撤销

npm 包发布后**24小时内可以撤销**，之后永久存在。

如果有错误：
- 发布 v1.0.1 修复
- 不要删除 v1.0.0（会破坏依赖）

### 语义化版本

- **补丁** (1.0.x): Bug 修复
- **次要** (1.x.0): 新功能（向后兼容）
- **主要** (x.0.0): 破坏性更改

---

## 🎯 准备好了吗？

**执行这个命令**:

```bash
cd packages/pdf-parser-core && npm publish --access public
```

**或者一步步来**:

1. ✅ 检查登录: `npm whoami`
2. 🔐 登录（如需要）: `npm login`
3. 📦 发布: `npm publish --access public`
4. ✅ 验证: 访问 npmjs.com

---

**需要帮助？我会在这里等你！** 🚀

