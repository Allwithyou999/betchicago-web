import React, { Component } from 'react';
import styled from 'styled-components';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import PlayerTable from '../../../containers/components/players/PlayerTable';
import ContentPromo from '../../../containers/components/ContentPromo';
import Page, { MainContent, SidebarRight, TabletOnly, MobileOnly } from '../../../containers/components/Layout';
import SidebarWidget from '../../../containers/components/SidebarWidget';
import TrendingStories from '../../../containers/components/TrendingStories';
import { TableTitle } from '../../../containers/components/Common';
import Loading from '../../../containers/components/Loading';
import media from '../../../containers/components/Media';

import { THEME_COLORS } from '../../../modules/styles';
import { STATUS } from '../../../modules/constants/common';
import {
  MLB_STANDINGS_DESKTOP_EAST_TITLE, MLB_STANDINGS_DESKTOP_CENTRAL_TITLE, MLB_STANDINGS_DESKTOP_WEST_TITLE,
  MLB_STANDINGS_MOBILE_EAST_TITLE, MLB_STANDINGS_MOBILE_CENTRAL_TITLE, MLB_STANDINGS_MOBILE_WEST_TITLE,
} from '../../../modules/constants/mlb';
import { loadStandingsData, loadTeamSlugs, loadUpcomingSchedules } from '../../../apis/mlb';
import { getTrendingStories } from '../../../modules/local-service';
import { formatDate } from '../../../modules/utilities/formatter';

const Wrapper = styled.div`
  padding-top: 15px;

  ${media.tablet} {
    h1 {
      font-weight: 300;
    }
  }
`;

const TableHolder = styled.div`
  margin-bottom: 20px;
`

const Team = styled.div`
  display: flex;
  align-items: center;
  padding: 5px;

  a {
    color: ${THEME_COLORS.BLUE};
    font-size: 15px;
    line-height: 18px;
    text-decoration: none;
    margin-left: 15px;
  }
`


class Standings extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isFinal: false,
      showTourList: false
    }
  }

  componentDidMount() {
    this.props.loadStandingsData();
    this.props.loadTeamSlugs();
    this.props.loadUpcomingSchedules(new Date().toISOString().split('.')[0]);
  }

  buildTeam = (img, name, slug) => (
    <Team>
      <img src={img} alt="team" width="24" height="24" />
      <a href={`teams/${slug}`}>{name}</a>
    </Team>
  )

  renderDivision = (league, division, title, mobileTitle) => {

    const { slugs, schedule } = this.props;


    let sortedSchedule = [];

    if (schedule) {
      sortedSchedule =
        Object.keys(schedule)
          .map(key => schedule[key])
          .sort((a, b) => new Date(a.scheduled).getTime() - new Date(b.scheduled).getTime());
    }

    for (let i = 0; i < league.divisions.length; i ++) {
      if (league.divisions[i].name === division) {
        let score = league.divisions[i].teams.map((team) => {
          const teamSchedule = sortedSchedule.filter(s => s.away_team === team.id || s.home_team === team.id)[0];
          let nextGame = '';
          if (teamSchedule) {
            nextGame = formatDate(new Date(teamSchedule.scheduled), 'MM/dd');
            if (teamSchedule.home_team === team.id) {
              nextGame += ' vs ' + teamSchedule.away.market;
            } else {
              nextGame += ' @ ' + teamSchedule.home.market;
            }
          }

          let result = {
            w: team.win,
            l: team.loss,
            pct: '.' + (team.win_p.toFixed(3) + '').split('.')[1],
            gb: team.games_back === 0 ? '-' : team.games_back,
            strk: team.streak,
            last10: team.last_10_won + '-' + team.last_10_lost,
            home: team.home_win + '-' + team.home_loss,
            road: team.away_win + '-' + team.away_loss,
            nextGame
          }

          Object.keys(slugs.slug).forEach(slug => {
            if (slugs.slug[slug].id === team.id) {
              const logo = slugs.images.logo_60 + slug + '.png?alt=media';
              result.title = this.buildTeam(logo, team.market, slug);
            }
          });

          return result;
        })

        return (
          <TableHolder>
            <TabletOnly>
              <PlayerTable
                titles={title}
                list={score}
                tableSmall
              />
            </TabletOnly>
            <MobileOnly>
              <PlayerTable
                titles={mobileTitle}
                list={score}
                tableSmall
              />
            </MobileOnly>
          </TableHolder>
        );
      }
    }

    return null;
  }

  renderLeague = (league, index) => {
    return (
      <div key={`league-${index}`}>
        <TableTitle>{league.name.toUpperCase()}</TableTitle>
        {
          this.renderDivision(league, 'East', MLB_STANDINGS_DESKTOP_EAST_TITLE, MLB_STANDINGS_MOBILE_EAST_TITLE)
        }
        {
          this.renderDivision(league, 'Central', MLB_STANDINGS_DESKTOP_CENTRAL_TITLE, MLB_STANDINGS_MOBILE_CENTRAL_TITLE)
        }
        {
          this.renderDivision(league, 'West', MLB_STANDINGS_DESKTOP_WEST_TITLE, MLB_STANDINGS_MOBILE_WEST_TITLE)
        }
      </div>
    )
  }

  render() {

    const { standings, loading, loadingSlugs, loadingSchedule } = this.props;

    const stories = getTrendingStories();

    return (
      <div>
        <div>
          <Page>
            <MainContent hasRight>
              {(loading === STATUS.REQUEST || loadingSlugs === STATUS.REQUEST || loadingSchedule === STATUS.REQUEST) ? (
                <Loading />
              ) : (
                <Wrapper>
                  <h1>{window.cApplicationLocal.pageHeadline || 'MLB Standings'}</h1>
                  <MobileOnly>
                    <h6>American & National Leagues</h6>
                  </MobileOnly>
                  {
                    standings.leagues.map((league, index) => this.renderLeague(league, index))
                  }
                </Wrapper>
              )}
            </MainContent>
            <SidebarRight>
              <SidebarWidget title="TRENDING STORIES">
                <TrendingStories stories={stories} />
              </SidebarWidget>
              <SidebarWidget>
                <ContentPromo />
              </SidebarWidget>
            </SidebarRight>
          </Page>
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  standings: state.mlb.standings,
  slugs: state.mlb.slugs,
  schedule: state.mlb.upcomingSchedule,
  loading: state.mlb.loading.standings,
  loadingSlugs: state.mlb.loading.slugs,
  loadingSchedule: state.mlb.loading.upcomingSchedule,
});

const mapDispatchToProps = dispatch =>
  bindActionCreators(
    {
      loadStandingsData,
      loadTeamSlugs,
      loadUpcomingSchedules
    },
    dispatch
  );

export default connect(mapStateToProps, mapDispatchToProps)(Standings);
