import axios from 'axios';
import { loadDataOnce, db } from './firebase';
import { formatDateFull } from '../modules/utilities/formatter';
import * as actionTypes from '../actions/mlb';

export const loadStandingsData = () => {
  const path = `sportRadarStore/mlb/2019/REG/standings/league/season`;
  return dispatch => {
    loadDataOnce(
      path,
      dispatch,
      actionTypes.MLB_LOAD_STANDINGS_REQUEST,
      actionTypes.MLB_LOAD_STANDINGS_SUCCESS,
      actionTypes.MLB_LOAD_STANDINGS_FAIL
    );
  };
};

export const loadScoreboardData = date => {
  const path = `sportRadarStore/mlb/daily/${date}/boxscore`;
  return dispatch => {
    loadDataOnce(
      path,
      dispatch,
      actionTypes.MLB_LOAD_SCOREBOARD_REQUEST,
      actionTypes.MLB_LOAD_SCOREBOARD_SUCCESS,
      actionTypes.MLB_LOAD_SCOREBOARD_FAIL
    );
  };
};

export const loadTeamSlugs = () => {
  const path = `teamSlugs/mlb`;
  return dispatch => {
    loadDataOnce(
      path,
      dispatch,
      actionTypes.MLB_LOAD_TEAM_SLUGS_REQUEST,
      actionTypes.MLB_LOAD_TEAM_SLUGS_SUCCESS,
      actionTypes.MLB_LOAD_TEAM_SLUGS_FAIL
    );
  };
};

export const loadOdds = date => {
  let tomorrow = new Date(date);
  let today = formatDateFull(date, true);
  tomorrow = tomorrow.setDate(tomorrow.getDate() + 1);
  tomorrow = formatDateFull(new Date(tomorrow), true);

  return dispatch => {
    dispatch({ type: actionTypes.MLB_LOAD_ODDS_REQUEST });

    const curr = db()
      .ref(`sportRadarStore/odds/dailyScheduleBySport/3/${today}/sport_events`)
      .once('value');
    const next = db()
      .ref(
        `sportRadarStore/odds/dailyScheduleBySport/3/${tomorrow}/sport_events`
      )
      .once('value');
    Promise.all([curr, next])
      .then(results => {
        dispatch({
          type: actionTypes.MLB_LOAD_ODDS_SUCCESS,
          payload: [...results[0].val(), ...results[1].val()]
        });
      })
      .catch(e => {
        dispatch({
          type: actionTypes.MLB_LOAD_ODDS_FAIL,
          payload: null
        });
      });
  };
};

export const loadGameCoverage = id => {
  const path = `sportRadarStore/mlb/games/${id}`;
  return dispatch => {
    loadDataOnce(
      path,
      dispatch,
      actionTypes.MLB_LOAD_GAME_COVERAGE_REQUEST,
      actionTypes.MLB_LOAD_GAME_COVERAGE_SUCCESS,
      actionTypes.MLB_LOAD_GAME_COVERAGE_FAIL
    );
  };
};

export const loadHomeTeamStats = id => {
  return dispatch => {
    dispatch({ type: actionTypes.MLB_LOAD_HOME_TEAM_STATS_REQUEST });

    axios
      .post(
        `https://us-central1-bet-chicago.cloudfunctions.net/api/mlb/teamseasondata?teamId=${id}&type=statistics&year=${new Date().getFullYear()}&season=REG`
      )
      .then(result => {
        dispatch({
          type: actionTypes.MLB_LOAD_HOME_TEAM_STATS_SUCCESS,
          payload: result.data[0] || result.data.data
        });
      })
      .catch(err => {
        dispatch({
          type: actionTypes.MLB_LOAD_HOME_TEAM_STATS_FAIL
        });
      });
  };
};

export const loadAwayTeamStats = id => {
  return dispatch => {
    dispatch({ type: actionTypes.MLB_LOAD_AWAY_TEAM_STATS_REQUEST });

    axios
      .post(
        `https://us-central1-bet-chicago.cloudfunctions.net/api/mlb/teamseasondata?teamId=${id}&type=statistics&year=${new Date().getFullYear()}&season=REG`
      )
      .then(result => {
        dispatch({
          type: actionTypes.MLB_LOAD_AWAY_TEAM_STATS_SUCCESS,
          payload: result.data[0] || result.data.data
        });
      })
      .catch(err => {
        dispatch({
          type: actionTypes.MLB_LOAD_AWAY_TEAM_STATS_FAIL
        });
      });
  };
};

export const loadTeamSchedule = id => {
  return dispatch => {
    dispatch({ type: actionTypes.MLB_LOAD_TEAM_SCHEDULE_REQUEST });

    const awayRequest = db()
      .ref(`sportRadarStore/mlb/2019/REG/schedule/games`)
      .orderByChild('away_team')
      .equalTo(id)
      .once('value');
    const homeRequest = db()
      .ref(`sportRadarStore/mlb/2019/REG/schedule/games`)
      .orderByChild('home_team')
      .equalTo(id)
      .once('value');
    Promise.all([homeRequest, awayRequest])
      .then(results => {
        dispatch({
          type: actionTypes.MLB_LOAD_TEAM_SCHEDULE_SUCCESS,
          payload: { ...results[0].val(), ...results[1].val() }
        });
      })
      .catch(e => {
        dispatch({
          type: actionTypes.MLB_LOAD_TEAM_SCHEDULE_FAIL,
          payload: null
        });
      });
  };
};

export const loadUpcomingSchedules = date => {
  return dispatch => {
    dispatch({ type: actionTypes.MLB_LOAD_UPCOMING_SCHEDULE_REQUEST });

    db()
      .ref(`sportRadarStore/mlb/2019/REG/schedule/games`)
      .orderByChild('scheduled')
      .startAt(`${date}+00:00`)
      .limitToFirst(50)
      .once('value')
      .then(result => {
        dispatch({
          type: actionTypes.MLB_LOAD_UPCOMING_SCHEDULE_SUCCESS,
          payload: result.val()
        });
      })
      .catch(e => {
        dispatch({
          type: actionTypes.MLB_LOAD_UPCOMING_SCHEDULE_FAIL,
          payload: null
        });
      });
  };
};

export const loadSchedules = (date1, date2) => {
  return dispatch => {
    dispatch({ type: actionTypes.MLB_LOAD_SCHEDULE_FAIL });

    const request1 = db()
      .ref(`sportRadarStore/mlb/daily/${date1}/schedule/games`)
      .once('value');
    const request2 = db()
      .ref(`sportRadarStore/mlb/daily/${date2}/schedule/games`)
      .once('value');
    const request3 = db()
      .ref(`sportRadarStore/mlb/daily/${date1}/boxscore`)
      .once('value');
    const request4 = db()
      .ref(`sportRadarStore/mlb/daily/${date2}/boxscore`)
      .once('value');

    Promise.all([request1, request2, request3, request4])
      .then(results => {
        dispatch({
          type: actionTypes.MLB_LOAD_SCHEDULE_SUCCESS,
          payload: {
            prev: results[0].val(),
            current: results[1].val(),
            prevBox: results[2].val(),
            currBox: results[3].val()
          }
        });
      })
      .catch(e => {
        dispatch({
          type: actionTypes.MLB_LOAD_SCHEDULE_FAIL,
          payload: null
        });
      });
  };
};

export const loadTeamApArticle = (tag, pageLen) => {
  return dispatch => {
    dispatch({ type: actionTypes.MLB_LOAD_TEAM_AP_ARTICLE_REQUEST });

    db()
      .ref(`apArticleStore/skinny/byTag/${tag}`)
      .orderByValue()
      .limitToLast(pageLen)
      .once('value')
      .then(result => {
        this.resultIds = result.val();

        let promises = [];
        for (let id in this.resultIds)
          promises.push(
            db()
              .ref(`apArticleStore/skinny/smallById/${id}`)
              .once('value')
          );

        return Promise.all(promises);
      })
      .then(rawResultList => {
        let articles = [];
        let c = 0;
        let resultList = [];
        for (let id in this.resultIds) {
          resultList[c] = rawResultList[c].val();
          if (resultList[c]) {
            resultList[c].id = id;
            articles.push(resultList[c]);
          }
          c++;
        }
        articles = articles.sort((a, b) => {
          if (a.editDate > b.editDate) return -1;
          if (a.editDate < b.editDate) return 1;
          return 0;
        });
        this.apArticles = articles;

        let articleList = [];
        if (this.apArticles) {
          for (let c = 0, l = this.apArticles.length; c < l; c++) {
            if (!this.apArticles[c].apcmSlugLine) continue;

            let href = this.apArticles[c].apcmSlugLine
              .toLowerCase()
              .replace(/[[\]{}"'()*+? .\\^$|]/g, '');
            let article = this.apArticles[c];
            let image = '';

            if (article.mainMedia) {
              if (article.mainMedia.refs) {
                let imageId = article.mainMedia.refs[1].id.split(':')[1];
                image = `https://www.googleapis.com/download/storage/v1/b/bet-chicago.appspot.com/o/apimages%2F${
                  article.id
                }-${imageId}.jpg?alt=media`;
              }
            }

            articleList.push({
              headline: this.apArticles[c].apcmHeadLine,
              id: this.apArticles[c].id,
              editDate: this.apArticles[c].editDate,
              url: href,
              authors: [
                {
                  fullname: 'AP',
                  title: 'AP'
                }
              ],
              image,
              imageLink: image,
              summary:
                this.apArticles[c].summary
                  .split(' ')
                  .splice(0, 50)
                  .join(' ') + '...',
              href,
              title: this.apArticles[c].apcmHeadLine
            });
          }
        }

        dispatch({
          type: actionTypes.MLB_LOAD_TEAM_AP_ARTICLE_SUCCESS,
          payload: articleList
        });
      })
      .catch(e => {
        dispatch({
          type: actionTypes.MLB_LOAD_TEAM_AP_ARTICLE_FAIL,
          payload: null
        });
      });
  };
};

export const loadTeamLastResults = (id, isHome = true, cnt = 10) => {
  return dispatch => {
    if (isHome) {
      dispatch({ type: actionTypes.MLB_LOAD_LAST_RESULTS_REQUEST });
    } else {
      dispatch({ type: actionTypes.MLB_LOAD_LAST_AWAY_RESULTS_REQUEST });
    }

    loadTeamPrevGameResult(id, cnt)
      .then(results => {
        if (isHome) {
          dispatch({
            type: actionTypes.MLB_LOAD_LAST_RESULTS_SUCCESS,
            payload: results
          });
        } else {
          dispatch({
            type: actionTypes.MLB_LOAD_LAST_AWAY_RESULTS_SUCCESS,
            payload: results
          });
        }
      })
      .catch(e => {
        if (isHome) {
          dispatch({
            type: actionTypes.MLB_LOAD_LAST_RESULTS_FAIL,
            payload: null
          });
        } else {
          dispatch({
            type: actionTypes.MLB_LOAD_LAST_AWAY_RESULTS_FAIL,
            payload: null
          });
        }
      });
  };
};

const loadTeamPrevGameResult = async (id, cnt) => {
  try {
    const awayRequest = db()
      .ref(`sportRadarStore/mlb/2019/REG/schedule/games`)
      .orderByChild('away_team')
      .equalTo(id)
      .once('value');
    const homeRequest = db()
      .ref(`sportRadarStore/mlb/2019/REG/schedule/games`)
      .orderByChild('home_team')
      .equalTo(id)
      .once('value');
    const results = await Promise.all([homeRequest, awayRequest]);
    const schedule = { ...results[0].val(), ...results[1].val() };

    //Get LAST_10 from Schedule
    const closedSchedule = Object.keys(schedule)
      .filter(key => schedule[key].status === 'closed')
      .map(key => schedule[key])
      .sort(
        (a, b) =>
          new Date(b.scheduled).getTime() - new Date(a.scheduled).getTime()
      )
      .slice(0, 10)
      .map(s => {
        const date = s.scheduled
          .substr(0, 10)
          .split('-')
          .join('/');
        return db()
          .ref(`sportRadarStore/mlb/daily/${date}/summary/league/games`)
          .orderByChild('game/id')
          .equalTo(s.id)
          .once('value');
      });

    let win = 0,
      loss = 0;
    const games = await Promise.all(closedSchedule);
    games.forEach(g => {
      const gameList = g.val();
      if (gameList) {
        Object.keys(gameList).forEach(key => {
          const game = gameList[key];
          if (game) {
            if (game.game.away.runs > game.game.home.runs) {
              game.game.away_team === id ? win++ : loss++;
            } else {
              game.game.away_team === id ? loss++ : win++;
            }
          }
        });
      }
    });

    return { win, loss };
  } catch (error) {
    console.log(error);
  }
};
