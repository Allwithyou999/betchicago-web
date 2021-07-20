import React from 'react';
import styled from 'styled-components';

import media from '../../../containers/components/Media';

import { THEME_COLORS } from '../../../modules/styles';
import { formatDate } from '../../../modules/utilities/formatter';


const Wrapper = styled.div`
  text-align: center;
  color: rgba(255, 255, 255, 0.5);
  width: 33px;

  ${media.tablet} {
    margin: 0 17px;
    color: #C8C8C8;

    &:hover {
      color: #444;
    }
  }

  ${props => props.active && `
    color: white;

    ${media.tablet} {
      color: ${THEME_COLORS.BLUE};
    }
  `}
`

const Month = styled.div`
  font-size: 10px;
  line-height: 13px;
  text-transform: uppercase;
`

const Day = styled.div`
  font-size: 29px;
  font-weight: 600;
`

function DayItem(props) {
  const { date, active, onClick } = props;
  const d = new Date(date);

  return (
    <Wrapper active={active} onClick={onClick}>
      <Month>{formatDate(d, 'mm')}</Month>
      <Day>{formatDate(d, 'dd')}</Day>
      <Month>{formatDate(d, 'ww')}</Month>
    </Wrapper>
  )
}

export default DayItem;
