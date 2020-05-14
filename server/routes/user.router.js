const express = require('express');
const router = express.Router();

const userController = require('../controllers/user.controller');

const jwt = require('../helpers/jwt');

router.get('/profile', jwt.verifyJwtToken, authController.profile);

module.exports = router;