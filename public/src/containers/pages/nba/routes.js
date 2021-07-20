import React, { Component } from 'react';
import { Switch, Route } from 'react-router-dom';
import Home from './home';
import News from '../common/news';
import Schedule from './Schedule';
import Standings from './Standings';
import Scores from './Scores';
import Futures from './Futures';
import GameDetail from './GameDetail';

class NBA extends Component {
  render() {
    return (
      <div>
        <Switch>
          <Route exact path="/nba-betting" component={Home} />
          <Route exact path="/nba-betting/home" component={Home} />
          <Route exact path="/nba-betting/news" component={News} />
          <Route exact path="/nba-betting/schedule" component={Schedule} />
          <Route exact path="/nba-betting/scores" component={Scores} />
          <Route exact path="/nba-betting/standings" component={Standings} />
          <Route exact path="/nba-betting/futures" component={Futures} />
          <Route exact path="/nba-betting/game/:id" component={GameDetail} />
        </Switch>
      </div>
    );
  }
}

export default NBA;
