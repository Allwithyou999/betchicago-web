import React from 'react';
import styled from 'styled-components';

import ArticleItem from './ArticleItem';
import media from '../../../containers/components/Media';
import { THEME_COLORS } from '../../../modules/styles';

const Wrapper = styled.div`
  margin-bottom: 20px;
  display: flex;
  justify-content: space-between;
`

const Spacing = styled.div`
  width: 20px;
`

const ArticleHolder = styled.div`
  width: 33.3333%;
  flex: 1 1 1px;
`

const ImageInner = styled.div`
  padding-bottom: ${136 / 209 * 100}%;
  position: relative;
`

const ImageContent = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: #C8C8C8;
  background-image: url(${props => props.background});
  background-size: cover;
  background-position: center center;
`;

const ItemLink = styled.a`
  text-decoration: none;
`;

const generateArticle = (article = {}) => {
  let imageLink = article.imageLink;
  if (imageLink.indexOf('?') === -1) {
    imageLink += '?h=300&w=400&fm=jpg&fit=fill';
  }

  return (
    <ArticleHolder>
      <ItemLink href={'/' + article.href}>
        <ImageInner>
          <ImageContent background={imageLink} />
        </ImageInner>
        <League>{article.sectionName || 'MLB'}</League>
        <Title>{article.title}</Title>
      </ItemLink>
    </ArticleHolder>
  );
}

const Title = styled.div`
  font-size: 17px;
  line-height: 28px;
  font-weight: 600;
  color: ${THEME_COLORS.BLACK};
  text-decoration: none;

  a {
    text-decoration: none;
    color: inherit;
  }
`

const League = styled.div`
  font-size: 11px;
  line-height: 13px;
  margin: 7px 0;
  color: #666666;
`

const Desktop = styled.div`
  display: none;

  ${media.tabletLg} {
    display: block;
  }
`

const Tablet = styled.div`
  display: block;

  ${media.tabletLg} {
    display: none;
  }
`

function ArticleBar(props) {
  const { articles = [] } = props;

  return (
    <div>
      <Desktop>
        <Wrapper>
          {articles[0] && (
            generateArticle(articles[0])
          )}
          <Spacing />
          {articles[1] && (
            generateArticle(articles[1])
          )}
          <Spacing />
          {articles[2] && (
            generateArticle(articles[2])
          )}
        </Wrapper>
      </Desktop>
      <Tablet>
        {articles.map((article, index) => (
          <ArticleItem article={article} key={'article' + index} />
        ))}
      </Tablet>
    </div>
  );
}

export default ArticleBar;
