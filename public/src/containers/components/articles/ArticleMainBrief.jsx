import React from 'react';
import styled from 'styled-components';

import ArticleImage from './ArticleImage';
import { THEME_COLORS } from '../../../modules/styles';
import media from '../../../containers/components/Media';

const Wrapper = styled.div`
  margin-bottom: 20px;
`

const Title = styled.h1`
  padding: 10px 0 20px;
`

const ArticleLink = styled.a`
  text-decoration: none;
  color: ${THEME_COLORS.BLACK};
  display: flex;
`;

const Header = styled.div`
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;

  ${media.desktop} {
    bottom: 20px;
  }
`

const ImageHolder = styled.div`
  position: relative;
  width: 100%;
  min-height: 150px;
`

const H4 = styled.div`
  font-weight: 600;
  font-size: 14px;
  line-height: 18px;
  padding: 5px 10px;
  color: white;
  background: rgba(0, 0, 0, 0.75);

  ${media.tablet} {
    font-size: 20px;
    line-height: 28px;
    padding: 12px 20px;
  }

  ${media.desktop} {
    font-size: 29px;
    line-height: 34px;
  }
`

const Tag = styled.span`
  font-family: AvenirNextCondensed, sans-serif;
  font-weight: 500;
  font-size: 21px;
  line-height: 25px;
  padding: 4px 12px;
  background-color: ${THEME_COLORS.BRAND};
  color: white;
  display: inline-block;
`;

const Content = styled.h6`
  line-height: 22px;
  font-weight: 300;
  padding: 18px 10px 0;
`

function ArticleMainBrief(props) {
  const { article = {}, tag } = props;
  let imageLink = article.imageLink;

  return (
    <Wrapper>
      <Title>{window.cApplicationLocal.pageHeadline}</Title>
      <ArticleLink href={'/' + article.href}>
        <ImageHolder>
          <ArticleImage src={imageLink} alt={article.imageAlt} />
          {!tag && <Header>
            <Tag>{article.sectionName}</Tag>
            <H4>{article.title}</H4>
          </Header>}
        </ImageHolder>
      </ArticleLink>
      {!!article.articleSummary &&
        <Content>{article.articleSummary}</Content>
      }
    </Wrapper>
  );
}

export default ArticleMainBrief;
