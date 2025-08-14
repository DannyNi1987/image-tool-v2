# 测试指南

本文档介绍如何在本地和 GitHub 上测试图像转换工具。

## 🧪 本地测试

### 1. 运行自动化测试

```bash
# 运行项目测试
npm run test

# 构建测试
npm run test:build
```

### 2. 手动功能测试

#### 启动开发服务器

```bash
npm run dev
```

访问 http://localhost:3001 开始测试。

#### 测试清单

**基础功能测试**
- [ ] 页面加载正常
- [ ] 拖拽上传文件
- [ ] 点击选择文件
- [ ] 文件列表显示
- [ ] 文件预览功能

**转换功能测试**
- [ ] 格式选择 (PNG, JPEG, WebP, AVIF)
- [ ] 质量调节
- [ ] 尺寸调整
- [ ] 旋转和翻转
- [ ] 水印添加
- [ ] 自动裁剪
- [ ] 批量处理

**下载功能测试**
- [ ] 单个文件下载
- [ ] ZIP 批量下载
- [ ] 文件命名规则
- [ ] 下载进度显示

**预设管理测试**
- [ ] 保存预设
- [ ] 应用预设
- [ ] 删除预设
- [ ] 导入导出预设
- [ ] 默认设置

**响应式测试**
- [ ] 桌面端显示
- [ ] 移动端适配
- [ ] 面板折叠展开

### 3. 使用测试面板

在应用中，你可以使用内置的测试面板来快速验证功能：

1. 打开应用
2. 点击"设置"按钮
3. 在设置面板中可以看到测试选项
4. 点击"运行所有测试"进行自动化测试

## 🚀 GitHub 测试

### 1. 创建 GitHub 仓库

```bash
# 初始化 Git 仓库
git init

# 添加远程仓库
git remote add origin https://github.com/yourusername/image-conversion-tool.git

# 提交代码
git add .
git commit -m "Initial commit: Image conversion tool"

# 推送到 GitHub
git push -u origin main
```

### 2. 配置 GitHub Actions

项目已包含 GitHub Actions 工作流配置：

- **自动测试**: 每次推送和 PR 时运行
- **多版本测试**: Node.js 18.x 和 20.x
- **预览部署**: PR 时自动部署到 GitHub Pages

### 3. 启用 GitHub Pages

1. 进入仓库设置
2. 找到 "Pages" 选项
3. 选择 "GitHub Actions" 作为源
4. 配置域名 (可选)

### 4. 测试部署

```bash
# 创建测试分支
git checkout -b test-deployment

# 修改代码
# ...

# 提交并推送
git add .
git commit -m "Test deployment"
git push origin test-deployment

# 创建 Pull Request
# 在 GitHub 上创建 PR，Actions 会自动运行测试和部署预览
```

## 🔧 测试工具

### 1. 测试脚本

项目包含自动化测试脚本：

```bash
# 运行完整测试
npm run test

# 查看测试结果
cat test-results.log
```

### 2. 浏览器测试

推荐在以下浏览器中测试：

- **Chrome** 88+
- **Firefox** 85+
- **Safari** 14+
- **Edge** 88+

### 3. 设备测试

- **桌面端**: 1920x1080, 1366x768
- **平板端**: 768x1024, 1024x768
- **手机端**: 375x667, 414x896

## 📊 性能测试

### 1. 文件大小测试

测试不同大小的图片：

- 小图片 (< 1MB)
- 中等图片 (1-5MB)
- 大图片 (5-10MB)
- 超大图片 (> 10MB)

### 2. 批量处理测试

- 1-5 张图片
- 5-10 张图片
- 10-20 张图片
- 20+ 张图片

### 3. 内存使用测试

- 监控浏览器内存使用
- 检查内存泄漏
- 测试长时间使用

## 🐛 问题报告

### 1. 报告 Bug

如果发现 Bug，请按以下格式报告：

```
**Bug 描述**
简要描述问题

**重现步骤**
1. 步骤 1
2. 步骤 2
3. 步骤 3

**预期行为**
期望的结果

**实际行为**
实际的结果

**环境信息**
- 浏览器: Chrome 120.0.6099.109
- 操作系统: macOS 14.1
- 设备: MacBook Pro

**截图**
(如果适用)
```

### 2. 功能建议

对于新功能建议：

```
**功能描述**
详细描述新功能

**使用场景**
说明何时会用到这个功能

**实现建议**
(可选) 提供实现思路

**优先级**
高/中/低
```

## 📈 持续集成

### 1. 本地 CI

```bash
# 运行所有检查
npm run lint && npm run test && npm run build
```

### 2. 预提交钩子

建议设置 Git 钩子：

```bash
# 安装 husky
npm install --save-dev husky

# 设置 pre-commit 钩子
npx husky add .husky/pre-commit "npm run lint && npm run test"
```

## 🎯 测试最佳实践

1. **自动化优先**: 优先编写自动化测试
2. **手动验证**: 重要功能需要手动验证
3. **多环境测试**: 在不同环境中测试
4. **性能监控**: 关注性能指标
5. **用户体验**: 从用户角度测试
6. **错误处理**: 测试错误情况
7. **边界条件**: 测试极限情况

## 📝 测试记录

建议记录测试结果：

- 测试日期和时间
- 测试环境和版本
- 测试结果和问题
- 修复状态
- 性能数据

这样可以追踪项目的质量改进过程。
