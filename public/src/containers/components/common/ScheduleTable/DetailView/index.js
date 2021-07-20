import React, { Component } from 'react';
import * as firebase from 'firebase';

import { LoadingIcon } from '../../../Icons';
import Wrapper from './styled';
import PlayerStatsTable from '../../PlayerStatsTable';
import LastGameTable from '../../LastGameTable';
import TwoTeamStackupTable from '../../TwoTeamStackupTable';

class DetailView extends Component {
  state = {
    showDetail: false,
    loading: true,
    gameData: null
  };

  componentDidMount() {
    this.loadData();
  }

  loadData = () => {
    const { gameId, data, type } = this.props;

    this.setState({
      loading: true
    });

    if (data.status === 'closed') {
      let path = `/sportRadarStore/${type}/games/${gameId}`;

      firebase
        .database()
        .ref(path)
        .once('value')
        .then(res => {
          let data = res.val();
          this.setState({
            loading: false,
            gameData: {
              venue: data.summary.venue.name,
              home: {
                points: data.summary.home.points,
                score: data.summary.home.scoring,
                leaders: data.boxscore.home.leaders,
                stats: data.summary.home.statistics,
                players: data.summary.home.players
              },
              away: {
                points: data.summary.away.points,
                score: data.summary.away.scoring,
                leaders: data.boxscore.away.leaders,
                stats: data.summary.away.statistics,
                players: data.summary.away.players
              }
            }
          });
        });
    }
    if (data.status === 'scheduled') {
      let path = `/sportRadarStore/${type}/year/2018/REG/teams/`;
      firebase
        .database()
        .ref(path + data.home.id)
        .once('value')
        .then(res => {
          let homeData = res.val();
          this.setState({
            homeTeam: homeData
          });

          firebase
            .database()
            .ref(path + data.away.id)
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
  };

  render() {
    const { data, type } = this.props;

    return (
      <Wrapper>
        {this.state.loading ? (
          <div
            style={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              height: '100vh'
            }}>
            <LoadingIcon style={{ alignSelf: 'center' }} />
          </div>
        ) : data.status === 'closed' ? (
          <div>
            <div className="scheduleDetail-Header">
              <div className="schDetail-header-home">
                <div className="schDetail-team">
                  <img
                    className="team-img"
                    alt=""
                    src={`https://firebasestorage.googleapis.com/v0/b/bet-chicago.appspot.com/o/staticassests%2Fncaamb%2Fteam%2Flogo_60%2F${data.home.name.replace(
                      / /g,
                      '-'
                    )}.png?alt=media`}
                  />
                  <span>{data.home.name}</span>
                </div>
                <div className="schDetail-point">{data.home.points}</div>
              </div>
              <span>vs</span>
              <div className="schDetail-header-away">
                <div className="schDetail-team">
                  <img
                    className="team-img"
                    alt=""
                    src={`https://firebasestorage.googleapis.com/v0/b/bet-chicago.appspot.com/o/staticassests%2Fncaamb%2Fteam%2Flogo_60%2F${data.away.name.replace(
                      / /g,
                      '-'
                    )}.png?alt=media`}
                  />
                  <span>{data.away.name}</span>
                </div>
                <div className="schDetail-point">{data.away.points}</div>
              </div>
            </div>
            <div className="scheduleDetail-venue">
              <span>{this.state.gameData.venue}</span>
              <span>Final</span>
            </div>
            <div className="scheduleDetail-score">
              <div>
                <div className="scheduleDetail-score-heading">
                  <span>Scoring</span>
                </div>
                <div className="scheduleDetail-score-row">
                  <span>Team</span>
                  <span>1</span>
                  <span>2</span>
                  <span>OT</span>
                  <span>F</span>
                </div>
                <div className="scheduleDetail-score-row">
                  <span>{data.home.name}</span>
                  <span>{this.state.gameData.home.score[0].points}</span>
                  <span>{this.state.gameData.home.score[0].points}</span>
                  <span>0</span>
                  <span>{data.home.points}</span>
                </div>
                <div className="scheduleDetail-score-row">
                  <span>{data.away.name}</span>
                  <span>{this.state.gameData.away.score[0].points}</span>
                  <span>{this.state.gameData.away.score[0].points}</span>
                  <span>0</span>
                  <span>{data.away.points}</span>
                </div>

                <div className="scheduleDetail-score-leader">
                  <div>
                    {this.state.gameData.home.leaders.points[0].full_name}(
                    {data.home.alias}):{' '}
                    {
                      this.state.gameData.home.leaders.points[0].statistics
                        .points
                    }{' '}
                    PTS,{' '}
                    {
                      this.state.gameData.home.leaders.points[0].statistics
                        .rebounds
                    }{' '}
                    REB,{' '}
                    {
                      this.state.gameData.home.leaders.points[0].statistics
                        .assists
                    }{' '}
                    AST
                  </div>
                  <div>
                    {this.state.gameData.away.leaders.points[0].full_name}(
                    {data.away.alias}):{' '}
                    {
                      this.state.gameData.away.leaders.points[0].statistics
                        .points
                    }{' '}
                    PTS,{' '}
                    {
                      this.state.gameData.away.leaders.points[0].statistics
                        .rebounds
                    }{' '}
                    REB,{' '}
                    {
                      this.state.gameData.away.leaders.points[0].statistics
                        .assists
                    }{' '}
                    AST
                  </div>
                </div>
              </div>
            </div>
            <div className="scheduleDetail-team-stats">
              <div className="scheduleDetail-team-stats-heading">
                <img
                  className="team-img"
                  alt=""
                  src={`https://firebasestorage.googleapis.com/v0/b/bet-chicago.appspot.com/o/staticassests%2Fncaamb%2Fteam%2Flogo_60%2F${data.home.name.replace(
                    / /g,
                    '-'
                  )}.png?alt=media`}
                />
                <span>Team Stats</span>
                <img
                  className="team-img"
                  alt=""
                  src={`https://firebasestorage.googleapis.com/v0/b/bet-chicago.appspot.com/o/staticassests%2Fncaamb%2Fteam%2Flogo_60%2F${data.away.name.replace(
                    / /g,
                    '-'
                  )}.png?alt=media`}
                />
              </div>
              <div>
                <span>
                  {this.state.gameData.home.stats.field_goals_made}/
                  {this.state.gameData.home.stats.field_goals_att}{' '}
                  <span className="gray">
                    ({this.state.gameData.home.stats.field_goals_pct}%)
                  </span>
                </span>
                <span>Field Goals</span>
                <span>
                  {this.state.gameData.away.stats.field_goals_made}/
                  {this.state.gameData.away.stats.field_goals_att}{' '}
                  <span className="gray">
                    ({this.state.gameData.away.stats.field_goals_pct}%)
                  </span>
                </span>
              </div>
              <div>
                <span>
                  {this.state.gameData.home.stats.three_points_made}/
                  {this.state.gameData.home.stats.three_points_att}{' '}
                  <span className="gray">
                    ({this.state.gameData.home.stats.three_points_pct}%)
                  </span>
                </span>
                <span>3 Pointers</span>
                <span>
                  {this.state.gameData.away.stats.three_points_made}/
                  {this.state.gameData.away.stats.three_points_att}{' '}
                  <span className="gray">
                    ({this.state.gameData.away.stats.three_points_pct}%)
                  </span>
                </span>
              </div>
              <div>
                <span>
                  {this.state.gameData.home.stats.free_throws_made}/
                  {this.state.gameData.home.stats.free_throws_att}{' '}
                  <span className="gray">
                    ({this.state.gameData.home.stats.free_throws_pct}%)
                  </span>
                </span>
                <span>Free Throws</span>
                <span>
                  {this.state.gameData.away.stats.free_throws_made}/
                  {this.state.gameData.away.stats.free_throws_att}{' '}
                  <span className="gray">
                    ({this.state.gameData.away.stats.free_throws_pct}%)
                  </span>
                </span>
              </div>
              <div>
                <span>{this.state.gameData.home.stats.assists}</span>
                <span>Assists</span>
                <span>{this.state.gameData.away.stats.assists}</span>
              </div>
              <div>
                <span>{this.state.gameData.home.stats.rebounds}</span>
                <span>Rebounds</span>
                <span>{this.state.gameData.away.stats.rebounds}</span>
              </div>
              <div>
                <span>{this.state.gameData.home.stats.offensive_rebounds}</span>
                <span>Off. Rebounds</span>
                <span>{this.state.gameData.away.stats.offensive_rebounds}</span>
              </div>
              <div>
                <span>{this.state.gameData.home.stats.blocks}</span>
                <span>Blocks</span>
                <span>{this.state.gameData.away.stats.blocks}</span>
              </div>
              <div>
                <span>{this.state.gameData.home.stats.steals}</span>
                <span>Steals</span>
                <span>{this.state.gameData.away.stats.steals}</span>
              </div>
              <div>
                <span>{this.state.gameData.home.stats.turnovers}</span>
                <span>Turn Overs</span>
                <span>{this.state.gameData.away.stats.turnovers}</span>
              </div>
            </div>
            <div className="scheduleDetail-player-stats">
              {this.state.gameData.home && (
                <PlayerStatsTable
                  data={this.state.gameData.home.players}
                  gameStats={true}
                  title="Player Stats"
                  imgURL={`https://firebasestorage.googleapis.com/v0/b/bet-chicago.appspot.com/o/staticassests%2Fncaamb%2Fteam%2Flogo_60%2F${data.home.name.replace(
                    / /g,
                    '-'
                  )}.png?alt=media`}
                />
              )}
              {this.state.gameData.away && (
                <PlayerStatsTable
                  data={this.state.gameData.away.players}
                  gameStats={true}
                  title="Player Stats"
                  imgURL={`https://firebasestorage.googleapis.com/v0/b/bet-chicago.appspot.com/o/staticassests%2Fncaamb%2Fteam%2Flogo_60%2F${data.away.name.replace(
                    / /g,
                    '-'
                  )}.png?alt=media`}
                />
              )}
            </div>
          </div>
        ) : (
          <div>
            <div className="scheduleDetail-Header">
              <div className="schDetail-header-home">
                <div className="schDetail-team">
                  <img
                    className="team-img"
                    alt=""
                    src={`https://firebasestorage.googleapis.com/v0/b/bet-chicago.appspot.com/o/staticassests%2Fncaamb%2Fteam%2Flogo_60%2F${data.home.name.replace(
                      / /g,
                      '-'
                    )}.png?alt=media`}
                  />
                  <span>{data.home.name}</span>
                </div>
                <div className="schDetail-point" />
              </div>
              <span>vs</span>
              <div className="schDetail-header-away">
                <div className="schDetail-team">
                  <img
                    className="team-img"
                    alt=""
                    src={`https://firebasestorage.googleapis.com/v0/b/bet-chicago.appspot.com/o/staticassests%2Fncaamb%2Fteam%2Flogo_60%2F${data.away.name.replace(
                      / /g,
                      '-'
                    )}.png?alt=media`}
                  />
                  <span>{data.away.name}</span>
                </div>
                <div className="schDetail-point" />
              </div>
            </div>
            <div className="scheduleDetail-venue">
              <span>{data.date}</span>
              <span>{data.time}</span>
            </div>

            {this.state.homeTeam.stats && this.state.awayTeam.stats && (
              <TwoTeamStackupTable
                home={this.state.homeTeam}
                away={this.state.awayTeam}
              />
            )}
            <LastGameTable
              type={type}
              data={this.state.homeTeam}
              imgURL={`https://firebasestorage.googleapis.com/v0/b/bet-chicago.appspot.com/o/staticassests%2Fncaamb%2Fteam%2Flogo_60%2F${data.home.name.replace(
                / /g,
                '-'
              )}.png?alt=media`}
              title="Last 10 Games"
            />
            <LastGameTable
              type={type}
              data={this.state.awayTeam}
              imgURL={`https://firebasestorage.googleapis.com/v0/b/bet-chicago.appspot.com/o/staticassests%2Fncaamb%2Fteam%2Flogo_60%2F${data.away.name.replace(
                / /g,
                '-'
              )}.png?alt=media`}
              title="Last 10 Games"
            />
            {this.state.homeTeam.stats && (
              <PlayerStatsTable
                data={this.state.homeTeam.stats.players}
                imgURL={`https://firebasestorage.googleapis.com/v0/b/bet-chicago.appspot.com/o/staticassests%2Fncaamb%2Fteam%2Flogo_60%2F${data.home.name.replace(
                  / /g,
                  '-'
                )}.png?alt=media`}
                title="Team Players"
              />
            )}
            {this.state.awayTeam.stats && (
              <PlayerStatsTable
                data={this.state.awayTeam.stats.players}
                imgURL={`https://firebasestorage.googleapis.com/v0/b/bet-chicago.appspot.com/o/staticassests%2Fncaamb%2Fteam%2Flogo_60%2F${data.away.name.replace(
                  / /g,
                  '-'
                )}.png?alt=media`}
                title="Team Players"
              />
            )}
          </div>
        )}
      </Wrapper>
    );
  }
}

export default DetailView;
