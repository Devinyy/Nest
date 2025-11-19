export type TimelineItem = {
  time: string;
  title: string;
  url?: string;
  category?: string;
  tags?: string[];
};
export type TimelineGroup = { year: number; items: TimelineItem[] };

const timeline: TimelineGroup[] = [
  {
    year: 2025,
    items: [
      { time: "08-31", title: "再赴一场盛夏：写给下一个五年", category: "生活", tags: ["阅读"], url: "/blog/detail" },
      { time: "03-07", title: "热爱是一种向上的力量", category: "生活", tags: ["阅读"] },
      { time: "04-20", title: "春日短途：山海之间", category: "旅行", tags: ["摄影"] },
      { time: "02-14", title: "前端性能优化实践：度量与改进", category: "技术", tags: ["JavaScript", "Performance"] },
      { time: "01-12", title: "阅读周记：理解与表达的关系", category: "阅读", tags: ["阅读"] },
    ],
  },
  {
    year: 2024,
    items: [
      { time: "11-29", title: "乐队收官：一次手作乐器的换挡", category: "生活", tags: ["阅读"] },
      { time: "11-17", title: "博文编辑器升级 / 服务清理", category: "技术", tags: ["JavaScript", "Node.js"] },
      { time: "11-09", title: "2024 Q3 总结：在路上，继续出发", category: "生活" },
      { time: "09-09", title: "星合计划与新博客：打造个人品牌", category: "设计", tags: ["CSS", "Vue"] },
      { time: "02-23", title: "年度总结拾遗：成长、热爱与保持", category: "阅读", tags: ["阅读"] },
      { time: "07-15", title: "组件库设计：无障碍与主题化", category: "设计", tags: ["CSS"] },
      { time: "06-11", title: "摄影练习：夜景与手持", category: "摄影", tags: ["摄影"] },
      { time: "04-28", title: "一次说走就走的周末", category: "旅行" },
    ],
  },
  {
    year: 2023,
    items: [
      { time: "12-03", title: "从 Jypecho 迁移记录：系统重构笔记", category: "技术", tags: ["TypeScript", "Webpack"] },
      { time: "08-21", title: "Carttas APP 2.0 发布小记", category: "设计", tags: ["React"] },
      { time: "07-10", title: "工具链升级：从 webpack 到 vite", category: "技术", tags: ["TypeScript"] },
      { time: "05-22", title: "阅读笔记：卡片盒与输出", category: "阅读", tags: ["阅读"] },
      { time: "04-03", title: "居家生活周记：烹饪与园艺", category: "生活" },
      { time: "03-12", title: "城市漫步：被光照亮的街角", category: "摄影", tags: ["摄影"] },
    ],
  },
  {
    year: 2022,
    items: [
      { time: "07-25", title: "疫情之下的重启：博客系统更新与心情", category: "生活" },
      { time: "05-04", title: "（2205.04 重置）为防疫做点小工具", category: "技术", tags: ["JavaScript"] },
      { time: "04-18", title: "页面样式微调与主题色更新", category: "设计", tags: ["CSS"] },
      { time: "03-01", title: "旅行计划：路线与预算", category: "旅行" },
    ],
  },
  {
    year: 2021,
    items: [
      { time: "07-01", title: "夏天，木九日常", category: "生活" },
      { time: "06-01", title: "2020 年终总结：祝贺 22 岁的自己", category: "阅读", tags: ["阅读"] },
      { time: "05-20", title: "搭建个人相册页", category: "摄影", tags: ["摄影"] },
      { time: "04-08", title: "前端学习路线回顾", category: "技术", tags: ["JavaScript"] },
    ],
  },
  {
    year: 2020,
    items: [
      { time: "10-01", title: "Hello, blog.days", category: "技术", tags: ["JavaScript"] },
      { time: "06-04", title: "2020 年，留给新站的建设记录", category: "技术", tags: ["TypeScript"] },
      { time: "05-16", title: "游戏记忆与人生轨迹的交错", category: "生活" },
      { time: "04-02", title: "CSS 布局实践：Grid 与 Flex", category: "设计", tags: ["CSS"] },
      { time: "03-11", title: "阅读清单：改变我的十本书", category: "阅读", tags: ["阅读"] },
    ],
  },
];

export default timeline;
