const express = require('express'),
      router = express.Router();
      
const adminController = require('../controllers/admin.controller');

router.get('/admins', adminController.getAdmins);
router.get('/users', adminController.getUsers);

module.exports = router;