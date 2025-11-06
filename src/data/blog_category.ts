export type BlogCategory = {
  name: string;
  icon: "timeline" | "code" | "palette" | "home" | "plane" | "book" | "camera";
  count?: number;
  href?: string;
};

export const categories: BlogCategory[] = [
  { name: "时间线", icon: "timeline", href: "/blog" },
  { name: "技术", icon: "code", count: 128, href: "/category/tech" },
  { name: "设计", icon: "palette", count: 75, href: "/category/design" },
  { name: "生活", icon: "home", count: 92, href: "/category/life" },
  { name: "旅行", icon: "plane", count: 64, href: "/category/travel" },
  { name: "阅读", icon: "book", count: 53, href: "/category/reading" },
  { name: "摄影", icon: "camera", count: 47, href: "/category/photo" },
];

export const hotTags: string[] = [
  "JavaScript",
  "CSS",
  "React",
  "Vue",
  "Node.js",
  "TypeScript",
  "Webpack",
  "算法",
];

export default { categories, hotTags };