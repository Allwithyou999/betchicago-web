import React, { Component } from 'react';
import { Switch, Route } from 'react-router-dom';
import GolfHome from './home';
import Leaderboard from './leaderboard';
import News from '../common/news';
import Schedule from './schedule';
import Ranking from './ranking';
import Odds from './odds';
import Player from './player';
import Article from '../common/article';

class Golf extends Component {
  render() {
    return (
      <div>
        <Switch>
          <Route exact path="/golf-odds" component={GolfHome} />
          <Route exact path="/golf-odds/home" component={GolfHome} />
          <Route exact path="/golf-odds/leaderboard" component={Leaderboard} />
          <Route
            exact
            path="/golf-odds/leaderboard/:id"
            component={Leaderboard}
          />
          <Route exact path="/golf-odds/news" component={News} />
          <Route exact path="/golf-odds/schedule" component={Schedule} />
          <Route exact path="/golf-odds/world-rankings" component={Ranking} />
          <Route exact path="/golf-odds/odds" component={Odds} />
          <Route exact path="/golf-odds/player/:id" component={Player} />
          <Route exact path="/golf-odds/article/:id" component={Article} />
        </Switch>
      </div>
    );
  }
}

export default Golf;
