const compression = require('compression');
let app = require('express')();

//page processing
app.use(compression());
const cGeneratePage = require('./services/processpage');
const cGenerateSiteMap = require('./services/generatesitemap');
app.navigationCache = {
  lastSlugLookup: 0
};
app.get('/home', (req, res) => {
  res.redirect(301, 'https://www.betchicago.com');
});
app.get('/sitemap.xml', (req, res) => (new cGenerateSiteMap()).generateSiteMap(req, res));
app.get('/:name/feed', (req, res) => (new cGeneratePage()).processRSS(req, res, app.navigationCache));
app.get('/:league/:section', (req, res) => (new cGeneratePage()).processPage(req, res, app.navigationCache));
app.get('/:league/:section/feed', (req, res) => (new cGeneratePage()).processRSS(req, res, app.navigationCache));
app.get('/:league/:section/*', (req, res) => (new cGeneratePage()).processPage(req, res, app.navigationCache));
app.get('/:name', (req, res) => (new cGeneratePage()).processPage(req, res, app.navigationCache));
app.get('*', (req, res) => (new cGeneratePage()).processPage(req, res, app.navigationCache));

module.exports = app;
