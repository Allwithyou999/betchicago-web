import React, { Component } from 'react';
import { Switch, Route } from 'react-router-dom';
import Home from './home';
import News from '../common/news';
import Schedule from './schedule';
import Standings from './standings';
import PlayerStats from './playerstats';
import FullPlayerStats from './fullplayerstats';
import TeamStats from './teamstats';
import Game from './game';

class NBA extends Component {
  render() {
    return (
      <div>
        <Switch>
          <Route exact path="/nfl-betting" component={Home} />
          <Route exact path="/nfl-betting/home" component={Home} />
          <Route exact path="/nfl-betting/news" component={News} />
          <Route exact path="/nfl-betting/schedule" component={Schedule} />
          <Route exact path="/nfl-betting/standings" component={Standings} />
          <Route
            exact
            path="/nfl-betting/playerstats"
            component={PlayerStats}
          />
          <Route
            exact
            path="/nfl-betting/:type/playerstats"
            component={FullPlayerStats}
          />
          <Route exact path="/nfl-betting/teamstats" component={TeamStats} />
          <Route exact path="/nfl-betting/game/:week/:id" component={Game} />
        </Switch>
      </div>
    );
  }
}

export default NBA;
