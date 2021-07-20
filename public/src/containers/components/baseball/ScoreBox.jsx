import React from 'react';
import styled from 'styled-components';

import { formatAMPM } from '../../../modules/utilities/formatter';
import { THEME_COLORS } from '../../../modules/styles';

const Wrapper = styled.div`
  border: 1px solid #DADAE2;
  border-bottom: 2px solid ${THEME_COLORS.BRAND};
  padding: 8px 11px 8px 4px;
  margin-bottom: 8px;

  a {
    text-decoration: none;
  }
`

const Line = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`

const Score = styled.div`
  display: flex;
  align-items: center;
  padding: 3px 0 3px 3px;
`

const Text = styled.div`
  font-size: 15px;
  line-height: 18px;
  font-weight: 600;
  margin-left: 3px;
  color: ${THEME_COLORS.BLACK};
`

const Number = styled(Text)`
  font-weight: 400;

  ${props => props.emphasis && `
    font-weight: 700;
  `}

  ${props => props.light && `
    color: #777777;
  `}
`

const SmallText = styled.div`
  font-size: 10px;
  line-height: 13px;
  font-weight: 400;
  color: #777777;
  margin-left: 3px;

  ${props => props.emphasis && `
    color: ${THEME_COLORS.BLACK};
    font-weight: 700;
  `}
`

const TitleHolder = styled.div`
  text-align: right;
  padding-right: 20px;
`

function ScoreBox(props) {
  const { score, slugs } = props;
  let homeLogo, awayLogo;
  Object.keys(slugs.slug).forEach(slug => {
    if (slugs.slug[slug].id === score.game.away_team) {
      awayLogo = slugs.images.logo_60 + slug + '.png?alt=media';
    } else if (slugs.slug[slug].id === score.game.home_team) {
      homeLogo = slugs.images.logo_60 + slug + '.png?alt=media';
    }
  });

  let status = '';
  if (score.game.status === 'inprogress' && score.game.outcome) {
    if (score.game.outcome.current_inning_half === 'B') {
      status = 'BOT ' + score.game.outcome.current_inning;
    } else {
      status = 'TOP ' + score.game.outcome.current_inning;
    }
  } else if (score.game.status === 'closed') {
    status = 'FINAL';
  } else {
    status = formatAMPM(new Date(score.game.scheduled));
  }

  let lnk = '';
  if (score.game.status === 'closed' || score.game.status === 'inprogress') {
    lnk += '/boxscore';
  }
  return (
    <Wrapper>
      <a href={`/mlb-betting/coverage/${score.game.id}${lnk}`}>
        <Line>
          <Score>
            {awayLogo && (
                <img src={awayLogo} alt={score.game.away.market} width="24" height="24" />
            )}
            <Text>{score.game.away.market}</Text>
            <SmallText>({score.game.away.win}-{score.game.away.loss})</SmallText>
          </Score>
          {score.game.status !== 'scheduled' &&
            <Number light>{score.game.away.runs}</Number>
          }
        </Line>
        <TitleHolder>
          <SmallText emphasis>{status.toUpperCase()}</SmallText>
        </TitleHolder>
        <Line>
          <Score>
            {homeLogo && (
              <img src={homeLogo} alt={score.game.home.market} width="24" height="24" />
            )}
            <Text>{score.game.home.market}</Text>
            <SmallText>({score.game.home.win}-{score.game.home.loss})</SmallText>
          </Score>
          {score.game.status !== 'scheduled' &&
            <Number emphasis>{score.game.home.runs}</Number>
          }
        </Line>
      </a>
    </Wrapper>
  )
}

export default ScoreBox;
