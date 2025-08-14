# 图像转换工具 (Image Conversion Tool)

一个基于浏览器的图像转换工具，支持多种格式转换，无需上传到服务器。

## 🚀 功能特性

- **多格式支持**: JPEG, PNG, WebP, AVIF, GIF, HEIC
- **批量处理**: 支持同时处理多张图片
- **Web Worker**: 并行处理，不阻塞 UI
- **预设管理**: 保存和应用转换预设
- **本地存储**: 完全客户端处理，保护隐私
- **响应式设计**: 支持桌面和移动设备

## 🛠️ 技术栈

- **前端框架**: React 18 + TypeScript
- **构建工具**: Vite
- **状态管理**: Zustand
- **样式**: Tailwind CSS + Headless UI
- **图像处理**: @squoosh/lib, Canvas API
- **并发处理**: Web Workers
- **文件处理**: JSZip, File API

## 📦 安装和运行

### 环境要求

- Node.js 18+
- npm 或 yarn

### 安装依赖

```bash
npm install
```

### 开发模式

```bash
npm run dev
```

访问 http://localhost:3001 查看应用。

### 构建生产版本

```bash
npm run build
```

### 预览生产版本

```bash
npm run preview
```

## 🧪 测试

### 运行项目测试

```bash
npm run test
```

### 构建测试

```bash
npm run test:build
```

## 📁 项目结构

```
src/
├── components/          # React 组件
│   ├── panels/         # 设置面板
│   ├── SetupModal.tsx  # 预设管理
│   ├── TestPanel.tsx   # 测试面板
│   └── ...
├── store/              # 状态管理
│   ├── useStore.ts     # Zustand store
│   ├── defaultOptions.ts
│   └── storage.ts
├── workers/            # Web Workers
│   ├── codecWorker.ts  # 图像处理 worker
│   └── workerPool.ts   # Worker 池管理
├── utils/              # 工具函数
│   ├── decode.ts       # 图像解码
│   ├── encode.ts       # 图像编码
│   ├── download.ts     # 下载功能
│   ├── zip.ts          # ZIP 打包
│   ├── presets.ts      # 预设管理
│   └── naming.ts       # 文件命名
├── types/              # TypeScript 类型定义
└── styles/             # 样式文件
```

## 🎯 核心功能

### 1. 图像转换

- **格式转换**: JPEG ↔ PNG ↔ WebP ↔ AVIF
- **质量控制**: 可调节压缩质量
- **尺寸调整**: 支持多种缩放模式
- **批量处理**: 并行处理多张图片

### 2. 预设管理

- **保存预设**: 将当前设置保存为命名预设
- **应用预设**: 一键应用已保存的预设
- **导入导出**: JSON 格式的预设导入导出
- **默认设置**: 设置新页面的默认选项

### 3. 下载功能

- **单个下载**: 每个文件单独下载
- **批量下载**: ZIP 打包下载
- **智能命名**: 支持自定义文件命名规则
- **内存优化**: 自动回收对象 URL

## 🔧 开发指南

### 添加新的图像格式

1. 在 `src/types/index.ts` 中添加格式类型
2. 在 `src/utils/encode.ts` 中实现编码逻辑
3. 在 `src/components/panels/FormatPanel.tsx` 中添加 UI 选项

### 添加新的处理选项

1. 在 `src/types/index.ts` 中定义选项接口
2. 在 `src/store/defaultOptions.ts` 中设置默认值
3. 在对应的面板组件中实现 UI
4. 在 `src/workers/codecWorker.ts` 中实现处理逻辑

### 自定义样式

项目使用 Tailwind CSS，可以通过以下方式自定义：

1. 修改 `tailwind.config.js` 配置
2. 在 `src/styles/tokens.css` 中定义 CSS 变量
3. 在 `src/styles/globals.css` 中添加全局样式

## 🚀 部署

### 静态部署

构建后的文件在 `dist/` 目录，可以部署到任何静态文件服务器：

- Netlify
- Vercel
- GitHub Pages
- 传统 Web 服务器

### WordPress 嵌入

1. 将构建后的文件上传到 WordPress 主题目录
2. 在页面中嵌入应用
3. 配置子域名 (如 imagetool.bdwebtek.com)

## 📝 开发日志

### 第六步完成 (2024-12-19)
- ✅ 下载功能实现
- ✅ 预设管理系统
- ✅ SetupModal 组件
- ✅ 内存管理优化
- ✅ 用户体验完善

### 第五步完成 (2024-12-19)
- ✅ 设计令牌系统
- ✅ 响应式布局
- ✅ 组件样式统一
- ✅ 可访问性优化

### 第四步完成 (2024-12-19)
- ✅ Web Worker 实现
- ✅ 图像处理管线
- ✅ 并行处理
- ✅ 进度管理

## 🤝 贡献

欢迎提交 Issue 和 Pull Request！

## 📄 许可证

MIT License

## 🔗 相关链接

- [项目主页](https://bdwebtek.com)
- [在线演示](https://imagetool.bdwebtek.com)
- [技术文档](./docs/)

