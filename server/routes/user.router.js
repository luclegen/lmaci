const express = require('express');
const router = express.Router();

const userController = require('../controllers/user.controller');

router.post('/register', userController.register);
router.post('/verify-email/:id', userController.verifyEmail);

module.exports = router;