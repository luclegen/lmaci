const ObjectId = require('mongoose').Types.ObjectId;

const Product = require('../models/product.model');

module.exports.getProducts = async (req, res) => {
  const products = await Product.find({ type: req.body.type, name: RegExp(req.body.name, 'i') });

  return products ? res.status(200).json({ products: products })
                  : res.status(404).json({ msg: 'Product not found.' });
}
