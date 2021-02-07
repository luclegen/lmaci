const router = require('express').Router();
const productCtrl = require('../controllers/product.controller');
const transfer = require('../helpers/transfer');

router.get('/:id', productCtrl.get);
router.put('/upload-slideshow/:id', transfer.upload(process.env.PRODUCT_IMG, 'slideshow').array('files'), productCtrl.uploadSlideshow);
router.put('/post/:id', productCtrl.post);
router.put('/review/:id', transfer.upload(process.env.PRODUCT_IMG, 'review').array('files'), productCtrl.review);
router.put('/delete-review/:id', productCtrl.deleteReview);
router.put('/comment/:id', transfer.upload(process.env.PRODUCT_IMG, 'comment').array('files'), productCtrl.comment);
router.put('/delete-comment/:id', productCtrl.deleteComment);
router.put('/reply/:id', transfer.upload(process.env.PRODUCT_IMG, 'answer', 'comment').array('files'), productCtrl.reply);
router.put('/delete-answer/:id', productCtrl.deleteAnswer);

module.exports = router;