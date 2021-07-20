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

class APNews extends Component {
  componentDidMount() {
    let parts = window.location.href.split('/');
    let tag = parts[parts.length - 1];
    if (tag === 'playernews' || tag === '') tag = 'sports';
    if (!tag) tag = '';
    tag = tag.toLowerCase().replace(/[[\]\-{}"'()*+? .\\^$|]/g, '');

    let pageLen = 20;
    db()
      .ref(`apArticleStore/skinny/byTag/${tag}`)
      .orderByValue()
      .limitToLast(pageLen)
      .once('value')
      .then(result => {
        this.resultIds = result.val();

        let promises = [];
        for (let id in this.resultIds)
          promises.push(
            db()
              .ref(`apArticleStore/skinny/smallById/${id}`)
              .once('value')
          );

        return Promise.all(promises);
      })
      .then(rawResultList => {
        let articles = [];
        let c = 0;
        let resultList = [];
        for (let id in this.resultIds) {
          resultList[c] = rawResultList[c].val();
          if (resultList[c]) {
            resultList[c].id = id;
            articles.push(resultList[c]);
          }
          c++;
        }
        articles = articles.sort((a, b) => {
          if (a.editDate > b.editDate) return -1;
          if (a.editDate < b.editDate) return 1;
          return 0;
        });
        this.apArticles = articles;

        return this.forceUpdate();
      })
      .catch(e => {
        console.log('failed to load ap news', e);
      });
  }
  render() {
    let trending = [];
    if (window.cApplicationLocal) {
      trending = window.cApplicationLocal.trending;
    }

    let articleList = [];
    if (this.apArticles) {
      for (let c = 0, l = this.apArticles.length; c < l; c++) {
        if (!this.apArticles[c].apcmSlugLine) continue;
        let href = this.apArticles[c].apcmSlugLine
          .toLowerCase()
          .replace(/[[\]{}"'()*+? .\\^$|]/g, '');
        let article = this.apArticles[c];
        let image = '';
        let imageAlt = '';

        if (article.mainMedia) {
          if (article.mainMedia.refs) {
            let imageId = article.mainMedia.refs[1].id.split(':')[1];
            image = `https://www.googleapis.com/download/storage/v1/b/bet-chicago.appspot.com/o/apimages%2F${
              article.id
            }-${imageId}.jpg?alt=media`;

            imageAlt = article.mainMedia.refs[1]['alternate-text'];
          }
        }

        articleList.push({
          headline: this.apArticles[c].apcmHeadLine,
          id: this.apArticles[c].id,
          editDate: this.apArticles[c].editDate,
          url: href,
          authors: [
            {
              fullname: 'AP',
              title: 'AP'
            }
          ],
          image,
          imageLink: image,
          imageAlt,
          summary:
            this.apArticles[c].summary
              .split(' ')
              .splice(0, 50)
              .join(' ') + '...',
          href,
          title: this.apArticles[c].apcmHeadLine
        });
      }
    }

    return (
      <div>
        <Page>
          <MainContent hasRight>
            <Wrapper>
              <Title>AP News</Title>
              {articleList.map((news, index) => (
                <ArticleItem key={index} article={news} />
              ))}
            </Wrapper>
          </MainContent>
          <SidebarRight>
            <SidebarWidget title="TRENDING STORIES">
              <TrendingStories stories={trending} />
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

export default APNews;
