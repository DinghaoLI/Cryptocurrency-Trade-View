import React from 'react';
import { Router, Route, Switch } from 'dva/router';
import IndexPage from './routes/IndexPage';
import TradingPage from "./routes/TradingPage";

function RouterConfig({ history }) {
  return (
    <Router history={history}>
      <Switch>
        <Route path="/" exact component={IndexPage} />
        <Route path="/trade" exact component={TradingPage} />
      </Switch>
    </Router>
  );
}

export default RouterConfig;
