import React, { Component } from 'react';
import { LoadingIcon } from '../../Icons';
import Wrapper from './styled';
import moment from 'moment-timezone';
import { getWeekName } from '../formatter';

class RankingsTable extends Component {
  getCSTDate = date => {
    let updated = moment(date)
      .tz('America/Chicago')
      .format();
    let dateStrArr = updated.split('T')[0].split('-');
    let timeStrArr = updated.split('T')[1].split(':');

    let updatedStr = `${getWeekName(
      moment(date)
        .tz('America/Chicago')
        .day()
    )}, ${moment(dateStrArr[1], 'MM').format('MMM')} ${dateStrArr[2]}, ${
      timeStrArr[0] > 12 ? timeStrArr[0] - 12 : timeStrArr[0]
    }:${timeStrArr[1]}${timeStrArr[0] > 11 ? 'PM' : 'AM'} CT`;
    return updatedStr;
  };

  render() {
    const { list, loading } = this.props;
    return (
      <Wrapper>
        {loading ? (
          <LoadingIcon />
        ) : list.length === 0 ? (
          <div className="no-items">No Items to display!</div>
        ) : (
          <div className="rankings-table">
            {list.map((row, index) => (
              <div key={index} className="rankings-row">
                <div className="rank-num">{row.rank}.</div>
                <div className="rank-data">
                  <div className="rank-name">
                    <img
                      alt=""
                      src={`https://firebasestorage.googleapis.com/v0/b/bet-chicago.appspot.com/o/staticassests%2Fncaamb%2Fteam%2Flogo_60%2F${row.market.replace(
                        / /g,
                        '-'
                      )}-${row.name.replace(/ /g, '-')}.png?alt=media`}
                    />
                    {row.market} <span>{`(${row.wins}-${row.losses})`}</span>
                  </div>
                  {row.nextGame && (
                    <div className="next-game">
                      <span>Next: </span>
                      <span>{`${
                        row.nextGame.home.id === row.id
                          ? 'vs ' + row.nextGame.away.name
                          : '@' + row.nextGame.home.name
                      }`}</span>
                      <span> - </span> <div className="item-break" />
                      <span>{this.getCSTDate(row.nextGame.scheduled)}</span>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </Wrapper>
    );
  }
}

export default RankingsTable;
