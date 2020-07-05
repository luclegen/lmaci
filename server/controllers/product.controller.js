const Product = require('../models/product.model');

module.exports.get = (req, res) => {
  Product.findById(req.params.id, (err, product) => {
    return product ? res.status(200).json({ product: product })
                    : res.status(404).json({ msg: 'Product not found.' });
  });
}

module.exports.uploadImgs = (req, res) => {
  console.log(req.imgs);
}
