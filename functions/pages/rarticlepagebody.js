const ArticleFeatured = require('./components/rarticlefeatured');

const BasePage = require('./basepage');
const React = require('react');
const R = React.createElement;

module.exports = class ArticlePageBody extends BasePage {
  constructor(props) {
    super(props);
    this.sections = false;
    this.articleList = false;
  }
  getMainBody() {
    let articles = this.props.articles;
    let mainArticle = '';

    if (articles && articles[0]) {
      let article = articles[0];
      mainArticle = R(ArticleFeatured, {
        article: article,
        parentModel: this.props,
        defaultPicture: this.props.defaultArticleImage,
        pageSize: true
      });
    }

    return R('div', {
        className: 'article-page-main-article-wrapper'
      },
      mainArticle
    );
  }
}
