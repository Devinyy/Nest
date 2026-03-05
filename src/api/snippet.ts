import { alovaInstance } from '../utils/request';

export interface TimelineItem {
  id?: string;
  blogId?: string;
  time: string;
  title: string;
  content?: string;
  url?: string;
}

export interface TimelineGroup {
  year: number;
  items: TimelineItem[];
}

export interface ContentBlock {
    type: 'image' | 'gallery' | 'quote' | 'text';
    content?: string;
    src?: string;
    caption?: string;
    author?: string;
    images?: string[];
}

export interface SnippetListItem {
    id: string;
    title?: string;
    subtitle?: string;
    cover?: string;
    content: string | ContentBlock[];
    createdAt?: string;
    createTime?: string; // Keep for backward compatibility if needed
    location?: string;
    weather?: string;
    mood?: string;
    views?: number;
    tags?: string[];
    images?: string[];
}

export const snippetApi = {
  // 获取日常碎片时间轴
  getSnippetTimeline: () =>
    alovaInstance.Get<TimelineGroup[]>('/v1/nest/snippet/timeline'),
  // 获取日常碎片详情
  getSnippetDetail: (id: string) =>
    alovaInstance.Get<SnippetListItem>(`/v1/nest/snippet/${id}`),
};
