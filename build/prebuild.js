import fs from "fs";
import path from "path";
import { minify } from "terser";
import config from "../astro.config.mjs";
import https from "https";

// 安全复制目录（仅拷贝 .js/.mjs/.css/.map）
function copyDir(src, dest) {
  if (!fs.existsSync(src)) return false;
  fs.mkdirSync(dest, { recursive: true });
  const entries = fs.readdirSync(src, { withFileTypes: true });
  for (const e of entries) {
    const srcPath = path.join(src, e.name);
    const destPath = path.join(dest, e.name);
    if (e.isDirectory()) {
      copyDir(srcPath, destPath);
    } else {
      if (/\.(m?js|css|map)$/i.test(e.name)) {
        try { fs.copyFileSync(srcPath, destPath); } catch (_) {}
      }
    }
  }
  return true;
}

async function download(url, dest, timeoutMs = 10000) {
  // 写入临时文件，成功后原子替换，避免失败清空已有文件
  const temp = `${dest}.tmp`;
  await new Promise((resolve, reject) => {
    const file = fs.createWriteStream(temp);
    const req = https.get(url, (res) => {
      if (res.statusCode && res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
        // Follow simple redirects
        download(res.headers.location, dest, timeoutMs).then(resolve).catch(reject);
        return;
      }
      if (res.statusCode !== 200) {
        try { file.close(); fs.rmSync(temp, { force: true }); } catch (_) {}
        return reject(new Error(`Download failed ${res.statusCode}: ${url}`));
      }
      res.pipe(file);
      file.on("finish", () => file.close(resolve));
    });
    req.on("error", (err) => {
      try { file.close(); fs.rmSync(temp, { force: true }); } catch (_) {}
      reject(err);
    });
    req.setTimeout(timeoutMs, () => {
      req.destroy(new Error(`Timeout after ${timeoutMs}ms for ${url}`));
    });
  });
  try {
    const stat = fs.statSync(temp);
    if (stat.size > 0) {
      fs.renameSync(temp, dest);
    } else {
      fs.rmSync(temp, { force: true });
      throw new Error("Downloaded empty file");
    }
  } catch (e) {
    try { fs.rmSync(temp, { force: true }); } catch (_) {}
    throw e;
  }
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

  // 优先从 npm 包复制 Mermaid 的 dist 到 vendor
  const mermaidDist = path.resolve("./node_modules/mermaid/dist");
  const skipKeys = new Set();
  let mermaidCopiedFromNpm = false;
  if (fs.existsSync(mermaidDist)) {
    try {
      mermaidCopiedFromNpm = copyDir(mermaidDist, vendorDir);
      if (mermaidCopiedFromNpm) {
        console.log("✔ Copied Mermaid dist from node_modules to public/libs/vendor");
        // 这些条目将由 npm 拷贝提供，不再通过 CDN 下载
        skipKeys.add("mermaid");
        skipKeys.add("mermaidJs");
        skipKeys.add("ganttDiagramJs");
        skipKeys.add("sequenceDiagramJs");
        skipKeys.add("flowDiagramV2Js");
      }
    } catch (e) {
      console.warn("⚠ Failed to copy Mermaid from npm:", e?.message);
    }
  }

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
    mermaidJs: { file: "mermaid-00886c59.js", urls: [
      "https://unpkg.com/mermaid@10.9.0/dist/mermaid-00886c59.js",
      "https://cdn.jsdelivr.net/npm/mermaid@10.9.0/dist/mermaid-00886c59.js",
    ], version: "10.9.0" },
    ganttDiagramJs: { file: "ganttDiagram-d5eca442.js", urls: [
      "https://unpkg.com/mermaid@10.9.0/dist/ganttDiagram-d5eca442.js",
      "https://cdn.jsdelivr.net/npm/mermaid@10.9.0/dist/ganttDiagram-d5eca442.js",
    ], version: "10.9.0" },
    sequenceDiagramJs: { file: "sequenceDiagram-a3c91cc7.js", urls: [
      "https://unpkg.com/mermaid@10.9.0/dist/sequenceDiagram-a3c91cc7.js",
      "https://cdn.jsdelivr.net/npm/mermaid@10.9.0/dist/sequenceDiagram-a3c91cc7.js",
    ], version: "10.9.0" },
    flowDiagramV2Js: { file: "flowDiagram-v2-8dd8b966.js", urls: [
      "https://unpkg.com/mermaid@10.9.0/dist/flowDiagram-v2-8dd8b966.js",
      "https://cdn.jsdelivr.net/npm/mermaid@10.9.0/dist/flowDiagram-v2-8dd8b966.js",
    ], version: "10.9.0" },
  };

  const manifestPath = path.join(vendorDir, "manifest.json");
  let current = {};
  try {
    if (fs.existsSync(manifestPath)) current = JSON.parse(fs.readFileSync(manifestPath, "utf8"));
  } catch (_) { current = {}; }

  const forceUpdate = process.env.VENDOR_UPDATE === "1";

  for (const key of Object.keys(manifest)) {
    if (skipKeys.has(key) && !forceUpdate) {
      // 标记为已存在于 npm 拷贝中
      const pkgPath = path.resolve("./node_modules/mermaid/package.json");
      let pkgVer = "npm";
      try { pkgVer = JSON.parse(fs.readFileSync(pkgPath, "utf8")).version || "npm"; } catch (_) {}
      current[key] = { version: pkgVer };
      continue;
    }
    const { file, url, urls, version } = manifest[key];
    const dest = path.join(vendorDir, file);
    const exists = fs.existsSync(dest);
    const size = exists ? (fs.statSync(dest).size || 0) : 0;
    const valid = exists && size > 0; // 文件非空即视为有效，避免误删很小的 ESM 入口
    console.log(`Checking vendor: ${dest}`, exists, `size=${size}`);
    const needDownload = forceUpdate || !valid;
    if (!needDownload) continue;
    try {
      console.log(`Ensuring vendor: ${file}@${version}`);
      const timeout = key === "mermaid" ? 30000 : 10000;
      await downloadWithFallback(urls || url, dest, timeout);
      current[key] = { version };
      // 如果不是通过 npm 拷贝且是 mermaid 入口，则尝试递归抓取相对导入 chunk
      if (key === "mermaid" && !mermaidCopiedFromNpm) {
        try {
          const sources = Array.isArray(urls) ? urls : [urls || url];
          const timeout2 = 30000;
          await fetchMermaidChunksRecursively(dest, sources, vendorDir, timeout2);
        } catch (e) {
          console.warn(`Failed to expand Mermaid chunks:`, e?.message);
        }
      }
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
