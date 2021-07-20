import React, { Component } from 'react';
import Wrapper from './styled';

class TrendingStories extends Component {
  render() {
    let { stories, isArticle } = this.props;
    if (!stories) {
      stories = [];
    }
    if (isArticle) stories = stories.slice(0, 5);
    else stories = stories.slice(0, 8);
    return (
      <Wrapper>
        {stories.map((item, index) => (
          <li key={`trending-${index}`}>
            <a href={'/' + item.href}>{item.title}</a>
          </li>
        ))}
      </Wrapper>
    );
  }
}

export default TrendingStories;
