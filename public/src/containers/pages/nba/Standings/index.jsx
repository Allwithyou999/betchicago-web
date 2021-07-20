import React from 'react';
import { withRouter } from 'react-router-dom';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import moment from 'moment-timezone';

import { Wrapper } from './styled';
import Page, {
  MainContent,
  SidebarRight
} from '../../../../containers/components/Layout';
import TrendingStories from '../../../../containers/components/TrendingStories';
import SidebarWidget from '../../../../containers/components/SidebarWidget';
import ContentPromo from '../../../../containers/components/ContentPromo';
import Loading from '../../../../containers/components/Loading';
import { MobileOnly } from '../../../components/Layout';
import ConferenceStandingTable from '../../../components/common/ConferenceStandingTable';
import { getTrendingStories } from '../../../../modules/local-service';
import { STATUS } from '../../../../modules/constants/common';
import { loadStandings } from '../../../../apis/nba';

class Standings extends React.Component {
  state = {
    date: moment()
      .tz('America/Chicago')
      .format('YYYY/MM/DD'),
    conferences: []
  };

  componentDidMount() {
    this.props.loadStandings(this.getYear());
  }

  getYear = () => {
    let year = moment()
      .tz('America/Chicago')
      .year();
    if (
      moment()
        .tz('America/Chicago')
        .month() < 6
    ) {
      year = year - 1;
    }
    return year;
  };

  render() {
    const { standings, loadingStandings } = this.props;
    const stories = getTrendingStories();

    if (standings) {
      standings.forEach(conf => {
        conf.divisions.forEach(division => {
          division.teams.forEach(team => {
            team.records.forEach(record => {
              if (record.record_type === 'conference') {
                team.conf = `${record.wins}-${record.losses}`;
              }
            });
          });
        });
      });
    }

    return (
      <div>
        <div>
          <Page>
            <MainContent hasRight>
              {loadingStandings === STATUS.REQUEST ? (
                <Loading />
              ) : (
                <Wrapper>
                  <h1>
                    {window.cApplicationLocal.pageHeadline || 'NBA Standings'}
                  </h1>
                  <MobileOnly>
                    <h6>American & National Leagues</h6>
                  </MobileOnly>
                  <ConferenceStandingTable
                    confs={standings}
                    loading={loadingStandings !== STATUS.SUCCESS}
                    type="nba"
                  />
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
  standings: state.nba.standings,
  loadingStandings: state.nba.loading.standings
});

const mapDispatchToProps = dispatch =>
  bindActionCreators(
    {
      loadStandings
    },
    dispatch
  );

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withRouter(Standings));
