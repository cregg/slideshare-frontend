import React from 'react';
import { Route, IndexRoute } from 'react-router';

import App from './components/App';
import SearchPage from './components/SearchPage';


export default (
  <Route path="/" component={App}>
    <IndexRoute component={SearchPage} />
  </Route>
);
