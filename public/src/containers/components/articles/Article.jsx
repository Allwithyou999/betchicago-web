import React from 'react';
import styled from 'styled-components';

import media from '../Media';
import ArticleImage from './ArticleImage';
import { THEME_COLORS } from '../../../modules/styles';

const ArticleLink = styled.a`
  text-decoration: none;
  color: ${THEME_COLORS.BLACK};
`;

const Content = styled.div`
  padding: 60px;

  ${props => props.top && `
    padding: 0 0 10px;

    ${media.tablet} {
      padding: 20px;
    }
  `}

  ${media.max.mobile} {
    padding: 20px;
  }
`

const ImageDescription = styled.div`
  font-family: 'AvenirNextCondensed', sans-serif;
  font-size: 9px;
  line-height: 12px;
  padding: 5px 20px 0 0;
  text-align: right;
`

const Tags = styled.div`
  font-size: 14px;
  line-height: 17px;
  color: #999999;
  font-weight: 400;
  margin-top: 5px;
`

const P = styled.p`
  margin-top: 20px;
`

const Title = styled.h1`
  font-size: 36px;
  line-height: 44px;
`

const DateDetail = styled.div`
  margin-top: 5px;
  font-size: 0.8em;
`;

function Article(props) {
  let { article, main } = props;
  if (!article) {
    article = {};
  }

  if (article.imageCaption)
    article.imageCaption = article.imageCaption.toUpperCase();

  let articleDateDisplay = '';
  if (article.updatedAt) {
    articleDateDisplay = new Date(article.updatedAt).toString();
    articleDateDisplay = articleDateDisplay.split('G')[0];

    if (window.moment) {
      let newDate = new Date(article.updatedAt).getTime();
      articleDateDisplay = window.moment(newDate).format('MMMM DD, YYYY - h:mmA ');

      let tz = (new Date()).toLocaleString('en', {timeZoneName:'short'}).split(' ').pop();
      articleDateDisplay += tz.toString();
    }
  }

  if (article.noDate)
    articleDateDisplay = '';

  let imageLink = article.imageLink;

  if (!imageLink)
    imageLink = '';
  if (!main) {
    if (imageLink.indexOf('?') === -1) {
      imageLink += '?h=300&w=400&fm=jpg&fit=fill';

      if (article.thumbnail)
        imageLink = article.thumbnail;
    }
  }

  return (
    <div>
      {main ? (
          <ArticleLink>
            <Content top>
              <Title>{article.title}</Title>
              <DateDetail>{articleDateDisplay}</DateDetail>
            </Content>
            {imageLink && (
              <ArticleImage src={imageLink} alt={article.imageAlt} />
            )}
            <ImageDescription>{article.imageCaption}</ImageDescription>
          </ArticleLink>
        ) : (
          <ArticleLink href={'/' + article.href}>
            <ArticleImage src={imageLink} alt={article.imageAlt} />
            <ImageDescription>{article.imageCaption}</ImageDescription>
            <Content>
              <h2>{article.title}</h2>
              <Tags>{article.sectionName}</Tags>
              <P>{article.summary}</P>
            </Content>
          </ArticleLink>
        )
      }
    </div>
  );
}

export default Article;
