const express = require('express');

const router = express.Router();

const InventoryController = require('../controllers/inventory');

const checkAuth = require('../middlewares/checkAuth');

router.put('/:inventoryId', checkAuth, InventoryController.modifyStock);

module.exports = router;