import React, { Component } from 'react';
import Wrapper from './styled';

class PlayerStatsTable extends Component {
  state = {
    // loading: true,
  };

  render() {
    const { data, gameStats, imgURL, title } = this.props;

    return (
      <Wrapper>
        <div className="playerStatsTable-big-heading">
          {imgURL !== '' ? (
            <img className="team-img" alt="" src={imgURL} />
          ) : (
            <div />
          )}
          <span>{title}</span>
        </div>
        <div className="playerStatsTable-heading">
          <span>P</span>
          <span>Player</span>
          <span>PTS</span>
          <span>FG{gameStats ? '' : '%'}</span>
          <span>3PT{gameStats ? '' : '%'}</span>
          <span>FT{gameStats ? '' : '%'}</span>
          <span>REB</span>
          {gameStats && <span>OREB</span>}
          <span>AST</span>
          <span>STL</span>
          <span>TO</span>
        </div>
        {data.map((row, index) =>
          gameStats ? (
            <div key={index} className="playerStatsTable-row">
              <span>{row.position}</span>
              <span>{row.full_name}</span>
              <span>{row.statistics ? row.statistics.points : 0}</span>
              <span>
                {row.statistics ? row.statistics.field_goals_made : 0} /{' '}
                {row.statistics ? row.statistics.field_goals_att : 0}
              </span>
              <span>
                {row.statistics ? row.statistics.three_points_made : 0} /{' '}
                {row.statistics ? row.statistics.three_points_att : 0}
              </span>
              <span>
                {row.statistics ? row.statistics.free_throws_made : 0} /{' '}
                {row.statistics ? row.statistics.free_throws_att : 0}
              </span>
              <span>{row.statistics ? row.statistics.rebounds : 0}</span>
              <span>
                {row.statistics ? row.statistics.offensive_rebounds : 0}
              </span>
              <span>{row.statistics ? row.statistics.assists : 0}</span>
              <span>{row.statistics ? row.statistics.steals : 0}</span>
              <span>{row.statistics ? row.statistics.turnovers : 0}</span>
            </div>
          ) : (
            <div key={index} className="playerStatsTable-row">
              <span>{row.position}</span>
              <span>{row.full_name}</span>
              <span>{row.average ? row.average.points : 0}</span>
              <span>
                {row.average && row.average.field_goals_att > 0
                  ? (
                      row.average.field_goals_made / row.average.field_goals_att
                    ).toFixed(1)
                  : 0}
              </span>
              <span>
                {row.average && row.average.three_points_att > 0
                  ? (
                      row.average.three_points_made /
                      row.average.three_points_att
                    ).toFixed(1)
                  : 0}
              </span>
              <span>
                {row.average && row.average.free_throws_att > 0
                  ? (
                      row.average.free_throws_made / row.average.free_throws_att
                    ).toFixed(1)
                  : 0}
              </span>
              <span>{row.average ? row.average.rebounds : 0}</span>
              <span>{row.average ? row.average.assists : 0}</span>
              <span>{row.average ? row.average.steals : 0}</span>
              <span>{row.average ? row.average.turnovers : 0}</span>
            </div>
          )
        )}
        <div className="swipe">Swipe to see more stats categories</div>
      </Wrapper>
    );
  }
}

export default PlayerStatsTable;
