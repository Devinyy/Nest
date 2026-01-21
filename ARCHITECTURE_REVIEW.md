## 2. Detailed Analysis (详细分析)

### 2.1 Component Design (组件设计)
**现状**：
组件命名采用 `Card_2x1.astro`, `Card_4x2.astro` 等基于**尺寸/网格**的命名方式。
**问题**：
- **语义缺失**：开发者无法一眼看出 `Card_2x1` 是用来展示“社交链接”还是“项目简介”。
- **响应式限制**：如果以后想在移动端把 `2x1` 的卡片变成 `1x1`，目前的命名和内部实现（硬编码的宽高类名）会造成混淆和维护困难。
**建议**：
- **语义化重命名**：改为 `SocialCard.astro`, `ProjectCard.astro`, `ArticleCard.astro`。
- **Props 控制尺寸**：通过 Props 传入尺寸参数（如 `variant="wide"` 或 `size="lg"`），而不是通过文件名区分。

### 2.2 Data Management (数据管理)
**现状**：
数据存储在 `src/data/*.ts` 中，手动导出数组。
**问题**：
- 缺乏严格的 Schema 校验（虽然有 TS 类型，但 Astro Content Collections 能提供更强大的构建时校验）。
- 混合了 Markdown 内容和 JSON 数据。
**建议**：
- **引入 [Content Collections](https://docs.astro.build/en/guides/content-collections/)**：将 `src/data` 迁移至 `src/content`。利用 Zod 定义数据模型，确保数据完整性。
- 对于博客文章，完全拥抱 Markdown/MDX 工作流。

### 2.3 Styling & Assets (样式与资源)
**现状**：
- 大量使用 Tailwind Utility Classes，但在 `Card` 组件中又混合了传统的 **CSS Sprites**（背景图定位）技术来显示图标。
- 字体文件 `MaoKenZhuYuanTi.ttf` 直接通过 CSS 引入。
**问题**：
- **CSS Sprites 维护成本高**：新增一个图标需要修改图片并计算坐标，且在高分屏下可能模糊。
- **字体加载性能**：未配置字体子集化（Subsetting）或 `font-display` 策略，可能导致页面加载时的闪烁（FOIT/FOUT）。
**建议**：
- **图标现代化**：使用 **SVG Components** 或 **Icon Fonts**（如 Iconify），结合 Tailwind 类控制颜色和大小，更加灵活且清晰。
- **字体优化**：使用 `font-display: swap` 并在构建流程中加入字体压缩（fontmin）。

## 3. Refactoring Roadmap (重构路线图)

为了稳步提升项目质量，建议按以下优先级进行重构：

### Phase 2: Structural Improvements (结构改良)
- [ ] **组件重命名**：按功能而非尺寸重构 Card 组件目录。
- [ ] **图标 SVG 化**：逐步废弃 CSS Sprites，改用内联 SVG 或图标库。

### Phase 3: Architecture Upgrade (架构升级)
- [ ] **Content Collections 迁移**：建立 `src/content/config.ts`，定义博客和日常碎片的 Schema。
- [ ] **SEO 增强**：完善所有页面的 Meta 标签和 Open Graph 数据生成逻辑。
