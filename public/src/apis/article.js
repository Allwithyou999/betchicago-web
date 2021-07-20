import axios from 'axios';
import * as actionTypes from '../actions/article';

export const loadArticles = ids => {
  return dispatch => {
    dispatch({ type: actionTypes.LOAD_ARTICLES_REQUEST });

    axios
      .post(
        `https://us-central1-bet-chicago.cloudfunctions.net/api/contentfulapi/articles?idlist=${ids}`
      )
      .then(result => {
        dispatch({
          type: actionTypes.LOAD_ARTICLES_SUCCESS,
          payload: result.data.records
        });
      })
      .catch(err => {
        dispatch({
          type: actionTypes.LOAD_ARTICLES_FAIL
        });
      });
  };
};

export const loadArticlesBySection = (id, pagesize) => {
  return dispatch => {
    dispatch({
      type: actionTypes.LOAD_ARTICLES_BY_SECTION_REQUEST,
      payload: {
        id: id
      }
    });

    axios
      .post(
        `https://us-central1-bet-chicago.cloudfunctions.net/api/contentfulapi/paged?queryfilter=section:${id}&pagesize=${pagesize}`
      )
      .then(result => {
        dispatch({
          type: actionTypes.LOAD_ARTICLES_BY_SECTION_SUCCESS,
          payload: {
            id: id,
            articles: result.data.records
          }
        });
      })
      .catch(err => {
        dispatch({
          type: actionTypes.LOAD_ARTICLES_BY_SECTION_FAIL
        });
      });
  };
};

export const removeArticle = (id) => {
  return dispatch => {
    dispatch({
      type: actionTypes.REMOVE_ARTICLE,
      payload: id,
    });
  };
}
