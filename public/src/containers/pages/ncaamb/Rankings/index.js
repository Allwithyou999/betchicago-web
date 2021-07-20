import React from 'react';
import { withRouter } from 'react-router-dom';
import Wrapper from './styled';
import RankingsTable from '../../../components/common/RankingsTable';
// import TrendingStories from '../../common/TrendingStories';
import * as firebase from 'firebase';
import moment from 'moment-timezone';
import Helmet from 'react-helmet';

class Rankings extends React.Component {
  state = {
    rankings: [],
    updated: ''
  };

  componentDidMount() {
    this.loadRankingsData();
  }

  getYear = () => {
    let year = moment()
      .tz('America/Chicago')
      .year();
    if (
      moment()
        .tz('America/Chicago')
        .month() < 4
    ) {
      year = year - 1;
    }
    return year;
  };

  loadRankingsData = () => {
    this.setState({
      loading: true
    });

    let path = `/sportRadarStore/ncaamb/year/${this.getYear()}/REG/rankings`;

    firebase
      .database()
      .ref(path)
      .on('value', res => {
        let data = res.val();
        let updated = moment(data.updated)
          .tz('America/Chicago')
          .format();
        let dateStrArr = updated.split('T')[0].split('-');
        let timeStrArr = updated.split('T')[1].split(':');

        let updatedStr = `${moment(dateStrArr[1], 'MM').format('MMM')} ${
          dateStrArr[2]
        } @ ${timeStrArr[0] > 12 ? timeStrArr[0] - 12 : timeStrArr[0]}:${
          timeStrArr[1]
        }${timeStrArr[0] > 11 ? 'pm' : 'am'} CT`;
        this.setState({
          rankings: data.list,
          updated: updatedStr,
          loading: false
        });
      });
  };

  render() {
    const { loading, rankings, updated } = this.state;

    return (
      <Wrapper>
        <Helmet title="RPI Rankings" />
        <div>
          <div className="rankings-header">
            <div className="title">RPI Rankings</div>
            {rankings.length > 0 && (
              <div className="updated-date">Last Updated: {updated}</div>
            )}
          </div>
          <RankingsTable list={rankings} loading={loading} />
        </div>
        {/* <TrendingStories></TrendingStories> */}
      </Wrapper>
    );
  }
}

export default withRouter(Rankings);
