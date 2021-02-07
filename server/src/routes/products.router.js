const router = require('express').Router();
const productsCtrl = require('../controllers/products.controller');

router.put('/', productsCtrl.getProducts);

module.exports = router;
