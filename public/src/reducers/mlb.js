import * as actionTypes from '../actions/mlb';
import { STATUS } from '../modules/constants/common';

const initialState = {
  standings: null,
  scoreboard: null,
  slugs: null,
  homeTeamStats: null,
  awayTeamStats: null,
  teamSchedule: null,
  apArticles: null,
  schedule: null,
  coverage: null,
  odds: null,
  upcomingSchedule: null,
  lastResults: null,
  lastAwayResults: null,
  loading: {
    standings: STATUS.REQUEST,
    scoreboard: STATUS.REQUEST,
    slugs: STATUS.REQUEST,
    homeTeamStats: STATUS.REQUEST,
    awayTeamStats: STATUS.REQUEST,
    teamSchedule: STATUS.REQUEST,
    apArticles: STATUS.REQUEST,
    schedule: STATUS.REQUEST,
    upcomingSchedule: STATUS.REQUEST,
    coverage: STATUS.REQUEST,
    odds: STATUS.REQUEST,
    lastResults: STATUS.REQUEST,
    lastAwayResults: STATUS.REQUEST
  }
};

export default (state = initialState, action) => {
  switch (action.type) {
    //standings
    case actionTypes.MLB_LOAD_STANDINGS_REQUEST:
      return {
        ...state,
        standings: null,
        loading: { ...state.loading, standings: STATUS.REQUEST }
      };

    case actionTypes.MLB_LOAD_STANDINGS_SUCCESS:
      console.log(action);
      return {
        ...state,
        standings: action.payload,
        loading: { ...state.loading, standings: STATUS.SUCCESS }
      };

    case actionTypes.MLB_LOAD_STANDINGS_FAIL:
      return {
        ...state,
        standings: null,
        loading: { ...state.loading, standings: STATUS.FAIL }
      };

    case actionTypes.MLB_LOAD_SCOREBOARD_REQUEST:
      return {
        ...state,
        scoreboard: null,
        loading: { ...state.loading, scoreboard: STATUS.REQUEST }
      };

    case actionTypes.MLB_LOAD_SCOREBOARD_SUCCESS:
      return {
        ...state,
        scoreboard: action.payload,
        loading: { ...state.loading, scoreboard: STATUS.SUCCESS }
      };

    case actionTypes.MLB_LOAD_SCOREBOARD_FAIL:
      return {
        ...state,
        scoreboard: null,
        loading: { ...state.loading, scoreboard: STATUS.FAIL }
      };

    case actionTypes.MLB_LOAD_TEAM_SLUGS_REQUEST:
      return {
        ...state,
        slugs: null,
        loading: { ...state.loading, slugs: STATUS.REQUEST }
      };

    case actionTypes.MLB_LOAD_TEAM_SLUGS_SUCCESS:
      return {
        ...state,
        slugs: action.payload,
        loading: { ...state.loading, slugs: STATUS.SUCCESS }
      };

    case actionTypes.MLB_LOAD_TEAM_SLUGS_FAIL:
      return {
        ...state,
        slugs: null,
        loading: { ...state.loading, slugs: STATUS.FAIL }
      };

    case actionTypes.MLB_LOAD_HOME_TEAM_STATS_REQUEST:
      return {
        ...state,
        homeTeamStats: null,
        loading: { ...state.loading, homeTeamStats: STATUS.REQUEST }
      };

    case actionTypes.MLB_LOAD_HOME_TEAM_STATS_SUCCESS:
      return {
        ...state,
        homeTeamStats: action.payload,
        loading: { ...state.loading, homeTeamStats: STATUS.SUCCESS }
      };

    case actionTypes.MLB_LOAD_HOME_TEAM_STATS_FAIL:
      return {
        ...state,
        homeTeamStats: null,
        loading: { ...state.loading, homeTeamStats: STATUS.FAIL }
      };

    case actionTypes.MLB_LOAD_AWAY_TEAM_STATS_REQUEST:
      return {
        ...state,
        awayTeamStats: null,
        loading: { ...state.loading, awayTeamStats: STATUS.REQUEST }
      };

    case actionTypes.MLB_LOAD_AWAY_TEAM_STATS_SUCCESS:
      return {
        ...state,
        awayTeamStats: action.payload,
        loading: { ...state.loading, awayTeamStats: STATUS.SUCCESS }
      };

    case actionTypes.MLB_LOAD_AWAY_TEAM_STATS_FAIL:
      return {
        ...state,
        awayTeamStats: null,
        loading: { ...state.loading, awayTeamStats: STATUS.FAIL }
      };

    case actionTypes.MLB_LOAD_TEAM_SCHEDULE_REQUEST:
      return {
        ...state,
        teamSchedule: null,
        loading: { ...state.loading, teamSchedule: STATUS.REQUEST }
      };

    case actionTypes.MLB_LOAD_TEAM_SCHEDULE_SUCCESS:
      return {
        ...state,
        teamSchedule: action.payload,
        loading: { ...state.loading, teamSchedule: STATUS.SUCCESS }
      };

    case actionTypes.MLB_LOAD_TEAM_SCHEDULE_FAIL:
      return {
        ...state,
        teamSchedule: null,
        loading: { ...state.loading, teamSchedule: STATUS.FAIL }
      };

    case actionTypes.MLB_LOAD_TEAM_AP_ARTICLE_REQUEST:
      return {
        ...state,
        apArticles: null,
        loading: { ...state.loading, apArticles: STATUS.REQUEST }
      };

    case actionTypes.MLB_LOAD_TEAM_AP_ARTICLE_SUCCESS:
      return {
        ...state,
        apArticles: action.payload,
        loading: { ...state.loading, apArticles: STATUS.SUCCESS }
      };

    case actionTypes.MLB_LOAD_TEAM_AP_ARTICLE_FAIL:
      return {
        ...state,
        apArticles: null,
        loading: { ...state.loading, apArticles: STATUS.FAIL }
      };

    case actionTypes.MLB_LOAD_SCHEDULE_REQUEST:
      return {
        ...state,
        schedule: null,
        loading: { ...state.loading, schedule: STATUS.REQUEST }
      };

    case actionTypes.MLB_LOAD_SCHEDULE_SUCCESS:
      return {
        ...state,
        schedule: action.payload,
        loading: { ...state.loading, schedule: STATUS.SUCCESS }
      };

    case actionTypes.MLB_LOAD_SCHEDULE_FAIL:
      return {
        ...state,
        schedule: null,
        loading: { ...state.loading, schedule: STATUS.FAIL }
      };

    case actionTypes.MLB_LOAD_GAME_COVERAGE_REQUEST:
      return {
        ...state,
        coverage: null,
        loading: { ...state.loading, coverage: STATUS.REQUEST }
      };

    case actionTypes.MLB_LOAD_GAME_COVERAGE_SUCCESS:
      return {
        ...state,
        coverage: action.payload,
        loading: { ...state.loading, coverage: STATUS.SUCCESS }
      };

    case actionTypes.MLB_LOAD_GAME_COVERAGE_FAIL:
      return {
        ...state,
        coverage: null,
        loading: { ...state.loading, coverage: STATUS.FAIL }
      };

    case actionTypes.MLB_LOAD_ODDS_REQUEST:
      return {
        ...state,
        odds: null,
        loading: { ...state.loading, odds: STATUS.REQUEST }
      };

    case actionTypes.MLB_LOAD_ODDS_SUCCESS:
      return {
        ...state,
        odds: action.payload,
        loading: { ...state.loading, odds: STATUS.SUCCESS }
      };

    case actionTypes.MLB_LOAD_ODDS_FAIL:
      return {
        ...state,
        odds: null,
        loading: { ...state.loading, odds: STATUS.FAIL }
      };

    case actionTypes.MLB_LOAD_UPCOMING_SCHEDULE_REQUEST:
      return {
        ...state,
        upcomingSchedule: null,
        loading: { ...state.loading, upcomingSchedule: STATUS.REQUEST }
      };

    case actionTypes.MLB_LOAD_UPCOMING_SCHEDULE_SUCCESS:
      return {
        ...state,
        upcomingSchedule: action.payload,
        loading: { ...state.loading, upcomingSchedule: STATUS.SUCCESS }
      };

    case actionTypes.MLB_LOAD_UPCOMING_SCHEDULE_FAIL:
      return {
        ...state,
        upcomingSchedule: null,
        loading: { ...state.loading, upcomingSchedule: STATUS.FAIL }
      };

    case actionTypes.MLB_LOAD_LAST_RESULTS_REQUEST:
      return {
        ...state,
        lastResults: null,
        loading: { ...state.loading, lastResults: STATUS.REQUEST }
      };

    case actionTypes.MLB_LOAD_LAST_RESULTS_SUCCESS:
      return {
        ...state,
        lastResults: action.payload,
        loading: { ...state.loading, lastResults: STATUS.SUCCESS }
      };

    case actionTypes.MLB_LOAD_LAST_RESULTS_FAIL:
      return {
        ...state,
        lastResults: null,
        loading: { ...state.loading, lastResults: STATUS.FAIL }
      };

    case actionTypes.MLB_LOAD_LAST_AWAY_RESULTS_REQUEST:
      return {
        ...state,
        lastAwayResults: null,
        loading: { ...state.loading, lastAwayResults: STATUS.REQUEST }
      };

    case actionTypes.MLB_LOAD_LAST_AWAY_RESULTS_SUCCESS:
      return {
        ...state,
        lastAwayResults: action.payload,
        loading: { ...state.loading, lastAwayResults: STATUS.SUCCESS }
      };

    case actionTypes.MLB_LOAD_LAST_AWAY_RESULTS_FAIL:
      return {
        ...state,
        lastAwayResults: null,
        loading: { ...state.loading, lastAwayResults: STATUS.FAIL }
      };

    default:
      return state;
  }
};
