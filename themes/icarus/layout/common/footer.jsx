const { Component } = require('inferno');

class Footer extends Component {
  render() {
    const { config } = this.props;
    const { plugins = {} } = config;
    const year = new Date().getFullYear();
    const showVisitors = plugins.busuanzi === true;

    return (
      <footer class="footer">
        <div class="container has-text-centered footer-inner">
          <p id="afml_footer_copyright">
            © {year} 声功能材料实验室
          </p>

          {showVisitors ? <p id="busuanzi_container_site_uv" class="footer-visitors">
            <span id="afml_footer_visit_label">访客数</span>：
            <span id="busuanzi_value_site_uv"></span>
          </p> : null}
        </div>

        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){
  var en = ((document.documentElement.getAttribute('lang')||'')
            .toLowerCase().indexOf('en')===0);
  var y = new Date().getFullYear();

  var c = document.getElementById('afml_footer_copyright');
  var l = document.getElementById('afml_footer_visit_label');

  if(c) c.textContent = '© ' + y + (en ? ' Acoustic Functional Materials Lab'
                                        : ' 声功能材料实验室');
  if(l) l.textContent = en ? 'Visitors' : '访客数';
})();`,
          }}
        />
      </footer>
    );
  }
}

module.exports = Footer;
