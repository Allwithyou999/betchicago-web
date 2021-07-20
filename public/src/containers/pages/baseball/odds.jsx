import React, { Component } from 'react';
import styled from 'styled-components';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import ContentPromo from '../../../containers/components/ContentPromo';
import Page, { MainContent, SidebarRight } from '../../../containers/components/Layout';
import PlayerTable from '../../../containers/components/players/PlayerTable';
import SidebarWidget from '../../../containers/components/SidebarWidget';
import media from '../../../containers/components/Media';
import Loading from '../../../containers/components/Loading';

import { loadOdds, loadScoreboardData } from '../../../apis/mlb';
import { MLB_ODDS_DESKTOP_TITLE, MLB_ODDS_MOBILE_TITLE } from '../../../modules/constants/mlb';
import { formatDateFull, getTimezone, formatAMPM } from '../../../modules/utilities/formatter';
import { STATUS } from '../../../modules/constants/common';
import { TabletOnly, MobileOnly } from '../../components/Layout';

const Wrapper = styled.div`

  ${media.tablet} {
    h1 {
      font-weight: 300;
    }
  }
`

const TextDisclaimer = styled.div`
  font-size: 11px;
  line-height: 13px;
  margin: 15px 0;
`

const OT = styled.div`
  font-size: 13px;
  line-height: 15px;
  font-weight: 300;
  margin-bottom: 8px;

  b {
    font-weight: 600;
  }
`

class Odds extends Component {
  constructor(props) {
    super(props);

    this.state = {
    }
  }

  componentDidMount() {
    this.props.loadOdds(new Date());
    this.props.loadScoreboardData(formatDateFull(new Date()));
  }

  generateOdds = (markets, id) => {
    let home = '-';
    let away = '-';
    let line = '-';

    if (markets) {
      !!markets[0] && markets[0].books.forEach(book => {
        if (book.id.indexOf(id) !== -1) {
          book.outcomes && book.outcomes.forEach(out => {
            if (out.type === 'home') home = out.odds;
            if (out.type === 'away') away = out.odds;
          })
        }
      })

      !!markets[1] && markets[1].books.forEach(book => {
        if (book.id.indexOf(id) !== -1) {
          if (book.outcomes) {
            let prevOdd;
            book.outcomes.forEach(out => {
              if (out.odds.substr(0, 1) === '-') {
                if (!prevOdd || (prevOdd && parseInt(out.odds, 10) < prevOdd)) {
                  line = out.total + ' / ' + out.type.substr(0, 1).toUpperCase() + ' ' + out.odds;
                  prevOdd = parseInt(out.odds, 10);
                } else if (prevOdd && parseInt(out.odds, 10) === prevOdd) {
                  line = out.total + ' / U ' + out.odds;
                }
              }
            });
            if (line === '-' && book.outcomes.length) {
              let out = book.outcomes[0];
              line = out.total + ' / ' + out.type.substr(0, 1).toUpperCase() + ' ' + out.odds;
            }
          }
        }
      })
    }

    return (<div>
            <OT>{line}</OT>
            <OT>{away}</OT>
            <OT>{home}</OT>
          </div>)
  }

  render() {

    const { odds, loadingOdds, scoreboard, loadingScoreboard } = this.props;

    let oddsList = [];

    let timezone;

    if (loadingOdds === STATUS.SUCCESS && loadingScoreboard === STATUS.SUCCESS) {
      // console.log(Intl.DateTimeFormat().resolvedOptions().timeZone)
      timezone = getTimezone();

      odds
        .filter(odd => new Date(odd.scheduled).getDate() === new Date().getDate())
        .forEach(odd => {
          let homeAbbr, awayAbbr;
          odd.competitors.forEach(c => {
            if (c.qualifier === 'home') homeAbbr = c.abbreviation;
            if (c.qualifier === 'away') awayAbbr = c.abbreviation;
          })

          let game;
          if (scoreboard.league.games)
            game = scoreboard.league.games.filter(g => g.game.home.abbr === homeAbbr && g.game.away.abbr === awayAbbr)[0];
          if (game) {
            let oddsItem = {};

            let scheduled = new Date(odd.scheduled);
            oddsItem.game = (<div>
                              <OT><b>{formatDateFull(scheduled).substr(5)} @ {formatAMPM(scheduled).toUpperCase()} {timezone}</b></OT>
                              <OT><b>{awayAbbr}</b> {game.game.away.market} ({game.game.away.win}-{game.game.away.loss})</OT>
                              <OT><b>{homeAbbr}</b> {game.game.home.market} ({game.game.home.win}-{game.game.home.loss})</OT>
                            </div>)

            oddsItem.westgate = this.generateOdds(odd.markets, '17084');
            oddsItem.open = this.generateOdds(odd.markets, '17084');
            oddsItem.cgTech = this.generateOdds(odd.markets, '17089');
            oddsItem.wmHill = this.generateOdds(odd.markets, '17100');
            oddsItem.wynn = this.generateOdds(odd.markets, '17101');
            oddsItem.pinnacle = this.generateOdds(odd.markets, '92');
            oddsItem.matchup = 'Matchup';
            oddsItem.link = `coverage/${game.game.id}`;
            oddsItem.timeValue = scheduled.getTime();
            oddsList.push(oddsItem);

          }
        })

      oddsList = oddsList.sort((a, b) => a.timeValue - b.timeValue);
    }

    return (
      <div>
        <Page>
          <MainContent hasRight>
            <Wrapper>
              <h1>{window.cApplicationLocal.pageHeadline || 'MLB Odds & Betting'}</h1>
              {(loadingOdds === STATUS.SUCCESS && loadingScoreboard === STATUS.SUCCESS) ? (
                <div>
                  <TextDisclaimer>Disclaimer: Odds information is provided for information purposes only. Contact your preferred licensed sport book for available odds and payout information.  </TextDisclaimer>
                  <TabletOnly>
                    <PlayerTable titles={MLB_ODDS_DESKTOP_TITLE} list={oddsList} />
                  </TabletOnly>
                  <MobileOnly>
                    <PlayerTable titles={MLB_ODDS_MOBILE_TITLE} list={oddsList} />
                  </MobileOnly>
                </div>
              ) : (
                <Loading />
              )}
            </Wrapper>
          </MainContent>
          <SidebarRight>
            <SidebarWidget title="ODDS & BETTING HEADLINES">
            </SidebarWidget>
            <SidebarWidget>
              <ContentPromo />
            </SidebarWidget>
          </SidebarRight>
        </Page>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  odds: state.mlb.odds,
  scoreboard: state.mlb.scoreboard,
  loadingOdds: state.mlb.loading.odds,
  loadingScoreboard: state.mlb.loading.scoreboard,
});

const mapDispatchToProps = dispatch =>
  bindActionCreators(
    {
      loadOdds,
      loadScoreboardData
    },
    dispatch
  );

export default connect(mapStateToProps, mapDispatchToProps)(Odds);
