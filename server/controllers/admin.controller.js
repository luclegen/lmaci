const User = require('../models/user.model');
const Product = require('../models/product.model');

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
                                          : { fullName: RegExp(converter.convertName(req.body.keyword), 'i'), role: /^root|admin$/ };
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
                                          : { fullName: RegExp(converter.convertName(req.body.keyword), 'i'), role: 'user' };
  User.find(query, (err, users) => {
    return users ? res.status(200).json({ users })
                  : res.status(404).json({ msg: 'Users not found.' })
  });
}

//#endregion Users

//#region Products

module.exports.addProduct = (req, res, next) => {
  let product = new Product();

  product.name = req.body.name;
  product.quantity.imported = req.body.quantityImported;
  product.price = req.body.price;
  product.type = req.body.type;
  product.description = req.body.description;
  product.colors = req.body.colors;
  product.technicalDetails = req.body.technicalDetails;

  product.save((err, product) => {
    return err ? next(err)
               : res.send(product);
  });
}

module.exports.post = (req, res) => {
  Product.findByIdAndUpdate(req.params.id, { $set: { post: req.body.post } }, { new: true }, (err, product) => {
    return product ? res.status(200).json({ msg: 'Post is successfully!' })
                   : res.status(404).json({ msg: 'Product was found.' });
  });
}

//#endregion Products
