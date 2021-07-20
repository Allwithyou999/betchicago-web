import React, { Component } from 'react';
import styled from 'styled-components';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import Page, { MainContent, TabletOnly, MobileOnly } from '../../../containers/components/Layout';
import TeamHeader from '../../../containers/components/baseball/TeamHeader';
import ScoreTop from '../../../containers/components/baseball/ScoreTop';
import ScoreTable from '../../../containers/components/baseball/ScoreTable';
import MatchupTable from '../../../containers/components/baseball/MatchupTable';
import Loading from '../../../containers/components/Loading';
import CoverageOdds from '../../../containers/components/baseball/CoverageOdds';
import media from '../../../containers/components/Media';

import { MLB_BATTER_DESKTOP_TITLE, MLB_BATTER_MOBILE_TITLE, MLB_PITCHER_DESKTOP_TITLE, MLB_PITCHER_MOBILE_TITLE } from '../../../modules/constants/mlb';
import { THEME_COLORS } from '../../../modules/styles';
import { STATUS } from '../../../modules/constants/common';

import { loadGameCoverage, loadOdds, loadTeamSlugs, loadHomeTeamStats, loadAwayTeamStats, loadStandingsData } from '../../../apis/mlb';

const MenuHolder = styled.div`
  border-bottom: 1px solid #C8C8C8;
  display: flex;
  justify-content: center;
  margin-bottom: 25px;

  @media (max-width: 767px) {
    margin-left: -20px;
    margin-right: -20px;
  }
`

const Menu = styled.div`
  font-size: 13px;
  line-height: 15px;
  cursor: pointer;
  padding: 10px 25px;
  color: ${THEME_COLORS.BLUE};

  ${props => props.active && `
    font-weight: 700;
    color: ${THEME_COLORS.BLACK};
  `}

  @media (max-width: 767px) {
    font-size: 11px;
    padding: 8px 12px;
  }
`

const Link = styled.div`
  a {
    margin-right: 5px;
  }

  span {
    margin-left: 5px;
  }
`

const Details = styled.div`
  ${media.tablet} {
    display: flex;
    justify-content: space-between;
  }
`

const PageContent = styled.div`
  max-width: 930px;
  margin: 0 auto;
`

const TableHolder = styled.div`
  width: 100%;

  ${media.tablet} {
    max-width: 440px;
  }
`

const Liner = styled.div`
  width: 20px;
  flex-shrink: 0;

  ${media.max.mobile} {
    height: 50px;
  }
`

const Spacing = styled.div`
  height: 50px;
`

class Coverage extends Component {

  constructor(props) {
    super(props);

    this.state = {
      activeTab: 'matchup'
    }
  }

  componentDidMount() {
    const id = this.props.match.params.id;
    this.props.loadGameCoverage(id);
    this.props.loadTeamSlugs();
    this.props.loadStandingsData();
    this.props.loadOdds(new Date());

    if (this.props.match.params.tab) {
      this.setState({ activeTab: this.props.match.params.tab });
    }
  }

  componentWillReceiveProps(nextProps) {
    if (!this.props.coverage && nextProps.coverage) {
      this.props.loadHomeTeamStats(nextProps.coverage.summary.game.home.id);
      this.props.loadAwayTeamStats(nextProps.coverage.summary.game.away.id);
    }
  }

  generateLink = (link, linkText, text) => (
    <Link>
      {link === '/' ? linkText : <a href={link}>{linkText}</a>}
      <span>{text}</span>
    </Link>
  )

  generateGameStats = (hitter, pitcher, stats, gameData) => {
    if (!stats.players) return;
    for (let i = 0; i < stats.players.length; i++) {
      const player = stats.players[i];
      if (player.statistics.hitting) {
        let avg = '';
        if (gameData) {
          try {
            const p = gameData.players.filter(gp => gp.id === player.id)[0];
            if (p && p.splits.hitting) {
              avg = p.splits.hitting.overall[0].total[0].avg;
            }
          } catch(e) {}
        }
        const hit = player.statistics.hitting.overall;
        hitter.score.push({
          batter: this.generateLink('/', player.last_name, player.position),
          ab: hit.ab,
          r: hit.runs.total,
          h: hit.onbase.h,
          rbi: hit.rbi,
          bb: hit.onbase.bb,
          so: hit.outs.ktotal,
          lob: hit.lob,
          avg
        })
      }

      if (player.statistics.pitching && player.statistics.pitching.overall) {
        const pit = player.statistics.pitching.overall;
        pitcher.score.push({
          pitcher: this.generateLink('/', player.last_name, player.position),
          ip: pit.ip_2,
          h: pit.onbase.h,
          r: pit.runs.total,
          er: pit.runs.earned,
          bb: pit.onbase.bb,
          hr: pit.onbase.hr,
          so: pit.outs.ktotal,
          era: pit.era
        })
      }
    }

    if (stats.statistics.hitting && stats.statistics.hitting.overall) {
      const hit = stats.statistics.hitting.overall;
      hitter.total = {
        batter: 'Totals',
        ab: hit.ab,
        r: hit.runs.total,
        h: hit.onbase.h,
        rbi: hit.rbi,
        bb: hit.onbase.bb,
        so: hit.outs.ktotal,
        lob: hit.lob
      }
    }
    else {
      hitter.total = {};
    }

    if (stats.statistics.pitching && stats.statistics.pitching.overall) {
      const pit = stats.statistics.pitching.overall;
      pitcher.total = {
        pitcher: 'Totals',
        ip: pit.ip_2,
        h: pit.onbase.h,
        r: pit.runs.total,
        er: pit.runs.earned,
        bb: pit.onbase.bb,
        hr: pit.onbase.hr,
        so: pit.outs.ktotal
      }
    }
    else {
      pitcher.total = {};
    }
  }

  gotoOddTab = () => {
    this.setState({ activeTab: 'odds' })
  }

  setActiveTab = (key) => this.setState({ activeTab: key });

  render() {
    const {
      coverage, slugs, loading, loadingSlugs, odds, loadingOdds, homeTeamStats, loadingHomeStats,
      awayTeamStats, loadingAwayStats, lastResults, lastAwayResults, standings
    } = this.props;

    let game;

    let homeHitters = {
      score: [],
      total: {}
    };
    let homePitchers = {
      score: [],
      total: {}
    }
    let awayHitters = {
      score: [],
      total: {}
    };
    let awayPitchers = {
      score: [],
      total: {}
    };

    let gameOdd;
    let gameHomeStanding, gameAwayStanding;

    if (loading === STATUS.SUCCESS && loadingSlugs === STATUS.SUCCESS && !!coverage) {
      game = coverage.summary.game;

      Object.keys(slugs.slug).forEach(slug => {
        if (slugs.slug[slug].id === game.away_team) {
          coverage.away_logo = slugs.images.logo_60 + slug + '.png?alt=media';
          coverage.away_back = slugs.images.background + slug + '-away.png?alt=media';
          coverage.away_color = slugs.slug[slug]['bg-color'];
        } else if (slugs.slug[slug].id === game.home_team) {
          coverage.home_logo = slugs.images.logo_60 + slug + '.png?alt=media';
          coverage.home_back = slugs.images.background + slug + '-home.png?alt=media';
          coverage.home_color = slugs.slug[slug]['bg-color'];
        }
      });

      //Box Score

      //Home Hitters
      this.generateGameStats(homeHitters, homePitchers, game.home, homeTeamStats);
      this.generateGameStats(awayHitters, awayPitchers, game.away, awayTeamStats);

      if (loadingOdds === STATUS.SUCCESS) {
        console.log(odds);
        odds
          .filter(odd => new Date(odd.scheduled).getDate() === new Date().getDate())
          .forEach(odd => {
            let match = true;
            odd.competitors.forEach(c => {
              if (
                (c.qualifier === 'home' && c.abbreviation !== game.home.abbr) ||
                (c.qualifier === 'away' && c.abbreviation !== game.away.abbr)
              ) {
                match = false;
              }
            })
            if (match) {
              gameOdd = odd;
            }
          });
      }

      if (standings) {
        standings.leagues.forEach(league => {
          league.divisions.forEach(division => {
            division.teams.forEach(team => {
              if (team.id === game.home.id) {
                gameHomeStanding = team;
              } else if (team.id === game.away.id) {
                gameAwayStanding = team;
              }
            })
          })
        })
      }
    }

    const tabs = [
      {text: 'MATCHUP', key: 'matchup'},
      {text: 'BOX SCORE', key: 'box_score'},
      {text: 'ODDS', key: 'odds'}
    ];

    let { activeTab } = this.state;
    if (!tabs.filter(tab => tab.key === activeTab).length) {
      activeTab = 'box_score';
    }

    return (
      <div>
        {(loading === STATUS.REQUEST || loadingSlugs === STATUS.REQUEST) ? (
          <Loading />
        ) : (
          <div>
            {!coverage ? (
              <h1>No Game Data</h1>
            ) : (
              <div>
                <TeamHeader coverage={coverage} odd={gameOdd} />
                <Page>
                  <MainContent>
                    <ScoreTop coverage={coverage} teamHomeData={homeTeamStats} teamAwayData={awayTeamStats} />
                    <MenuHolder>
                      {
                        tabs.map(tab => (
                          <Menu
                            onClick={() => this.setActiveTab(tab.key)}
                            active={tab.key === activeTab}
                            key={tab.key}>
                            {tab.text}
                          </Menu>
                        ))
                      }
                    </MenuHolder>
                    <PageContent>
                      {activeTab === 'box_score' &&
                        <div>
                          <TabletOnly>
                            <Details>
                              <TableHolder>
                                <ScoreTable title={coverage.summary.game.away.market + ' ' + coverage.summary.game.away.name} tableTitle={MLB_BATTER_DESKTOP_TITLE} color={coverage.away_color} logo={coverage.away_logo} score={awayHitters} />
                                {/* <ScoreNotes title="Notes" /> */}
                              </TableHolder>
                              <Liner />
                              <TableHolder>
                                <ScoreTable title={coverage.summary.game.home.market + ' ' + coverage.summary.game.home.name} tableTitle={MLB_BATTER_DESKTOP_TITLE} color={coverage.home_color} right logo={coverage.home_logo} score={homeHitters} />

                                {/* <ScoreNotes title="Notes" /> */}
                              </TableHolder>
                            </Details>
                            <Details>
                              <TableHolder>
                                <ScoreTable title={coverage.summary.game.away.market + ' ' + coverage.summary.game.away.name} tableTitle={MLB_PITCHER_DESKTOP_TITLE} color={coverage.away_color} logo={coverage.away_logo} score={awayPitchers} />
                              </TableHolder>
                              <Liner />
                              <TableHolder>
                                <ScoreTable title={coverage.summary.game.home.market + ' ' + coverage.summary.game.home.name} tableTitle={MLB_PITCHER_DESKTOP_TITLE} color={coverage.home_color} right logo={coverage.home_logo} score={homePitchers} />
                              </TableHolder>
                            </Details>
                          </TabletOnly>
                          <MobileOnly>
                            <TableHolder>
                              <ScoreTable title={coverage.summary.game.home.market + ' ' + coverage.summary.game.home.name} tableTitle={MLB_BATTER_MOBILE_TITLE} color={coverage.home_color} logo={coverage.home_logo} score={homeHitters} />
                              {/* <ScoreNotes title="Notes" /> */}
                            </TableHolder>
                            <TableHolder>
                              <ScoreTable tableTitle={MLB_PITCHER_MOBILE_TITLE} color={coverage.home_color} score={homePitchers} />
                            </TableHolder>
                            <Spacing />
                            <TableHolder>
                              <ScoreTable title={coverage.summary.game.away.market + ' ' + coverage.summary.game.away.name} tableTitle={MLB_BATTER_MOBILE_TITLE} color={coverage.away_color} logo={coverage.away_logo} score={awayHitters} />
                              {/* <ScoreNotes title="Notes" /> */}
                            </TableHolder>
                            <TableHolder>
                              <ScoreTable tableTitle={MLB_PITCHER_MOBILE_TITLE} color={coverage.away_color} score={awayPitchers} />
                            </TableHolder>
                          </MobileOnly>
                        </div>
                      }
                      {activeTab === 'odds' &&
                        <div>
                          {loadingOdds === STATUS.REQUEST ? <Loading /> : <CoverageOdds odd={gameOdd} />}
                        </div>
                      }
                      {activeTab === 'matchup' &&
                        <div>
                          <Details>
                            <TableHolder>
                              <MatchupTable
                                title={coverage.summary.game.away.market + ' ' + coverage.summary.game.away.name}
                                tableTitle={MLB_BATTER_DESKTOP_TITLE}
                                color={coverage.away_color}
                                logo={coverage.away_logo}
                                coverage={coverage}
                                teamData={awayTeamStats}
                                loading={loadingAwayStats}
                                last10={lastAwayResults}
                                gotoOddTab={this.gotoOddTab}
                                standing={gameAwayStanding}
                                odd={gameOdd}
                                type='away' />
                              {/* <ScoreNotes title="Inuries" /> */}
                            </TableHolder>
                            <Liner />
                            <TableHolder>
                              <MatchupTable
                                title={coverage.summary.game.home.market + ' ' + coverage.summary.game.home.name}
                                tableTitle={MLB_BATTER_DESKTOP_TITLE}
                                color={coverage.home_color}
                                logo={coverage.home_logo}
                                coverage={coverage}
                                teamData={homeTeamStats}
                                loading={loadingHomeStats}
                                last10={lastResults}
                                gotoOddTab={this.gotoOddTab}
                                standing={gameHomeStanding}
                                odd={gameOdd}
                                right
                                type='home' />
                              {/* <ScoreNotes title="Inuries" /> */}
                            </TableHolder>
                          </Details>
                        </div>
                      }
                    </PageContent>
                  </MainContent>
                </Page>
              </div>
            )}
          </div>
        )}
      </div>
    );
  }
}

const mapStateToProps = state => ({
  coverage: state.mlb.coverage,
  slugs: state.mlb.slugs,
  odds: state.mlb.odds,
  standings: state.mlb.standings,
  homeTeamStats: state.mlb.homeTeamStats,
  awayTeamStats: state.mlb.awayTeamStats,
  loading: state.mlb.loading.coverage,
  loadingSlugs: state.mlb.loading.slugs,
  loadingOdds: state.mlb.loading.odds,
  loadingHomeStats: state.mlb.loading.homeTeamStats,
  loadingAwayStats: state.mlb.loading.awayTeamStats
});

const mapDispatchToProps = dispatch =>
  bindActionCreators(
    {
      loadGameCoverage,
      loadTeamSlugs,
      loadOdds,
      loadHomeTeamStats,
      loadAwayTeamStats,
      loadStandingsData
    },
    dispatch
  );

export default connect(mapStateToProps, mapDispatchToProps)(Coverage);
