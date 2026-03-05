import { alovaInstance } from "../utils/request";

// 博客列表项
export interface BlogListItem {
  id: string;
  title: string;
  desc?: string;
  slug: string;
  cover?: string;
  date: string;
  category: {
    id: string;
    name: string;
  };
  tags: string[];
  views: number;
}

// 博客列表响应
export interface BlogListResponse {
  list: BlogListItem[];
  total: number;
  totalPages: number;
  currentPage: number;
}

// 分类统计项
export interface CategoryStat {
  id: string;
  name: string;
  count: number;
  icon?: string;
}

// 热门标签项
export interface TagStat {
  name: string;
  count: number;
}

// 博客列表查询参数
export interface BlogListParams {
  page?: number;
  pageSize?: number;
  categoryId?: string;
  tag?: string;
  keyword?: string;
  year?: number;
}

export const blogApi = {
  // 获取博客文章列表
  getBlogList: (params: BlogListParams = {}) =>
    alovaInstance.Get<BlogListResponse>('/v1/nest/blog/list', {
      params,
    }),

  // 获取分类统计列表
  getCategories: () =>
    alovaInstance.Get<CategoryStat[]>('/v1/nest/blog/categories'),

  // 获取热门标签
  getHotTags: () =>
    alovaInstance.Get<TagStat[]>('/v1/nest/blog/tags'),

  // 获取博客文章详情
  getBlogDetail: (id: string) =>
    alovaInstance.Get<BlogDetail>(`/v1/nest/blog/${id}`),
};

// 博客详情响应
export interface BlogDetail extends BlogListItem {
  content: string;
}
