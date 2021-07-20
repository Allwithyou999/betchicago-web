import React from 'react';
import { withRouter } from 'react-router-dom';
import * as firebase from 'firebase';
import moment from 'moment-timezone';
import Helmet from 'react-helmet';

import { LoadingIcon } from '../../../components/Icons';
import Wrapper from './styled';

class Futures extends React.Component {
  state = {
    teams: [],
    loading: true,
    endDate: ''
  };

  getYear = () => {
    let year = moment()
      .tz('America/Chicago')
      .year();
    // if (
    //   moment()
    //     .tz('America/Chicago')
    //     .month() < 4
    // ) {
    //   year = year - 1;
    // }
    return year;
  };

  getData = async () => {
    let path = `/sportRadarStore/ncaamb/year/${this.getYear()}/REG/odds/data`;

    let res = await firebase
      .database()
      .ref(path)
      .once('value');
    let data = res.val();
    let temp = [];
    let count = 0;
    data.competitors.forEach(item => {
      if (count < 100) {
        temp.push({
          team: item.name,
          odds: item.books[0].odds,
          img: `https://firebasestorage.googleapis.com/v0/b/bet-chicago.appspot.com/o/staticassests%2Fncaamb%2Fteam%2Flogo_60%2F${item.name.replace(
            ' ',
            '-'
          )}.png?alt=media`
        });
      }
      count++;
    });
    this.setState({
      teams: temp,
      endDate: moment(data.end_date).format('MM/DD/YY'),
      loading: false
    });
  };

  componentDidMount() {
    this.getData();
  }

  render() {
    return (
      <Wrapper>
        <Helmet title="FUTURES ODDS" />
        <div>
          <div className="futures-header">
            <div className="title">FUTURES ODDS</div>
            <div className="subtitle">
              Odds to win 2019 NCAA Men's Tournament ({this.state.endDate})
            </div>
          </div>
        </div>
        {this.state.loading ? (
          <div className="loadingWrapper">
            <LoadingIcon />
          </div>
        ) : (
          <div className="Future-Teams">
            <div className="Future-Team-Heading">
              <span>TEAM</span>
              <span>ODDS</span>
            </div>
            {this.state.teams.map((item, index) => {
              return (
                <div className="Future-Team-Row" key={item.team + index}>
                  <span>
                    <img className="team-img" alt="" src={item.img} />
                    {item.team}
                  </span>
                  <span>{item.odds}</span>
                </div>
              );
            })}
            <div />
          </div>
        )}
        <div className="Future-Footer">
          The "Odds to Win" bet is also referred as to a "futures" bet.
          <br />
          In this case, bettors are wagering which team will win the NCAA Men's
          Tournament Championship.
          <br />
          Odds change often, be sure to check back regularly to get the very
          latest from BetChicago.
        </div>
      </Wrapper>
    );
  }
}

export default withRouter(Futures);
