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
