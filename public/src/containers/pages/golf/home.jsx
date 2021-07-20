import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import styled from 'styled-components';

import { Article, ArticleMainBrief, ArticleItem } from '../../../containers/components/articles';
import media from '../../../containers/components/Media';
import PlayerTable from '../../../containers/components/players/PlayerTable';
import { TableTitle, BoardLink } from '../../../containers/components/Common';
import { ArrowRightIcon } from '../../../containers/components/Icons';
// import FavPlayers from 'containers/components/players/FavPlayers';
import ContentPromo from '../../../containers/components/ContentPromo';
import Loading from '../../../containers/components/Loading';
import Page, { MainContent, SidebarLeft, SidebarRight, TabletOnly, MobileOnly } from '../../../containers/components/Layout';
import SidebarWidget from '../../../containers/components/SidebarWidget';

import { formatLeaderboardSummary, formatTime } from '../../../modules/utilities/formatter';
import { getHeadlineList, getLeagueList } from '../../../modules/local-service';
import { THEME_COLORS } from '../../../modules/styles';
import { LEADERBOARD_SUMMARY_TITLE, PLAYER_TEATIME_TITLE, ODDS_HOME_TITLE } from '../../../modules/constants/golf';

import { loadCurrentTournament, loadCurrentTeetimeList, loadSchedule, loadOdds } from '../../../apis/golf';

const Wrapper = styled.div``;

const ArticleItemWithImage = styled.div`
  padding: 20px;

  ${media.tablet} {
    padding: 0;
  }
`;

const Divider = styled.div`
  border-top: 1px solid #dadae2;
  margin-bottom: 20px;
`;

const SectionDivider = styled.div`
  height: 20px;
  background-color: #eaeaeb;
  border-top: 1px solid #c8c8c8;
  border-bottom: 1px solid #c8c8c8;
`;

const Leaderboard = styled.div`
  padding: 0 20px 20px;
  display: none;
`;

const Link = styled.a``;

const PlayerLink = styled.a`
  display: inline-block;
  color: ${THEME_COLORS.BLUE};
  font-size: 13px;
  line-height: 15px;
  text-decoration: none;
  outline: none;
`;

const TeetimeComma = styled.span`
  display: inline-block;
  color: ${THEME_COLORS.BLUE};
  font-size: 13px;
  line-height: 15px;
  margin-right: 3px;
`;

const Subtitle = styled.h6`
  margin-bottom: 17px;
`;

const MoreButton = styled.button`
  padding: 10px;
  font-family: 'Roboto';
`;

const MoreWrapper = styled.div`
  text-align: center;
`;

const formatTeeTime = players => {
  const teelist = [];
  if (!players)
    return teelist;
  for (let i = 0; i < players.length; i++) {
    const player = players[i];
    teelist.push(
      <PlayerLink key={`player-${i}`} href={`golf-odds/player/${player.id}`}>
        {player.first_name.substr(0, 1) + '. ' + player.last_name}
      </PlayerLink>
    );
    if (i !== players.length - 1) {
      teelist.push(<TeetimeComma key={`pc-${i}`}>, </TeetimeComma>);
    }
  }

  return teelist;
};

class GolfHome extends Component {
  constructor(props) {
    super(props);

    this.state = {
      tourName: ''
    }
    this.moreRecords = this.moreRecords.bind(this);
    this.newsList = [];
    this.loading = false;

    if (window.cApplicationLocal) {
      this.newsList = getLeagueList();
    }
  }

  componentDidMount() {
    this.props.loadCurrentTournament();
    this.props.loadSchedule();
    // this.props.loadOdds();
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.leaderboard !== nextProps.leaderboard || this.props.schedule !== nextProps.schedule) {
      if (nextProps.leaderboard && nextProps.leaderboard.summary && nextProps.schedule) {
        const { currentTourId, schedule } = nextProps;
        const summary = nextProps.leaderboard.summary;

        //determine the upcoming teetime
        //TODO: reconsider teetime logic
        let tourId;
        let round = 1;
        if (new Date().getDay() > 3) {
          tourId = currentTourId;
          round = new Date().getDay() - 3;
        } else if (new Date().getDay() === 0) {
          tourId = currentTourId;
          round = 4;
        } else {
          let nextSchedules = schedule.tournaments
            .filter(s => new Date(s.start_date).getTime() > new Date().getTime())
            .sort((a, b) => new Date(a.start_date).getTime() - new Date(b.start_date).getTime())[0];

          if (nextSchedules) {
            tourId = nextSchedules.id;
          }
        }

        this.props.loadCurrentTeetimeList(tourId, round);

        //Get current week's tournament name
        if (summary.status !== 'closed') {
          this.setState({ tourName: summary.name })
        } else {
          let nextSchedules = schedule.tournaments
            .filter(s => new Date(s.start_date).getTime() > new Date().getTime())
            .sort((a, b) => new Date(a.start_date).getTime() - new Date(b.start_date).getTime())[0];

          if (nextSchedules) {
            this.setState({ tourName: nextSchedules.name })
          }
        }
      }
    }
  }
  testOddsNameForMatch(oddName, tourName) {
    oddName = oddName.toLowerCase();
    oddName = oddName.replace('2018', '');
    oddName = oddName.replace('2019', '');
    oddName = oddName.replace('2020', '');
    oddName = oddName.replace('2021', '');
    oddName = oddName.replace('2022', '');
    oddName = oddName.replace('classic', '');
    oddName = oddName.replace('the', '');
    oddName = oddName.replace('winner', '');
    oddName = oddName.replace('world', '');
    oddName = oddName.replace('championships', '');
    oddName = oddName.replace('golf', '');
    oddName = oddName.replace('us ', '');
    oddName = oddName.replace('invitational', '');
    oddName = oddName.replace('wgc', '');
    oddName = oddName.replace(/[[\]\- {}()*+?.\\^$|]/g, '');

    tourName = tourName.toLowerCase();
    tourName = tourName.replace(/[[\]\- {}()*+?.\\^$|]/g, '');

    return tourName.indexOf(oddName) !== -1;
  }
  moreRecords() {
    this.loading = true;
    this.forceUpdate();
    let filter = 'section:' + window.cApplicationLocal.pageLeagueID;

    window.cApplicationLocal.getArticlePage(filter)
      .then(result => {
        let pRecs = window.cApplicationLocal.convertRestToLocal(result.records);
        this.newsList = this.newsList.concat(pRecs);
        this.loading = false;
        this.forceUpdate();
      });
  }
  render() {
    let articles = getHeadlineList();

    const { loading, teetime, leaderboard, odds } = this.props;
    const { tourName } = this.state;

    const oddList = [];
    if (odds && tourName) {
      odds.forEach(odd => {
        if ((oddList.length === 0) && this.testOddsNameForMatch(odd.name, tourName)) {

          let compCounter = 0;
          for (let c = 0, l = odd.competitors.length; c < l; c++) {
            if (odd.competitors[c].books[0].odds) {
              compCounter++;
              oddList.push({
                name: odd.competitors[c].name,
                odds: odd.competitors[c].books[0].odds
              });

              if (compCounter >= 10)
                break;
            }
          }
        }
      })
    }

    let mainArticle = articles[0];
    let headlineList = [];
    let articleList = [];

    headlineList = articles.slice(1, 50);
    articleList = this.newsList;

    const headlineIdList = headlineList.map(article => article.id);
    const filteredList = articleList.filter(article => headlineIdList.indexOf(article.id) === -1);

    let leaderboardSummary = [];

    if (leaderboard) {
      leaderboardSummary = formatLeaderboardSummary(leaderboard, 10);
      if (!leaderboardSummary) leaderboardSummary = [];
    }

    let teetimeList = [];
    let pairings = [];
    if (teetime) {
      for (let i in teetime) {
        pairings.push(teetime[i]);
      }
    }

    teetimeList = pairings.map((pair, index) => {
      const playerPair = (
        <div key={`tee-player-${index}`}>{pair.players && formatTeeTime(pair.players)}</div>
      );

      return {
        players: playerPair,
        teetime: formatTime(new Date(pair.tee_time))
      };
    });

    if (leaderboard && !leaderboard.summary) leaderboard.summary = {};

    return (
      <div>
        <TabletOnly>
          <Page>
            {/* <SidebarLeft>
              <SidebarWidget title={`LATEST ODDS`}>
                {!odds ? (
                  <Loading />
                ) : (
                  <div>
                    <TableTitle noTop>{tourName}</TableTitle>
                    <PlayerTable
                      titles={ODDS_HOME_TITLE}
                      list={oddList}
                      tableSmall
                    />
                    <BoardLink left small>
                      <Link href={`/golf-odds/odds`}>FULL ODDS</Link>
                      <ArrowRightIcon color={`${THEME_COLORS.BLUE}`} />
                    </BoardLink>
                  </div>
                )}
              </SidebarWidget> */}

              {/* <Divider /> */}
              {/* <SidebarWidget title="MY FAVORITE PLAYERS">
                <FavPlayers profileOnly />
              </SidebarWidget> */}
            {/* </SidebarLeft> */}

            <MainContent hasRight>
              <Wrapper>
                <ArticleMainBrief article={mainArticle} tag="GOLF" />
                <ArticleItemWithImage>
                  {headlineList.map((article, index) => (
                    <ArticleItem article={article} key={'headline' + index} />
                  ))}
                </ArticleItemWithImage>
                <Divider />
                <ArticleItemWithImage>
                  {filteredList.map((article, index) => (
                    <ArticleItem
                      article={article}
                      key={'article' + index}
                      noImage
                    />
                  ))}
                </ArticleItemWithImage>
              </Wrapper>
            </MainContent>
            <SidebarRight>
              {/* <SidebarWidget title="LEADERBOARD">
                {!leaderboard ? (
                  <Loading />
                ) : (
                  <div>
                    {!!leaderboard && (
                      <TableTitle noTop>
                        {leaderboard.summary.name}
                      </TableTitle>
                    )}
                    <PlayerTable
                      titles={LEADERBOARD_SUMMARY_TITLE}
                      list={leaderboardSummary}
                      tableSmall
                    />
                    <BoardLink left small>
                      <Link href={`/golf-odds/leaderboard`}>
                        FULL LEADERBOARD
                      </Link>
                      <ArrowRightIcon color={`${THEME_COLORS.BLUE}`} />
                    </BoardLink>
                  </div>
                )}
              </SidebarWidget>
              <SidebarWidget title="UPCOMING TEE TIMES">
                {!teetime ? (
                  <Loading />
                ) : (
                  <div>
                    {!teetimeList.length ? (
                      <div>No times available</div>
                    ) : (
                      <PlayerTable
                        titles={PLAYER_TEATIME_TITLE}
                        list={teetimeList}
                        tableSmall
                      />
                    )}
                  </div>
                )}
              </SidebarWidget> */}
              <SidebarWidget>
                <ContentPromo />
              </SidebarWidget>
            </SidebarRight>
          </Page>
        </TabletOnly>

        <MobileOnly>
          <Article article={mainArticle} />
          <Leaderboard>
            <Divider />
            {!!leaderboard && (
              <div>
                <h4>{leaderboard.summary.name}</h4>
                <Subtitle>Leaderboard</Subtitle>
              </div>
            )}
            <PlayerTable
              titles={LEADERBOARD_SUMMARY_TITLE}
              list={leaderboardSummary.slice(0, 5)}
              loading={loading}
              tableSmall
            />
            <BoardLink small>
              <Link href={`/golf-odds/leaderboard`}>FULL LEADERBOARD</Link>
              <ArrowRightIcon color={`${THEME_COLORS.BLUE}`} />
            </BoardLink>
          </Leaderboard>

          <SectionDivider />
          {articles.length > 1 && <Article article={articles[1]} />}
          {articles.length > 2 && (
            <ArticleItemWithImage>
              {articles.slice(2, 5).map((article, index) => {
                if (article) {
                  return <ArticleItem article={article} key={index} />;
                }

                return '';
              })}
              <Divider />
            </ArticleItemWithImage>
          )}
          <ArticleItemWithImage>
            {filteredList.map((article, index) => (
              <ArticleItem article={article} key={'article' + index} noImage />
            ))}
          </ArticleItemWithImage>
        </MobileOnly>

        <MoreWrapper>
          {!this.loading && (
            <MoreButton onClick={this.moreRecords}>Load more</MoreButton>
          )}
          {this.loading && (
            <span>Loading...</span>
          )}
        </MoreWrapper>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  leaderboard: state.golf.leaderboard,
  loading: state.golf.loading.leaderboard,
  currentTourId: state.golf.currentTourId,
  teetime: state.golf.currentTeetime,
  schedule: state.golf.schedule,
  odds: state.golf.odds,
});

const mapDispatchToProps = dispatch =>
  bindActionCreators(
    {
      loadCurrentTournament,
      loadCurrentTeetimeList,
      loadSchedule,
      loadOdds
    },
    dispatch
  );

export default connect(mapStateToProps, mapDispatchToProps)(GolfHome);
