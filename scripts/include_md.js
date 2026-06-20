const fs = require('fs');
const {
  pickLangBlock,
  readCached,
  resolveUnderSource,
  stripHtmlComments
} = require('./include_helpers');

const DEFAULT_FALLBACK_LANG = 'zh-CN';

hexo.extend.tag.register('include_md', function (args) {
  const fileRel = args && args[0];
  let lang = args && args[1];

  if (!fileRel) return '';
  if (!lang && this && this.page) lang = this.page.lang;

  const absPath = resolveUnderSource(hexo, fileRel);
  if (!absPath || !fs.existsSync(absPath)) {
    hexo.log.warn(`[include_md] File not found or out of source_dir: ${fileRel}`);
    return '';
  }

  let raw = '';
  try {
    raw = readCached(absPath);
  } catch (e) {
    hexo.log.error(`[include_md] Failed to read: ${absPath}`, e);
    return '';
  }

  let picked = pickLangBlock(raw, lang);
  if (!picked && DEFAULT_FALLBACK_LANG) {
    picked = pickLangBlock(raw, DEFAULT_FALLBACK_LANG);
  }

  if (!picked) return '';
  try {
    return hexo.render.renderSync({ text: stripHtmlComments(picked), engine: 'markdown' }).trim();
  } catch (e) {
    // 渲染失败就退回原始文本
    return stripHtmlComments(picked).trim();
  }
}, { ends: false });
