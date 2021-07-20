const React = require('react');
const PropTypes = require('prop-types');
const R = React.createElement;
const BaseComponent = require('./basecomponent');

module.exports = class ArticleList extends BaseComponent {
  constructor(props) {
    super(props);
  }
  render() {
    let array = this.props.articles;
    if (!array)
      array = [];
    let articles = array.map((article) =>
      R('li', this.getLIAttributes(article),
        R('h2', {},
        R('a', {
          href: '/' + article.fields.pageUrl
        }, `${article.fields.headline}`))
      )
    );

    return R('div', {
        className: this.props.listClass
      },
      R('ul', null,
        articles)
    );
  }
  getLIAttributes(article) {
    let image = '';
    let imageAlt = '';
    if (article.fields.featuredImage) {
      if (article.fields.featuredImage.fields)
        if (article.fields.featuredImage.fields.file)
          image = article.fields.featuredImage.fields.file.url;

      if (article.fields.imgCaption)
        imageAlt = article.fields.imgCaption;
    }

    let sectionName = '';
    let sectionColor = '';
    let sectionSlug = '';
    if (article.fields.section) {
        if (article.fields.section[0] && article.fields.section[0].fields) {
          sectionName = article.fields.section[0].fields.name;
          if (article.fields.section[0].fields.sectionColor)
            if (article.fields.section[0].fields.sectionColor.fields)
              sectionColor = article.fields.section[0].fields.sectionColor.fields.hexCode;
          sectionSlug = article.fields.section[0].fields.sectionSlug;
        }
    }

    let thumbnail = '';
    if (article.fields.thumbnail) {
      thumbnail = article.fields.thumbnail.fields.file.url;
    }

    let attr = {
      key: article.sys.id,
      'data-id': article.sys.id,
      'data-summary': article.fields.summary,
      'data-created': article.sys.createdAt,
      'data-updated': article.fields.pubDateTime,
      'data-image': image,
      'data-sectionslug': sectionSlug,
      'data-sectionname': sectionName,
      'data-sectioncolor': sectionColor,
      'data-thumbnail': thumbnail,
      'data-phototitle': imageAlt
    };
    if (this.props.includeAuthors) {
      let authors = this.getAuthors(article);
      for (let c = 0, l = authors.length; c < l; c++) {
        attr[`data-author-fullname${c}`] = authors[c].fullName;
        attr[`data-author-title${c}`] = authors[c].title;
        attr[`data-author-company${c}`] = authors[c].company;
        attr[`data-author-twitter${c}`] = authors[c].twitterHandle;
        attr[`data-author-id${c}`] = authors[c].id;
      }
    }
    return attr;
  }
};
