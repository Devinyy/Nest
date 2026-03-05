import { alovaInstance } from '../utils/request';

export interface TimelineItem {
  blogId: string;
  time: string;
  title: string;
  content?: string;
  url?: string;
}

export interface TimelineGroup {
  year: number;
  items: TimelineItem[];
}

export const snippetApi = {
  // 获取日常碎片时间轴
  getSnippetTimeline: () =>
    alovaInstance.Get<TimelineGroup[]>('/v1/nest/snippet/timeline'),
};
