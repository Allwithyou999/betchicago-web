import React, { Component } from 'react';
import { LoadingIcon } from '../../Icons';
import Wrapper, { DetailClose } from './styled';
import DetailView from './DetailView';

class ScheduleTable extends Component {
  state = {
    showDetail: false
  };

  showDetail = (id, index) => {
    const { list } = this.props;
    this.setState({ showDetail: true, id, data: list[index] });
  };

  closeDetail = () => {
    this.setState({ showDetail: false });
  };

  render() {
    const { list, loading, type } = this.props;

    if (this.state.showDetail) {
      return (
        <div>
          <DetailClose onClick={() => this.closeDetail()}>close</DetailClose>
          <DetailView
            data={this.state.data}
            gameId={this.state.id}
            type={type}
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
          list.map((row, index) => (
            <div
              key={index}
              className="schedule-item"
              onClick={() => this.showDetail(row.id, index)}>
              <div className="teams">
                <div>
                  <img
                    className="team-img"
                    alt=""
                    src={`https://firebasestorage.googleapis.com/v0/b/bet-chicago.appspot.com/o/staticassests%2Fncaamb%2Fteam%2Flogo_60%2F${row.home.name.replace(
                      / /g,
                      '-'
                    )}.png?alt=media`}
                  />
                  {row.home.name}
                </div>
                <div>
                  <img
                    className="team-img"
                    alt=""
                    src={`https://firebasestorage.googleapis.com/v0/b/bet-chicago.appspot.com/o/staticassests%2Fncaamb%2Fteam%2Flogo_60%2F${row.away.name.replace(
                      / /g,
                      '-'
                    )}.png?alt=media`}
                  />
                  {row.away.name}
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
          ))
        )}
      </Wrapper>
    );
  }
}

export default ScheduleTable;
