const rimraf = require("rimraf");

const User = require('../models/user.model');
const Product = require('../models/product.model');

const ObjectId = require('mongoose').Types.ObjectId;

const converter = require('../helpers/converter');

//#region Admins

module.exports.getAdmins = (req, res) => {
  User.find({ role: 'root' }, (err, root) => {
    if (root) {
      User.find({ role: 'admin' }).sort('name.first').exec((err, admins) => {
        return admins ? res.status(200).json({ root, admins })
                      : res.status(404).json({ msg: 'Admins not found.' });
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
  User.find({ role: 'user' }).sort('name.first').exec((err, users) => {
    return users ? res.status(200).json({ users })
                  : res.status(404).json({ msg: 'Users not found.' });
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
  if (!ObjectId.isValid(req.params.id))
    return res.status(400).json({ msg: `No record with given id: ${req.params.id}` });

  let urlImg = process.env.SERVER_URL + '/image/?image=product/' + req.params.id + '/',
      img = {
        index: parseInt(req.body.index),
        path: urlImg + req.file.filename
      };

  Product.findByIdAndUpdate(req.params.id, { $set: { img: img } }, { new: true }, (err, product) => {
    if (product) {
      if (img.index > 0) rimraf.sync('uploads/img/product/' + req.params.id + '/' + (img.index - 1) + '.png');
      return res.status(200).json();
    } else return res.status(404).json({ msg: 'Upload this product image failed.' });
  });
}

module.exports.post = (req, res) => {
  if (!ObjectId.isValid(req.params.id))
    return res.status(400).json({ msg: `No record with given id: ${req.params.id}` });

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
    if (productEdited) {
      const newSliders = [];

      if (productEdited.colors.length && productEdited.sliders.length) {
        const common = [], colors =  productEdited.colors.map(c => c.value), colorsSliders = productEdited.sliders.map(s => s.color);
        
        colors.forEach(c => {
          if (colorsSliders.filter(cs => cs == c).length) common.push(colorsSliders.filter(cs => cs == c)[0]);
        });
        
        common.forEach(c => {
          newSliders.push(productEdited.sliders.filter(s => s.color == c)[0]);
          colorsSliders.splice(colorsSliders.indexOf(c), 1);
        });
        
        colorsSliders.forEach(r => rimraf.sync('uploads/img/product/' + req.params.id + '/slider/' + r.replace(/#/, '')));
      } else rimraf.sync('uploads/img/product/' + req.params.id + '/slider/');

      Product.findByIdAndUpdate(req.params.id, { $set: { sliders: newSliders } }, { new: true }, (err, productEdited1) => {
        return productEdited1 ? res.status(200).json({ _id: productEdited1.id, msg: 'Product is updated.' })
                              : res.status(404).json({ msg: 'Product not found.' });
      });
    } else return res.status(404).json({ msg: 'Product not found.' });
  });
}

module.exports.deleteProduct = (req, res) => {
  if (!ObjectId.isValid(req.params.id))
    return res.status(400).send(`No record with given id: ${req.params.id}`);
  
  Product.findByIdAndDelete(req.params.id, (err, productDeleted) => {
    if (productDeleted) {
      rimraf.sync('uploads/img/product/' + req.params.id);
      return res.status(200).json({ msg: 'Product is deleted.' });
    } else return res.status(404).json({ msg: 'Product not found.' });
  });
}

module.exports.searchProducts = (req, res) => {
  let query = { name: RegExp(converter.toKeyword(req.body.keyword), 'i') };
  
  Product.find(query, (err, products) => {
    return products ? res.status(200).json({ products })
                  : res.status(404).json({ msg: 'Products not found.' })
  });
}

//#endregion Products
