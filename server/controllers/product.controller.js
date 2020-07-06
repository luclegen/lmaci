const ObjectId = require('mongoose').Types.ObjectId;

const Product = require('../models/product.model');

const converter = require('../helpers/converter');

module.exports.get = (req, res) => {
  Product.findById(req.params.id, (err, product) => {
    return product ? res.status(200).json({ product: product })
                    : res.status(404).json({ msg: 'Product not found.' });
  });
}

module.exports.uploadImgs = (req, res) => {
  if (!ObjectId.isValid(req.params.id))
    return res.status(400).json({ msg: `No record with given id: ${req.params.id}` });

  Product.findById(req.params.id, (err, product) => {
    if (product) {
      let sliders = product.sliders, slider = [ req.body.imgs[0] ];

      for (let i = 0; i < product.sliders.length; i++) {
        console.log(product.sliders[i][0] == slider[0]);
        if (product.sliders[i][0] == slider[0]) {

        }
        // for (let j = 0; j < product.sliders[i].length; j++) {
        //   
        // }
      }

      // if () {

      // } else for (const i of req.body.imgs.slice(1)) slider.push(new Buffer.from(converter.base64ToJpeg(i), 'base64'));
      // sliders.push(slider);
    } else res.status(404).json({ msg: 'Product not found.' });
  });
  
  // Product.findByIdAndUpdate(req.params.id, { $set: { sliders: sliders } }, { new: true }, (err, product) => {
  //   return product ? res.status(200).json()
  //                  : res.status(404).json({ msg: 'Upload this images failed.' });
  // });
}
