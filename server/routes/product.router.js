const express = require('express');
const router = express.Router();

const productCtrl = require('../controllers/product.controller');
const transfer = require('../helpers/transfer');

router.get('/:id', productCtrl.get);
router.put('/upload-imgs/:id', transfer.array('imgs'), productCtrl.uploadImgs);
router.put('/post/:id', productCtrl.post);
router.put('/review/:id', productCtrl.review);

module.exports = router;