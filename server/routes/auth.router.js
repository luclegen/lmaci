const express = require('express');
const router = express.Router();

const authCtrl = require('../controllers/auth.controller');
const jwt = require('../helpers/jwt');

router.post('/register', authCtrl.register);
router.post('/active/:id', authCtrl.active);
router.get('/resend-active/:id', authCtrl.resendActive);
router.put('/change-email/:id', authCtrl.changeEmail);
router.post('/authenticate', authCtrl.authenticate);
router.post('/find-username', authCtrl.findUsername);
router.get('/resend-verify-reset-password/:username', authCtrl.resendVerifyResetPassword);
router.put('/reset-password/:username', authCtrl.resetPassword);
router.put('/change-password/:id', authCtrl.changePassword);
router.get('/info', jwt.verifyJwtToken, authCtrl.info);

module.exports = router;