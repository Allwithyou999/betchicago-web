const functions = require('firebase-functions');
const firebaseAdmin = require('firebase-admin');
const webPageApp = require('./webpageapp');
const swaggerAPI = require('./swagger/swaggerapi');

const serviceAccount = require("./bet-chicago.json");

const adminConfig = JSON.parse(process.env.FIREBASE_CONFIG);
adminConfig.credential = firebaseAdmin.credential.cert(serviceAccount);
firebaseAdmin.initializeApp(adminConfig);

exports.webPage = functions.https.onRequest(webPageApp);
exports.api = functions.https.onRequest(swaggerAPI);
