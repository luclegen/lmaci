const User = require('../models/user.model');
const Product = require('../models/product.model');

const ObjectId = require('mongoose').Types.ObjectId;

const converter = require('../helpers/converter');

//#region Admins

module.exports.getAdmins = (req, res) => {
  User.find({ role: 'root' }, (err, root) => {
    if (root) {
      User.find({ role: 'admin' }, (err, admins) => {
        return admins ? res.status(200).json({ root, admins })
                     : res.status(404).json({ msg: 'Admins not found.' })
      });
    } else return res.status(404).json({ msg: 'Root not found.' })
  });
}

module.exports.removeAsAdmin = (req, res) => {
  User.findOneAndUpdate({ username: req.params.username }, { $set: { role: 'user' } }, { new: true }, (err, result) => {
    return err ? res.status(400).json({ msg: 'Update is error.' })
               : res.status(200).json({ msg: 'Remove as admin was successfully.' });
  });
}

module.exports.searchAdmins = (req, res) => {
  let query = req.body.type == 'username' ? { username: RegExp(req.body.keyword, 'i'), role: /^root|admin$/ }
                                          : { fullName: RegExp(converter.toName(req.body.keyword), 'i'), role: /^root|admin$/ };
  User.find(query, (err, admins) => {
    return admins ? res.status(200).json({ admins })
                  : res.status(404).json({ msg: 'Admins not found.' })
  });
}

//#endregion Admins

//#region Users

module.exports.getUsers = (req, res) => {
  User.find({ role: 'user' }, (err, users) => {
    return users ? res.status(200).json({ users })
                 : res.status(404).json({ msg: 'Users not found.' })
  });
}

module.exports.makeAdmin = (req, res) => {
  User.findOneAndUpdate({ username: req.params.username }, { $set: { role: 'admin' } }, { new: true }, (err, result) => {
    return err ? res.status(400).json({ msg: 'Update is error.' })
               : res.status(200).json({ msg: 'Make admin was successfully.' });
  });
}

module.exports.searchUsers = (req, res) => {
  let query = req.body.type == 'username' ? { username: RegExp(req.body.keyword, 'i'), role: 'user' }
                                          : { fullName: RegExp(converter.toName(req.body.keyword), 'i'), role: 'user' };
  User.find(query, (err, users) => {
    return users ? res.status(200).json({ users })
                  : res.status(404).json({ msg: 'Users not found.' })
  });
}

//#endregion Users

//#region Products

module.exports.createProduct = (req, res, next) => {
  let product = new Product();

  product.name = req.body.name.trim();
  product.price = req.body.price;
  product.quantity.imported = req.body.quantityImported;
  product.type = req.body.type;
  product.colors = req.body.colors;
  product.properties = req.body.properties;
  product.technicalDetails = req.body.technicalDetails;

  product.save((err, product) => {
    return err ? next(err)
               : res.send(product);
  });
}

module.exports.uploadProductImg = (req, res) => {
  Product.findByIdAndUpdate(req.params.id, { $set: { img: new Buffer.from(converter.base64ToImg(req.body.img), 'base64') } }, { new: true }, (err, product) => {
    return product ? res.status(200).json()
                   : res.status(404).json({ msg: 'Upload this product image failed.' });
  });
}

module.exports.post = (req, res) => {
  Product.findByIdAndUpdate(req.params.id, { $set: { post: req.body.post } }, { new: true }, (err, product) => {
    return product ? res.status(200).json({ msg: 'Post is successfully!' })
                   : res.status(404).json({ msg: 'Product not found.' });
  });
}

module.exports.getProducts = (req, res) => {
  Product.find((err, products) => {
    return products ? res.status(200).json({ products: products })
                    : res.status(404).json({ msg: 'Products not found.' });
  });
}

module.exports.updateProduct = (req, res) => {
  if (!ObjectId.isValid(req.params.id))
    return res.status(400).send(`No record with given id: ${req.params.id}`);

  let product = {
    name: req.body.name,
    price: req.body.price,
    quantity: {
      imported: req.body.quantityImported,
    },
    type: req.body.type,
    colors: req.body.colors,
    properties: req.body.properties,
    technicalDetails: req.body.technicalDetails
  };
  
  Product.findByIdAndUpdate(req.params.id, { $set: product }, { new: true }, (err, productEdited) => {
    return productEdited ? res.status(200).json({ _id: productEdited.id, msg: 'Product is updated.' })
                         : res.status(404).json({ msg: 'Product not found.' });
  });
}

module.exports.deleteProduct = (req, res) => {
  if (!ObjectId.isValid(req.params.id))
    return res.status(400).send(`No record with given id: ${req.params.id}`);
  
    Product.findByIdAndDelete(req.params.id, (err, productDeleted) => {
    return productDeleted ? res.status(200).json({ msg: 'Product is deleted.' })
                   : res.status(404).json({ msg: 'Product not found.' });
  });
}

//#endregion Products
