import React from 'react';
import styled from 'styled-components';

import { formatMoney } from '../../../modules/utilities/formatter';

const Profile = styled.div`
  display: flex;

  ${props => props.profileOnly && `
    padding-bottom: 10px;
    border-bottom: 1px solid #DADAE2;
    margin-bottom: 10px;
  `}
`

const Photo = styled.div`
  border: 1px solid #707070;
  width: 42px;

  img {
    width: 100%;
    height: auto;
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

const Text = styled.div`
  font-size: 11px;
  line-height: 13px;
  font-weight: 400;
`

function PlayerProfile(props) {
  const { player, profileOnly } = props;

  return (
    <Profile profileOnly={profileOnly}>
      <Photo>
        <img src={player.photo} alt="Player" />
      </Photo>
      <Bio>
        <Name>{player.name}</Name>
        <Text>Position: {player.pos}</Text>
        <Text>Earnings: ${formatMoney(player.earning)}</Text>
      </Bio>
    </Profile>
  )
}

export default PlayerProfile;
