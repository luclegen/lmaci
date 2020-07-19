const ObjectId = require('mongoose').Types.ObjectId;
const rimraf = require('rimraf');

const Product = require('../models/product.model');

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
      const paths = JSON.parse(req.body.paths);
      let replace = false;
      const sliders = product.sliders ? product.sliders : [];
      const indexs = sliders.filter(s => s.color == req.body.color).length ? sliders.filter(s => s.color == req.body.color)[0].imgs.map(i => i.index).concat(JSON.parse(req.body.indexs)) : JSON.parse(req.body.indexs);
      const slider = {
        color: req.body.color,
        imgs: []
      };
      
      paths.forEach(path => {
        const img = {
          index: indexs.filter(index => (new RegExp(req.body.color.replace(/#/, '') + '/' + index + '.jpeg')).test(path))[0],
          path: path
        }
        indexs.splice(indexs.indexOf(img.index), 1)
        slider.imgs.push(img);
      })

      sliders.forEach(s => {
        if (s.color == req.body.color) {
          sliders[sliders.indexOf(s)] = slider;
          replace = true;
        }
      });
      if (!replace) sliders.push(slider);

      indexs.forEach(i => rimraf.sync('uploads/img/product/' + req.params.id + '/slider/' + req.body.color.replace(/#/, '') + '/' + i + '.jpeg'));
      
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
    return product ? res.status(200).json({ msg: 'Post this product is successfully.' })
                   : res.status(404).json({ msg: 'Product not found.' });
  });
}

module.exports.review = (req, res) => {
  if (!ObjectId.isValid(req.params.id))
    return res.status(400).json({ msg: `No record with given id: ${req.params.id}` });

  Product.findById(req.params.id, (err, product) => {
    let reviews = product.reviews, review = {
      index: req.body.index,
      user: JSON.parse(req.body.user),
      star: req.body.star,
      content: req.body.content,
      imgs: []
    }
  
    let urlImg = process.env.SERVER_URL + '/image/?image=product/' + req.params.id + '/review/' + req.body.index + '/';

    for (const f of req.files) review.imgs.push(urlImg + f.filename);
  
    reviews.push(review);
  
    Product.findByIdAndUpdate(req.params.id, { $set: { reviews: reviews } }, { new: true }, (err, product) => {
      return product ? res.status(200).json({ msg: 'Your review is submitted successfully.' })
                     : res.status(404).json({ msg: 'Product not found.' });
    });
  });
}
