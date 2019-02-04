import {
    SET_PRODUCT,
    ADD_PRODUCT,
    UPDATE_STOCKS,
    FETCH_PRODUCTS,
    UPDATE_PRODUCT,
    DELETE_PRODUCT,
    SET_SELECTED_PRODUCT
} from './actionTypes';

export const fetchProducts = payload => {
    return {
        payload,
        type: FETCH_PRODUCTS
    };
};

export const setSelectedProduct = payload => {
    return {
        payload,
        type: SET_SELECTED_PRODUCT
    };
};

export const setProduct = payload => {
    return {
        payload,
        type: SET_PRODUCT
    };
};

export const addProduct = payload => {
    return {
        payload,
        type: ADD_PRODUCT
    };
};

export const updateProduct = payload => {
    return {
        payload,
        type: UPDATE_PRODUCT
    };
};

export const deleteProduct = payload => {
    return {
        payload,
        type: DELETE_PRODUCT
    };
};

export const updateStocks = payload => {
    return {
        payload,
        type: UPDATE_STOCKS
    };
};
