import React, { Component } from 'react';
import * as firebase from 'firebase';

import Wrapper from './styled';
import PlayerStatsTable from '../../PlayerStatsTable';
import TeamScheduleTable from '../../TeamScheduleTable';

class TeamView extends Component {
  state = {
    showDetail: false,
    loading: true,
    team: null,
    selectedNav: 1
  };

  componentDidMount() {
    this.loadData();
  }

  loadData = () => {
    const { teamId } = this.props;

    let path = `/sportRadarStore/nba/year/2018/REG/teams/${teamId}`;
    firebase
      .database()
      .ref(path)
      .once('value')
      .then(res => {
        let team = res.val();
        this.setState({
          team
        });
      });
  };

  render() {
    const { data, rank, conf } = this.props;

    console.log('data', this.state, data, rank, conf);

    return (
      <Wrapper>
        <div className="teamTable-heading">
          <img
            className="team-img"
            alt=""
            src={`https://firebasestorage.googleapis.com/v0/b/bet-chicago.appspot.com/o/staticassests%2Fncaamb%2Fteam%2Flogo_60%2F${data.market.replace(
              / /g,
              '-'
            )}-${data.name.replace(/ /g, '-')}.png?alt=media`}
          />
          <div>
            {data.market} {data.name}
          </div>
          <div>
            {data.wins}-{data.losses} {data.conf} ({conf.name})
          </div>
        </div>
        <div className="teamTable-nav">
          <span
            className={this.state.selectedNav === 0 ? 'active' : ''}
            onClick={() => this.setState({ selectedNav: 0 })}>
            News
          </span>
          <span
            className={this.state.selectedNav === 1 ? 'active' : ''}
            onClick={() => this.setState({ selectedNav: 1 })}>
            Schedule
          </span>
          <span
            className={this.state.selectedNav === 2 ? 'active' : ''}
            onClick={() => this.setState({ selectedNav: 2 })}>
            Players
          </span>
        </div>
        {this.state.selectedNav === 0 && <div className="teamTable-news" />}
        {this.state.selectedNav === 1 && this.state.team && (
          <TeamScheduleTable data={this.state.team} />
        )}
        {this.state.selectedNav === 2 && (
          <PlayerStatsTable
            data={this.state.team.stats.players}
            imgURL=""
            title="Players & Game Averages"
          />
        )}
      </Wrapper>
    );
  }
}

export default TeamView;
