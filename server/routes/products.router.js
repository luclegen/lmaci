const express = require('express');
const router = express.Router();

const productsCtrl = require('../controllers/products.controller');

router.put('/', productsCtrl.getProducts);

module.exports = router;
