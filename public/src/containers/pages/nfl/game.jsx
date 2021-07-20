import React, { Component } from 'react';
import * as firebase from 'firebase';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import styled from 'styled-components';
import Loading from '../../../containers/components/Loading';
import { STATUS } from '../../../modules/constants/common';
import PlayerStatsTable from '../../../containers/components/common/PlayerStatsTable';
import { media } from '../../../containers/components/common/styles';
import { loadGame } from '../../../apis/nfl';

const Wrapper = styled.div`
  display: flex;
  background: #fafafa;
  max-width: 1318px;
  margin: auto;
  z-index: 999;

  ${media.mobile} {
    top: -50px;
  }
  .team-img {
    width: 60px;
    height: 60px;
  }
  > div {
    width: 100%;
    > div {
      padding: 15px;
    }
    .scheduleDetail-Header {
      display: flex;
      justify-content: center;
      height: 150px;
      align-items: center;
      .team-img {
        width: 60px;
        height: 60px;
      }
      > span {
        padding: 0 50px;
        font-size: 20px;
      }
      > div {
        display: flex;
        align-items: center;
        .schDetail-team {
          display: flex;
          align-items: center;
          justify-content: center;
          flex-direction: column;
          ${media.mobile} {
            flex-direction: row;
            span {
              margin-left: 10px;
            }
          }
        }
        .schDetail-point {
          font-size: 35px;
          padding: 0 50px;
          ${media.mobile} {
            padding: 0px;
          }
        }
        &.schDetail-header-away {
          flex-direction: row-reverse;
          ${media.mobile} {
            flex-direction: row;
          }
        }
        ${media.mobile} {
          justify-content: space-between;
          margin-bottom: 15px;
        }
      }
      ${media.mobile} {
        flex-direction: column;
        align-items: initial;
        padding-top: 45px;
        padding-bottom: 0px;
        > span {
          display: none;
        }
      }
    }

    .scheduleDetail-venue {
      display: flex;
      justify-content: space-between;
    }

    .scheduleDetail-score {
      background: white;
      margin-bottom: 20px;
      border-bottom: 1px solid #ccc;
      border-top: 1px solid #ccc;
      span:first-child {
        font-weight: bold;
      }
      .scheduleDetail-score-heading {
        padding: 8px 0;
        font-size: 22px;
      }
      .scheduleDetail-score-row {
        display: flex;
        padding: 8px 0;
        border-bottom: 1px solid #ccc;
        span {
          width: 50px;
          text-align: center;
        }
        span:first-child {
          flex: 1;
          text-align: left;
          font-size: 20px;
        }
        span:last-child {
          font-weight: bold;
        }
      }
      div:nth-child(2) {
        span {
          font-weight: bold !important;
        }
        span:first-child {
          font-size: 16px !important;
        }
      }
      .scheduleDetail-score-leader {
        padding-top: 10px;
        color: #aaa;
        font-size: 14px;
      }
    }

    .scheduleDetail-team-stats {
      background: white;
      margin-bottom: 20px;
      border-bottom: 1px solid #ccc;
      border-top: 1px solid #ccc;
      div {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 8px 0px;
        border-bottom: 1px solid #ccc;
        span {
          font-weight: bold;
          .gray {
            font-weight: normal;
            color: #aaa;
          }
        }
        span:nth-child(2) {
          font-weight: normal;
        }
      }
      .scheduleDetail-team-stats-heading {
        span:nth-child(2) {
          font-weight: bold;
        }
      }
    }
    .scheduleDetail-player-stats {
      padding: 0px;
    }
  }
`;

class Game extends Component {

  constructor(props) {
    super(props);

    this.state = {
      loading: true,
    }
  }

  componentDidMount() {
    const week = this.props.match.params.week;
    const id = this.props.match.params.id;

    this.props.loadGame(week, id);
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.loadingGame === STATUS.REQUEST && nextProps.loadingGame === STATUS.SUCCESS) {
      let path = `/sportRadarStore/nfl/teamProfiles/`;
        firebase
          .database()
          .ref(path + nextProps.game.home.id)
          .once('value')
          .then(res => {
            let homeData = res.val();
            this.setState({
              homeTeam: homeData
            });

            firebase
              .database()
              .ref(path + nextProps.game.away.id)
              .once('value')
              .then(res => {
                let awayData = res.val();
                this.setState({
                  loading: false,
                  awayTeam: awayData
                });
              });
          });
    }
  }

  render() {
    const { loadingGame } = this.props;
    const { homeTeam, awayTeam, loading } = this.state;
    console.log(homeTeam);
    console.log(awayTeam);

    return (
      <Wrapper>
        {(loadingGame === STATUS.REQUEST || loading) ? (
          <Loading />
        ) : (<div>
          <div className="scheduleDetail-Header">
            <div className="schDetail-header-home">
              <div className="schDetail-team">
                <img
                  className="team-img"
                  alt=""
                  src={`https://firebasestorage.googleapis.com/v0/b/bet-chicago.appspot.com/o/staticassests%2Fnfl%2Fteam%2Flogo_60%2F${homeTeam.profile.market.replace(/ /g, '-').toLowerCase()}-${homeTeam.profile.name.replace(/ /g, '-').toLowerCase()}.png?alt=media`}
                />
                <span>{homeTeam.profile.name}</span>
              </div>
              <div className="schDetail-point" />
            </div>
            <span>vs</span>
            <div className="schDetail-header-away">
              <div className="schDetail-team">
                <img
                  className="team-img"
                  alt=""
                  src={`https://firebasestorage.googleapis.com/v0/b/bet-chicago.appspot.com/o/staticassests%2Fnfl%2Fteam%2Flogo_60%2F${awayTeam.profile.market.replace(/ /g, '-').toLowerCase()}-${awayTeam.profile.name.replace(/ /g, '-').toLowerCase()}.png?alt=media`}
                />
                <span>{awayTeam.profile.name}</span>
              </div>
              <div className="schDetail-point" />
            </div>
          </div>
          {homeTeam.profile && homeTeam.profile.players && <PlayerStatsTable
            data={homeTeam.profile.players}
            imgURL={`https://firebasestorage.googleapis.com/v0/b/bet-chicago.appspot.com/o/staticassests%2Fnfl%2Fteam%2Flogo_60%2F${homeTeam.profile.market.replace(/ /g, '-').toLowerCase()}-${homeTeam.profile.name.replace(/ /g, '-').toLowerCase()}.png?alt=media`}
            title="Team Players"
          />}
          {awayTeam.profile && awayTeam.profile.players && <PlayerStatsTable
            data={awayTeam.profile.players}
            imgURL={`https://firebasestorage.googleapis.com/v0/b/bet-chicago.appspot.com/o/staticassests%2Fnfl%2Fteam%2Flogo_60%2F${awayTeam.profile.market.replace(/ /g, '-').toLowerCase()}-${awayTeam.profile.name.replace(/ /g, '-').toLowerCase()}.png?alt=media`}
            title="Team Players"
          />}
        </div>)}
      </Wrapper>
    );
  }
}

const mapStateToProps = state => ({
  game: state.nfl.game,
  loadingGame: state.nfl.loading.game,
});

const mapDispatchToProps = dispatch =>
  bindActionCreators(
    {
      loadGame,
    },
    dispatch
  );

export default connect(mapStateToProps, mapDispatchToProps)(Game);
