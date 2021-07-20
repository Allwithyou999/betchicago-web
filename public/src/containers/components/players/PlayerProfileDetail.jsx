import React from 'react';
import styled from 'styled-components';

import media from '../Media';

const PlayerPhoto = styled.div`
  width: 70px;
  height: 70px;
  background: #F5F5F8
  border: 1px solid #707070;
  margin-right: 11px;
  display: none;

  ${media.tablet} {
    width: 130px;
    height: 155px;
    margin-right: 22px;
  }
`;

const Title = styled.div`
  display: none;

  ${media.tablet} {
    display: block;
    font-size: 11px;
    line-height: 13px;
    font-weight: 600;
    margin-bottom: 13px;
  }
`

const PlayerProfile = styled.div`
  display: flex;
  padding: 10px 0 25px;
`;

const PlayerName = styled.h2`
  font-weight: 600;
  line-height: 28px;

  ${media.tablet} {
    font-size: 29px;
    line-height: 35px;
    font-weight: 300;
    margin-bottom: 5px;
  }
`;

const PlayerLocation = styled.div`
  font-size: 13px;
  font-weight: 400;
  line-height: 15px;
  margin-bottom: 8px;

  ${media.tablet} {
    font-size: 17px;
    line-height: 20px;
    font-weight: 300;
    margin-bottom: 14px;
  }
`;

const BioHolder = styled.div`
  display: none;

  ${media.tablet} {
    display: flex;
  }
`

const Bio = styled.div`
  ${media.tablet} {
    font-size: 15px;
    line-height: 18px;
    margin-bottom: 8px;
    font-weight: 300;

    ${props => props.title && `
      font-weight: 400;
      width: 90px;
    `}
  }
`

const PlayerStats = styled.h4`
  line-height: 21px;
  font-weight: 300;

  > b {
    font-weight: 700;
  }

  ${media.tablet} {
    display: none;
  }
`;

function PlayerProfileDetail(props) {
  const { profile = {} } = props;
  return (
    <PlayerProfile>
      <PlayerPhoto />
      <div>
        <Title>PLAYER PROFILE</Title>
        <PlayerName>{profile.first_name} { profile.last_name}</PlayerName>
        <PlayerLocation>{profile.residence}</PlayerLocation>
        <PlayerStats>
          Odds to Win: <b>25/1</b>
        </PlayerStats>
        <BioHolder>
          <Bio title>College:</Bio>
          <Bio>{profile.college}</Bio>
        </BioHolder>
        <BioHolder>
          <Bio title>Birthplace:</Bio>
          <Bio>{profile.birth_place}</Bio>
        </BioHolder>
      </div>
    </PlayerProfile>
  )
}

export default PlayerProfileDetail;
