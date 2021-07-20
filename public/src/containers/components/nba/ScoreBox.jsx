import React from 'react';
import styled from 'styled-components';

import { formatAMPM } from '../../../modules/utilities/formatter';
import { THEME_COLORS } from '../../../modules/styles';
import * as firebase from '../../../apis/firebase';

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
  font-size: 14px;
  line-height: 18px;
  font-weight: 600;
  margin-left: 3px;
  color: ${THEME_COLORS.BLACK};
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

const Number = styled(Text)`
  font-weight: 400;

  ${props => props.emphasis && `
    font-weight: 700;
  `}

  ${props => props.light && `
    color: #777777;
  `}
`

class ScoreBox extends React.Component {
  constructor (props) {
    super(props);

    this.state = {
      gameDetail: null,
    };
  }

  componentDidMount() {
    const path = `/sportRadarStore/nba/games/${this.props.game.id}`;

    firebase.db()
      .ref(path)
      .on('value', (result) => {
        this.setState({
          gameDetail: result.val(),
        });
      });

    const homeTeamPath = `/sportRadarStore/nba/year/2018/REG/teams/${this.props.game.home.id}`;

    firebase.db()
      .ref(homeTeamPath)
      .once('value')
      .then(result => {
        this.setState({
          homeTeam: result.val(),
        });
      });

    const awayTeamPath = `/sportRadarStore/nba/year/2018/REG/teams/${this.props.game.away.id}`;

    firebase.db()
      .ref(awayTeamPath)
      .once('value')
      .then(result => {
        this.setState({
          awayTeam: result.val(),
        });
      });
  }

  render() {
    const { gameDetail, homeTeam, awayTeam } = this.state;
    const { game } = this.props;

    let status = '';
    if (game && gameDetail) {
      if (game.status === 'inprogress') {
        let clock = gameDetail.summary.clock;
        let clockArr = clock.split(':');

        if (clockArr[0].length === 1) {
          clockArr[0] = `0${clockArr[0]}`;
        }

        if (clockArr[1].length === 1) {
          clockArr[1] = `0${clockArr[1]}`;
        }

        status = `Q${gameDetail.summary.quarter} - ${clockArr.join(':')}`;
      } else if (game.status === 'closed') {
        status = 'FINAL';
      } else {
        status = formatAMPM(new Date(game.scheduled))
      }
    }

    return (
      <Wrapper>
        <a href={`/nba-betting/game/${game.id}`}>
          <Line>
            <Score>
              <img
                width="24" height="24"
                alt=""
                src={`https://firebasestorage.googleapis.com/v0/b/bet-chicago.appspot.com/o/staticassests%2Fnba%2Fteam%2Flogo_60%2F${game.away.name.replace(
                  / /g,
                  '-'
                )}.png?alt=media`}
              />
              <Text>{game.away.name}</Text>
              {homeTeam && <SmallText>({homeTeam.wins}-{homeTeam.losses})</SmallText>}
            </Score>
            {(game.status === 'closed' || game.status === 'inprogress') && gameDetail && <Number light>{gameDetail.summary.away.points || 0}</Number>}
          </Line>
          <TitleHolder>
            <SmallText emphasis>{status.toUpperCase()}</SmallText>
          </TitleHolder>
          <Line>
            <Score>
              <img
                width="24" height="24"
                alt=""
                src={`https://firebasestorage.googleapis.com/v0/b/bet-chicago.appspot.com/o/staticassests%2Fnba%2Fteam%2Flogo_60%2F${game.home.name.replace(
                  / /g,
                  '-'
                )}.png?alt=media`}
              />
              <Text>{game.home.name}</Text>
              {awayTeam && <SmallText>({awayTeam.wins}-{awayTeam.losses})</SmallText>}
            </Score>
            {(game.status === 'closed' || game.status === 'inprogress') && gameDetail && <Number emphasis>{gameDetail.summary.home.points || 0}</Number>}
          </Line>
        </a>
      </Wrapper>
    );
  }
}

export default ScoreBox;
