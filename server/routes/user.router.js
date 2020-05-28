const express = require('express');
const router = express.Router();

const userCtrl = require('../controllers/user.controller');

router.get('/:username', userCtrl.get);
    
module.exports = router;