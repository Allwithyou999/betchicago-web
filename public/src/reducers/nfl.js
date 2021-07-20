import * as actionTypes from '../actions/nfl';
import { STATUS } from '../modules/constants/common';

const initialState = {
  schedule: null,
  standings: null,
  nextup: null,
  game: null,
  players: null,
  loading: {
    schedule: STATUS.REQUEST,
    standings: STATUS.REQUEST,
    nextup: STATUS.REQUEST,
    game: STATUS.REQUEST,
    players: STATUS.REQUEST
  }
};

export default (state = initialState, action) => {
  switch (action.type) {
    // schedule
    case actionTypes.NFL_LOAD_SCHEDULE_REQUEST:
      return {
        ...state,
        schedule: null,
        loading: { ...state.loading, schedule: STATUS.REQUEST }
      };

    case actionTypes.NFL_LOAD_SCHEDULE_SUCCESS:
      return {
        ...state,
        schedule: action.payload,
        loading: { ...state.loading, schedule: STATUS.SUCCESS }
      };

    case actionTypes.NFL_LOAD_SCHEDULE_FAIL:
      return {
        ...state,
        schedule: null,
        loading: { ...state.loading, schedule: STATUS.FAIL }
      };

    // standings
    case actionTypes.NFL_LOAD_STANDINGS_REQUEST:
      return {
        ...state,
        standings: null,
        loading: { ...state.loading, standings: STATUS.REQUEST }
      };

    case actionTypes.NFL_LOAD_STANDINGS_SUCCESS:
      return {
        ...state,
        standings: action.payload,
        loading: { ...state.loading, standings: STATUS.SUCCESS }
      };

    case actionTypes.NFL_LOAD_STANDINGS_FAIL:
      return {
        ...state,
        standings: null,
        loading: { ...state.loading, standings: STATUS.FAIL }
      };

    // nextup
    case actionTypes.NFL_LOAD_NEXTUP_REQUEST:
      return {
        ...state,
        nextup: null,
        loading: { ...state.loading, nextup: STATUS.REQUEST }
      };

    case actionTypes.NFL_LOAD_NEXTUP_SUCCESS:
      return {
        ...state,
        nextup: action.payload,
        loading: { ...state.loading, nextup: STATUS.SUCCESS }
      };

    case actionTypes.NFL_LOAD_NEXTUP_FAIL:
      return {
        ...state,
        nextup: null,
        loading: { ...state.loading, nextup: STATUS.FAIL }
      };

    // game
    case actionTypes.NFL_LOAD_GAME_REQUEST:
      return {
        ...state,
        game: null,
        loading: { ...state.loading, game: STATUS.REQUEST }
      };

    case actionTypes.NFL_LOAD_GAME_SUCCESS:
      return {
        ...state,
        game: action.payload,
        loading: { ...state.loading, game: STATUS.SUCCESS }
      };

    case actionTypes.NFL_LOAD_GAME_FAIL:
      return {
        ...state,
        game: null,
        loading: { ...state.loading, game: STATUS.FAIL }
      };

    // players
    case actionTypes.NFL_LOAD_PLAYERS_REQUEST:
      return {
        ...state,
        players: null,
        loading: { ...state.loading, players: STATUS.REQUEST }
      };

    case actionTypes.NFL_LOAD_PLAYERS_SUCCESS:
      return {
        ...state,
        players: action.payload,
        loading: { ...state.loading, players: STATUS.SUCCESS }
      };

    case actionTypes.NFL_LOAD_PLAYERS_FAIL:
      return {
        ...state,
        players: null,
        loading: { ...state.loading, players: STATUS.FAIL }
      };

    default:
      return state;
  }
};
