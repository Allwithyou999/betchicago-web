import React, { Component } from 'react';
import Wrapper from './styled';
import * as firebase from 'firebase';

import { LoadingIcon } from '../../Icons';

// const API_URL = 'http://localhost:5001/betchicagodev/us-central1/api';
const API_URL = 'https://us-central1-bet-chicago.cloudfunctions.net/api';

class LastGameTable extends Component {
  state = {
    schedule: [],
    loading: true
  };

  processData = async () => {
    const { data, type } = this.props;

    if (!data.schedule) {
      this.setState({ schedule: [], loading: false });
      return;
    }

    let tempData = [];
    let count = 0;

    for (let i = data.schedule.length - 1; i >= 0; i--) {
      if (data.schedule[i].status === 'closed' && count < 10) {
        let path = `/sportRadarStore/${type}/games/${data.schedule[i].id}`;
        let snapshot = await firebase
          .database()
          .ref(path)
          .once('value');
        if (snapshot.val() == null) {
          await fetch(
            `${API_URL}/${type}/updateGameData?gameId=${
              data.schedule[i].id
            }&tag=summary`,
            {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json'
              },
              body: '{}'
            }
          );
          snapshot = await firebase
            .database()
            .ref(path)
            .once('value');
        }
        count++;
      }
    }

    count = 0;
    setTimeout(async () => {
      for (let i = data.schedule.length - 1; i >= 0; i--) {
        if (data.schedule[i].status === 'closed' && count < 10) {
          let path = `/sportRadarStore/${type}/games/${data.schedule[i].id}`;
          let snapshot = await firebase
            .database()
            .ref(path)
            .once('value');
          tempData.push(snapshot.val());
          count++;
        }
      }
      this.setState({ schedule: tempData, loading: false });
    }, 5000);
  };

  componentDidMount() {
    this.processData();
  }

  render() {
    const { imgURL, title, data } = this.props;

    if (this.state.loading) {
      return (
        <div style={{ justifyContent: 'center', display: 'flex' }}>
          <LoadingIcon />
        </div>
      );
    }

    return (
      <Wrapper>
        <div className="LastGameTable-big-heading">
          <img className="team-img" alt="" src={imgURL} />
          <span>{title}</span>
        </div>
        <div className="LastGameTable-heading">
          <span>Date</span>
          <span>OPP</span>
          <span>SCORE</span>
          <span>LINE</span>
          <span>O/U</span>
          <span>FG</span>
          <span>OFG</span>
          <span>REB</span>
        </div>
        {this.state.schedule.length === 0 && (
          <div className="LastGameTable-row">No data found</div>
        )}
        {this.state.schedule.map((row, index) =>
          row &&
          row.summary.status === 'closed' &&
          row.summary.home.name === data.name ? (
            <div key={index} className="LastGameTable-row">
              <span>
                {row.summary.scheduled.substr(5, 5).replace('-', '/')}
              </span>
              <span>{row.summary.away.alias}</span>
              <span>
                {row.summary.home.points > row.summary.away.points ? 'W' : 'L'}{' '}
                {row.summary.home.points}-{row.summary.away.points}
              </span>
              <span>-</span>
              <span>-</span>
              <span>
                {row.summary.home.statistics
                  ? row.summary.home.statistics.field_goals_made
                  : 0}{' '}
                /{' '}
                {row.summary.home.statistics
                  ? row.summary.home.statistics.field_goals_att
                  : 0}
              </span>
              <span>-</span>
              <span>
                {row.summary.home.statistics
                  ? row.summary.home.statistics.rebounds
                  : 0}
                -
                {row.summary.home.statistics
                  ? row.summary.home.statistics.offensive_rebounds
                  : 0}
              </span>
            </div>
          ) : (
            <div key={index} className="LastGameTable-row">
              <span>
                {row.summary.scheduled.substr(5, 5).replace('-', '/')}
              </span>
              <span>@{row.summary.home.alias}</span>
              <span>
                {row.summary.away.points > row.summary.home.points ? 'W' : 'L'}{' '}
                {row.summary.away.points}-{row.summary.home.points}
              </span>
              <span>-</span>
              <span>-</span>
              <span>
                {row.summary.away.statistics
                  ? row.summary.away.statistics.field_goals_made
                  : 0}{' '}
                /{' '}
                {row.summary.away.statistics
                  ? row.summary.away.statistics.field_goals_att
                  : 0}
              </span>
              <span>-</span>
              <span>
                {row.summary.away.statistics
                  ? row.summary.away.statistics.rebounds
                  : 0}
                -
                {row.summary.away.statistics
                  ? row.summary.away.statistics.offensive_rebounds
                  : 0}
              </span>
            </div>
          )
        )}
        <div>Swipe to see more stats categories</div>
      </Wrapper>
    );
  }
}

export default LastGameTable;
