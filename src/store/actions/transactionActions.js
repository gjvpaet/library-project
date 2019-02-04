import { SET_TRANSACTIONS, FETCH_TRANSACTIONS } from './actionTypes';

export const fetchTransactions = payload => {
    return {
        payload,
        type: FETCH_TRANSACTIONS
    };
};

export const setTransactions = payload => {
    return {
        payload,
        type: SET_TRANSACTIONS
    };
};
