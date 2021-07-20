import * as actionTypes from '../actions/nba';
import { STATUS } from '../modules/constants/common';

const initialState = {
  odds: null,
  standings: null,
  schedule: null,
  game: null,
  loading: {
    odds: STATUS.REQUEST,
    standings: STATUS.REQUEST,
    schedule: STATUS.REQUEST,
    game: STATUS.REQUEST
  }
};

export default (state = initialState, action) => {
  switch (action.type) {
    // odds
    case actionTypes.NBA_LOAD_ODDS_REQUEST:
      return {
        ...state,
        odds: null,
        loading: { ...state.loading, odds: STATUS.REQUEST }
      };

    case actionTypes.NBA_LOAD_ODDS_SUCCESS:
      return {
        ...state,
        odds: action.payload,
        loading: { ...state.loading, odds: STATUS.SUCCESS }
      };

    case actionTypes.NBA_LOAD_ODDS_FAIL:
      return {
        ...state,
        odds: null,
        loading: { ...state.loading, odds: STATUS.FAIL }
      };

    // standings
    case actionTypes.NBA_LOAD_STANDINGS_REQUEST:
      return {
        ...state,
        standings: null,
        loading: { ...state.loading, standings: STATUS.REQUEST }
      };

    case actionTypes.NBA_LOAD_STANDINGS_SUCCESS:
      return {
        ...state,
        standings: action.payload,
        loading: { ...state.loading, standings: STATUS.SUCCESS }
      };

    case actionTypes.NBA_LOAD_STANDINGS_FAIL:
      return {
        ...state,
        standings: null,
        loading: { ...state.loading, standings: STATUS.FAIL }
      };

    // schedule
    case actionTypes.NBA_LOAD_SCHEDULE_REQUEST:
      return {
        ...state,
        schedule: null,
        loading: { ...state.loading, schedule: STATUS.REQUEST }
      };

    case actionTypes.NBA_LOAD_SCHEDULE_SUCCESS:
      return {
        ...state,
        schedule: action.payload,
        loading: { ...state.loading, schedule: STATUS.SUCCESS }
      };

    case actionTypes.NBA_LOAD_SCHEDULE_FAIL:
      return {
        ...state,
        schedule: null,
        loading: { ...state.loading, schedule: STATUS.FAIL }
      };

    // game
    case actionTypes.NBA_LOAD_GAME_REQUEST:
      return {
        ...state,
        game: null,
        loading: { ...state.loading, game: STATUS.REQUEST }
      };

    case actionTypes.NBA_LOAD_GAME_SUCCESS:
      return {
        ...state,
        game: action.payload,
        loading: { ...state.loading, game: STATUS.SUCCESS }
      };

    case actionTypes.NBA_LOAD_GAME_FAIL:
      return {
        ...state,
        game: null,
        loading: { ...state.loading, game: STATUS.FAIL }
      };

    default:
      return state;
  }
};
