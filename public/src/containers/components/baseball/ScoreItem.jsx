import React from 'react';
import styled from 'styled-components';

import media from '../../../containers/components/Media';
import { formatAMPM } from '../../../modules/utilities/formatter';

import { THEME_COLORS } from '../../../modules/styles';

const Wrapper = styled.div`
  width: 100%;
  max-width: 412px;
  margin: 0 auto 40px;

  ${props => props.mini && `
    margin-bottom: 0;
  `}

  ${props => props.noMargin && `
    margin-left: 0;
    margin-right: 0;
  `}
`

const BoardHolder = styled.div`
  display: flex;
  margin-bottom: 10px;
`

const TotalHolder = styled.div`
  display: none;

  ${media.tablet} {
    display: block;
    width: 20%;
    margin-left: 7px;
  }
`

const ScoreHolder = styled.div`
  flex: 1 0 1px;
`

const ScoreHeader = styled.div`
  font-size: 10px;
  line-height: 13px;
  color: #666666;
  margin-bottom: 4px;

  ${media.tablet} {
    font-size: 11px;
  }
`;

const MobileCell = styled.div`
  display: inline-block;

  ${media.tablet} {
    display: none !important;
  }
`

const ScoreDetail = styled.div`
  > div > * {
    height: 30px;
    font-size: 13px;
    line-height: 30px;
    border-top: 1px solid #C8C8C8;
    border-right: 1px solid #C8C8C8;

    ${props => props.bottom && `
      border-bottom: 1px solid #C8C8C8;
    `}
  }
`

const TeamTitle = styled.div`
  padding: 0 13px 0 10px !important;
  display: flex !important;
  justify-content: space-between;
  position: relative;

  &:before {
    content: '';
    position: absolute;
    width: 4px;
    height: calc(100% + 2px);
    top: -1px;
    left: 0;
    background: ${props => props.color};
  }

  b {
    font-size: 15px;
    font-weight: 600;
  }

  span {
    font-weight: 600;
    font-size: 11px;
    color: ${THEME_COLORS.BLUE};
  }
`

const ScoreTable = styled.div`
  display: flex;

  > * {
    display: inline-block;
    text-align: center;
    width: ${100 / 13}%;

    // ${props => props.win && `
    //   background: #F2F2F2;
    // `}
  }

  > :first-child {
    width: ${(100 / 13) * 4}%;
    padding-right: 15px;
    text-align: right;
  }

  ${props => props.mini && `
    > * {
      width: ${100 / 11}%;
    }

    > :first-child {
      width: ${(100 / 11) * 2}%;
    }
  `}
`;

const TotalTable = styled.div`
  display: flex;

  > * {
    display: inline-block;
    text-align: center;
    width: 30%;
    font-weight: 300;

    // ${props => props.win && `
    //   background: #F2F2F2;
    // `}
  }

  > :first-child {
    width: 40%;
  }
`

const FirstCell = styled.span`
  font-weight: 600;
  position: relative;

  &:before {
    content: '';
    position: absolute;
    width: 4px;
    height: calc(100% + 2px);
    top: -1px;
    left: 0;
    background: ${props => props.color};
  }
`

const Text = styled.div`
  font-size: 13px;
  line-height: 15px;
  display: flex;
  word-break: break-all;

  b {
    font-weight: 600;
    margin-right: 5px;

    ${props => props.strong && `
      font-weight: 700;
    `}
  }

  span {
    ${props => props.highlight && `
      color: ${THEME_COLORS.BLUE};
    `}
  }
`

const ScoreCell = styled.span`
  ${props => props.active && `
    background: #F2F2F2;
  `}
`

const TextInner = styled.div`
  display: flex;

  > div {
    margin-right: 10px;
  }
`

const TextLine = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 20px;

  ${props => props.center && `
    justify-content: center;
  `}
`

const buildScores = (scores) => {
  const sc = [];
  for (let i = 0; i < 9; i ++) {
    sc.push(<ScoreCell key={`st-${i}`} active={scores[i] === 'X'}>{scores[i] === 'X' ? '-' : scores[i]}</ScoreCell>);
  }
  return sc;
}

const SquareBox = styled.div`
  display: flex;
  width: 14px;
  flex-wrap: wrap;
  transform: rotate(45deg);
  margin-top: 4px;
  margin-left: 6px;
`

const Square = styled.div`
  width: 6px;
  height: 6px;
  background: ${props => props.filled ? '#111' : '#C8C8C8'};
  margin-right: 1px;
  margin-bottom: 1px;

  ${props => props.dot && `
    border-radius: 3px;
    margin-right: 2px;
  `}
`

const Dots = styled.div`
  display: flex;
  margin-left: 10px;
  margin-top: 5px;
`

const ScoreLinks = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;

  a {
    font-size: 13px;
    line-height: 15px;
    font-weight: 700;
    text-decoration: none;
    color: ${THEME_COLORS.BLUE};
  }

  span {
    margin: 0 10px;
    font-size: 13px;
  }
`

const generateOuts = (count) => {
  let result = [];
  for (let i = 0; i < 3; i ++) {
    result.push(<Square dot filled={i < count} key={`out-${i}`} />)
  }
  return result;
}

const generateRunners = (runners) => {
  let p1, p2, p3;
  runners && runners.forEach(runner => {
    if (runner.starting_base === 1) p1 = true;
    else if (runner.starting_base === 2) p2 = true;
    else if (runner.starting_base === 3) p3 = true;
  })
  return (
    [
      <Square filled={p2} key="p2" />,
      <Square filled={p1} key="p1" />,
      <Square filled={p3} key="p3" />,
    ]
  )
}

function ScoreItem(props) {

  const { mini, finished, game, noMargin } = props;


  let team1 = {
    name: 'CIN',
    color: '#C71430',
    ml: '-106',
    score: [0, 0, 0, 0, 10],
    total: {
      r: 11,
      h: 18,
      e: 2
    },
    active: false,
  }

  let team2 = {
    name: 'COL',
    color: '#333465',
    ml: '+120',
    score: [11, 0, 0, 0, 0],
    total: {
      r: 11,
      h: 18,
      e: 2
    },
    active: 5
  }

  let oddType = '-'
    , oddValue = '-';

  if (game.odd) {

    const markets = game.odd.markets || [];

    let id = '17084'; // be default it's westgate

    !!markets[1] && markets[1].books.forEach(book => {
      if (book.id.indexOf(id) !== -1 && !!book.outcomes) {
        book.outcomes.forEach(out => {
          if (out.odds.substr(0, 1) === '-') {
            oddType = out.type.substr(0, 1).toUpperCase()
            oddValue = out.total;
          }
        });
        if (oddType === '-' && book.outcomes.length) {
          let out = book.outcomes[0];
          oddType = out.type.substr(0, 1).toUpperCase()
          oddValue = out.total;
        }
      }
    })

  }

  let coverageLink = 'coverage/id';

  if (game) {
    const { home, away } = game;

    coverageLink = `coverage/${game.id}`;

    if (game.status === 'closed' || game.status === 'inprogress') {
      coverageLink += '/boxscore';
    }

    let homeMl = '--';
    let awayMl = '--';

    if (game.odd) {
      const markets = game.odd.markets || [];

      let id = '17084'; // be default it's westgate

      !!markets[0] && markets[0].books.forEach(book => {
        if (book.id.indexOf(id) !== -1 && !!book.outcomes) {
          book.outcomes.forEach(out => {
            if (out.type === 'home') {
              homeMl = out.odds;
            } else {
              awayMl = out.odds;
            }
          })
        }
      });
    }

    team1 = {
      name: home.abbr,
      color: game.home_color,
      ml: homeMl,
      score: home.scoring ? home.scoring.map(score => score.runs) : [],
      total: {
        r: home.runs,
        h: home.hits,
        e: home.errors
      },
      active: false,
    }

    team2 = {
      name: away.abbr,
      color: game.away_color,
      ml: awayMl,
      score: away.scoring ? away.scoring.map(score => score.runs) : [],
      total: {
        r: away.runs,
        h: away.hits,
        e: away.errors
      },
      active: false,
    }
  }

  let inningText = '';

  let rescheduled = false;

  if (game.outcome) {
    inningText = game.outcome.current_inning_half === 'B' ? 'BOT ' : 'TOP ';
    inningText += game.outcome.current_inning;
    if (inningText === 'BOT 0') {
      inningText = 'TOP 1';
    }

    if (game.status === 'scheduled' && game.rescheduled) {
      rescheduled = true;
    }
  }

  return (
    <Wrapper mini={mini} noMargin={noMargin}>
      <BoardHolder>
        <ScoreHolder>
          <ScoreHeader>
            <ScoreTable mini={mini}>
              <span>{!mini && 'ML'}</span>
              <span>1</span>
              <span>2</span>
              <span>3</span>
              <span>4</span>
              <span>5</span>
              <span>6</span>
              <span>7</span>
              <span>8</span>
              <span>9</span>
              <MobileCell>R</MobileCell>
            </ScoreTable>
          </ScoreHeader>
          <ScoreDetail>
            <ScoreTable mini={mini} win>
              <TeamTitle color={team2.color}>
                <b>{team2.name}</b>
                {!mini &&
                  <span>{team2.ml}</span>
                }
              </TeamTitle>
              {
                buildScores(team2.score)
              }
              <MobileCell>{team2.total.r}</MobileCell>
            </ScoreTable>
          </ScoreDetail>
          <ScoreDetail bottom>
            <ScoreTable mini={mini}>
              <TeamTitle color={team1.color}>
                <b>{team1.name}</b>
                {!mini &&
                  <span>{team1.ml}</span>
                }
              </TeamTitle>
              {
                buildScores(team1.score)
              }
              <MobileCell>{team1.total.r}</MobileCell>
            </ScoreTable>
          </ScoreDetail>
        </ScoreHolder>
        <TotalHolder>
          <ScoreHeader>
            <TotalTable>
              <span>R</span>
              <span>H</span>
              <span>E</span>
            </TotalTable>
          </ScoreHeader>
          <ScoreDetail>
            <TotalTable win>
              <FirstCell color={team2.color}>{team2.total.r}</FirstCell>
              <span>{team2.total.h}</span>
              <span>{team2.total.e}</span>
            </TotalTable>
          </ScoreDetail>
          <ScoreDetail bottom>
            <TotalTable>
              <FirstCell color={team1.color}>{team1.total.r}</FirstCell>
              <span>{team1.total.h}</span>
              <span>{team1.total.e}</span>
            </TotalTable>
          </ScoreDetail>
        </TotalHolder>
      </BoardHolder>
      {!mini ? (
        <TextLine>
          {!!game.outcome &&
            <TextInner>
              {rescheduled &&
                <Text>{formatAMPM(new Date(game.scheduled)).toUpperCase()}</Text>
              }
              <Text strong>
                <b>{inningText}</b>
                <div>
                  <SquareBox>
                    {generateRunners(game.outcome.runners)}
                  </SquareBox>
                </div>
                <Dots>
                  {game.outcome.count ? generateOuts(game.outcome.count.outs) : generateOuts(0)}
                </Dots>
              </Text>
              {!!game.outcome.hitter &&
                <Text><b>B:</b><span>{game.outcome.hitter.first_name.substr(0, 1) + '. ' + game.outcome.hitter.last_name}</span></Text>
              }
              {!!game.outcome.pitcher &&
                <Text><b>P:</b><span>{game.outcome.pitcher.first_name.substr(0, 1) + '. ' + game.outcome.pitcher.last_name}</span></Text>
              }
            </TextInner>
          }
          {game.status === 'closed' && game.pitching &&
            <TextInner>
              <Text><b>W:</b><span>{game.pitching.win.first_name.substr(0, 1) + '. ' + game.pitching.win.last_name} ({game.pitching.win.win}-{game.pitching.win.loss})</span></Text>
              <Text><b>L:</b><span>{game.pitching.loss.first_name.substr(0, 1) + '. ' + game.pitching.loss.last_name} ({game.pitching.loss.win}-{game.pitching.loss.loss})</span></Text>
            </TextInner>
          }
          {(game.status === 'scheduled' && !rescheduled) &&
            <TextInner>
              <Text>{formatAMPM(new Date(game.scheduled)).toUpperCase()}</Text>
              {!!game.away.probable_pitcher &&
                <Text><span>{game.away.probable_pitcher.first_name.substr(0, 1) + '. ' + game.away.probable_pitcher.last_name} ({game.away.probable_pitcher.win}-{game.away.probable_pitcher.loss})</span></Text>
              }
              {!!game.home.probable_pitcher &&
                <Text><span>{game.home.probable_pitcher.first_name.substr(0, 1) + '. ' + game.home.probable_pitcher.last_name} ({game.home.probable_pitcher.win}-{game.home.probable_pitcher.loss})</span></Text>
              }
            </TextInner>
          }
          <Text highlight><b>O/U</b><span>{oddValue}</span></Text>
        </TextLine>
      ) : !finished && (
        <TextLine center>
          {!!game.outcome &&
            <TextInner>
              <Text strong>
                <b>{inningText}</b>
                <div>
                  <SquareBox>
                    {generateRunners(game.outcome.runners)}
                  </SquareBox>
                </div>
                <Dots>
                  {game.outcome.count ? generateOuts(game.outcome.count.outs) : generateOuts(0)}
                </Dots>
              </Text>
            </TextInner>
          }
        </TextLine>
      )}
      {!mini &&
        <ScoreLinks>
          <a href={coverageLink + '/odds'}>MORE ODDS</a>
          <span>|</span>
          <a href={coverageLink}>GAME COVERAGE</a>
        </ScoreLinks>
      }
    </Wrapper>
  )
}

export default ScoreItem;
