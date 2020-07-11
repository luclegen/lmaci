const express = require('express');
const router = express.Router();

const imageCtrl = require('../controllers/image.controller');

router.get('/', imageCtrl.get);

module.exports = router;