import React, { Component } from 'react';
import styled from 'styled-components';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import PlayerTable from '../../../containers/components/players/PlayerTable';
import SidebarWidget from '../../../containers/components/SidebarWidget';
import Loading from '../../../containers/components/Loading';
import Page, { MainContent, SidebarRight, TabletOnly, MobileOnly } from '../../../containers/components/Layout';
import ContentPromo from '../../../containers/components/ContentPromo';
import TrendingStories from '../../../containers/components/TrendingStories';

import { formatDate, formatMoney } from '../../../modules/utilities/formatter';
import {
  RANKING_TITLE,
  RANKING_DESKTOP_TITLE,
  PLAYER_MONEY_LEADER_TITLE,
  PLAYER_FEDEX_POINT_LEADER_TITLE
} from '../../../modules/constants/golf';
import { getTrendingStories } from '../../../modules/local-service';

import { loadPlayerRankings, loadGolfLeaders } from '../../../apis/golf';

const Wrapper = styled.div``;

const Subtitle = styled.h6`
  margin-bottom: 28px;
`;

class Ranking extends Component {
  componentDidMount() {
    this.props.loadPlayerRankings();
    this.props.loadGolfLeaders();
  }

  render() {
    const { ranking, leaders } = this.props;

    let rankList = [],
        playerMoney = [],
        playerFedex = [];

    if (ranking) {
      rankList = ranking.players.map((rank, index) => ({
        pos: rank.rank,
        name: rank.first_name + ' ' + rank.last_name,
        events: rank.statistics.events_played,
        points: rank.statistics.points,
        link: `/golf-odds/player/${rank.id}`,
        average: rank.statistics.avg_points,
        lastWk: rank.prior_rank,
        lastYr: rank.last_year_rank,
        gained: rank.statistics.points_gained,
        lost: rank.statistics.points_lost
      }));
    }

    if (leaders) {
      playerMoney = Object.keys(leaders.earning).map((key, index) => {
        const rank = leaders.earning[key];
        return {
          pos: rank.statistics.earnings_rank,
          name: rank.first_name + ' ' + rank.last_name,
          earnings: '$' + formatMoney(rank.statistics.earnings),
          link: `/golf-odds/player/${rank.id}`
        }
      }).sort((a, b) => a.pos - b.pos);

      playerFedex = Object.keys(leaders.fedex).map((key, index) => {
        const rank = leaders.fedex[key];
        return {
          pos: rank.statistics.points_rank,
          name: rank.first_name + ' ' + rank.last_name,
          points: formatMoney(rank.statistics.points),
          link: `/golf-odds/player/${rank.id}`
        }
      }).sort((a, b) => a.pos - b.pos);
    }

    const stories = getTrendingStories();

    return (
      <div>
        <Page>
          <MainContent hasRight>
            {!!ranking ? (
              <Wrapper>
                <h1>{window.cApplicationLocal.pageHeadline ? window.cApplicationLocal.pageHeadline : ranking.name}</h1>
                <Subtitle>{`Last Update: ${formatDate(new Date(ranking.updated_at), 'mm dd, yyyy')}`}</Subtitle>
                <TabletOnly>
                  <PlayerTable titles={RANKING_DESKTOP_TITLE} list={rankList} />
                </TabletOnly>
                <MobileOnly>
                  <PlayerTable titles={RANKING_TITLE} list={rankList} />
                </MobileOnly>
              </Wrapper>
            ) : (
              <Loading />
            )}
          </MainContent>
          <SidebarRight>
            <SidebarWidget title="MONEY LEADERS">
              {!!leaders ? (
                <PlayerTable
                  titles={PLAYER_MONEY_LEADER_TITLE}
                  list={playerMoney}
                />
              ) : (
                <Loading />
              )}
            </SidebarWidget>
            <SidebarWidget title="FEDEX POINT LEADERS">
              {!!leaders ? (
                <PlayerTable
                  titles={PLAYER_FEDEX_POINT_LEADER_TITLE}
                  list={playerFedex}
                />
              ) : (
                <Loading />
              )}
            </SidebarWidget>
            <SidebarWidget title="TRENDING STORIES">
              <TrendingStories stories={stories} />
            </SidebarWidget>
            <SidebarWidget>
              <ContentPromo />
            </SidebarWidget>
          </SidebarRight>
        </Page>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  ranking: state.golf.ranking,
  leaders: state.golf.leaders,
  loading: state.golf.loading.ranking
});

const mapDispatchToProps = dispatch =>
  bindActionCreators(
    {
      loadPlayerRankings,
      loadGolfLeaders
    },
    dispatch
  );

export default connect(mapStateToProps, mapDispatchToProps)(Ranking);
