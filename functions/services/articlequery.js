const contentful = require('./contentful');
const functions = require('firebase-functions');
const firebaseAdmin = require('firebase-admin');

module.exports = class ArticleQuery {
  constructor(appDBConfig) {
    this.appDBConfig = appDBConfig;
    this.queryResults = [];
    this.client = contentful.getClient(this.appDBConfig.privateConfig);
    this.previewMode = false;
    if (this.appDBConfig.privateConfig.contentfulPreviewKey) {
      this.previewMode = true;
    }
    this.trendingLimit = 20;
  }

  querySlugs(contentType, slug) {
    this.contentType = contentType;
    return this._queryCacheForSlug(slug)
      .then(result => {
        if (this.articleFound)
          return this.articleResults[0];

        return this._queryFetchForSlug(slug);
      });
  }
  _queryFetchForSlug(slug) {
    let query = {
      'content_type': this.contentType,
      'fields.pageUrl': slug,
      include: 1
    };

    if (!this.previewMode) {
      query['fields.pubDateTime[gte]'] = '1970-01-01';
      query['fields.pubDateTime[lte]'] = new Date().toISOString()
    }

    return this.client.getEntries(query)
      .then(result => {
        this.articles = result.items;
        if (this.articles.length > 0) {
          let updates = {};
          updates[`/${this.contentType}Cache/${slug}`] = {
            data: this.articles[0],
            fetched: new Date()
          };
          this.articleFound = true;
          this.articleResults = this.articles;
          return firebaseAdmin.database().ref().update(updates);
        }

        return this.articles[0];
      });
  }
  _queryCacheForSlug(slug) {
    return firebaseAdmin.database().ref(`/${this.contentType}Cache/${slug}`).once('value')
      .then(val => {
        let data = val.val();
        this.articleFound = false;
        if (data) {
          let cacheWindow = this.appDBConfig.privateConfig.articleCacheLengthSec * 1000;
          let cacheDate = Date.parse(data.fetched);
          if (cacheDate + cacheWindow > new Date()) {
            this.articleFound = true;
            this.articleResults = [data.data];
            this.fromCache = true;
          }
        }
        return this.articleFound;
      });
  }

  queryArticles(filters) {
    if (this.trending)
      return this._queryTrending(filters);

    return this._queryFetchResults(filters);
  }
  _queryFetchResults(filters) {
    let query = {
      'content_type': 'article',
      order: '-fields.pubDateTime',
      include: 1,
      limit: 25
    };

    if (!this.previewMode) {
      query['fields.pubDateTime[gte]'] = '1970-01-01';
      query['fields.pubDateTime[lte]'] = new Date().toISOString()
    }

    for (let i in filters)
      query[i] = filters[i];

    let slug = JSON.stringify(filters);
    this.querySaveKey = 'chksum' + this.checksum(slug);
    this.query = query;

    return this._queryCacheResult(query)
      .then(() => {
        if (this.queryFound) {
          this.articles = this.queryCacheResults;
          return this.articles;
        }

        return this._queryFetchContentfulResults(query, filters);
      });
  }
  checksum(s) {
    var chk = 0x12345678;
    var len = s.length;
    for (var i = 0; i < len; i++) {
      chk += (s.charCodeAt(i) * (i + 1));
    }

    return (chk & 0xffffffff).toString(16);
  }
  _queryFetchContentfulResults(query, filters) {
    return this.client.getEntries(query)
      .then(result => {
        this.articles = result.items;
        this.fullQueryResults = result;
        let updates = {};
        updates[`/queryCache/${this.querySaveKey}`] = {
          data: this.articles,
          fullQueryResults: result,
          filters: JSON.stringify(filters),
          query: JSON.stringify(query),
          fetched: new Date()
        };
        return updates;
      })
      .then(updates => firebaseAdmin.database().ref().update(updates))
      .then(() => this.articles);
  }
  _queryCacheResult(query) {
    return firebaseAdmin.database().ref(`/queryCache/${this.querySaveKey}`).once('value')
      .then(val => {
        let data = val.val();
        this.queryFound = false;
        if (data) {
          let cacheWindow = this.appDBConfig.privateConfig.articleCacheLengthSec * 1000;
          let cacheDate = Date.parse(data.fetched);
          if (cacheDate + cacheWindow > new Date()) {
            this.queryFound = true;
            if (data.data) {
              this.queryCacheResults = data.data;
              this.fullQueryResults = data.fullQueryResults;
            }
            else {
              this.queryCacheResults = [];
            }
            this.fromCache = true;
          }
        }
        return this.queryFound;
      });
  }
  _queryTrending(filters) {
    let slugResultsLocal = [];
    const requestTracker = require('./requesttracker');

    return requestTracker.getTrendingSlugs(this.trendingLimit)
      .then(slugResults => {
        let slugList = '';
        slugResultsLocal = slugResults;
        for (let c = 0, l = slugResults.length; c < l; c++)
          slugList += slugResults[c].slug + ',';

        filters['fields.pageUrl[in]'] = slugList
        return filters;
      })
      .then(filters => this._queryFetchResults(filters))
      .then(articles => {
        let slugObj = this.__articlesBySlug(this.articles);

        let resultArray = [];
        for (let c = 0, l = slugResultsLocal.length; c < l; c++)
          if (slugObj[slugResultsLocal[c].slug])
            resultArray.push(slugObj[slugResultsLocal[c].slug]);
        this.articles = resultArray;
        return this.articles;
      });
  }
  __articlesBySlug(articles) {
    let articlesBySlug = {};

    if (articles)
      for (let c = 0, l = articles.length; c < l; c++)
        articlesBySlug[articles[c].fields.pageUrl] = articles[c];

    return articlesBySlug;
  }
}
