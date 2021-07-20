const cSportRadarMLB = require('./sportradarmlb');
const cSportRadarGame = require('./sportradarmlbgame');

module.exports = {};
module.exports.updateMLBDailyData = (req, res) => {
  let obj = new cSportRadarMLB();
  return obj.udpateDailyData(req.query.date)
    .then(results => res.status(200).send('{ "success": true }'))
    .catch(e => {
      res.status(500).send(e);
      console.log(e);
    });
};
module.exports.updateMLBDailyBoxscore = (req, res) => {
  let obj = new cSportRadarMLB();
  return obj.udpateDailyBoxScore(req.query.date)
    .then(results => res.status(200).send('{ "success": true }'))
    .catch(e => {
      res.status(500).send(e);
      console.log(e);
    });
};
module.exports.updateMLBYearData = (req, res) => {
  let obj = new cSportRadarMLB();
  return obj.updateMLBYearData(req.query.year, req.query.tag)
    .then(results => res.status(200).send('{ "success": true }'))
    .catch(e => {
      res.status(500).send(e);
      console.log(e);
    });
};

module.exports.updateMLBGameData = (req, res) => {
  let obj = new cSportRadarGame();
  return obj.updateGame(req.query.eventId)
    .then(results => res.status(200).send('{ "success": true }'))
    .catch(e => {
      res.status(500).send(e);
      console.log(e);
    });
};

module.exports.mlbPlayerData = (req, res) => {
  let obj = new cSportRadarMLB();
  return obj.fetchPlayerData(req.query.playerId, req.type)
    .then(results => res.status(200).send(results))
    .catch(e => {
      res.status(500).send(e);
      console.log(e);
    });
};

module.exports.mlbTeamData = (req, res) => {
  let obj = new cSportRadarMLB();
  return obj.fetchTeamData(req.query.teamId, req.type)
    .then(results => res.status(200).send(results))
    .catch(e => {
      res.status(500).send(e);
      console.log(e);
    });
};

module.exports.mlbTeamSeasonData = (req, res) => {
  let obj = new cSportRadarMLB();
  return obj.fetchTeamSeasonData(req.query.teamId, req.query.year, req.query.season, req.type)
    .then(results => res.status(200).send(results))
    .catch(e => {
      res.status(500).send(e);
      console.log(e);
    });
};

module.exports.handleBaseballPush = (req, res) => {
  let obj = new cSportRadarMLB();
  return obj.handleBaseballPush(req, res)
    .then(results => res.status(200).send(results))
    .catch(e => {
      res.status(500).send(e);
      console.log(e);
    });
};
