import React, { Component } from 'react';
import styled from 'styled-components';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import Promo2 from '../../../containers/components/Promo2';
import PlayerTable from '../../../containers/components/players/PlayerTable';
import TrendingStories from '../../../containers/components/TrendingStories';
import PlayerProfileDetail from '../../../containers/components/players/PlayerProfileDetail';
import Page, { MainContent, SidebarRight, TabletOnly, MobileOnly } from '../../../containers/components/Layout';
import SidebarWidget from '../../../containers/components/SidebarWidget';
import ContentPromo from '../../../containers/components/ContentPromo';
import Loading from '../../../containers/components/Loading';

import { THEME_COLORS } from '../../../modules/styles';
import {
  PLAYER_TOP_TITLE,
  PLAYER_BOTTOM_TITLE,
  PLAYER_DESKTOP_TOP_TITLE,
  PLAYER_DESKTOP_BOTTOM_TITLE,
  PLAYER_SCORE_TITLE,
  PLAYER_DESKTOP_EVENT_SCORE_TITLE
} from '../../../modules/constants/golf';
import { formatMoney, formatPlayerTourData, formatDate } from '../../../modules/utilities/formatter';

import { loadPlayerRankings, loadPlayerStats, loadPlayerTournamentData } from '../../../apis/golf';
import { db } from '../../../apis/firebase';

const Wrapper = styled.div`
  padding: 20px;
`;

const TableTitle = styled.div`
  font-size: 13px;
  line-height: 15px;
  font-weight: bold;
  color: ${THEME_COLORS.BRAND};
  margin: 5px 0 10px;
  text-transform: uppercase;
  ${props => props.marginBottom && `margin-bottom: 15px;`};
`;

const SectionDivider = styled.div`
  height: 20px;
  background-color: #eaeaeb;
  border-top: 1px solid #c8c8c8;
  border-bottom: 1px solid #c8c8c8;
`;

const TableHolder = styled.div`
  margin-bottom: 14px;
`;

const TableSubtitle = styled.div`
  font-size: 13px;
  line-height: 15px;
  font-weight: 400;
  margin-bottom: 10px;
`;

class Player extends Component {
  componentDidMount() {
    const { match } = this.props;

    if (match.params.id) {
      this.props.loadPlayerStats(match.params.id);
      this.props.loadPlayerTournamentData(match.params.id);
    } else {
      let parts = window.location.href.split('/');
      let id = parts[parts.length - 1];
      if (id !== 'player') {
        this.props.loadPlayerStats(id);
        this.props.loadPlayerTournamentData(id);
      }
    }
    this.apArticles = [];
  }
  fetchPlayerNewsByName(tag) {
    if (tag === '') return;
    if (this.playerStoriesLoaded) return;
    tag = tag.toLowerCase().replace(/[[\]\-{}"'()*+? .\\^$|]/g, '');
    if (window.cApplicationLocal.__fetchAPArticles) {
      window.cApplicationLocal
        .__fetchAPArticles(db, tag)
        .then(articles => {
          this.playerStoriesLoaded = true;
          this.apArticles = articles;
          return this.forceUpdate();
        })
        .catch(e => {
          console.log('failed to load ap articles', e);
        });
    }
  }
  render() {
    const { playerStats, playerTourData } = this.props;

    let pairingInfo = {};

    let playerTop = [];
    let playerBottom = [];
    let playerNameTag = '';
    if (playerStats) {
      let stats = playerStats.stats.statistics;
      if (!stats) stats = {};
      playerTop = [
        {
          rank: stats.world_rank,
          earning: '$' + formatMoney(stats.earnings),
          events: stats.events_played,
          wins: stats.first_place,
          fedex: formatMoney(stats.points),
          second: stats.second_place,
          third: stats.third_place,
          top10: stats.top_10,
          top25: stats.top_25,
          cuts: stats.cuts_made
        }
      ];

      let profile = playerStats.profile;
      playerNameTag = profile.first_name + profile.last_name;

      playerBottom = [
        {
          avgScore: stats.scoring_avg,
          avgDrive: stats.drive_avg,
          accuracy: stats.drive_acc + '%',
          greens: stats.gir_pct + '%',
          avgPutts: stats.putt_avg,
          sandSave: stats.sand_saves_pct + '%',
          birdies: stats.birdies_per_round,
          holes: stats.holes_per_eagle
        }
      ];
    }

    let recentScore = [];
    if (playerTourData) {
      try {
        recentScore = formatPlayerTourData(playerTourData.recent);
      } catch (e) {}
      try {
        pairingInfo = {
          date: formatDate(
            new Date(playerTourData.nextPairing.teetime.teetimes.tee_time),
            'yyyy mm dd'
          ),
          players: playerTourData.nextPairing.teetime.teetimes.players
            .map(player => `${player.first_name} ${player.last_name}`)
            .join(', '),
          title: playerTourData.pairingTour.name
        };
      } catch (e) {}
    }
    // const playerScore = [
    //   {
    //     r1: 67,
    //     r2: 68,
    //     r3: 69,
    //     r4: '- -',
    //     par: -10,
    //     pos: 72,
    //     win: -18,
    //     event: 'Event Name',
    //     link: '/event-link',
    //     course: 'Course name'
    //   }
    // ];
    this.fetchPlayerNewsByName(playerNameTag);

    let playerNews = [];
    if (
      this.apArticles &&
      window.cApplicationLocal.__processAPArticlesToNormal
    ) {
      playerNews = window.cApplicationLocal.__processAPArticlesToNormal(
        this.apArticles
      );
    }
    let storiesLoaded = this.playerStoriesLoaded;
    let noNews = false;
    if (storiesLoaded && this.apArticles.length === 0) noNews = true;

    return (
      <div>
        <TabletOnly>
          {!!playerStats ? (
            <Page>
              <MainContent hasRight>
                <div>
                  <PlayerProfileDetail profile={playerStats.profile} />
                  <TableHolder>
                    <TableTitle>SEASON STATS</TableTitle>
                    <PlayerTable
                      single
                      titles={PLAYER_DESKTOP_TOP_TITLE}
                      list={playerTop}
                    />
                    <PlayerTable
                      single
                      titles={PLAYER_DESKTOP_BOTTOM_TITLE}
                      list={playerBottom}
                    />
                  </TableHolder>
                  <TableHolder>
                    <TableTitle>MOST RECENT TOURNAMENT FINISHES</TableTitle>
                    <PlayerTable
                      single
                      titles={PLAYER_DESKTOP_EVENT_SCORE_TITLE}
                      list={recentScore}
                    />
                  </TableHolder>
                  {/*
                  <TableHolder>
                    <TableTitle>
                      {'{CURRENT TOURNAMENT NAME} FINISHES'}
                    </TableTitle>
                    <PlayerTable
                      single
                      titles={PLAYER_DESKTOP_COURSE_SCORE_TITLE}
                      list={playerScore}
                    />
                  </TableHolder>
                  <TableHolder>
                    <TableTitle>
                      {'{UPCOMING TOURNAMENT NAME} FINISHES'}
                    </TableTitle>
                    <PlayerTable
                      single
                      titles={PLAYER_DESKTOP_COURSE_SCORE_TITLE}
                      list={playerScore}
                    />
                  </TableHolder>
                  */}
                </div>
              </MainContent>
              <SidebarRight>
                {!pairingInfo.notValid && (
                  <SidebarWidget title="NEXT PAIRING">
                    <Promo2 data={pairingInfo} white />
                  </SidebarWidget>
                )}
                {/*
                <SidebarWidget title="MATCHUP BETS" />
                */}
                <SidebarWidget title="PLAYER NEWS">
                  {playerNews.length > 0 && (
                    <TrendingStories stories={playerNews} />
                  )}
                  {noNews && <div>No news at this time</div>}
                </SidebarWidget>
                <SidebarWidget>
                  <ContentPromo />
                </SidebarWidget>
              </SidebarRight>
            </Page>
          ) : (
            <Loading />
          )}
        </TabletOnly>
        <MobileOnly>
          <Promo2 data={pairingInfo} />
          <Wrapper>
            <PlayerProfileDetail />
            <TableTitle>Current session</TableTitle>
            <PlayerTable single titles={PLAYER_TOP_TITLE} list={playerTop} />
            <PlayerTable
              single
              titles={PLAYER_BOTTOM_TITLE}
              list={playerBottom}
            />
          </Wrapper>

          <SectionDivider />
          <Wrapper>
            <TableTitle>MOST RECENT TOURNAMENT FINISHES</TableTitle>
            {recentScore.map((value, index) => (
              <TableHolder>
                <TableSubtitle>{value.event}</TableSubtitle>
                <PlayerTable
                  single
                  titles={PLAYER_SCORE_TITLE}
                  list={[value]}
                />
              </TableHolder>
            ))}
          </Wrapper>
          {/*
          <SectionDivider />
          <Wrapper>
            <TableTitle marginBottom>CURRENT COURSE RESULT</TableTitle>
            <TableHolder>
              <TableSubtitle>Wells Fargo Championship</TableSubtitle>
              <PlayerTable
                single
                titles={PLAYER_SCORE_TITLE}
                list={playerScore}
              />
            </TableHolder>
            <TableHolder>
              <TableSubtitle>Wells Fargo Championship</TableSubtitle>
              <PlayerTable
                single
                titles={PLAYER_SCORE_TITLE}
                list={playerScore}
              />
            </TableHolder>
            <TableHolder>
              <TableSubtitle>Wells Fargo Championship</TableSubtitle>
              <PlayerTable
                single
                titles={PLAYER_SCORE_TITLE}
                list={playerScore}
              />
            </TableHolder>
          </Wrapper>
          */}
        </MobileOnly>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  ranking: state.golf.ranking,
  playerStats: state.golf.playerStats,
  playerTourData: state.golf.playerTourData
});

const mapDispatchToProps = dispatch =>
  bindActionCreators(
    {
      loadPlayerRankings,
      loadPlayerStats,
      loadPlayerTournamentData
    },
    dispatch
  );

export default connect(mapStateToProps, mapDispatchToProps)(Player);
