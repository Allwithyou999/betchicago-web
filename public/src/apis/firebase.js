import firebase from 'firebase/app';
import 'firebase/database';
let database;
let ___golfYear = '2019';

let dbUrl = 'https://betchicagodev.firebaseio.com';
if (window.cApplicationLocal) dbUrl = window.cApplicationLocal.dbURL;

export const init = () => {
  let config = {
    databaseURL: dbUrl,
    apiKey: 'AIzaSyB1Q4bLnjKZmuVeIaeaAiS3OSOYKhKK2TQ',
    authDomain: 'bet-chicago.firebaseapp.com',
    projectId: 'bet-chicago',
    storageBucket: 'bet-chicago.appspot.com',
    messagingSenderId: '542489688565'
  };

  firebase.initializeApp(config);
  database = firebase.database();
};

export const getDataOnce = path => {
  return database.ref(path).once('value');
};

export const db = () => {
  return database;
};

export const loadDataOnce = (path, dispatch, REQUEST, SUCCESS, FAIL) => {
  dispatch({
    type: REQUEST
  });

  database
    .ref(path)
    .once('value')
    .then(result => {
      dispatch({
        type: SUCCESS,
        payload: result.val()
      });
    })
    .catch(error => {
      dispatch({
        type: FAIL
      });
    });
};

export const loadDataLiveOn = (path, dispatch, REQUEST, SUCCESS, FAIL) => {
  dispatch({
    type: REQUEST
  });

  database
    .ref(path)
    .on('value')
    .then(result => {
      dispatch({
        type: SUCCESS,
        payload: result.val()
      });
    })
    .catch(error => {
      dispatch({
        type: FAIL
      });
    });
};

export const loadPlayerTourData = async playerId => {
  const req1 = db()
    .ref(
      `sportRadarStore/golf/pga/${___golfYear}/playerTournamentResults/${playerId}`
    )
    .once('value');
  const req2 = db()
    .ref(
      `sportRadarStore/golf/pga/${___golfYear}/playerTournamentTeeTimes/${playerId}`
    )
    .once('value');
  const tourData = await Promise.all([req1, req2]);
  const tours = tourData[0].val();
  const teetimes = tourData[1].val();

  let date = new Date('2018-05-22T17:55:00+00:00').getTime();

  //Load recent 4 tour details
  let recentToursIds = Object.keys(tours)
    .sort((a, b) => {
      let result = 0;
      try {
        result =
          new Date(teetimes[b][1].teetimes.tee_time) -
          new Date(teetimes[a][1].teetimes.tee_time);
      } catch (e) {
        console.log(e);
      }
      return result;
    })
    .slice(0, 4);

  const recentReqs = [];
  recentToursIds.forEach(tour => {
    recentReqs.push(
      db()
        .ref(
          `sportRadarStore/golf/pga/${___golfYear}/tournaments/${tour}/skinnyLeaderboard/summary`
        )
        .once('value')
    );
    recentReqs.push(
      db()
        .ref(
          `sportRadarStore/golf/pga/${___golfYear}/tournaments/${tour}/leaderboard/leaderboardById/${playerId}`
        )
        .once('value')
    );
    recentReqs.push(
      db()
        .ref(
          `sportRadarStore/golf/pga/${___golfYear}/tournaments/${tour}/leaderboard/leaderboard/0`
        )
        .once('value')
    );
  });

  const recentResults = await Promise.all(recentReqs);
  const recentTours = [];

  for (let i = 0; i < recentToursIds.length; i++) {
    recentTours.push({
      summary: recentResults[i * 3].val(),
      player: recentResults[i * 3 + 1].val(),
      winner: recentResults[i * 3 + 2].val(),
      id: recentToursIds[i]
    });
  }
  //Prepare teetime

  let teetimeTours = Object.keys(teetimes).sort((a, b) => {
    let result = 0;
    try {
      result =
        new Date(teetimes[a][1].teetimes.tee_time) -
        new Date(teetimes[b][1].teetimes.tee_time);
    } catch (e) {
      console.log(e);
    }
    return result;
  });

  let round;
  if (teetimeTours)
    teetimeTours.forEach((tourId, tIndex) => {
      for (let index in teetimes) {
        let teetime = teetimes[index];
        if (teetime.teetimes)
          if (new Date(teetime.teetimes.tee_time).getTime() > date) {
            round = index;
            return;
          }
      }
    });

  let usopen = 'ebdd3311-2abf-434d-9b7e-00396078c279';
  let openTees = teetimes[usopen];
  let nextPairing = { teetime: {} };
  if (openTees) {
    nextPairing.teetime = openTees['1'];
  }
  //TODO: handle by Sam
  if (round > 1) {
    //this means current tournament
  } else {
    // this is upcoming tournament
  }
  /*
  //load next pairing tournament name
  const pairingTour = await db()
    .ref(
      `sportRadarStore/golf/pga/2019/tournaments/${
        teetimeTours[currentTeetime]
      }/skinnyLeaderboard/summary`
    )
    .once('value');

  let nextPairing = { teetime: {} };
  try {
    nextPairing.teetime = teetimes[teetimeTours[currentTeetime]][round];
  } catch (e) {
    e;
  }
*/
  return {
    recent: recentTours,
    nextPairing
  };
};
