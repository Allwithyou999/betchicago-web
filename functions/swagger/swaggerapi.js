const swaggermw = require('swagger-express-mw');
const express = require('express');
const app = express();
const pathtoSwaggerUi = require('swagger-ui-dist').absolutePath();
const fs = require('fs');
const YAML = require('yamljs');
const path = require('path');
const feed = require('./feed');
const swaggerDocument = YAML.load(path.join(__dirname, '/api/swagger/swagger.yaml'));
let swaggerDocumentUI = YAML.load(path.join(__dirname, '/api/swagger/swagger.yaml'));

app.get('/', (req, res) => {
  res.set("Access-Control-Allow-Origin", "*");
  fs.createReadStream(path.join(__dirname, '/ui.html')).pipe(res);
});

app.get('/api-docs', (req, res) => {
  res.set("Access-Control-Allow-Origin", "*");
  res.json(swaggerDocument);
});

app.get('/api-docsui', (req, res) => {
  res.set("Access-Control-Allow-Origin", "*");
  let url = req.headers.referer;
  if (!url)
    url = '';
  if (url.indexOf('localhost:5001/bet-chicago') !== -1) {
    swaggerDocumentUI.basePath = '/bet-chicago/us-central1/api/';
    swaggerDocumentUI.host = 'localhost:5001';
  } else if (url.indexOf('localhost') !== -1) {
    swaggerDocumentUI.basePath = '/betchicagodev/us-central1/api/';
    swaggerDocumentUI.host = 'localhost:5001';
  } else if (req.get('host').indexOf('bet-chicago') !== -1) {
    swaggerDocumentUI.schemes = ['https', 'http'];
    swaggerDocumentUI.host = 'us-central1-bet-chicago.cloudfunctions.net';
    swaggerDocumentUI.basePath = '/api/';
  } else if (req.get('host').indexOf('betchicagodev') !== -1) {
    swaggerDocumentUI.schemes = ['https', 'http'];
    swaggerDocumentUI.host = 'us-central1-betchicagodev.cloudfunctions.net';
    swaggerDocumentUI.basePath = '/api/';
  }

  res.json(swaggerDocumentUI);
});

app.use(express.static(pathtoSwaggerUi));

swaggermw.create({
  appRoot: __dirname
}, (err, swaggerExpress) => {
  if (err) throw err;
  app.swaggerExpress = swaggerExpress;
  swaggerExpress.register(app);
});

// feed.startNBAClockFeed();
// feed.startNBAStatsFeed();

//feed.startNFLStatsFeed();

module.exports = app;
