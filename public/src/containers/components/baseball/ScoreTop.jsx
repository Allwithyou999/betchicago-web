import React from 'react';
import styled from 'styled-components';

import ScoreItem from './ScoreItem';
import media from '../../../containers/components/Media';

import { THEME_COLORS } from '../../../modules/styles';
import { formatDate, formatAMPM, getTimezone } from '../../../modules/utilities/formatter';


const Wrapper = styled.div`
  margin-bottom: 30px;
`

const Stats = styled.div`
  font-size: 13px;

  span {
    font-size: 13px;
  }
`

const Content = styled.div`
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;
  max-width: 400px;
  margin: 10px auto 0;

  ${media.tabletLg} {
    max-width: 900px;
    flex-wrap: no-wrap;
  }
`

const TeamDetail = styled.div`
  text-align: center;
  margin-bottom: 30px;

  ${media.tabletLg} {
    text-align: left;

    ${props => props.left && `
      text-align: right;
    `}
  }
`

const Label = styled.div`
  font-size: 11px;
  line-height: 13px;
  margin-bottom: 14px;
  color: white;
  background: ${props => props.color};
  text-align: center;
  padding: 3px 16px;

  ${media.tabletLg} {
    color: ${THEME_COLORS.BLACK};
    background: transparent;
    text-align: inherit;
    padding: 0;
  }
`

const Info = styled.div`
  font-size: 17px;
  line-height: 22px;
  font-weight: 300;

  b {
    font-weight: 600;
  }

  span {
    white-space: nowrap;
  }
`

const Notification = styled.div`
  font-size: 13px;
  line-height: 15px;
  text-align: center;

  ${props => props.normal && `
    margin-bottom: 15px;
  `}

  b {
    font-weight: 700;
  }

  ${props => props.warning && `
    margin-top: 45px;
  `}
`

const Player = styled.div`
  display: flex;
  flex-direction: column;

  ${media.tabletLg} {
    flex-direction: row;

    ${props => props.left && `
      flex-direction: row-reverse;
    `}
  }
`

// const PlayerPhoto = styled.div`
//   width: 44px;
//   height: 44px;
//   border: 1px solid #707070;
//   margin: 0 auto 10px;

//   ${media.tabletLg} {
//     margin: 0;
//     ${props => props.left ? 'margin-left: 10px;' : 'margin-right: 10px;'}
//   }
// `

const Text = styled.h6`
  text-transform: uppercase;
`

const BlockTitle = styled.h2`
  font-weight: 600;
  font-size: 19px;
  margin-bottom: 15px;
  text-transform: uppercase;
`

const PreGame = styled.div`
  padding-top: 20px;
  text-align: center;
  flex: 1 0 1px;
`

const LeftItem = styled.div`
  order: 2;

  ${media.tabletLg} {
    order: 1;
  }
`

const RightItem = styled.div`
  order: 3;
`

const CenterItem = styled.div`
  order: 1;
  width: 100%;
  margin-bottom: 30px;

  ${media.tabletLg} {
    max-width: 450px;
    margin: 0 auto 30px;
  }
`

function ScoreTop(props) {

  const { coverage, teamHomeData, teamAwayData } = props;

  const color1 = coverage.home_color;
  const color2 = coverage.away_color;
  const game = coverage.boxscore.game;
  game.home_color = color1;
  game.away_color = color2;

  let p1, p2;
  let pitcher1, pitcher2;
  if (game.status === 'closed' && game.pitching) {
    p1 = game.pitching.win.id;
    p2 = game.pitching.loss.id;

    for (let i = 0; i < coverage.summary.game.home.players.length; i ++) {
      if (coverage.summary.game.home.players[i].id === p1) {
        pitcher1 = coverage.summary.game.home.players[i];
      }

      if (coverage.summary.game.home.players[i].id === p2) {
        pitcher2 = coverage.summary.game.home.players[i];
      }
    }

    for (let i = 0; i < coverage.summary.game.away.players.length; i++) {
      if (coverage.summary.game.away.players[i].id === p1) {
        pitcher1 = coverage.summary.game.away.players[i];
      }

      if (coverage.summary.game.away.players[i].id === p2) {
        pitcher2 = coverage.summary.game.away.players[i];
      }
    }
  }

  let isHomePitching = true;
  let pitcher, hitter;

  let hitterId, pitcherId;
   try {
     if (game.status === 'inprogress') {
       hitterId = game.outcome.hitter.id;
       pitcherId = game.outcome.pitcher.id;

       for (let i = 0; i < coverage.summary.game.home.players.length; i++) {
         if (coverage.summary.game.home.players[i].id === pitcherId) {
           pitcher = coverage.summary.game.home.players[i];
         }

         if (coverage.summary.game.home.players[i].id === hitterId) {
           isHomePitching = false;
           hitter = coverage.summary.game.home.players[i];
         }
       }

       for (let i = 0; i < coverage.summary.game.away.players.length; i++) {
         if (coverage.summary.game.away.players[i].id === pitcherId) {
           isHomePitching = false;
           pitcher = coverage.summary.game.away.players[i];
         }

         if (coverage.summary.game.away.players[i].id === hitterId) {
           hitter = coverage.summary.game.away.players[i];
         }
       }
     }
   } catch (e) {

   }

  let pitchStats = (<Stats></Stats>);
  let batStats = (<Stats></Stats>);
  try {
    pitchStats = (<Stats>{pitcher.statistics.pitching.overall.ip_2} IP, {pitcher.statistics.pitching.overall.runs.earned} ER, {pitcher.statistics.pitching.overall.outs.ktotal} K</Stats>);
    let hit = hitter.statistics.hitting.overall;
    batStats = (<Stats>
      {hit.onbase.h}-{hit.ab}
      {!!hit.runs.total && <span>, {hit.runs.total !== 1 && hit.runs.total} R</span>}
      {!!hit.onbase.hr && <span>, {hit.onbase.hr !== 1 && hit.onbase.hr} HR</span>}
      {!!hit.rbi && <span>, {hit.rbi !== 1 && hit.rbi} RBI</span>}
      {!!hit.onbase.bb && <span>, {hit.onbase.bb !== 1 && hit.onbase.bb} BB</span>}
      {!!hit.outs.ktotal && <span>, {hit.outs.ktotal !== 1 && hit.outs.ktotal} K</span>}
      </Stats>);
    }
  catch (e) {
    ;
  }

  const weather = coverage.summary.game.weather;

  let homePit = {};
  let currentHitter = false;
  let awayPit = {}

   try {
     if (teamHomeData && game.home.probable_pitcher) {
       const homePitcher = teamHomeData.players.filter(p => p.id === game.home.probable_pitcher.id)[0];
       let h = teamHomeData.players.filter(p => p.id === hitterId)[0];
       if (h) {
         currentHitter = h.splits.hitting.overall[0].total[0];
       }

       if (homePitcher && homePitcher.splits.pitching) {
         homePit = homePitcher.splits.pitching.overall[0].total[0];
       }
     }


     if (teamAwayData && game.away.probable_pitcher) {
       const awayPitcher = teamAwayData.players.filter(p => p.id === game.away.probable_pitcher.id)[0];
       let h = teamAwayData.players.filter(p => p.id === hitterId)[0];
       if (h) {
         currentHitter = h.splits.hitting.overall[0].total[0];
       }

       if (awayPitcher && awayPitcher.splits.pitching) {
         awayPit = awayPitcher.splits.pitching.overall[0].total[0];
       }
     }

   } catch (e) {

   }

  let timezone = getTimezone();

  let hp = '';
  let ap = '';
  let umpire = false;

  try {
    if (game.status === 'scheduled') {
      if (game.home.probable_pitcher) {
        hp = game.home.probable_pitcher.preferred_name || game.home.probable_pitcher.first_name;
        hp = hp.substr(0, 1) + '. ' + game.home.probable_pitcher.last_name;
        ap = game.away.probable_pitcher.preferred_name || game.away.probable_pitcher.first_name;
        ap = ap.substr(0, 1) + '. ' + game.away.probable_pitcher.last_name;
      }
    } else if (game.status === 'inprogress') {
      hp = game.outcome.hitter.preferred_name || game.outcome.hitter.first_name;
      hp = hp.substr(0, 1) + '. ' + game.outcome.hitter.last_name;
      ap = game.outcome.pitcher.preferred_name || game.outcome.pitcher.first_name;
      ap = ap.substr(0, 1) + '. ' + game.outcome.pitcher.last_name;
    } else if (game.status === 'closed') {
      hp = game.pitching.win.preferred_name || game.pitching.win.first_name;
      hp = hp.substr(0, 1) + '. ' + game.pitching.win.last_name;
      ap = game.pitching.loss.preferred_name || game.pitching.loss.first_name;
      ap = ap.substr(0, 1) + '. ' + game.pitching.loss.last_name;
    }

    if (coverage.summary.game.officials) {
      coverage.summary.game.officials.forEach(item => {
        if (item.assignment === 'HP') {
          umpire = item.first_name.substr(0, 1) + '. ' + item.last_name;
        }
      })
    }
  } catch (e) {

  }

  return (
    <Wrapper>
      {game.status === 'scheduled' &&
        <Content>
          <LeftItem>
            <TeamDetail left>
              <Label color={color2}>PROBABLE STARTER</Label>
              <Player>
                {/* <PlayerPhoto /> */}
                <Info>
                  {!!game.away.probable_pitcher &&
                    <div>
                      <b>{ap}</b>
                      <span> ({game.away.probable_pitcher.win} - {game.away.probable_pitcher.loss})</span>
                    </div>
                  }
                  {!!teamAwayData &&
                    <Stats>{awayPit.ip_2} IP, {awayPit.er} ER, {awayPit.ktotal} K</Stats>
                  }
                </Info>
              </Player>
            </TeamDetail>
          </LeftItem>
          <CenterItem>
            <PreGame>
              <Text>{formatDate(new Date(game.scheduled), 'ww mm dd')} {formatAMPM(new Date(game.scheduled))} {timezone}</Text>
              <BlockTitle>{game.venue.name}, {game.venue.city}, {game.venue.state}</BlockTitle>
              {!!weather && !!weather.forecast &&
                <Notification normal><b>Forecast:</b> {weather.forecast.condition} {weather.forecast.temp_f}º, Humidity {weather.forecast.humidity}%, Wind {weather.forecast.wind.spead_mph} MPH {weather.forecast.wind.direction}</Notification>
              }
              {!!umpire &&
                <Notification><b>Umpire:</b> {umpire}</Notification>
              }
            </PreGame>
          </CenterItem>
          <RightItem>
            <TeamDetail>
              <Label color={color1}>PROBABLE STARTER</Label>
              <Player left>
                {/* <PlayerPhoto left /> */}
                <Info>
                  {!!game.home.probable_pitcher &&
                    <div>
                      <b>{hp}</b>
                      <span> ({game.home.probable_pitcher.win} - {game.home.probable_pitcher.loss})</span>
                    </div>
                  }
                  {!!teamHomeData &&
                    <Stats>{homePit.ip_2} IP, {homePit.er} ER, {homePit.ktotal} K</Stats>
                  }
                </Info>
              </Player>
            </TeamDetail>
          </RightItem>
        </Content>
      }

      {game.status === 'inprogress' &&
        <Content>
          <LeftItem>
            <TeamDetail left>
              <Label color={color2}>NOW {!isHomePitching ? 'PITCHING' : 'BATTING'}</Label>
              <Info>
                <div>
                  <b>{ap}</b>
                  {!isHomePitching ?
                    <span> ({game.away.current_pitcher.win}-{game.away.current_pitcher.loss})</span>
                    : <span> ({hitter.statistics.hitting.overall.avg})</span>
                  }
                </div>
                {!isHomePitching ? pitchStats : batStats}
              </Info>
            </TeamDetail>
          </LeftItem>
          <CenterItem>
            <ScoreItem mini game={game} />
            {/* <Notification><b>Last:</b> J.D. Martinez flies out to deep right field to Giancarlo Stanton. Justin Upton to third.</Notification> */}
          </CenterItem>
          <RightItem>
            <TeamDetail>
              <Label color={color1}>NOW {isHomePitching ? 'PITCHING' : 'BATTING'}</Label>
              <Info>
                <div>
                  <b>{hp}</b>
                  {isHomePitching ?
                    <span> ({game.home.current_pitcher.win}-{game.home.current_pitcher.loss})</span>
                    : <span> ({currentHitter.avg})</span>
                  }
                </div>
                {isHomePitching ? pitchStats : batStats}
              </Info>
            </TeamDetail>

          </RightItem>
        </Content>
      }

      {game.status === 'closed' &&
        <Content>
          <LeftItem>
            <TeamDetail left>
              <Label color={color1}>WINNING PITCHER</Label>
              <Info>
                <div>
                  <b>{hp}</b>
                  {game.pitching && <span> ({game.pitching.win.win}-{game.pitching.win.loss})</span>}
                </div>
                {!!pitcher1 &&
                  <Stats>{pitcher1.statistics.pitching.overall.ip_2} IP, {pitcher1.statistics.pitching.overall.runs.earned} ER, {pitcher1.statistics.pitching.overall.outs.ktotal} K</Stats>
                }
              </Info>
            </TeamDetail>
          </LeftItem>
          <CenterItem>
            <ScoreItem mini finished game={game} />
          </CenterItem>
          <RightItem>
            <TeamDetail>
              <Label color={color2}>LOSING PITCHER</Label>
              <Info>
                <div>
                  <b>{ap}</b>
                  {game.pitching && <span> ({game.pitching.loss.win}-{game.pitching.loss.loss})</span>}
                </div>
                {!!pitcher2 &&
                  <Stats>{pitcher2.statistics.pitching.overall.ip_2} IP, {pitcher2.statistics.pitching.overall.runs.earned} ER, {pitcher2.statistics.pitching.overall.outs.ktotal} K</Stats>
                }
              </Info>
            </TeamDetail>
          </RightItem>
        </Content>
      }

      {!coverage &&
        <Content>
          <PreGame>
            <Text>{formatDate(new Date(), 'ww mm dd')} {formatAMPM(new Date())} {timezone}</Text>
            {/* <BlockTitle>FENWAY PARK, BOSTON, MA</BlockTitle> */}
            <Notification warning><b>DATA NOT YET AVAILABLE FOR THIS MATCHUP</b></Notification>
          </PreGame>
        </Content>
      }
    </Wrapper>
  )
}

export default ScoreTop;
