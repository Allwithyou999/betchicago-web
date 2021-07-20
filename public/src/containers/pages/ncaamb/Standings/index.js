import React from 'react';
import { withRouter } from 'react-router-dom';
import Wrapper from './styled';
import StandingsTable from '../../../components/common/StandingsTable';
// import TrendingStories from '../../common/TrendingStories';
import * as firebase from 'firebase';
import moment from 'moment-timezone';
import Helmet from 'react-helmet';
import Select from 'react-select';

class Standings extends React.Component {
  state = {
    date: moment()
      .tz('America/Chicago')
      .format('YYYY/MM/DD'),
    conferences: [],
    selectedConf: null,
    teams: [],
    selectedOption: null
  };

  componentDidMount() {
    this.loadStandingsData();
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

  loadStandingsData = () => {
    this.setState({
      loading: true
    });

    let path = `/sportRadarStore/ncaamb/year/${this.getYear()}/REG/standings/conferences/conferenceList`;

    firebase
      .database()
      .ref(path)
      .once('value')
      .then(res => {
        let data = res.val();
        let conferences = [];
        let selectedConf;
        if (data) {
          data.forEach(conf => {
            if (conf.name.indexOf('Big Ten') !== -1) {
              selectedConf = {
                value: conf.id,
                label: conf.name
              };
            }
          });
          conferences = data.map(conf => ({
            value: conf.id,
            label: conf.name
          }));
          conferences.sort((a, b) => {
            if (a.label < b.label) {
              return -1;
            }
            if (a.label > b.label) {
              return 1;
            }
            return 0;
          });
        }

        this.setState({
          conferences,
          selectedConf,
          loading: false
        });
        this.getTeams(selectedConf.value);
      });
  };

  handleConfChange = selected => {
    this.setState({
      selectedConf: selected
    });
    this.getTeams(selected.value);
  };

  getTeams = confId => {
    this.setState({
      loading: true
    });
    let path = `/sportRadarStore/ncaamb/year/${this.getYear()}/REG/standings/conferences/${confId}/teams`;

    firebase
      .database()
      .ref(path)
      .once('value')
      .then(res => {
        let teams = res.val();
        teams.forEach(team => {
          let conf = team.records.filter(
            rec => rec.record_type === 'conference'
          )[0];
          team.conf = `${conf.wins}-${conf.losses}`;
        });
        this.setState({ teams, loading: false });
      });
  };

  render() {
    const { loading, conferences, selectedConf, teams } = this.state;

    return (
      <Wrapper>
        <Helmet title="NCAAMB Standings" />
        <div>
          <div className="standings-header">
            <div className="title">NCAAMB Standings</div>
            <div className="select-container">
              <label>Conference: </label>
              <Select
                options={conferences}
                isDisabled={conferences.length === 0}
                placeholder=""
                className="conference-select"
                onChange={this.handleConfChange}
                value={selectedConf}
              />
            </div>
          </div>
          <StandingsTable
            list={teams}
            loading={loading}
            conf={this.state.selectedConf}
          />
        </div>
        {/* <TrendingStories></TrendingStories> */}
      </Wrapper>
    );
  }
}

export default withRouter(Standings);
