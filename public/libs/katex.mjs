// Local KaTeX ESM loader with CDN fallback
// This module provides a local import path for auto-render.mjs:
//   import katex from '../katex.mjs';
// It attempts to load a local vendor copy first, then falls back to CDN.

let mod;
try {
  // Prefer local vendor file if you later add it: /libs/vendor/katex.mjs
  mod = await import('./vendor/katex.mjs');
} catch (_) {
  // Fallback to CDN ESM build
  mod = await import('https://cdn.jsdelivr.net/npm/katex@0.16.9/dist/katex.mjs');
}

// Export default katex object (includes render, ParseError, etc.)
export default mod.default || mod;
// Named export for ParseError (used by auto-render)
export const ParseError = mod.ParseError;