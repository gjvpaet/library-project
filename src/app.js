import React from 'react';
import { render } from 'react-dom';
import { Provider } from 'react-redux';
import { Route, Switch } from 'react-router';
import createHistory from 'history/createBrowserHistory';
import { ConnectedRouter, routerMiddleware } from 'react-router-redux';

import configureStore from './store/configureStore';

const history = createHistory();
const middleware = routerMiddleware(history);
const store = configureStore(middleware);

import Index from './pages/index.jsx';
import Book from './pages/Books/index.jsx';
import Login from './pages/Login/index.jsx';

render(
    <Provider store={store}>
        <ConnectedRouter history={history}>
            <Switch>
                <Route exact path="/" component={Index} />
                <Route path="/login" component={Login} />
                <Route path="/books" component={Book} />
            </Switch>
        </ConnectedRouter>
    </Provider>,
    document.getElementById('app')
);
