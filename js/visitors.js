(function() {
    const ttl = 24 * 60 * 60 * 1000;
    const countedKey = 'afml:busuanzi:countedAt';
    const siteKey = 'afml:busuanzi:siteUv';
    const pagePrefix = 'afml:busuanzi:pagePv:';

    function get(key) {
        try {
            return localStorage.getItem(key);
        } catch (e) {
            return null;
        }
    }

    function set(key, value) {
        try {
            localStorage.setItem(key, value);
        } catch (e) {}
    }

    function byId(id) {
        return document.getElementById(id);
    }

    function setText(id, value) {
        const el = byId(id);
        if (el && value) el.textContent = value;
    }

    function show(id) {
        const el = byId(id);
        if (el) el.style.display = '';
    }

    function hide(id) {
        const el = byId(id);
        if (el) el.style.display = 'none';
    }

    function restoreCachedValues() {
        const siteUv = get(siteKey);
        if (siteUv) {
            setText('busuanzi_value_site_uv', siteUv);
            show('busuanzi_container_site_uv');
        }

        const pagePv = get(pagePrefix + location.pathname);
        if (pagePv) {
            setText('busuanzi_value_page_pv', pagePv);
            show('busuanzi_container_page_pv');
        } else {
            hide('busuanzi_container_page_pv');
        }
    }

    function cacheRenderedValues() {
        let tries = 0;
        const timer = setInterval(() => {
            tries += 1;

            const siteUvEl = byId('busuanzi_value_site_uv');
            const pagePvEl = byId('busuanzi_value_page_pv');
            const siteUv = siteUvEl && siteUvEl.textContent.trim();
            const pagePv = pagePvEl && pagePvEl.textContent.trim();

            if (siteUv && siteUv !== '0') set(siteKey, siteUv);
            if (pagePv && pagePv !== '0') set(pagePrefix + location.pathname, pagePv);

            if ((siteUv && siteUv !== '0') || tries >= 40) {
                clearInterval(timer);
            }
        }, 250);
    }

    function loadCounter() {
        const script = document.createElement('script');
        script.src = '//busuanzi.ibruce.info/busuanzi/2.3/busuanzi.pure.mini.js';
        script.defer = true;
        script.onload = cacheRenderedValues;
        document.head.appendChild(script);
    }

    function boot() {
        const last = parseInt(get(countedKey) || '0', 10);
        const now = Date.now();

        if (last && now - last < ttl) {
            restoreCachedValues();
            return;
        }

        set(countedKey, String(now));
        loadCounter();
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', boot);
    } else {
        boot();
    }
}());
