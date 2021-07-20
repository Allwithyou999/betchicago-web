import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import styled from 'styled-components';

import { Article, ArticleMainBrief, ArticleItem } from '../../../containers/components/articles';
import Page, {
  MainContent,
  SidebarLeft,
  SidebarRight,
  TabletOnly,
  MobileOnly
} from '../../../containers/components/Layout';
import SidebarWidget from '../../../containers/components/SidebarWidget';
import LineTable from '../../../containers/components/baseball/LineTable';
import PlayerTable from '../../../containers/components/players/PlayerTable';
import Loading from '../../../containers/components/Loading';
import media from '../../../containers/components/Media';
import ScheduleItem from '../../../containers/components/baseball/ScheduleItem';

import { MAX_WIDTH } from '../../../modules/styles';
import { STATUS } from '../../../modules/constants/common';
import { formatDate } from '../../../modules/utilities/formatter';
import { MLB_TEAM_PITCHER_DESKTOP_TITLE, MLB_TEAM_HITTER_PLAYER_TITLE } from '../../../modules/constants/mlb';
import { loadTeamSlugs, loadHomeTeamStats, loadTeamSchedule, loadTeamApArticle, loadStandingsData } from '../../../apis/mlb';

const Wrapper = styled.div`
  padding-top: 10px;
`;

const ArticleItemWithImage = styled.div`
  padding: 20px;

  ${media.tablet} {
    padding: 0;
  }
`;

const Spacing = styled.div`
  margin-bottom: 20px;
`

const Divider = styled.div`
  border-top: 1px solid #dadae2;
  margin-bottom: 20px;
`;

const TeamHeader = styled.div`
  background: ${props => props.color};
  height: 85px;

  div {
    background-image: url(${props => props.background});
    background-position: left center;
    max-width: ${MAX_WIDTH}px;
    margin: auto;
    padding-left: 243px;
    display: flex;
    align-items: center;
    color: white;
    height: 100%;
  }

  ${media.max.mobile} {
    height: 50px;

    div {
      background-size: auto 100%;
      padding-left: 0;
      padding-right: 50px;

      h1 {
        width: 100%;
        font-size: 18px;
        text-align: right;
      }
    }
  }
`

const TableLink = styled.div`
  a {
    margin-right: 5px;
  }
`

class Teams extends Component {
  componentWillReceiveProps(nextProps) {
    if (this.props.loadingSlugs !== nextProps.loadingSlugs && nextProps.loadingSlugs === STATUS.SUCCESS) {
      const { slugs } = nextProps;
      const slug = this.props.match.params.slug;
      const teamId = slugs.slug[slug].id;
      this.props.loadHomeTeamStats(teamId);
      this.props.loadTeamSchedule(teamId);
      this.props.loadStandingsData();
    }
  }

  componentDidMount() {
    this.props.loadTeamSlugs();

    if (!window.initApp)
      return;

    let parts = window.location.href.split('/');
    let tag = parts[parts.length - 1];
    parts = tag.split('?');
    tag = parts[0];
    tag = tag.toLowerCase().replace(/[[\]\-{}"'()*+? .\\^$|]/g, '');
    let pageLen = 20;

    this.props.loadTeamApArticle(tag, pageLen);
  }

  generateLink = (link, linkText, text) => (
    <TableLink>
      <a href={link}>{linkText}</a>
      <span>{text}</span>
    </TableLink>
  )

  render() {

    const { slugs, loadingSlugs, teamStats, loadingStats, teamSchedule, loadingSchedule, standings } = this.props;
    const slug = this.props.match.params.slug;

    let team = {};
    let teamStanding = false;

    if (loadingSlugs === STATUS.SUCCESS) {
      team.name = slugs.slug[slug].name;
      team.market = slugs.slug[slug].market;
      team.id = slugs.slug[slug].id;
      team.logo = slugs.images.logo_60 + slug + '.png?alt=media';
      team.background = slugs.images.background + slug + '-away.png?alt=media';
      team.color = slugs.slug[slug]['bg-color'];

      if (standings) {
        standings.leagues.forEach(league => {
          league.divisions.forEach(division => {
            division.teams.forEach(t => {
              if (t.id === team.id) {
                teamStanding = t;
              }
            })
          })
        })
      }
    }

    let hitterList = [];
    let pitcherList = [];

    let record = {
      subtitle: [],
      score: []
    }

    let offensive = {
      subtitle: [],
      score: []
    }

    if (loadingStats === STATUS.SUCCESS) {
      let teamData = teamStats;
      //Player Table
      teamData.players.forEach(player => {

        try {
          if (player.splits.pitching) {
            const pit = player.splits.pitching.overall[0].total[0];

            const data = {
              player: this.generateLink('/', player.first_name, player.position),
              ip: pit.ip_2,
              h: pit.h,
              r: pit.runs,
              er: pit.er,
              bb: pit.bb,
              hr: pit.hr,
              so: pit.ktotal,
              era: pit.era.toFixed(2)
            }

            pitcherList.push(data);
          } else if (player.splits.hitting) {
            const data = {
              player: this.generateLink('/', player.first_name, player.position)
            }
            if (player.splits.hitting) {
              data.ab = player.splits.hitting.overall[0].total[0].ab;
              data.r = player.splits.hitting.overall[0].total[0].runs;
              data.h = player.splits.hitting.overall[0].total[0].h;
              data.rbi = player.splits.hitting.overall[0].total[0].rbi;
              data.bb = player.splits.hitting.overall[0].total[0].bb;
              data.avg = player.splits.hitting.overall[0].total[0].avg;
            }

            hitterList.push(data);
          }
        }
        catch (e) {
        }

      });

      //Team Statistics
      let overall = teamData.splits.pitching.overall[0];
      record = {
        subtitle: ['overall', 'home', 'away', 'last 10'],
        score: [
          `${overall.total[0].team_win}-${overall.total[0].team_loss}`,
          `${overall.home_away[0].team_win}-${overall.home_away[0].team_loss}`,
          `${(overall.home_away[1] && overall.home_away[1].team_win) || 0}-${(overall.home_away[1] && overall.home_away[1].team_loss) || 0}`,
          '...',
        ]
      }

      if (teamStanding) {
        record.score[3] = teamStanding.last_10_won + '-' + teamStanding.last_10_lost;
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
    }

    //Team Schedule
    let scheduleItems = [];
    if (loadingSchedule === STATUS.SUCCESS) {
      scheduleItems = Object.keys(teamSchedule)
        .filter(key => teamSchedule[key].status !== 'closed' && new Date(teamSchedule[key].scheduled).getMonth() <= new Date().getMonth())
        .map(key => teamSchedule[key])
        .sort((a, b) => new Date(a.scheduled).getTime() - new Date(b.scheduled).getTime())
        .map((schedule, index) => {
          let isHome = true;
          let otherId = schedule.away_team;
          let otherLogo;
          let otherMarket;
          if (schedule.away_team === team.id) {
            isHome = false;
            otherId = schedule.home_team;
          }

          Object.keys(slugs.slug).forEach(slug => {
            let otherTeam = slugs.slug[slug];
            if (otherTeam.id === otherId) {
              otherLogo = slugs.images.logo_60 + slug + '.png?alt=media';
              otherMarket = otherTeam.market;
              return;
            }
          });

          return (<ScheduleItem market={otherMarket} isHome={isHome} logo={otherLogo} date={formatDate(new Date(schedule.scheduled), 'ww MM/dd')} key={`schedule-${index}`} />);
        });

    }

    //AP Articles
    let articles = [];
    let mainArticle = {};
    let headlineList = [];

    const { apArticles, loadingApArticle } = this.props;


    if (loadingApArticle === STATUS.SUCCESS) {
      articles = apArticles;
      mainArticle = articles[0];
      headlineList = articles.slice(1, 20);
    }

    return (
      <div>
        {loadingSlugs === STATUS.REQUEST ? (
          <Loading />
        ) : (
          <div>
            <TeamHeader color={team.color} background={team.background}>
              <div>
                <h1>{team.market.toUpperCase()} {team.name.toUpperCase()}</h1>
              </div>
            </TeamHeader>
            <TabletOnly>
              <Page>
                <SidebarLeft>
                  <SidebarWidget title="UPCOMING SCHEDULE">
                    {loadingSchedule === STATUS.REQUEST ?
                      <Loading /> :
                      scheduleItems
                    }
                  </SidebarWidget>
                </SidebarLeft>

                <MainContent hasLeft hasRight>
                  {loadingApArticle === STATUS.REQUEST ? (
                    <Loading />
                  ) : (
                    <Wrapper>
                      <ArticleMainBrief article={mainArticle} tag="MLB" />
                      <Divider />
                      <ArticleItemWithImage>
                        {headlineList.map((article, index) => (
                          <ArticleItem article={article} key={'headline' + index} />
                        ))}
                      </ArticleItemWithImage>
                    </Wrapper>
                  )}
                </MainContent>
                <SidebarRight>
                  <SidebarWidget>
                    {loadingStats === STATUS.REQUEST ? (
                      <Loading />
                    ) : (
                      <div>
                        <LineTable title="record" subtitle={record.subtitle} records={record.score} headerColor={"#193C8A"} />
                        <LineTable title="OFFENSIVE PRODUCTION" subtitle={offensive.subtitle} records={offensive.score} headerColor={"#193C8A"} />
                        <PlayerTable titles={MLB_TEAM_HITTER_PLAYER_TITLE} list={hitterList} headerColor={"#193C8A"} tableSmall />
                        <Spacing />
                        <PlayerTable titles={MLB_TEAM_PITCHER_DESKTOP_TITLE} list={pitcherList} headerColor={"#193C8A"} tableSmall />
                      </div>
                    )}
                  </SidebarWidget>
                </SidebarRight>
              </Page>
            </TabletOnly>

            <MobileOnly>
              <Article article={mainArticle} />
              <ArticleItemWithImage>
                <Divider />
                {articles
                  .slice(1, 4)
                  .map((article, index) => (
                    <ArticleItem article={article} key={index} />
                  ))}
                <Divider />
              </ArticleItemWithImage>
            </MobileOnly>
          </div>
        )}
      </div>
    );
  }
}

const mapStateToProps = state => ({
  slugs: state.mlb.slugs,
  teamStats: state.mlb.homeTeamStats,
  teamSchedule: state.mlb.teamSchedule,
  apArticles: state.mlb.apArticles,
  standings: state.mlb.standings,
  loadingSlugs: state.mlb.loading.slugs,
  loadingStats: state.mlb.loading.homeTeamStats,
  loadingSchedule: state.mlb.loading.teamSchedule,
  loadingApArticle: state.mlb.loading.apArticles,
});

const mapDispatchToProps = dispatch =>
  bindActionCreators(
    {
      loadTeamSlugs,
      loadHomeTeamStats,
      loadTeamSchedule,
      loadTeamApArticle,
      loadStandingsData
    },
    dispatch
  );

export default connect(mapStateToProps, mapDispatchToProps)(Teams);
