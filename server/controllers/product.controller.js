const Product = require('../models/product.model');

const converter = require('../helpers/converter');

module.exports.get = (req, res) => {
  Product.findById(req.params.id, (err, product) => {
    return product ? res.status(200).json({ product: product })
                    : res.status(404).json({ msg: 'Product not found.' });
  });
}

module.exports.uploadImgs = (req, res) => {
  // console.log(req.params.id);
  
  // console.log(req.body.imgs);

  // console.log(req.body.imgs.slice(1));

  let imgs = [ req.body.imgs[0] ];

  for (const i of req.body.imgs.slice(1)) {
    imgs.push(new Buffer.from(converter.base64ToJpeg(i), 'base64'));
  }

  // new Buffer.from(converter.base64ToJpeg(req.body.img), 'base64')
  // let imgs = { imgs: [] };
  
  Product.findByIdAndUpdate(req.params.id, { $set: { imgs: imgs } }, { new: true }, (err, product) => {
    return product ? res.status(200).json()
                   : res.status(404).json({ msg: 'Upload this product image failed.' });
  });
}
