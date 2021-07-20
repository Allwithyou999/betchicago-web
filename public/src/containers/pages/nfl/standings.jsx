import React, { Component } from 'react';
import styled from 'styled-components';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import Page, { MainContent, TabletOnly, MobileOnly, SidebarRight } from '../../../containers/components/Layout';
import Loading from '../../../containers/components/Loading';
import ContentPromo from '../../../containers/components/ContentPromo';
import SidebarWidget from '../../../containers/components/SidebarWidget';
import TrendingStories from '../../../containers/components/TrendingStories';
import media from '../../../containers/components/Media';
import { loadStandings, loadNextUp } from '../../../apis/nfl';
import { getTrendingStories } from '../../../modules/local-service';
import { STATUS } from '../../../modules/constants/common';

const Wrapper = styled.div`
  padding-top: 15px;

  ${media.tablet} {
    h1 {
      font-weight: 300;
    }
  }
`;

const SubTitle = styled.div`
  margin-top: 50px;

  img {
    width: 60px;
    vertical-align: middle;
  }
`

class NFLStandings extends Component {
  componentDidMount() {
    this.props.loadStandings();
    this.props.loadNextUp((new Date()).getFullYear());
    /* for (let i in this.standings.nextUp)
      this.standings.nextUp[i].desc = (this.standings.nextUp[i].home ? 'vs ' : 'at ') + this.standings.nextUp[i].opponent; */
  }

  getDivisionData(div, conf) {
    let confIndex = 0;
    if (conf === 'NFC')
      confIndex = 1;
    let divIndex = 0;
    if (div === 'NORTH')
      divIndex = 1;
    if (div === 'SOUTH')
      divIndex = 2;
    if (div === 'WEST')
      divIndex = 3;

    return this.props.standings.conferences[confIndex].divisions[divIndex];
  }

  renderDesktopDivision(div, conf) {
    let teams = this.getDivisionData(div, conf).teams;
    let confRecIndex = 0;
    if (conf === 'NFC')
      confRecIndex = 4;
    return (
      <table class="nfl-standings-table">
        <tr>
          <td>{conf} {div}</td>
          <td>W</td>
          <td>L</td>
          <td>T</td>
          <td>PCT</td>
          <td>PF</td>
          <td>PA</td>
          <td>HOME</td>
          <td>AWAY</td>
          <td>{conf}</td>
          <td>NEXT</td>
        </tr>
        {
          teams.map((team, index) => (
            <tr>
              <td>
                <img
                  className="team-img"
                  alt=""
                  src={`https://firebasestorage.googleapis.com/v0/b/bet-chicago.appspot.com/o/staticassests%2Fnfl%2Fteam%2Flogo_60%2F${team.market.replace(/ /g, '-').toLowerCase()}-${team.name.replace(/ /g, '-').toLowerCase()}.png?alt=media`}
                />
                {team.market} {team.name}
              </td>
              <td>{team.wins || 0}</td>
              <td>{team.losses || 0}</td>
              <td>{team.ties || 0}</td>
              <td>{team.win_pct || 0}</td>
              <td>{team.points_for || 0}</td>
              <td>{team.points_against || 0}</td>
              <td>{(team.records && team.records[3].record.wins) || 0}</td>
              <td>{(team.records && team.records[5].record.wins) || 0}</td>
              <td>{(team.records && team.records[confRecIndex].record.wins) || 0}</td>
              <td>{this.props.nextup[team.alias] ? this.props.nextup[team.alias].opponent : '- -'}</td>
            </tr>
          ))
        }
      </table>
    );
  }

  renderMobileDivision(div, conf) {
    let teams = this.getDivisionData(div, conf).teams;
    return (
      <table class="nfl-standings-table nfl-mobile-standings-table">
        <tr>
          <td>{conf} {div}</td>
          <td>W</td>
          <td>L</td>
          <td>T</td>
          <td>ATS</td>
          <td>O/U</td>
          <td>NEXT</td>
        </tr>
        {
          teams.map((team, index) => (
            <tr>
              <td>{team.alias}</td>
              <td>{team.wins}</td>
              <td>{team.losses}</td>
              <td>{team.ties}</td>
              <td>-</td>
              <td>-</td>
              <td>{this.props.nextup[team.alias] ? this.props.nextup[team.alias].opponent : '- -'}</td>
            </tr>
          ))
        }
      </table>
    );
  }

  render() {
    const { loadingStandings, loadingNextUp } = this.props;
    const stories = getTrendingStories();
    console.log(this.props.standings);
    console.log(this.props.nextup);

    return (
      <div>
        <div>
          <Page>
            <MainContent hasRight>
              {(loadingStandings === STATUS.REQUEST || loadingNextUp === STATUS.REQUEST) ? (
                <Loading />
              ) : (
                <Wrapper>
                  <h1>{window.cApplicationLocal.pageHeadline || 'NFL Standings'}</h1>
                  <SubTitle>
                    <img
                      className="team-img"
                      alt=""
                      src={`https://firebasestorage.googleapis.com/v0/b/bet-chicago.appspot.com/o/staticassests%2Fnfl%2Fteam%2Flogo_60%2Fafc.png?alt=media`}
                    />
                    AMERICAN FOOTBALL CONFERENCE
                  </SubTitle>
                  <MobileOnly>
                    { this.renderMobileDivision('EAST', 'AFC') }
                  </MobileOnly>
                  <TabletOnly>
                    { this.renderDesktopDivision('EAST', 'AFC') }
                  </TabletOnly>
                  <MobileOnly>
                    { this.renderMobileDivision('NORTH', 'AFC') }
                  </MobileOnly>
                  <TabletOnly>
                    { this.renderDesktopDivision('NORTH', 'AFC') }
                  </TabletOnly>
                  <MobileOnly>
                    { this.renderMobileDivision('SOUTH', 'AFC') }
                  </MobileOnly>
                  <TabletOnly>
                    { this.renderDesktopDivision('SOUTH', 'AFC') }
                  </TabletOnly>
                  <MobileOnly>
                    { this.renderMobileDivision('WEST', 'AFC') }
                  </MobileOnly>
                  <TabletOnly>
                    { this.renderDesktopDivision('WEST', 'AFC') }
                  </TabletOnly>
                  <SubTitle>
                    <img
                      className="team-img"
                      alt=""
                      src={`https://firebasestorage.googleapis.com/v0/b/bet-chicago.appspot.com/o/staticassests%2Fnfl%2Fteam%2Flogo_60%2Fnfc.png?alt=media`}
                    />
                    NATIONAL FOOTBALL CONFERENCE
                  </SubTitle>
                  <MobileOnly>
                    { this.renderMobileDivision('EAST', 'NFC') }
                  </MobileOnly>
                  <TabletOnly>
                    { this.renderDesktopDivision('EAST', 'NFC') }
                  </TabletOnly>
                  <MobileOnly>
                    { this.renderMobileDivision('NORTH', 'NFC') }
                  </MobileOnly>
                  <TabletOnly>
                    { this.renderDesktopDivision('NORTH', 'NFC') }
                  </TabletOnly>
                  <MobileOnly>
                    { this.renderMobileDivision('SOUTH', 'NFC') }
                  </MobileOnly>
                  <TabletOnly>
                    { this.renderDesktopDivision('SOUTH', 'NFC') }
                  </TabletOnly>
                  <MobileOnly>
                    { this.renderMobileDivision('WEST', 'NFC') }
                  </MobileOnly>
                  <TabletOnly>
                    { this.renderDesktopDivision('WEST', 'NFC') }
                  </TabletOnly>
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
  nextup: state.nfl.nextup,
  loadingStandings: state.nfl.loading.standings,
  loadingNextUp: state.nfl.loading.nextup,
});

const mapDispatchToProps = dispatch =>
  bindActionCreators(
    {
      loadStandings,
      loadNextUp,
    },
    dispatch
  );

export default connect(mapStateToProps, mapDispatchToProps)(NFLStandings);
