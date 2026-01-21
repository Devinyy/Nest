export type ArticleItem = {
  cover?: string;
  title: string;
  subdesc?: string;
  url: string;
  time: string;
  views?: number;
  category?: string;
  tags?: string[];
  slug?: string; // 详情页渲染用的内容标识（对应 content/blog/<slug>.md）
};

export default [
  {
    title: "最新",
    url: `/blog`, 
    articles: [
      { cover: "", title: "再赴一场盛夏：写给下一个一年", subdesc: "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx", url: "https://xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx", time: "2025.08.31", views: 100, category: "生活", tags: ["阅读"] },
      { cover: "/icons/introduction.png", title: "前端工程实践：从零到一", subdesc: "webpack、ts、lint 流水线的落地记录", url: "https://xxxxxxxxxxxxxxxx", time: "2025.02.01", views: 200, category: "技术", tags: ["TypeScript", "Webpack"] },
      { cover: "", title: "品牌配色与设计系统搭建", subdesc: "基础色板、组件态与可访问性", url: "https://xxxxxxxxxxxxxxxx", time: "2024.12.20", views: 300, category: "设计", tags: ["CSS"] },
      { cover: "/icons/introduction.png", title: "旅行的意义：在路上", subdesc: "一次说走就走的旅程", url: "https://xxxxxxxxxxxxxxxx", time: "2024.11.10", views: 400, category: "旅行", tags: ["摄影"] },
    ],
  }
];

export const categoryArticles: Record<string, ArticleItem[]> = {
  技术: [
    { cover: "/icons/introduction.png", title: "前端工程实践：从零到一", subdesc: "webpack、ts、lint 流水线的落地记录", url: "https://xxxxxxxxxxxxxxxx", time: "2025.02.01", views: 200, category: "技术", tags: ["TypeScript", "Webpack"], slug: "web-design-pattern" },
  ],
  设计: [
    { cover: "", title: "品牌配色与设计系统搭建", subdesc: "基础色板、组件态与可访问性", url: "https://xxxxxxxxxxxxxxxx", time: "2024.12.20", views: 300, category: "设计", tags: ["CSS"], slug: "web-design-pattern" },
  ],
  生活: [
    { cover: "", title: "再赴一场盛夏：写给下一个一年", subdesc: "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx", url: "https://xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx", time: "2025.08.31", views: 100, category: "生活", tags: ["阅读"], slug: "web-design-pattern" },
  ],
  旅行: [
    { cover: "/icons/introduction.png", title: "旅行的意义：在路上", subdesc: "一次说走就走的旅程", url: "https://xxxxxxxxxxxxxxxx", time: "2024.11.10", views: 400, category: "旅行", tags: ["摄影"], slug: "web-design-pattern" },
  ],
  阅读: [
    { cover: "/icons/introduction.png", title: "年度书单与阅读方法", subdesc: "我的阅读体系与推荐书目", url: "https://xxxxxxxxxxxxxxxx", time: "2024.10.01", views: 250, category: "阅读", tags: ["阅读"], slug: "web-design-pattern" },
  ],
  摄影: [
    { cover: "/icons/introduction.png", title: "光影与故事：街拍日记", subdesc: "记录与构图的日常练习", url: "https://xxxxxxxxxxxxxxxx", time: "2024.09.15", views: 180, category: "摄影", tags: ["摄影"], slug: "web-design-pattern" },
  ],
};
