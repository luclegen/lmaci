const express = require('express'),
      router = express.Router();
      
const adminController = require('../controllers/admin.controller');

//#region Admins
router.get('/admins', adminController.getAdmins);
router.get('/remove-as-admin/:username', adminController.removeAsAdmin);
router.put('/search-admins', adminController.searchAdmins);
//#endregion Admins

//#region Users
router.get('/users', adminController.getUsers);
router.get('/make-admin/:username', adminController.makeAdmin);
//#endregion Users

module.exports = router;