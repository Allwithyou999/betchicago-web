import * as actionTypes from '../actions/user';

export const setUser = user => {
  return dispatch => {
    dispatch({
      type: actionTypes.SET_USER,
      payload: user,
    });
  };
};

export const updateUser = user => {
  return dispatch => {
    dispatch({
      type: actionTypes.UPDATE_USER,
      payload: user,
    });
  };
};

export const loadingUser = () => {
  return dispatch => {
    dispatch({
      type: actionTypes.LOADING_USER,
    });
  };
}

export const removeFavoriteTeam = (id) => {
  return dispatch => {
    dispatch({
      type: actionTypes.REMOVE_FAVORITE_TEAM,
      payload: id,
    });
  };
}

export const removeFavoritePlayer = (id) => {
  return dispatch => {
    dispatch({
      type: actionTypes.REMOVE_FAVORITE_PLAYER,
      payload: id,
    });
  };
}
