import React, { Component } from 'react';
import Wrapper from './styled';

class TwoTeamStackupTable extends Component {
  state = {
    showDetail: false,
    loading: true,
    gameData: null
  };

  percentformat = number => {
    return (number * 100).toFixed(1);
  };

  render() {
    const { home, away, type } = this.props;

    return (
      <Wrapper>
        <div className="TwoTeamStackupTable-heading">
          <img
            className="team-img"
            alt=""
            src={`https://firebasestorage.googleapis.com/v0/b/bet-chicago.appspot.com/o/staticassests%2F${
              type ? type : 'ncaamb'
            }%2Fteam%2Flogo_60%2F${home.market.replace(
              / /g,
              '-'
            )}-${home.name.replace(/ /g, '-')}.png?alt=media`}
          />
          <span>Stack Up</span>
          <img
            className="team-img"
            alt=""
            src={`https://firebasestorage.googleapis.com/v0/b/bet-chicago.appspot.com/o/staticassests%2F${
              type ? type : 'ncaamb'
            }%2Fteam%2Flogo_60%2F${away.market.replace(
              / /g,
              '-'
            )}-${away.name.replace(/ /g, '-')}.png?alt=media`}
          />
        </div>
        <div className="TwoTeamStackupTable-row">
          <span>
            {home.wins}-{home.losses}
          </span>
          <span>Record</span>
          <span>
            {away.wins}-{away.losses}
          </span>
        </div>
        {/* <div className="TwoTeamStackupTable-row">
          <span>14-2</span>
          <span>ATS Record</span>
          <span>14-2</span>
        </div>
        <div className="TwoTeamStackupTable-row">
          <span>14-2</span>
          <span>O-U Record</span>
          <span>14-2</span>
        </div>
        <div className="TwoTeamStackupTable-row">
          <span>14-2</span>
          <span>Home/Away Record</span>
          <span>14-2</span>
        </div>*/}
        {home.stats && away.stats && (
          <div className="TwoTeamStackupTable-row">
            <span>{home.stats.own_record.average.points}</span>
            <span>Points Per Game</span>
            <span>{away.stats.own_record.average.points}</span>
          </div>
        )}
        {home.stats && away.stats && (
          <div className="TwoTeamStackupTable-row">
            <span>
              {this.percentformat(
                home.stats.own_record.average.field_goals_made /
                  home.stats.own_record.average.field_goals_att
              )}
            </span>
            <span>Field Goal%</span>
            <span>
              {this.percentformat(
                away.stats.own_record.average.field_goals_made /
                  away.stats.own_record.average.field_goals_att
              )}
            </span>
          </div>
        )}
        {home.stats && away.stats && (
          <div className="TwoTeamStackupTable-row">
            <span>
              {this.percentformat(
                home.stats.opponents.average.field_goals_made /
                  home.stats.opponents.average.field_goals_att
              )}
            </span>
            <span>OPP Field Goal%</span>
            <span>
              {this.percentformat(
                away.stats.opponents.average.field_goals_made /
                  away.stats.opponents.average.field_goals_att
              )}
            </span>
          </div>
        )}
        {home.stats && away.stats && (
          <div className="TwoTeamStackupTable-row">
            <span>
              {this.percentformat(
                home.stats.own_record.average.free_throws_made /
                  home.stats.own_record.average.free_throws_att
              )}
            </span>
            <span>Free Throw%</span>
            <span>
              {this.percentformat(
                away.stats.own_record.average.free_throws_made /
                  away.stats.own_record.average.free_throws_att
              )}
            </span>
          </div>
        )}
        {home.stats && away.stats && (
          <div className="TwoTeamStackupTable-row">
            <span>{home.stats.opponents.average.points}</span>
            <span>Points Allowed</span>
            <span>{away.stats.opponents.average.points}</span>
          </div>
        )}
        {home.stats && away.stats && (
          <div className="TwoTeamStackupTable-row">
            <span>{home.stats.own_record.average.rebounds}</span>
            <span>Rebounding</span>
            <span>{away.stats.own_record.average.rebounds}</span>
          </div>
        )}
        {home.stats && away.stats && (
          <div className="TwoTeamStackupTable-row">
            <span>{home.stats.own_record.average.turnovers}</span>
            <span>Turnovers</span>
            <span>{away.stats.own_record.average.turnovers}</span>
          </div>
        )}
      </Wrapper>
    );
  }
}

export default TwoTeamStackupTable;
