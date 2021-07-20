import React, { Component } from 'react';
import styled from 'styled-components';

import SidebarWidget from '../../../containers/components/SidebarWidget';
import Page, { MainContent, SidebarRight } from '../../../containers/components/Layout';
import ContentPromo from '../../../containers/components/ContentPromo';
import TrendingStories from '../../../containers/components/TrendingStories';
import { ArticleItem } from '../../../containers/components/articles';

import { db } from '../../../apis/firebase';

const Wrapper = styled.div``;

const Title = styled.h1`
  margin-bottom: 40px;
`;

class MixedNews extends Component {
  componentDidMount() {
    let parts = window.location.href.split('/');
    let tag = parts[parts.length - 1];
    if (tag === 'playernews' || tag === '') tag = 'sports';
    if (!tag) tag = '';

    if (window.cApplicationLocal.pageSection === 'news') {
      tag = window.cApplicationLocal.pageLeague;
    }

    if (window.cApplicationLocal.componentSlugData)
      if (window.cApplicationLocal.componentSlugData.trending) {
        this.trending = true;
        return this.forceUpdate();
      }

    tag = tag.replace(/betting/g, '');
    tag = tag.replace(/odds/g, '');
    tag = tag.replace(/picks/g, '');
    tag = tag.toLowerCase().replace(/[[\]\-{}"'()*+? .\\^$|]/g, '');

    if (tag === 'nba') tag = 'nationalbasketballassociation';
    if (tag === 'nfl') tag = 'nationalfootballleague';
    if (tag === 'nhl') tag = 'nationalhockeyleague';
    if (tag === 'mlb') tag = 'majorleaguebaseball';
    if (tag === 'ncaafb') tag = 'collegefootball';
    if (tag === 'ncaabasketball') tag = 'menscollegebasketball';
    if (tag === 'mlballstargame') tag = 'mlball-stargame';
    if (tag === 'whitesox') tag = 'chicagowhitesox';
    if (tag === 'bears') tag = 'chicagobears';
    if (tag === 'cubs') tag = 'chicagocubs';
    if (tag === 'worldcup2018') tag = 'fifaworldcup';

    if (window.cApplicationLocal.__fetchAPArticles) {
      window.cApplicationLocal
        .__fetchAPArticles(db, tag)
        .then(articles => {
          this.apArticles = articles;
          return this.forceUpdate();
        })
        .catch(e => {
          console.log('failed to load ap articles', e);
        });
    }
  }
  render() {
    let trending = [];
    if (window.cApplicationLocal) {
      trending = window.cApplicationLocal.trending;
    }

    let articleList = [];
    let title = "News";
    if (this.trending) {
      articleList = window.cApplicationLocal.trending;
      title = "Trending Stories";
    }

    if (this.apArticles) {
      let apL = window.cApplicationLocal.__processAPArticlesToNormal(
        this.apArticles
      );
      articleList = window.cApplicationLocal.league.concat(apL);
    }

    return (
      <div>
        <Page>
          <MainContent hasRight>
            <Wrapper>
              <Title>{title}</Title>
              {articleList.map((news, index) => (
                <ArticleItem key={index} article={news} />
              ))}
            </Wrapper>
          </MainContent>
          <SidebarRight>
            { this.trending !== true && (
              <SidebarWidget title="TRENDING STORIES">
                <TrendingStories stories={trending} />
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

export default MixedNews;
