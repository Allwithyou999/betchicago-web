import React, { Component } from 'react';
import styled from 'styled-components';

import media from '../Media';

import { THEME_COLORS } from '../../../modules/styles';

const Wrapper = styled.div`
  margin-top: 17px;
`

const Row = styled.div`
  display: flex;
  text-align: center;

  span {
    display: block;
    font-size: 11px;
    line-height: 13px;
    color: #666666;
    width: 16%;

    &:nth-child(6) {
      width: 4%;
    }

    ${media.desktop} {
      width: 14.28%;

      &:nth-child(6) {
        width: 14.28%;
      }
    }
  }

  ${props => props.data && `
    span {
      font-size: 13px;
      line-height: 15px;
      color: ${THEME_COLORS.BLACK};
    }
  `}
`

const Divider = styled.div`
  border-top: 1px solid #DADAE2;
  margin: 4px 0;
`

class PlayerScore extends Component {

  render() {
    const { player } = this.props;

    return (
      <Wrapper>
        <Row>
          <span>Eagle</span>
          <span>Birdie</span>
          <span>Par</span>
          <span>Bogies</span>
          <span>Double</span>
          <span></span>
          <span>Total</span>
        </Row>
        <Divider />
        <Row>
          <span>{player.score.eagle}</span>
          <span>{player.score.birdie}</span>
          <span>{player.score.par}</span>
          <span>{player.score.bogies}</span>
          <span>{player.score.double}</span>
          <span></span>
          <span>{player.score.total}</span>
        </Row>
      </Wrapper>
    )
  }
}

export default PlayerScore;
