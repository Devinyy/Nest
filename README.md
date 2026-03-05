# Devin's Nest

> 📪 Forked from [idealclover/homepage](https://github.com/idealclover/homepage)
>
> 🚀 Built with [Astro](https://astro.build/) & [Tailwind CSS](https://tailwindcss.com/)

个人主页项目，旨在展示个人信息、博客文章、项目经历以及日常动态。基于 Astro 框架构建，追求极致的性能和优秀的用户体验。

## ✨ 功能特性

- 🌐 响应式设计，适配手机/平板/电脑不同设备
- 🚀 体积小巧，打包后 HTML+CSS 100KB 内
- 🀄️ 使用字体子集化，最大化压缩字体文件
- ⭐️ 自动获取知乎等平台 star 数 using [spencerwooo/Substats](https://github.com/spencerwooo/Substats)

## 🛠️ 技术栈

- **Core**: [Astro v4](https://astro.build/)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/), [DaisyUI](https://daisyui.com/)
- **Diagrams**: [Mermaid](https://mermaid.js.org/)
- **Build Tools**: Vite, Fontmin

## 📦 开发

```bash
# 1. 克隆项目
git clone https://github.com/Devinyy/homepage.git

# 2. 安装依赖
yarn install

# 3. 启动开发服务器
yarn dev
```

### 构建与部署

```bash
# 构建生产版本
yarn build

# 本地预览构建结果
yarn preview
```

## 📄 目录结构

```
├── build/ # 构建脚本 (字体压缩等)
│   ├── fontmin.js -- 字体压缩脚本
│   ├── postbuild.js -- build后脚本
│   └── prebuild.js --build前脚本
├── public/ # 静态资源 (字体, 图标, favicon)
│   ├── favicons/ --各尺寸图标
│   ├── fonts/ --字体
│   ├── icons/ --压缩后图标库
│   └── libs/ --第三方库
├── src/
│   ├── api/ -- API 接口定义
│   ├── components/
│   │   ├── app.astro -- 主布局组件
│   │   ├── articles_list.astro -- 文章列表卡片
│   │   ├── card_*.astro -- 各尺寸网格卡片 (2x1, 2x2, 4x2 等)
│   │   ├── sticky_nav.astro -- 顶部导航栏
│   │   └── article/ -- 文章详情渲染组件
│   ├── content/
│   │   └── blog/ -- Markdown 博客文章源文件
│   ├── data/
│   │   ├── articles_list.ts -- 文章列表数据
│   │   ├── info.ts -- 个人及站点配置信息
│   │   └── update.ts -- 更新日志/动态数据
│   ├── inlines/
│   │   └── inline.js -- 内联 JS 脚本
│   ├── pages/
│   │   ├── index.astro -- 首页
│   │   └── blog/ -- 博客列表及详情页
│   ├── theme/ -- 主题配色配置
│   ├── types/ -- TypeScript 类型定义
│   └── utils/
│       └── request.ts -- 基于 alova 的请求库封装 (支持自动重试)
├── astro.config.mjs    # Astro 配置文件
└── package.json        # 项目依赖配置
```

## ⚠️ 注意事项

1. **字体压缩**: `npm run prebuild` 和 `npm run postbuild` 会自动处理字体压缩，确保 `public/fonts` 下有源字体文件。
2. **图片资源**: 请注意图片资源的路径引用，建议放在 `public` 目录下。
3. **TypeScript**: 项目全面使用 TypeScript，请保持类型定义的完整性。
4. **环境兼容性**: 确保 Node.js 版本满足 Astro 的最低要求（建议 v18+）。

## 📅 后续规划 (Roadmap)

- [x] **接入接口请求数据**: 已集成 [alova](https://alova.js.org/) 请求库，支持接口请求、拦截器与断线重连。
- [x] **搭建流水线 Docker 一键部署**:
    - [x] Shell 脚本一键部署 (`deploy.sh`)
    - [x] GitHub Actions 自动部署 (`.github/workflows/deploy.yml`)
- [ ] **PC 端管理后台**: 计划开发基于 React/Vue 的后台管理系统，用于管理博客内容和动态。
- [ ] **Keystatic**

## 🐳 部署指南

### 方式一：使用 Shell 脚本一键部署 (推荐)

项目内置了 `deploy.sh` 脚本，可将本地代码一键同步并部署到阿里云服务器。

**步骤**:

1. 修改 `deploy.sh` 中的服务器配置信息：
   ```bash
   SERVER_IP="x.x.x.x"           # 您的服务器公网 IP
   SERVER_USER="root"            # 服务器用户名
   PROJECT_DIR="/opt/homepage"  # 服务器上存放项目的路径
   ```
2. 在终端运行脚本：
   ```bash
   sh deploy.sh
   ```

**脚本功能**:
- 自动检查本地依赖 (rsync)。
- 将代码同步到服务器（排除 `node_modules` 等）。
- 在服务器上自动检测并安装 Docker 环境。
- 自动构建镜像并启动容器。

### 方式二：使用 GitHub Actions 自动部署

项目已配置 `.github/workflows/deploy.yml`，推送到 `main` 分支时自动触发部署。

**配置**:
在 GitHub 仓库的 Settings -> Secrets and variables -> Actions 中添加以下 Secrets:
- `SERVER_HOST`: 服务器 IP 地址
- `SERVER_USER`: 服务器用户名 (如 root)
- `SERVER_SSH_KEY`: 服务器 SSH 私钥 (内容)

### 方式三：手动 Docker 部署

```bash
# 1. 构建镜像
docker build -t homepage:latest .

# 2. 运行容器
docker run -d -p 80:80 --name homepage homepage:latest
```

## 📃 许可证

本项目采用 MIT 许可证。

## 🙏 致谢

- [idealclover](https://github.com/idealclover/homepage) - 原项目作者
- [Astro](https://astro.build/) - 构建该网站的现代静态站点构建工具
- [Tailwind CSS](https://tailwindcss.com/) - 实用优先的 CSS 框架
- [bento.me](https://bento.me/) - 设计灵感来源

## 👨‍💻 二创 Devin

- 网站：[xxxxxxx](https://xxxxx)
- GitHub：[@Devin](https://github.com/Devinyy)
- 1010732441@qq.com

欢迎访问我的个人主页了解更多信息~

如果你喜欢这个项目，别忘了给个 Star ⭐️
