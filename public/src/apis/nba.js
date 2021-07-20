import { loadDataOnce } from './firebase';
import * as actionTypes from '../actions/nba';

export const loadOdds = year => {
  const path = `/sportRadarStore/nba/year/${year}/REG/odds`;
  return dispatch => {
    loadDataOnce(
      path,
      dispatch,
      actionTypes.NBA_LOAD_ODDS_REQUEST,
      actionTypes.NBA_LOAD_ODDS_SUCCESS,
      actionTypes.NBA_LOAD_ODDS_FAIL
    );
  };
};

export const loadStandings = year => {
  const path = `/sportRadarStore/nba/year/${year}/REG/standings/conferences`;
  return dispatch => {
    loadDataOnce(
      path,
      dispatch,
      actionTypes.NBA_LOAD_STANDINGS_REQUEST,
      actionTypes.NBA_LOAD_STANDINGS_SUCCESS,
      actionTypes.NBA_LOAD_STANDINGS_FAIL
    );
  };
};

export const loadSchedule = date => {
  const path = `/sportRadarStore/nba/daily/${date}/schedule/games`;

  return dispatch => {
    loadDataOnce(
      path,
      dispatch,
      actionTypes.NBA_LOAD_SCHEDULE_REQUEST,
      actionTypes.NBA_LOAD_SCHEDULE_SUCCESS,
      actionTypes.NBA_LOAD_SCHEDULE_FAIL
    );
  };
};

export const loadGame = id => {
  const path = `/sportRadarStore/nba/games/${id}`;

  return dispatch => {
    loadDataOnce(
      path,
      dispatch,
      actionTypes.NBA_LOAD_GAME_REQUEST,
      actionTypes.NBA_LOAD_GAME_SUCCESS,
      actionTypes.NBA_LOAD_GAME_FAIL
    );
  };
};
