const firebaseAdmin = require('firebase-admin');
const AppConfig = require('../../../services/appconfig.js');
const appDBConfig = new AppConfig();
const SportRadarBase = require('./sportradarbase');
const SportRadarMLBGame = require('./sportradarmlbgame')
const http = require('http');
const request = require('request');

//GET  Daily Change Log mlb/trial/v6.5/en/league/:year/:month/:day/changes:format

/*

-playoffs
GET  Series Schedule mlb/trial/v6.5/en/series/:year/:mlb_season/schedule:format
GET  Series Statistics mlb/trial/v6.5/en/series/:series_id/teams/:team_id/statistics:format
GET  Series Summary mlb/trial/v6.5/en/series/:series_id/summary:format
*/

module.exports = class SportRadarMLB extends SportRadarBase {
  constructor() {
    super();
    this.basePath = 'http://api.sportradar.us/mlb/trial/v6.5/en/';
    this.mlbSeasons = ['REG', 'PST', 'PRE']; // 'PST', 'PRE' isn't liked right now
  }
  udpateDailyData(date) {
    return appDBConfig.getConfig(true)
      .then(config => {
        this.appConfig = appDBConfig.appConfig;
        this.privateConfig = appDBConfig.privateConfig;
        this.dailyData = {};
        this.mlbGame = new SportRadarMLBGame();
        date = !date ? new Date() : new Date(date);

        return date.setTime(date.getTime() - (7*60*60*1000));
      })
      .then(() => this._fetchDailyData(date, 'schedule', 'games'))
      .then(() => this._fetchDailyData(date, 'boxscore', 'games'))
      .then(() => this._fetchDailyData(date, 'summary', 'games'))
      .then(() => this._fetchDailyData(date, 'transactions', 'league'))
      .then(() => this.mlbGame.updateGamesForSchedule(this.dailyData['schedule']));
  }
  udpateDailyBoxScore(date) {
    return appDBConfig.getConfig(true)
      .then(config => {
        this.appConfig = appDBConfig.appConfig;
        this.privateConfig = appDBConfig.privateConfig;
        this.dailyData = {};
        return date = !date ? new Date() : new Date(date);
      })
      .then(() => this._fetchDailyData(date, 'boxscore', 'games'));
  }
  _fetchDailyData(date, tag, rootTag) {
    let date10 = this.__date10(date);
    return this.SRAPI(`${this.basePath}${rootTag}/${date10}/${tag}.json?api_key=${this.privateConfig.sportRadarMLB65Key}`)
      .then(result => {
        this.dailyData[tag] = result;
        return result;
      })
      .then(data => firebaseAdmin.database().ref(`/sportRadarStore/mlb/daily/${date10}/${tag}`).update(data));
  }
  __date10(date) {
    date = new Date(date);
    let dateStr = date.toISOString();
    return dateStr.substr(0, 4) + '/' + dateStr.substr(5, 2) + '/' + dateStr.substr(8, 2);
  }
  updateMLBYearData(year, tag) {
    let promises = [];
    return appDBConfig.getConfig(true)
      .then(config => {
        this.appConfig = appDBConfig.appConfig;
        this.privateConfig = appDBConfig.privateConfig;
        this.SRKey = this.privateConfig.sportRadarMLB65Key;
        return this._updateMLBData(year, tag);
      })
      .then(promises => Promise.all(promises));
  }
  _updateMLBData(year, tag) {
    return this.mlbSeasons.map((season, i) => {
      let apiQuery = '';
      if (tag === 'schedule')
        apiQuery = `${this.basePath}games/${year}/${season}/${tag}.json?api_key=${this.SRKey}`;
      else if (tag === 'rankings')
        apiQuery = `${this.basePath}seasontd/${year}/${season}/${tag}.json?api_key=${this.SRKey}`;
      else if (tag === 'statistics')
        apiQuery = `${this.basePath}seasons/${year}/${season}/leaders/${tag}.json?api_key=${this.SRKey}`;
      else if (tag === 'standings')
        apiQuery = `${this.basePath}seasons/${year}/${season}/${tag}.json?api_key=${this.SRKey}`;
      else if (tag === 'transactions')
        apiQuery = `${this.basePath}league/${year}/${tag}.json?api_key=${this.SRKey}`;
      else if (tag === 'injuries')
        apiQuery = `${this.basePath}league/${tag}.json?api_key=${this.SRKey}`;

      return this.SRAPI(apiQuery)
        .then(data => firebaseAdmin.database().ref(`/sportRadarStore/mlb/${year}/${season}/${tag}`).update(data));
    });
  }
  fetchPlayerData(playerId, ptype) {
    let queryKey = 'profile';
    let outKey = 'playerProfile';
    if (ptype === 'pitching') {
      queryKey = 'pitch_metrics';
      outKey = 'playerPitching';
    }
    return appDBConfig.getConfig(true)
      .then(config => {
        this.appConfig = appDBConfig.appConfig;
        this.privateConfig = appDBConfig.privateConfig;
        this.SRKey = this.privateConfig.sportRadarMLB65Key;
        this.profileQuery = `${this.basePath}players/${playerId}/${queryKey}.json?api_key=${this.SRKey}`;
        return {};
      })
      .then(() => this.fetchCacheData('mlb', outKey, playerId, this.profileQuery));
  }
  fetchTeamSeasonData(teamId, year, season, dataType) {
    let outKey = `teamSplits/${year}/${season}`;
    let queryKey = 'splits';
    if (dataType === 'statistics') {
      outKey = `teamStatistics/${year}/${season}`;
      queryKey = 'statistics';
    }
    return appDBConfig.getConfig(true)
      .then(config => {
        this.appConfig = appDBConfig.appConfig;
        this.privateConfig = appDBConfig.privateConfig;
        this.SRKey = this.privateConfig.sportRadarMLB65Key;
        this.profileQuery = `${this.basePath}seasons/${year}/${season}/teams/${teamId}/${queryKey}.json?api_key=${this.SRKey}`;
        return {};
      })
      .then(() => this.fetchCacheData('mlb', outKey, teamId, this.profileQuery));
  }
  fetchTeamData(teamId, dataType) {
    let queryKey = 'profile';
    let outKey = 'teamProfile';
    if (dataType === 'depth_chart') {
      queryKey = 'depth_chart';
      outKey = 'teamDepthChart';
    }

    return appDBConfig.getConfig(true)
      .then(config => {
        this.appConfig = appDBConfig.appConfig;
        this.privateConfig = appDBConfig.privateConfig;
        this.SRKey = this.privateConfig.sportRadarMLB65Key;
        this.profileQuery = `${this.basePath}teams/${teamId}/${queryKey}.json?api_key=${this.SRKey}`;
        return {};
      })
      .then(() => this.fetchCacheData('mlb', outKey, teamId, this.profileQuery));
  }
  handleBaseballPush(req, res) {
    if (req.query.type === 'linescore') {
      this.outPath = '/sportRadarStore/mlb/pushCache/linescore';
      this.feedPath = `http://api.sportradar.us/mlb/trial/stream/en/linescore/subscribe?api_key=`;
    }
    if (req.query.type === 'statistics') {
      this.outPath = '/sportRadarStore/mlb/pushCache/statistics';
      this.feedPath = `http://api.sportradar.us/mlb/trial/stream/en/statistics/subscribe?api_key=`;
    }
    if (req.query.type === 'events') {
      this.outPath = '/sportRadarStore/mlb/pushCache/events';
      this.feedPath = `http://api.sportradar.us/mlb/trial/stream/en/events/subscribe?api_key=`;
    }

    return appDBConfig.getConfig(true)
      .then(config => {
        this.appConfig = appDBConfig.appConfig;
        this.privateConfig = appDBConfig.privateConfig;
        this.dailyData = {};
        this.feedPath += `${this.privateConfig.sportRadarMLB65Key}`;

        return this.feedPath;
      })
      .then(path => this.__runPushFeed(path, this.outPath));
  }
  __runPushFeed(path, outPrefix) {
    return new Promise((resolve, reject) => {
      let cache = '';
      let ctr = 0;
      let validChunks = 0;
      request.get(path)
        .on('response', (response) => {
          response.on('data', (chunk) => {
            cache += chunk.toString('utf8');
            ctr++;
            let parsedJson = null;
            try {
              parsedJson = JSON.parse(cache);
            } catch (e) {
              parsedJson = null;
            }
            if (parsedJson || ctr > 4) { //reset after 4 attempts in case of messed up data
              cache = '';
              ctr = 0;

              if (parsedJson)
                if (parsedJson.payload)
                  if (parsedJson.payload) {
                    let id = parsedJson.payload.game.id;

                    validChunks++;
                    this.gameId = id;
                    this.payload = parsedJson.payload;
                    return firebaseAdmin.database().ref(`${outPrefix}`)
                      .update({
                        [(new Date()).getTime().toString()]: parsedJson
                      })
                      .then(rr => this.processReceivedPacket())
                      /*
                      .then(e => firebaseAdmin.database().ref(`sportRadarStore/mlb`)
                        .update({
                         pushCache: null
                        }))
*/
                      .then(() => {
                        return;
                      })
                      .catch(e => {
                        return;
                      })
                  }
            }


            return Promise.resolve({});
          });
        });
    });
  }
  processReceivedPacket() {
    if (!this.payload)
      return Promise.resolve({});
    let pathPairs = [];

    let gameId = this.payload.game.id;
    if (this.payload.boxscore) {

      return firebaseAdmin.database().ref(`/sportRadarStore/mlb/liveGame/boxscore`)
        .update({
          [gameId]: this.payload.boxscore
        })
        .then(rr => {
          return Promise.resolve({});
        })
        .catch(e => {
          return;
        });
    }
    if (this.payload.event) {
      return firebaseAdmin.database().ref(`/sportRadarStore/mlb/liveGame/events/${gameId}`)
        .update({
          [this.payload.event.id]: this.payload.event
        })
        .then(rr => {
          return Promise.resolve({});
        })
        .catch(e => {
          return;
        });
    }
    if (this.payload.player) {
      return firebaseAdmin.database().ref(`/sportRadarStore/mlb/liveGame/players/${gameId}`)
        .update({
          [this.payload.player.id]: this.payload.player
        })
        .then(rr => {
          return Promise.resolve({});
        })
        .catch(e => {
          return;
        });
    }

    if (this.payload.team) {
      return firebaseAdmin.database().ref(`/sportRadarStore/mlb/liveGame/teams/${gameId}`)
        .update({
          [this.payload.team.id]: this.payload.team
        })
        .then(rr => {
          return Promise.resolve({});
        })
        .catch(e => {
          return;
        });
    }

    return Promise.resolve({});
  }
};
