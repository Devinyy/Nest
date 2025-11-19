// Lightweight Markdown renderer with optional highlight, mermaid, and math (KaTeX)
// Usage:
//   import('/libs/md-renderer.js').then(({ renderMarkdownToElement }) => {
//     renderMarkdownToElement(text, container, { highlight: true, mermaid: true, math: true, sanitize: true });
//   });

function resolveUrl(localUrl, cdnUrl) {
  return fetch(localUrl, { method: 'HEAD' })
    .then((res) => (res.ok ? localUrl : cdnUrl))
    .catch(() => cdnUrl);
}

export async function renderMarkdownToElement(text, el, options = {}) {
  const opts = {
    highlight: true,
    mermaid: true,
    math: true,
    sanitize: true,
    ...options,
  };

  if (!el) return;
  const safeText = String(text ?? '');

  try {
    const markedUrl = await resolveUrl('/libs/vendor/marked.esm.js', 'https://cdn.jsdelivr.net/npm/marked@12.0.2/lib/marked.esm.js');
    const { marked } = await import(markedUrl);
    marked.use({ gfm: true, breaks: true });
    let html = marked.parse(safeText);

    // Sanitize
    if (opts.sanitize) {
      try {
        const dpUrl = await resolveUrl('/libs/vendor/dompurify.es.js', 'https://cdn.jsdelivr.net/npm/dompurify@3.0.8/dist/purify.es.js');
        const { sanitize } = await import(dpUrl);
        // 确保保留 <kbd> 标签用于快捷键展示
        html = sanitize(html, { ADD_TAGS: ['kbd'] });
      } catch (_) {/* ignore sanitize failure */}
    }

    el.innerHTML = html;

    // Syntax highlight
    if (opts.highlight) {
      try {
        const cssUrl = await resolveUrl('/libs/vendor/highlight.github-dark.min.css', 'https://cdn.jsdelivr.net/npm/highlight.js@11.9.0/styles/github-dark.min.css');
        await ensureCss('hljs-style', cssUrl);
        const hljsUrl = await resolveUrl('/libs/vendor/highlight.min.js', 'https://cdn.jsdelivr.net/npm/highlight.js@11.9.0/es/highlight.min.js');
        const hljs = await import(hljsUrl);
        el.querySelectorAll('pre code').forEach((block) => {
          try { hljs.default.highlightElement(block); } catch (_) {}
        });
      } catch (_) {/* ignore highlight failure */}
    }

    // Mermaid diagrams
    if (opts.mermaid) {
      try {
        const mermaidNodes = Array.from(el.querySelectorAll('pre code.language-mermaid'));
        if (mermaidNodes.length) {
          const ready = [];
          mermaidNodes.forEach((code) => {
            const parent = code.parentElement;
            const graph = code.textContent || '';
            const div = document.createElement('div');
            div.className = 'mermaid';
            div.textContent = graph;
            if (parent) parent.replaceWith(div);
            ready.push(div);
          });
          const mmdUrl = await resolveUrl('/libs/vendor/mermaid.esm.min.mjs', 'https://cdn.jsdelivr.net/npm/mermaid@10.9.0/dist/mermaid.esm.min.mjs');
          const mermaid = await import(mmdUrl);
          mermaid.default.initialize({ startOnLoad: false });
          mermaid.default.run({ nodes: ready });
        }
      } catch (_) {/* ignore mermaid failure */}
    }

    // KaTeX math rendering
    if (opts.math) {
      try {
        const katexCssUrl = await resolveUrl('/libs/vendor/katex.min.css', 'https://cdn.jsdelivr.net/npm/katex@0.16.9/dist/katex.min.css');
        await ensureCss('katex-style', katexCssUrl);
        const autoUrl = await resolveUrl('/libs/vendor/auto-render.mjs', 'https://cdn.jsdelivr.net/npm/katex@0.16.9/dist/contrib/auto-render.mjs');
        const auto = await import(autoUrl);
        auto.renderMathInElement(el, {
          delimiters: [
            { left: '$$', right: '$$', display: true },
            { left: '$', right: '$', display: false },
            { left: '\\(', right: '\\)', display: false },
            { left: '\\[', right: '\\]', display: true },
          ],
          throwOnError: false,
        });
      } catch (_) {/* ignore katex failure */}
    }

  } catch (err) {
    // Fallback to plain text on any failure
    el.textContent = safeText;
  }
}

export async function renderMarkdownFromUrl(url, el, options = {}) {
  const res = await fetch(url);
  const text = await res.text();
  return renderMarkdownToElement(text, el, options);
}

async function ensureCss(id, href) {
  if (document.getElementById(id)) return;
  const link = document.createElement('link');
  link.id = id;
  link.rel = 'stylesheet';
  link.href = href;
  document.head.appendChild(link);
}