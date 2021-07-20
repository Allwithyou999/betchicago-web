const firebaseAdmin = require('firebase-admin');
const AppConfig = require('../../../services/appconfig.js');
const appDBConfig = new AppConfig();
const SportRadarBase = require('./sportradarbase');

module.exports = class SportRadarGolfSeason extends SportRadarBase {
  updateSeason(golfYear = "") {
    let golfTour = 'pga';
    return appDBConfig.getConfig(true)
      .then(config => {
        this.appConfig = appDBConfig.appConfig;
        this.privateConfig = appDBConfig.privateConfig;

        if (!golfYear)
          golfYear = this.appConfig.golfYearPGA.toString();

        return;
      })
      .then(() => this._fetchTourCache(golfTour, golfYear))
      .then(() => this.processSchedule(golfTour, golfYear));
  }
  _fetchTourCache(golfTour, year) {
    return Promise.all([
      this.createPlayerProfilesFetch(golfTour, year),
      this.createTourneyScheduleFetch(golfTour, year),
      this.createPlayerStaticsFetch(golfTour, year),
      this.createPlayerRankingFetch(golfTour, year)
    ]);
  }
  processSchedule(golfTour, year) {
    return firebaseAdmin.database().ref(`/sportRadarStore/golf/${golfTour}/${year}/schedule`).once('value')
      .then(result => {
        let base = result.val();
        let tL = base.tournaments;

        let skinnySchedule = [];
        let tournamentList = [];
        for (let c = 0, l = tL.length; c < l; c++) {
          skinnySchedule.push({
            name: tL[c].name,
            id: tL[c].id,
            venue: tL[c].venue,
            purse: tL[c].purse ? tL[c].purse : 'N/A',
            start_date: tL[c].start_date,
            end_date: tL[c].end_date
          });
          tournamentList.push({
            name: tL[c].name,
            id: tL[c].id
          });
        }
        let outData = {
          tournaments: skinnySchedule,
          season: base.season,
          tour: base.tour
        };
        let q = `/sportRadarStore/golf/${golfTour}/${year}`;
        return firebaseAdmin.database().ref(q).update({
          tournamentList,
          skinnySchedule: outData
        });
      });
  }
  createPlayerProfilesFetch(golfTour, year) {
    return this.SRAPI(`http://api.sportradar.us/golf-p2/profiles/${golfTour}/${year}/players/profiles.json?api_key=${this.privateConfig.sportRadarGolfKey}`)
      .then(data => {
        let playersById = {};
        for (let c = 0, l = data.players.length; c < l; c++)
          playersById[data.players[c].id] = data.players[c];
        data.playersById = playersById;

        return firebaseAdmin.database().ref(`/sportRadarStore/golf/${golfTour}/${year}/playerProfiles`).update(data);
      });
  }
  createTourneyScheduleFetch(golfTour, year) {
    return this.SRAPI(`http://api.sportradar.us/golf-p2/schedule/${golfTour}/${year}/tournaments/schedule.json?api_key=${this.privateConfig.sportRadarGolfKey}`)
      .then(data => {
        let byId = {};
        for (let c = 0, l = data.tournaments.length; c < l; c++)
          byId[data.tournaments[c].id] = data.tournaments[c];
        data.tournamentsById = byId;

        return firebaseAdmin.database().ref(`/sportRadarStore/golf/${golfTour}/${year}/schedule`).update(data);
      });
  }
  createPlayerStaticsFetch(golfTour, year) {
    return this.SRAPI(`http://api.sportradar.us/golf-p2/seasontd/${golfTour}/${year}/players/statistics.json?api_key=${this.privateConfig.sportRadarGolfKey}`)
      .then(data => {
        let playersById = {};
        for (let c = 0, l = data.players.length; c < l; c++)
          playersById[data.players[c].id] = data.players[c];
        data.playersById = playersById;

        return firebaseAdmin.database().ref(`/sportRadarStore/golf/${golfTour}/${year}/statistics`).update(data);
      });
  }
  createPlayerRankingFetch(golfTour, year) {
    return this.SRAPI(`http://api.sportradar.us/golf-p2/players/wgr/${year}/rankings.json?api_key=${this.privateConfig.sportRadarGolfKey}`)
      .then(data => {
        let playersById = {};
        for (let c = 0, l = data.players.length; c < l; c++)
          playersById[data.players[c].id] = data.players[c];
        data.playersById = playersById;
        data.updated_at = new Date().toISOString();

        return firebaseAdmin.database().ref(`/sportRadarStore/golf/${golfTour}/${year}/rankings`).update(data);
      });
  }
};
