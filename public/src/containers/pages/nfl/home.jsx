import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import styled from 'styled-components';

import { Article, ArticleMainBrief, ArticleItem } from '../../../containers/components/articles';
import { ArrowRightIcon } from '../../../containers/components/Icons';
import ContentPromo from '../../../containers/components/ContentPromo';
import { BoardLink } from '../../../containers/components/Common';
import Page, {
  MainContent,
  SidebarLeft,
  SidebarRight,
  TabletOnly,
  MobileOnly
} from '../../../containers/components/Layout';
import SidebarWidget from '../../../containers/components/SidebarWidget';
import TrendingStories from '../../../containers/components/TrendingStories';
import Loading from '../../../containers/components/Loading';
import ScoreBox from '../../../containers/components/baseball/ScoreBox';
import media from '../../../containers/components/Media';

import { THEME_COLORS } from '../../../modules/styles';
import { } from '../../../modules/utilities/formatter';
import { formatDateFull } from '../../../modules/utilities/formatter';
import { loadScoreboardData, loadTeamSlugs } from '../../../apis/mlb';
import { STATUS } from '../../../modules/constants/common';

import {
  getTrendingStories,
  getHeadlineList,
  getLeagueList
} from '../../../modules/local-service';


export const Wrapper = styled.div``;

export const ArticleItemWithImage = styled.div`
  padding: 20px;

  ${media.tablet} {
    padding: 0;
  }
`;

export const Divider = styled.div`
  border-top: 1px solid #dadae2;
  margin-bottom: 20px;
`;

export const Link = styled.a``;

export const PlayerLink = styled.a`
  display: inline-block;
  color: ${THEME_COLORS.BLUE};
  font-size: 13px;
  line-height: 15px;
  text-decoration: none;
  outline: none;
`;

export const TeetimeComma = styled.span`
  display: inline-block;
  color: ${THEME_COLORS.BLUE};
  font-size: 13px;
  line-height: 15px;
  margin-right: 3px;
`;

export const Subtitle = styled.h6`
  margin-bottom: 17px;
`;

const MoreButton = styled.button`
  padding: 10px;
  font-family: 'Roboto';
`;

const MoreWrapper = styled.div`
  text-align: center;
`;

class NFLHome extends Component {
  constructor(props) {
    super(props);
    this.moreRecords = this.moreRecords.bind(this);
    this.newsList = [];
    this.loading = false;

    if (window.cApplicationLocal) {
      this.newsList = getLeagueList();
    }
  }

  componentDidMount() {
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
    const stories = getTrendingStories();
    const articles = getHeadlineList();

    const mainArticle = articles[0];
    const headlineList = articles.slice(1, 70);

    const { loadingScoreboard, loadingSlugs } = this.props;

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
                    <Link href={`/nfl-betting/scores`}>FULL SCOREBOARD</Link>
                    <ArrowRightIcon color={`${THEME_COLORS.BLUE}`} />
                  </BoardLink>
                </SidebarWidget>
              )}
            </SidebarLeft> */}

            <MainContent hasRight>
              <Wrapper>
                <ArticleMainBrief article={mainArticle} tag="NFL" />
                <Divider />
                <ArticleItemWithImage>
                  {headlineList.map((article, index) => (
                    <ArticleItem article={article} key={'headline' + index} />
                  ))}
                </ArticleItemWithImage>
                <Divider />
                <ArticleItemWithImage>
                  {this.newsList.map((article, index) => (
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
                <TrendingStories stories={stories} />
              </SidebarWidget>
              <SidebarWidget>
                <ContentPromo />
              </SidebarWidget>
            </SidebarRight>
          </Page>
        </TabletOnly>

        <MobileOnly>
          <Article article={mainArticle} />
          <ArticleItemWithImage>
            <Divider />
            {articles
              .slice(1, 4)
              .map((article, index) => (
                <ArticleItem article={article} key={index} />
              ))}
            <Divider />
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
});

const mapDispatchToProps = dispatch =>
  bindActionCreators(
    {
      loadScoreboardData,
    },
    dispatch
  );

export default connect(mapStateToProps, mapDispatchToProps)(NFLHome);
