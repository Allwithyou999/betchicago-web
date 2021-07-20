const firebaseAdmin = require('firebase-admin');
const AppConfig = require('../../../services/appconfig.js');
const appDBConfig = new AppConfig();
const SportRadarBase = require('./sportradarbase');

/*
todo - use change log to optimize api requests
GET  Change Log sport_events/:unix_timestamp/changelog:format
*/

/*
GET  Tournaments Schedule tournaments/:tournament_id/schedule:format
GET  Sport Event Markets sport_events/:match_id/markets:format
*/

class OddsFetch extends SportRadarBase {
  constructor() {
    super();
    this.basePath = 'https://api.sportradar.us/oddscomparison-usp1/en/us/';
  }
  async initOdds() {
    return appDBConfig.getConfig(true)
      .then(config => {
        this.appConfig = appDBConfig.appConfig;
        this.privateConfig = appDBConfig.privateConfig;
        return config;
      });
  }
  async getCategoryList() {
    return firebaseAdmin.database().ref(`/sportRadarStore/odds/mappings/categories/categories`).once('value')
      .then(result => {
        this.categoryList = result.val();
        return this.categoryList;
      });
  }
  async __updateMapping(mappingPath) {
    let data = await this.SRAPI(`${this.basePath}${mappingPath}.json?api_key=${this.privateConfig.sportRadarOddsKey}`)

    let byOddId = {};
    let byStatId = {};
    if (data) {
      if (data.sport_event_mappings) {
        let ts = data.sport_event_mappings;

        for (let c in ts) {
          byOddId[ts[c].id] = ts[c].us_id;
          byStatId[ts[c].us_id] = ts[c].id;
        }
      }
    }
    //console.log (data);
    data.byOddId = byOddId;
    data.byStatId = byStatId;
    await firebaseAdmin.database().ref(`/sportRadarStore/odds/mappings/${mappingPath}`).update(data);

    return Promise.resolve();
  }
  getSportList() {
    return firebaseAdmin.database().ref(`/sportRadarStore/odds/mappings/sports/sports`).once('value')
      .then(result => {
        this.sportsList = result.val();
        return this.sportsList;
      });
  }
}

class SportRadarOdds {
  static async __updateOdds(date, oddsFetch) {
    let d = new Date();
    if (date)
      d = new Date(date);

    let sports = oddsFetch.privateConfig.oddsConfig.sports;
    let promises = [];
    oddsFetch.privateConfig.hardDelayBetweenAPICallsMS = 10;

    for (let i in sports) {
      let sport = sports[i];
      let dayMS = 24 * 3600 * 1000;
      if (sport.dailyOdds) {
        for (let dayCtr = 0; dayCtr < sport.daysahead; dayCtr++) {
          let d = new Date();
          d = new Date(d.getTime() + (dayCtr * dayMS));
          promises.push(this.updateDailySportSchedule(sport.oddsportid, d, oddsFetch));
        }
      }

      if (sport.categoryrightsupdates) {
        promises.push(this.__updateCategoryRights(sport.categoryrightsupdates.path, oddsFetch));
      }
    }

    return Promise.all(promises);

    /*
    .then(() =>  firebaseAdmin.database().ref(`sportRadarStore/odds`).update({
      'byMatchId': null
    }));
    */
  }
  static async processOddsSheets(matchArray, sheets, oFetch) {
    let updates = {};
    oFetch.privateConfig.hardDelayBetweenAPICallsMS = 10;

    if (!matchArray.sport || !matchArray.sport_events)
      return Promise.resolve();

    let promises = [];
    for (let i in sheets) {
      let sheet = sheets[i];
      let sheetName = i;
      for (let tCtr = 0; tCtr < sheet.tournamentIds.length; tCtr++) {
        let tIdFilter = sheet.tournamentIds[tCtr];
        for (let matchCtr = 0; matchCtr < matchArray.sport_events.length; matchCtr++) {
          let event = matchArray.sport_events[matchCtr];
          if (event.tournament.id === tIdFilter) {
            let dateTime = event.scheduled;
            let d = new Date(dateTime).getTime();
            d *= -1;
            promises.push(firebaseAdmin.database().ref(`/sportRadarStore/odds/sheets/${sheetName}`).update({
              [d]: event
            }));
          }
        }
      }

      //trim off outdated lines
      let trimPromise = firebaseAdmin.database().ref(`/sportRadarStore/odds/sheets/${sheetName}`).once('value')
        .then(result => {
          let allValue = result.val();

          let now = new Date();
          let deleteUpdates = {};
          for (let timeKey in allValue) {
            let keyDate = new Date(-1 * timeKey);

            if (keyDate < now)
              deleteUpdates[timeKey] = null;
          }

          return firebaseAdmin.database().ref(`/sportRadarStore/odds/sheets/${sheetName}`).update(deleteUpdates);
        });
      promises.push(trimPromise);
    }

    return Promise.all(promises);
  }
  static async processDailyOddsByMatchId(matchArray) {
    if (matchArray.sport && matchArray.sport_events) {
      let updates = {};
      for (let c = 0; c < matchArray.sport_events.length; c++) {
        let event = matchArray.sport_events[c];
        updates[event.id] = event;
      }

      return firebaseAdmin.database().ref(`/sportRadarStore/odds/matches/${matchArray.sport.name}/byId`).update(updates)
    }

    return Promise.resolve();
  }
  static async updateDailySportSchedule(sportId, date, oFetch) {
    if (!date)
      date = new Date();
    date = new Date(date);
    let d = date.toISOString().substring(0, 10);

    let data = {};
    return oFetch.SRAPI(`${oFetch.basePath}sports/sr:sport:${sportId}/${d}/schedule.json?api_key=${oFetch.privateConfig.sportRadarOddsKey}`)
      .then(oddsData => {
        data = oddsData;
        return this.processDailyOddsByMatchId(data);
      })
      .then(() => this.processOddsSheets(data, oFetch.privateConfig.oddsConfig.sheets, oFetch))
      .then(() => firebaseAdmin.database().ref(`/sportRadarStore/odds/dailyScheduleBySport/${sportId}/${d}`).update(data))
  }
  static async getDailyGames(sport, date10) {
    let path = `/sportRadarStore/${sport}/daily/${date10}/schedule/games`;
    let data = await firebaseAdmin.database().ref(path).once('value');
    let valData = data.val();
    let idList = [];
    if (!valData)
      valData = [];
    for (let c = 0, l = valData.length; c < l; c++)
      idList.push(valData[c].id);
    return Promise.resolve(idList);
  }
  static updateOddsPerformance(req, res) {
    let oddsFetch = new OddsFetch();
    return oddsFetch.initOdds()
      .then(() => SportRadarOdds._updateOddsPerformance(req.query.sportkey, req.query.oddskey,
        req.query.date, req.query.dateoffset, oddsFetch))
      .then(results => res.status(200).send('{ "success": true }'))
      .catch(e => {
        res.status(500).send(e);
        console.log(e);
      });
  }
  static async _updateOddsPerformance(sportKey, oddsKey, idate, dateOffset, oFetch) {
    let date = !idate ? new Date() : new Date(idate);
    let daysAhead = 0;
    if (dateOffset !== undefined)
      if (dateOffset !== '')
        daysAhead = Number(dateOffset);

    let fetchGameLists = [];
    let sports = oFetch.privateConfig.oddsConfig.sports;
    let offsetDate = Number(date) + (daysAhead * 1000 * 24 * 3600);
    let dateStr = new Date(offsetDate).toISOString();
    let date10 = dateStr.substr(0, 4) + '/' + dateStr.substr(5, 2) + '/' + dateStr.substr(8, 2);

    let idList = await SportRadarOdds.getDailyGames(sportKey, date10);
    let updates = [];
    for (let d = 0, dl = idList.length; d < dl; d++)
      updates.push(SportRadarOdds.__updateOddsPerformanceForGame(idList[d], sportKey, oddsKey, oFetch));

    return Promise.all(updates);
  }
  static async __updateOddsPerformanceForGame(SRid, sportKey, oddsKey, oFetch) {
    let path = `sportRadarStore/odds/mappings/sport_events/id_mappings/byStatId/${SRid}`;
    let data = await firebaseAdmin.database().ref(path).once('value');
    let oddsId = data.val();

    let oddsPath = `sportRadarStore/odds/matches/${oddsKey}/byId/${oddsId}`;
    let statsPath = `sportRadarStore/${sportKey}/games/${SRid}`;
    let oddsData = await firebaseAdmin.database().ref(oddsPath).once('value');
    let statsData = await firebaseAdmin.database().ref(statsPath).once('value');
    oddsData = oddsData.val();
    statsData = statsData.val();

    let sportSpecificMixin = {};
    let finished = false;
    let scheduled = false;
    let seasonId = '';

    if (sportKey === 'mlb') {
      let status = OddsFetch.path(statsData, 'boxscore.game.status');
      let away = OddsFetch.path(statsData, 'boxscore.game.away');
      let home = OddsFetch.path(statsData, 'boxscore.game.home');
      scheduled = OddsFetch.path(statsData, 'summary.game.scheduled');
      let lines = OddsFetch.path(oddsData, 'consensus.lines');
      seasonId = OddsFetch.path(oddsData, 'season.id');

      if (status === 'closed') {
        finished = true;

        if (home) {
          sportSpecificMixin['homeTeam'] = home.abbr;
          sportSpecificMixin['homeScore'] = home.runs;
        }
        if (away) {
          sportSpecificMixin['awayTeam'] = away.abbr;
          sportSpecificMixin['awayScore'] = away.runs;
        }

        if (finished) {
          sportSpecificMixin['awayMargin'] = sportSpecificMixin['awayScore'] - sportSpecificMixin['homeScore'];
          sportSpecificMixin['homeMargin'] = sportSpecificMixin['homeScore'] - sportSpecificMixin['awayScore'];
          let result = 'unknown';
          if (sportSpecificMixin['awayMargin'] === 0)
            result = 'tie';
          if (sportSpecificMixin['awayMargin'] > 0)
            result = 'away';
          if (sportSpecificMixin['awayMargin'] < 0)
            result = 'home';
          sportSpecificMixin['straightResult'] = result;
        }
      }

      if (lines) {
        let outcome = null;
        for (let c = 0, l = lines.length; c < l; c++) {
          if (lines[c].name === 'run_line_current') {
            let spread = lines[c].spread;

            if (spread === 0) {
              sportSpecificMixin['homeSpread'] = 0;
              sportSpecificMixin['awaySpread'] = 0;
            }

            if (lines[c].outcomes) {
              let home = false;

              if (lines[c].outcomes[0].type === 'home')
                if (lines[c].outcomes[0].odds < 0)
                  home = true;

              if (lines[c].outcomes[1].type === 'home')
                if (lines[c].outcomes[1].odds < 0)
                  home = true;

              if (home) {
                sportSpecificMixin['homeSpread'] = -1 * spread;
                sportSpecificMixin['awaySpread'] = spread;
              }
              if (away) {
                sportSpecificMixin['homeSpread'] = spread;
                sportSpecificMixin['awaySpread'] = -1 * spread;
              }

              if (finished) {
                sportSpecificMixin['awayCoverPoints'] = sportSpecificMixin['awayMargin'] + sportSpecificMixin['awaySpread'];
                sportSpecificMixin['homeCoverPoints'] = sportSpecificMixin['homeMargin'] + sportSpecificMixin['homeSpread'];

                sportSpecificMixin['awayCovered'] = 'T';
                if (sportSpecificMixin['awayCoverPoints'] > 0)
                  sportSpecificMixin['awayCovered'] = 'Y';
                if (sportSpecificMixin['awayCoverPoints'] < 0)
                  sportSpecificMixin['awayCovered'] = 'N';

                sportSpecificMixin['homeCovered'] = 'T';
                if (sportSpecificMixin['homeCoverPoints'] > 0)
                  sportSpecificMixin['homeCovered'] = 'Y';
                if (sportSpecificMixin['homeCoverPoints'] < 0)
                  sportSpecificMixin['homeCovered'] = 'N';
              }
            }
          }

          if (lines[c].name === 'total_current') {
            let total = lines[c].total;
            sportSpecificMixin['totalSpread'] = total;
          }

          if (lines[c].name === 'moneyline_current') {
            let homeMoneyLine = '';
            let awayMoneyLine = '';
            try {
              let line1 = lines[c].outcomes[0];
              let line2 = lines[c].outcomes[1];

              if (line1.type === 'home') {
                sportSpecificMixin['homeMoneyLine'] = Number(line1.odds);
                sportSpecificMixin['awayMoneyLine'] = Number(line2.odds);
              } else {
                sportSpecificMixin['awayMoneyLine'] = Number(line1.odds);
                sportSpecificMixin['homeMoneyLine'] = Number(line2.odds);
              }
            } catch(e) {
              //should be temporary error
            }
          }
        }
      }
    }

    let mergedMatch = {
      SRid,
      sportKey,
      oddsKey,
      oddsId,
      oddsData,
      statsData,
      finished,
      scheduled,
      seasonId
    };

    Object.assign(mergedMatch, sportSpecificMixin);

    return firebaseAdmin.database().ref(`/sportRadarStore/oddsPerformance/${sportKey}/matches`).update({
      [SRid]: mergedMatch
    });
  }
  static updateATSHistory(req, res) {
    let oddsFetch = new OddsFetch();
    return oddsFetch.initOdds()
      .then(() => SportRadarOdds._updateATSHistory(req.query.sportkey, oddsFetch))
      .then(results => res.status(200).send('{ "success": true }'))
      .catch(e => {
        res.status(500).send(e);
        console.log(e);
      });
  }
  static async _getUniqueTeamList(sportKey, oFetch) {
    let first100 = await firebaseAdmin.database().ref(`/sportRadarStore/oddsPerformance/${sportKey}/matches`)
      .orderByChild('scheduled')
      .limitToFirst(50)
      .once('value')

    first100 = first100.val();
    let teams = {};
    for (let key in first100) {
      if (first100[key].homeTeam)
        teams[first100[key].homeTeam] = true;
      if (first100[key].awayTeam)
        teams[first100[key].awayTeam] = true;
    }

    let teamsList = Object.keys(teams);

    return Promise.resolve(teamsList);
  }
  static async _updateATSForTeam(sportKey, teamKey, oFetch) {
    let homeWins = await firebaseAdmin.database().ref(`/sportRadarStore/oddsPerformance/${sportKey}/matches`)
      .orderByChild('homeTeam')
      .equalTo(teamKey)
      .limitToFirst(200)
      .once('value');
    let awayWins = await firebaseAdmin.database().ref(`/sportRadarStore/oddsPerformance/${sportKey}/matches`)
      .orderByChild('awayTeam')
      .equalTo(teamKey)
      .limitToFirst(200)
      .once('value');
    let homeResults = homeWins.val();
    let awayResults = awayWins.val();

    let teamGameHistory = {
      games: 0,
      wins: 0,
      losses: 0,
      ties: 0,
      covers: 0,
      noCovers: 0,
      pushes: 0,
      favored: 0,
      dogs: 0,
      overs: 0,
      moneyLine: 0,
      homeGames: 0,
      homeWins: 0,
      homeLosses: 0,
      homeTies: 0,
      homeCovers: 0,
      homeNoCovers: 0,
      homePushes: 0,
      homeFavored: 0,
      homeDogs: 0,
      homeOvers: 0,
      homeMoneyLine: 0,
      awayGames: 0,
      awayWins: 0,
      awayLosses: 0,
      awayTies: 0,
      awayCovers: 0,
      awayNoCovers: 0,
      awayPushes: 0,
      awayFavored: 0,
      awayDogs: 0,
      awayOvers: 0,
      awayMoneyLine: 0
    };

    let seasonId = oFetch.privateConfig.oddsConfig.mlbSeasonId;

    for (let homeId in homeResults) {
      let rec = homeResults[homeId];

      if (!rec.finished)
        continue;

      if (rec.seasonId !== seasonId)
        continue;

      teamGameHistory.games++;
      teamGameHistory.homeGames++;
      teamGameHistory.moneyLine += isNaN(rec.homeMoneyLine) ? 0 : rec.homeMoneyLine;
      teamGameHistory.homeMoneyLine += isNaN(rec.homeMoneyLine) ? 0 : rec.homeMoneyLine;

      let overs = rec.totalSpread;
      let total = rec.awayScore + rec.homeScore;
      if (total > overs) {
        teamGameHistory.homeOvers++;
        teamGameHistory.overs++;
      }

      let favored = (rec.homeSpread > 0);
      if (rec.straightResult === 'home') {
        teamGameHistory.homeWins++;
        teamGameHistory.wins++;
      }
      if (rec.straightResult === 'tie') {
        teamGameHistory.homeTies++;
        teamGameHistory.ties++;
      }
      if (rec.straightResult === 'away') {
        teamGameHistory.homeLosses++;
        teamGameHistory.losses++;
      }
      if (rec.homeCovered === 'Y') {
        teamGameHistory.homeCovers++;
        teamGameHistory.covers++;
        if (favored) {
          teamGameHistory.homeFavored++;
          teamGameHistory.favored++;
        }
      }
      if (rec.homeCovered === 'N') {
        teamGameHistory.homeNoCovers++;
        teamGameHistory.noCovers++;
        if (!favored) {
          teamGameHistory.homeDogs++;
          teamGameHistory.dogs++;
        }
      }
      if (rec.homeCovered === 'T') {
        teamGameHistory.homePushes++;
        teamGameHistory.pushes++;
      }
    }

    for (let awayId in awayResults) {
      let rec = awayResults[awayId];

      if (!rec.finished)
        continue;

      if (rec.seasonId !== seasonId)
        continue;

      teamGameHistory.games++;
      teamGameHistory.awayGames++;
      teamGameHistory.moneyLine += isNaN(rec.awayMoneyLine) ? 0 : rec.awayMoneyLine;
      teamGameHistory.awayMoneyLine += isNaN(rec.awayMoneyLine) ? 0 : rec.awayMoneyLine;

      let overs = rec.totalSpread;
      let total = rec.awayScore + rec.homeScore;
      if (total > overs) {
        teamGameHistory.awayOvers++;
        teamGameHistory.overs++;
      }

      let favored = (rec.awaySpread > 0);
      if (rec.straightResult === 'away') {
        teamGameHistory.awayWins++;
        teamGameHistory.wins++;
      }
      if (rec.straightResult === 'tie') {
        teamGameHistory.awayTies++;
        teamGameHistory.ties++;
      }
      if (rec.straightResult === 'home') {
        teamGameHistory.awayLosses++;
        teamGameHistory.losses++;
      }
      if (rec.awayCovered === 'Y') {
        teamGameHistory.awayCovers++;
        teamGameHistory.covers++;
        if (favored) {
          teamGameHistory.homeFavored++;
          teamGameHistory.favored++;
        }
      }
      if (rec.awayCovered === 'N') {
        teamGameHistory.awayNoCovers++;
        teamGameHistory.noCovers++;
        if (!favored) {
          teamGameHistory.awayDogs++;
          teamGameHistory.dogs++;
        }
      }
      if (rec.awayCovered === 'T') {
        teamGameHistory.awayPushes++;
        teamGameHistory.pushes++;
      }
    }
    return firebaseAdmin.database().ref(`/sportRadarStore/oddsPerformance/${sportKey}/teams/`).update({
      [teamKey]: teamGameHistory
    });
  }
  static async _updateATSHistory(sportKey, oFetch) {
    let teamsList = await SportRadarOdds._getUniqueTeamList(sportKey, oFetch);
    let promises = [];
    let tIndex = oFetch.privateConfig[sportKey + 'NextTeamIndex'];
    if (!tIndex)
      tIndex = 0;
    if (tIndex >= teamsList.length)
      tIndex = 0;

    if (teamsList[tIndex])
      await SportRadarOdds._updateATSForTeam(sportKey, teamsList[tIndex], oFetch);

    tIndex++;
    return firebaseAdmin.database().ref(`/privateConfig/`).update({
        [sportKey + 'NextTeamIndex']: tIndex
      });
  }
  static async updateSportsByCategory() {
    let oddsFetch = new OddsFetch();
    await oddsFetch.initOdds();

    return oddsFetch.getSportList(oddsFetch)
      .then(() => {
        let promises = [];
        if (oddsFetch.sportsList)
          for (let c = 0, l = oddsFetch.sportsList.length; c < l; c++)
            promises.push(this.__updateSportsCategory(oddsFetch.sportsList[c].id, oddsFetch));
        return Promise.all(promises);
      });
  }
  static async __updateSportsCategory(fullId, oFetch) {
    let parts = fullId.split(':');
    let id = parts.join('-');
    return oFetch.SRAPI(`${oFetch.basePath}sports/${fullId}/categories.json?api_key=${oFetch.privateConfig.sportRadarOddsKey}`)
      .then(data => {
        return firebaseAdmin.database().ref(`/sportRadarStore/odds/mappings/sportCategories`).update({
          [id]: data
        });
      });
  }
  static async __updateCategoryRights(fullId, oFetch) {
    let parts = fullId.split(':');
    let id = parts.join('-');
    return oFetch.SRAPI(`${oFetch.basePath}categories/${fullId}/outrights.json?api_key=${oFetch.privateConfig.sportRadarOddsKey}`)
      .then(data => {
        return firebaseAdmin.database().ref(`/sportRadarStore/odds/mappings/categoryRights`).update({
          [id]: data
        });
      });
  }
  static async categoryOutRights(oFetch) {
    return oFetch.getCategoryList()
      .then(() => {
        let promises = [];

        if (oFetch.categoryList)
          for (let c = 0, l = oFetch.categoryList.length; c < l; c++)
            promises.push(this.__updateCategoryRights(oFetch.categoryList[c].id));
        return Promise.all(promises);
      });
  }
  static updateMapping(req, res) {
    let mappingToUpdate = req.query.mapping;
    let oddsFetch = new OddsFetch();
    return oddsFetch.initOdds()
      .then(() => oddsFetch.__updateMapping(mappingToUpdate))
      .then(results => res.status(200).send('{ "success": true }'))
      .catch(e => {
        res.status(500).send(e);
        console.log(e);
      });
  }
  static updateODDSchedule(req, res) {
    let oddsFetch = new OddsFetch();
    return oddsFetch.initOdds()
      .then(() => this.updateDailySportSchedule(req.query.sportid, req.query.date, oddsFetch))
      .then(results => res.status(200).send('{ "success": true }'))
      .catch(e => {
        res.status(500).send(e);
        console.log(e);
      });
  }
  static updateOdds(req, res) {
    let oddsFetch = new OddsFetch();
    return oddsFetch.initOdds()
      .then(() => SportRadarOdds.__updateOdds(req.query.date, oddsFetch))
      .then(results => res.status(200).send('{ "success": true }'))
      .catch(e => {
        res.status(500).send(e);
        console.log(e);
      });
  }
  static updateTournaments(req, res) {
    let oddsFetch = new OddsFetch();
    return oddsFetch.initOdds()
      .then(() => this.updateTournaments())
      .then(results => res.status(200).send('{ "success": true }'))
      .catch(e => {
        res.status(500).send(e);
        console.log(e);
      });
  }
  static updateTournamentsBySport(req, res) {
    let oddsFetch = new OddsFetch();
    return oddsFetch.initOdds()
      .then(() => this.updateTournamentsBySport(req.query.sportid))
      .then(results => res.status(200).send('{ "success": true }'))
      .catch(e => {
        res.status(500).send(e);
        console.log(e);
      });
  }
  static updateCategoryRights(req, res) {
    let oddsFetch = new OddsFetch();
    return oddsFetch.initOdds()
      .then(() => this.categoryOutRights(oddsFetch))
      .then(results => res.status(200).send('{ "success": true }'))
      .catch(e => {
        res.status(500).send(e);
        console.log(e);
      });
  }
}

module.exports = SportRadarOdds;
