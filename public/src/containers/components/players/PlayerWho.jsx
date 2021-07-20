import React from 'react';
import styled from 'styled-components';

import { THEME_COLORS } from '../../../modules/styles';

const Profile = styled.div`
  display: flex;
  align-items: center;
`

const Photo = styled.div`
  border: 1px solid #C8C8C8;
  width: 42px;
  height: 42px;
  background: #C8C8C8;
  display: flex;
  align-items: center;
  justify-content: center;

  span {
    font-size: 29px;
    color: white;
  }
`

const Bio = styled.div`
  margin-left: 10px;
`

const Name = styled.div`
  font-size: 13px;
  line-height: 15px;
  font-weight: 600;
`

const Link = styled.a`
  font-size: 11px;
  line-height: 13px;
  font-weight: 400;
  color: ${THEME_COLORS.BRAND};
  text-decoration: none;
`

function PlayerWho(props) {
  return (
    <Profile>
      <Photo>
        <span>?</span>
      </Photo>
      <Bio>
        <Name>Whose Your Favorite?</Name>
        <Link href='/'>Create Custom Player List</Link>
      </Bio>
    </Profile>
  )
}

export default PlayerWho;
