const firebaseAdmin = require('firebase-admin');
const AppConfig = require('../../../services/appconfig.js');
const appDBConfig = new AppConfig();
const SportRadarBase = require('./sportradarbase');

module.exports = class SportRadarMLBGame extends SportRadarBase {
  constructor() {
    super();
    this.basePath = 'http://api.sportradar.us/mlb/trial/v6.5/en/';
  }
  updateGame(eventId) {
    let promises = [];
    return appDBConfig.getConfig(true)
      .then(config => {
        this.appConfig = appDBConfig.appConfig;
        this.privateConfig = appDBConfig.privateConfig;
        this.SRKey = this.privateConfig.sportRadarMLB65Key;
        return {};
      })
      .then(() => this._updateGameData(eventId, 'pbp'))
      .then(() => this._updateGameData(eventId, 'boxscore'))
      .then(() => this._updateGameData(eventId, 'pitch_metrics'))
      .then(() => this._updateGameData(eventId, 'summary'));
  }
  _updateGameData(eventId, tag) {
    return this.SRAPI(`${this.basePath}games/${eventId}/${tag}.json?api_key=${this.privateConfig.sportRadarMLB65Key}`)
      .then(data => firebaseAdmin.database().ref(`/sportRadarStore/mlb/games/${eventId}/${tag}`).update(data))
      .catch(e => {
        console.log('eating because a key can overload', e);
      })
  }
  updateGamesForSchedule(data) {
    let promises = [];
    if (data.games)
      for (let c = 0, l = data.games.length; c < l; c++)
        promises.push(this.updateGame(data.games[c].id));

      //randomly reverse now so key failures happen in different places
    if (Math.floor(Math.random() * 10) > 4){
      console.log('reverse');
      promises.reverse();
    }
    return Promise.all(promises);
  }
};
