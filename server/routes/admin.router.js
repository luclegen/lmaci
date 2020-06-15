const express = require('express'),
      router = express.Router();

const adminCtrl = require('../controllers/admin.controller');

//#region Admins
router.get('/admins', adminCtrl.getAdmins);
router.get('/remove-as-admin/:username', adminCtrl.removeAsAdmin);
router.put('/search-admins', adminCtrl.searchAdmins);
//#endregion Admins

//#region Users
router.get('/users', adminCtrl.getUsers);
router.get('/make-admin/:username', adminCtrl.makeAdmin);
router.put('/search-users', adminCtrl.searchUsers);
//#endregion Users

//#region Products
router.post('/create-product', adminCtrl.createProduct);
router.post('/post/:id', adminCtrl.post);
router.get('/products', adminCtrl.getProducts);
router.put('/update-product/:id', adminCtrl.updateProduct);
router.delete('/delete-product/:id', adminCtrl.deleteProduct);
//#endregion Products

module.exports = router;