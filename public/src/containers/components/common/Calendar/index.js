import React from 'react';
import Wrapper from './styled';

import { ArrowLeftIcon, ArrowRightIcon } from '../../Icons';
import DayItem from './DayItem';

class CalendarDay extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      offset: 0,
      current: 2
    };
  }

  changeOffset = i => () => {
    this.setState({
      offset: this.state.offset + i,
      current: this.state.current - i
    });
  };

  changeCurrent = current => {
    const { customOffset } = this.props;
    this.setState({ current });
    this.props.onChangeDate(
      new Date().setDate(
        new Date().getDate() -
          2 +
          this.state.offset +
          current +
          (customOffset ? customOffset : 0)
      )
    );
  };

  generateDates = () => {
    const { offset, current } = this.state;
    const { customOffset } = this.props;

    const dates = [];
    for (let i = 0; i < 5; i++) {
      dates.push(
        <DayItem
          key={`day-${i}`}
          date={new Date().setDate(
            new Date().getDate() +
              i -
              2 +
              (customOffset ? customOffset : 0) +
              offset
          )}
          onClick={() => this.changeCurrent(i)}
          active={current === i}
        />
      );
    }
    return dates;
  };

  render() {
    return (
      <Wrapper>
        <div className="icon-holder" onClick={this.changeOffset(-1)}>
          <ArrowLeftIcon color="white" width={8} />
        </div>
        <div className="day-items">{this.generateDates()}</div>
        <div className="icon-holder" onClick={this.changeOffset(1)}>
          <ArrowRightIcon color="white" width={8} />
        </div>
      </Wrapper>
    );
  }
}

export default CalendarDay;
