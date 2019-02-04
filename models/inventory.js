const moment = require('moment');
const mongoose = require('mongoose');

const inventorySchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    quantity: {
        type: Number,
        required: true
    },
    warningQuantity: {
        type: Number,
        required: true
    },
    createdAt: {
        type: Date,
        required: true,
        default: moment().format(),
    },
    updatedAt: {
        type: Date,
        required: true,
        default: moment().format()
    }
});

module.exports = mongoose.model('Inventory', inventorySchema);