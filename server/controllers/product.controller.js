const ObjectId = require('mongoose').Types.ObjectId;

const Product = require('../models/product.model');

const converter = require('../helpers/converter');

module.exports.get = (req, res) => {
  if (!ObjectId.isValid(req.params.id))
    return res.status(400).json({ msg: `No record with given id: ${req.params.id}` });

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
      const sliders = [], slider = Array.isArray(req.body.imgs) ? [ req.body.imgs[0] ] : [ req.body.imgs ];
      let replace = false;

      for (let i = 0; i < product.slidersPaths.length; i++) {
        const slider = [];
        slider.push(product.slidersPaths[i][0]);
        for (let j = 1; j < product.slidersPaths[i].length; j++) slider.push(new Buffer.from(converter.base64ToJpeg(product.slidersPaths[i][j]), 'base64'));
        sliders.push(slider);
      }

      if (Array.isArray(req.body.imgs)) for (const i of req.body.imgs.slice(1)) slider.push(new Buffer.from(converter.base64ToJpeg(i), 'base64'));

      for (let i = 0; i < product.sliders.length; i++) {
        if (slider[0] == product.sliders[i][0]) {
          sliders[i] = slider;
          replace = true;
        }
      }

      if (!replace) sliders.push(slider);
      
      Product.findByIdAndUpdate(req.params.id, { $set: { sliders: sliders } }, { new: true }, (err, product) => {
        return product ? res.status(200).json({ msg: 'Upload this images is successfully.' })
                      : res.status(404).json({ msg: 'Upload this images failed!' });
      });
    } else res.status(404).json({ msg: 'Product not found.' });
  });
}

module.exports.post = (req, res) => {
  if (!ObjectId.isValid(req.params.id))
    return res.status(400).json({ msg: `No record with given id: ${req.params.id}` });

    let post = {
      content: req.body.content,
      dateModified: req.body.dateModified
    };

  Product.findByIdAndUpdate(req.params.id, { $set: { post: post } }, { new: true }, (err, product) => {
    return product ? product.hasOwnProperty('post') ? res.status(200).json({ msg: 'Update this post is successfully.' })
                                                    : res.status(200).json({ msg: 'Post this product is successfully.' })
                   : res.status(404).json({ msg: 'Product not found.' });
  });
}
