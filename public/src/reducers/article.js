import * as actionTypes from '../actions/article';
import { STATUS } from '../modules/constants/common';

const initialState = {
  articles: [],
  articlesBySection: {},
  loading: {
    articles: STATUS.REQUEST,
    articlesBySection: {}
  }
};

export default (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.LOAD_ARTICLES_REQUEST:
      return {
        ...state,
        articles: [],
        loading: { ...state.loading, articles: STATUS.REQUEST }
      };

    case actionTypes.LOAD_ARTICLES_SUCCESS:
      return {
        ...state,
        articles: action.payload,
        loading: { ...state.loading, articles: STATUS.SUCCESS }
      };

    case actionTypes.LOAD_ARTICLES_FAIL:
      return {
        ...state,
        articles: [],
        loading: { ...state.loading, articles: STATUS.FAIL }
      };

    case actionTypes.LOAD_ARTICLES_BY_SECTION_REQUEST:
      return {
        ...state,
        articlesBySection: {
          ...state.articlesBySection
        },
        loading: {
          ...state.loading,
          articlesBySection: {
            ...state.loading.articlesBySection,
            [action.payload.id]: STATUS.REQUEST
          }
        }
      };

    case actionTypes.LOAD_ARTICLES_BY_SECTION_SUCCESS:
      return {
        ...state,
        articlesBySection: {
          ...state.articlesBySection,
          [action.payload.id]: action.payload.articles
        },
        loading: {
          ...state.loading,
          articlesBySection: {
            ...state.loading.articlesBySection,
            [action.payload.id]: STATUS.SUCCESS
          }
        }
      };

    case actionTypes.LOAD_ARTICLES_BY_SECTION_FAIL:
      return {
        ...state,
        loading: {
          ...state.loading,
          articlesBySection: {
            ...state.loading.articlesBySection,
            [action.payload.id]: STATUS.FAIL
          }
        }
      };

    case actionTypes.REMOVE_ARTICLE:
      const currentArticles = (state.articles || []).filter(article => article.sys.id !== action.payload);
      return {
        ...state,
        articles: currentArticles,
      };

    default:
      return state;
  }
};
