import fs from "fs";
import path from "path";
import { minify } from "terser";
import config from "../astro.config.mjs";
import https from "https";

async function download(url, dest, timeoutMs = 10000) {
  await new Promise((resolve, reject) => {
    const file = fs.createWriteStream(dest);
    const req = https.get(url, (res) => {
      if (res.statusCode && res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
        // Follow simple redirects
        download(res.headers.location, dest, timeoutMs).then(resolve).catch(reject);
        return;
      }
      if (res.statusCode !== 200) {
        try { file.close(); fs.rmSync(dest, { force: true }); } catch (_) {}
        return reject(new Error(`Download failed ${res.statusCode}: ${url}`));
      }
      res.pipe(file);
      file.on("finish", () => file.close(resolve));
    });
    req.on("error", (err) => {
      try { file.close(); fs.rmSync(dest, { force: true }); } catch (_) {}
      reject(err);
    });
    req.setTimeout(timeoutMs, () => {
      req.destroy(new Error(`Timeout after ${timeoutMs}ms for ${url}`));
    });
  });
}

async function downloadWithFallback(urls, dest, timeoutMs = 10000) {
  const candidates = Array.isArray(urls) ? urls : [urls];
  let lastErr;
  for (const u of candidates) {
    try {
      await download(u, dest, timeoutMs);
      const stat = fs.statSync(dest);
      if (!stat || stat.size === 0) throw new Error("Downloaded empty file");
      return; // success
    } catch (err) {
      lastErr = err;
      console.warn(`Download failed from ${u}: ${err?.message}`);
    }
  }
  throw lastErr || new Error("All download sources failed");
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
    marked: { file: "marked.esm.js", url: "https://cdn.jsdelivr.net/npm/marked@12.0.2/lib/marked.esm.js", version: "12.0.2" },
    // Use ESM builds from reliable CDNs
    // DOMPurify ESM via unpkg module wrapper to avoid jsDelivr 404
    dompurify: { file: "dompurify.es.js", url: "https://unpkg.com/dompurify@3.0.8/dist/purify.min.js?module", version: "3.0.8" },
    hljs_js: { file: "highlight.min.js", url: "https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.9.0/highlight.min.js", version: "11.9.0" },
    hljs_css: { file: "highlight.github-dark.min.css", url: "https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.9.0/styles/github-dark.min.css", version: "11.9.0" },
    mermaid: { file: "mermaid.esm.min.mjs", urls: [
      "https://unpkg.com/mermaid@10.9.0/dist/mermaid.esm.min.mjs",
      "https://cdn.jsdelivr.net/npm/mermaid@10.9.0/dist/mermaid.esm.min.mjs",
    ], version: "10.9.0" },
    katex_css: { file: "katex.min.css", url: "https://cdn.jsdelivr.net/npm/katex@0.16.9/dist/katex.min.css", version: "0.16.9" },
    katex_auto: { file: "auto-render.mjs", url: "https://cdn.jsdelivr.net/npm/katex@0.16.9/dist/contrib/auto-render.mjs", version: "0.16.9" },
  };

  const manifestPath = path.join(vendorDir, "manifest.json");
  let current = {};
  try {
    if (fs.existsSync(manifestPath)) current = JSON.parse(fs.readFileSync(manifestPath, "utf8"));
  } catch (_) { current = {}; }

  const forceUpdate = process.env.VENDOR_UPDATE === "1";

  for (const key of Object.keys(manifest)) {
    const { file, url, urls, version } = manifest[key];
    const dest = path.join(vendorDir, file);
    const exists = fs.existsSync(dest);
    const size = exists ? (fs.statSync(dest).size || 0) : 0;
    const valid = exists && size > 1024; // 文件必须非空且大于 1KB 才视为有效
    console.log(`Checking vendor: ${dest}`, exists, `size=${size}`);
    const needDownload = forceUpdate || !valid;
    if (!needDownload) continue;
    try {
      console.log(`Ensuring vendor: ${file}@${version}`);
      await downloadWithFallback(urls || url, dest, 10000);
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
