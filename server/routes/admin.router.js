const express = require('express'),
      router = express.Router();
      
const adminController = require('../controllers/admin.controller');

router.get('/admins', adminController.getAdmins);
router.put('/remove-as-admin/:username', adminController.removeAsAdmin);
router.get('/users', adminController.getUsers);

module.exports = router;