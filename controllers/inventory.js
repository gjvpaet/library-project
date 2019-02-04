const moment = require('moment');
const mongoose = require('mongoose');

const Product = require('../models/product');
const Inventory = require('../models/inventory');
const Transaction = require('../models/transaction');

exports.modifyStock = async (req, res, next) => {
    let { newToken } = req;

    let { inventoryId } = req.params;

    let { Qty, Type } = req.body;

    try {
        let inventory = await Inventory.findByIdAndUpdate(inventoryId, {
            $inc: {
                quantity: Type === 'ADD' ? Qty : Type === 'SUBTRACT' ? -Qty : 0
            },
            $set: { updatedAt: moment().format() }
        }).exec();

        let updatedInventory = await Inventory.findById(inventoryId).exec();

        let product = await Product.findOne({
            inventory: updatedInventory._id
        });

        let transaction = new Transaction({
            _id: new mongoose.Types.ObjectId(),
            originalQuantity: inventory.quantity,
            quantity: Qty,
            newQuantity: updatedInventory.quantity,
            totalPrice:
                Type === 'ADD'
                    ? product.basePrice * Qty
                    : Type === 'SUBTRACT'
                        ? product.sellingPrice * Qty
                        : null,
            transactionType: Type,
            product: product._id
        });

        await transaction.save();

        const response = {
            newToken,
            content: {
                Id: updatedInventory._id,
                Quantity: updatedInventory.quantity,
                WarningQuantity: updatedInventory.warningQuantity,
                Product: {
                    Id: product._id,
                    Name: product.name,
                    Unit: product.unit,
                    InvRef: product.invRef,
                    Address: product.address,
                    InvType: product.InvType,
                    Location: product.location,
                    BasePrice: product.basePrice,
                    ProductCode: product.productCode,
                    SellingPrice: product.sellingPrice,
                    SupplierName: product.supplierName,
                    CreatedAt: product.createdAt,
                    UpdatedAt: product.updatedAt
                },
                CreatedAt: updatedInventory.createdAt,
                UpdatedAt: updatedInventory.updatedAt
            },
            message:
                Type === 'ADD'
                    ? 'Successfully added stock.'
                    : Type === 'SUBTRACT'
                        ? 'Successfully subtracted stock.'
                        : ''
        };

        res.status(200).json(response);
    } catch (error) {
        console.log('error: ', error);
        res.status(500).json({ error });
    }
};
