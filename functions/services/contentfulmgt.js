const cmgt = require('contentful-management')
const functions = require('firebase-functions');
const firebaseAdmin = require('firebase-admin');
const AppConfig = require('./appconfig.js');
const cful = require('./contentful');

module.exports = class ContentfulMgt {
  getMgtClient() {
    let appConfig = new AppConfig();
    return appConfig.getConfig(true)
      .then(config => {
        this.privateConfig = appConfig.privateConfig;
        this.client = cmgt.createClient({
          accessToken: 'invalid'
        });

        return this.client;
      });
  }
  getSpace() {
    return this.client.getSpace(this.privateConfig.contentfulSpace);
  }
  processEntry() {
    return this.getMgtClient()
      .then(rrr => cful.getClient(this.privateConfig))
      .then(client => client.getEntries({
        'content_type': 'article',
        limit: 50,
        skip: 0
      }))
      .then(rr => {
        let ids = [];
        for (let c = 0, l = rr.items.length; c < l; c++)
          ids.push(rr.items[c].sys.id);
        this.articleIds = ids;
        return;
      })
      .then(r => this.getSpace())
      .then(s => s.getEnvironment('master'))
      .then((e) => {
        this.env = e;
        return;
      })
      .then(() =>{
        let promises = [];
        for (let c = 0, l = this.articleIds.length; c < l; c++) {
          promises.push(this.processSingleEntry(this.articleIds[c], this.env));
        }
        return Promise.all(promises)
      });
  }
  processSingleEntry(id, env) {
    return env.getEntry(id)
      .then((entry) => {
        console.log(id, entry.fields.pubDateTime);
        if (entry.fields.pubDateTime)
          return Promise.resolve({});
        if (!entry.sys.firstPublishedAt)
          return Promise.resolve({});

        entry.fields.pubDateTime = {
          "en-US": entry.sys.firstPublishedAt
        };
        console.log(entry.fields.pubDateTime, entry.sys.firstPublishedAt);
        return entry.update();
      })
      .then(() => env.getEntry(id))
      .then(pe => pe.publish())
  }
}
