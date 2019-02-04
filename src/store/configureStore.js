import { routerReducer } from 'react-router-redux';
import { createStore, combineReducers, applyMiddleware } from 'redux';

import bookReducer from './reducers/bookReducer';
import productReducer from './reducers/productReducer';
import transactionReducer from './reducers/transactionReducer';

const rootReducer = combineReducers({
    books: bookReducer,
    router: routerReducer,
    products: productReducer,
    transactions: transactionReducer
});

const configureStore = middleware => {
    return createStore(rootReducer, applyMiddleware(middleware));
};

export default configureStore;
