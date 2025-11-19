import fs from "fs";
import path from "path";
import { minify } from "terser";
import config from "../astro.config.mjs";
import https from "https";

async function download(url, dest) {
  await new Promise((resolve, reject) => {
    const file = fs.createWriteStream(dest);
    https
      .get(url, (res) => {
        if (res.statusCode !== 200) {
          file.close();
          fs.rmSync(dest, { force: true });
          return reject(new Error(`Download failed ${res.statusCode}: ${url}`));
        }
        res.pipe(file);
        file.on("finish", () => file.close(resolve));
      })
      .on("error", (err) => {
        try { file.close(); fs.rmSync(dest, { force: true }); } catch (_) {}
        reject(err);
      });
  });
}

/**
 * Ensure vendor libs exist locally.
 * - Only downloads when missing or when VENDOR_UPDATE=1 is set.
 * - Maintains a manifest with target versions for optional refresh.
 */
async function ensureVendors() {
  const vendorDir = path.resolve("./public/libs/vendor");
  if (!fs.existsSync(vendorDir)) fs.mkdirSync(vendorDir, { recursive: true });

  const manifest = {
    marked: { file: "marked.esm.js", url: "https://cdn.jsdelivr.net/npm/marked@12.0.2/lib/marked.esm.js" },
    dompurify: { file: "dompurify.es.js", url: "https://cdn.jsdelivr.net/npm/dompurify@3.0.8/dist/purify.es.js" },
    hljs_js: { file: "highlight.min.js", url: "https://cdn.jsdelivr.net/npm/highlight.js@11.9.0/es/highlight.min.js" },
    hljs_css: { file: "highlight.github-dark.min.css", url: "https://cdn.jsdelivr.net/npm/highlight.js@11.9.0/styles/github-dark.min.css" },
    mermaid: { file: "mermaid.esm.min.mjs", url: "https://cdn.jsdelivr.net/npm/mermaid@10.9.0/dist/mermaid.esm.min.mjs" },
    katex_css: { file: "katex.min.css", url: "https://cdn.jsdelivr.net/npm/katex@0.16.9/dist/katex.min.css" },
    katex_auto: { file: "auto-render.mjs", url: "https://cdn.jsdelivr.net/npm/katex@0.16.9/dist/contrib/auto-render.mjs" },
  };

  const manifestPath = path.join(vendorDir, "manifest.json");
  let current = {};
  try {
    if (fs.existsSync(manifestPath)) current = JSON.parse(fs.readFileSync(manifestPath, "utf8"));
  } catch (_) { current = {}; }

  const forceUpdate = process.env.VENDOR_UPDATE === "1";

  for (const key of Object.keys(manifest)) {
    const { file, url, version } = manifest[key];
    const dest = path.join(vendorDir, file);
    console.log(`Checking vendor: ${dest}`, fs.existsSync(dest));
    const needDownload = forceUpdate || !fs.existsSync(dest);
    if (!needDownload) continue;
    try {
      console.log(`Ensuring vendor: ${file}@${version}`);
      await download(url, dest);
      current[key] = { version };
    } catch (err) {
      console.warn(`Failed to download ${file}:`, err?.message);
    }
  }

  // persist manifest (only if changed)
  try { fs.writeFileSync(manifestPath, JSON.stringify(current, null, 2), "utf8"); } catch (_) {}
}

async function main() {
  const mode = config.siteMode;

  // 读取 inline.js 文件
  const inlinePath = path.resolve("./src/inlines/inline.js");
  let inlineContent = fs.readFileSync(inlinePath, "utf8");

  if (mode == "top") {
    const swPath = path.resolve("./src/inlines/sw.js");
    inlineContent += fs.readFileSync(swPath, "utf8");
  }

  // 使用 terser 进行 minify
  async function purgeContent(content) {
    const result = await minify(content, {
      compress: {
        dead_code: true,
        drop_debugger: true,
        conditionals: true,
        evaluate: true,
        booleans: true,
        loops: true,
        unused: true,
        hoist_funs: true,
        keep_fargs: false,
        hoist_vars: true,
        if_return: true,
        join_vars: true,
        // cascade: true,
        side_effects: true,
        warnings: false,
      },
      mangle: false, // 不混淆变量名
      output: {
        beautify: false, // 输出为一行
      },
    });
    return result.code;
  }

  // 处理 inline.js 内容
  inlineContent = await purgeContent(inlineContent);

  // 读取 index.astro 文件
  const astroPath = path.resolve("./src/pages/index.astro");
  let astroContent = fs.readFileSync(astroPath, "utf8");

  // 替换最后一个 <script is:inline/> 元素
  const regex = /<script is:inline>.*<\/script>/;
  const replacement = `<script is:inline>${inlineContent}</script>`;
  astroContent = astroContent.replace(regex, replacement);
  // 写回 index.astro 文件
  fs.writeFileSync(astroPath, astroContent, "utf8");

  console.log("Successfully updated inline script in index.astro");

  // 下载并缓存前端第三方库到 public/libs/vendor（仅缺失或显式刷新时下载）
  await ensureVendors();
  console.log("Vendor libraries ready in public/libs/vendor (skip download if already present)");
}

main().catch(console.error);
