import React from 'react';
import { withRouter } from 'react-router-dom';
import Wrapper from './styled';
import Calendar from '../../../components/common/Calendar';
import ScheduleTable from '../../../components/common/ScheduleTable';
// import TrendingStories from '../../common/TrendingStories';
import * as firebase from 'firebase';
import moment from 'moment-timezone';
import Helmet from 'react-helmet';

class NCAAMBSchedule extends React.Component {
  state = {
    date: moment()
      .tz('America/Chicago')
      .format('YYYY/MM/DD'),
    dateString: moment()
      .tz('America/Chicago')
      .format('dddd, MMMM Do'),
    tableData: []
  };

  componentDidMount() {
    this.loadScheduleData();
  }

  loadScheduleData = () => {
    this.setState({
      loading: true
    });
    let path = `/sportRadarStore/ncaamb/daily/${
      this.state.date
    }/schedule/games`;

    firebase
      .database()
      .ref(path)
      .once('value')
      .then(res => {
        let data = res.val();
        let tableData = [];
        if (data) {
          data.forEach(item => {
            tableData.push({
              home: {
                id: item.home.id,
                name: item.home.name,
                alias: item.home.alias,
                betNumber: '',
                points: item.home_points
              },
              away: {
                id: item.away.id,
                name: item.away.name,
                alias: item.away.alias,
                betNumber: '',
                points: item.away_points
              },
              date: this.state.dateString,
              time: moment(item.scheduled)
                .tz('America/Chicago')
                .format('hh:mm a'),
              status: item.status,
              id: item.id
            });
          });
        }
        this.setState({
          tableData,
          loading: false
        });
      });
  };

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
        this.loadScheduleData();
      }
    );
  };

  render() {
    const { tableData, loading, date, dateString } = this.state;

    return (
      <Wrapper>
        <Helmet title="NCAAMB Schedule" />
        <div>
          <div className="schedule-header">
            <div className="title">NCAAMB Schedule</div>
            <Calendar onChangeDate={this.onChangeDate} />
          </div>
          <div className="schedule-time-heading">
            <span>{dateString}</span>
            <span>All Times CT</span>
          </div>
          <ScheduleTable
            list={tableData}
            loading={loading}
            selectedDate={date}
            type="ncaamb"
          />
        </div>
        {/* <TrendingStories></TrendingStories> */}
      </Wrapper>
    );
  }
}

export default withRouter(NCAAMBSchedule);
