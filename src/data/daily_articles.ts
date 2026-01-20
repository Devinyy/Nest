import type { ArticleData } from "../types/article";

export const dailyArticles: ArticleData[] = [
  {
    id: "daily1",
    title: "寻找那个被遗忘的夏天：镰仓散记",
    subtitle: "Chasing the Summer in Kamakura",
    cover: "https://images.unsplash.com/photo-1542051841857-5f90071e7989?q=80&w=2070&auto=format&fit=crop",
    date: "2023.08.15",
    location: "神奈川县 · 镰仓市",
    weather: "晴 · 28°C",
    camera: "Sony A7M4 + 35mm GM",
    tags: ["旅行", "摄影", "日本"],
    content: [
      {
        id: "b1",
        type: "text",
        content: "电车缓缓驶过海边的信号灯，那是我记忆中夏天的样子。即使过去了很久，海风中咸涩的味道依然能瞬间将我拉回那个午后。"
      },
      {
        id: "b2",
        type: "image",
        src: "https://images.unsplash.com/photo-1528164344705-47542687000d?q=80&w=2092&auto=format&fit=crop",
        caption: "江之电，穿梭在民居与大海之间",
        exif: "f/2.8 · 1/1000s · ISO 100",
        layout: "bleed"
      },
      {
        id: "b3",
        type: "text",
        content: "并没有特意去打卡《灌篮高手》的路口，只是漫无目的地走着。阳光透过树叶的缝隙洒下来，斑驳的光影在柏油路上跳跃。这里的节奏很慢，慢到你可以听见海浪拍打岸边的声音，慢到你可以看清一只猫咪午睡时的呼吸。"
      },
      {
        id: "b4",
        type: "gallery",
        layout: "grid-2",
        images: [
          {
            src: "https://images.unsplash.com/photo-1554790170-08b30c4772f7?q=80&w=1000&auto=format&fit=crop",
            exif: "f/1.8 · 1/500s"
          },
          {
            src: "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?q=80&w=1000&auto=format&fit=crop",
            exif: "f/4.0 · 1/200s"
          }
        ],
        caption: "街角的咖啡店与神社的绘马"
      },
      {
        id: "b5",
        type: "quote",
        content: "旅行的意义，或许就是在一个陌生的地方，找到久违的感动。",
        author: "某位旅人"
      },
      {
        id: "b6",
        type: "text",
        content: "傍晚时分，天空变成了温柔的粉紫色。冲浪的人们收拾着板子准备回家，海边的餐厅亮起了暖黄色的灯光。我坐在台阶上，喝着最后一口冰镇波子汽水，看着夕阳一点点沉入海平面。"
      },
      {
        id: "b7",
        type: "image",
        layout: "portrait",
        src: "https://images.unsplash.com/photo-1516131206008-dd60d2c01317?q=80&w=1000&auto=format&fit=crop",
        caption: "长谷寺的紫阳花",
        exif: "f/2.8 · 1/250s · ISO 400"
      }
    ]
  },
  {
    id: "daily2",
    title: "雨夜的东京塔",
    subtitle: "Tokyo Tower in the Rain",
    cover: "https://images.unsplash.com/photo-1503899036084-c55cdd92da26?q=80&w=2000&auto=format&fit=crop",
    date: "2023.08.20",
    location: "东京都 · 港区",
    weather: "雨 · 22°C",
    camera: "Fujifilm X-T4 + 23mm F1.4",
    tags: ["城市", "夜景", "日本"],
    content: [
      {
        id: "b1",
        type: "text",
        content: "东京的雨总是来得猝不及防。站在六本木的观景台上，透过布满雨滴的玻璃窗，远处的东京塔在朦胧的雾气中闪烁着橘红色的光芒。"
      },
      {
        id: "b2",
        type: "image",
        src: "https://images.unsplash.com/photo-1536098561742-ca998e48cbcc?q=80&w=2000&auto=format&fit=crop",
        caption: "雨幕中的东京塔",
        exif: "f/1.4 · 1/60s · ISO 800",
        layout: "bleed"
      },
      {
        id: "b3",
        type: "text",
        content: "街道上的行人撑着透明的雨伞，像一朵朵盛开的水母。车灯在湿滑的路面上拉出长长的光影，整个城市仿佛变成了一座流动的幻境。"
      },
      {
        id: "b4",
        type: "gallery",
        layout: "grid-2",
        images: [
          {
            src: "https://images.unsplash.com/photo-1552560229-edf081349562?q=80&w=1000&auto=format&fit=crop",
            exif: "f/2.0 · 1/125s"
          },
          {
            src: "https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?q=80&w=1000&auto=format&fit=crop",
            exif: "f/2.8 · 1/100s"
          }
        ],
        caption: "新宿的霓虹与涩谷的十字路口"
      },
      {
        id: "b5",
        type: "quote",
        content: "城市是孤独的集合体，而雨水将这些孤独连接在了一起。",
        author: "村上春树 (伪)"
      }
    ]
  }
];

export const getDailyArticle = (id: string): ArticleData | undefined => {
  return dailyArticles.find(article => article.id === id);
};
