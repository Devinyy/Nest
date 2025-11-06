import { defineConfig } from "astro/config";
import tailwind from "@astrojs/tailwind";

// https://astro.build/config
export default defineConfig({
  integrations: [tailwind()],

  // dev mode
  site: 'http://172.17.1.210:4321',

  // 允许反向代理域名（如 Cloudflare Tunnel 的 *.trycloudflare.com）访问开发服务器
  // 也可改为数组：allowedHosts: ['localhost', '10.10.16.59', '*.trycloudflare.com']
  vite: {
    server: {
      allowedHosts: ['localhost', '10.10.16.59', 'attract-diego-corrected-organisations.trycloudflare.com'],
    }
  },

  // production mode
  

  // mode: 不同的网站 cn/top/moe
  siteMode: "moe"
});
