# 📋 ParseFlow v1.1.0 发布检查清单

**发布日期**: 2025-12-03  
**版本**: v1.1.0  
**状态**: 准备发布 ✅

---

## ✅ 预发布检查

### 代码和构建
- [x] ✅ 所有代码已提交到 Git
- [x] ✅ 版本号已更新 (parseflow-core: 1.1.0, parseflow-mcp-server: 1.1.0)
- [x] ✅ 所有包描述已更新
- [x] ✅ 构建成功 (pnpm build)
- [x] ✅ 所有测试通过
- [x] ✅ 代码已推送到 GitHub (commit: e91c3b5)

### 文档
- [x] ✅ README.md 已更新
- [x] ✅ CHANGELOG.md v1.1.0 条目已添加
- [x] ✅ OFFICE_EXAMPLES.md 已创建
- [x] ✅ RELEASE_v1.1.0.md 已创建

---

## 📦 发布步骤

### 步骤 1: 发布到 npm ⏳

#### 1.1 发布 parseflow-core

```bash
cd packages/pdf-parser-core

# 确保已登录 npm
npm whoami
# 如果未登录: npm login

# 发布
npm publish

# 验证
npm view parseflow-core version
# 应显示: 1.1.0
```

**状态**: [ ] 待完成

#### 1.2 发布 parseflow-mcp-server

```bash
cd packages/mcp-server

# 确保已登录 npm
npm whoami

# 发布
npm publish

# 验证
npm view parseflow-mcp-server version
# 应显示: 1.1.0
```

**状态**: [ ] 待完成

---

### 步骤 2: 更新 MCP Registry ⏳

```bash
# 确保 mcp-publisher 已安装
# 如果没有: npm install -g @modelcontextprotocol/mcp-publisher

# 登录 (如果需要)
mcp-publisher login

# 发布
cd packages/mcp-server
mcp-publisher publish

# 验证
# 访问: https://registry.modelcontextprotocol.io/
# 搜索: io.github.Libres-coder/parseflow
# 确认版本显示为 1.1.0
```

**状态**: [ ] 待完成

---

### 步骤 3: 创建 GitHub Release ⏳

1. **访问**: https://github.com/Libres-coder/ParseFlow/releases/new

2. **填写信息**:
   - **Tag**: `v1.1.0`
   - **Target**: `main`
   - **Title**: `ParseFlow v1.1.0 - Office Documents Support`
   - **Description**: 复制 `RELEASE_v1.1.0.md` 的内容

3. **附件** (可选):
   - [ ] Word测试文件.docx
   - [ ] Excel测试文件.xlsx
   - [ ] test-office-docs.ts

4. **选项**:
   - [x] Set as the latest release
   - [ ] Set as a pre-release

5. **发布**: 点击 "Publish release"

**状态**: [ ] 待完成

---

### 步骤 4: 验证发布 ⏳

#### 4.1 npm 验证

```bash
# 测试安装 core
npm install parseflow-core@1.1.0
node -e "const {WordParser, ExcelParser} = require('parseflow-core'); console.log('✅ Core package OK');"

# 测试安装 MCP server
npm install -g parseflow-mcp-server@1.1.0
parseflow --version
```

**预期**: 显示 v1.1.0

**状态**: [ ] 待完成

#### 4.2 MCP Registry 验证

1. 访问: https://registry.modelcontextprotocol.io/
2. 搜索: `parseflow`
3. 确认:
   - [ ] 版本显示为 1.1.0
   - [ ] 描述包含 "Word" 和 "Excel"
   - [ ] 工具列表显示 9 个工具

**状态**: [ ] 待完成

#### 4.3 GitHub Release 验证

1. 访问: https://github.com/Libres-coder/ParseFlow/releases
2. 确认:
   - [ ] v1.1.0 标记为 "Latest"
   - [ ] Release notes 完整显示
   - [ ] 下载统计正常工作

**状态**: [ ] 待完成

---

### 步骤 5: 更新项目根 package.json (可选) ⏳

```bash
cd d:\ParseFlow
# 编辑 package.json，将 version 更新为 1.1.0
```

**状态**: [ ] 待完成

---

## 📢 发布后任务

### 立即任务 (发布后 1 小时内)

- [ ] **社交媒体公告**
  - [ ] Twitter/X
  - [ ] V2EX
  - [ ] 掘金
  - [ ] Reddit (r/opensource, r/node)

- [ ] **更新项目链接**
  - [ ] npm 包页面检查
  - [ ] MCP Registry 页面检查
  - [ ] GitHub README badges 更新

### 短期任务 (1-3 天)

- [ ] **监控反馈**
  - [ ] 检查 GitHub Issues
  - [ ] 检查 npm 下载量
  - [ ] 检查 MCP Registry 统计

- [ ] **问题响应**
  - [ ] 回复所有新 Issues (24 小时内)
  - [ ] 回复评论和反馈
  - [ ] 记录常见问题到 FAQ

### 中期任务 (1-2 周)

- [ ] **文档改进**
  - [ ] 根据反馈更新文档
  - [ ] 添加更多示例
  - [ ] 创建视频教程

- [ ] **性能测试**
  - [ ] 大文件处理测试
  - [ ] 性能基准测试
  - [ ] 内存使用优化

---

## 📊 成功指标

### 第 1 天
- [ ] npm 下载量 > 10
- [ ] GitHub Stars 增加 > 5
- [ ] 0 个严重 bug 报告

### 第 1 周
- [ ] npm 下载量 > 50
- [ ] GitHub Stars > 15
- [ ] 社区反馈 > 3 条

### 第 1 月
- [ ] npm 下载量 > 200
- [ ] GitHub Stars > 30
- [ ] Issues 解决率 > 80%

---

## 🆘 问题处理

### 如果 npm 发布失败

```bash
# 检查登录状态
npm whoami

# 重新登录
npm logout
npm login

# 检查包名是否已存在
npm view parseflow-core

# 检查 package.json
cat package.json | grep version

# 清理并重建
pnpm clean
pnpm build

# 重试发布
npm publish
```

### 如果 MCP Registry 发布失败

```bash
# 检查 server.json 格式
cat packages/mcp-server/server.json

# 重新登录
mcp-publisher logout
mcp-publisher login

# 检查版本号匹配
grep version packages/mcp-server/package.json
grep version packages/mcp-server/server.json

# 重试
mcp-publisher publish
```

### 如果 GitHub Release 失败

1. 检查网络连接
2. 确认有足够的仓库权限
3. 检查 tag 是否已存在
4. 手动创建 tag: `git tag v1.1.0 && git push origin v1.1.0`

---

## 📝 发布记录

### 时间线

| 时间 | 任务 | 状态 |
|------|------|------|
| 2025-12-03 20:00 | 版本号更新 | ✅ 完成 |
| 2025-12-03 20:05 | 代码推送 | ✅ 完成 |
| 2025-12-03 20:10 | Release Notes 创建 | ✅ 完成 |
| - | npm 发布 | ⏳ 待完成 |
| - | MCP Registry 更新 | ⏳ 待完成 |
| - | GitHub Release | ⏳ 待完成 |
| - | 社交媒体公告 | ⏳ 待完成 |

---

## 🎯 下一版本 (v1.2.0) 准备

开始规划：
- [ ] 收集 v1.1.0 用户反馈
- [ ] 确定 v1.2.0 功能清单
- [ ] PowerPoint (pptx) 支持调研
- [ ] 加密文档支持调研

---

## 📞 联系方式

如果发布过程中遇到问题：
- GitHub Issues: https://github.com/Libres-coder/ParseFlow/issues
- Email: (添加你的联系邮箱)

---

**最后更新**: 2025-12-03 20:10  
**检查清单版本**: 1.0  
**准备者**: AI Assistant
