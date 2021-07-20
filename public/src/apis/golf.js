import { getDataOnce, loadDataOnce, db, loadPlayerTourData } from './firebase';
import * as actionTypes from '../actions/golf';
let ___golfYear = '2019';

export const loadPlayerRankings = () => {
  return dispatch => {
    dispatch({
      type: actionTypes.GOLF_LOAD_PLAYER_RANKING_FAIL
    });

    const year = new Date().getFullYear();
    const currRank = db()
      .ref(`sportRadarStore/golf/pga/${year}/rankings`)
      .once('value');
    const priorRank = db()
      .ref(`sportRadarStore/golf/pga/${year - 1}/rankings`)
      .once('value');

    Promise.all([currRank, priorRank])
      .then(results => {
        let curr = results[0].val();
        let prior = results[1].val();

        for (let i = 0; i < curr.players.length; i++) {
          const player = curr.players[i];
          if (prior.playersById[player.id]) {
            player.last_year_rank = prior.playersById[player.id].rank;
          } else {
            player.last_year_rank = '- -';
          }
        }
        dispatch({
          type: actionTypes.GOLF_LOAD_PLAYER_RANKING_SUCCESS,
          payload: curr
        });
      })
      .catch(e => {
        dispatch({
          type: actionTypes.GOLF_LOAD_PLAYER_RANKING_FAIL,
          payload: null
        });
      });
  };
};

export const loadLeaderboardData = id => {
  return dispatch => {
    dispatch({ type: actionTypes.GOLF_LOAD_LEADERBOARD_DATA_REQUEST });

    const leaderboard = db()
      .ref(
        `sportRadarStore/golf/pga/${___golfYear}/tournaments/${id}/leaderboard/leaderboard`
      )
      .once('value');
    const summary = db()
      .ref(`sportRadarStore/golf/pga/${___golfYear}/tournaments/${id}/summary`)
      .once('value');

    Promise.all([leaderboard, summary])
      .then(results => {
        dispatch({
          type: actionTypes.GOLF_LOAD_LEADERBOARD_DATA_SUCCESS,
          payload: {
            players: results[0].val(),
            summary: results[1].val()
          }
        });
      })
      .catch(e => {
        dispatch({
          type: actionTypes.GOLF_LOAD_LEADERBOARD_DATA_FAIL,
          payload: null
        });
      });
  };
};

export const loadSchedule = () => {
  const path = `sportRadarStore/golf/pga/${___golfYear}/skinnySchedule`;
  return dispatch => {
    loadDataOnce(
      path,
      dispatch,
      actionTypes.GOLF_LOAD_SCHEDULE_DATA_REQUEST,
      actionTypes.GOLF_LOAD_SCHEDULE_DATA_SUCCESS,
      actionTypes.GOLF_LOAD_SCHEDULE_DATA_FAIL
    );
  };
};

export const loadOdds = () => {
  const path = `sportRadarStore/odds/mappings/categoryRights/sr-category-28/outrights`;
  return dispatch => {
    loadDataOnce(
      path,
      dispatch,
      actionTypes.GOLF_LOAD_ODDS_LIST_REQUEST,
      actionTypes.GOLF_LOAD_ODDS_LIST_SUCCESS,
      actionTypes.GOLF_LOAD_ODDS_LIST_FAIL
    );
  };
};

export const loadCurrentTournament = tourId => {
  if (tourId) {
    loadLeaderboardData(tourId);
    return;
  }

  const path = `applicationConfig/golfTournament`;
  return dispatch => {
    getDataOnce(path).then(result => {
      dispatch({
        type: actionTypes.GOLF_LOAD_CURRENT_GOLF_TOURNAMENT,
        payload: result.val()
      });
      loadLeaderboardData(result.val())(dispatch);
    });
  };
};

export const loadCurrentTeetimeList = (currentTourId, round) => {
  return dispatch => {
    dispatch({
      type: actionTypes.GOLF_LOAD_CURRENT_TEETIME_REQUEST
    });

    db()
      .ref(
        `sportRadarStore/golf/pga/${___golfYear}/tournaments/${currentTourId}/rounds/${round}/teetimes/round/courses/0/pairings`
      )
      .orderByChild('tee_time')
      .startAt(new Date().toISOString())
      .limitToFirst(10)
      .once('value')
      .then(result => {
        let payload = result.val();
        if (!payload) {
          payload = {};
        }
        dispatch({
          type: actionTypes.GOLF_LOAD_CURRENT_TEETIME_SUCCESS,
          payload
        });
      })
      .catch(e => {
        dispatch({
          type: actionTypes.GOLF_LOAD_CURRENT_TEETIME_FAIL,
          payload: {
            resultsFound: false
          }
        });
      });
  };
};

export const loadTourListByYear = yearList => {
  return dispatch => {
    dispatch({
      type: actionTypes.GOLF_LOAD_TOUR_LIST_BY_YEAR_REQUEST
    });

    const request = yearList.map(year =>
      db()
        .ref(`sportRadarStore/golf/pga/${year}/tournamentList`)
        .once('value')
    );

    Promise.all(request)
      .then(results => {
        const payload = results.map(result => result.val());
        dispatch({
          type: actionTypes.GOLF_LOAD_TOUR_LIST_BY_YEAR_SUCCESS,
          payload
        });
      })
      .catch(e => {
        dispatch({
          type: actionTypes.GOLF_LOAD_TOUR_LIST_BY_YEAR_FAIL,
          payload: null
        });
      });
  };
};

export const loadTourList = () => {
  return dispatch => {
    dispatch({
      type: actionTypes.GOLF_LOAD_GOLF_YEAR_LIST_REQUEST
    });

    db()
      .ref(`applicationConfig/golfYear`)
      .once('value')
      .then(result => {
        dispatch({
          type: actionTypes.GOLF_LOAD_GOLF_YEAR_LIST_SUCCESS,
          payload: result.val()
        });
        dispatch(loadTourListByYear(result.val()));
      })
      .catch(e => {
        dispatch({
          type: actionTypes.GOLF_LOAD_GOLF_YEAR_LIST_FAIL,
          payload: []
        });
      });
  };
};

export const loadGolfLeaders = () => {
  return dispatch => {
    dispatch({
      type: actionTypes.GOLF_LOAD_LEADERS_REQUEST
    });

    const req1 = db()
      .ref(`sportRadarStore/golf/pga/${___golfYear}/statistics/players`)
      .orderByChild('statistics/earnings')
      .limitToLast(5)
      .once('value');
    const req2 = db()
      .ref(`sportRadarStore/golf/pga/${___golfYear}/statistics/players`)
      .orderByChild('statistics/points')
      .limitToLast(5)
      .once('value');

    Promise.all([req1, req2])
      .then(results => {
        dispatch({
          type: actionTypes.GOLF_LOAD_LEADERS_SUCCESS,
          payload: {
            earning: results[0].val() || [],
            fedex: results[1].val() || []
          }
        });
      })
      .catch(e => {
        dispatch({
          type: actionTypes.GOLF_LOAD_LEADERS_FAIL,
          payload: null
        });
      });
  };
};

export const loadPlayerStats = id => {
  return dispatch => {
    dispatch({
      type: actionTypes.GOLF_LOAD_PLAYER_STATS_REQUEST
    });

    const req1 = db()
      .ref(
        `sportRadarStore/golf/pga/${___golfYear}/statistics/playersById/${id}`
      )
      .once('value');
    const req2 = db()
      .ref(
        `sportRadarStore/golf/pga/${___golfYear}/playerProfiles/playersById/${id}`
      )
      .once('value');

    Promise.all([req1, req2])
      .then(results => {
        dispatch({
          type: actionTypes.GOLF_LOAD_PLAYER_STATS_SUCCESS,
          payload: {
            stats: results[0].val() || {},
            profile: results[1].val() || {}
          }
        });
      })
      .catch(e => {
        dispatch({
          type: actionTypes.GOLF_LOAD_PLAYER_STATS_FAIL,
          payload: null
        });
      });
  };
};

export const loadWinnerData = tourIds => {
  return dispatch => {
    dispatch({
      type: actionTypes.GOLF_LOAD_TOURNAMENT_WINNERS_REQUEST
    });

    const reqs = tourIds.map(id =>
      db()
        .ref(
          `sportRadarStore/golf/pga/${___golfYear}/tournaments/${id}/leaderboard/leaderboard/0`
        )
        .once('value')
    );

    Promise.all(reqs)
      .then(results => {
        let winnerList = {};
        tourIds.forEach((tourId, index) => {
          winnerList[tourId] = results[index].val();
        });
        dispatch({
          type: actionTypes.GOLF_LOAD_TOURNAMENT_WINNERS_SUCCESS,
          payload: winnerList
        });
      })
      .catch(e => {
        dispatch({
          type: actionTypes.GOLF_LOAD_TOURNAMENT_WINNERS_FAIL,
          payload: null
        });
      });
  };
};

export const loadPlayerTournamentData = id => {
  return dispatch => {
    dispatch({
      type: actionTypes.GOLF_LOAD_PLAYER_TOURNAMENT_DATA_REQUEST
    });

    loadPlayerTourData(id)
      .then(result => {
        dispatch({
          type: actionTypes.GOLF_LOAD_PLAYER_TOURNAMENT_DATA_SUCCESS,
          payload: result
        });
      })
      .catch(e => {
        dispatch({
          type: actionTypes.GOLF_LOAD_PLAYER_TOURNAMENT_DATA_FAIL,
          payload: null
        });
      });
  };
};
