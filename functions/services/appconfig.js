const firebaseAdmin = require('firebase-admin');

module.exports = class AppConfig {
  constructor(host) {}
  updateRunLocal(host) {
    if (host.indexOf('localhost') !== -1)
      this.runLocal = true;
  }
  contentPath() {
    if (this.runLocal)
      return this.appConfig.staticContentLocalPath;

    return this.appConfig.staticContentPath;
  }
  rootUrl() {
    if (this.runLocal)
      return this.appConfig.rootLocalUrl;

    return this.appConfig.rootUrl;
  }
  getConfig(forceRefresh = false) {
    if (forceRefresh)
      this.appConfig = null;

    if (this.appConfig)
      return Promise.resolve(this.appConfig);

    return new Promise((resolve, reject) =>
      Promise.all([
        firebaseAdmin.database().ref('/applicationConfig').once('value'),
        firebaseAdmin.database().ref('/privateConfig').once('value'),
        firebaseAdmin.database().ref('/patchSlugs').once('value'),
        firebaseAdmin.database().ref('/teamSlugs').once('value'),
        firebaseAdmin.database().ref('/componentSlugs').once('value')
      ])
      .then(results => {
        this.appConfig = results[0].val();
        this.privateConfig = results[1].val();
        this.patchSlugs = results[2].val();
        this.teamSlugs = results[3].val();
        this.componentSlugs = results[4].val();
        return resolve(this.appConfig);
      })
    );
  }
};
