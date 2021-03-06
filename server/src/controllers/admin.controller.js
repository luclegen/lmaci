const rimraf = require('rimraf');

const User = require('../models/user.model');
const Product = require('../models/product.model');

const ObjectId = require('mongoose').Types.ObjectId;

const converter = require('../helpers/converter');

//#region Admins

module.exports.getAdmins = async (req, res) => {
  const root = await User.findOne({ role: 'root' });
  const admins = await User.find({ role: 'admin' }).sort('name.first').exec();

  return root ? admins ? res.status(200).json({ root, admins })
                       : res.status(404).json({ msg: 'Admins not found.' })
              : res.status(404).json({ msg: 'Root not found.' });
}

module.exports.removeAsAdmin = async (req, res) => {
  const user = await User.findOneAndUpdate({ username: req.params.username }, { $set: { role: 'user' } }, { new: true });

  return user ? res.status(200).json({ token: user.generateJwt(), msg: 'Remove as admin is successfully.' })
              : res.status(417).json({ msg: 'Remove as admin is fail.' });
}

module.exports.searchAdmins = async (req, res) => {
  let query = req.body.type == 'username' ? { username: RegExp(req.body.keyword, 'i'), role: /^root|admin$/ }
                                          : { fullName: RegExp(converter.toName(req.body.keyword), 'i'), role: /^root|admin$/ };
  const admins = await User.find(query);

  return admins ? res.status(200).json({ admins })
                : res.status(404).json({ msg: 'Admins not found.' });
}

//#endregion Admins

//#region Users

module.exports.getUsers = async (req, res) => {
  const users = await User.find({ role: 'user' }).sort('name.first').exec();

  return users ? res.status(200).json({ users })
               : res.status(404).json({ msg: 'Users not found.' });
}

module.exports.makeAdmin = async (req, res) => {
  const admin = await User.findOneAndUpdate({ username: req.params.username }, { $set: { role: 'admin' } }, { new: true });

  return admin ? res.status(200).json({ msg: 'Make admin is successfully.' })
               : res.status(417).json({ msg: 'Make admin is fail.' });
}

module.exports.searchUsers = async (req, res) => {
  let query = req.body.type == 'username' ? { username: RegExp(req.body.keyword, 'i'), role: 'user' }
                                          : { fullName: RegExp(converter.toName(req.body.keyword), 'i'), role: 'user' };
  const users = await User.find(query);

  return users ? res.status(200).json({ users })
               : res.status(404).json({ msg: 'Users not found.' });
}

//#endregion Users

//#region Products

module.exports.createProduct = async (req, res, next) => {
  const product = new Product();

  product.name = req.body.name.trim();
  product.price = req.body.price;
  product.quantity.imported = req.body.quantityImported;
  product.type = req.body.type;
  product.colors = req.body.colors;
  product.properties = req.body.properties;
  product.technicalDetails = req.body.technicalDetails;

  try {
    return res.send(await product.save());
  } catch (err) {
    return next(err);
  }
}

module.exports.uploadProductImg = async (req, res) => {
  if (!ObjectId.isValid(req.params.id))
    return res.status(400).json({ msg: `No record with given id: ${req.params.id}` });

  const img = {
    index: parseInt(req.body.index),
    path: process.env.SERVER_URL + '/image/?image=product/' + req.params.id + '/' + req.file.filename
  };
  const product = await Product.findByIdAndUpdate(req.params.id, { $set: { img: img } }, { new: true });

  if (product) {
    if (img.index > 0) rimraf.sync(process.env.PRODUCT_IMG + req.params.id + '/' + (img.index - 1) + '.png');
    return res.status(200).json();
  } else return res.status(404).json({ msg: 'Upload this product image failed.' });
}

module.exports.getProducts = async (req, res) => {
  const products = await Product.find().sort('-updatedAt').exec();

  return products ? res.status(200).json({ products: products })
                  : res.status(404).json({ msg: 'Products not found.' });
}

module.exports.updateProduct = async (req, res) => {
  if (!ObjectId.isValid(req.params.id))
    return res.status(400).send(`No record with given id: ${req.params.id}`);

  const product = {
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

  const productEdited = await Product.findByIdAndUpdate(req.params.id, { $set: product }, { new: true });
  
  if (productEdited) {
    let newSlideshows = [];

    if (productEdited.slideshows.length) {
      const colors = productEdited.colors.map(c => c.value), colorsSlideshows = productEdited.slideshows.map(s => s.color);
      const common = [...new Set(colors.concat(colorsSlideshows).filter(c => colors.includes(c) && colorsSlideshows.includes(c)))];

      newSlideshows = productEdited.slideshows.filter(s => common.includes(s.color));
      colorsSlideshows.filter(cs => !common.includes(cs)).forEach(r => rimraf.sync(process.env.PRODUCT_IMG + req.params.id + '/slideshow/' + r.replace(/#/, '')));
    } else rimraf.sync(process.env.PRODUCT_IMG + req.params.id + '/slideshow/');

    const productEdited1 = await Product.findByIdAndUpdate(req.params.id, { $set: { slideshows: newSlideshows } }, { new: true });

    return productEdited1 ? res.status(200).json({ _id: productEdited1.id, msg: 'Product is updated.' })
                          : res.status(404).json({ msg: 'Product not found.' });
  } else return res.status(404).json({ msg: 'Product not found.' });
}

module.exports.deleteProduct = async (req, res) => {
  if (!ObjectId.isValid(req.params.id))
    return res.status(400).send(`No record with given id: ${req.params.id}`);
  
  const productDeleted = await Product.findByIdAndDelete(req.params.id);
  
  if (productDeleted) {
    rimraf.sync(process.env.PRODUCT_IMG + req.params.id);
    return res.status(200).json({ msg: 'Product is deleted.' });
  } else return res.status(404).json({ msg: 'Product not found.' });
}

module.exports.searchProducts = async (req, res) => {
  const query = { name: RegExp(converter.toKeyword(req.body.keyword), 'i') };
  const products = await Product.find(query);
  
  return products ? res.status(200).json({ products })
                  : res.status(404).json({ msg: 'Products not found.' });
}

//#endregion Products
