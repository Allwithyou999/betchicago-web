import React, { Component } from 'react';
import Slider from 'react-slick';
import Wrapper from './styled';

class NewsCard extends Component {
  render() {
    const { news } = this.props;

    if (!news) {
      return null;
    }

    return (
      <Wrapper>
        <img src={news.img} />
        <div>
          <div className="title">{news.title}</div>
          <div className="description">{news.description}</div>
        </div>
      </Wrapper>
    );
  }
}

export default NewsCard;
