const React = require('react');
const PropTypes = require('prop-types');
const R = React.createElement;
const BaseComponent = require('./basecomponent');

module.exports = class ArticleFeatured extends BaseComponent {
  constructor(props) {
    super(props);
  }
  render() {
    let articleContent = 'featured article content';
    let leagueName = '';
    this.imagePath = '';
    this.photoCred = '';
    this.photoTitle = '';
    if (this.props.article.fields.featuredImage) {
      if (this.path(this.props.article, 'fields.featuredImage.fields.file.url'))
        this.imagePath = this.path(this.props.article, 'fields.featuredImage.fields.file.url');
    }
    if (this.props.article.fields.imgSource) {
      this.photoCred = this.props.article.fields.imgSource;
    }
    if (this.props.article.fields.imgCaption) {
      this.photoTitle = this.props.article.fields.imgCaption;
    }
    if (this.props.article.fields.section && this.props.article.fields.section[0] &&
      this.props.article.fields.section[0].fields)
      leagueName = this.props.article.fields.section[0].fields.name;

    let descBlock = R('div', {
        className: 'description-wrapper'
      },
      R('span', {
        className: 'league-name'
      }, leagueName),
      R('h1', {
        className: 'article-headline'
      }, this.props.article.fields.headline)
    );

    if (this.props.smallSize)
      return R('a', {
          className: 'mini-feature-article-wrapper',
          'data-id': this.props.article.sys.id,
          'data-image': this.imagePath,
          href: this.props.rootUrl + this.props.article.fields.pageUrl
        }, R('div', {
          className: 'article-minifeature-content-wrapper',
          key: this.props.article.sys.id,
          style: {
            'backgroundImage': `url(${this.imagePath})`
          }
        }),
        R('br'),
        descBlock
      );

    if (this.props.pageSize)
      return this.renderPageSize();

    return R('a', {
        className: 'article-featured-content-wrapper',
        key: this.props.article.sys.id,
        href: this.props.rootUrl + this.props.article.fields.pageUrl,
        'data-id': this.props.article.sys.id,
        'data-image': this.imagePath,
        'data-photocred': this.photoCred,
        'data-phototitle': this.photoTitle,
        style: {
          'backgroundImage': `url(${this.imagePath})`
        }
      },
      descBlock);
  }
  getImageEmbed() {
    if (this.imagePath) {
      return R('img', {
        src: this.imagePath,
        alt: this.photoTitle
      });
    }

    return '';
  }
  renderPageSize() {
    let leagueName = '';
    if (this.props.article.fields.section)
      if (this.props.article.fields.section[0])
        leagueName = this.props.article.fields.section[0].fields.name;


    let descBlock = R('div', {
        className: 'article-page-description-wrapper'
      },
      R('span', {
        className: 'league-name'
      }, leagueName),
      R('br'),
      R('h1', {
        className: 'article-headline'
      }, this.props.article.fields.headline)
    );
    let article = this.props.article;
    let sectionName = '';
    let sectionColor = '';
    let sectionSlug = '';
    if (article.fields.section) {
      if (article.fields.section[0]) {
        sectionName = article.fields.section[0].fields.name;
        if (article.fields.section[0].fields.sectionColor)
          if (article.fields.section[0].fields.sectionColor.fields)
            sectionColor = article.fields.section[0].fields.sectionColor.fields.hexCode;
        sectionSlug = article.fields.section[0].fields.sectionSlug;
      }
    }

    let updatedAt = article.fields.pubDateTime;
    if (!updatedAt)
      updatedAt = article.sys.createdAt;
    return R('div', {
        className: 'article-page-content-wrapper'
      }, R('div', {
        className: 'article-featured-content-wrapper',
        key: this.props.article.sys.id,
        'data-id': this.props.article.sys.id,
        'data-image': this.imagePath,
        'data-photocred': this.photoCred,
        'data-phototitle': this.photoTitle,
        'data-content': this.props.article.fields.content,
        'data-sectionslug': sectionSlug,
        'data-sectionname': sectionName,
        'data-sectioncolor': sectionColor,
        href: this.props.article.fields.pageUrl,
        style: {
          'backgroundImage': `url(${this.imagePath})`
        }
      }),
      descBlock,
      R('h1', null, this.props.article.fields.headline),
      R('img', {
        src: this.imagePath
      }),
      R('input', {
        type: 'hidden',
        className: 'ap-image-data',
        value: JSON.stringify(this.props.article.apImages)
      }),
      R('p', {
        className: 'article-summary'
      }, this.props.article.fields.summary),
      this.getAuthorComponents(),
      R('div', {
        className: 'article-content'
      }, this.props.article.fields.content),
      R('span', {
        className: 'created-at'
      }, this.props.article.sys.createdAt),
      R('span', {
        className: 'updated-at'
      }, updatedAt)
    );
  }
  getAuthorComponents() {
    let authors = this.getAuthors(this.props.article);
    let results = [];
    for (let c = 0, l = authors.length; c < l; c++) {
      let imageUrl = '';
      if (this.path(authors[c], 'headshot.fields.file.url'))
        imageUrl = this.path(authors[c], 'headshot.fields.file.url');

      results = results.concat([
        R('div', {
          className: `author-fullname${c}`
        }, authors[c].fullName),
        R('div', {
          className: `author-title${c}`
        }, authors[c].title),
        R('div', {
          className: `author-company${c}`
        }, authors[c].company),
        R('div', {
          className: `author-image${c}`
        }, imageUrl),
        R('div', {
          className: `author-id${c}`
        }, authors[c].id),
        R('div', {
          className: `author-twitter${c}`
        }, authors[c].twitterHandle),
        R('div', {
          className: `author-bio${c}`
        }, authors[c].bio)
      ]);
    }

    return results;
  }
};
