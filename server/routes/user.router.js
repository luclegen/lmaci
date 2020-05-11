const express = require('express');
const router = express.Router();

const userController = require('../controllers/user.controller');

router.post('/register', userController.register);
router.post('/verify-email/:id', userController.verifyEmail);
router.get('/resend-verify-email/:id', userController.resendVerifyEmail);
router.put('/change-email/:id', userController.changeEmail);
router.post('/authenticate', userController.authenticate);
router.post('/find-username', userController.findUsername);

module.exports = router;