const router = require('express').Router();

const imageCtrl = require('../controllers/image.controller');

router.get('/', imageCtrl.get);

module.exports = router;