const contentful = require('../../../services/contentful');
//const contentfulmgt = require('../../../services/contentfulmgt');
const cArticleQuery = require('../../../services/articlequery');
const AppConfig = require('../../../services/appconfig.js');
const appDBConfig = new AppConfig();
const fetch = require('node-fetch');
const firebaseAdmin = require('firebase-admin');

module.exports = {};
module.exports.updateNavigationCache = (req, res) => {
  let contentType = '';
  let data = {};
  try {
    if (req.body && req.body !== '{}')
      contentType = JSON.parse(req.body).sys.contentType.sys.id;

    data = JSON.parse(req.body);
  } catch (e) {
    e;
  }
  const typesToUpdateOn = ['section', 'sectionPins', 'navigation', 'sectionComponents'];
  //if webhook call, only process section updates
  if (contentType !== '') {
    if (contentType === 'article') {
      return fetch(`https://www.betchicago.com/${data.fields.pageUrl['en-US']}?cachebust=true`, {
          cache: 'no-cache'
        })
        .then(r => {
          return res.status(200).send('article change/publish encountered ' + data.fields.pageUrl['en-US']);
        })
        .catch(e => console.log(e));
    }

    console.log('webhook call', contentType);

    if (typesToUpdateOn.indexOf(contentType) === -1)
      return res.status(200).send("no changes made");
  }

  return contentful.updateNavigationData()
    .then(results => res.status(200).send('{ "success": true }'))
    .catch(e => {
      res.status(500).send(e);
      console.log(e);
    });
};

module.exports.runMgtJob = (req, res) => {
  let mgt = {}; // new contentfulmgt();
  return mgt.processEntry('1RAG5EKSOMEM0oOM426IAy')
    .then(results => res.status(200).send(results))
    .catch(e => {
      res.status(500).send(e);
      console.log(e);
    });
};

module.exports.contentfulPagedResults = (req, res) => {
  let skip = req.query.skip;
  let pagesize = req.query.pagesize;
  let queryfilter = req.query.queryfilter;

  return appDBConfig.getConfig()
    .then(config => {
      let q = new cArticleQuery(appDBConfig);

      let filters = {
        'content_type': 'article',
        order: '-fields.pubDateTime',
        include: 1
      };

      let queryParts = queryfilter.split(':');
      if (queryParts[0] === 'trending') {
        q.trending = true;
        q.trendingLimit = 100;
      } else if (queryParts[0] === 'section') {
        filters['fields.section.sys.id[in]'] = queryParts[1];
      }

      if (req.query.pagesize)
        filters['limit'] = req.query.pagesize;

      if (req.query.skip)
        filters['skip'] = req.query.skip;

      return q.queryArticles(filters)
        .then(() => {
          let data = q.articles;
          if (!q.trending)
            data = q.articles.sort((a, b) => {
              if (new Date(a.fields.pubDateTime) > new Date(b.fields.pubDateTime)) return -1;
              if (new Date(a.fields.pubDateTime) < new Date(b.fields.pubDateTime)) return 1;
              return 0;
            });

          if (!q.fullQueryResults) {
            console.log(q);
            return res.status(200).send({
              total: 0,
              limit: 0,
              skip: 0,
              records: []
            })
          }

          return res.status(200).send({
            total: q.fullQueryResults.total,
            limit: q.fullQueryResults.limit,
            skip: q.fullQueryResults.skip,
            records: data
          });
        });
    })
    .catch(e => {
      res.status(500).send(e);
      console.log(e);
    });
};

module.exports.contentfulArticleList = (req, res) => {
  let skip = req.query.skip;
  let pagesize = req.query.pagesize;

  return appDBConfig.getConfig()
    .then(config => {
      let q = new cArticleQuery(appDBConfig);

      let filters = {
        'content_type': 'article',
        include: 1
      };
      filters['sys.id[in]'] = req.query.idlist;

      return q.queryArticles(filters)
        .then(() => {
          let data = q.articles;
          if (!q.trending)
            data = q.articles.sort((a, b) => {
              if (new Date(a.fields.pubDateTime) > new Date(b.fields.pubDateTime)) return -1;
              if (new Date(a.fields.pubDateTime) < new Date(b.fields.pubDateTime)) return 1;
              return 0;
            });

          if (!q.fullQueryResults) {
            console.log(q);
            return res.status(200).send({
              total: 0,
              limit: 0,
              skip: 0,
              records: []
            })
          }

          return res.status(200).send({
            total: q.fullQueryResults.total,
            limit: q.fullQueryResults.limit,
            skip: q.fullQueryResults.skip,
            records: data
          });
        });
    })
    .catch(e => {
      res.status(500).send(e);
      console.log(e);
    });
};

module.exports.clearCaches = (req, res) => {
  firebaseAdmin.database().ref().update({
      '/articleCache': {},
      '/htmlCache': {},
      '/queryCache': {},
      '/sportRadarStore/mlb/cache': {}
    })
    .then(r => res.status(200).send('success'))
    .catch(e => {
      res.status(500).send(e);
      console.log(e);
    });
};

module.exports.fetchArticleListPage = (req, res) => {
  let skip = req.query.skip;
  let pagesize = req.query.pagesize;

  return appDBConfig.getConfig()
    .then(config => {
      let q = new cArticleQuery(appDBConfig);
      q.trending = false;
      return q.queryArticles({
        skip,
        limit: pagesize
      });
    })
    .then(results => {
      let updates = {};

      for (let c = 0, l = results.length; c < l; c++)
        updates[results[c].fields.pageUrl] = {
          createdAt: results[c].sys.createdAt,
          updatedAt: results[c].sys.updatedAt,
          pubDateTime: results[c].fields.pubDateTime
        };

      return firebaseAdmin.database().ref('/articleListSiteMap').update(updates)
        .then(r => res.status(200).send('success'))
        .catch(e => {
          res.status(500).send(e);
          console.log(e);
        });
    });
};
