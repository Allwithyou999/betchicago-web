import React, { Component } from 'react';
import styled from 'styled-components';

import PlayerProfile from './PlayerProfile';
import PlayerScore from './PlayerScore';

import { THEME_COLORS } from '../../../modules/styles';

const Wrapper = styled.div`
  background: #EAEAEB;
  padding: 10px;
  position: relative;
  margin-bottom: 16px;
`

const IncLabel = styled.div`
  background: ${THEME_COLORS.BRAND};
  font-size: 13px;
  line-height: 14px;
  font-weight: 600;
  color: white;
  padding: 8px;
  position: absolute;
  top: 0;
  right: 12px;
`


class PlayerCard extends Component {
  render() {
    const { profileOnly } = this.props;

    const player = {
      name: 'Phil Mickelson',
      pos: 12,
      earning: 375000,
      photo: '',
      score: {
        eagle: 3,
        birdie: 8,
        par: 59,
        bogies: 2,
        double: 1,
        total: 276
      },
      fedex: -12,
    }

    return (
      <div>
        {!profileOnly ? (
          <Wrapper>
            <PlayerProfile player={player} />
            <IncLabel>{player.fedex}</IncLabel>
            <PlayerScore player={player} />
          </Wrapper>
        ) : (
            <PlayerProfile player={player} profileOnly />
        )}
      </div>
    )
  }
}

export default PlayerCard;
