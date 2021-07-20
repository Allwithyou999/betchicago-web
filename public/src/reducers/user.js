import * as actionTypes from '../actions/user';

const initialState = {
  user: null,
  loading: true,
};

export default (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.LOADING_USER:
      return {
        ...state,
        loading: true,
      };

    case actionTypes.SET_USER:
      return {
        ...state,
        user: action.payload,
        loading: false,
      };

    case actionTypes.UPDATE_USER:
      return {
        ...state,
        user: {
          ...state.user,
          ...action.payload,
        }
      };

    case actionTypes.REMOVE_FAVORITE_TEAM:
      const userFavoriteTeams = state.user.favoriteTeams;
      delete userFavoriteTeams[action.payload];

      return {
        ...state,
        user: {
          ...state.user,
          favoriteTeams: userFavoriteTeams,
        }
      };

    case actionTypes.REMOVE_FAVORITE_PLAYER:
      const userFavoritePlayers = state.user.favoritePlayers;
      delete userFavoritePlayers[action.payload];

      return {
        ...state,
        user: {
          ...state.user,
          favoritePlayers: userFavoritePlayers,
        }
      };

    default:
      return state;
  }
};
