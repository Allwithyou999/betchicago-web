const firebaseAdmin = require('firebase-admin');
const AppConfig = require('../../../services/appconfig.js');
const appDBConfig = new AppConfig();
const SportRadarBase = require('./sportradarbase');

module.exports = class SportRadar extends SportRadarBase {
  updateTournament(tournamentId = "", golfYear = '') {
    this.updateCurrentTourneyID().then(r => {
        return firebaseAdmin.database().ref('applicationConfig').update({
          golfTournament: r
        });
      })
      .catch(e => {

      });

    return appDBConfig.getConfig(true)
      .then(config => {
        this.appConfig = appDBConfig.appConfig;
        this.privateConfig = appDBConfig.privateConfig;

        if (!tournamentId)
          tournamentId = this.appConfig.golfTournament.toString();
        this.golfTour = 'pga';

        this.golfYear = golfYear;
        if (!this.golfYear)
          this.golfYear = this.appConfig.golfYearPGA.toString();

        return;
      })
      .then(() => this._fetchTournament(this.golfTour, this.golfYear, tournamentId))
      .then(() => Promise.all([
        this.processPlayerResults(this.golfTour, this.golfYear, tournamentId),
        this.processPlayerTeeTimes(this.golfTour, this.golfYear, tournamentId),
        this.processLeaderboard(this.golfTour, this.golfYear, tournamentId)
      ]));
  }

  updateCurrentTourneyID() {
    return this.loadSchedule()
      .then(r => {
        return this.currentTourId;
      });
  }
  loadSchedule() {
    return firebaseAdmin.database().ref(`sportRadarStore/golf/pga/2019/skinnySchedule`).once('value')
      .then(
        schedule => this._processSchedule(schedule.val())
      );
  }

  _processSchedule(schedule) {
    this.rawSchedule = schedule;
    let tourId;
    let round = 1;

    if (!schedule) return Promise.resolve(null);

    if (!schedule.tournaments) return Promise.resolve(null);

    this.tournaments = schedule.tournaments;

    let curDate = new Date(new Date().toISOString().substr(0, 10));
    for (let c = 0, l = this.tournaments.length; c < l; c++) {
      let t = this.tournaments[c];
      let sd = new Date(t.start_date);
      let ed = new Date(new Date(t.end_date).getTime() + (3600000 * 48)); //add 2 days

      this.currentTourId = t.id;

      if (ed > curDate)
        break;
    }
console.log(this.currentTourId);

    return {};
  }

  updateLeaderboard(tournamentId = '', golfYear = '') {
    return appDBConfig.getConfig(true)
      .then(config => {
        this.appConfig = appDBConfig.appConfig;
        this.privateConfig = appDBConfig.privateConfig;

        if (!tournamentId)
          tournamentId = this.appConfig.golfTournament.toString();
        this.golfTour = 'pga';
        this.golfYear = golfYear;
        if (!this.golfYear)
          this.golfYear = this.appConfig.golfYearPGA.toString();

        return;
      })
      .then(() => this.createTournamentLeaderBoardFetch(this.golfTour, this.golfYear, tournamentId))
      .then(() => this.processLeaderboard(this.golfTour, this.golfYear, tournamentId));
  }
  processLeaderboard(golfTour, golfYear, tournamentId) {
    return firebaseAdmin.database().ref(`/sportRadarStore/golf/${golfTour}/${golfYear}/tournaments/${tournamentId}`).once('value')
      .then(result => {
        let tL = result.val();
        let lb;
        if (!tL)
          tL = {};
        lb = tL.leaderboard;
        if (lb)
          lb = lb.leaderboard;
        let skinnyLeaderboard = [];

        if (lb) {
          for (let c = 0, l = lb.length; c < l; c++) {
            let p = lb[c];
            let p_out = {
              first_name: p.first_name,
              last_name: p.last_name,
              id: p.id,
              points: p.points,
              position: p.position,
              score: p.score,
              strokes: p.strokes,
              tied: p.tied,
              money: p.money,
              rounds: {}
            };

            for (let i in p_out)
              if (p_out[i] === undefined)
                p_out[i] = null;

            for (let round = 0; round < 4; round++) {
              if (!p.rounds)
                continue;
              let rd = p.rounds[round.toString()];
              if (!rd)
                continue;

              p_out.rounds[round] = {
                score: rd.score,
                strokes: rd.strokes,
                thru: rd.thru
              }
            }

            skinnyLeaderboard.push(p_out);
          }
        }

        let summary = {};
        let s = tL.summary;
        let round_count = 0;
        if (s.rounds)
          round_count = s.rounds.length;
        summary = {
          end_date: s.end_date,
          start_date: s.start_date,
          status: s.status,
          venue: s.venue,
          name: s.name,
          round_count
        }
        for (let i in summary)
          if (summary[i] === undefined)
            summary[i] = null;

        let q = `/sportRadarStore/golf/${golfTour}/${golfYear}/tournaments/${tournamentId}`;
        return firebaseAdmin.database().ref(q).update({
          skinnyLeaderboard: {
            summary,
            players: skinnyLeaderboard
          }
        });
      });
  }
  processPlayerTeeTimes(golfTour, golfYear, tournamentId) {
    return firebaseAdmin.database().ref(`/sportRadarStore/golf/${golfTour}/${golfYear}/tournaments/${tournamentId}`).once('value')
      .then(result => {
        let teeTimeData = result.val();
        let promises = [];
        promises.concat(this._updatePlayerTeeTimes(golfTour, golfYear, teeTimeData, "1", tournamentId));
        promises.concat(this._updatePlayerTeeTimes(golfTour, golfYear, teeTimeData, "2", tournamentId));
        promises.concat(this._updatePlayerTeeTimes(golfTour, golfYear, teeTimeData, "3", tournamentId));
        promises.concat(this._updatePlayerTeeTimes(golfTour, golfYear, teeTimeData, "4", tournamentId));

        return Promise.all(promises);
      });
  }
  _updatePlayerTeeTimes(golfTour, golfYear, teeTimeData, round, tournamentId) {
    let promises = [];
    let pairings = [];
    try {
      pairings = teeTimeData.rounds[round].teetimes.round.courses[0].pairings;
    } catch (e) {
      return [];
    }

    if (!pairings)
      pairings = [];
    for (let pairingIndex = 0, l = pairings.length; pairingIndex < l; pairingIndex++) {
      let players = pairings[pairingIndex].players;
      if (!players)
        continue;
      for (let playerIndex = 0, dl = players.length; playerIndex < dl; playerIndex++) {
        if (!players[playerIndex])
          continue;
        let playerId = players[playerIndex].id;
        let q = `/sportRadarStore/golf/${golfTour}/${golfYear}/playerTournamentTeeTimes/${playerId}/${tournamentId}/${round}/teetimes`;
        promises.push(firebaseAdmin.database().ref(q).update(pairings[pairingIndex]));
      }
    }

    return promises;
  }
  processPlayerResults(golfTour, golfYear, tournamentId) {
    return firebaseAdmin.database().ref(`/sportRadarStore/golf/${golfTour}/${golfYear}/tournaments/${tournamentId}`).once('value')
      .then(result => {
        let outerData = result.val();
        let promises = [];
        if (outerData.rounds["1"].scores)
          promises.concat(this.__updatePlayerData(golfTour, golfYear, outerData.rounds["1"].scores.playersById, tournamentId, 1, "scores"));
        if (outerData.rounds["2"].scores)
          promises.concat(this.__updatePlayerData(golfTour, golfYear, outerData.rounds["2"].scores.playersById, tournamentId, 2, "scores"));
        if (outerData.rounds["3"].scores)
          promises.concat(this.__updatePlayerData(golfTour, golfYear, outerData.rounds["3"].scores.playersById, tournamentId, 3, "scores"));
        if (outerData.rounds["4"].scores)
          promises.concat(this.__updatePlayerData(golfTour, golfYear, outerData.rounds["4"].scores.playersById, tournamentId, 4, "scores"));

        return Promise.all(promises);
      });
  }
  __updatePlayerData(golfTour, golfYear, scores, tournamentId, round, dataType) {
    let subPromises = [];
    for (let playerId in scores) {
      let q = `/sportRadarStore/golf/${golfTour}/${golfYear}/playerTournamentResults/${playerId}/${tournamentId}/${round}/${dataType}`;
      subPromises.push(firebaseAdmin.database().ref(q).update(scores[playerId]));
    }
    return subPromises;
  }
  processPlayerSeasonTotalsNotUSED(golfTour, golfYear) {
    let playerProfiles = {};
    let playerResults = {};
    return firebaseAdmin.database().ref(`/sportRadarStore/golf/${golfTour}/${golfYear}/playerProfiles/playersById`).once('value')
      .then(data => {
        if (data)
          playerProfiles = data.val();
        return;
      })
      .then(() => firebaseAdmin.database().ref(`/sportRadarStore/golf/${golfTour}/${golfYear}/playerTournamentResults`).once('value'))
      .then(data2 => {
        if (data2)
          playerResults = data2.val();
        return;
      })
      .then(() => this.processSkinnyProfile(playerProfiles, playerResults))
      .then(results => firebaseAdmin.database().ref(`/sportRadarStore/golf/${golfTour}/${golfYear}/skinnyPlayerProfiles`).update(results));
  }
  isNumber(n) {
    return !isNaN(parseFloat(n)) && isFinite(n);
  }
  processSkinnyProfile(playerProfiles, playerTournamentResults) {
    let playerResults = {};
    let fieldsToSum = ['birdies', 'bogeys', 'double_bogeys', 'holes_in_one', 'pars', 'score', 'strokes'];
    for (let pId in playerProfiles) {
      let pd = Object.assign({}, playerProfiles[pId]);

      for (let cc = 0, cl = fieldsToSum.length; cc < cl; cc++)
        pd[fieldsToSum[cc]] = 0;
      if (playerTournamentResults) {
        let ts = playerTournamentResults[pId];
        for (let tid in ts)
          for (let round = 1; round <= 4; round++) {
            let rs = ts[tid][round.toString()];
            if (!rs)
              continue;
            rs = rs.scores;
            if (!rs)
              continue;
            for (let c = 0, l = fieldsToSum.length; c < l; c++) {
              try {
                let f = fieldsToSum[c];
                let v = rs[f];
                if (this.isNumber(v))
                  pd[fieldsToSum[c]] += v;
              } catch (e) {
                console.log('processSkinnyProfile sum value error', e);
              }
            }
          }
      }

      playerResults[pId] = pd;
    }

    return playerResults;
  }
  _fetchTournament(golfTour, golfYear, tournamentId) {
    return this.createTournamentSummaryFetch(golfTour, golfYear, tournamentId)
      .then(() => this.createTournamentLeaderBoardFetch(golfTour, golfYear, tournamentId))
      .then(() => this.createTournamentHoleStatsFetch(golfTour, golfYear, tournamentId))

      .then(() => this.createTournamentTeeTimesFetch(golfTour, golfYear, tournamentId, 1))
      .then(() => this.createTournamentTeeTimesFetch(golfTour, golfYear, tournamentId, 2))
      .then(() => this.createTournamentTeeTimesFetch(golfTour, golfYear, tournamentId, 3))
      .then(() => this.createTournamentTeeTimesFetch(golfTour, golfYear, tournamentId, 4))

      .then(() => this.createTournamentRoundScoresFetch(golfTour, golfYear, tournamentId, 1))
      .then(() => this.createTournamentRoundScoresFetch(golfTour, golfYear, tournamentId, 2))
      .then(() => this.createTournamentRoundScoresFetch(golfTour, golfYear, tournamentId, 3))
      .then(() => this.createTournamentRoundScoresFetch(golfTour, golfYear, tournamentId, 4));
  }
  createTournamentRoundScoresFetch(golfTour, golfYear, tournamentId, round) {
    return this.SRAPI(`http://api.sportradar.us/golf-p2/scorecards/${golfTour}/${golfYear}/tournaments/${tournamentId}/rounds/${round}/scores.json?api_key=${this.privateConfig.sportRadarGolfKey}`)
      .then(data => {
        let playersById = {};
        if (data.round)
          if (data.round.players)
            for (let c = 0, l = data.round.players.length; c < l; c++)
              playersById[data.round.players[c].id] = data.round.players[c];
        data.playersById = playersById;

        return firebaseAdmin.database().ref(`/sportRadarStore/golf/${golfTour}/${golfYear}/tournaments/${tournamentId}/rounds/${round}/scores`).update(data);
      });
  }
  createTournamentTeeTimesFetch(golfTour, golfYear, tournamentId, round) {
    return this.SRAPI(`http://api.sportradar.us/golf-p2/teetimes/${golfTour}/${golfYear}/tournaments/${tournamentId}/rounds/${round}/teetimes.json?api_key=${this.privateConfig.sportRadarGolfKey}`)
      .then(data => {
        return firebaseAdmin.database().ref(`/sportRadarStore/golf/${golfTour}/${golfYear}/tournaments/${tournamentId}/rounds/${round}/teetimes`).update(data);
      });
  }
  createTournamentHoleStatsFetch(golfTour, golfYear, tournamentId) {
    return this.SRAPI(`http://api.sportradar.us/golf-p2/leaderboard/${golfTour}/${golfYear}/tournaments/${tournamentId}/hole-statistics.json?api_key=${this.privateConfig.sportRadarGolfKey}`)
      .then(data => {
        return firebaseAdmin.database().ref(`/sportRadarStore/golf/${golfTour}/${golfYear}/tournaments/${tournamentId}/hole-statistics`).update(data);
      });
  }
  createTournamentLeaderBoardFetch(golfTour, golfYear, tournamentId) {
    return this.SRAPI(`http://api.sportradar.us/golf-p2/leaderboard/${golfTour}/${golfYear}/tournaments/${tournamentId}/leaderboard.json?api_key=${this.privateConfig.sportRadarGolfKey}`)
      .then(data => {
        let playersById = {};
        if (data.leaderboard)
          for (let c = 0, l = data.leaderboard.length; c < l; c++)
            playersById[data.leaderboard[c].id] = data.leaderboard[c];
        data.leaderboardById = playersById;

        return firebaseAdmin.database().ref(`/sportRadarStore/golf/${golfTour}/${golfYear}/tournaments/${tournamentId}/leaderboard`).update(data);
      });
  }
  createTournamentSummaryFetch(golfTour, golfYear, tournamentId) {
    return this.SRAPI(`http://api.sportradar.us/golf-p2/summary/${golfTour}/${golfYear}/tournaments/${tournamentId}/summary.json?api_key=${this.privateConfig.sportRadarGolfKey}`)
      .then(data => {
        let playersById = {};
        if (data.field)
          for (let c = 0, l = data.field.length; c < l; c++)
            playersById[data.field[c].id] = data.field[c];
        data.fieldById = playersById;

        return firebaseAdmin.database().ref(`/sportRadarStore/golf/${golfTour}/${golfYear}/tournaments/${tournamentId}/summary`).update(data);
      });
  }
};
