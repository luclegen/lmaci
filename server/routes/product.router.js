const express = require('express');
const router = express.Router();

const productCtrl = require('../controllers/product.controller');
const transfer = require('../helpers/transfer');

router.get('/:id', productCtrl.get);
router.put('/upload-imgs/:id', transfer.upload('uploads/img/product', 'slider').array('files'), productCtrl.uploadImgs);
router.put('/post/:id', productCtrl.post);
router.put('/review/:id', transfer.upload('uploads/img/product', 'review').array('files'), productCtrl.review);

module.exports = router;