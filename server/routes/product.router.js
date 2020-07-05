const express = require('express');
const router = express.Router();

const productCtrl = require('../controllers/product.controller');
const transfer = require('../helpers/transfer');

router.get('/:id', productCtrl.get);
router.put('upload-imgs/:id', transfer.array('imgs'), productCtrl.uploadImgs);

module.exports = router;