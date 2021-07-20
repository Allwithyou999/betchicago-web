import React, { Component } from 'react';
import { Switch, Route } from 'react-router-dom';
import Home from './home';
import Standings from './standings';
import Scoreboards from './scoreboards';
import Coverage from './coverage';
import Teams from './teams';
import Odds from './odds';
import Schedule from './schedule';
import News from '../common/news';
import Article from '../common/article';

class Baseball extends Component {
  render() {
    return (
      <div>
        <Switch>
          <Route exact path="/mlb-betting" component={Home} />
          <Route exact path="/mlb-betting/home" component={Home} />
          <Route exact path="/mlb-betting/standings" component={Standings} />
          <Route exact path="/mlb-betting/scores" component={Scoreboards} />
          <Route exact path="/mlb-betting/coverage/:id" component={Coverage} />
          <Route
            exact
            path="/mlb-betting/coverage/:id/:tab"
            component={Coverage}
          />
          <Route exact path="/mlb-betting/teams/:slug" component={Teams} />
          <Route exact path="/mlb-betting/news" component={News} />
          <Route exact path="/mlb-betting/schedule" component={Schedule} />
          <Route exact path="/mlb-betting/odds" component={Odds} />
          <Route exact path="/mlb-betting/article/:id" component={Article} />
        </Switch>
      </div>
    );
  }
}

export default Baseball;
