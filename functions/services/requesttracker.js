const firebaseAdmin = require('firebase-admin');

module.exports = class RequestTracker {
  static recordVisit(safeUrlFrag, pageType) {
    if (!pageType)
      pageType = 'nocategory';

    let vCtr = firebaseAdmin.database().ref(`/visitPageCounts/${pageType}/totals/${safeUrlFrag}/total`);
    //  let newKey = vCtr.push().key;

    return vCtr.once('value')
      .then(val => {
        let oldTotal = val.val();
        if (!oldTotal)
          oldTotal = 0;
        let updates = {};
        //  updates[`/visitPageCounts/${pageType}/visits/${safeUrlFrag}/${newKey}`] = new Date().toISOString();
        updates[`/visitPageCounts/${pageType}/totals/${safeUrlFrag}/total`] = oldTotal + 1;

        return firebaseAdmin.database().ref().update(updates);
      });
  }
  static getTrendingSlugs(limit = 20) {
    return firebaseAdmin.database().ref(`/visitPageCounts/article/totals`).orderByChild('total').limitToLast(limit).once('value')
      .then(result => {
        let data = result.val();
        let array = [];
        for (let slug in data)
          array.push({
            slug,
            total: data[slug].total
          });

        array = array.sort((a, b) => {
          if (a.total > b.total)
            return -1;
          if (a.total < b.total)
            return 1;
          return 0;
        });

        return array;
      });
  }
  static truncateTrendingCounts(appDBConfig, hours = 48) {
    const cArticleQuery = require('./articlequery.js');

    let q = new cArticleQuery(appDBConfig);
    let filters = {
      'fields.pubDateTime[gte]': new Date(new Date().getTime() - (hours * 3600 * 1000))
    };

    return q.queryArticles(filters)
      .then(() => {
        let articleSlugs = {};

        for (let c = 0, l = q.articles.length; c < l; c++) {
          let trackSlug = q.articles[c].fields.pageUrl.replace(/[[\]{}()*+?.\\^$|]/g, '');
          articleSlugs[trackSlug] = true;
        }

        let vCtr = firebaseAdmin.database().ref(`/visitPageCounts/article/totals`);
        // eslint-disable-next-line
        return vCtr.once('value')
          .then(val => {
            let oldTotals = val.val();

            let out = {};
            for (let i in articleSlugs)
              if (oldTotals[i])
                out[i] = oldTotals[i];

            return firebaseAdmin.database().ref().update({
              '/visitPageCounts/article/totals' : out
            });
          });
      });
  }
};
