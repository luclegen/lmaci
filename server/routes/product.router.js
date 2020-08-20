const express = require('express');
const router = express.Router();

const productCtrl = require('../controllers/product.controller');
const transfer = require('../helpers/transfer');

router.get('/:id', productCtrl.get);
router.put('/upload-imgs/:id', transfer.upload('uploads/img/product', 'slider').array('files'), productCtrl.uploadImgs);
router.put('/post/:id', productCtrl.post);
router.put('/review/:id', transfer.upload('uploads/img/product', 'review').array('files'), productCtrl.review);
router.put('/delete-review/:id', productCtrl.deleteReview);
router.put('/comment/:id', transfer.upload('uploads/img/product', 'comment').array('files'), productCtrl.comment);
router.put('/delete-comment/:id', productCtrl.deleteComment);
router.put('/reply/:id', transfer.upload('uploads/img/product', 'answer', 'comment').array('files'), productCtrl.reply);

module.exports = router;
