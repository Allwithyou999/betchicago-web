import React from 'react';
import styled from 'styled-components';

import ArticleImage from './ArticleImage';
import { THEME_COLORS } from '../../../modules/styles';

const Wrapper = styled.div`
  font-size: 0;
  display: flex;
  margin-bottom: 20px;
`

const ArticleLink = styled.a`
  text-decoration: none;
  color: ${THEME_COLORS.BLACK};
  display: flex;
`;

const Content = styled.div`
  flex: 1 0 1px;
  padding-left: 15px;
  padding-top: 5px;
`

const H4 = styled.h2`
  line-height: 22px;
`

const Tags = styled.div`
  font-size: 13px;
  line-height: 15px;
  color: #666666;
  font-weight: 400;
  margin-top: 5px;
`


const ArticleBrief = ({ blog, ...props }) => (
  <Wrapper>
    <ArticleLink href={'/' + blog.href}>
      {blog.imageLink &&
        <ArticleImage src={blog.imageLink} alt={blog.imageAlt} w100 />
      }
      <Content>
        <H4>{blog.title}</H4>
        <Tags>{blog.sectionName}</Tags>
      </Content>
    </ArticleLink>
  </Wrapper>
);

export default ArticleBrief;
