const express = require('express');
const router = express.Router();

const userController = require('../controllers/user.controller');

const jwt = require('../helpers/jwt');

router.post('/register', userController.register);
router.post('/active/:id', userController.active);
router.get('/resend-verify/:id', userController.resendVerify);
router.put('/change-email/:id', userController.changeEmail);
router.post('/authenticate', userController.authenticate);
router.post('/find-username', userController.findUsername);
router.get('/resend-verify-reset-password/:username', userController.resendVerifyResetPassword);
router.put('/reset-password/:username', userController.resetPassword);
router.put('/change-password/:id', userController.changePassword);
router.get('/profile', jwt.verifyJwtToken, userController.profile);

module.exports = router;