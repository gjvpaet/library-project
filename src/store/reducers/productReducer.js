import { keyBy, values } from 'lodash';

import {
    SET_PRODUCT,
    ADD_PRODUCT,
    UPDATE_STOCKS,
    FETCH_PRODUCTS,
    UPDATE_PRODUCT,
    DELETE_PRODUCT,
    SET_SELECTED_PRODUCT
} from '../actions/actionTypes';

let initialState = {
    data: {},
    selected: null,
    formAction: 'POST',
    formLoading: false,
    fetchLoading: true,
    selectedStocks: null
};

const productReducer = (state = initialState, action) => {
    switch (action.type) {
        case FETCH_PRODUCTS:
            return {
                ...state,
                fetchLoading: false,
                data: keyBy(action.payload, 'Id')
            };
            break;
        case SET_PRODUCT:
            return { ...state, ...action.payload };
            break;
        case ADD_PRODUCT:
            return {
                ...state,
                data: {
                    [action.payload.Id]: action.payload,
                    ...state.data
                },
                selected: null
            };
            break;
        case UPDATE_PRODUCT:
            return {
                ...state,
                data: {
                    ...state.data,
                    [action.payload.Id]: action.payload
                },
                selected: null
            };
            break;
        case DELETE_PRODUCT:
            let newProducts = values(state.data).filter(
                product => product.Id !== action.payload
            );

            return {
                ...state,
                data: keyBy(newProducts, 'Id')
            };
            break;
        case SET_SELECTED_PRODUCT:
            let selected = state.selected ? { ...state.selected } : {};

            return {
                ...state,
                selected: {
                    ...selected,
                    [action.payload.field]: action.payload.value
                }
            };
            break;
        case UPDATE_STOCKS:
            let products = values(state.data).map(product => {
                if (product.Inventory.Id === action.payload.Id) {
                    product.Inventory = { ...action.payload };
                }

                return product;
            });

            return {
                ...state,
                data: keyBy(products, 'Id')
            };
            break;
        default:
            return state;
            break;
    }
};

export default productReducer;
