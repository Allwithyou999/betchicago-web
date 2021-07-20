import React from 'react';
import styled from 'styled-components';

import { ExcerptIcon } from './Icons';
import media from './Media';
import { MAX_WIDTH, THEME_COLORS } from '../../modules/styles';

const Wrapper = styled.div`
  padding: 20px;
  background: ${THEME_COLORS.BRAND};
  color: white;

  ${media.desktop} {
    padding: 15px 30px 15px 20px;
  }
`

const ContentHolder = styled.div`
  max-width: ${MAX_WIDTH}px;
  margin: auto;
  display: flex;
  justify-content: space-between;

  ${media.desktop} {
    align-items: center;
  }
`

const Excerpt = styled.div`
  display: inline-block;
  cursor: pointer;
  height: 100%;
`

const H2 = styled.h2`
  line-height: 28px;
  margin-bottom: 8px;
`

const H6 = styled.h6`
  margin-bottom: 3px;
  opacity: 0.8;
`

const Content = styled.div`
  flex: 1 0 1px;

  ${media.desktop} {
    display: flex;
    flex-flow: row wrap;
    align-items: center;

    h2, h6 {
      margin: 0 20px 0 0;
    }
  }
`

function LeaderboardTitle(props) {
  const { data, onExpand } = props;

  return (
    <Wrapper>
      <ContentHolder>
        <Content>
          <H2>{data.title}</H2>
          <H6>{data.location}</H6>
          <H6>{data.date}</H6>
        </Content>
        <Excerpt onClick={onExpand}><ExcerptIcon color="white" /></Excerpt>
      </ContentHolder>
    </Wrapper>
  );
}

export default LeaderboardTitle;
