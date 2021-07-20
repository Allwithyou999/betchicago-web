import React, { Component } from 'react';
import styled from 'styled-components';

import SidebarWidget from '../../../containers/components/SidebarWidget';
import Page, { MainContent, SidebarRight } from '../../../containers/components/Layout';
import ContentPromo from '../../../containers/components/ContentPromo';
import TrendingStories from '../../../containers/components/TrendingStories';

const Wrapper = styled.div``;

class SRWidget extends Component {
  componentDidMount() {
    let mixin = {};
    let urlParams = new URLSearchParams(window.location.search);
    //    mixin.showOdds = 'true';
    if (this.data.seasonId) {
      if (urlParams.get('seasonId')) mixin.seasonId = urlParams.get('seasonId');
      else mixin.seasonId = this.data.seasonId;
    }
    if (this.data.matchId) {
      if (urlParams.get('matchId')) mixin.matchId = urlParams.get('matchId');
      else mixin.matchId = this.data.matchId;
    }
    if (this.data.tournamentId) {
      if (urlParams.get('tournamentId'))
        mixin.tournamentId = urlParams.get('tournamentId');
      else mixin.tournamentId = this.data.tournamentId;
    }
    if (this.data.uniqueTeamId) {
      if (urlParams.get('uniqueTeamId'))
        mixin.teamUid = urlParams.get('uniqueTeamId');
      else mixin.teamUid = this.data.uniqueTeamId;
    }

    mixin.onItemClick = (type, obj) => {
      console.log(type, obj);
      if (this.data.onClick) {
        if (obj[this.data.onClick.parameter])
          window.location.href = `${this.data.onClick.route}?${
            this.data.onClick.parameter
          }=${obj[this.data.onClick.parameter]}`;
      }
    };

    try {
      window.SIR('addWidget', '.sr-widget-wrapper', this.data.srwidget, mixin);
    } catch (e) {
      console.log('SR widget error', e);
    }
  }

  render() {
    let trending = [];
    this.data = {};
    if (window.cApplicationLocal) {
      trending = window.cApplicationLocal.trending;
      this.data = window.cApplicationLocal.patchSlugData;
    }

    return (
      <div>
        <Page>
          <MainContent hasRight>
            <Wrapper className="sr-widget-wrapper" />
          </MainContent>
          <SidebarRight>
            <SidebarWidget title="TRENDING STORIES">
              <TrendingStories stories={trending} />
            </SidebarWidget>
            <SidebarWidget>
              <ContentPromo />
            </SidebarWidget>
          </SidebarRight>
        </Page>
      </div>
    );
  }
}

export default SRWidget;
