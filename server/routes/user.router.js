const express = require('express');
const router = express.Router();
const transfer = require('../helpers/transfer');

const userCtrl = require('../controllers/user.controller');

router.get('/:username', userCtrl.get);
router.put('/:username', userCtrl.updateUser);

module.exports = router;