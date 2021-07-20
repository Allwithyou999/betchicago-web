import React, { Component } from 'react';
import * as firebase from 'firebase';

import Loading from '../../../../containers/components/Loading';
import PlayerStatsTable from '../../../../containers/components/common/PlayerStatsTable';
import TwoTeamStackupTable from '../../../../containers/components/common/TwoTeamStackupTable';
import LastGameTable from '../../../../containers/components/common/LastGameTable';
import Wrapper from './styled';

class GameDetail extends Component {

  constructor(props) {
    super(props);

    this.state = {
      loading: true,
    }
  }

  componentDidMount() {
    const id = this.props.match.params.id;

    let path = `/sportRadarStore/nba/games/${id}`;
    firebase
      .database()
      .ref(path)
      .on('value', (result) => {
        let game = result.val();
        console.log(game);
        this.setState({
          game,
        });
      });
    firebase
      .database()
      .ref(path)
      .once('value')
      .then(result => {
        let game = result.val();

        path = `/sportRadarStore/nba/year/2018/REG/teams/`;
        firebase
          .database()
          .ref(path + game.summary.home.id)
          .once('value')
          .then(res => {
            let homeData = res.val();

            firebase
              .database()
              .ref(path + game.summary.away.id)
              .once('value')
              .then(res => {
                let awayData = res.val();

                path = `/sportRadarStore/nba/teams/`;
                firebase
                  .database()
                  .ref(path + game.summary.home.id + '/profile')
                  .once('value')
                  .then(res => {
                    homeData.profile = res.val();

                    firebase
                      .database()
                      .ref(path + game.summary.away.id + '/profile')
                      .once('value')
                      .then(res => {
                        awayData.profile = res.val();

                        this.setState({
                          loading: false,
                          game,
                          homeTeam: homeData,
                          awayTeam: awayData
                        });
                      });
                  });
              });
          });
      });
  }

  render() {
    const { game, homeTeam, awayTeam, loading } = this.state;
    let homePlayers = [];
    let awayPlayers = [];

    if (game && game.players && homeTeam && awayTeam) {
      ((homeTeam.profile && homeTeam.profile.players) || []).forEach(player => {
        if (game.players[player.id]) {
          homePlayers.push(game.players[player.id]);
        }
      });

      ((awayTeam.profile && awayTeam.profile.players) || []).forEach(player => {
        if (game.players[player.id]) {
          awayPlayers.push(game.players[player.id]);
        }
      });
    }

    if (homeTeam && homeTeam.stats && homeTeam.stats.players) {
      homeTeam.stats.players.sort((a, b) => parseFloat(b.average ? b.average.points : 0) - parseFloat(a.average ? a.average.points : 0));
    }

    if (awayTeam && awayTeam.stats && awayTeam.stats.players) {
      awayTeam.stats.players.sort((a, b) => parseFloat(b.average ? b.average.points : 0) - parseFloat(a.average ? a.average.points : 0));
    }

    const gameData = game ? {
      venue: game.summary.venue.name,
      home: {
        points: game.summary.home.points,
        score: game.summary.home.scoring,
        leaders: (game.boxscore && game.boxscore.home.leaders),
        stats: game.summary.home.statistics,
        players: homePlayers,
      },
      away: {
        points: game.summary.away.points,
        score: game.summary.away.scoring,
        leaders: (game.boxscore && game.boxscore.away.leaders),
        stats: game.summary.away.statistics,
        players: awayPlayers,
      }
    } : {};

    return (
      <Wrapper>
        {(loading || !game || !homeTeam || !awayTeam) ? (
          <Loading />
        ) : (game.summary.status === 'closed' || game.summary.status === 'inprogress') ? (<div>
            <div className="scheduleDetail-Header">
              <div className="schDetail-header-home">
                <div className="schDetail-team">
                  <img
                    className="team-img"
                    alt=""
                    src={`https://firebasestorage.googleapis.com/v0/b/bet-chicago.appspot.com/o/staticassests%2Fnba%2Fteam%2Flogo_60%2F${homeTeam.market.replace(
                      / /g,
                      '-'
                    )}-${homeTeam.name.replace(/ /g, '-')}.png?alt=media`}
                  />
                  <span>{game.summary.home.name}</span>
                </div>
                <div className="schDetail-point">{game.summary.home.points}</div>
              </div>
              <span>vs</span>
              <div className="schDetail-header-away">
                <div className="schDetail-team">
                  <img
                    className="team-img"
                    alt=""
                    src={`https://firebasestorage.googleapis.com/v0/b/bet-chicago.appspot.com/o/staticassests%2Fnba%2Fteam%2Flogo_60%2F${awayTeam.market.replace(
                      / /g,
                      '-'
                    )}-${awayTeam.name.replace(/ /g, '-')}.png?alt=media`}
                  />
                  <span>{game.summary.away.name}</span>
                </div>
                <div className="schDetail-point">{game.summary.away.points}</div>
              </div>
            </div>
            <div className="scheduleDetail-venue">
              <span>{gameData.venue}</span>
              {game.summary.status === 'closed' && <span>Final</span>}
              {game.summary.status === 'inprogress' && <span>Q{game.summary.quarter} {game.summary.clock}</span>}
            </div>
            <div className="scheduleDetail-score">
              <div>
                <div className="scheduleDetail-score-heading">
                  <span>Scoring</span>
                </div>
                <div className="scheduleDetail-score-row">
                  <span>Team</span>
                  {gameData.home.score.map((item, index) => {
                    return <span>{index + 1}</span>;
                  })}
                  <span>{game.summary.status === 'closed' ? 'F' : 'T'}</span>
                </div>
                <div className="scheduleDetail-score-row">
                  <span>{game.summary.home.name}</span>
                  {gameData.home.score.map(item => {
                    return <span>{item.points}</span>;
                  })}
                  <span>{game.summary.home.points}</span>
                </div>
                <div className="scheduleDetail-score-row">
                  <span>{game.summary.away.name}</span>
                  {gameData.away.score.map(item => {
                    return <span>{item.points}</span>;
                  })}
                  <span>{game.summary.away.points}</span>
                </div>
              </div>
            </div>
            <div className="scheduleDetail-team-stats">
              <div className="scheduleDetail-team-stats-heading">
                <img
                  className="team-img"
                  alt=""
                  src={`https://firebasestorage.googleapis.com/v0/b/bet-chicago.appspot.com/o/staticassests%2Fnba%2Fteam%2Flogo_60%2F${homeTeam.market.replace(
                    / /g,
                    '-'
                  )}-${homeTeam.name.replace(/ /g, '-')}.png?alt=media`}
                />
                <span>Team Stats</span>
                <img
                  className="team-img"
                  alt=""
                  src={`https://firebasestorage.googleapis.com/v0/b/bet-chicago.appspot.com/o/staticassests%2Fnba%2Fteam%2Flogo_60%2F${awayTeam.market.replace(
                    / /g,
                    '-'
                  )}-${awayTeam.name.replace(/ /g, '-')}.png?alt=media`}
                />
              </div>
              <div>
                <span>
                  {gameData.home.stats.field_goals_made}/
                  {gameData.home.stats.field_goals_att}{' '}
                  <span className="gray">
                    ({gameData.home.stats.field_goals_pct}%)
                  </span>
                </span>
                <span>Field Goals</span>
                <span>
                  {gameData.away.stats.field_goals_made}/
                  {gameData.away.stats.field_goals_att}{' '}
                  <span className="gray">
                    ({gameData.away.stats.field_goals_pct}%)
                  </span>
                </span>
              </div>
              <div>
                <span>
                  {gameData.home.stats.three_points_made}/
                  {gameData.home.stats.three_points_att}{' '}
                  <span className="gray">
                    ({gameData.home.stats.three_points_pct}%)
                  </span>
                </span>
                <span>3 Pointers</span>
                <span>
                  {gameData.away.stats.three_points_made}/
                  {gameData.away.stats.three_points_att}{' '}
                  <span className="gray">
                    ({gameData.away.stats.three_points_pct}%)
                  </span>
                </span>
              </div>
              <div>
                <span>
                  {gameData.home.stats.free_throws_made}/
                  {gameData.home.stats.free_throws_att}{' '}
                  <span className="gray">
                    ({gameData.home.stats.free_throws_pct}%)
                  </span>
                </span>
                <span>Free Throws</span>
                <span>
                  {gameData.away.stats.free_throws_made}/
                  {gameData.away.stats.free_throws_att}{' '}
                  <span className="gray">
                    ({gameData.away.stats.free_throws_pct}%)
                  </span>
                </span>
              </div>
              <div>
                <span>{gameData.home.stats.assists}</span>
                <span>Assists</span>
                <span>{gameData.away.stats.assists}</span>
              </div>
              <div>
                <span>{gameData.home.stats.rebounds}</span>
                <span>Rebounds</span>
                <span>{gameData.away.stats.rebounds}</span>
              </div>
              <div>
                <span>{gameData.home.stats.offensive_rebounds}</span>
                <span>Off. Rebounds</span>
                <span>{gameData.away.stats.offensive_rebounds}</span>
              </div>
              <div>
                <span>{gameData.home.stats.blocks}</span>
                <span>Blocks</span>
                <span>{gameData.away.stats.blocks}</span>
              </div>
              <div>
                <span>{gameData.home.stats.steals}</span>
                <span>Steals</span>
                <span>{gameData.away.stats.steals}</span>
              </div>
              <div>
                <span>{gameData.home.stats.turnovers}</span>
                <span>Turn Overs</span>
                <span>{gameData.away.stats.turnovers}</span>
              </div>
            </div>
            <div className="scheduleDetail-player-stats">
              <PlayerStatsTable
                data={homePlayers}
                gameStats={true}
                title="Player Stats"
                imgURL={`https://firebasestorage.googleapis.com/v0/b/bet-chicago.appspot.com/o/staticassests%2Fnba%2Fteam%2Flogo_60%2F${homeTeam.market.replace(
                  / /g,
                  '-'
                )}-${homeTeam.name.replace(/ /g, '-')}.png?alt=media`}
              />
              <PlayerStatsTable
                data={awayPlayers}
                gameStats={true}
                title="Player Stats"
                imgURL={`https://firebasestorage.googleapis.com/v0/b/bet-chicago.appspot.com/o/staticassests%2Fnba%2Fteam%2Flogo_60%2F${awayTeam.market.replace(
                  / /g,
                  '-'
                )}-${awayTeam.name.replace(/ /g, '-')}.png?alt=media`}
              />
            </div>
          </div>) : (<div>
            <div className="scheduleDetail-Header">
              <div className="schDetail-header-home">
                <div className="schDetail-team">
                  <img
                    className="team-img"
                    alt=""
                    src={`https://firebasestorage.googleapis.com/v0/b/bet-chicago.appspot.com/o/staticassests%2Fnba%2Fteam%2Flogo_60%2F${homeTeam.market.replace(
                      / /g,
                      '-'
                    )}-${homeTeam.name.replace(/ /g, '-')}.png?alt=media`}
                  />
                  <span>{game.summary.home.name}</span>
                </div>
                <div className="schDetail-point" />
              </div>
              <span>vs</span>
              <div className="schDetail-header-away">
                <div className="schDetail-team">
                  <img
                    className="team-img"
                    alt=""
                    src={`https://firebasestorage.googleapis.com/v0/b/bet-chicago.appspot.com/o/staticassests%2Fnba%2Fteam%2Flogo_60%2F${awayTeam.market.replace(
                      / /g,
                      '-'
                    )}-${awayTeam.name.replace(/ /g, '-')}.png?alt=media`}
                  />
                  <span>{game.summary.away.name}</span>
                </div>
                <div className="schDetail-point" />
              </div>
            </div>
            <div className="scheduleDetail-venue">
              <span>{game.date}</span>
              <span>{game.time}</span>
            </div>

            <TwoTeamStackupTable
              home={homeTeam}
              away={awayTeam}
              type="nba"
            />
            <LastGameTable
              data={homeTeam}
              imgURL={`https://firebasestorage.googleapis.com/v0/b/bet-chicago.appspot.com/o/staticassests%2Fnba%2Fteam%2Flogo_60%2F${game.summary.home.name.replace(
                / /g,
                '-'
              )}.png?alt=media`}
              title="Last 10 Games"
              type="nba"
            />
            <LastGameTable
              data={awayTeam}
              imgURL={`https://firebasestorage.googleapis.com/v0/b/bet-chicago.appspot.com/o/staticassests%2Fnba%2Fteam%2Flogo_60%2F${game.summary.away.name.replace(
                / /g,
                '-'
              )}.png?alt=media`}
              title="Last 10 Games"
              type="nba"
            />
            {homeTeam.stats && homeTeam.stats.players && <PlayerStatsTable
              data={homeTeam.stats.players}
              imgURL={`https://firebasestorage.googleapis.com/v0/b/bet-chicago.appspot.com/o/staticassests%2Fnba%2Fteam%2Flogo_60%2F${game.summary.home.name.replace(
                / /g,
                '-'
              )}.png?alt=media`}
              title="Team Players"
            />}
            {awayTeam.stats && awayTeam.stats.players && <PlayerStatsTable
              data={awayTeam.stats.players}
              imgURL={`https://firebasestorage.googleapis.com/v0/b/bet-chicago.appspot.com/o/staticassests%2Fnba%2Fteam%2Flogo_60%2F${game.summary.away.name.replace(
                / /g,
                '-'
              )}.png?alt=media`}
              title="Team Players"
            />}
          </div>
        )}
      </Wrapper>
    );
  }
}

export default GameDetail;
