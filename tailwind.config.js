/** @type {import('tailwindcss').Config} */
import themes from "./src/theme/colors.js";

export default {
  content: ["./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}"],
  plugins: [require("daisyui")],
  daisyui: {
    themes,
    darkTheme: "black",
  },
  theme: {
    extend: {
      screens: {
        // xs 以下：折叠屏竖屏
        xs: "350px",
        // xs - sm 普通手机竖屏
        sm: "480px",
        // sm - md 折叠屏展开竖屏
        md: "680px",
        // md - lg 平板 普通手机横屏
        lg: "960px",
        // lg - xl 平板横屏
        xl: "1200px",
        // xl - xxl 13 寸电脑
        xxl: "1280px",
        // xxl+ 主要电脑与显示器尺寸
      },
    },
  },
};
