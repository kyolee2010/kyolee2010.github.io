const fs = require('fs');
const path = require('path');
const {
  pickLangBlock,
  stripHtmlComments
} = require('./include_helpers');

function renderNews(args, options) {
  const byYears = String(args[0] || '').toLowerCase() === 'years';
  const count = byYears ? Infinity : (parseInt(args[0], 10) || 23);
  const yearLimit = byYears ? (parseInt(args[1], 10) || 2) : Infinity;
  const newsPath = path.join(hexo.source_dir, '_includes/news.md');

  if (!fs.existsSync(newsPath)) return `<p><em>${options.emptyText}</em></p>`;

  const raw = fs.readFileSync(newsPath, 'utf8');
  const picked = pickLangBlock(raw, options.lang);
  if (!picked) return `<p><em>${options.emptyText}</em></p>`;

  const lines = stripHtmlComments(picked).split('\n').map(l => l.replace(/^[\uFEFF\s\u3000]+/, '').trim());
  const output = [];
  let total = 0;
  let years = 0;

  for (const line of lines) {
    const year = /^##\s*(.+)/.exec(line);
    if (year) {
      if (++years > yearLimit) break;
      output.push(`<h2 class="include-news-year">${year[1]}</h2>\n`);
      continue;
    }
    if (/^[-*]\s+/.test(line)) {
      output.push(line);
      if (++total >= count) break;
    }
  }

  if (output.length === 0) return `<p><em>${options.emptyText}</em></p>`;

  const markdownText = output.join('\n');
  let html = hexo.render.renderSync({ text: markdownText, engine: 'markdown' });

  html = `
  <div class="include-news">
    <ul class="include-news-list">
      ${html.replace(/<ul>|<\/ul>/g, '')}
    </ul>
  </div>`;

  const more = `
  <p class="include-news-more noindent">
    <a href="${options.moreHref}">${options.moreText}</a>
  </p>`;

  return `${html}${more}`;
}

hexo.extend.tag.register('include_news', function (args) {
  return renderNews(args, {
    lang: 'zh-CN',
    emptyText: '暂无新闻内容',
    moreHref: '/news/',
    moreText: '查看更多新闻 →'
  });
});

hexo.extend.tag.register('include_news_en', function (args) {
  return renderNews(args, {
    lang: 'en',
    emptyText: 'No news available',
    moreHref: '/en/news/',
    moreText: 'More news →'
  });
});
