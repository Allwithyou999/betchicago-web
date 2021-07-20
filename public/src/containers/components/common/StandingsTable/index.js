import React, { Component } from 'react';
import { LoadingIcon } from '../../Icons';
import Wrapper, { TeamClose } from './styled';
import TeamView from './TeamView';

class ScheduleTable extends Component {
  state = {
    showTeam: false,
    rank: 0
  };

  showTeam = (id, index) => {
    const { list } = this.props;
    this.setState({ showTeam: true, id, data: list[index], rank: index + 1 });
  };

  hideTeam = () => {
    this.setState({ showTeam: false });
  };

  render() {
    const { list, loading, conf } = this.props;

    if (this.state.showTeam) {
      return (
        <div>
          <TeamClose onClick={() => this.hideTeam()}>close</TeamClose>
          <TeamView
            data={this.state.data}
            teamId={this.state.id}
            rank={this.state.rank}
            conf={conf}
          />
        </div>
      );
    }

    return (
      <Wrapper>
        {loading ? (
          <LoadingIcon />
        ) : list.length === 0 ? (
          <div className="no-items">No Items to display!</div>
        ) : (
          <div>
            <div className="teams-header teams">
              <div className="name">TEAM</div>
              <div>W-L</div>
              <div>CONF</div>
              <div>ATS</div>
              <div>O-U</div>
            </div>
            <div className="teams-table">
              {list.map((row, index) => (
                <div
                  key={index}
                  className="teams"
                  onClick={() => this.showTeam(row.id, index)}>
                  <div className="name">
                    <img
                      className="team-img"
                      alt=""
                      src={`https://firebasestorage.googleapis.com/v0/b/bet-chicago.appspot.com/o/staticassests%2Fncaamb%2Fteam%2Flogo_60%2F${row.market.replace(
                        / /g,
                        '-'
                      )}-${row.name.replace(/ /g, '-')}.png?alt=media`}
                    />
                    {row.market}
                  </div>
                  <div>{`${row.wins}-${row.losses}`}</div>
                  <div>{row.conf}</div>
                  <div>- -</div>
                  <div>- -</div>
                </div>
              ))}
            </div>
          </div>
        )}
      </Wrapper>
    );
  }
}

export default ScheduleTable;
