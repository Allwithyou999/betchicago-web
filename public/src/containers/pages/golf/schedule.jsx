import React, { Component } from 'react';
import styled from 'styled-components';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import PlayerTable from '../../../containers/components/players/PlayerTable';
import Loading from '../../../containers/components/Loading';
import Page, { MainContent, SidebarRight, TabletOnly, MobileOnly } from '../../../containers/components/Layout';
import ContentPromo from '../../../containers/components/ContentPromo';
import TrendingStories from '../../../containers/components/TrendingStories';
import SidebarWidget from '../../../containers/components/SidebarWidget';
import media from '../../../containers/components/Media';
import { TableTitle } from '../../../containers/components/Common';

import { THEME_COLORS } from '../../../modules/styles';
import { formatDate, formatPeriod, formatMoney, getLastDayOfWeek } from '../../../modules/utilities/formatter';
import {
  SCHEDULE_TITLE,
  SCHEDULE_DESKTOP_TITLE,
  SCHEDULE_DESKTOP_COMPLETED_TITLE
} from '../../../modules/constants/golf';

import { loadSchedule, loadWinnerData } from '../../../apis/golf';

const Wrapper = styled.div`
  ${media.tablet} {
    padding: 20px;
  }
`;

const Subtitle = styled.h6``;

const EventCell = styled.div`
  font-size: 15px;
  line-height: 18px;

  div {
    font-weight: 400;
    // color: ${THEME_COLORS.BLUE};
    text-decoration: none;
    display: inline-block;
    margin-bottom: 3px;
  }

  a {
    font-weight: 400;
    color: ${THEME_COLORS.BLUE};
    text-decoration: none;
    display: block;
    margin-bottom: 3px;
  }

  span {
    display: block;
    font-weight: 300;
  }
`;

class Schedule extends Component {
  componentDidMount() {
    this.props.loadSchedule();
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.schedule !== nextProps.schedule && nextProps.schedule) {
      const current = new Date();
      let finished = nextProps.schedule.tournaments.filter(tour => current > new Date(tour.end_date)).map(tour => tour.id);
      this.props.loadWinnerData(finished);
    }
  }

  buildEventCell = (golfPath, tour, isLink = false) => (
    <EventCell>
      {isLink ?
        <a href={`${golfPath}/leaderboard/${tour.id}`}>{tour.name}</a>
        :
        <div>{tour.name}</div>
      }
      <span>
        {tour.venue.name}, {tour.venue.city}, {tour.venue.state}
      </span>
    </EventCell>
  );

  render() {
    const { schedule, winners } = this.props;
    const golfPath = '/golf-odds';

    let trending = [];
    if (window.cApplicationLocal) {
      trending = window.cApplicationLocal.trending;
    }

    let completedTours = [],
      upcomingTours = [],
      liveTours = [];
    const current = new Date();
    if (schedule) {
      schedule.tournaments.forEach((tour, index) => {
        if (current > new Date(tour.end_date)) {
          const data = {
            date: formatDate(new Date(tour.start_date)),
            name: tour.name,
            linkText: 'Final',
            link: `${golfPath}/leaderboard/${tour.id}`,
            datePeriod: formatPeriod(
              new Date(tour.start_date),
              new Date(tour.end_date)
            ),
            nameFull: this.buildEventCell(golfPath, tour, true),
            playerLink: `${golfPath}/player/0`
          }

          if (winners) {
            let winner = winners[tour.id];
            if (winner) {
              try {
                //2 winners
                if (winner.players) {
                  data.winner = winner.players.map(p => p.first_name.substr(0, 1) + '. ' + p.last_name).join(', ');
                } else {
                  data.winner = winner.first_name.substr(0, 1) + '. ' + winner.last_name;
                }
                if (winner.strokes) {
                  data.score = winner.strokes + '(' + winner.score + ')';
                }
              }
              catch(err) {
                console.log(err);
              }
            }
          }

          completedTours.push(data);
        } else {
          if (new Date(tour.start_date) < current || new Date(tour.start_date) < getLastDayOfWeek()) {
            liveTours.push({
              date: formatDate(new Date(tour.start_date)),
              name: tour.name,
              datePeriod: formatPeriod(
                new Date(tour.start_date),
                new Date(tour.end_date)
              ),
              nameFull: this.buildEventCell(golfPath, tour),
              linkText: 'Live',
              purse: `$${formatMoney(tour.purse)}`,
              player: 'J. Day',
              playerLink: `${golfPath}/player/0`,
              link: `${golfPath}/leaderboard/${tour.id}`
            });
          } else {
            upcomingTours.push({
              date: formatDate(new Date(tour.start_date)),
              name: tour.name,
              datePeriod: formatPeriod(
                new Date(tour.start_date),
                new Date(tour.end_date)
              ),
              nameFull: this.buildEventCell(golfPath, tour),
              linkText: '',
              purse: `$${formatMoney(tour.purse)}`,
              player: 'J. Day',
              playerLink: `${golfPath}/player/0`,
              link: `${golfPath}/leaderboard`
            });
          }
        }
      });
    }

    return (
      <div>
        {!!schedule ? (
          <Page>
            <MainContent>
              <Wrapper>
                <h1>{window.cApplicationLocal.pageHeadline ? window.cApplicationLocal.pageHeadline : `${schedule.tour.name} Schedule`}</h1>
                <Subtitle>
                  {schedule.season.year - 1} - {schedule.season.year} Season
                </Subtitle>
                <TabletOnly>
                  <TableTitle>THIS WEEK</TableTitle>
                  <PlayerTable
                    titles={SCHEDULE_DESKTOP_TITLE}
                    list={liveTours}
                  />
                  <TableTitle>UPCOMING</TableTitle>
                  <PlayerTable
                    titles={SCHEDULE_DESKTOP_TITLE}
                    list={upcomingTours}
                  />
                  <TableTitle>COMPLETED</TableTitle>
                  <PlayerTable
                    titles={SCHEDULE_DESKTOP_COMPLETED_TITLE}
                    list={completedTours}
                  />
                </TabletOnly>
                <MobileOnly>
                  <TableTitle>THIS WEEK</TableTitle>
                  <PlayerTable titles={SCHEDULE_TITLE} list={liveTours} />
                  <TableTitle>UPCOMING</TableTitle>
                  <PlayerTable titles={SCHEDULE_TITLE} list={upcomingTours} />
                  <TableTitle>COMPLETED</TableTitle>
                  <PlayerTable titles={SCHEDULE_TITLE} list={completedTours} />
                </MobileOnly>
              </Wrapper>
            </MainContent>
            <SidebarRight>
              <SidebarWidget title="TRENDING STORIES">
                <TrendingStories stories={trending} />
              </SidebarWidget>
              <SidebarWidget>
                <ContentPromo />
              </SidebarWidget>
            </SidebarRight>
          </Page>
        ) : (
          <Loading />
        )}
      </div>
    );
  }
}

const mapStateToProps = state => ({
  schedule: state.golf.schedule,
  loading: state.golf.loading.schedule,
  winners: state.golf.winnerData,
});

const mapDispatchToProps = dispatch =>
  bindActionCreators(
    {
      loadSchedule,
      loadWinnerData
    },
    dispatch
  );

export default connect(mapStateToProps, mapDispatchToProps)(Schedule);
