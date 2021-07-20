import * as actionTypes from '../actions/golf';
import { STATUS } from '../modules/constants/common';

const initialState = {
  ranking: null,
  leaderboard: null,
  schedule: null,
  currentTourId: null,
  currentTeetime: null,
  tourListByYear: null,
  golfYearList: [],
  leaders: null,
  playerStats: null,
  playerTourData: null,
  winnerData: null,
  odds: null,
  loading: {
    ranking: STATUS.REQUEST,
    leaderboard: STATUS.REQUEST,
    schedule: STATUS.REQUEST,
    currentTeetime: STATUS.REQUEST,
    tourListByYear: STATUS.REQUEST,
    golfYearList: STATUS.REQUEST,
    leaders: STATUS.REQUEST,
    playerStats: STATUS.REQUEST,
    playerTourData: STATUS.REQUEST,
    winnerData: STATUS.REQUEST,
    odds: STATUS.REQUEST
  }
};

export default (state = initialState, action) => {
  switch (action.type) {
    //ranking
    case actionTypes.GOLF_LOAD_PLAYER_RANKING_REQUEST:
      return {
        ...state,
        ranking: null,
        loading: { ...state.loading, ranking: STATUS.REQUEST }
      };

    case actionTypes.GOLF_LOAD_PLAYER_RANKING_SUCCESS:
      return {
        ...state,
        ranking: action.payload,
        loading: { ...state.loading, ranking: STATUS.SUCCESS }
      };

    case actionTypes.GOLF_LOAD_PLAYER_RANKING_FAIL:
      return {
        ...state,
        ranking: null,
        loading: { ...state.loading, ranking: STATUS.FAIL }
      };

    //leaderboard
    case actionTypes.GOLF_LOAD_LEADERBOARD_DATA_REQUEST:
      return {
        ...state,
        leaderboard: null,
        loading: { ...state.loading, leaderboard: STATUS.REQUEST }
      };

    case actionTypes.GOLF_LOAD_LEADERBOARD_DATA_SUCCESS:
      return {
        ...state,
        leaderboard: action.payload,
        loading: { ...state.loading, leaderboard: STATUS.SUCCESS }
      };

    case actionTypes.GOLF_LOAD_LEADERBOARD_DATA_FAIL:
      return {
        ...state,
        leaderboard: null,
        loading: { ...state.loading, leaderboard: STATUS.FAIL }
      };

    //schedule
    case actionTypes.GOLF_LOAD_SCHEDULE_DATA_REQUEST:
      return {
        ...state,
        schedule: null,
        loading: { ...state.loading, schedule: STATUS.REQUEST }
      };

    case actionTypes.GOLF_LOAD_SCHEDULE_DATA_SUCCESS:
      return {
        ...state,
        schedule: action.payload,
        loading: { ...state.loading, schedule: STATUS.SUCCESS }
      };

    case actionTypes.GOLF_LOAD_SCHEDULE_DATA_FAIL:
      return {
        ...state,
        schedule: null,
        loading: { ...state.loading, schedule: STATUS.FAIL }
      };

    //odds
    case actionTypes.GOLF_LOAD_ODDS_LIST_REQUEST:
      return {
        ...state,
        odds: null,
        loading: { ...state.loading, odds: STATUS.REQUEST }
      };

    case actionTypes.GOLF_LOAD_ODDS_LIST_SUCCESS:
      return {
        ...state,
        odds: action.payload,
        loading: { ...state.loading, odds: STATUS.SUCCESS }
      };

    case actionTypes.GOLF_LOAD_ODDS_LIST_FAIL:
      return {
        ...state,
        odds: null,
        loading: { ...state.loading, odds: STATUS.FAIL }
      };

    //tournament
    case actionTypes.GOLF_LOAD_CURRENT_GOLF_TOURNAMENT:
      return {
        ...state,
        currentTourId: action.payload
      };

    //teetime
    case actionTypes.GOLF_LOAD_CURRENT_TEETIME_REQUEST:
      return {
        ...state,
        currentTeetime: null,
        loading: { ...state.loading, currentTeetime: STATUS.REQUEST }
      };

    case actionTypes.GOLF_LOAD_CURRENT_TEETIME_SUCCESS:
      return {
        ...state,
        currentTeetime: action.payload,
        loading: { ...state.loading, currentTeetime: STATUS.SUCCESS }
      };

    case actionTypes.GOLF_LOAD_CURRENT_TEETIME_FAIL:
      return {
        ...state,
        currentTeetime: null,
        loading: { ...state.loading, currentTeetime: STATUS.FAIL }
      };

    //tour list by year
    case actionTypes.GOLF_LOAD_TOUR_LIST_BY_YEAR_REQUEST:
      return {
        ...state,
        tourListByYear: null,
        loading: { ...state.loading, tourListByYear: STATUS.REQUEST }
      };

    case actionTypes.GOLF_LOAD_TOUR_LIST_BY_YEAR_SUCCESS:
      console.log(action.payload);
      return {
        ...state,
        tourListByYear: action.payload,
        loading: { ...state.loading, tourListByYear: STATUS.SUCCESS }
      };

    case actionTypes.GOLF_LOAD_TOUR_LIST_BY_YEAR_FAIL:
      return {
        ...state,
        tourListByYear: null,
        loading: { ...state.loading, tourListByYear: STATUS.FAIL }
      };

    //golf year list
    case actionTypes.GOLF_LOAD_GOLF_YEAR_LIST_REQUEST:
      return {
        ...state,
        golfYearList: [],
        loading: { ...state.loading, golfYearList: STATUS.REQUEST }
      };

    case actionTypes.GOLF_LOAD_GOLF_YEAR_LIST_SUCCESS:
      return {
        ...state,
        golfYearList: action.payload,
        loading: { ...state.loading, golfYearList: STATUS.SUCCESS }
      };

    case actionTypes.GOLF_LOAD_GOLF_YEAR_LIST_FAIL:
      return {
        ...state,
        golfYearList: [],
        loading: { ...state.loading, golfYearList: STATUS.FAIL }
      };

    //leaders
    case actionTypes.GOLF_LOAD_LEADERS_REQUEST:
      return {
        ...state,
        leaders: null,
        loading: { ...state.loading, leaders: STATUS.REQUEST }
      };

    case actionTypes.GOLF_LOAD_LEADERS_SUCCESS:
      return {
        ...state,
        leaders: action.payload,
        loading: { ...state.loading, leaders: STATUS.SUCCESS }
      };

    case actionTypes.GOLF_LOAD_LEADERS_FAIL:
      return {
        ...state,
        leaders: null,
        loading: { ...state.loading, leaders: STATUS.FAIL }
      };

    //player stats
    case actionTypes.GOLF_LOAD_PLAYER_STATS_REQUEST:
      return {
        ...state,
        playerStats: null,
        loading: { ...state.loading, playerStats: STATUS.REQUEST }
      };

    case actionTypes.GOLF_LOAD_PLAYER_STATS_SUCCESS:
      return {
        ...state,
        playerStats: action.payload,
        loading: { ...state.loading, playerStats: STATUS.SUCCESS }
      };

    case actionTypes.GOLF_LOAD_PLAYER_STATS_FAIL:
      return {
        ...state,
        playerStats: null,
        loading: { ...state.loading, playerStats: STATUS.FAIL }
      };

    //player tour data
    case actionTypes.GOLF_LOAD_PLAYER_TOURNAMENT_DATA_REQUEST:
      return {
        ...state,
        playerTourData: null,
        loading: { ...state.loading, playerTourData: STATUS.REQUEST }
      };

    case actionTypes.GOLF_LOAD_PLAYER_TOURNAMENT_DATA_SUCCESS:
      return {
        ...state,
        playerTourData: action.payload,
        loading: { ...state.loading, playerTourData: STATUS.SUCCESS }
      };

    case actionTypes.GOLF_LOAD_PLAYER_TOURNAMENT_DATA_FAIL:
      return {
        ...state,
        playerTourData: null,
        loading: { ...state.loading, playerTourData: STATUS.FAIL }
      };

    //tour winners
    case actionTypes.GOLF_LOAD_TOURNAMENT_WINNERS_REQUEST:
      return {
        ...state,
        winnerData: null,
        loading: { ...state.loading, winnerData: STATUS.REQUEST }
      };

    case actionTypes.GOLF_LOAD_TOURNAMENT_WINNERS_SUCCESS:
      return {
        ...state,
        winnerData: action.payload,
        loading: { ...state.loading, winnerData: STATUS.SUCCESS }
      };

    case actionTypes.GOLF_LOAD_TOURNAMENT_WINNERS_FAIL:
      return {
        ...state,
        winnerData: null,
        loading: { ...state.loading, winnerData: STATUS.FAIL }
      };

    default:
      return state;
  }
};
