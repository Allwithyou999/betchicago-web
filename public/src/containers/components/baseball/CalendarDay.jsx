import React from 'react';
import styled from 'styled-components';

import { ArrowLeftIcon, ArrowRightIcon } from '../../../containers/components/Icons';
import DayItem from './DayItem';
import media from '../../../containers/components/Media';

import { THEME_COLORS } from '../../../modules/styles';

const IconHolder = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 28px;
  height: 28px;
  background: ${THEME_COLORS.BLUE};
  border-radius: 50%;
  font-size: 0;
  margin: 0 7px;
  cursor: pointer;
`

const DayItems = styled.div`
  display: inline-flex;
  justify-content: space-around;
  align-items: center;
  max-width: 335px;
  width: 100%;
  cursor:pointer;
`

const Wrapper = styled.div`
  display: inline-flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px 10px;
  margin: -40px -20px 20px;
  background: ${THEME_COLORS.BLUE};

  ${media.tablet} {
    max-width: 460px;
    padding: 0;
    margin: auto;
    background: transparent;
  }

  ${media.desktop} {
    margin: 0;
  }
`

class CalendarDay extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      offset: 0,
      current: 2
    }
  }

  changeOffset = (i) => {
    this.setState({
      offset: this.state.offset + i,
      current: this.state.current - i
    });
  }

  changeCurrent = (current) => {
    this.setState({ current });
    this.props.onChangeDate(new Date().setDate(new Date().getDate() - 2 + this.state.offset + current));
  }

  generateDates = () => {
    const { offset, current } = this.state;

    const dates = [];
    for (let i = 0; i < 5; i++) {
      dates.push(
        <DayItem
          key={`day-${i}`}
          date={new Date().setDate(new Date().getDate() + i - 2 + offset)}
          onClick={() => this.changeCurrent(i)}
          active={current === i} />
      );
    }
    return dates;
  }

  render() {

    return (
      <Wrapper>
        <IconHolder onClick={() => this.changeOffset(-1)}>
          <ArrowLeftIcon color="white" width={8} />
        </IconHolder>
        <DayItems>
          {this.generateDates()}
        </DayItems>
        <IconHolder onClick={() => this.changeOffset(1)}>
          <ArrowRightIcon color="white" width={8} />
        </IconHolder>
        {/* <TabletOnly>
          <IconHolder>
            <ExcerptIcon color="white" width={16} />
          </IconHolder>
        </TabletOnly> */}
      </Wrapper>
    )
  }
}

export default CalendarDay;
