const router = require('express').Router();
const transfer = require('../helpers/transfer');
const userCtrl = require('../controllers/user.controller');

router.get('/:username', userCtrl.get);
router.put('/:username', userCtrl.updateUser);
router.put('/upload-avatar/:username', transfer.upload(process.env.AVATAR_IMG).single('file'), userCtrl.uploadAvatar);

module.exports = router;