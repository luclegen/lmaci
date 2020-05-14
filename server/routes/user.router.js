const express = require('express');
const router = express.Router();

const userController = require('../controllers/user.controller');

const jwt = require('../helpers/jwt');

router.get('/profile', jwt.verifyJwtToken, userController.profile);

module.exports = router;