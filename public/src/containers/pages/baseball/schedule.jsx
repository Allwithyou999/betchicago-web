import React, { Component } from 'react';
import styled from 'styled-components';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import ContentPromo from '../../../containers/components/ContentPromo';
import Page, { MainContent, SidebarRight } from '../../../containers/components/Layout';
import SidebarWidget from '../../../containers/components/SidebarWidget';
import TrendingStories from '../../../containers/components/TrendingStories';
import Loading from '../../../containers/components/Loading';
import PlayerTable from '../../../containers/components/players/PlayerTable';
import CalendarDay from '../../../containers/components/baseball/CalendarDay';
import { TableTitle } from '../../../containers/components/Common';
import media from '../../../containers/components/Media';

import { getTrendingStories } from '../../../modules/local-service';
import { formatDate, formatDateFull, formatAMPM } from '../../../modules/utilities/formatter';
import { MLB_SCHEDULE_DESKTOP_TITLE, MLB_SCHEDULE_MOBILE_TITLE } from '../../../modules/constants/mlb';

import { MobileOnly, TabletOnly } from '../../components/Layout';
import { THEME_COLORS } from '../../../modules/styles';
import { loadSchedules, loadTeamSlugs } from '../../../apis/mlb';
import { STATUS } from '../../../modules/constants/common';

const Wrapper = styled.div`

  ${media.tablet} {
    h1 {
      font-weight: 300;
    }
  }

  ${media.desktop} {
    padding-right: 30px;
  }
`;

const TitleHolder = styled.div`
  display: flex;
  justify-content: space-between;
  flex-direction: column-reverse;
  padding-top: 20px;

  ${media.tablet} {
    flex-direction: column;
  }

  ${media.desktop} {
    flex-direction: row;
  }
`

const Team = styled.div`
  display: flex;
  align-items: center;
  padding: 5px;

  img {
    width: 24px;
    height: 24px;
  }

  a {
    margin-left: 5px;
  }
`

const PlayerName = styled.span`
  font-size: 13px;
  line-height: 18px;
  color: ${THEME_COLORS.BLUE};
  display: inline-block;
`

const Link = styled.a`
  font-size: 13px;
  line-height: 18px;
  color: ${THEME_COLORS.BLUE};
  text-decoration: none;
  display: inline-block;

  ${media.tablet} {
    font-size: 15px;

    ${props => props.small && `
      font-size: 13px;
    `}
  }
`

const Flex = styled.div`
  display: flex;
  align-items: center;
`

const Text = styled.div`
  margin: 0 5px;

  ${media.tablet && `
    margin-right: 8px;
  `}
`

const VS = styled.div`
  margin: 0 5px;
`


class Schedule extends Component {
  constructor(props) {
    super(props);

    this.state = {
      date: new Date()
    }
  }

  componentDidMount() {
    this.loadScheduleData();
    this.props.loadTeamSlugs();
  }

  loadScheduleData = () => {
    const date = new Date(this.state.date);
    const prev = new Date(new Date(date).setDate(date.getDate() - 1));
    this.props.loadSchedules(formatDateFull(prev), formatDateFull(date));
  }

  buildTeam = (name, link, logo) => (
    <Team>
      <img src={logo} alt={name} />
      <Link href={link}>{name}</Link>
    </Team>
  )

  onChangeDate = date => {
    this.setState({ date });
    setTimeout(() => {
      this.loadScheduleData();
    });

  }

  generateScheduleList = (schedule, slugs, boxscore) => (
    schedule.map((item, index) => {
      const home = item.home;
      const away = item.away;

      const game = boxscore.league.games.filter(game => game.game.away_team === item.away_team && game.game.home_team === item.home_team)[0];

      let homePitcher = ''
        , awayPitcher = '';
      if (game) {
        if (game.game.home.probable_pitcher) {
          homePitcher = game.game.home.probable_pitcher.first_name + ' ' + game.game.home.probable_pitcher.last_name;
        }
        if (game.game.away.probable_pitcher) {
          awayPitcher = game.game.away.probable_pitcher.first_name + ' ' + game.game.away.probable_pitcher.last_name;
        }
      }

      let network = '';
      if (item.broadcast)
        network = item.broadcast.network;
      let result = {
        tv: network,
        time: formatAMPM(new Date(item.scheduled)),
        probables: (<Flex><PlayerName small>{awayPitcher}</PlayerName><VS>vs</VS><PlayerName small>{homePitcher}</PlayerName></Flex>),
        coverage: 'Matchup',
        link: `coverage/${item.id}`,
        timeOrder: new Date(item.scheduled).getTime()
      };

      if (item.status === 'closed' || item.status === 'inprogress') {
        result.link += '/boxscore';
        result.coverage = 'Box Score';
      }

      let homeLogo, awayLogo, homeSlug, awaySlug;
      Object.keys(slugs.slug).forEach(slug => {
        if (slugs.slug[slug].id === home.id) {
          homeSlug = slug
          homeLogo = slugs.images.logo_60 + slug + '.png?alt=media';
        } else if (slugs.slug[slug].id === away.id) {
          awaySlug = slug;
          awayLogo = slugs.images.logo_60 + slug + '.png?alt=media';
        }
      });

      result.matchup = this.buildTeam(away.market, `teams/${awaySlug}`, awayLogo);
      result.against = (<Flex><Text>at</Text>{this.buildTeam(home.market, `teams/${homeSlug}`, homeLogo)}</Flex>);

      //mobile
      result.m_matchup = this.buildTeam(away.abbr.toUpperCase(), `teams/${awaySlug}`, awayLogo);
      result.m_against = (<Flex><Text>at</Text>{this.buildTeam(home.abbr.toUpperCase(), `teams/${homeSlug}`, homeLogo)}</Flex>);
      result.m_time = formatAMPM(new Date(item.scheduled));

      return result;
    })
    .sort((a, b) => a.timeOrder - b.timeOrder)
  )

  render() {

    const { schedule, loading, slugs, loadingSlugs } = this.props;

    let currList = [];

    if (loading === STATUS.SUCCESS && loadingSlugs === STATUS.SUCCESS && schedule.current) {
      currList = this.generateScheduleList(schedule.current, slugs, schedule.currBox);
    }
    const date = new Date(this.state.date);

    const stories = getTrendingStories();

    return (
      <div>
        <div>
          <Page>
            <MainContent hasRight>
              {(loading === STATUS.REQUEST || loadingSlugs === STATUS.REQUEST) ? (
                <Loading />
              ) : (
                <Wrapper>
                  <TitleHolder>
                    <MobileOnly>
                      <h6>All Times Central Time Zone</h6>
                    </MobileOnly>
                    <h1>{window.cApplicationLocal.pageHeadline || 'MLB Schedule'}</h1>
                    <CalendarDay onChangeDate={this.onChangeDate} />
                  </TitleHolder>
                  <TabletOnly>
                    <TableTitle>{formatDate(date, 'WW, mm dd').toUpperCase()}</TableTitle>
                    <PlayerTable titles={MLB_SCHEDULE_DESKTOP_TITLE} list={currList} tableSmall />
                  </TabletOnly>

                  <MobileOnly>
                    <TableTitle>{formatDate(date, 'WW, mm dd').toUpperCase()}</TableTitle>
                    <PlayerTable titles={MLB_SCHEDULE_MOBILE_TITLE} list={currList} tableSmall />
                  </MobileOnly>
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
  schedule: state.mlb.schedule,
  slugs: state.mlb.slugs,
  loading: state.mlb.loading.schedule,
  loadingSlugs: state.mlb.loading.slugs,
});

const mapDispatchToProps = dispatch =>
  bindActionCreators(
    {
      loadSchedules,
      loadTeamSlugs,
    },
    dispatch
  );

export default connect(mapStateToProps, mapDispatchToProps)(Schedule);
