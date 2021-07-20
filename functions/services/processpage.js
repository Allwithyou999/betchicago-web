const RSS = require('rss');
const genPageClass = require('../pages/generatepage.js');
const generatePage = new genPageClass();
const requestTracker = require('./requesttracker.js');
const cAppConfig = require('./appconfig');
const contentful = require('./contentful');
const cArticleQuery = require('./articlequery');
const appDBConfig = new cAppConfig();
const firebaseAdmin = require('firebase-admin');

module.exports = class cGeneratePage {
  constructor() {}
  _processPreviewPage() {

  }
  _processCachePage(res) {
    return this.htmlCacheTest()
      .then(cacheResult => {
        this.cacheResult = cacheResult;
        if (cacheResult.cached) {
          res.status(200).send(cacheResult.html);
        }

        return cacheResult;
      });
  }
  _processOnDemandPage(req, res) {
    let html = '';
    return this.fetchDataForPage()
      .then(() => (this.ampContent) ? this.ampOut(req) : this.htmlOut(req))
      .then(resultHTML => {
        html = resultHTML;
        let updates = {};
        this.out_html = html;
        updates[`/htmlCache/page${encodeURIComponent(this.originalUrl)}`] = {
          cacheTime: new Date(),
          html
        };
        return firebaseAdmin.database().ref().update(updates);
      })
      .then(() => {
        return res.status(200).send(this.out_html);
      });
  }
  processRSS(req, res, navigationCache) {
    this.ampContent = (req.query.amp === 'true');
    this.cacheBust = (req.query.cachebust === 'true');
    this.navigationCache = navigationCache;
    this.originalUrl = req.originalUrl.replace('?cachebust=true', '');
    this.trimTrendingHours = req.query.trimtrendinghours;
    if (this.trimTrendingHours)
      this.cacheBust = true;

    res.set("Access-Control-Allow-Origin", "*");
    res.set('Content-Type', 'text/xml');

    return appDBConfig.getConfig(false)
      .then(() => this._resolveURL(req))
      .then(() => this.fetchDataForRSS())
      .then(news => {
        const feed = new RSS({
          title: 'BetChicago',
          description: 'BetChicago',
          site_url: 'https://www.betchicago.com/',
          generator: 'BetChicago'
        });
        news.map(({fields}) => {
          const author = fields.author && fields.author.length > 0 && fields.author[0].fields.fullName;
          feed.item({
            title: fields.pageTitle,
            guid: fields.pageUrl,
            url: `https://www.betchicago.com/${fields.pageUrl}`,
            description: fields.summary,
            date: new Date(fields.pubDateTime),
            enclosure: {
              url: fields.featuredImage.fields.file.url.startsWith('//') ? `https:${fields.featuredImage.fields.file.url}` : fields.featuredImage.fields.file.url
            },
            author,
          })
          return fields;
        });
        return res.send(feed.xml());
      })
      .catch(e => {
        console.log(e);
        res.writeHead(301, {
          Location: 'https://www.betchicago.com/404.html'
        });
        res.end();
      });
  }
  processPage(req, res, navigationCache) {
    this.ampContent = (req.query.amp === 'true');
    this.cacheBust = (req.query.cachebust === 'true');
    this.navigationCache = navigationCache;
    this.originalUrl = req.originalUrl.replace('?cachebust=true', '');
    this.trimTrendingHours = req.query.trimtrendinghours;
    if (this.trimTrendingHours)
      this.cacheBust = true;

    res.set("Access-Control-Allow-Origin", "*");

    return appDBConfig.getConfig(false)
      .then(() => this._processCachePage(res))
      .then(() => this._resolveURL(req))
      .then(() => {
        this.updateRequestTracker();
        if (!this.cacheResult.cached) {
          return this._processOnDemandPage(req, res);
        }
        return Promise.resolve({});
      })
      .then(() => {
        return;
      })
      .catch(e => {
        console.log(e);
        res.writeHead(301, {
          Location: 'https://www.betchicago.com/404.html'
        });
        res.end();
      });
  }
  updateRequestTracker() {
    requestTracker.recordVisit(this.safeUrlFrag, this.pageType)
      .then(r => {
        return;
      })
      .catch(e => {
        console.log(e);
      });
  }
  htmlCacheTest() {
    if (this.cacheBust)
      return Promise.resolve({
        cached: false,
        html: ''
      });

    let cacheLen = appDBConfig.privateConfig.htmlCacheLengthSec;
    if (!cacheLen)
      cacheLen = 0;

    return firebaseAdmin.database().ref(`/htmlCache/page${encodeURIComponent(this.originalUrl)}`).once('value')
      .then(cacheResult => {
        let cR = cacheResult.val();
        let compareDate = (new Date().getTime()) - (cacheLen * 1000);
        if (cR) {
          if (new Date(cR.cacheTime) > compareDate) {
            return {
              cached: true,
              html: cR.html
            }
          }
        }

        return Promise.resolve({
          cached: false,
          html: ''
        });
      });
  }
  _resolveURL(req) {
    this.urlFrag = '';

    if (req.params.name)
      this.urlFrag = req.params.name;
    if (req.params.league) {
      if (req.params.section && (req.params.section !== 'home')) {
        this.urlLeague = req.params.league;
        this.urlSection = req.params.section;
      } else {
        this.urlFrag = req.params.league;
      }
    }
    this.safeUrlFrag = this.urlFrag.replace(/[[\]{}()*+?.\\^$|]/g, '');
    appDBConfig.updateRunLocal(req.get('host'));

    return this._getSlugLookup()
      .then(() => this._resolveDynamicURL(appDBConfig));
  }
  _getSlugLookup() {
    if (!this.cacheBust && this.navigationCache.lastSlugLookup < (new Date().getTime() - 60000)) {
      this.navigationObject = this.navigationCache.navigation;
      this.anchorPages = this.navigationCache.anchorPages;
      this.sectionSlugLookup = this.navigationCache.sectionSlugLookup;

      if (this.sectionSlugLookup && this.navigationObject && this.anchorPages)
        return Promise.resolve({});
    }
    this.navigationCache.lastSlugLookup = new Date().getTime();

    return contentful.getNavigationData()
      .then(r => {
        this.navigationCache.navigationObject = r.navigation;
        this.navigationCache.anchorPages = r.anchorPages;
        this.navigationObject = r.navigation;
        this.anchorPages = r.anchorPages;
        return;
      })
      .then(() => this._generateSectionSlugLookup());
  }
  _generateSectionSlugLookup() {
    this.sectionSlugLookup = {};
    let nav = this.navigationObject;
    for (let c = 0, l = nav.primary.length; c < l; c++)
      this.sectionSlugLookup[nav.primary[c].sectionSlug] = {
        contentType: 'menuItem',
        data: nav.primary[c]
      };
    for (let c = 0, l = nav.more.length; c < l; c++)
      this.sectionSlugLookup[nav.more[c].sectionSlug] = {
        contentType: 'menuItem',
        data: nav.more[c]
      };

    this.navigationCache.sectionSlugLookup = this.sectionSlugLookup;
    return this.sectionSlugLookup;
  }
  __updateComponentSlug(league) {
    let cSlugSet = appDBConfig.componentSlugs[league];
    if (cSlugSet) {
      if (this.urlSection)
        this.componentSlug = cSlugSet[this.urlSection];

      if (!this.componentSlug)
        this.componentSlug = cSlugSet.default;
    }
  }
  _resolveDynamicURL() {
    this.pageType = '';
    if (!this.urlLeague)
      this.urlLeague = this.safeUrlFrag;
    if (this.urlLeague) {
      //check contenful -> nav   urlLeague = Section   / urlSection = SectionComponent
      this.leagueObj = this.sectionSlugLookup[this.urlLeague];
      if (this.leagueObj) this.leagueObj = this.leagueObj.data;
      if (this.leagueObj) {
        if (this.leagueObj.sectionComponents) {
          for (let c = 0, l = this.leagueObj.sectionComponents.length; c < l; c++) {
            if (this.urlSection === this.leagueObj.sectionComponents[c].component.replace('NCAAMB', '')) {
              if (this.leagueObj.sectionComponents[c].pageTitle)
                this.leagueObj.pageTitle = this.leagueObj.sectionComponents[c].pageTitle;
              else
                this.leagueObj.pageTitle = this.leagueObj.pageTitle + ' - ' + this.urlSection;

              if (this.leagueObj.sectionComponents[c].metaTitle) this.leagueObj.metaTitle = this.leagueObj.sectionComponents[c].metaTitle;
              if (this.leagueObj.sectionComponents[c].metaDescription) this.leagueObj.metaDescription = this.leagueObj.sectionComponents[c].metaDescription;
              if (this.leagueObj.sectionComponents[c].pageHeadline) this.leagueObj.pageHeadline = this.leagueObj.sectionComponents[c].pageHeadline;
              if (this.leagueObj.sectionComponents[c].seoFooterContent) this.leagueObj.seoFooterContent = this.leagueObj.sectionComponents[c].seoFooterContent;
              if (this.leagueObj.sectionComponents[c].seoFooterHeadline) this.leagueObj.seoFooterHeadline = this.leagueObj.sectionComponents[c].seoFooterHeadline;
              if (this.leagueObj.sectionComponents[c].rightPanelWidgets) this.leagueObj.rightPanelWidgets = this.leagueObj.sectionComponents[c].rightPanelWidgets;
              this.pageType = 'leaguesection';
              this.pageSection = this.urlSection;
              break;
            }
          }
        }
        this.__updateComponentSlug(this.urlLeague);
      }

      //check for slugs entered into settings
      let patchSlugs = appDBConfig.patchSlugs;
      if (patchSlugs) {
        let patch = patchSlugs.sections[this.urlLeague];
        if (patch)
          if (patch[this.urlSection]) {
            this.pageType = 'leaguesection';
            this.pageSection = this.urlSection;
            this.pageSlug = patch[this.urlSection];
          }
      }

      let teamSlugs = appDBConfig.teamSlugs;
      if (teamSlugs) {
        let patch = teamSlugs[this.urlLeague];
        if (patch)
          if (patch[this.urlSection]) {
            this.pageType = 'team';
            this.pageSection = this.urlSection;
            this.pageSlug = patch[this.urlSection];
          }
      }
    }

    if (!this.pageType) {
      if (!this.leagueObj) {
        this.leagueObj = this.sectionSlugLookup[this.safeUrlFrag];
        if (this.leagueObj)
          this.leagueObj = this.leagueObj.data;
      }

      if (this.leagueObj) {
        this.pageType = 'league';
        this.__updateComponentSlug(this.safeUrlFrag);
      } else if (Object.keys(appDBConfig.componentSlugs).indexOf(this.safeUrlFrag) !== -1) {
        this.pageType = 'league';
        this.__updateComponentSlug(this.safeUrlFrag);
      } else if (this.urlFrag === '' || this.urlFrag === 'home') {
        this.pageType = 'home';
      }
    }

    if (!this.pageType) {
      if (this.anchorPages)
        this.anchorPageObj = this.anchorPages[this.safeUrlFrag];
      if (this.anchorPageObj) {
        this.pageType = 'anchorPage';
      }
    }

    //if page found, don't search for article
    if (this.pageType)
      return {};

    this.urlSlugQuery = new cArticleQuery(appDBConfig);
    return this.urlSlugQuery.querySlugs('article', this.safeUrlFrag)
      .then(() => {
        if (this.urlSlugQuery.articleFound)
          this.pageType = 'article';

        return {};
      })
      .then(() => {
        if (!this.pageType) {
          return this.__resolveApArticleSlug();
        }

        return {};
      })
  }
  __resolveApArticleSlug() {
    let slug = this.safeUrlFrag;
    return firebaseAdmin.database().ref(`/apArticleStore/skinny/bySlug/${slug}`).once('value')
      .then(result => {
        let id = result.val();
        this.apId = id;
        if (id) {
          return firebaseAdmin.database().ref(`/apArticleStore/skinny/byId/${id}`).once('value');
        }

        return false;
      })
      .then(res2 => {
        if (res2) {
          let article = res2.val();
          if (article) {
            this.pageType = 'article';
            this.apArticle = article;
            this.apArticle.id = this.apId;
          }
        }
        return;
      })
  }
  __getSectionQuery(tag) {
    let mainID = this.sectionSlugLookup[tag].data.primaryHeadline;
    let secondRow = [];
    if (this.sectionSlugLookup[tag].data.secondaryHeadlines)
      secondRow = this.sectionSlugLookup[tag].data.secondaryHeadlines.slice(0);

    if (mainID)
      secondRow.unshift(mainID);

    this.dataResults.headlineRowsOrder = secondRow;
    return {
      'sys.id[in]': secondRow.join(',')
    };
  }
  fetchDataForPage() {
    this.dataResults = {};

    let queries = [];
    this.dataResults.articles = [];
    this.dataResults.league = [];
    this.dataResults.author = [];
    this.dataResults.trending = [];

    if (this.pageType === 'league') {
      /*
      queries.push(this._pageQuery('articles', {
        'fields.section.sys.id[in]': this.leagueObj.id
      }));
      */
      if (!this.leagueObj && Object.keys(appDBConfig.componentSlugs).indexOf(this.safeUrlFrag) !== -1) {
        queries.push(this._pageQuery('trending', {}, true));
      }
      else {
        queries.push(this._pageQuery('headlines', this.__getSectionQuery(this.leagueObj.sectionSlug)));
        queries.push(this._pageQuery('league', {
          'fields.section.sys.id[in]': this.leagueObj.id,
          limit: 15
        }));
        queries.push(this._pageQuery('trending', {}, true));
      }

    } else if (this.pageType === 'article') {
      this.dataResults['articles'] = this.urlSlugQuery.articleResults;
      queries.push(this._pageQuery('trending', {}, true));
      //fix this - get articles by all authors on story???
      let authorQ = {
        'fields.author.sys.id[in]': 'invalid'
      };
      if (!this.apArticle) {
        authorQ = {
          'fields.author.sys.id[in]': this.dataResults['articles'][0].fields.author[0].sys.id
        };
      }
      queries.push(this._pageQuery('author', authorQ));
    } else if (this.pageType === 'home') {
      queries.push(this._pageQuery('trending', {}, true));

      queries.push(this._pageQuery('headlines', this.__getSectionQuery('home')));
      queries.push(this._pageQuery('articles', {}));
    } else if (this.pageSection === 'news') {
      queries.push(this._pageQuery('league', {
        'fields.section.sys.id[in]': this.leagueObj.id
      }));
      queries.push(this._pageQuery('headlines', this.__getSectionQuery(this.leagueObj.sectionSlug)));
      queries.push(this._pageQuery('trending', {}, true));
    } else if (this.pageType === 'anchorPage') {
      queries.push(this._pageQuery('league', {
        'fields.anchorTags.sys.id[in]': this.anchorPageObj.id
      }));
      queries.push(this._pageQuery('trending', {}, true));
    } else if (this.pageSection === 'schedule') {
      queries.push(this._pageQuery('trending', {}, true));
    } else {
      queries.push(this._pageQuery('articles'));
      queries.push(this._pageQuery('trending', {}, true));
    }

    if (this.trimTrendingHours) {
      return requestTracker.truncateTrendingCounts(appDBConfig, this.trimTrendingHours)
        .then(() => Promise.all(queries));
    }

    return Promise.all(queries);
  }

  fetchDataForRSS() {
    this.dataResults = {};

    this.dataResults.league = [];
    if (this.pageType === 'league') {
     
      if (!this.leagueObj && Object.keys(appDBConfig.componentSlugs).indexOf(this.safeUrlFrag) !== -1) {
        // queries.push(this._pageQuery('trending', {}, true));
      }
      else {
        return this._pageQuery('league', {
          'fields.section.sys.id[in]': this.leagueObj.id,
          limit: 15
        });
      }

    } else if (this.pageSection === 'news') {
      return this._pageQuery('league', {
        'fields.section.sys.id[in]': this.leagueObj.id
      });
    }

    return Promise.resolve([]);
  }

  _pageQuery(tag, filters = {}, trending = false) {
    let q = new cArticleQuery(appDBConfig);
    q.trending = trending;
    return q.queryArticles(filters)
      .then(() => {
        if (tag === 'headlines') {
          let result = [];
          for (let c = 0, l = this.dataResults.headlineRowsOrder.length; c < l; c++) {
            let id = this.dataResults.headlineRowsOrder[c];
            for (let d = 0, dl = q.articles.length; d < dl; d++)
              if (q.articles[d].sys.id === id) {
                result.push(q.articles[d]);
                break;
              }
          }

          this.dataResults[tag] = result;
        } else {

          if (trending === false)
            this.dataResults[tag] = q.articles.sort((a, b) => {
              if (new Date(a.fields.pubDateTime) > new Date(b.fields.pubDateTime)) return -1;
              if (new Date(a.fields.pubDateTime) < new Date(b.fields.pubDateTime)) return 1;
              return 0;
            });
          else {
            this.dataResults[tag] = q.articles;
          }
        }

        return this.dataResults[tag];
      });
  }
  htmlOut(req) {
    if (!this.leagueObj)
      if (this.sectionSlugLookup['home'])
        this.leagueObj = this.sectionSlugLookup['home'].data;
    return generatePage.getHTML({
      pageData: this.dataResults,
      pageType: this.pageType,
      apArticle: this.apArticle,
      patchSlug: this.pageSlug,
      pageSection: this.pageSection,
      anchorPageObj: this.anchorPageObj,
      leagueObj: this.leagueObj,
      anchorPages: this.anchorPages,
      safeUrlFrag: this.safeUrlFrag,
      componentSlug: this.componentSlug,
      dbURL: firebaseAdmin.database().app.options.databaseURL,
      navigationObject: this.navigationObject,
    }, appDBConfig, this.jsonOut, this.originalUrl);
  }
  // is broken, needs 2nd pass
  ampOut(req) {
    this.fullUrl = 'to do';

    let a = this.pageQuery.articles[0];
    let imagePath = this.staticContentPath + 'images/defaultarticle.jpg';
    let headline = 'default headline';
    let url = 'default/url';
    let content = "default content";

    if (a) {
      if (a.fields.featuredImage)
        if (a.fields.featuredImage.fields.file.url)
          imagePath = a.fields.featuredImage.fields.file.url;

      headline = a.fields.headline;
      url = appDBConfig.rootUrl() + a.fields.pageUrl;
      content = a.fields.content;
    }

    let articleJSON = `{
          "@context": "http://schema.org",
          "@type": "NewsArticle",
          "mainEntityOfPage": "http://example.ampproject.org/article-metadata.html",
          "headline": "${headline}",
          "datePublished": "1907-05-05T12:02:41Z",
          "dateModified": "1907-05-05T12:02:41Z",
          "description": "${headline}",
          "author": {
            "@type": "Person",
            "name": "Jordan M Adler"
          },
          "publisher": {
            "@type": "Organization",
            "name": "Google",
            "logo": {
              "@type": "ImageObject",
              "url": "http://cdn.ampproject.org/logo.jpg",
              "width": 600,
              "height": 60
            }
          },
          "image": {
            "@type": "ImageObject",
            "url": "http:${imagePath}",
            "height": 2000,
            "width": 800
          }
        }`;

    return `<!doctype html><html amp><meta charset="utf-8"><meta name="viewport" content="width=device-width,minimum-scale=1,initial-scale=1">` +
      `<script async src="https://cdn.ampproject.org/v0.js"></script>` +
      `<link rel="canonical" href="${url}">` +
      `<style amp-custom></style>` +
      `<script type="application/ld+json">${articleJSON}</script>` +
      //amp boilerplate
      '<style amp-boilerplate>body{-webkit-animation:-amp-start 8s steps(1,end) 0s 1 normal both;-moz-animation:-amp-start 8s steps(1,end) 0s 1 normal both;-ms-animation:-amp-start 8s steps(1,end) 0s 1 normal both;animation:-amp-start 8s steps(1,end) 0s 1 normal both}@-webkit-keyframes -amp-start{from{visibility:hidden}to{visibility:visible}}@-moz-keyframes -amp-start{from{visibility:hidden}to{visibility:visible}}@-ms-keyframes -amp-start{from{visibility:hidden}to{visibility:visible}}@-o-keyframes -amp-start{from{visibility:hidden}to{visibility:visible}}@keyframes -amp-start{from{visibility:hidden}to{visibility:visible}}</style><noscript><style amp-boilerplate>body{-webkit-animation:none;-moz-animation:none;-ms-animation:none;animation:none}</style></noscript>' +
      `<body>` +
      `<amp-img src="${imagePath}" width="500" height="300" layout="responsive" alt="AMP" /><br>` +
      `<h1>${headline}</h1>` +
      `<div>${content}</div>` +
      `</body></html>`;
  }
};
