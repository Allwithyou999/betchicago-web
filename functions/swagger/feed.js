const request = require('request');
const firebaseAdmin = require('firebase-admin');
const moment = require('moment-timezone');

startNBAClockFeed = function () {
  const url = `http://api.sportradar.us/nba/production/stream/en/clock/subscribe?api_key=qw52afqtqz8g9jy47dw79vkh`;
  let buffer = '';
  let dateStr = moment().tz("America/Chicago").format();
  let date10 = dateStr.substr(0, 4) + '/' + dateStr.substr(5, 2) + '/' + dateStr.substr(8, 2);

  console.log('-- Starting NBA Clock Feed --');

  request({ method: 'GET', uri: url}, (error, response, body) => {
  })
  .on('data', (res) => {
    buffer = buffer + res;
    try {
      const data = JSON.parse(buffer);
      buffer = '';
      if (data.payload) {
        firebaseAdmin.database().ref(`/sportRadarStore/nba/games/${data.payload.game.id}`).once('value').then(res => {
          const game = res.val();
          const clock = data.payload.clocks.game;
          game.summary.home.points = Math.max(game.summary.home.points, data.payload.game.home.points);
          game.summary.away.points = Math.max(game.summary.away.points, data.payload.game.away.points);
          game.summary.quarter = data.payload.period.number;
          game.summary.status = data.payload.game.status !== 'complete' ? data.payload.game.status : 'closed';
          if (clock.length === 4) {
            game.summary.clock = `${clock[0]}${clock[1]}:${clock[2]}${clock[3]}`;
          } else if (clock.length === 3) {
            game.summary.clock = `0${clock[0]}:${clock[1]}${clock[2]}`;
          } else if (clock.length === 2) {
            game.summary.clock = `00:${clock[0]}${clock[1]}`;
          } else if (clock.length === 1) {
            game.summary.clock = `00:0${clock[0]}`;
          }

          return game;
        })
        .then(game => {
          return new Promise((resolve, reject) => {
            request(`http://api.sportradar.us/nba/production/v5/en/games/${data.payload.game.id}/summary.json?api_key=qw52afqtqz8g9jy47dw79vkh`, (err, res, body) => {
              if (err) {
                reject(err);
              } else {
                const result = JSON.parse(body);
                game.summary.away.scoring = result.away.scoring;
                game.summary.away.statistics = result.away.statistics;
                game.summary.home.scoring = result.home.scoring;
                game.summary.home.statistics = result.home.statistics;

                resolve(game);
              }
            })
          });
        })
        .then(game => firebaseAdmin.database().ref(`/sportRadarStore/nba/games/${data.payload.game.id}`).update(game))
        .then(() => firebaseAdmin.database().ref(`/sportRadarStore/nba/daily/${date10}/schedule`).once('value'))
        .then(res => {
          const games = res.val();
          let idx = '';
          games.games.forEach((game, index) => {
            if (game.id === data.payload.game.id) {
              idx = index;
            }
          });
          games.games[idx].status = data.payload.game.status !== 'complete' ? data.payload.game.status : 'closed';
          return firebaseAdmin.database().ref(`/sportRadarStore/nba/daily/${date10}/schedule/games/${idx}`).update(games.games[idx]);
        })
        .catch(e => {
          console.log(e);
        });
      }
    } catch(e) {
      console.log(e)
    }
  })
}

startNBAStatsFeed = function () {
  const url = `http://api.sportradar.us/nba/production/stream/en/statistics/subscribe?api_key=qw52afqtqz8g9jy47dw79vkh`;
  let buffer = '';

  console.log('-- Starting NBA Stats Feed --');

  request({ method: 'GET', uri: url}, (error, response, body) => {
  })
  .on('data', (res) => {
    buffer = buffer + res;
    try {
      const data = JSON.parse(buffer);
      buffer = '';
      if (data.payload) {
        return firebaseAdmin.database().ref(`/sportRadarStore/nba/games/${data.payload.game.id}/players/${data.payload.player.id}`).update(data.payload.player);
      }
    } catch(e) {
      console.log(e)
    }
  })
}

startNFLStatsFeed = function () {
  const url = `http://api.sportradar.us/nfl/official/trial/stream/en/statistics/subscribe?api_key=ffdwcz3fa8uxwmuzf272unfu`;
  // const url = `http://api.sportradar.us/nfl-o2/stream/statistics/subscribe?api_key=s65pedv7kkd5twrar3dmtne5`;
  let buffer = '';

  console.log('--- Starting NFL Stats Feed --');

  request({ method: 'GET', uri: url}, (error, response, body) => {
  })
  .on('data', (res) => {
    console.log(`${res}`);
    buffer = buffer + res;
    try {
      const data = JSON.parse(buffer);
      buffer = '';
    } catch(e) {
      console.log(e)
    }
  })
}

module.exports.startNBAClockFeed = startNBAClockFeed;
module.exports.startNBAStatsFeed = startNBAStatsFeed;
module.exports.startNFLStatsFeed = startNFLStatsFeed;
