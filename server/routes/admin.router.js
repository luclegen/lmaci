const express = require('express'),
      router = express.Router();
      
const adminController = require('../controllers/admin.controller');

router.get('/admins', adminController.getAdmins);
router.get('/remove-as-admin/:username', adminController.removeAsAdmin);
router.get('/users', adminController.getUsers);
router.get('/make-admin', adminController.makeAdmin);

module.exports = router;