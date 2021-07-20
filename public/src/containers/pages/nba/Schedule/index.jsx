import React from 'react';
import { withRouter } from 'react-router-dom';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import moment from 'moment-timezone';

import { Wrapper, TitleHolder } from './styled';
import Page, {
  MainContent,
  SidebarRight
} from '../../../../containers/components/Layout';
import TrendingStories from '../../../../containers/components/TrendingStories';
import SidebarWidget from '../../../../containers/components/SidebarWidget';
import ContentPromo from '../../../../containers/components/ContentPromo';
import Loading from '../../../../containers/components/Loading';
import CalendarDay from '../../../../containers/components/baseball/CalendarDay';
import NBAScheduleTable from '../../../components/common/NBAScheduleTable';
import { MobileOnly } from '../../../components/Layout';
import { TableTitle } from '../../../../containers/components/Common';
import { getTrendingStories } from '../../../../modules/local-service';
import { formatDate } from '../../../../modules/utilities/formatter';
import { STATUS } from '../../../../modules/constants/common';
import { loadSchedule } from '../../../../apis/nba';

class Schedule extends React.Component {
  state = {
    date:
      moment()
        .tz('America/Chicago')
        .format('HH') > 12
        ? moment()
            .tz('America/Chicago')
            .add(1, 'days')
            .format('YYYY/MM/DD')
        : moment()
            .tz('America/Chicago')
            .format('YYYY/MM/DD'),
    dateString:
      moment()
        .tz('America/Chicago')
        .format('HH') > 12
        ? moment()
            .tz('America/Chicago')
            .add(1, 'days')
            .format('dddd, MMMM Do')
        : moment()
            .tz('America/Chicago')
            .format('dddd, MMMM Do'),
    tableData: []
  };

  componentDidMount() {
    this.props.loadSchedule(this.state.date);
  }

  onChangeDate = date => {
    this.setState(
      {
        dateString: moment(date)
          .tz('America/Chicago')
          .format('dddd, MMMM Do'),
        date: moment(date)
          .tz('America/Chicago')
          .format('YYYY/MM/DD')
      },
      () => {
        this.props.loadSchedule(this.state.date);
      }
    );
  };

  render() {
    const { schedule, loadingSchedule } = this.props;
    const stories = getTrendingStories();
    const date = new Date(this.state.date);
    const tableData = [];

    if (schedule) {
      schedule.forEach(item => {
        if (['scheduled', 'inprogress', 'closed'].indexOf(item.status) !== -1) {
          tableData.push({
            home: {
              id: item.home.id,
              name: item.home.name,
              alias: item.home.alias,
              betNumber: '?',
              points: item.home_points
            },
            away: {
              id: item.away.id,
              name: item.away.name,
              alias: item.away.alias,
              betNumber: '?',
              points: item.away_points
            },
            date: this.state.dateString,
            time: moment(item.scheduled)
              .tz('America/Chicago')
              .format('hh:mm a'),
            status: item.status,
            id: item.id
          });
        }
      });
    }

    return (
      <div>
        <div>
          <Page>
            <MainContent hasRight>
              <Wrapper>
                <TitleHolder>
                  <MobileOnly>
                    <h6>All Times Central Time Zone</h6>
                  </MobileOnly>
                  <h1>
                    {window.cApplicationLocal.pageHeadline || 'NBA Schedule'}
                  </h1>
                  <CalendarDay onChangeDate={this.onChangeDate} />
                </TitleHolder>
                {loadingSchedule === STATUS.REQUEST ? (
                  <Loading />
                ) : (
                  <div>
                    <TableTitle>
                      {formatDate(date, 'WW, mm dd').toUpperCase()}
                    </TableTitle>
                    <NBAScheduleTable
                      list={tableData}
                      loading={loadingSchedule === STATUS.REQUEST}
                      selectedDate={date}
                      type="nba"
                    />
                  </div>
                )}
              </Wrapper>
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
  schedule: state.nba.schedule,
  loadingSchedule: state.nba.loading.schedule
});

const mapDispatchToProps = dispatch =>
  bindActionCreators(
    {
      loadSchedule
    },
    dispatch
  );

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withRouter(Schedule));
