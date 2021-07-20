import { combineReducers } from 'redux';
import { routerReducer } from 'react-router-redux';
import golfReducer from '../reducers/golf';
import mlbReducer from '../reducers/mlb';
import nbaReducer from '../reducers/nba';
import nflReducer from '../reducers/nfl';
import articleReducer from '../reducers/article';
import userReducer from '../reducers/user';

export default combineReducers({
  router: routerReducer,
  golf: golfReducer,
  mlb: mlbReducer,
  nba: nbaReducer,
  nfl: nflReducer,
  article: articleReducer,
  user: userReducer
});
