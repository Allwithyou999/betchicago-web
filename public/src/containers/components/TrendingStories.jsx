import React from 'react';
import styled from 'styled-components';

const Story = styled.ul`
  font-size: 13px;
  line-height: 15px;
  font-weight: 600;
  list-style: none;
  padding-left: 0;
  margin: 0;

  li {
    position: relative;
    padding-left: 15px;

    a {
      color: #666;
      text-decoration: none;
    }

    &:before {
      content: '';
      position: absolute;
      width: 3px;
      height: 3px;
      border-radius: 50%;
      display: block;
      background: #666;
      left: 2px;
      top: 5px;
    }

    + li {
      margin-top: 15px;
    }
  }
`;

function TrendingStories(props) {
  let { stories, isArticle } = props;
  if (!stories) {
    stories = [];
  }
  if (isArticle)
    stories = stories.slice(0, 5);
  else
    stories = stories.slice(0, 8);

  return (
    <Story>
      {
        stories.map((item, index) => (
          <li key={`trending-${index}`}><a href={'/' + item.href}>{item.title}</a></li>
        ))
      }
    </Story>
  )
}

export default TrendingStories
