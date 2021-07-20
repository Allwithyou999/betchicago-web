import { loadDataOnce } from './firebase';
import * as actionTypes from '../actions/nfl';

export const loadSchedule = (year, week, tag) => {
  const path = `/sportRadarStore/nfl/${year}/${tag}/schedule/weeks/${week}/games`;

  return dispatch => {
    loadDataOnce(
      path,
      dispatch,
      actionTypes.NFL_LOAD_SCHEDULE_REQUEST,
      actionTypes.NFL_LOAD_SCHEDULE_SUCCESS,
      actionTypes.NFL_LOAD_SCHEDULE_FAIL
    );
  };
};

export const loadStandings = () => {
  const path = `/sportRadarStore/nfl/leaguehierarchy`;

  return dispatch => {
    loadDataOnce(
      path,
      dispatch,
      actionTypes.NFL_LOAD_STANDINGS_REQUEST,
      actionTypes.NFL_LOAD_STANDINGS_SUCCESS,
      actionTypes.NFL_LOAD_STANDINGS_FAIL
    );
  };
};

export const loadNextUp = year => {
  const path = `/sportRadarStore/nfl/${year}/nextUp`;

  return dispatch => {
    loadDataOnce(
      path,
      dispatch,
      actionTypes.NFL_LOAD_NEXTUP_REQUEST,
      actionTypes.NFL_LOAD_NEXTUP_SUCCESS,
      actionTypes.NFL_LOAD_NEXTUP_FAIL
    );
  };
};

export const loadGame = (week, id) => {
  const path = `/sportRadarStore/nfl/${new Date().getFullYear()}/REG/schedule/weeks/${week}/games/${id}`;

  return dispatch => {
    loadDataOnce(
      path,
      dispatch,
      actionTypes.NFL_LOAD_GAME_REQUEST,
      actionTypes.NFL_LOAD_GAME_SUCCESS,
      actionTypes.NFL_LOAD_GAME_FAIL
    );
  };
};

export const loadPlayers = () => {
  const path = `/sportRadarStore/nfl/playerProfiles/rawProfiles`;

  return dispatch => {
    loadDataOnce(
      path,
      dispatch,
      actionTypes.NFL_LOAD_PLAYERS_REQUEST,
      actionTypes.NFL_LOAD_PLAYERS_SUCCESS,
      actionTypes.NFL_LOAD_PLAYERS_FAIL
    );
  };
};
