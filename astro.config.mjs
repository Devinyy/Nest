import { defineConfig } from "astro/config";
import tailwind from "@astrojs/tailwind";
import { loadEnv } from "vite";

const { ASTRO_SITE, ASTRO_SITE_DEV } = loadEnv(process.env.NODE_ENV, process.cwd(), "");

// https://astro.build/config
export default defineConfig({
  integrations: [tailwind()],

  // 根据当前环境决定使用哪个域名
  // 开发环境使用 localhost，生产环境使用正式域名
  site: process.env.NODE_ENV === "development" ? ASTRO_SITE_DEV : ASTRO_SITE,

  // 允许反向代理域名（如 Cloudflare Tunnel 的 *.trycloudflare.com）访问开发服务器
  // 也可改为数组：allowedHosts: ['localhost', '10.10.16.59', '*.trycloudflare.com']
  vite: {
    server: {
      allowedHosts: true,
    }
  },

  // production mode
  image: {
    domains: ["xxx.xxxxx.com"],
  },
  

  // mode: 不同的网站 cn/top/moe
  siteMode: "moe"
});
