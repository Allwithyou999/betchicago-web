const firebaseAdmin = require('firebase-admin');
const fetch = require('node-fetch');
const AppConfig = require('../../../services/appconfig.js');
const appDBConfig = new AppConfig();

/*
TO DO - implement this to reduce api calls for changes
??GET  Daily Change Log golf-t2/changelog/:golf_tour/:year/:month/:day/changes:format
*/


module.exports = class SportRadarBase {
  constructor() {}
  SRAPI(query) {
    let delay = 0;
    if (this.privateConfig.hardDelayBetweenAPICallsMS)
      delay = this.privateConfig.hardDelayBetweenAPICallsMS;
    let waitTill = new Date(new Date().getTime() + delay);
    if (delay)
      console.log('hardDelayBetweenAPICallsMS', delay, query);
    while (waitTill > new Date().getTime());

    return new Promise((resolve, reject) => {
      return fetch(query, {
          headers: {
            'Accept': 'application/json',
            "Content-type": "application/x-www-form-urlencoded; charset=UTF-8"
          },
          dataType: 'json'
        })
        .then(response => {
          return resolve(response.json());
        })
        .catch(e => reject(e));
    });
  }
  fetchCacheData(sport, type, id, query) {
    let refPath = `/sportRadarStore/${sport}/cache/${type}/${id}`;
    return this._testCacheData(refPath)
      .then(cacheResult => {
        if (cacheResult.valid)
          return cacheResult.results;

        return this._updateCacheData(refPath, query);
      });
  }
  _updateCacheData(refPath, query) {
    return this.SRAPI(query)
      .then(rawData => {
        this.cacheData =  {
          data: rawData,
          fetched: new Date().toISOString()
        };

        return this.cacheData;
      })
      .then(() => firebaseAdmin.database().ref(refPath).update(this.cacheData))
      .then(() => {
        return this.cacheData;
      });
  }
  _testCacheData(refPath) {
    return firebaseAdmin.database().ref(refPath).once('value')
      .then(val => {
        let data = val.val();
        if (data) {
          let cacheWindow = this.privateConfig.sportRadarCacheLengthSec * 1000;
          let cacheDate = Date.parse(data.fetched);
          if (cacheDate + cacheWindow > new Date()) {
            return {
              valid: true,
              results: [data.data],
              fromCache: true
            }
          }
        }
        return {
          valid: false
        };
      });
  }
  static path(obj, is, value) {
    try {
      if (!obj)
        return '';
      if (typeof is === 'string')
        return this.path(obj, is.split('.'), value);
      else if (is.length === 1 && value !== undefined)
        return obj[is[0]] = value;
      else if (is.length === 0)
        return obj;
      else if (!obj[is[0]])
        return '';
      else {
        return this.path(obj[is[0]], is.slice(1), value);
      }
    } catch (e) {
      console.log('path() err', e);
      return '';
    }
  }
}
