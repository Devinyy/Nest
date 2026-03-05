export type TimelineItem = {
  blogId: string;
  time: string;
  title: string;
  content?: string; // 碎片可能包含简短内容
  url?: string;
};
export type TimelineGroup = { year: number; items: TimelineItem[] };

const timeline: TimelineGroup[] = [
  {
    year: 2025,
    items: [
      { blogId: "daily1", time: "08-31", title: "傍晚的云彩", content: "今天的晚霞格外温柔，像打翻了的橘子汽水。" },
      { blogId: "daily2", time: "03-07", title: "路边的野花", content: "不知名的小花开得正艳，生命力真顽强。" },
    ],
  },
  {
    year: 2024,
    items: [
      { blogId: "daily3", time: "11-29", title: "一杯热咖啡", content: "冬日的午后，热美式是续命神器。" },
      { blogId: "daily4", time: "09-09", title: "加班后的夜宵", content: "便利店的关东煮，温暖了整个胃。" },
      { blogId: "daily5", time: "02-23", title: "读完了一本书", content: "《悉达多》，寻找内心的平静。" },
    ],
  },
];

export default timeline;
