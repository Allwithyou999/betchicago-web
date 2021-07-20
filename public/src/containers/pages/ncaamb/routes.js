import React, { Component } from 'react';
import { Switch, Route } from 'react-router-dom';
import Home from './home';
// import PlayerStats from './playerstats';
import News from '../common/news';

import NCAAMBSchedule from './Schedule';
import Standings from './Standings';
import Rankings from './Rankings';
import Futures from './Futures';

class NCAAMB extends Component {
  render() {
    return (
      <div>
        <Switch>
          <Route exact path="/ncaa-basketball-betting" component={Home} />
          <Route exact path="/ncaa-basketball-betting/home" component={Home} />
          <Route exact path="/ncaa-basketball-betting/news" component={News} />
          <Route
            exact
            path="/ncaa-basketball-betting/schedule"
            component={NCAAMBSchedule}
          />
          <Route
            exact
            path="/ncaa-basketball-betting/standings"
            component={Standings}
          />
          <Route
            exact
            path="/ncaa-basketball-betting/rankings"
            component={Rankings}
          />
          <Route
            exact
            path="/ncaa-basketball-betting/futures"
            component={Futures}
          />
        </Switch>
      </div>
    );
  }
}

export default NCAAMB;
