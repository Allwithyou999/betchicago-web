const contentful = require('./contentful');
const cArticleQuery = require('./articlequery');
const cAppConfig = require('./appconfig');
const appDBConfig = new cAppConfig();
const firebaseAdmin = require('firebase-admin');

module.exports = class cGeneratePage {
  constructor() {}
  generateSiteMap(req, res) {

    res.set('Content-Type', 'text/xml');
    return appDBConfig.getConfig(false)
      .then(config => this.__fetchStaticNavigationRoutes())
      .then(() => this.__fetchArticleList())
      .then(() => this.__processToXML())
      .then(() => {
        return res.status(200).send(this.xmlOut);
      });
  }
  __fetchStaticNavigationRoutes() {
    this.staticLinks = ['/', '/trending'];
    return contentful.getNavigationData()
      .then(r => {
        this.navigationObject = r.navigation;
        this.anchorPages = r.anchorPages;

        let nav = r.navigation;
        for (let c = 0, l = nav.primary.length; c < l; c++)
          this.staticLinks.push('/' + nav.primary[c].sectionSlug);
        for (let c = 0, l = nav.more.length; c < l; c++)
          this.staticLinks.push('/' + nav.more[c].sectionSlug);

        for (let i in this.anchorPages)
          this.staticLinks.push('/' + i);

        return;
      });
  }
  __fetchArticleList() {
    this.articleLinks = {};
    return firebaseAdmin.database().ref('/articleListSiteMap').once('value')
      .then(result => {
        this.articleLinks = result.val();
        return;
      });
  }
  __processToXML() {
    let xmlLinks = '';
    this.xmlOut = '';
    for (let c = 0, l = this.staticLinks.length; c < l; c++) {
      xmlLinks += `  <url>
    <loc>https://www.betchicago.com${this.staticLinks[c]}</loc>
    <changefreq>always</changefreq>
    <priority>1</priority>
  </url>\n`;
    }

    for (let i in this.articleLinks) {
      xmlLinks += `  <url>
    <loc>https://www.betchicago.com/${i}</loc>
    <lastmod>${this.articleLinks[i].updatedAt}</lastmod>
    <changefreq>hourly</changefreq>
    <priority>.5</priority>
  </url>\n`;
    }

    this.xmlOut = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${xmlLinks}</urlset>`;

    return Promise.resolve();
  }
}
