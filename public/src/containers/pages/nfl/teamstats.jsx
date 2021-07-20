import React, { Component } from 'react';
import styled from 'styled-components';
import * as firebase from 'firebase';

import ContentPromo from '../../../containers/components/ContentPromo';
import Page, { MainContent, SidebarRight } from '../../../containers/components/Layout';
import SidebarWidget from '../../../containers/components/SidebarWidget';
import { TabletOnly, MobileOnly } from '../../components/Layout';
import TrendingStories from '../../../containers/components/TrendingStories';
import TeamTable from '../../../containers/components/nfl/TeamTable';
import Loading from '../../../containers/components/Loading';
import media from '../../../containers/components/Media';
import {
  NFL_TEAM_TOTAL_OFFENSE_DESKTOP_TITLE,
  NFL_TEAM_TOTAL_OFFENSE_MOBILE_TITLE,
} from '../../../modules/constants/nfl';
import { getTrendingStories } from '../../../modules/local-service';

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

const SubTitle = styled.div`
  font-size: 18px;
  font-weight: 700;
  margin: 20px 0;
`

class NFLTeamStatsPage extends Component {
  constructor(props) {
    super(props);

    this.state = {
      loading: true,
    };
  }

  componentDidMount() {
    firebase
      .database()
      .ref(`/sportRadarStore/nfl/teamFlatStats`)
      .once('value')
      .then(result => {
        const teamStats = result.val();
        this.setState({
          teamStats: Object.keys(teamStats).map(key => teamStats[key]),
          loading: false
        });
      });
  }

  renderTotalOffense = () => {
    const { teamStats } = this.state;
    const teamList = JSON.parse(JSON.stringify(teamStats));

    teamList.sort((a, b) => {
      if (a.touchdowns_total >= 0 && b.touchdowns_total >= 0) {
        if (a.touchdowns_total < b.touchdowns_total) return 1;
        if (a.touchdowns_total > b.touchdowns_total) return -1;
        return 0;
      }

      if (b.touchdowns_total >= 0) return 1;
      if (a.touchdowns_total >= 0) return -1;
      return 0;
    });

    const filteredTeams = teamList.slice(0, 5);

    return (<div>
      <TabletOnly>
        <TeamTable titles={NFL_TEAM_TOTAL_OFFENSE_DESKTOP_TITLE} list={filteredTeams} />
      </TabletOnly>
      <MobileOnly>
        <TeamTable titles={NFL_TEAM_TOTAL_OFFENSE_MOBILE_TITLE} list={filteredTeams} />
      </MobileOnly>
    </div>);
  }

  render() {
    const { loading } = this.state;
    const stories = getTrendingStories();

    return (
      <div>
        <div>
          <Page>
            <MainContent hasRight>
              {(loading) ? (
                <Loading />
              ) : (
                <Wrapper>
                  <h1>{window.cApplicationLocal.pageHeadline || 'NFL Team Stats'}</h1>

                  <SubTitle>Team Offense Leaders</SubTitle>
                  {this.renderTotalOffense()}
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

export default NFLTeamStatsPage;
