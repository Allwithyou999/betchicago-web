const React = require('react');
const PropTypes = require('prop-types');
const NavMenu = require('./components/rnavmenu');
const ArticleFeatured = require('./components/rarticlefeatured');
const ArticleList = require('./components/rarticlelist');
const R = React.createElement;

module.exports = class BasePage extends React.Component {
  constructor(props) {
    super(props);

    this.articleLists = [{
      listClass: 'article-list-content-wrapper',
      articles: this.props.pageData['articles'],
      includeAuthors: true
    }, {
      listClass: 'league-article-list-content-wrapper',
      articles: this.props.pageData['league'],
      includeAuthors: true
    }, {
      listClass: 'trending-article-list-content-wrapper',
      articles: this.props.pageData['trending']
    }, {
      listClass: 'author-article-list-content-wrapper',
      articles: this.props.pageData['author']
    }, {
      listClass: 'headlines-list-content-wrapper',
      articles: this.props.pageData['headlines'],
      includeAuthors: true
    }];

    this.seoFooterContent = '';
  }
  getMainMenu() {
    return R('div', {
        className: 'navigation-header-bar'
      }, R('a', {
        className: 'logo-div',
        href: this.props.rootUrl
      }, R('img', {
        src: "/images/logo.png",
        alt: "Bet Chicago Logo"
      })),
      R('span', {
        className: "logo-div-spacer"
      }),
      R(NavMenu, {
        menus: this.props.navResults.primary,
        className: 'navigation-main-menu',
        parentProps: this.props,
        submenu: this.getSubMenu(),
      })
    );
  }
  getSubMenu() {
    return R(NavMenu, {
      menus: this.props.navResults.more,
      className: 'navigation-more-menu',
      parentProps: this.props
    });
  }
  getAnchorPages() {
    let menus = [];
    for (let i in this.props.anchorPages) {
      if (this.props.anchorPages[i].featuredTopic)
        menus.push(this.props.anchorPages[i]);
    }
    return R(NavMenu, {
      menus: menus,
      className: 'navigation-anchor-pages',
      parentProps: this.props
    });
  }
  getArticleLists() {
    let results = [];
    for (let c = 0, l = this.articleLists.length; c < l; c++)
      results.push(R(ArticleList, this.articleLists[c]));

    return results;
  }
  getFeaturedArticle() {
    let article = this.props.articles[0];
    if (this.props.pageData['headlines'])
      if (this.props.pageData['headlines'][0])
        article = this.props.pageData['headlines'][0];

    if (article)
      return R(ArticleFeatured, {
        article: article,
        defaultPicture: this.props.defaultArticleImage,
        rootUrl: this.props.rootUrl
      });
    return [];
  }
  getMainBody() {
    return R('div', {
        className: 'home-page-main-content-feed'
      },
      this.getFeaturedArticle());
  }
  getPageHeadline() {
    if (!this.props.leagueObj.pageHeadline) return null;
    return R('div', {
      className: 'page-headline'
    }, this.props.leagueObj.pageHeadline);
  }
  getSeoFooterHeadline() {
    if (!this.props.leagueObj.seoFooterHeadline) return null;
    return R('div', {
      className: 'seo-footer-headline'
    }, this.props.leagueObj.seoFooterHeadline);
  }
  generateRightsidebarContent(node) {
    if (node.nodeType === 'document') {
      this.rightSidebarContent += '<div>';
    } else if (node.nodeType === 'paragraph') {
      this.rightSidebarContent += '<p>';
    } else if (node.nodeType === 'heading-3') {
      this.rightSidebarContent += '<h3>';
    } else if (node.nodeType === 'hyperlink') {
      this.rightSidebarContent += '<a href="' + node.data.uri + '">';
    } else if (node.nodeType === 'text') {
      this.rightSidebarContent += node.value;
    }

    if (node.content) {
      for (let i = 0; i < node.content.length; i++) {
        this.generateRightsidebarContent(node.content[i]);
      }
    }

    if (node.nodeType === 'document') {
      this.rightSidebarContent += '</div>';
    } else if (node.nodeType === 'paragraph') {
      this.rightSidebarContent += '</p>';
    } else if (node.nodeType === 'heading-3') {
      this.rightSidebarContent += '</h3>';
    } else if (node.nodeType === 'hyperlink') {
      this.rightSidebarContent += '</a>';
    }
  }
  getRightSidebarWidget() {
    if (!this.props.leagueObj.rightPanelWidgets) return null;

    this.rightSidebarContent = '<div>';
    for (let i = 0; i < this.props.leagueObj.rightPanelWidgets.length; i++) {
      this.generateRightsidebarContent(this.props.leagueObj.rightPanelWidgets[i].fields.htmlContent);
    }
    this.rightSidebarContent += '</div>';

    if (!this.props.leagueObj.rightPanelWidgets) return null;
    return R('div', {
      className: 'right-sidebar-widget'
    }, this.rightSidebarContent);
  }
  generateFooterContent(node) {
    if (node.nodeType === 'document') {
      this.seoFooterContent += '<div>';
    } else if (node.nodeType === 'paragraph') {
      this.seoFooterContent += '<p>';
    } else if (node.nodeType === 'hyperlink') {
      this.seoFooterContent += '<a href="' + node.data.uri + '">';
    } else if (node.nodeType === 'text') {
      this.seoFooterContent += node.value;
    }

    if (node.content) {
      for (let i = 0; i < node.content.length; i++) {
        this.generateFooterContent(node.content[i]);
      }
    }

    if (node.nodeType === 'document') {
      this.seoFooterContent += '</div>';
    } else if (node.nodeType === 'paragraph') {
      this.seoFooterContent += '</p>';
    } else if (node.nodeType === 'hyperlink') {
      this.seoFooterContent += '</a>';
    }
  }
  getSeoFooterContent() {
    if (!this.props.leagueObj.seoFooterContent) return null;

    this.seoFooterContent = '';
    this.generateFooterContent(this.props.leagueObj.seoFooterContent);

    return R('div', {
      className: 'seo-footer-content'
    }, this.seoFooterContent);
  }
  render() {
    return [
      R('div', {
          className: 'navigation-header-wrapper'
        },
        this.getMainMenu(),
        R('div', {
          className: 'main-body-flex-wrapper'
        },
        this.getMainBody(),
        this.getArticleLists(),
        this.getAnchorPages(),
        this.getPageHeadline(),
        this.getSeoFooterHeadline(),
        this.getRightSidebarWidget(),
        this.getSeoFooterContent())
      )
    ];
  }
}
