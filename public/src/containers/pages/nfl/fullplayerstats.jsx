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
  NFL_FULL_OFFENSIVE_PASSING_YARD_DESKTOP_TITLE,
  NFL_FULL_OFFENSIVE_PASSING_YARD_MOBILE_TITLE,
  NFL_FULL_OFFENSIVE_RUSHING_YARD_DESKTOP_TITLE,
  NFL_FULL_OFFENSIVE_RUSHING_YARD_MOBILE_TITLE,
  NFL_FULL_OFFENSIVE_RECEIVING_YARD_DESKTOP_TITLE,
  NFL_FULL_OFFENSIVE_RECEIVING_YARD_MOBILE_TITLE,
  NFL_FULL_DEFENSIVE_TACKLE_DESKTOP_TITLE,
  NFL_FULL_DEFENSIVE_TACKLE_MOBILE_TITLE,
  NFL_FULL_DEFENSIVE_SACK_DESKTOP_TITLE,
  NFL_FULL_DEFENSIVE_SACK_MOBILE_TITLE,
  NFL_FULL_DEFENSIVE_INTERCEPTION_DESKTOP_TITLE,
  NFL_FULL_DEFENSIVE_INTERCEPTION_MOBILE_TITLE,
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

class NFLFullPlayerStatsPage extends Component {
  constructor(props) {
    super(props);

    this.state = {
      loading: true,
    };
  }

  componentDidMount() {
    const year = (new Date()).getFullYear() - 1;

    firebase
      .database()
      .ref(`/sportRadarStore/nfl/${year}/playerOffense/REG`)
      .once('value')
      .then(result => {
        const playersOffense = result.val();

        firebase
          .database()
          .ref(`/sportRadarStore/nfl/${year}/playerDefense/REG`)
          .once('value')
          .then(result => {
            const playersDefense = result.val();
            this.setState({
              playersOffense: Object.keys(playersOffense).map(key => playersOffense[key]),
              playersDefense: Object.keys(playersDefense).map(key => playersDefense[key]),
              loading: false
            });
          });
      });
  }

  renderPlayers = () => {
    const prop = this.props.match.params.type;
    const { playersOffense, playersDefense } = this.state;
    let playerList = JSON.parse(JSON.stringify(playersOffense));
    let desktopTitle = '';
    let mobileTitle = '';
    let type = '';

    switch (prop) {
      case 'passing':
        type = 'passing_yards';
        desktopTitle = NFL_FULL_OFFENSIVE_PASSING_YARD_DESKTOP_TITLE;
        mobileTitle = NFL_FULL_OFFENSIVE_PASSING_YARD_MOBILE_TITLE;
        break;
      case 'rushing':
        type = 'rushing_yards';
        desktopTitle = NFL_FULL_OFFENSIVE_RUSHING_YARD_DESKTOP_TITLE;
        mobileTitle = NFL_FULL_OFFENSIVE_RUSHING_YARD_MOBILE_TITLE;
        break;
      case 'receiving':
        type = 'receiving_yards';
        desktopTitle = NFL_FULL_OFFENSIVE_RECEIVING_YARD_DESKTOP_TITLE;
        mobileTitle = NFL_FULL_OFFENSIVE_RECEIVING_YARD_MOBILE_TITLE;
        break;
      case 'tackle':
        type = 'defense_tackles';
        playerList = JSON.parse(JSON.stringify(playersDefense));
        desktopTitle = NFL_FULL_DEFENSIVE_TACKLE_DESKTOP_TITLE;
        mobileTitle = NFL_FULL_DEFENSIVE_TACKLE_MOBILE_TITLE;
        break;
      case 'sack':
        type = 'defense_sacks';
        playerList = JSON.parse(JSON.stringify(playersDefense));
        desktopTitle = NFL_FULL_DEFENSIVE_SACK_DESKTOP_TITLE;
        mobileTitle = NFL_FULL_DEFENSIVE_SACK_MOBILE_TITLE;
        break;
      case 'interception':
        type = 'defense_interceptions';
        playerList = JSON.parse(JSON.stringify(playersDefense));
        desktopTitle = NFL_FULL_DEFENSIVE_INTERCEPTION_DESKTOP_TITLE;
        mobileTitle = NFL_FULL_DEFENSIVE_INTERCEPTION_MOBILE_TITLE;
        break;
      default:
    }

    playerList.sort((a, b) => {
      if (a[type] >= 0 && b[type] >= 0) {
        if (a[type] < b[type]) return 1;
        if (a[type] > b[type]) return -1;
        return 0;
      }

      if (b[type] >= 0) return 1;
      if (a[type] >= 0) return -1;
      return 0;
    });

    return (<div>
      <TabletOnly>
        <TeamTable titles={desktopTitle} list={playerList} />
      </TabletOnly>
      <MobileOnly>
        <TeamTable titles={mobileTitle} list={playerList} />
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
                  <h1>{window.cApplicationLocal.pageHeadline || 'NFL Player Stats'}</h1>
                  {this.renderPlayers()}
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

export default NFLFullPlayerStatsPage;
