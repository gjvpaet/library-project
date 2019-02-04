import { createSelector } from 'reselect';

// GET A PIECE OF STATE
const productSelector = state => state.products.data;
const selectedProductSelector = state => state.products.selected;

const getProduct = (products, selectedId) => {
    if (!selectedId) {
        return null;
    }

    return products[selectedId];
};

export default createSelector(
    productSelector,
    selectedProductSelector,
    getProduct
);
