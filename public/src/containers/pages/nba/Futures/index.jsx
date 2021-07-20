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
import { MobileOnly } from '../../../components/Layout';
import { getTrendingStories } from '../../../../modules/local-service';
import { STATUS } from '../../../../modules/constants/common';
import { loadOdds } from '../../../../apis/nba';

class Futures extends React.Component {
  state = {};

  getYear = () => {
    let year = moment()
      .tz('America/Chicago')
      .year();
    // if (moment().tz("America/Chicago").month() < 4) {
    // 	year = year - 1;
    // }
    return year;
  };

  componentDidMount() {
    this.props.loadOdds(this.getYear());
  }

  render() {
    const { odds, loadingOdds } = this.props;
    const stories = getTrendingStories();
    const temp = [];
    const name = [];
    let count = 0;

    if (odds) {
      for (let key in odds) {
        temp[count] = [];
        name[count] = odds[key].data.name;
        // eslint-disable-next-line no-loop-func
        odds[key].data.competitors.forEach(item => {
          temp[count].push({
            team: item.name,
            odds: item.books[0].odds,
            img: `https://firebasestorage.googleapis.com/v0/b/bet-chicago.appspot.com/o/staticassests%2Fnba%2Fteam%2Flogo_60%2F${item.name.replace(
              / /g,
              '-'
            )}.png?alt=media`
          });
        });
        count++;
      }
    }

    return (
      <div>
        <div>
          <Page>
            <MainContent hasRight>
              <Wrapper>
                <TitleHolder>
                  <MobileOnly>
                    <h6>Latest Scores and Money Lines</h6>
                  </MobileOnly>
                  <div>
                    <h1>
                      {window.cApplicationLocal.pageHeadline || 'FUTURES ODDS'}
                    </h1>
                  </div>
                </TitleHolder>
                {loadingOdds !== STATUS.SUCCESS ? (
                  <Loading />
                ) : (
                  <div>
                    <div className="subtitle">
                      Odds to win {this.getYear()} NBA Men's Tournament (
                      {odds && moment(odds.end_date).format('MM/DD/YY')})
                    </div>
                    {temp.map((teams, key) => {
                      return (
                        <div className="Future-Teams">
                          <div className="Future-Team-Heading">
                            <span>{name[key]}</span>
                          </div>
                          <div className="Future-Team-Heading">
                            <span>TEAM</span>
                            <span>ODDS</span>
                          </div>
                          {teams.map((item, index) => {
                            return (
                              <div
                                className="Future-Team-Row"
                                key={item.team + index}>
                                <span>
                                  <img
                                    className="team-img"
                                    alt=""
                                    src={item.img}
                                  />
                                  {item.team}
                                </span>
                                <span>{item.odds}</span>
                              </div>
                            );
                          })}
                          <div />
                        </div>
                      );
                    })}
                    <div className="Future-Footer">
                      The "Odds to Win" bet is also referred as to a "futures"
                      bet.
                      <br />
                      In this case, bettors are wagering which team will win the
                      NCAA Men's Tournament Championship.
                    </div>
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
  odds: state.nba.odds,
  loadingOdds: state.nba.loading.odds
});

const mapDispatchToProps = dispatch =>
  bindActionCreators(
    {
      loadOdds
    },
    dispatch
  );

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withRouter(Futures));
