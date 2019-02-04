const express = require('express');

const router = express.Router();

const TransactionController = require('../controllers/transactions');

const checkAuth = require('../middlewares/checkAuth');

router.get('/', checkAuth, TransactionController.getAllTransactions);

module.exports = router;