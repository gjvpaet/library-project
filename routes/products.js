const express = require('express');

const router = express.Router();

const ProductController = require('../controllers/products');

const checkAuth = require('../middlewares/checkAuth');

router.get('/', checkAuth, ProductController.getAll);
router.post('/', checkAuth, ProductController.createProduct);
router.get('/:productId', checkAuth, ProductController.getProduct);
router.put('/:productId', checkAuth, ProductController.updateProduct);
router.delete('/:productId', checkAuth, ProductController.deleteProduct);

module.exports = router;