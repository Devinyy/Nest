import { alovaInstance } from '../utils/request';

// 首页最新文章接口返回数据类型
export interface LatestArticleItem {
  cover: string;
  title: string;
  subdesc: string;
  url: string;
  time: string;
  views: number;
  category: string;
  tags: string[];
}

export interface LatestArticlesResponse {
  title: string;
  url: string;
  articles: LatestArticleItem[];
}

// 首页最新碎片接口返回数据类型
export interface DiaryCardItem {
  title: string;
  url: string;
  bgStyle: string;
  textStyle: string;
}

export interface LatestSnippetsResponse {
  diaryCards: DiaryCardItem[];
}

export const homeApi = {
  // 获取最新文章
  getLatestArticles: () => 
    alovaInstance.Get<LatestArticlesResponse>('/v1/nest/home/latest-articles'),

  // 获取最新碎片
  getLatestSnippets: () => 
    alovaInstance.Get<LatestSnippetsResponse>('/v1/nest/home/latest-snippets')
};
