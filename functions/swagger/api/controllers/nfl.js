const firebaseAdmin = require('firebase-admin');
const AppConfig = require('../../../services/appconfig.js');
const appDBConfig = new AppConfig();
const SportRadarBase = require('./sportradarbase');
const http = require('http');
const request = require('request');

/*
GET  Daily Change Log nfl/official/trial/v5/:language_code/league/:year/:month/:day/changes:format


GET  Game Boxscore nfl/official/trial/v5/:language_code/games/:game_id/boxscore:format
GET  Game Roster nfl/official/trial/v5/:language_code/games/:game_id/roster:format
GET  Game Statistics nfl/official/trial/v5/:language_code/games/:game_id/statistics:format
GET  Play-By-Play nfl/official/trial/v5/:language_code/games/:game_id/pbp:format
GET  Player Participation nfl/official/trial/v5/:language_code/plays/:game_id/participation:format

*/
class SportRadarNFL extends SportRadarBase {
  constructor() {
    super();
    this.basePath = 'http://api.sportradar.us/nfl/official/trial/v5/en/';
  }
  updateSchedule(year, tag) {
    let promises = [];
    return appDBConfig.getConfig(true)
      .then(config => {
        this.appConfig = appDBConfig.appConfig;
        this.privateConfig = appDBConfig.privateConfig;
        this.SRKey = this.privateConfig.sportRadarNFLKey;

        let apiQuery = `${this.basePath}games/${year}/${tag}/schedule.json?api_key=${this.SRKey}`;

        return this.SRAPI(apiQuery)
      })
      .then(data => firebaseAdmin.database().ref(`/sportRadarStore/nfl/${year}/${tag}/schedule`).update(data));
  }
  _getCurrentWeek(year) {
    return firebaseAdmin.database().ref(`sportRadarStore/nfl/${year}/standings/week/sequence`).once('value')
      .then(result => result.val());
  }
  updateStandings(year) {
    let promises = [];
    return appDBConfig.getConfig(true)
      .then(config => {
        this.appConfig = appDBConfig.appConfig;
        this.privateConfig = appDBConfig.privateConfig;
        this.SRKey = this.privateConfig.sportRadarNFLKey;

        let apiQuery = `${this.basePath}seasons/${year}/standings.json?api_key=${this.SRKey}`;

        return this.SRAPI(apiQuery)
      })
      .then(data => firebaseAdmin.database().ref(`/sportRadarStore/nfl/${year}/standings`).update(data))
      .then(() => this._getCurrentWeek(year))
      .then(weekNum => this._updateNextWeekOnSchedule(weekNum, year));
  }
  _updateNextWeekOnSchedule(weekNum, year) {
    return firebaseAdmin.database().ref(`sportRadarStore/nfl/${year}/weekly/REG/${weekNum || 1}/schedule/week/games`).once('value')
      .then(result => {
        let weeklySchedule = result.val();
        let gameInfoByTeam = {};

        for (let i in weeklySchedule) {
          let awayTeam = weeklySchedule[i].away.alias;
          let homeTeam = weeklySchedule[i].home.alias
          gameInfoByTeam[awayTeam] = {
            home: false,
            opponent: homeTeam
          };
          gameInfoByTeam[homeTeam] = {
            home: true,
            opponent: awayTeam
          };
        }
        return gameInfoByTeam;
      })
      .then(upNext => firebaseAdmin.database().ref(`sportRadarStore/nfl/${year}/nextUp`).update(upNext));
  }
  __processPlayerStats(playerId) {
    let playerData;
    return firebaseAdmin.database().ref(`/sportRadarStore/nfl/playerProfiles/rawProfiles/${playerId}`).once('value')
      .then(result => {
        playerData = result.val();
        let flatPlayerData = null;
        if (!playerData)
          return null;
        if (playerData.seasons) {
          let d = playerData.seasons[playerData.seasons.length - 1];
          if (parseInt(d.year) === (new Date()).getFullYear() && d.type === 'REG') {
            if (d.teams[0])
              return d.teams[0].statistics;
          }
        }

        return null;
      })
      .then(data => {
        if (!data)
          return Promise.resolve();

        let offenseStats = this.__processPlayerFlatStats(data, true, playerData);
        let defenseStats = this.__processPlayerFlatStats(data, false, playerData);
        let playerId = playerData.id;

        return this.__updatePlayerStatData(playerData.id, offenseStats, defenseStats, data, (new Date()).getFullYear());
      });
  }
  __updatePlayerStatData(id, offense, defense, stats, year) {
    let updatePlayerProfile = firebaseAdmin.database().ref(`/sportRadarStore/nfl/${year}/playerStats/REG/${id}`).update(stats);
    let updatePlayerOffense = firebaseAdmin.database().ref(`/sportRadarStore/nfl/${year}/playerOffense/REG/${id}`).update(offense);
    let updatePlayerDefense = firebaseAdmin.database().ref(`/sportRadarStore/nfl/${year}/playerDefense/REG/${id}`).update(defense);

    return Promise.all([
      updatePlayerProfile,
      updatePlayerOffense,
      updatePlayerDefense
    ]);
  }
  __processPlayerFlatStats(rawStats, offense = true, rawPlayerData) {
    let stats = rawStats;
    let team = '';
    if (rawPlayerData.team)
      team = rawPlayerData.team.alias;
    let outStats = {
      name: rawPlayerData.name,
      last_name: rawPlayerData.last_name,
      first_name: rawPlayerData.first_name,
      position: rawPlayerData.position,
      sr_id: rawPlayerData.sr_id,
      id: rawPlayerData.id,
      team,
      abbr_name: rawPlayerData.abbr_name,
      games_played: stats.games_played,
      games_started: stats.games_started,
      rushing_yards: 0,
      receiving_yards: 0,
      passing_yards: 0,
      neg_rushing_yards: 0,
      neg_receiving_yards: 0,
      neg_passing_yards: 0
    };
    let sections = ['passing', 'rushing', 'touchdowns', 'field_goals', 'extra_points',
      'receiving', 'conversions', 'kick_returns', 'punt_returns'
    ];

    if (!offense)
      sections = ['defense', 'fumbles', 'penalties', 'int_returns'];

    for (let sCtr = 0, l = sections.length; sCtr < l; sCtr++) {
      let data = stats[sections[sCtr]];

      for (let dKey in data) {
        let key = sections[sCtr] + '_' + dKey;
        outStats[key] = data[dKey];
        try {
          outStats['neg_' + key] = -1 * outStats[key];
        } catch (e) {
          e;
        }
      }
    }

    return outStats;
  }
  processStats() {
    return Promise.all([
      // this.processStatsTeam(),
      // this.processStatsPlayer()
    ])
  }

  processStatsTeam() {
    return appDBConfig.getConfig(true)
      .then(config => {
        this.appConfig = appDBConfig.appConfig;
        this.privateConfig = appDBConfig.privateConfig;
        this.SRKey = this.privateConfig.sportRadarNFLKey;
        return {};
      })
      .then(() => firebaseAdmin.database().ref(`/sportRadarStore/nfl/teamProfiles`).once('value'))
      .then(result => {
        let teamStatsRaw = result.val();

        let teamFlatRecord = {};
        for (let teamId in teamStatsRaw) {
          let stats = teamStatsRaw[teamId].statistics.record;
          let outStats = {
            name: teamStatsRaw[teamId].statistics.name,
            market: teamStatsRaw[teamId].statistics.market,
            alias: teamStatsRaw[teamId].statistics.alias,
            id: teamStatsRaw[teamId].statistics.id
          };
          let sections = ['defense', 'passing', 'rushing', 'touchdowns', 'field_goals'];

          for (let sCtr = 0, l = sections.length; sCtr < l; sCtr++) {
            let data = stats[sections[sCtr]];

            for (let dKey in data) {
              let key = sections[sCtr] + '_' + dKey;
              outStats[key] = data[dKey];
            }
          }
          teamFlatRecord[teamId] = outStats;
        }
        return firebaseAdmin.database().ref(`/sportRadarStore/nfl`).update({
          'teamFlatStats': teamFlatRecord
        });
      });
  }
  processStatsPlayer() {
    return appDBConfig.getConfig(true)
      .then(config => {
        this.appConfig = appDBConfig.appConfig;
        this.privateConfig = appDBConfig.privateConfig;
        this.SRKey = this.privateConfig.sportRadarNFLKey;
        return {};
      })
      .then(() => firebaseAdmin.database().ref(`/sportRadarStore/nfl/playerProfiles/idList`).once('value'))
      .then(result => {
        let playerIDLookup = result.val();

        let playerIdArray = [];
        for (let i in playerIDLookup)
          playerIdArray.push(i);

        return playerIdArray;
      })
      .then(idsToUpdate => {
        let promises = [];
        for (let c = 0, l = idsToUpdate.length; c < l; c++){
          let sUpdate = this.__processPlayerStats(idsToUpdate[c]);
          promises.push(sUpdate);
        }

        return Promise.all(promises);
      });
  }
  updateStats(year, tag) {
    let promises = [];
    if (!year)
      year = (new Date()).getFullYear();
    if (!tag)
      tag = 'REG';
    return appDBConfig.getConfig(true)
      .then(config => {
        this.appConfig = appDBConfig.appConfig;
        this.privateConfig = appDBConfig.privateConfig;
        this.SRKey = this.privateConfig.sportRadarNFLKey;
        return {};
      })
      .then(() => this._fetchTeamList())
      .then(teamsById => {
        let promises = [];
        let ids = [];
        for (let id in teamsById)
          ids.push(id);

        for (let c = 0, l = ids.length; c < l; c++)
          promises.push(this._updateTeam(year, tag, ids[c]));

        return Promise.all(promises);
      });
  }
  updatePlayerPage(skip, pageSize) {
    return firebaseAdmin.database().ref(`/sportRadarStore/nfl/playerProfiles/idList`).once('value')
      .then(result => {
        let playerIDLookup = result.val();

        let playerIdArray = [];
        for (let i in playerIDLookup)
          playerIdArray.push(i);

        if (!skip)
          skip = 0;
        else
          skip = Number(skip);

        if (!pageSize)
          pageSize = 20;
        else
          pageSize = Number(pageSize);

        return playerIdArray.slice(skip, skip + pageSize);
      })
      .then(idsToUpdate => {
        let promises = [];
        for (let c = 0, l = idsToUpdate.length; c < l; c++)
          promises.push(this.updatePlayerProfile(idsToUpdate[c]));
        console.log(idsToUpdate);
        return Promise.all(promises);
      });
  }
  updatePlayerProfile(playerId) {
    let promises = [];
    return appDBConfig.getConfig(true)
      .then(config => {
        this.appConfig = appDBConfig.appConfig;
        this.privateConfig = appDBConfig.privateConfig;
        this.SRKey = this.privateConfig.sportRadarNFLKey;

        let apiQuery = `${this.basePath}players/${playerId}/profile.json?api_key=${this.SRKey}`;

        return this.SRAPI(apiQuery)
      })
      .then(data => firebaseAdmin.database().ref(`/sportRadarStore/nfl/playerProfiles/rawProfiles/${playerId}`).update(data));
  }
  _fetchTeamList() {
    return firebaseAdmin.database().ref('/sportRadarStore/nfl/leaguehierarchy/teamsById').once('value')
      .then(result => result.val());
  }
  _updateTeam(year, season, teamid) {
    let teamProfileQ = `${this.basePath}teams/${teamid}/profile.json?api_key=${this.SRKey}`;
    let teamRosterQ = `${this.basePath}teams/${teamid}/full_roster.json?api_key=${this.SRKey}`;
    let teamStatisticsQ = `${this.basePath}seasons/${year}/${season}/teams/${teamid}/statistics.json?api_key=${this.SRKey}`;

    //    GET  Seasonal Statistics nfl/official/trial/v5/:language_code/seasons/:year/:nfl_season/teams/:team_id/statistics:format

    return Promise.all([
        this.SRAPI(teamProfileQ),
        this.SRAPI(teamRosterQ),
        this.SRAPI(teamStatisticsQ)
      ])
      .then(results => {
        let profile = results[0];
        let roster = results[1];
        let statistics = results[2];
        let playerUpdates = {};

        for (let c = 0, l = roster.players.length; c < l; c++)
          playerUpdates[roster.players[c].id] = true;

        return Promise.all([
          firebaseAdmin.database().ref(`/sportRadarStore/nfl/teamProfiles/${teamid}`).update({
            profile,
            roster,
            statistics
          }),
          firebaseAdmin.database().ref(`/sportRadarStore/nfl/playerProfiles/idList`).update(playerUpdates)
        ])
      })
  }
  updateWeek(year, tag, week) {
    return Promise.all([
      this._updateWeekySchedule(year, tag, week),
      this._updateWeekyInjuries(year, tag, week),
      this._updateWeekyDepthCharts(year, tag, week)
    ]);
  }
  _updateWeekySchedule(year, tag, week) {
    return appDBConfig.getConfig(true)
      .then(config => {
        this.appConfig = appDBConfig.appConfig;
        this.privateConfig = appDBConfig.privateConfig;
        this.SRKey = this.privateConfig.sportRadarNFLKey;
        return this.SRAPI(`${this.basePath}games/${year}/${tag}/${week}/schedule.json?api_key=${this.SRKey}`)
      })
      .then(data => firebaseAdmin.database().ref(`/sportRadarStore/nfl/${year}/weekly/${tag}/${week}/schedule`).update(data));
  }
  _updateWeekyInjuries(year, tag, week) {
    return appDBConfig.getConfig(true)
      .then(config => {
        this.appConfig = appDBConfig.appConfig;
        this.privateConfig = appDBConfig.privateConfig;
        this.SRKey = this.privateConfig.sportRadarNFLKey;
        return this.SRAPI(`${this.basePath}seasons/${year}/${tag}/${week}/injuries.json?api_key=${this.SRKey}`)
      })
      .then(data => firebaseAdmin.database().ref(`/sportRadarStore/nfl/${year}/weekly/${tag}/${week}/injuries`).update(data));
  }
  _updateWeekyDepthCharts(year, tag, week) {
    return appDBConfig.getConfig(true)
      .then(config => {
        this.appConfig = appDBConfig.appConfig;
        this.privateConfig = appDBConfig.privateConfig;
        this.SRKey = this.privateConfig.sportRadarNFLKey;
        return this.SRAPI(`${this.basePath}seasons/${year}/${tag}/${week}/depth_charts.json?api_key=${this.SRKey}`)
      })
      .then(data => firebaseAdmin.database().ref(`/sportRadarStore/nfl/${year}/weekly/${tag}/${week}/depthcharts`).update(data));
  }
  updateLeagueHierarchy() {
    return appDBConfig.getConfig(true)
      .then(config => {
        this.appConfig = appDBConfig.appConfig;
        this.privateConfig = appDBConfig.privateConfig;
        this.SRKey = this.privateConfig.sportRadarNFLKey;
        return this.SRAPI(`${this.basePath}league/hierarchy.json?api_key=${this.SRKey}`)
      })
      .then(result => this._processTeamsList(result))
      .then(data => firebaseAdmin.database().ref(`/sportRadarStore/nfl/leaguehierarchy`).update(data));
  }
  _processTeamsList(data) {
    let teams = [];
    teams = teams.concat(data.conferences[0].divisions[0].teams);
    teams = teams.concat(data.conferences[0].divisions[1].teams);
    teams = teams.concat(data.conferences[0].divisions[2].teams);
    teams = teams.concat(data.conferences[0].divisions[3].teams);
    teams = teams.concat(data.conferences[1].divisions[0].teams);
    teams = teams.concat(data.conferences[1].divisions[1].teams);
    teams = teams.concat(data.conferences[1].divisions[2].teams);
    teams = teams.concat(data.conferences[1].divisions[3].teams);

    let teamsById = {};
    for (let c = 0, l = teams.length; c < l; c++)
      teamsById[teams[c].id] = teams[c];

    data.teamsById = teamsById;
    data.teams = teams;
    return Promise.resolve(data);
  }
}

module.exports = {};
module.exports.updateSchedule = (req, res) => {
  let obj = new SportRadarNFL();
  return obj.updateSchedule(req.query.year || (new Date()).getFullYear(), req.query.tag)
    .then(results => res.status(200).send('{ "success": true }'))
    .catch(e => {
      res.status(500).send(e);
      console.log(e);
    });
};

module.exports.updateStandings = (req, res) => {
  let obj = new SportRadarNFL();
  return obj.updateStandings(req.query.year || (new Date()).getFullYear())
    .then(results => res.status(200).send('{ "success": true }'))
    .catch(e => {
      res.status(500).send(e);
      console.log(e);
    });
};

module.exports.updateWeekly = (req, res) => {
  let obj = new SportRadarNFL();
  return obj.updateWeek(req.query.year || (new Date()).getFullYear(), req.query.tag, req.query.week)
    .then(results => res.status(200).send('{ "success": true }'))
    .catch(e => {
      res.status(500).send(e);
      console.log(e);
    });
};

module.exports.updateLeagueHierarchy = (req, res) => {
  let obj = new SportRadarNFL();
  return obj.updateLeagueHierarchy()
    .then(results => res.status(200).send('{ "success": true }'))
    .catch(e => {
      res.status(500).send(e);
      console.log(JSON.stringify(e));
    });
};

module.exports.updatePlayerProfile = (req, res) => {
  let obj = new SportRadarNFL();
  return obj.updatePlayerProfile(req.query.playerid)
    .then(results => res.status(200).send('{ "success": true }'))
    .catch(e => {
      res.status(500).send(e);
      console.log(JSON.stringify(e));
    });
};

module.exports.updatePlayerPage = (req, res) => {
  let obj = new SportRadarNFL();
  return obj.updatePlayerPage(req.query.skip, req.query.pagesize)
    .then(results => res.status(200).send('{ "success": true }'))
    .catch(e => {
      res.status(500).send(e);
      console.log(JSON.stringify(e));
    });
};

module.exports.updateStats = (req, res) => {
  let obj = new SportRadarNFL();
  return obj.updateStats()
    .then(results => res.status(200).send('{ "success": true }'))
    .catch(e => {
      res.status(500).send(e);
      console.log(JSON.stringify(e));
    });
};

module.exports.processStats = (req, res) => {
  let obj = new SportRadarNFL();
  return obj.processStats()
    .then(results => res.status(200).send('{ "success": true }'))
    .catch(e => {
      res.status(500).send(e);
      console.log(JSON.stringify(e));
    });
};
