const mongoose = require('mongoose');

const Transaction = require('../models/transaction');

exports.getAllTransactions = async (req, res, next) => {
    let { newToken } = req;

    let { startDate, endDate } = req.query;

    try {
        let transactions = [];

        if (startDate && endDate) {
            transactions = await Transaction.find({
                createdAt: {
                    $gte: startDate,
                    $lte: endDate
                }
            })
                .populate('product')
                .exec();
        } else {
            transactions = await Transaction.find()
                .populate('product')
                .exec();
        }
        
        if (!transactions) {
            res
                .status(404)
                .json({
                    message: `There's no transactions made within this date.`
                });
        }

        const response = {
            newToken,
            list: transactions.map(transaction => {
                const productObj = transaction.product ? {
                    Id: transaction.product._id,
                    BasePrice: transaction.product.basePrice,
                    Description: transaction.product.description,
                    SellingPrice: transaction.product.sellingPrice,
                    CreatedAt: transaction.product.createdAt,
                    UpdatedAt: transaction.product.updatedAt
                } : {};

                return {
                    Id: transaction._id,
                    Quantity: transaction.quantity,
                    OriginalQuantity: transaction.originalQuantity,
                    NewQuantity: transaction.newQuantity,
                    TotalPrice: transaction.totalPrice,
                    TransactionType: transaction.transactionType,
                    Product: productObj,
                    CreatedAt: transaction.createdAt
                };
            }),
            count: transactions.length,
            message: 'Successfully fetched transactions.'
        };

        res.status(200).json(response);
    } catch (error) {
        console.log('error: ', error);
        res.status(500).json({ error });
    }
};

exports.getTransactionsByDate = async (req, res, next) => {
    let { newToken } = req;

    const { startDate, endDate } = req.query;

    try {
        let transactions = await Transaction.find({
            createdAt: {
                $gte: startDate,
                $lte: endDate
            }
        })
            .populate('product')
            .exec();

        const response = {
            newToken,
            list: transactions.map(transaction => {
                return {
                    Id: transaction._id,
                    Quantity: transaction.Quantity,
                    OriginalQuantity: transaction.OriginalQuantity,
                    NewQuantity: transaction.NewQuantity,
                    TotalPrice: transaction.totalPrice,
                    TransactionType: transaction.TransactionType,
                    Product: {
                        Id: transaction.product._id,
                        BasePrice: transaction.product.basePrice,
                        Description: transaction.product.description,
                        SellingPrice: transaction.product.sellingPrice,
                        CreatedAt: transaction.product.createdAt,
                        UpdatedAt: transaction.product.updatedAt
                    }
                };
            }),
            count: transactions.length,
            message: 'Successfully fetched transactions'
        };

        res.status(200).json(response);
    } catch (error) {
        console.log('error: ', error);
        res.status(500).json({ error });
    }
};
