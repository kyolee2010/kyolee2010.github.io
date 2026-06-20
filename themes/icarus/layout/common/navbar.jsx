'use strict';

const { createVNode } = require('inferno');
const { cacheComponent } = require('hexo-component-inferno/lib/util/cache');

/** 是否外链 */
function isExternal(href = '') {
  return /^(?:https?:)?\/\//i.test(href) || /^mailto:/i.test(href) || /^tel:/i.test(href);
}

/** 英文页为站内路径加 /en 前缀 */
function withLangPrefix(path, isEN) {
  if (!path) return '/';
  if (isExternal(path)) return path;
  const p = path.startsWith('/') ? path : `/${path}`;
  if (!isEN) return p;
  if (p === '/en/' || p.startsWith('/en/')) return p;
  return p === '/' ? '/en/' : `/en${p}`;
}

/** 归一化用于比较（去协议、#、index.html） */
function norm(u = '') {
  const s = String(u)
    .replace(/(^\w+:|^)\/\//, '')
    .split('#')[0]
    .replace(/index\.html$/, '');
  return s.endsWith('/') && s !== '/' ? s.slice(0, -1) : s;
}

/** 是否为根或语言根 */
function isRootOrLangRoot(u = '') {
  const s = u.replace(/index\.html$/, '');
  if (s === '/' || s === '') return true;
  return /^\/[a-z]{2}(?:-[A-Z]{2})?\/$/.test(s);
}

function cleanLocalPath(path = '/') {
  let p = String(path || '/').split('#')[0].replace(/index\.html$/, '');
  if (!p.startsWith('/')) p = `/${p}`;
  if (!p.endsWith('/')) p = `${p}/`;
  return p;
}

/** 当前页面的中英文对应路径 */
function languageSwitchPath(pageUrl = '/', isEN, pairedPaths = ['/']) {
  let p = String(pageUrl || '/')
    .split('#')[0]
    .replace(/index\.html$/, '');

  if (!p.startsWith('/')) p = `/${p}`;
  if (!p.endsWith('/')) p = `${p}/`;

  const basePath = isEN ? p.replace(/^\/en\//, '/') : p;
  const hasPair = pairedPaths.includes(basePath);
  if (!hasPair) return isEN ? '/' : '/en/';

  if (isEN) {
    return p === '/en/' ? '/' : p.replace(/^\/en\//, '/');
  }

  if (p === '/') return '/en/';
  return p.startsWith('/en/') ? p : `/en${p}`;
}

/** 视图组件（带 Logo） */
function NavbarView({ menu = [], switchLabel, switchHref }) {
  const menuNodes = menu.map(item =>
    createVNode(
      1,
      'a',
      `navbar-item${item.active ? ' is-active' : ''}`,
      item.text,
      0,
      { href: item.url }
    )
  );

  const switchNode = createVNode(
    1,
    'a',
    'navbar-item lang-switch',
    switchLabel,
    0,
    { href: switchHref }
  );

  return createVNode(
    1,
    'nav',
    'navbar navbar-main',
    createVNode(
      1,
      'div',
      'container navbar-container',
      createVNode(
        1,
        'div',
        'navbar-menu',
        [
          // 左侧 Logo + 菜单
          createVNode(
            1,
            'div',
            'navbar-start',
            [
              // Logo（跳转首页）
              createVNode(
                1,
                'a',
                'navbar-item navbar-logo',
                createVNode(1, 'img', null, null, 1, {
                  src: '/images/logo.svg',
                  alt: 'Logo',
                }),
                0,
                { href: '/' }
              ),
              ...menuNodes
            ],
            0
          ),
          // 右侧语言切换
          createVNode(1, 'div', 'navbar-end', switchNode, 0)
        ],
        0
      ),
      2
    ),
    2
  );
}

module.exports = cacheComponent(NavbarView, 'common.navbar', (props) => {
  const { config, helper, page } = props;
  const { url_for, __ } = helper;
  const { navbar = {}, language = 'zh-CN' } = config;

  const lang = String(page && page.lang ? page.lang : language).toLowerCase();
  const isEN = lang === 'en' || lang.startsWith('en-');

  const tMenu = (key) => {
    const k1 = `navbar.menu.${key}`;
    const v1 = __(k1);
    if (v1 && v1 !== k1) return v1;
    const k2 = `menu.${key}`;
    const v2 = __(k2);
    if (v2 && v2 !== k2) return v2;
    const v3 = __(key);
    return (v3 && v3 !== key) ? v3 : key;
  };

  const pageUrl = url_for((page && page.path) ? page.path : '/').replace(/index\.html$/, '');
  const pageN = norm(pageUrl);

  const rawMenu = navbar.menu || {};
  const pairedPaths = Array.from(new Set(
    Object.values(rawMenu)
      .filter(href => !isExternal(href || '/'))
      .map(href => cleanLocalPath(href || '/'))
  ));
  const menu = Object.entries(rawMenu).map(([labelKey, href]) => {
    const path = withLangPrefix(href || '/', isEN);
    const url = url_for(path).replace(/index\.html$/, '');
    const text = tMenu(labelKey);
    const uN = norm(url);
    let active = false;
    if (uN === pageN) active = true;
    else if (!isRootOrLangRoot(url) && pageN.startsWith(uN) && uN !== '') active = true;
    if (labelKey === 'home') {
      active = (uN === pageN) && isRootOrLangRoot(url);
    }
    return { text, url, active };
  });

  const switchHref = url_for(languageSwitchPath(pageUrl, isEN, pairedPaths));
  const switchLabel = isEN ? '🇨🇳 中文' : '🇺🇸 English';

  return {
    menu,
    switchLabel,
    switchHref
  };
});
