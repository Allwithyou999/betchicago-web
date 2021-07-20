import React, { Component } from 'react';
import styled from 'styled-components';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import PlayerTable from '../../../containers/components/players/PlayerTable';
// import FavPlayers from 'containers/components/players/FavPlayers';
import LeaderboardTitle from '../../../containers/components/LeaderboardTitle';
import ContentPromo from '../../../containers/components/ContentPromo';
import Loading from '../../../containers/components/Loading';
import Page, { MainContent, SidebarRight, TabletOnly, MobileOnly } from '../../../containers/components/Layout';
import SidebarWidget from '../../../containers/components/SidebarWidget';
import TourSelector from '../../../containers/components/TourSelector';
import media from '../../../containers/components/Media';

import { THEME_COLORS } from '../../../modules/styles';
import { formatTourPeriod, formatLeaderboardRound, formatTime, formatDate } from '../../../modules/utilities/formatter';
import { LEADERBOARD_ROUND_TITLE, LEADERBOARD_FINAL_TITLE, LEADERBOARD_DESKTOP_TITLE, PLAYER_TEATIME_TITLE } from '../../../modules/constants/golf';

import { loadLeaderboardData, loadCurrentTournament, loadCurrentTeetimeList, loadSchedule } from '../../../apis/golf';

const Wrapper = styled.div`
  ${media.tablet} {
    h1 {
      font-weight: 300;
    }
  }
`;

const SubHolder = styled.div`
  margin: 5px 0 28px;
  display: flex;
`;

const LeadLink = styled.h6`
  ${props =>
    props.inactive &&
    `
    color: ${THEME_COLORS.BLUE};
    cursor: pointer;

    ${media.tablet} {
      color: ${THEME_COLORS.BLACK};
    }
  `} ${props =>
    props.mobile &&
    `
    ${media.tablet} {
      display: none;
    }
  `};
`;

const LinkDividier = styled.div`
  border-right: 1px solid #707070;
  margin: 0 12px;

  ${media.tablet} {
    display: none;
  }
`;

const PlayerLink = styled.a`
  display: inline-block;
  color: ${THEME_COLORS.BLUE};
  font-size: 13px;
  line-height: 15px;
  text-decoration: none;
  outline: none;
`;

const TeetimeComma = styled.span`
  display: inline-block;
  color: ${THEME_COLORS.BLUE};
  font-size: 13px;
  line-height: 15px;
  margin-right: 3px;
`;

const Notification = styled.div`
  margin-top: 20px;
`

const formatTeeTime = players => {
  const teelist = [];
  for (let i = 0; i < players.length; i++) {
    const player = players[i];
    teelist.push(
      <PlayerLink key={`player-${i}`} href={`golf-odds/player/${player.id}`}>
        {player.first_name.substr(0, 1) + '. ' + player.last_name}
      </PlayerLink>
    );
    if (i !== players.length - 1) {
      teelist.push(<TeetimeComma key={`pc-${i}`}>, </TeetimeComma>);
    }
  }

  return teelist;
};

class Leaderboard extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isFinal: false,
      showTourList: false
    };
  }

  componentDidMount() {
    const { match } = this.props;
    //if tournament id is set, then load that tournament, otherwise load current tournament
    if (match.params.id) {
      this.props.loadLeaderboardData(match.params.id);
    } else {
      let parts = window.location.href.split('/');
      let id = parts[parts.length - 1];
      if (id !== 'leaderboard') {
        this.props.loadLeaderboardData(id);
      } else {
        this.props.loadCurrentTournament(this.props.currentTourId);
      }
    }
    this.props.loadSchedule();
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.leaderboard !== nextProps.leaderboard || this.props.schedule !== nextProps.schedule) {
      if (nextProps.leaderboard && nextProps.leaderboard.summary && nextProps.schedule) {
        const { currentTourId, schedule } = nextProps;

        //determine the upcoming teetime
        //TODO: reconsider teetime logic
        let tourId;
        let round = 1;
        if (new Date().getDay() > 3) {
          tourId = currentTourId;
          round = new Date().getDay() - 3;
        } else if (new Date().getDay() === 0) {
          tourId = currentTourId;
          round = 4;
        } else {
          let nextSchedules = schedule.tournaments
            .filter(s => new Date(s.start_date).getTime() > new Date().getTime())
            .sort((a, b) => new Date(a.start_date).getTime() - new Date(b.start_date).getTime())[0];

          if (nextSchedules) {
            tourId = nextSchedules.id;
          }
        }

        this.props.loadCurrentTeetimeList(tourId, round);
      }
    }
  }

  setTab(isFinal) {
    if (this.state.isFinal !== isFinal) {
      this.setState({ isFinal });
    }
  }

  expandTours = () => {
    this.setState({ showTourList: true });
  };

  onChangeTour = tour => {
    this.props.loadLeaderboardData(tour.id);
  };

  render() {
    const { leaderboard, teetime } = this.props;
    let tourScore = [];
    let promoData = {};
    if (leaderboard && leaderboard.summary) {
      const { summary, players } = leaderboard;
      if (players) {
        tourScore = formatLeaderboardRound(leaderboard);
      }

      promoData = {
        title: summary.name,
        location: `${summary.venue.name} - ${summary.venue.city}, ${summary
          .venue.state || summary.venue.country}`,
        date: formatTourPeriod(summary.start_date, summary.end_date)
      };
    }

    let teetimeList = [];
    let pairings = [];
    if (teetime) {
      for (let i in teetime) {
        pairings.push(teetime[i]);
      }
    }

    teetimeList = pairings.map((pair, index) => {
      const playerPair = (
        <div key={`tee-player-${index}`}>{formatTeeTime(pair.players)}</div>
      );

      return {
        players: playerPair,
        teetime: formatTime(new Date(pair.tee_time))
      };
    });

    return (
      <div>
        <TourSelector
          showList={this.state.showTourList}
          onChange={this.onChangeTour}
        />
        {(!!leaderboard && leaderboard.summary) ? (
          <div>
            <LeaderboardTitle data={promoData} onExpand={this.expandTours} />
            <Page>
              <MainContent hasRight>
                <Wrapper>
                  <h1>{window.cApplicationLocal.pageHeadline || 'Leaderboard'}</h1>
                  {leaderboard.summary.status !== 'closed' ? (
                    <div>
                      {leaderboard.summary.status !== 'scheduled' && leaderboard.summary.status &&
                        <SubHolder>
                          <LeadLink>
                            IN PROGRESS
                            {/*
                            Round {leaderboard.summary.round_count} Complete
                            */}
                          </LeadLink>
                        </SubHolder>
                      }
                      {!leaderboard.summary.status &&
                        <SubHolder>
                          <LeadLink>
                            {formatDate(new Date(leaderboard.summary.start_date), 'WW, mm dd').toUpperCase()}
                          </LeadLink>
                        </SubHolder>
                      }
                    </div>
                  ) : (
                    <SubHolder>
                      <LeadLink
                        inactive={!this.state.isFinal}
                        onClick={() => this.setTab(true)}>
                        FINAL
                      </LeadLink>
                      <LinkDividier />
                      <LeadLink
                        mobile
                        inactive={this.state.isFinal}
                        onClick={() => this.setTab(false)}>
                        ROUNDS
                      </LeadLink>
                    </SubHolder>
                  )}
                  <TabletOnly>
                    {leaderboard.summary.status !== 'scheduled' ? (
                      <PlayerTable
                        titles={LEADERBOARD_DESKTOP_TITLE}
                        list={tourScore}
                      />
                    ) : (
                      <Notification>No player data available</Notification>
                    )}
                  </TabletOnly>
                  <MobileOnly>
                    {this.state.isFinal ? (
                      <PlayerTable
                        titles={LEADERBOARD_FINAL_TITLE}
                        list={tourScore}
                      />
                    ) : (
                      <PlayerTable
                        titles={LEADERBOARD_ROUND_TITLE}
                        list={tourScore}
                      />
                    )}
                  </MobileOnly>
                </Wrapper>
              </MainContent>
              <SidebarRight>
                {/* <SidebarWidget title="MY FAVORITE PLAYERS">
                  <FavPlayers />
                </SidebarWidget> */}
                <SidebarWidget title="UPCOMING TEE TIMES">
                  {!teetime ? (
                    <Loading />
                  ) : (
                    <div>
                      {!teetimeList.length ? (
                        <div>No times available</div>
                      ) : (
                        <PlayerTable
                          titles={PLAYER_TEATIME_TITLE}
                          list={teetimeList}
                          tableSmall
                        />
                      )}
                    </div>
                  )}
                </SidebarWidget>
                <SidebarWidget>
                  <ContentPromo />
                </SidebarWidget>
              </SidebarRight>
            </Page>
          </div>
        ) : (
          <Loading />
        )}
      </div>
    );
  }
}

const mapStateToProps = state => ({
  leaderboard: state.golf.leaderboard,
  loading: state.golf.loading.leaderboard,
  currentTourId: state.golf.currentTourId,
  teetime: state.golf.currentTeetime,
  schedule: state.golf.schedule
});

const mapDispatchToProps = dispatch =>
  bindActionCreators(
    {
      loadLeaderboardData,
      loadCurrentTournament,
      loadCurrentTeetimeList,
      loadSchedule
    },
    dispatch
  );

export default connect(mapStateToProps, mapDispatchToProps)(Leaderboard);
