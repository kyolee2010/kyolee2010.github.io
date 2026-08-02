(function() {
    // eslint-disable-next-line no-unused-vars
    let pjax;

    function initPjax() {
        try {
            const Pjax = window.Pjax || function() {};
            pjax = new Pjax({
                selectors: [
                    '[data-pjax]',
                    '.pjax-reload',
                    'head title',
                    '.columns',
                    '.navbar-main',
                    '.searchbox link',
                    '.searchbox script',
                    '#back-to-top',
                    '#comments link',
                    '#comments script'
                ],
                cacheBust: false
            });
        } catch (e) {
            console.warn('PJAX error: ' + e);
        }
    }

    document.addEventListener('pjax:complete', () => {
        if (window.MathJax) {
            try {
                window.MathJax.typesetPromise && window.MathJax.typesetPromise();
            } catch (e) {
                console.error('MathJax reload error:', e);
            }
        }
    });

    document.addEventListener('DOMContentLoaded', () => initPjax());
}());
