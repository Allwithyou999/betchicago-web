import React, { Component } from 'react';
import styled from 'styled-components';

import media from './Media';
import { MAX_WIDTH } from '../../modules/styles';

const SidebarLeftWrapper = styled.div`
  width: 18.18%;
  display: none;
  min-width: 180px;

  ${media.desktop} {
    display: block;
  }
`

const SidebarRightWrapper = styled.div`
  padding-top: 10px;
  width: 27.27%;
  display: none;
  min-width: 250px;
  max-width: 322px;

  ${media.tablet} {
    display: block;
  }
`

const ContentWrapper = styled.div`
  flex: 1 0 1px;
  width: 100%;

  ${props => props.align === 'center' && `
    text-align: center;
  `}

  ${media.tablet} {
    width: initial;

    ${props => props.left && `
      padding-left: 20px;
    `}

    ${props => props.right && `
      padding-right: 20px;
    `}
  }
`

const PageWrapper = styled.div`
  max-width: ${MAX_WIDTH + 40}px;
  margin: auto;
  padding: 20px;
  display: flex;
  flex-flow: row wrap;
`

export class SidebarLeft extends Component {
  render () {
    const { children } = this.props;

    return (
      <SidebarLeftWrapper>
        {children}
      </SidebarLeftWrapper>
    )
  }
}

export class SidebarRight extends Component {
  render() {
    const { children } = this.props;

    return (
      <SidebarRightWrapper>
        {children}
      </SidebarRightWrapper>
    )
  }
}

export class MainContent extends Component {
  render() {
    const { children, hasRight, hasLeft, align } = this.props;

    return (
      <ContentWrapper right={hasRight} left={hasLeft} align={align}>
        {children}
      </ContentWrapper>
    )
  }
}

export default class Page extends Component {
  render() {
    const { children } = this.props;

    return (
      <PageWrapper>
        {children}
      </PageWrapper>
    )
  }
}

export const TabletOnly = styled.div`
  display: none;

  ${media.tablet} {
    display: block;
  }
`

export const MobileOnly = styled.div`
  ${media.tablet} {
    display: none;
  }
`
