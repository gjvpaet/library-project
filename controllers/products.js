const moment = require('moment');
const mongoose = require('mongoose');

const Product = require('../models/product');
const Inventory = require('../models/inventory');
const Transaction = require('../models/transaction');

exports.getAll = async (req, res, next) => {
    let { newToken } = req;
    let { status } = req.query;

    try {
        let products = await Product.find({ status })
            .populate('inventory')
            .exec();

        const response = {
            newToken,
            list: products
                .map(product => {
                    return {
                        Id: product._id,
                        Name: product.name,
                        Unit: product.unit,
                        InvRef: product.invRef,
                        Status: product.status,
                        Address: product.address,
                        InvType: product.invType,
                        Location: product.location,
                        BasePrice: product.basePrice,
                        ProductCode: product.productCode,
                        SellingPrice: product.sellingPrice,
                        SupplierName: product.supplierName,
                        Inventory: {
                            Id: product.inventory._id,
                            Quantity: product.inventory.quantity,
                            WarningQuantity: product.inventory.warningQuantity,
                            CreatedAt: product.inventory.createdAt,
                            UpdatedAt: product.inventory.updatedAt
                        },
                        CreatedAt: product.createdAt,
                        UpdatedAt: product.updatedAt
                    };
                })
                .reverse(),
            count: products.length,
            message: 'Items successfully fetched.'
        };

        res.status(200).json(response);
    } catch (error) {
        console.log('error: ', error);
        res.status(500).json({ error });
    }
};

exports.createProduct = async (req, res, next) => {
    let { newToken } = req;

    let {
        Name,
        Unit,
        InvRef,
        Address,
        InvType,
        Location,
        Quantity,
        BasePrice,
        ProductCode,
        SupplierName,
        SellingPrice,
        WarningQuantity
    } = req.body;

    try {
        const inventory = new Inventory({
            _id: new mongoose.Types.ObjectId(),
            quantity: Quantity,
            warningQuantity: WarningQuantity
        });

        let createdInventory = await inventory.save();

        const product = new Product({
            _id: new mongoose.Types.ObjectId(),
            name: Name,
            unit: Unit,
            invRef: InvRef,
            address: Address,
            invType: InvType,
            location: Location,
            basePrice: BasePrice,
            productCode: ProductCode,
            inventory: inventory._id,
            supplierName: SupplierName,
            sellingPrice: SellingPrice
        });

        let createdProduct = await product.save();

        const transaction = new Transaction({
            _id: new mongoose.Types.ObjectId(),
            originalQuantity: 0,
            quantity: inventory.quantity,
            newQuantity: inventory.quantity,
            totalPrice: inventory.quantity * product.basePrice,
            transactionType: 'ADD',
            product: product._id
        });

        await transaction.save();

        const response = {
            newToken,
            content: {
                Id: createdProduct._id,
                Name: createdProduct.name,
                Unit: createdProduct.unit,
                InvRef: createdProduct.invRef,
                Address: createdProduct.address,
                InvType: createdProduct.invType,
                Location: createdProduct.location,
                BasePrice: createdProduct.basePrice,
                ProductCode: createdProduct.productCode,
                SupplierName: createdProduct.supplierName,
                SellingPrice: createdProduct.sellingPrice,
                Inventory: {
                    Id: createdInventory._id,
                    Quantity: createdInventory.quantity,
                    WarningQuantity: createdInventory.warningQuantity,
                    CreatedAt: createdInventory.createdAt,
                    UpdatedAt: createdInventory.updatedAt
                },
                CreatedAt: createdProduct.createdAt,
                UpdatedAt: createdProduct.updatedAt
            },
            message: 'Item successfully created.'
        };

        res.status(200).json(response);
    } catch (error) {
        console.log('error: ', error);
        res.status(500).json({ error });
    }
};

exports.updateProduct = async (req, res, next) => {
    try {
        let { query, params, newToken } = req;
        let { productId } = params;
        let { action } = query;

        let {
            Name,
            Unit,
            InvRef,
            Status,
            Address,
            InvType,
            Location,
            BasePrice,
            ProductCode,
            SupplierName,
            SellingPrice,
            WarningQuantity
        } = req.body;

        switch (action) {
            case 'update':
                let product = await Product.findById(productId)
                    .populate('inventory')
                    .exec();

                await Inventory.update(
                    { _id: product.inventory._id },
                    { $set: { warningQuantity: WarningQuantity } }
                );

                await Product.update(
                    { _id: productId },
                    {
                        $set: {
                            name: Name,
                            unit: Unit,
                            invRef: InvRef,
                            status: Status,
                            address: Address,
                            invType: InvType,
                            location: Location,
                            basePrice: BasePrice,
                            productCode: ProductCode,
                            supplierName: SupplierName,
                            sellingPrice: SellingPrice,
                            updatedAt: moment().format()
                        }
                    }
                ).exec();
                break;
            case 'archive':
                await Product.update(
                    { _id: productId },
                    { $set: { status: Status } }
                );
                break;
            default:
                break;
        }

        let updatedProduct = await Product.findById(productId)
            .populate('inventory')
            .exec();

        const response = {
            newToken,
            content: {
                Id: updatedProduct._id,
                Name: updatedProduct.name,
                Unit: updatedProduct.unit,
                InvRef: updatedProduct.invRef,
                Status: updatedProduct.status,
                Address: updatedProduct.address,
                InvType: updatedProduct.invType,
                Location: updatedProduct.location,
                BasePrice: updatedProduct.basePrice,
                ProductCode: updatedProduct.productCode,
                SupplierName: updatedProduct.supplierName,
                SellingPrice: updatedProduct.sellingPrice,
                Inventory: {
                    Id: updatedProduct.inventory._id,
                    Quantity: updatedProduct.inventory.quantity,
                    WarningQuantity: updatedProduct.inventory.warningQuantity,
                    CreatedAt: updatedProduct.inventory.createdAt,
                    UpdatedAt: updatedProduct.inventory.updatedAt
                },
                CreatedAt: updatedProduct.createdAt,
                UpdatedAt: updatedProduct.updatedAt
            },
            message: 'Item successfully updated.'
        };

        res.status(200).json(response);
    } catch (error) {
        console.log('error: ', error);
        res.status(500).json({ error });
    }
};

exports.getProduct = async (req, res, next) => {
    try {
        let { newToken } = req;

        let { productId } = req.params;

        let product = await Product.findById(productId)
            .populate('inventory')
            .exec();

        if (!product) {
            res.status(404).json({ message: 'Item not found.' });
        }

        const response = {
            newToken,
            content: {
                Id: product._id,
                BasePrice: product.basePrice,
                Description: product.description,
                SellingPrice: product.sellingPrice,
                Inventory: {
                    Id: product.inventory._id,
                    Quantity: product.inventory.quantity,
                    WarningQuantity: product.inventory.warningQuantity,
                    CreatedAt: product.inventory.createdAt,
                    UpdatedAt: product.inventory.updatedAt
                },
                CreatedAt: product.createdAt,
                UpdatedAt: product.updatedAt
            },
            message: 'Item successfully fetched.'
        };

        res.status(200).json(response);
    } catch (error) {
        console.log('error: ', error);
        res.status(500).json({ error });
    }
};

exports.deleteProduct = async (req, res, next) => {
    try {
        let { newToken } = req;

        let { productId } = req.params;

        let deletedProduct = await Product.findOneAndRemove({ _id: productId });
        console.log('deletedProduct: ', deletedProduct);
        await Inventory.remove({ _id: deletedProduct.inventory._id });

        res.status(200).json({
            newToken,
            message: 'Item successfully deleted.'
        });
    } catch (error) {
        console.log('error: ', error);
        res.status(500).json({ error });
    }
};
