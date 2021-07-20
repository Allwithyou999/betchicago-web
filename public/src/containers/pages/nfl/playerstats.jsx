import React, { Component } from 'react';
import styled from 'styled-components';
import * as firebase from 'firebase';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import ContentPromo from '../../../containers/components/ContentPromo';
import Page, { MainContent, SidebarRight } from '../../../containers/components/Layout';
import SidebarWidget from '../../../containers/components/SidebarWidget';
import { TabletOnly, MobileOnly } from '../../components/Layout';
import TrendingStories from '../../../containers/components/TrendingStories';
import PlayerTable from '../../../containers/components/nfl/PlayerTable';
import Loading from '../../../containers/components/Loading';
import media from '../../../containers/components/Media';
import { STATUS } from '../../../modules/constants/common';
import {
  NFL_OFFENSIVE_PASSING_YARD_DESKTOP_TITLE,
  NFL_OFFENSIVE_PASSING_YARD_MOBILE_TITLE,
  NFL_OFFENSIVE_RUSHING_YARD_DESKTOP_TITLE,
  NFL_OFFENSIVE_RUSHING_YARD_MOBILE_TITLE,
  NFL_OFFENSIVE_RECEIVING_YARD_DESKTOP_TITLE,
  NFL_OFFENSIVE_RECEIVING_YARD_MOBILE_TITLE,
  NFL_DEFENSIVE_TACKLE_DESKTOP_TITLE,
  NFL_DEFENSIVE_TACKLE_MOBILE_TITLE,
  NFL_DEFENSIVE_SACK_DESKTOP_TITLE,
  NFL_DEFENSIVE_SACK_MOBILE_TITLE,
  NFL_DEFENSIVE_INTERCEPTION_DESKTOP_TITLE,
  NFL_DEFENSIVE_INTERCEPTION_MOBILE_TITLE,
} from '../../../modules/constants/nfl';
import { getTrendingStories } from '../../../modules/local-service';
import { loadStandings } from '../../../apis/nfl';

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

const Flex = styled.div`
  display: flex;
`

const Column = styled.div`
  width: 150px;
`

const Link = styled.a`
  color: #096CBE;
  font-size: 14px;
  display: block;
  margin: 5px 0;
`

class NFLPlayerStatsPage extends Component {
  constructor(props) {
    super(props);

    this.state = {
      loading: true,
    };
  }

  componentDidMount() {
    const year = (new Date()).getFullYear() - 1;
    this.props.loadStandings();

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

  renderOffensivePassingYards = () => {
    const { playersOffense } = this.state;
    const playerList = JSON.parse(JSON.stringify(playersOffense));

    playerList.sort((a, b) => {
      if (a.passing_yards >= 0 && b.passing_yards >= 0) {
        if (a.passing_yards < b.passing_yards) return 1;
        if (a.passing_yards > b.passing_yards) return -1;
        return 0;
      }

      if (b.passing_yards >= 0) return 1;
      if (a.passing_yards >= 0) return -1;
      return 0;
    });

    const filteredPlayers = playerList.slice(0, 5);
    const team = this.props.standings.teams.find(t => t.alias === filteredPlayers[0].team);
    filteredPlayers[0].image = `https://firebasestorage.googleapis.com/v0/b/bet-chicago.appspot.com/o/staticassests%2Fnfl%2Fteam%2Flogo_60%2F${team.market.replace(/ /g, '-').toLowerCase()}-${team.name.replace(/ /g, '-').toLowerCase()}.png?alt=media`;

    return (<div>
      <TabletOnly>
        <PlayerTable titles={NFL_OFFENSIVE_PASSING_YARD_DESKTOP_TITLE} list={filteredPlayers} link="/nfl-betting/passing/playerstats" />
      </TabletOnly>
      <MobileOnly>
        <PlayerTable titles={NFL_OFFENSIVE_PASSING_YARD_MOBILE_TITLE} list={filteredPlayers} link="/nfl-betting/passing/playerstats" />
      </MobileOnly>
    </div>);
  }

  renderOffensiveRushingYards = () => {
    const { playersOffense } = this.state;
    const playerList = JSON.parse(JSON.stringify(playersOffense));

    playerList.sort((a, b) => {
      if (a.rushing_yards >= 0 && b.rushing_yards >= 0) {
        if (a.rushing_yards < b.rushing_yards) return 1;
        if (a.rushing_yards > b.rushing_yards) return -1;
        return 0;
      }

      if (b.rushing_yards >= 0) return 1;
      if (a.rushing_yards >= 0) return -1;
      return 0;
    });

    const filteredPlayers = playerList.slice(0, 5);
    const team = this.props.standings.teams.find(t => t.alias === filteredPlayers[0].team);
    filteredPlayers[0].image = `https://firebasestorage.googleapis.com/v0/b/bet-chicago.appspot.com/o/staticassests%2Fnfl%2Fteam%2Flogo_60%2F${team.market.replace(/ /g, '-').toLowerCase()}-${team.name.replace(/ /g, '-').toLowerCase()}.png?alt=media`;

    return (<div>
      <TabletOnly>
        <PlayerTable titles={NFL_OFFENSIVE_RUSHING_YARD_DESKTOP_TITLE} list={filteredPlayers} link="/nfl-betting/rushing/playerstats" />
      </TabletOnly>
      <MobileOnly>
        <PlayerTable titles={NFL_OFFENSIVE_RUSHING_YARD_MOBILE_TITLE} list={filteredPlayers} link="/nfl-betting/rushing/playerstats" />
      </MobileOnly>
    </div>);
  }

  renderOffensiveReceivingYards = () => {
    const { playersOffense } = this.state;
    const playerList = JSON.parse(JSON.stringify(playersOffense));

    playerList.sort((a, b) => {
      if (a.receiving_yards >= 0 && b.receiving_yards >= 0) {
        if (a.receiving_yards < b.receiving_yards) return 1;
        if (a.receiving_yards > b.receiving_yards) return -1;
        return 0;
      }

      if (b.receiving_yards >= 0) return 1;
      if (a.receiving_yards >= 0) return -1;
      return 0;
    });

    const filteredPlayers = playerList.slice(0, 5);
    const team = this.props.standings.teams.find(t => t.alias === filteredPlayers[0].team);
    filteredPlayers[0].image = `https://firebasestorage.googleapis.com/v0/b/bet-chicago.appspot.com/o/staticassests%2Fnfl%2Fteam%2Flogo_60%2F${team.market.replace(/ /g, '-').toLowerCase()}-${team.name.replace(/ /g, '-').toLowerCase()}.png?alt=media`;

    return (<div>
      <TabletOnly>
        <PlayerTable titles={NFL_OFFENSIVE_RECEIVING_YARD_DESKTOP_TITLE} list={filteredPlayers} link="/nfl-betting/receiving/playerstats" />
      </TabletOnly>
      <MobileOnly>
        <PlayerTable titles={NFL_OFFENSIVE_RECEIVING_YARD_MOBILE_TITLE} list={filteredPlayers} link="/nfl-betting/receiving/playerstats" />
      </MobileOnly>
    </div>);
  }

  renderDefensiveTackles = () => {
    const { playersDefense } = this.state;
    const playerList = JSON.parse(JSON.stringify(playersDefense));

    playerList.sort((a, b) => {
      if (a.defense_tackles >= 0 && b.defense_tackles >= 0) {
        if (a.defense_tackles < b.defense_tackles) return 1;
        if (a.defense_tackles > b.defense_tackles) return -1;
        return 0;
      }

      if (b.defense_tackles >= 0) return 1;
      if (a.defense_tackles >= 0) return -1;
      return 0;
    });

    const filteredPlayers = playerList.slice(0, 5);
    const team = this.props.standings.teams.find(t => t.alias === filteredPlayers[0].team);
    filteredPlayers[0].image = `https://firebasestorage.googleapis.com/v0/b/bet-chicago.appspot.com/o/staticassests%2Fnfl%2Fteam%2Flogo_60%2F${team.market.replace(/ /g, '-').toLowerCase()}-${team.name.replace(/ /g, '-').toLowerCase()}.png?alt=media`;

    return (<div>
      <TabletOnly>
        <PlayerTable titles={NFL_DEFENSIVE_TACKLE_DESKTOP_TITLE} list={filteredPlayers} link="/nfl-betting/tackle/playerstats" />
      </TabletOnly>
      <MobileOnly>
        <PlayerTable titles={NFL_DEFENSIVE_TACKLE_MOBILE_TITLE} list={filteredPlayers} link="/nfl-betting/tackle/playerstats" />
      </MobileOnly>
    </div>);
  }

  renderDefensiveSacks = () => {
    const { playersDefense } = this.state;
    const playerList = JSON.parse(JSON.stringify(playersDefense));

    playerList.sort((a, b) => {
      if (a.defense_sacks >= 0 && b.defense_sacks >= 0) {
        if (a.defense_sacks < b.defense_sacks) return 1;
        if (a.defense_sacks > b.defense_sacks) return -1;
        return 0;
      }

      if (b.defense_sacks >= 0) return 1;
      if (a.defense_sacks >= 0) return -1;
      return 0;
    });

    const filteredPlayers = playerList.slice(0, 5);
    const team = this.props.standings.teams.find(t => t.alias === filteredPlayers[0].team);
    filteredPlayers[0].image = `https://firebasestorage.googleapis.com/v0/b/bet-chicago.appspot.com/o/staticassests%2Fnfl%2Fteam%2Flogo_60%2F${team.market.replace(/ /g, '-').toLowerCase()}-${team.name.replace(/ /g, '-').toLowerCase()}.png?alt=media`;

    return (<div>
      <TabletOnly>
        <PlayerTable titles={NFL_DEFENSIVE_SACK_DESKTOP_TITLE} list={filteredPlayers} link="/nfl-betting/sack/playerstats" />
      </TabletOnly>
      <MobileOnly>
        <PlayerTable titles={NFL_DEFENSIVE_SACK_MOBILE_TITLE} list={filteredPlayers} link="/nfl-betting/sack/playerstats" />
      </MobileOnly>
    </div>);
  }

  renderDefensiveInterceptions = () => {
    const { playersDefense } = this.state;
    const playerList = JSON.parse(JSON.stringify(playersDefense));

    playerList.sort((a, b) => {
      if (a.defense_interceptions >= 0 && b.defense_interceptions >= 0) {
        if (a.defense_interceptions < b.defense_interceptions) return 1;
        if (a.defense_interceptions > b.defense_interceptions) return -1;
        return 0;
      }

      if (b.defense_interceptions >= 0) return 1;
      if (a.defense_interceptions >= 0) return -1;
      return 0;
    });

    const filteredPlayers = playerList.slice(0, 5);
    const team = this.props.standings.teams.find(t => t.alias === filteredPlayers[0].team);
    filteredPlayers[0].image = `https://firebasestorage.googleapis.com/v0/b/bet-chicago.appspot.com/o/staticassests%2Fnfl%2Fteam%2Flogo_60%2F${team.market.replace(/ /g, '-').toLowerCase()}-${team.name.replace(/ /g, '-').toLowerCase()}.png?alt=media`;

    return (<div>
      <TabletOnly>
        <PlayerTable titles={NFL_DEFENSIVE_INTERCEPTION_DESKTOP_TITLE} list={filteredPlayers} link="/nfl-betting/interception/playerstats" />
      </TabletOnly>
      <MobileOnly>
        <PlayerTable titles={NFL_DEFENSIVE_INTERCEPTION_MOBILE_TITLE} list={filteredPlayers} link="/nfl-betting/interception/playerstats" />
      </MobileOnly>
    </div>);
  }

  render() {
    const { loading } = this.state;
    const { loadingStandings } = this.props;
    const stories = getTrendingStories();

    return (
      <div>
        <div>
          <Page>
            <MainContent hasRight>
              {(loading || loadingStandings === STATUS.REQUEST) ? (
                <Loading />
              ) : (
                <Wrapper>
                  <h1>{window.cApplicationLocal.pageHeadline || 'NFL Player Stats'}</h1>

                  <SubTitle>Offensive Leaders</SubTitle>
                  {this.renderOffensivePassingYards()}
                  {this.renderOffensiveRushingYards()}
                  {this.renderOffensiveReceivingYards()}

                  <SubTitle>Defensive Leaders</SubTitle>
                  {this.renderDefensiveTackles()}
                  {this.renderDefensiveSacks()}
                  {this.renderDefensiveInterceptions()}

                  <SubTitle>Team Statistics</SubTitle>
                  <Flex>
                    <Column>
                      <div>OFFENSE</div>
                      <Link>Total Offense</Link>
                      <Link>Rushing Offense</Link>
                      <Link>Passing Offense</Link>
                      <Link>Receiving Offense</Link>
                    </Column>
                    <Column>
                      <div>DEFENSE</div>
                      <Link>Total Defense</Link>
                      <Link>Rushing Defense</Link>
                      <Link>Passing Defense</Link>
                      <Link>Receiving Defense</Link>
                    </Column>
                  </Flex>
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
  standings: state.nfl.standings,
  loadingStandings: state.nfl.loading.standings,
});

const mapDispatchToProps = dispatch =>
  bindActionCreators(
    {
      loadStandings,
    },
    dispatch
  );

export default connect(mapStateToProps, mapDispatchToProps)(NFLPlayerStatsPage);
