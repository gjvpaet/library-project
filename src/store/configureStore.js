import { routerReducer } from 'react-router-redux';
import { createStore, combineReducers, applyMiddleware } from 'redux';

import bookReducer from './reducers/bookReducer';

const rootReducer = combineReducers({
    books: bookReducer,
    router: routerReducer,
});

const configureStore = middleware => {
    return createStore(rootReducer, applyMiddleware(middleware));
};

export default configureStore;
