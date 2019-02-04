const moment = require('moment');
const mongoose = require('mongoose');

const productSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    location: String,
    address: String,
    supplierName: String,
    unit: String,
    invType: String,
    invRef: String,
    productCode: String,
    name: {
        type: String,
        required: true
    },
    status: {
        type: Number,
        default: 1
    },
    basePrice: {
        type: Number,
        required: true
    },
    sellingPrice: {
        type: Number,
        required: true
    },
    inventory: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Inventory',
        required: true
    },
    createdAt: {
        type: Date,
        required: true,
        default: moment().format()
    },
    updatedAt: {
        type: Date,
        required: true,
        default: moment().format()
    }
});

module.exports = mongoose.model('Product', productSchema);