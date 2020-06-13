const express = require('express'),
      router = express.Router();
      multer = require('multer');

const adminCtrl = require('../controllers/admin.controller');

const storage = multer.diskStorage({
  destination: (req, file, callBack) => {
      callBack(null, 'uploads')
  },
  filename: (req, file, callBack) => {
      callBack(null, `FunOfHeuristic_${file.originalname}`)
  }
})

const upload = multer({ storage: storage })

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
router.post('/upload-product-img/:id', upload.single('file'), adminCtrl.uploadProductImg);
router.post('/post/:id', adminCtrl.post);
router.get('/products', adminCtrl.getProducts);
router.put('/update-product/:id', adminCtrl.updateProduct);
router.delete('/delete-product/:id', adminCtrl.deleteProduct);
//#endregion Products

module.exports = router;