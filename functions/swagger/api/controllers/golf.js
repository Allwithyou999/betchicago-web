const util = require('util');
const cGolfSeason = require('./sportradargolfseason');
const cGolfTournament = require('./sportradargolftournament');

module.exports = {};

module.exports.season = (req, res) => {
  let obj = new cGolfSeason();
  return obj.updateSeason(req.query.year)
    .then(results => res.status(200).send('{ "success": true }'))
    .catch(e => {
      res.status(500).send(e);
      console.log(e);
    });
};

module.exports.tournament = (req, res) => {
  let obj = new cGolfTournament();
  return obj.updateTournament(req.query.tournamentId, req.query.year)
    .then(results => res.status(200).send('{ "success": true }'))
    .catch(e => {
      res.status(500).send(e);
      console.log(e);
    });
};

module.exports.leaderboard = (req, res) => {
  let obj = new cGolfTournament();
  return obj.updateLeaderboard(req.query.id, req.query.year)
    .then(results => res.status(200).send('{ "success": true }'))
    .catch(e => {
      res.status(500).send(e);
      console.log(e);
    });
};
