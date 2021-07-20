import React, { Component } from 'react';
import styled from 'styled-components';

const SubNav = styled.div`
  width: 580px;
  height: 285px;
  background: #F4F4F4;
  position: absolute;
  display: none;
  top: 40px;
  left: 0px;
  z-index: 500;
  padding: 15px;
  padding-left: 25px;
  color: #4E4E4E;
  > div:first-child {
    width: 210px;
    border-right: 1px solid #D7D7D7;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
  }
  div.story-wrapper {
    flex-direction: column;
    > div {
      padding-left: 20px;
    }
    > div:last-child{
      margin-top: 15px;
      flex-direction: column;
      > div {
        align-items: center;
      }
      > div:last-child {
        margin-top: 30px;
      }
      div div {
        flex-wrap: wrap;
        white-space: normal;
        padding-left: 10px;
        padding-right: 15px;
        line-height: 20px;
        font-family: 'Roboto', san-sarif;
        font-weight: 700;
        font-size: 18px;
      }
      img {
        width: 145px;
        height: 80px;
      }
    }
  }
`

const ArticleLink=styled.a`
  margin-bottom: 15px;
`

class HoverNav extends Component {
  render() {
    let { menu, articles } = this.props;

    return (
      <SubNav>
        <div>
          {menu.map((item, index) => {
            return <a href={item.href}>{item.text}</a>
          })}
        </div>
        <div className="story-wrapper">
          <div>Top Stories</div>
          <div>
            {articles.map((story, index) => {
              return (<ArticleLink href={`/${story.fields.pageUrl}`}>
                <div className={`story-${index}`}>
                  <img src={story.fields.featuredImage.fields.file.url} alt="Article" />
                  <div>{story.fields.headline}</div>
                </div>
              </ArticleLink>)
            })}
          </div>
        </div>
      </SubNav>
    );
  }
}

export default HoverNav;
