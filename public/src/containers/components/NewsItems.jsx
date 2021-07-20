import React, { Component } from 'react';
import styled from 'styled-components';

import media from './Media';

const Wrapper = styled.div`
  display: flex;
  margin-bottom: 30px;
`

const ImageHolder = styled.div`
  width: 100px;
  height: 100px;
  background: #C8C8C8;
  border: 1px solid #707070;

  ${media.desktop} {
    width: 180px;
    height: 125px;
  }

  ${media.desktop} {
    width: 210px;
    height: 150px;
  }

  img {
    max-width: 100%;
    max-height: 100%;
  }
`

const Content = styled.div`
  padding-left: 15px;
  flex: 1 0 1px;

  ${media.desktop} {
    padding-left: 30px;
  }
`

const Title = styled.h2`
  font-size: 17px;
  margin-bottom: 10px;

  a {
    color: ${THEME_COLORS.BLACK};
    text-decoration: none;
  }

  ${media.tablet} {
    font-size: 19px;
  }
`

const Tags = styled.div`
  font-size: 11px;
  line-height: 13px;
  color: ${THEME_COLORS.BRAND};
  font-weight: 400;
  margin-bottom: 15px;
`

const Excerpt = styled.h6`
  font-weight: 300;
  line-height: 22px;
  display: none;

  ${media.tablet} {
    display: block;
  }
`

class NewsItem extends Component {
  render() {
    return (
      <Wrapper>
        <ImageHolder>
          <img src={this.props.image} alt="News Thumb" />
        </ImageHolder>
        <Content>
          <Title><a href={this.props.href}>{this.props.title}</a></Title>
          <Tags>{this.props.tags}</Tags>
          <Excerpt>{this.props.summary}</Excerpt>
        </Content>
      </Wrapper>
    )
  }
}

export default NewsItem;
