import React, { Component } from 'react';
import { LoadingIcon } from '../../Icons';
import Wrapper, { TeamClose, Title } from './styled';
import TeamView from './TeamView';

class ConferenceStandingTable extends Component {
  state = {
    showTeam: false,
    rank: 0,
    curConf: {}
  };

  showTeam = (id, team, index, conf) => {
    this.setState({
      showTeam: true,
      id,
      data: team,
      rank: index + 1,
      curConf: conf
    });
  };

  hideTeam = () => {
    this.setState({ showTeam: false });
  };

  render() {
    const { confs, loading, type } = this.props;

    if (this.state.showTeam) {
      return (
        <div>
          <TeamClose onClick={() => this.hideTeam()}>close</TeamClose>
          <TeamView
            data={this.state.data}
            teamId={this.state.id}
            rank={this.state.rank}
            conf={this.state.curConf}
          />
        </div>
      );
    }

    return (
      <Wrapper>
        {loading ? (
          <LoadingIcon />
        ) : confs && confs.length === 0 ? (
          <div className="no-items">No Conference!</div>
        ) : (
          confs.map((conf, confid) => (
            <div>
              <Title>{conf.name}</Title>
              {conf.divisions.map((division, ind) => (
                <div>
                  <div className="teams-header teams">
                    <div className="name">{division.name}</div>
                    <div>W-L</div>
                    <div>CONF</div>
                    <div>ATS</div>
                    <div>O-U</div>
                  </div>
                  <div className="teams-table">
                    {division.teams.map((row, index) => (
                      <div
                        key={index}
                        className="teams"
                        onClick={() => this.showTeam(row.id, row, index, conf)}>
                        <div className="name">
                          <img
                            className="team-img"
                            alt=""
                            src={`https://firebasestorage.googleapis.com/v0/b/bet-chicago.appspot.com/o/staticassests%2F${type}%2Fteam%2Flogo_60%2F${row.market.replace(
                              / /g,
                              '-'
                            )}-${row.name.replace(/ /g, '-')}.png?alt=media`}
                          />
                          {row.market}{' '}
                          {document.body.clientWidth >= 768
                            ? row.name
                            : row.alias}
                        </div>
                        <div>{`${row.wins}-${row.losses}`}</div>
                        <div>{row.conf}</div>
                        <div>??-??</div>
                        <div>??-??</div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          ))
        )}
      </Wrapper>
    );
  }
}

export default ConferenceStandingTable;
