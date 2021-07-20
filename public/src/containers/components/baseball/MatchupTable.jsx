import React from 'react';
import styled from 'styled-components';

import PlayerTable from '../players/PlayerTable';
import LineTable from './LineTable';
import Loading from '../Loading';

import { THEME_COLORS } from '../../../modules/styles';
import { MLB_PITCHER_DESKTOP_TITLE, MLB_PITCHER_MOBILE_TITLE, MLB_LINEUP_DESKTOP_TITLE, MLB_LINEUP_MOBILE_TITLE } from '../../../modules/constants/mlb';
import { TabletOnly, MobileOnly } from '../Layout';
import media from '../Media';
import { STATUS } from '../../../modules/constants/common';


const Wrapper = styled.div`
  border-bottom: 1px solid ${THEME_COLORS.BLACK};
`

const Margin = styled.div`
  margin-bottom: 20px;
`

const OddItem = styled.div`
  font-size: 21px;
  line-height: 21px;
  font-weight: 400;

  span {
    font-size: 13px;
    display: inline-block;
    vertical-align: middle;
    margin-top: -4px;
    margin-left: 3px;
  }

  ${media.max.mobile} {
    font-size: 18px;

    span {
      font-size: 11px;
    }
  }
`

const OddLink = styled.div`
  font-size: 13px;
  line-height: 18px;
  color: ${THEME_COLORS.BLUE};
  text-decoration: underline;
  cursor: pointer;
`

const Title = styled.div`
  display: flex;
  align-items: center;
  font-size: 19px;
  line-height: 29px;
  margin-bottom: 10px;
  padding: 5px;

  span {
    margin-left: 5px;
  }

  ${props => props.right && `
    ${media.tablet} {
      flex-direction: row-reverse;

      span {
        margin-left: 0;
        margin-right: 5px;
      }
    }
  `}

`

const SubHead = styled.span`
  margin-left: 10px;
`

const Link = styled.div`
  a {
    margin-right: 5px;
  }

  span {
    margin-left: 5px;
  }
`
class MatchupTable extends React.Component {
  generateLink = (link, text) => (
    <a href="link">
      {text}
    </a>
  )

  generateLineupLink = (link, linkText, text) => (
    <Link>
      {link === '/' ? linkText : <a href={link}>{linkText}</a>}
      <span>{text}</span>
    </Link>
  )

  render() {

    const { logo, title, color, right, coverage, type, teamData, odd, loading, gotoOddTab, standing } = this.props;
    const game = coverage.summary.game[type];

    let record = {
      subtitle: [],
      score: []
    }

    let offensive = {
      subtitle: [],
      score: []
    }

    let pitcherScore = [];
    let batterScore = [];

    let DESKTOP_TITLE = MLB_PITCHER_DESKTOP_TITLE.slice();
    let MOBILE_TITLE = MLB_PITCHER_MOBILE_TITLE.slice();

    let oddList;
    if (!!teamData) {
      //Odds

      try {
        if (odd) {
          let oddId = 0;
          odd.competitors.forEach((c, i) => {
            if (c.qualifier === type) oddId = i;
          });

          oddList = {
            subtitle: ['Moneyline', 'run line', 'over/under', ''],
            score: ['', '', '', '']
          }


          let markets = odd.markets;
          let id = '17084';

          markets[0].books.forEach(book => {
            if (book.id.indexOf(id) !== -1) {
              oddList.score[0] = <OddItem>{book.outcomes[oddId].odds}</OddItem>;
            }
          })

          !!markets[2] && markets[2].books.forEach(book => {
            if (book.id.indexOf(id) !== -1) {
              oddList.score[1] = <OddItem>{book.outcomes[oddId].odds}<span>{' (' + book.outcomes[oddId].spread + ')'}</span></OddItem>;
            }
          })

          !!markets[1] && markets[1].books.forEach(book => {
            if (book.id.indexOf(id) !== -1) {
              oddList.score[2] = <OddItem>{book.outcomes[oddId].odds}<span>{' (' + book.outcomes[oddId].type.substr(0, 1).toUpperCase() + ' ' + book.outcomes[oddId].total + ')'}</span></OddItem>;
            }
          })

          oddList.score[3] = <OddLink onClick={gotoOddTab}>ODDS</OddLink>;
        }
      } catch(e) {
      }

      try {
        let overall = teamData.splits.pitching.overall[0];
        record = {
          subtitle: ['overall', 'home', 'away', 'last 10', 'strk'],
          score: [
            overall.total[0] ? `${overall.total[0].team_win}-${overall.total[0].team_loss}` : '',
            overall.home_away[0] ? `${overall.home_away[0].team_win}-${overall.home_away[0].team_loss}` : '',
            overall.home_away[1] ? `${overall.home_away[1].team_win}-${overall.home_away[1].team_loss}` : '',
            '',
            ''
          ]
        }

        if (standing) {
          record.score[3] = standing.last_10_won + '-' + standing.last_10_lost;
          record.score[4] = standing.streak;
        }

        let toverall = teamData.splits.hitting.overall[0].total[0];
        offensive = {
          subtitle: ['avg', 'slg', 'obp', 'hr', 'runs/g', 'so/g'],
          score: [
            toverall.avg,
            '.' + (toverall.slg + '').split('.')[1],
            '.' + (toverall.obp + '').split('.')[1],
            toverall.hr,
            (toverall.runs / (overall.total[0].team_win + overall.total[0].team_loss)).toFixed(1),
            (toverall.ktotal / (overall.total[0].team_win + overall.total[0].team_loss)).toFixed(1),
          ]
        }
      } catch(e) {
      }

      let tempPitcher;
      if (coverage.summary.game.status === 'scheduled' || coverage.summary.game.status === 'closed' || coverage.summary.game.status === 'complete') {
        let temp = Object.assign({}, DESKTOP_TITLE[0]);
        temp.text = 'Starting pitcher';
        DESKTOP_TITLE[0] = temp;

        temp = Object.assign({}, MOBILE_TITLE[0]);
        temp.text = 'Starting pitcher';
        MOBILE_TITLE[0] = temp;

        if (game.starting_pitcher) {
          tempPitcher = game.starting_pitcher;
        } else if (game.probable_pitcher) {
          tempPitcher = game.probable_pitcher;
        }
      } else if (coverage.summary.game.status === 'inprogress') {

        let temp = Object.assign({}, DESKTOP_TITLE[0]);
        temp.text = 'Current pitcher';
        DESKTOP_TITLE[0] = temp;

        temp = Object.assign({}, MOBILE_TITLE[0]);
        temp.text = 'Current pitcher';
        MOBILE_TITLE[0] = temp;

        tempPitcher = game.current_pitcher;
      }

      let pit = {}
      let pitcher = null;

      if (teamData.players && tempPitcher)
        pitcher = teamData.players.filter(p => p.id === tempPitcher.id)[0];

      if (pitcher && pitcher.splits.pitching) {
        pit = pitcher.splits.pitching.overall[0].total[0];
      }
      try {
        pitcherScore.push({
          pitcher: !pitcher ? `${tempPitcher.first_name.substr(0, 1)}. ${tempPitcher.last_name}` : `${pitcher.first_name.substr(0, 1)}. ${pitcher.last_name} (${pit.team_win}-${pit.team_loss})`,
          ip: pit.ip_2,
          h: pit.h,
          r: pit.runs,
          er: pit.er,
          bb: pit.bb,
          hr: pit.hr,
          so: pit.ktotal,
          era: pit.era.toFixed(2)
        })
      }
      catch(error) {
      }

      pit = {};

      try {
        if (pitcher && pitcher.splits.pitching) {
          pitcher.splits.pitching.overall[0].home_away.forEach(p => {
            if (p.value === type) {
              pit = p
            }
          });
        }

        pitcherScore.push({
          pitcher: !pitcher ? null : <SubHead>{`at ${type.substr(0, 1).toUpperCase()}${type.substr(1)} (${pit.team_win}-${pit.team_loss})`}</SubHead>,
          ip: pit.ip_2,
          h: pit.h,
          r: pit.runs,
          er: pit.er,
          bb: pit.bb,
          hr: pit.hr,
          so: pit.ktotal,
          era: (pit.era ? pit.era.toFixed(2) : 0),
        });

        if (game.lineup) {
          let lineup = game.lineup.map(line => teamData.players.filter(p => p.id === line.id)[0]);
          lineup = lineup.filter(p => !!p);
          batterScore = lineup.map(player => {
            let hit = {};
            if (player.splits.hitting) {
              hit = player.splits.hitting.overall[0].total[0];
            }
            return {
              player: this.generateLineupLink('/', player.last_name, player.position),
              ab: hit.ab,
              r: hit.runs,
              h: hit.h,
              rbi: hit.rbi,
              hr: hit.hr,
              so: hit.ktotal,
              bb: hit.bb,
              avg: hit.avg
            }}
          )
        }
      }
      catch (error) {
        console.log(error);
      }
    }

    return (
      <Wrapper>
        <Title right={right}>
          {logo && (
              <img src={logo} alt="teamlogo" width="40" height="40" />
          )}
          <span>{title}</span>
        </Title>
        {loading === STATUS.REQUEST ? (
          <Loading />
        ) : (
          <div>
            {!!oddList &&
              <LineTable title="latest odds" subtitle={oddList.subtitle} records={oddList.score} headerColor={color} />
            }
            <LineTable title="record" subtitle={record.subtitle} records={record.score} headerColor={color} />
            <LineTable title="offensive production" subtitle={offensive.subtitle} records={offensive.score} headerColor={color} />
            <TabletOnly>
              <PlayerTable titles={DESKTOP_TITLE} list={pitcherScore} headerColor={color} tableSmall />
              <Margin />
              <PlayerTable titles={MLB_LINEUP_DESKTOP_TITLE} list={batterScore} headerColor={color} tableSmall />
            </TabletOnly>
            <MobileOnly>
              <PlayerTable titles={MOBILE_TITLE} list={pitcherScore} headerColor={color} tableSmall />
              <Margin />
              <PlayerTable titles={MLB_LINEUP_MOBILE_TITLE} list={batterScore} headerColor={color} tableSmall />
            </MobileOnly>
          </div>
        )}
      </Wrapper>
    )
  }
}

export default MatchupTable;
