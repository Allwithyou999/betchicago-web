import React, { Component } from 'react';
import styled from 'styled-components';

import SidebarWidget from '../../../containers/components/SidebarWidget';
import Page, { MainContent, SidebarRight } from '../../../containers/components/Layout';
import ContentPromo from '../../../containers/components/ContentPromo';
import TrendingStories from '../../../containers/components/TrendingStories';
import { ArticleItem } from '../../../containers/components/articles';

const Wrapper = styled.div``;

const Title = styled.h1`
  margin-bottom: 40px;
`;

const MoreButton = styled.button`
  padding: 10px;
  font-family: 'Roboto';
`;

class News extends Component {
  constructor(props) {
    super(props);
    this.moreRecords = this.moreRecords.bind(this);
    this.newsList = [];
    this.trending = [];
    this.loading = false;
    this.trendingFlag = false;

    if (window.cApplicationLocal.componentSlugData)
      if (window.cApplicationLocal.componentSlugData.trending)
        this.trendingFlag = true;

    if (window.cApplicationLocal) {
      this.trending = window.cApplicationLocal.trending;
      this.newsList = window.cApplicationLocal.league;

      if (this.trendingFlag)
        this.newsList = this.trending;
    }
  }
  componentDidMount() {}

  moreRecords() {
    this.loading = true;
    this.forceUpdate();
    let filter = 'section:' + window.cApplicationLocal.pageLeagueID;

    if (this.trendingFlag)
      filter = 'trending';

    window.cApplicationLocal.getArticlePage(filter)
      .then(result => {
        let pRecs = window.cApplicationLocal.convertRestToLocal(result.records);
        this.newsList = this.newsList.concat(pRecs);
        this.loading = false;
        this.forceUpdate();
      });
  }
  render() {
    let title = window.cApplicationLocal.pageHeadline || 'News';
    if (window.cApplicationLocal.pageType === 'anchorPage') {
      for (let i = 0; i < window.cApplicationLocal.anchorPages.length; i++) {
        if (window.location.href.indexOf(window.cApplicationLocal.anchorPages[i].href) !== -1) {
          title = window.cApplicationLocal.anchorPages[i].title;
        }
      }
    }

    return (
      <div>
        <Page>
          <MainContent hasRight>
            <Wrapper>
              <Title>{title}</Title>
              {this.newsList.map((news, index) => (
                <ArticleItem key={index} article={news} />
              ))}
              <div>
                {!this.loading && (
                  <MoreButton onClick={this.moreRecords}>Load more</MoreButton>
                )}
                {this.loading && (
                  <span>Loading...</span>
                )}
              </div>
            </Wrapper>
          </MainContent>
          <SidebarRight>
            {!this.trendingFlag && (
              <SidebarWidget title="TRENDING STORIES">
                <TrendingStories stories={this.trending} />
              </SidebarWidget>
            )}
            <SidebarWidget>
              <ContentPromo />
            </SidebarWidget>
          </SidebarRight>
        </Page>
      </div>
    );
  }
}

export default News;
