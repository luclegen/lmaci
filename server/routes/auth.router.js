const express = require('express');
const router = express.Router();

const authController = require('../controllers/user.controller');

const jwt = require('../helpers/jwt');

router.post('/register', authController.register);
router.post('/active/:id', authController.active);
router.get('/resend-active/:id', authController.resendActive);
router.put('/change-email/:id', authController.changeEmail);
router.post('/authenticate', authController.authenticate);
router.post('/find-username', authController.findUsername);
router.get('/resend-verify-reset-password/:username', authController.resendVerifyResetPassword);
router.put('/reset-password/:username', authController.resetPassword);
router.put('/change-password/:id', authController.changePassword);
router.get('/profile', jwt.verifyJwtToken, authController.profile);

module.exports = router;