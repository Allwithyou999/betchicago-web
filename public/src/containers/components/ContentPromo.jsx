import React, { Component } from 'react';
import styled from 'styled-components';

const Wrapper = styled.div`
  color: #666666;

  h1 {
    text-align: center;
    padding-top: 50px;
    color: white;
    font-size: 19px;
    line-height: 23px;
    font-weight: 400;
    height: 210px;
  }

  p {
    margin-top: 15px;
    font-size: 13px;
    font-weight: 600;
  }

  img {
    width: 100%;
    height: auto;
  }
`

const AdBar = styled.img`
  margin-top: 20px;
`

class ContentPromo extends Component {
  render() {
    if (!window.cApplicationLocal.rightSidebarWidget) return null;

    return (
      <Wrapper>
        <div
          dangerouslySetInnerHTML={{
            __html: window.cApplicationLocal.rightSidebarWidget
          }}
        />
        <a href="https://itunes.apple.com/us/app/betchicago/id1404462108?mt=8">
          <AdBar src="/images/adbar.jpg" alt="Ad Image" />
        </a>
      </Wrapper>
    )
  }
}

export default ContentPromo;
