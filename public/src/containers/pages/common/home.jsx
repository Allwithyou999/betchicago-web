import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import styled from 'styled-components';

import { Article, ArticleMainBrief, ArticleItem, ArticleBar } from '../../../containers/components/articles';
import media from '../../../containers/components/Media';
import ContentPromo from '../../../containers/components/ContentPromo';
import Page, { MainContent, SidebarLeft, SidebarRight, TabletOnly, MobileOnly } from '../../../containers/components/Layout';
import SidebarWidget from '../../../containers/components/SidebarWidget';
import TrendingStories from '../../../containers/components/TrendingStories';
import ScoreBox from '../../../containers/components/baseball/ScoreBox';
import Loading from '../../../containers/components/Loading';
import { ArrowRightIcon } from '../../../containers/components/Icons';
import { BoardLink } from '../../../containers/components/Common';

import { loadScoreboardData, loadTeamSlugs } from '../../../apis/mlb';
import { getTrendingStories, getHeadlineList, getArticleList } from '../../../modules/local-service';
import { STATUS } from '../../../modules/constants/common';
import { formatDateFull } from '../../../modules/utilities/formatter';
import { THEME_COLORS } from '../../../modules/styles';

import { db } from '../../../apis/firebase';

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

const Link = styled.a``;

const MoreButton = styled.button`
  padding: 10px;
  font-family: 'Roboto';
`;

const MoreWrapper = styled.div`
  text-align: center;
`;

class CommonHome extends Component {
  constructor(props) {
    super(props);
    this.moreRecords = this.moreRecords.bind(this);
    this.newsList = [];
    this.loading = false;

    if (window.cApplicationLocal) {
      this.newsList = getArticleList();
    }
  }

  componentDidMount() {
    if (window.cApplicationLocal.__fetchAPArticles) {
      window.cApplicationLocal
        .__fetchAPArticles(db, 'sports')
        .then(articles => {
          this.apArticles = articles;
          return this.forceUpdate();
        })
        .catch(e => {
          console.log('failed to load ap articles', e);
        });
    }

    this.props.loadTeamSlugs();
    // this.props.loadScoreboardData(formatDateFull(new Date()));
  }

  moreRecords() {
    this.loading = true;
    this.forceUpdate();
    let filter = '';

    window.cApplicationLocal.getArticlePage(filter)
      .then(result => {
        let pRecs = window.cApplicationLocal.convertRestToLocal(result.records);
        this.newsList = this.newsList.concat(pRecs);
        this.loading = false;
        this.forceUpdate();
      });
  }

  generateScoreboard = () => {
    const { scoreboard, slugs } = this.props;
    const scoreList = [];
    let chiList = [], bosList = [];
    if (!scoreboard) return [];
    if (!scoreboard.league) return [];
    if (!scoreboard.league.games) return [];

    for (let i = 0; i < scoreboard.league.games.length; i ++) {
      try {
        if (scoreboard.league.games[i].game.home.market.toLowerCase() === 'chicago' || scoreboard.league.games[i].game.away.market.toLowerCase() === 'chicago') {
          chiList.push(scoreboard.league.games[i]);
          scoreboard.league.games.splice(i, 1);
          i --;
        } else if (scoreboard.league.games[i].game.home.market.toLowerCase() === 'boston' || scoreboard.league.games[i].game.away.market.toLowerCase() === 'boston') {
          bosList.push(scoreboard.league.games[i]);
          scoreboard.league.games.splice(i, 1);
          i --;
        }
      } catch (e) {
        console.log('mlb home', e);
      }

    }

    let games = [...chiList, ...bosList, ...scoreboard.league.games];

    games.sort((a, b) => {
      if (new Date(a.game.scheduled) > new Date(b.game.scheduled)) return 1;
      if (new Date(a.game.scheduled) < new Date(b.game.scheduled)) return -1;
      return 0;
    });

    games.forEach((score, index) => {
      if (new Date(score.game.scheduled).getDate() === new Date().getDate()) {
        scoreList.push(<ScoreBox score={score} slugs={slugs} key={`score-${index}`} />);
      }
    });
    return scoreList;
  }

  render() {
    const { loadingScoreboard, loadingSlugs } = this.props;
    const trending = getTrendingStories();
    let articles = getHeadlineList();

    let mainArticle = articles[0];
    let headlineList = [];
    let articleList = [];

    headlineList = articles.slice(1, 4);
    let filler = articles.slice(4, 5000);
    filler = filler.concat(this.newsList);
    articleList = filler;
    
    let apStories = [];

    if (this.apArticles) {
      apStories = window.cApplicationLocal.__processAPArticlesToNormal(this.apArticles);
    }

    return (
      <div>
        <TabletOnly>
          <Page>
            {/* <SidebarLeft>
              {(loadingSlugs === STATUS.REQUEST || loadingScoreboard === STATUS.REQUEST) ? (
                <Loading />
              ) : (
                <SidebarWidget title="LATEST SCORES">
                  {this.generateScoreboard()}
                  <BoardLink left>
                    <Link href={`/mlb-betting/scores`}>FULL SCOREBOARD</Link>
                    <ArrowRightIcon color={`${THEME_COLORS.BLUE}`} />
                  </BoardLink>
                </SidebarWidget>
              )}
            </SidebarLeft> */}
            <MainContent hasRight>
              <Wrapper>
                <ArticleMainBrief article={mainArticle} />
                <ArticleBar articles={headlineList} />
                <Divider />
                <ArticleItemWithImage>
                  {articleList.map((article, index) => (
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
              <SidebarWidget title="TRENDING STORIES">
                <TrendingStories stories={trending} />
              </SidebarWidget>
              <SidebarWidget title="FROM THE AP">
                <TrendingStories stories={apStories} />
              </SidebarWidget>
              <SidebarWidget>
                <ContentPromo />
              </SidebarWidget>
            </SidebarRight>
          </Page>
        </TabletOnly>

        <MobileOnly>
          <Article article={mainArticle} />
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
            {articleList.map((article, index) => (
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
  scoreboard: state.mlb.scoreboard,
  loadingScoreboard: state.mlb.loading.scoreboard,
  slugs: state.mlb.slugs,
  loadingSlugs: state.mlb.loading.slugs,
});

const mapDispatchToProps = dispatch =>
  bindActionCreators(
    {
      loadScoreboardData,
      loadTeamSlugs,
    },
    dispatch
  );

export default connect(mapStateToProps, mapDispatchToProps)(CommonHome);
