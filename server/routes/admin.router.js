const express = require('express'),
      router = express.Router(),
      
const adminController = require('../controllers/admin.controller');

router.get('users', adminController.getUsers);
