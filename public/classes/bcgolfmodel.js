class BCGolfModel extends BCFirebaseModel {
  constructor() {
    super();
  }
  init() {
    return super.init().then(() => this.loadSchedule());
  }
  loadSchedule() {
    return this.loadPath(`sportRadarStore/golf/pga/2019/skinnySchedule`).then(
      schedule => this._processSchedule(schedule)
    );
  }
  _processSchedule(schedule) {
    this.rawSchedule = schedule;
    let tourId;
    let round = 1;
    if (!schedule) return Promise.resolve(null);

    if (!schedule.tournaments) return Promise.resolve(null);

    this.tournaments = schedule.tournaments;
    this.complete = [];
    this.scheduled = [];
    this.inProgress = null;

    let curDate = new Date(new Date().toISOString().substr(0, 10));
    for (let c = 0, l = this.tournaments.length; c < l; c++) {
      let t = this.tournaments[c];
      let sd = new Date(t.start_date);
      let ed = new Date(t.end_date);
      if (ed <= curDate) this.complete.push(t);
      else if (sd >= curDate) this.scheduled.push(t);
      else if (ed <= curDate && sd >= curDate) this.inProgress = t;
    }

    this.lastComplete = this.complete[this.complete.length - 1];
    this.nextScheduled = this.scheduled[0];
    this.currentTourId = this.nextScheduled.id;
    if (this.inProgress) this.currentTourId = this.inProgress.id;
    else this.currentTourId = this.nextScheduled.id;

    //round based on schedule - not results
    this.currentRound = 1;
    if (this.inProgress) {
      if (new Date().getDay() > 3) round = new Date().getDay() - 3;
      else if (new Date().getDay() === 0) round = 4;
    }

    /*
        this.props.loadCurrentTeetimeList(tourId, round);

        //Get current week's tournament name
        if (summary.status !== 'closed') {
          this.setState({ tourName: summary.name })
        } else {
          let nextSchedules = schedule.tournaments
            .filter(s => new Date(s.start_date).getTime() > new Date().getTime())
            .sort((a, b) => new Date(a.start_date).getTime() - new Date(b.start_date).getTime())[0];

          if (nextSchedules) {
            this.setState({ tourName: nextSchedules.name })
          }
        }
      }
*/
  }

  /*
  loadPlayerRankings() {
    const year = new Date().getFullYear();
    const currRank = db()
      .ref(`sportRadarStore/golf/pga/${year}/rankings`)
      .once('value');
    const priorRank = db()
      .ref(`sportRadarStore/golf/pga/${year - 1}/rankings`)
      .once('value');

    Promise.all([currRank, priorRank])
      .then(results => {
        let curr = results[0].val();
        let prior = results[1].val();

        for (let i = 0; i < curr.players.length; i++) {
          const player = curr.players[i];
          if (prior.playersById[player.id]) {
            player.last_year_rank = prior.playersById[player.id].rank;
          } else {
            player.last_year_rank = '- -';
          }
        }
      })
  }
  loadLeaderboardData(id) {
    const leaderboard = db()
      .ref(
        `sportRadarStore/golf/pga/2019/tournaments/${id}/leaderboard/leaderboard`
      )
      .once('value');
    const summary = db()
      .ref(`sportRadarStore/golf/pga/2019/tournaments/${id}/summary`)
      .once('value');

    Promise.all([leaderboard, summary])
      .then(results => {
        payload: {
          players: results[0].val(),
          summary: results[1].val()
        }
      });
  }
  loadSchedule() {
    const path = `sportRadarStore/golf/pga/2019/skinnySchedule`;
    loadDataOnce(
      path);
  }
  loadOdds() {
    const path = `sportRadarStore/odds/mappings/categoryRights/sr-category-28/outrights`;
    loadDataOnce(path);
  }
  loadCurrentTournament(tourId) {
    if (tourId) {
      loadLeaderboardData(tourId);
      return;
    }

    const path = `applicationConfig/golfTournament`;
    getDataOnce(path).then(result => {
      loadLeaderboardData(result.val())(dispatch);
    });
  }
  loadCurrentTeetimeList(currentTourId, round) {

    db()
      .ref(
        `sportRadarStore/golf/pga/2019/tournaments/${currentTourId}/rounds/${round}/teetimes/round/courses/0/pairings`
      )
      .orderByChild('tee_time')
      .startAt(new Date().toISOString())
      .limitToFirst(10)
      .once('value')
      .then(result => {
        let payload = result.val();
        if (!payload) {
          payload = {};
        }
        dispatch({
          type: actionTypes.GOLF_LOAD_CURRENT_TEETIME_SUCCESS,
          payload
        });
      })
  }
  loadTourListByYear(yearList) {

    const request = yearList.map(year =>
      db()
      .ref(`sportRadarStore/golf/pga/${year}/tournamentList`)
      .once('value')
    );

    Promise.all(request)
      .then(results => {
        const payload = results.map(result => result.val());

      })
  }
  loadTourList() {
    const path = `applicationConfig/golfYear`;

    db()
      .ref(`applicationConfig/golfYear`)
      .once('value')
      .then(result => {

        loadTourListByYear(result.val());
      })
  }
  loadGolfLeaders() {

    const req1 = db()
      .ref(`sportRadarStore/golf/pga/2019/statistics/players`)
      .orderByChild('statistics/earnings')
      .limitToLast(5)
      .once('value');
    const req2 = db()
      .ref(`sportRadarStore/golf/pga/2019/statistics/players`)
      .orderByChild('statistics/points')
      .limitToLast(5)
      .once('value');

    Promise.all([req1, req2])
      .then(results => {
        results;
      });
  }
  loadPlayerStats(id) {
    const req1 = db()
      .ref(`sportRadarStore/golf/pga/2019/statistics/playersById/${id}`)
      .once('value');
    const req2 = db()
      .ref(`sportRadarStore/golf/pga/2019/playerProfiles/playersById/${id}`)
      .once('value');

    Promise.all([req1, req2])
      .then(results => {
        dispatch({
          type: actionTypes.GOLF_LOAD_PLAYER_STATS_SUCCESS,
          payload: {
            stats: results[0].val() || {},
            profile: results[1].val() || {}
          }
        });
      })
  }
  loadWinnerData(tourIds) {
    const reqs = tourIds.map(id =>
      db()
      .ref(
        `sportRadarStore/golf/pga/2019/tournaments/${id}/leaderboard/leaderboard/0`
      )
      .once('value')
    );

    Promise.all(reqs)
      .then(results => {
        let winnerList = {};
        tourIds.forEach((tourId, index) => {
          winnerList[tourId] = results[index].val();
        });
      })
  }
  loadPlayerTournamentData(id) {
    loadPlayerTourData(id)
  }

*/
}
