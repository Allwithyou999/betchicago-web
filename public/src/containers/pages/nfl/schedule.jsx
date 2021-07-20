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
import { TableTitle } from '../../../containers/components/Common';
import media from '../../../containers/components/Media';

import { getTrendingStories } from '../../../modules/local-service';
import { formatDate, formatAMPM } from '../../../modules/utilities/formatter';
import { NFL_SCHEDULE_DESKTOP_TITLE, NFL_SCHEDULE_MOBILE_TITLE } from '../../../modules/constants/nfl';

import { MobileOnly, TabletOnly } from '../../components/Layout';
import { THEME_COLORS } from '../../../modules/styles';
import { loadSchedule } from '../../../apis/nfl';
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

const WeekSelector = styled.div`
  margin-top: 10px;
  text-align: right;
`

class NFLSchedule extends Component {
  constructor(props) {
    super(props);

    this.state = {
      week: 'REG 0',
    };
  }

  componentDidMount() {
    this.onChangeWeek('REG 0');
  }

  buildTeam = (name, link, logo) => (
    <Team>
      <img src={logo} alt={name} />
      <Link href={link}>{name}</Link>
    </Team>
  )

  onChangeWeek = (value) => {
    const str = value.split(' ');
    this.setState({
      week: value,
    });
    this.props.loadSchedule((new Date()).getFullYear(), str[1], str[0]);
  }

  generateScheduleList = (schedule) => {
    const dayList = {};
    const allGames = schedule.map((item, index) => {
      const home = item.home;
      const away = item.away;
      const homeLogo = `https://firebasestorage.googleapis.com/v0/b/bet-chicago.appspot.com/o/staticassests%2Fnfl%2Fteam%2Flogo_60%2F${home.name.replace(/ /g, '-').toLowerCase()}.png?alt=media`;
      const awayLogo = `https://firebasestorage.googleapis.com/v0/b/bet-chicago.appspot.com/o/staticassests%2Fnfl%2Fteam%2Flogo_60%2F${away.name.replace(/ /g, '-').toLowerCase()}.png?alt=media`;

      let network = '';
      if (item.broadcast)
        network = item.broadcast.network;
      let result = {
        tv: network,
        time: formatAMPM(new Date(item.scheduled)),
        coverage: 'Matchup',
        link: `game/0/${index}`,
        timeOrder: new Date(item.scheduled).getTime()
      };

      result.matchup = this.buildTeam(away.name, '/', awayLogo);
      result.against = (<Flex><Text>at</Text>{this.buildTeam(home.name, '/', homeLogo)}</Flex>);

      //mobile
      result.m_matchup = this.buildTeam(away.name.toUpperCase(), `teams`, awayLogo);
      result.m_against = (<Flex><Text>at</Text>{this.buildTeam(home.name.toUpperCase(), `teams`, homeLogo)}</Flex>);
      result.m_time = formatAMPM(new Date(item.scheduled));
      result.scheduled = item.scheduled;

      return result;
    })
    .sort((a, b) => a.timeOrder - b.timeOrder);

    allGames.forEach(item => {
      const dt = (new Date(item.scheduled));
      const dtStr = `${dt.getFullYear()}-${dt.getMonth() + 1}-${dt.getDate()}`;

      if (!dayList[dtStr]) {
        dayList[dtStr] = [];
      }

      dayList[dtStr].push(item);
    });

    return dayList;
  }

  render() {
    const { schedule, loading } = this.props;
    const stories = getTrendingStories();
    let list = {};

    if (schedule) {
      list = this.generateScheduleList(schedule);
    }

    return (
      <div>
        <div>
          <Page>
            <MainContent hasRight>
              {(loading === STATUS.REQUEST) ? (
                <Loading />
              ) : (
                <Wrapper>
                  <TitleHolder>
                    <MobileOnly>
                      <h6>All Times Central Time Zone</h6>
                    </MobileOnly>
                    <h1>{window.cApplicationLocal.pageHeadline || 'NFL Schedule'}</h1>
                  </TitleHolder>
                  <WeekSelector>
                    <select value={this.state.week} onChange={(e) => { this.onChangeWeek(e.target.value); }}>
                      {[0, 1, 2, 3, 4].map(w => <option value={`PRE ${w}`} key={`PRE ${w}`}>PRE {w + 1}</option>)}
                      {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16].map(w => <option value={`REG ${w}`} key={`REG ${w}`}>REG {w + 1}</option>)}
                    </select>
                  </WeekSelector>
                  {Object.keys(list).map(key => (<TabletOnly key={key}>
                    <TableTitle>{formatDate(new Date(list[key][0].scheduled), 'WW, mm dd').toUpperCase()}</TableTitle>
                    <PlayerTable titles={NFL_SCHEDULE_DESKTOP_TITLE} list={list[key]} tableSmall />
                  </TabletOnly>))}
                  
                  {Object.keys(list).map(key => (<MobileOnly key={key}>
                    <TableTitle>{formatDate(new Date(list[key][0].scheduled), 'WW, mm dd').toUpperCase()}</TableTitle>
                    <PlayerTable titles={NFL_SCHEDULE_MOBILE_TITLE} list={list[key]} tableSmall />
                  </MobileOnly>))}
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
  schedule: state.nfl.schedule,
  loading: state.nfl.loading.schedule,
});

const mapDispatchToProps = dispatch =>
  bindActionCreators(
    {
      loadSchedule,
    },
    dispatch
  );

export default connect(mapStateToProps, mapDispatchToProps)(NFLSchedule);
