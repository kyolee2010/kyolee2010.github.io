const { Component } = require('inferno');
const { cacheComponent } = require('hexo-component-inferno/lib/util/cache');

class Busuanzi extends Component {
    render() {
        if (!this.props.head) {
            return null;
        }

        return <script src={this.props.jsUrl} defer></script>;
    }
}

Busuanzi.Cacheable = cacheComponent(Busuanzi, 'plugin.busuanzi', props => ({
    head: props.head,
    jsUrl: props.helper.url_for('/js/visitors.js')
}));

module.exports = Busuanzi;
