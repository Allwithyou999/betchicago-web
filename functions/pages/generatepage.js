const React = require('react');
const ReactDOMServer = require('react-dom/server');
const R = React.createElement;
const beautifyHTML = require('js-beautify').html;
const HomePageBody = require('../pages/basepage');
const ArticlePageBody = require('../pages/rarticlepagebody');
const HeaderElement = require('./components/rheaderelement');

module.exports = class cGeneratePage {
  constructor() {}
  path(obj, is, value) {
    try {
      if (!obj)
        return '';
      if (typeof is === 'string')
        return this.path(obj, is.split('.'), value);
      else if (is.length === 1 && value !== undefined)
        return obj[is[0]] = value;
      else if (is.length === 0)
        return obj;
      else if (!obj[is[0]])
        return '';
      else {
        return this.path(obj[is[0]], is.slice(1), value);
      }
    } catch (e) {
      console.log('path() err', e);
      return '';
    }
  }
  _repocessAPArticle(renderModel) {
    if (!renderModel.apArticle) {
      if (renderModel.articles[0])
        renderModel.articles[0].apImages = [];
    } else if (renderModel.apArticle) {
      let content = '';
      if (renderModel.apArticle.contentRaw)
        for (let c = 0, l = renderModel.apArticle.contentRaw.length; c < l; c++)
          content += `<p>${renderModel.apArticle.contentRaw[c]}</p>`;

      let apA = renderModel.apArticle;
      if (apA.media) {
        if (!Array.isArray(apA.media))
          apA.media = [apA.media];
        apA.mainMedia = apA.media[0];
      }

      let featuredImage = '';
      let previewImage = '';
      let imageAlt = '';
      let imgSource = '';
      if (apA.mainMedia) {
        if (apA.mainMedia.refs) {
          let imageId = apA.mainMedia.refs[0].id.split(':')[1];
          featuredImage = `https://www.googleapis.com/download/storage/v1/b/bet-chicago.appspot.com/o/apimages%2F${apA.id}-${imageId}.jpg?alt=media`;
          imageId = apA.mainMedia.refs[1].id.split(':')[1];
          previewImage = `https://www.googleapis.com/download/storage/v1/b/bet-chicago.appspot.com/o/apimages%2F${apA.id}-${imageId}.jpg?alt=media`;
          imageAlt = apA.mainMedia.refs[0]['alternate-text'];
          if (Array.isArray(apA.mainMedia.caption.p))
            imgSource = apA.mainMedia.caption.p.join('');
          else
            imgSource = apA.mainMedia.caption.p;
        }
      }

      let article = {
        fields: {
          headline: renderModel.apArticle.apcmHeadLine,
          section: [],
          author: [],
          content,
          imgSource,
          imgCaption: imageAlt,
          summary: renderModel.apArticle.contentText.substring(0, 1000),
          featuredImage: {
            fields: {
              file: {
                url: featuredImage
              }
            }
          },
          previewImage: {
            fields: {
              file: {
                url: previewImage
              }
            }
          }
        },
        sys: {
          id: renderModel.apArticle.id,
          updatedAt: renderModel.apArticle.editDate,
          createdAt: renderModel.apArticle.editDate
        }
      };
      article.apImages = apA.media;
      renderModel.articles = [article];
    }
  }
  getOGImage(renderModel, list) {
    let articleOGImage = '';
    if (!list[0])
      return;

    if (list[0].fields.previewImage)
      articleOGImage = this.path(list[0].fields.previewImage, 'fields.file.url');

    if (!articleOGImage)
      if (list[0].fields.featuredImage)
        if (this.path(list[0].fields.featuredImage, 'fields.file.url')) {
          articleOGImage = this.path(list[0].fields.featuredImage, 'fields.file.url');
          if (!renderModel.apArticle && articleOGImage) {
            articleOGImage += '?h=450&w=600&fit=fill';
            //let img = list[0].fields.featuredImage.fields.file.url;
            //list[0].fields.featuredImage.fields.file.url = img;
          }
        }

    if (articleOGImage)
      renderModel.ogImageUrl = articleOGImage;
  }
  getSRWidgetLink(renderModel) {
    if (renderModel.leagueObj && renderModel.leagueObj.sectionSlug === 'soccer-betting')
      return [R('script', {
          src: "https://widgets.sir.sportradar.com/979d8140bc5b2e3c84e5b1dd345a7e8c/widgetloader",
          type: "application/javascript",
          'data-sr-language': 'en',
          'data-sr-theme': 'betradardark'
        }),
        R('link', {
          rel: "stylesheet",
          href: renderModel.staticContentPath + "sportradar.css"
        })
      ];
    return '';
  }
  getHTML(pageModel, appDBConfig, jsonOut, originalUrl) {
    return new Promise((resolve, reject) => {
      this.staticContentPath = appDBConfig.contentPath();
      this.rootUrl = appDBConfig.rootUrl();
      this.appConfig = appDBConfig.appConfig;

      let renderModel = pageModel;
      renderModel.navResults = renderModel.navigationObject;
      renderModel.articles = renderModel.pageData.articles;
      if (!renderModel.articles)
        renderModel.articles = [];
      renderModel.originalUrl = originalUrl;
      renderModel.staticContentPath = this.staticContentPath;
      renderModel.defaultArticleImage = this.appConfig.ogImage;
      renderModel.rootUrl = this.rootUrl;
      renderModel.appConfig = this.appConfig;
      renderModel.privateConfig = appDBConfig.privateConfig;

      this._repocessAPArticle(renderModel);

      if (renderModel.leagueObj) {
        renderModel.sectionColor = this.path(renderModel.leagueObj.sectionColor, 'fields.hexCode');
        renderModel.seoShareImg = this.path(renderModel.leagueObj.seoShareImage, 'fields.file.url');
        renderModel.twitterImg = this.path(renderModel.leagueObj.twitterShareImage, 'fields.file.url');
        renderModel.facebookImg = this.path(renderModel.leagueObj.facebookShareImage, 'fields.file.url');
      }

      if (jsonOut) {
        let r = JSON.stringify(renderModel, null, 4);
        return resolve(`<div style="white-space:pre">${r}</div>`);
      }

      let articleOGImagePage = false;

      if (renderModel.pageType === 'home'){
        articleOGImagePage = true;
        renderModel.ogTitle = renderModel.leagueObj.pageTitle;
        renderModel.ogDescription = renderModel.leagueObj.metaDescription;
      }
      if (renderModel.pageType === 'anchorPage')
        articleOGImagePage = true;
      if (renderModel.pageSection === 'news')
        articleOGImagePage = true;
      if (renderModel.pageType === 'league' && !renderModel.pageSection)
        articleOGImagePage = true;

      if (articleOGImagePage) {
        if (renderModel.pageData.headlines && renderModel.pageData.headlines.length > 0)
          this.getOGImage(renderModel, renderModel.pageData.headlines);
        else if (renderModel.pageData.league && renderModel.pageData.league.length > 0)
          this.getOGImage(renderModel, renderModel.pageData.league);
        else if (renderModel.pageData.articles && renderModel.pageData.articles.length > 0)
          this.getOGImage(renderModel, renderModel.pageData.articles);
      }

      if (renderModel.pageType === 'anchorPage') {
        renderModel.ogTitle = renderModel.anchorPageObj.pageTitle;
        renderModel.ogDescription = renderModel.anchorPageObj.metaDescription;
      } else if (renderModel.pageType === 'league') {
        renderModel.ogTitle = renderModel.leagueObj.pageTitle;
        renderModel.ogDescription = renderModel.leagueObj.metaDescription;
      } else if (renderModel.pageType === 'article') {
        this.getOGImage(renderModel, renderModel.articles);

        if (renderModel.articles[0]) {
          let article = renderModel.articles[0];
          if (article.fields.headline)
            renderModel.ogTitle = article.fields.headline;
          if (article.fields.summary)
            renderModel.ogDescription = article.fields.summary;
        }
      } else if (renderModel.pageType === 'leaguesection') {
        renderModel.ogTitle = renderModel.leagueObj.pageTitle;
        renderModel.ogDescription = renderModel.leagueObj.metaDescription;
      }

      let domGuts;
      if (renderModel.pageType === 'article')
        domGuts = ReactDOMServer.renderToStaticMarkup(
          R(ArticlePageBody, renderModel, null)
        );
      else
        domGuts = ReactDOMServer.renderToStaticMarkup(
          R(HomePageBody, renderModel, null)
        );

      let SIRHTML = this.getSRWidgetLink(renderModel);
      if (SIRHTML)
        SIRHTML = ReactDOMServer.renderToStaticMarkup(SIRHTML);

      domGuts = `${domGuts}` +
        `<div id="root"></div>`;

      let headGuts = ReactDOMServer.renderToStaticMarkup(
        R(HeaderElement, renderModel, null)
      );
      let domHTML = `<!DOCTYPE html><html>` +
        `${headGuts}` +
        `<body>
        <!-- Google Tag Manager (noscript) -->
<noscript><iframe src="https://www.googletagmanager.com/ns.html?id=GTM-PWGBK3H"
height="0" width="0" style="display:none;visibility:hidden"></iframe></noscript>
<!-- End Google Tag Manager (noscript) -->
${domGuts}
<div id="fb-root"></div>
<script>(function(d, s, id) {
  var js, fjs = d.getElementsByTagName(s)[0];
  if (d.getElementById(id)) return;
  js = d.createElement(s); js.id = id;
  js.src = 'https://connect.facebook.net/en_US/sdk.js#xfbml=1&version=v3.0&appId=${renderModel.privateConfig.facebookAppId}&autoLogAppEvents=1';
  fjs.parentNode.insertBefore(js, fjs);
}(document, 'script', 'facebook-jssdk'));</script>` + SIRHTML +
        `</body></html>`;

      let outHTML = beautifyHTML(domHTML);
      return resolve(outHTML);
    });
  }
};
