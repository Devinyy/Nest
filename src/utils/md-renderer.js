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
    const { marked } = await import('marked');
    marked.use({ gfm: true, breaks: true });

    // Preprocess Markdown to support ==mark==, ~sub~, ^sup^, and footnotes [^id]
    const { md: preMd, footnotes } = preprocessMarkdown(safeText);
    let html = marked.parse(preMd);

    // Append footnotes section at the end if any footnotes were defined
    // Unified at page bottom and separated from body with a horizontal rule
    if (footnotes.length) {
      const items = footnotes.map(({ id, text }) => {
        // Render footnote body inline to avoid block-level <p> causing line breaks
        const body = marked.parseInline(text);
        return `<li id="fn-${id}">${body} <a class="footnote-backref" href="#fnref-${id}" aria-label="返回内容">↩</a></li>`;
      }).join('');
      html += `<hr class="footnotes-separator" />` + `<section class="footnotes"><ol>${items}</ol></section>`;
    }

    // Sanitize
    if (opts.sanitize) {
      try {
        const mod = await import('dompurify');
        const DP = mod.default || mod;
        const sanitizeFn = DP.sanitize || DP;
        if (typeof sanitizeFn === 'function') {
          // 保留用于扩展标记的标签：kbd/mark/sub/sup/section，并允许表格单元格的对齐属性
          html = sanitizeFn(html, {
            ADD_TAGS: ['kbd', 'mark', 'sub', 'sup', 'section'],
            ADD_ATTR: ['align']
          });
        }
      } catch (_) {/* ignore sanitize failure */}
    }

    el.innerHTML = html;

    // Ensure external links open in a new tab/window; keep internal anchors in-page
    try {
      const isExternal = (href) => /^(https?:)?\/\//i.test(href);
      el.querySelectorAll('a[href]').forEach((a) => {
        const href = a.getAttribute('href') || '';
        if (isExternal(href)) {
          a.setAttribute('target', '_blank');
          a.setAttribute('rel', 'noopener noreferrer');
        } else {
          a.removeAttribute('target');
          a.removeAttribute('rel');
        }
      });

      // For in-page anchors, adjust scroll to account for sticky header height
      const nav = document.getElementById('stickyNav');
      const getHeaderOffset = () => {
        if (!nav) return 0;
        const rect = nav.getBoundingClientRect();
        // Consider visible when translated into view (has translate-y-0)
        const visible = nav.classList.contains('translate-y-0') && rect.height > 0;
        return visible ? rect.height : 0;
      };
      const scrollToTarget = (hash) => {
        if (!hash || hash === '#') return;
        const id = hash.startsWith('#') ? hash.slice(1) : hash;
        let target = null;
        // Prefer getElementById to avoid CSS.escape dependency
        target = document.getElementById(id);
        if (!target) {
          try {
            const selectorId = (window.CSS && typeof CSS.escape === 'function') ? CSS.escape(id) : id.replace(/[\\^$*+?.()|[\]{}]/g, '\\$&');
            target = el.querySelector(`#${selectorId}`);
          } catch (_) { /* ignore invalid selector */ }
        }
        if (!target) return;
        // Apply scroll margin so the element isn't hidden under the sticky header
        const offset = getHeaderOffset() || 48; // fallback to 48px (~h-12)
        try { target.style.scrollMarginTop = `${offset}px`; } catch (_) {}
        // Smooth scroll using scrollIntoView with block start
        try { target.scrollIntoView({ behavior: 'smooth', block: 'start' }); }
        catch (_) {
          const y = target.getBoundingClientRect().top + window.pageYOffset - offset;
          window.scrollTo({ top: y, behavior: 'smooth' });
        }
      };
      el.querySelectorAll('a[href^="#"]').forEach((a) => {
        a.addEventListener('click', (evt) => {
          const href = a.getAttribute('href') || '';
          if (!href || !href.startsWith('#')) {
            // If href changed to external later, allow default behavior
            return;
          }
          // Prevent default jump; do smooth scroll with header offset
          evt.preventDefault();
          scrollToTarget(href);
          // Update URL hash without reloading
          try { history.pushState(null, '', href); } catch (_) {}
        });
      });
    } catch (_) { /* ignore anchor enhancement failure */ }

    // Post-process: convert footnote references to external links when definitions contain a URL.
    try {
      const footnoteMap = buildFootnoteMapFromMarkdown(safeText);
      // Update footnote reference anchors to point to external URL
      el.querySelectorAll('sup.footnote-ref a').forEach((a) => {
        const id = (a.textContent || '').trim();
        const info = id ? footnoteMap[id] : undefined;
        if (info && info.url) {
          a.setAttribute('href', info.url);
          a.setAttribute('target', '_blank');
          a.setAttribute('rel', 'noopener noreferrer');
        }
      });
    } catch (_) { /* ignore post-process failure */ }

    // Syntax highlight
    if (opts.highlight) {
      try {
        await import('highlight.js/styles/github-dark.min.css');
        const hljs = await import('highlight.js');
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
          const mermaid = await import('mermaid');
          mermaid.default.initialize({ startOnLoad: false });
          mermaid.default.run({ nodes: ready });
        }
      } catch (_) {/* ignore mermaid failure */}
    }

    // KaTeX math rendering
    if (opts.math) {
      try {
        await import('katex/dist/katex.min.css');
        const mod = await import('katex/dist/contrib/auto-render.mjs');
        const renderMathInElement = mod.default || mod.renderMathInElement || mod;
        renderMathInElement(el, {
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

function preprocessMarkdown(text) {
  // Extract footnote definitions and replace inline mark/sub/sup while preserving code blocks
  const fenceRegex = /^(\s*)(```|~~~)/;
  let inFence = false;
  const lines = text.split('\n');
  const processed = [];
  const footnotes = [];
  const defLine = /^\s*\[\^([^\]]+)\]:\s*(.+)$/;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    if (fenceRegex.test(line)) {
      inFence = !inFence;
      processed.push(line);
      continue;
    }
    if (inFence) { processed.push(line); continue; }

    // Footnote definition lines
    const def = line.match(defLine);
    if (def) {
      footnotes.push({ id: def[1], text: def[2] });
      continue; // drop definition from main text
    }

    // Avoid replacements inside inline code `...`
    const parts = line.split(/(`[^`]*`)/g);
    for (let p = 0; p < parts.length; p++) {
      const part = parts[p];
      if (/^`[^`]*`$/.test(part)) continue;
      let s = part;
      // ==mark==
      s = s.replace(/==(.+?)==/g, '<mark>$1</mark>');
      // ^sup^
      s = s.replace(/(?<!\\)\^([^\^\n]+?)\^/g, '<sup>$1</sup>');
      // ~sub~
      s = s.replace(/(?<!\\)~([^~\n]+?)~/g, '<sub>$1</sub>');
      // Footnote references [^id]
      s = s.replace(/\[\^([^\]]+)\]/g, (_m, id) => `<sup class="footnote-ref"><a href="#fn-${id}" id="fnref-${id}">${id}</a></sup>`);
      parts[p] = s;
    }
    processed.push(parts.join(''));
  }

  return { md: processed.join('\n'), footnotes };
}

function buildFootnoteMapFromMarkdown(text) {
  const lines = String(text || '').split('\n');
  const defLine = /^\s*\[\^([^\]]+)\]:\s*(.+)$/;
  const map = {};
  for (let i = 0; i < lines.length; i++) {
    const def = lines[i].match(defLine);
    if (!def) continue;
    const id = def[1];
    const defText = def[2];
    // Extract URL from markdown [label](url) or bare URL
    let urlMatch = defText.match(/\((https?:\/\/[^)]+)\)/);
    if (!urlMatch) urlMatch = defText.match(/(https?:\/\/\S+)/);
    if (urlMatch) {
      map[id] = { url: urlMatch[1] };
    }
  }
  return map;
}

export async function renderMarkdownFromUrl(url, el, options = {}) {
  const res = await fetch(url);
  const text = await res.text();
  return renderMarkdownToElement(text, el, options);
}