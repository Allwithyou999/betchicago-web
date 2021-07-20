import React, { Component } from 'react';
import * as firebase from 'firebase';
import moment from 'moment-timezone';

import { LoadingIcon } from '../../Icons';
import { Wrapper, Link } from './styled';

class ScheduleTable extends Component {
  state = {
    summaryData: [],
    allSchdule: []
  };

  getYear = () => {
    let year = moment()
      .tz('America/Chicago')
      .year();
    if (
      moment()
        .tz('America/Chicago')
        .month() < 5
    ) {
      year = year - 1;
    }
    return year;
  };

  componentDidMount() {
    const { list } = this.props;
    list.forEach(item => {
      if (item.status === 'closed') {
        let newPath = `/sportRadarStore/nba/games/${item.id}/boxscore`;
        firebase
          .database()
          .ref(newPath)
          .once('value')
          .then(resData => {
            let sumData = resData.val();
            let tempSummary = this.state.summaryData;
            tempSummary[sumData.id] = sumData;
            this.setState({ summaryData: tempSummary });
          });
      }
    });
  }

  render() {
    const { list, loading } = this.props;

    return (
      <Wrapper>
        {loading ? (
          <LoadingIcon />
        ) : list.length === 0 ? (
          <div className="no-items">No Items to display!</div>
        ) : (
          list.map((row, index) =>
            row.status === 'closed' ? (
              <Link href={`/nba-betting/game/${row.id}`} key={index}>
                <div key={index} className="schedule-item-score">
                  <div className="score-row">
                    <div>FINAL</div>
                    <div>
                      {this.state.summaryData[row.id] &&
                        this.state.summaryData[row.id].home &&
                        this.state.summaryData[row.id].home.scoring &&
                        this.state.summaryData[row.id].home.scoring.map(
                          (item, index) => (
                            <span key={row.id + 'scoring' + index}>
                              {index + 1}
                            </span>
                          )
                        )}
                      <span>T</span>
                    </div>
                  </div>
                  <div className="score-row">
                    <div>
                      <img
                        className="team-img"
                        alt=""
                        src={`https://firebasestorage.googleapis.com/v0/b/bet-chicago.appspot.com/o/staticassests%2Fnba%2Fteam%2Flogo_60%2F${row.home.name.replace(
                          / /g,
                          '-'
                        )}.png?alt=media`}
                      />
                      <span>
                        {document.body.clientWidth >= 768
                          ? row.home.name
                          : row.home.alias}
                      </span>
                    </div>
                    <div>
                      {this.state.summaryData[row.id] &&
                        this.state.summaryData[row.id].home &&
                        this.state.summaryData[row.id].home.scoring &&
                        this.state.summaryData[row.id].home.scoring.map(
                          (item, index) => (
                            <span key={row.id + 'scoring-home' + index}>
                              {item.points}
                            </span>
                          )
                        )}
                      <span>{row.home.points}</span>
                    </div>
                  </div>
                  <div className="score-row">
                    <div>
                      <img
                        className="team-img"
                        alt=""
                        src={`https://firebasestorage.googleapis.com/v0/b/bet-chicago.appspot.com/o/staticassests%2Fnba%2Fteam%2Flogo_60%2F${row.away.name.replace(
                          / /g,
                          '-'
                        )}.png?alt=media`}
                      />
                      <span>
                        {document.body.clientWidth >= 768
                          ? row.away.name
                          : row.away.alias}
                      </span>
                    </div>
                    <div>
                      {this.state.summaryData[row.id] &&
                        this.state.summaryData[row.id].away.scoring &&
                        this.state.summaryData[row.id].away.scoring.map(
                          (item, index) => (
                            <span key={row.id + 'scoring-home' + index}>
                              {item.points}
                            </span>
                          )
                        )}
                      <span>{row.away.points}</span>
                    </div>
                  </div>
                  {this.state.summaryData[row.id] &&
                    this.state.summaryData[row.id].home.leaders &&
                    this.state.summaryData[row.id].away.leaders && (
                      <div className="scheduleDetail-score-leader">
                        <div>
                          {
                            this.state.summaryData[row.id].home.leaders
                              .points[0].full_name
                          }
                          ({row.home.alias}):{' '}
                          {
                            this.state.summaryData[row.id].home.leaders
                              .points[0].statistics.points
                          }{' '}
                          PTS,{' '}
                          {
                            this.state.summaryData[row.id].home.leaders
                              .points[0].statistics.rebounds
                          }{' '}
                          REB,{' '}
                          {
                            this.state.summaryData[row.id].home.leaders
                              .points[0].statistics.assists
                          }{' '}
                          AST
                        </div>
                        <div>
                          {
                            this.state.summaryData[row.id].away.leaders
                              .points[0].full_name
                          }
                          ({row.away.alias}):{' '}
                          {
                            this.state.summaryData[row.id].away.leaders
                              .points[0].statistics.points
                          }{' '}
                          PTS,{' '}
                          {
                            this.state.summaryData[row.id].away.leaders
                              .points[0].statistics.rebounds
                          }{' '}
                          REB,{' '}
                          {
                            this.state.summaryData[row.id].away.leaders
                              .points[0].statistics.assists
                          }{' '}
                          AST
                        </div>
                      </div>
                    )}
                </div>
              </Link>
            ) : (
              <Link href={`/nba-betting/game/${row.id}`} key={index}>
                <div key={index} className="schedule-item">
                  <div className="teams">
                    <div>
                      <img
                        className="team-img"
                        alt=""
                        src={`https://firebasestorage.googleapis.com/v0/b/bet-chicago.appspot.com/o/staticassests%2Fnba%2Fteam%2Flogo_60%2F${row.home.name.replace(
                          / /g,
                          '-'
                        )}.png?alt=media`}
                      />
                      <span>
                        {document.body.clientWidth >= 768
                          ? row.home.name
                          : row.home.alias}
                      </span>
                    </div>
                    <div>
                      <img
                        className="team-img"
                        alt=""
                        src={`https://firebasestorage.googleapis.com/v0/b/bet-chicago.appspot.com/o/staticassests%2Fnba%2Fteam%2Flogo_60%2F${row.away.name.replace(
                          / /g,
                          '-'
                        )}.png?alt=media`}
                      />
                      <span>
                        {document.body.clientWidth >= 768
                          ? row.away.name
                          : row.away.alias}
                      </span>
                    </div>
                  </div>
                  <div className="numberandtime">
                    <div className="betNumbers">
                      <div
                        className={
                          row.status === 'closed' &&
                          row.home.points > row.away.points
                            ? 'win'
                            : 'lose'
                        }>
                        {row.status !== 'closed'
                          ? row.home.betNumber
                          : row.home.points}
                      </div>
                      <div
                        className={
                          row.status === 'closed' &&
                          row.home.points < row.away.points
                            ? 'win'
                            : 'lose'
                        }>
                        {row.status !== 'closed'
                          ? row.away.betNumber
                          : row.away.points}
                      </div>
                    </div>
                    <div className="time">
                      {row.status !== 'closed' ? row.time : 'Final'}
                    </div>
                  </div>
                </div>
              </Link>
            )
          )
        )}
      </Wrapper>
    );
  }
}

export default ScheduleTable;
