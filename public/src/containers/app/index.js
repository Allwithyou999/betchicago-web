import React, { Component } from 'react';
import { Switch, Route } from 'react-router-dom';
import { init as firebaseInit } from '../../apis/firebase';
import { withRouter } from 'react-router';
import styled from 'styled-components';

import CommonHome from '../pages/common/home';
import News from '../pages/common/news';
import APNews from '../pages/common/apnews';
import SRWidget from '../pages/common/srwidget';
import Article from '../pages/common/article';
// import MixedNews from '../pages/common/mixednews';
import ContactPage from '../pages/common/contactpage';

import Leaderboard from '../pages/golf/leaderboard';
import GolfHome from '../pages/golf/home';
import Odds from '../pages/golf/odds';
import Schedule from '../pages/golf/schedule';
import Ranking from '../pages/golf/ranking';
import Player from '../pages/golf/player';
import Navbar from '../../containers/components/Navbar';
// import SubNavbar from '../../containers/components/SubNavbar';
import Footer from '../../containers/components/Footer';

import NFLHome from '../pages/nfl/home.jsx';
import OddsSheetViewer from '../pages/common/oddssheetviewer.jsx';
import NFLSchedule from '../pages/nfl/schedule.jsx';
import NFLStandings from '../pages/nfl/standings.jsx';
import NFLPlayerStatsPage from '../pages/nfl/playerstats.jsx';

import NCAAMBHome from '../pages/ncaamb/home.jsx';
import NCAAMBSchedule from '../pages/ncaamb/Schedule';
import NCAAMBStandings from '../pages/ncaamb/Standings';
import NCAAMBRanking from '../pages/ncaamb/Rankings';
import NCAAMBFutures from '../pages/ncaamb/Futures';
// import NCAAMBPlayerStatsPage from '../pages/ncaamb/playerstats.jsx';
import NCAAMB from '../pages/ncaamb/routes';

import Teams from '../pages/baseball/teams';
import BaseballHome from '../pages/baseball/home';

import Golf from '../pages/golf/routes';
import Baseball from '../pages/baseball/routes';
import NBA from '../pages/nba/routes';
import NFL from '../pages/nfl/routes';

import UserRegistration from '../pages/user/registration';
import UserProfile from '../pages/user/profile';
import MustBe21ToRegister from '../pages/common/mustbe21toregister';

const SeoEmptyFooter = styled.div`
  height: 50px;
`;

const SeoFooterContainer = styled.div`
  background-color: #e0e0e0;
  padding: 30px;
  margin-top: 50px;
`;

const SeoFooterContent = styled.div`
  margin-left: auto;
  margin-right: auto;
  max-width: 768px;

  p {
    margin-top: 20px;
    font-size: 14px;
  }
`;

class App extends Component {
  constructor(props) {
    super(props);
    this.state = { width: 0, height: 0 };
    this.updateWindowDimensions = this.updateWindowDimensions.bind(this);
    firebaseInit();
  }

  componentDidUpdate(prevProps) {
    this.props.location !== prevProps.location && window.scrollTo(0, 0);
  }

  componentDidMount() {
    this.updateWindowDimensions();
    window.addEventListener('resize', this.updateWindowDimensions);
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.updateWindowDimensions);
  }

  updateWindowDimensions() {
    this.setState({ width: window.innerWidth, height: window.innerHeight });
  }

  renderSeoFooter() {
    if (!window.cApplicationLocal.seoFooterHeadline) return <SeoEmptyFooter />;
    return (
      <SeoFooterContainer>
        <SeoFooterContent>
          <h2>{window.cApplicationLocal.seoFooterHeadline}</h2>
          <div
            dangerouslySetInnerHTML={{
              __html: window.cApplicationLocal.seoFooterContent
            }}
          />
        </SeoFooterContent>
      </SeoFooterContainer>
    );
  }

  renderPage(component) {
    return (
      <div className={'body-wrapper'}>
        <div className={'navigation-wrapper'}>
          <Navbar />
          {/* <SubNavbar /> */}
        </div>
        <Switch>
          <Route component={component} />
        </Switch>
        {this.renderSeoFooter()}
        <Footer />
      </div>
    );
  }
  renderRouteComponent() {
    return (
      <div className={'body-wrapper'}>
        <div className={'navigation-wrapper'}>
          <Navbar />
          {/* <SubNavbar /> */}
        </div>
        <Switch>
          <Route path="/golf-odds" component={Golf} />
          <Route path="/mlb-betting" component={Baseball} />
          <Route path="/ncaa-basketball-betting" component={NCAAMB} />
          <Route path="/nba-betting" component={NBA} />
          <Route path="/nfl-betting" component={NFL} />
        </Switch>
        {this.renderSeoFooter()}
        <Footer />
      </div>
    );
  }
  render() {
    // it's required to call window.initApp() here. Don't remove this.
    if (window.initApp) {
      window.initApp();
      let componentSlug = window.cApplicationLocal.componentSlugData;
      // return this.renderRouteComponent();
      if (componentSlug) {
        if (componentSlug.component === 'GolfHome')
          return this.renderPage(GolfHome);
        if (componentSlug.component === 'Leaderboard')
          return this.renderPage(Leaderboard);
        if (componentSlug.component === 'MixedNews') return this._showNews();
        if (componentSlug.component === 'Odds') return this.renderPage(Odds);
        if (componentSlug.component === 'Schedule')
          return this.renderPage(Schedule);
        if (componentSlug.component === 'Ranking')
          return this.renderPage(Ranking);
        if (componentSlug.component === 'Player')
          return this.renderPage(Player);
        if (componentSlug.component === 'NFLHome')
          return this.renderPage(NFLHome);
        if (componentSlug.component === 'OddsSheetViewer')
          return this.renderPage(OddsSheetViewer);
        if (componentSlug.component === 'UserRegistration')
          return this.renderPage(UserRegistration);
        if (componentSlug.component === 'NFLSchedule')
          return this.renderPage(NFLSchedule);
        if (componentSlug.component === 'NFLStandings')
          return this.renderPage(NFLStandings);
        if (componentSlug.component === 'NFLPlayerStatsPage')
          return this.renderPage(NFLPlayerStatsPage);
        if (componentSlug.component === 'NCAAMBSchedule')
          return this.renderPage(NCAAMBSchedule);
        if (componentSlug.component === 'NCAAMBStandings')
          return this.renderPage(NCAAMBStandings);
        if (componentSlug.component === 'NCAAMBRanking')
          return this.renderPage(NCAAMBRanking);
        if (componentSlug.component === 'NCAAMBFutures')
          return this.renderPage(NCAAMBFutures);
        if (componentSlug.component === 'NCAAMBHome')
          return this.renderPage(NCAAMBHome);
        // if (componentSlug.component === 'NCAAMBPlayerStatsPage')
        //   return this.renderPage(NCAAMBPlayerStatsPage);
        if (componentSlug.component === 'ContactPage')
          return this.renderPage(ContactPage);
        if (componentSlug.component === 'MustBe21ToRegister')
          return this.renderPage(MustBe21ToRegister);
        if (componentSlug.component === 'UserProfile')
          return this.renderPage(UserProfile);
      }
      if (window.cApplicationLocal.pageLeague === 'mlb-betting') {
        if (window.cApplicationLocal.pageType === 'league')
          return this.renderPage(BaseballHome);
      }
      if (window.cApplicationLocal.patchSlug) {
        if (window.cApplicationLocal.patchSlugData.srwidget)
          return this.renderPage(SRWidget);
        if (window.cApplicationLocal.patchSlugData.apNews)
          return this.renderPage(APNews);

        if (window.cApplicationLocal.pageType === 'team') {
          return this.renderPage(Teams);
        }
      }
      if (window.cApplicationLocal.pageType === 'article')
        return this.renderPage(Article);
      if (window.cApplicationLocal.pageType === 'anchorPage')
        return this.renderPage(News);
      if (window.cApplicationLocal.pageType === 'league') {
        let news = false;
        let m = window.cApplicationLocal.mainMenus;
        let mm = window.cApplicationLocal.moreMenus;
        let leagueName = window.cApplicationLocal.pageLeague;

        if (leagueName === 'nba-betting' || leagueName === 'nfl-betting')
          return this.renderRouteComponent();

        if (leagueName) {
          for (let c = 0, l = m.length; c < l; c++)
            if (m[c].href === '/' + leagueName) {
              if (m[c].submenu.length > 0) break;
              news = true;
              break;
            }
          if (!news)
            for (let dc = 0, dl = mm.length; dc < dl; dc++)
              if (mm[dc].href === '/' + leagueName) {
                if (mm[dc].submenu.length > 0) break;
                news = true;
                break;
              }
        }

        if (news) return this._showNews();

        if (leagueName === 'golf') return this.renderPage(GolfHome);
        return this.renderPage(CommonHome);
      }
      if (window.cApplicationLocal.pageType === 'home')
        return this.renderPage(CommonHome);
      if (window.cApplicationLocal.pageType === 'leaguesection')
        if (window.cApplicationLocal.pageSection === 'news') {
          return this._showNews();
        }
      if (window.cApplicationLocal.pageSection === 'leaderboard')
        return this.renderPage(Leaderboard);
    }

    return this.renderRouteComponent();
  }
  _showNews() {
    /*
    let pageLeague = window.cApplicationLocal.pageLeague;
    if (
      pageLeague.indexOf('mlb') === -1 &&
      pageLeague.indexOf('nba') === -1 &&
      pageLeague.indexOf('nfl') === -1
    )
      return this.renderPage(MixedNews);
      */
    return this.renderPage(News);
  }
}

export default withRouter(App);
