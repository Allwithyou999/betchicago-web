import React, { Component } from 'react';
import styled from 'styled-components';

import PlayerCard from './PlayerCard';
import PlayerWho from './PlayerWho';

import { THEME_COLORS } from '../../../modules/styles';

const Wrapper = styled.div`

`

const LinkHolder = styled.div`
  text-align: center;

  a {
    font-size: 13px;
    line-height: 15px;
    color: ${THEME_COLORS.BLUE};
    text-decoration: none;

  }
`

class FavPlayers extends Component {

  render() {
    const { profileOnly } = this.props;

    return (
      <Wrapper>
        <PlayerCard profileOnly={profileOnly} />
        <PlayerCard profileOnly={profileOnly} />
        <PlayerCard profileOnly={profileOnly} />
        <PlayerCard profileOnly={profileOnly} />
        <PlayerCard profileOnly={profileOnly} />
        {!profileOnly ?
        (
          <LinkHolder>
            <a href="/golf-odds/player/0">Create Your Own Player List</a>
          </LinkHolder>
        ) : (
          <PlayerWho />
        )}
      </Wrapper>
    )
  }
}

export default FavPlayers;
