const fs = require('fs');
const path = require('path');

const fileCache = new Map();

function readCached(absPath) {
  const stat = fs.statSync(absPath);
  const cached = fileCache.get(absPath);
  if (cached && cached.mtimeMs === stat.mtimeMs) return cached.text;

  const text = fs.readFileSync(absPath, 'utf8');
  fileCache.set(absPath, { mtimeMs: stat.mtimeMs, text });
  return text;
}

function normalizeLangVariants(lang) {
  const normalized = String(lang || '').trim().toLowerCase();
  if (!normalized) return [];

  const variants = [normalized];
  if (normalized.includes('-')) variants.push(normalized.split('-')[0]);
  return Array.from(new Set(variants));
}

function pickLangBlock(raw, lang) {
  if (!raw) return '';

  const variants = normalizeLangVariants(lang);
  if (variants.length === 0) return raw;

  const choice = variants
    .map(v => v.replace(/[-/\\^$*+?.()|[\]{}]/g, '\\$&'))
    .join('|');
  const re = new RegExp(
    `<!--\\s*lang\\s*:\\s*(${choice})\\s*-->([\\s\\S]*?)<!--\\s*lang\\s*:\\s*end\\s*-->`,
    'i'
  );
  const match = raw.match(re);
  return match ? match[2] : '';
}

function stripHtmlComments(text) {
  return String(text || '')
    .replace(/^[ \t]*<!--[\s\S]*?-->[ \t]*(?:\r?\n|$)/gm, '')
    .replace(/<!--(?!\s*lang\s*:)[\s\S]*?-->/gi, '');
}

function resolveUnderSource(hexo, fileRel) {
  const cleaned = String(fileRel || '').replace(/^\/+/, '');
  const abs = path.normalize(path.join(hexo.source_dir, cleaned));
  const root = path.normalize(hexo.source_dir);
  return abs.startsWith(root) ? abs : null;
}

module.exports = {
  pickLangBlock,
  readCached,
  resolveUnderSource,
  stripHtmlComments
};
