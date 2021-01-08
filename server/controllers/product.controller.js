const ObjectId = require('mongoose').Types.ObjectId;
const rimraf = require('rimraf');

const Product = require('../models/product.model');

module.exports.get = async (req, res) => {
  if (!ObjectId.isValid(req.params.id))
    return res.status(400).json({ msg: `No record with given id: ${req.params.id}` });

  const product = await Product.findById(req.params.id);

  return product ? res.status(200).json({ product: product })
                 : res.status(404).json({ msg: 'Product not found.' });
}

module.exports.uploadSlideshow = async (req, res) => {
  if (!ObjectId.isValid(req.params.id))
    return res.status(400).json({ msg: `No record with given id: ${req.params.id}` });

  const product = await Product.findById(req.params.id);

  if (product) {
    const colors = product.colors.length ? product.colors : [ { option: 'custom', name: 'Default', value: 'default' } ];
    const slideshows = product.slideshows.length ? JSON.parse(JSON.stringify(product.slideshows)) : [];
    const slideshow = JSON.parse(req.body.slideshow);
    const index = slideshows.findIndex(s => s.color == slideshow.color);

    if (index > -1) {
      const oldIndexs = slideshows[index].imgs.map(i => i.index);
      const newIndexs = slideshow.imgs.map(i => i.index);
      const rmIndexs = oldIndexs.filter(i => !newIndexs.includes(i));

      rmIndexs.forEach(r => rimraf.sync('uploads/img/product/' + req.params.id + '/slideshow/' + slideshow.color.replace(/#/, '') + '/' + r + '.jpeg'));
      slideshows[index] = slideshow;
    } else slideshows.push(slideshow);

    const newProduct = await Product.findByIdAndUpdate(req.params.id, { $set: { colors: colors, slideshows: slideshows } }, { new: true });

    return newProduct ? res.status(200).json({ msg: 'Upload sideshow is successfully.' })
                      : res.status(404).json({ msg: 'Upload sideshow failed!' });;
  } else res.status(404).json({ msg: 'Product not found.' });
}

module.exports.post = async (req, res) => {
  if (!ObjectId.isValid(req.params.id))
    return res.status(400).json({ msg: `No record with given id: ${req.params.id}` });

  const post = {
    content: req.body.content,
    dateModified: req.body.dateModified
  };
  const product = await Product.findByIdAndUpdate(req.params.id, { $set: { post: post } }, { new: true });

  return product ? res.status(200).json({ msg: 'Post this product is successfully.' })
                 : res.status(404).json({ msg: 'Product not found.' });
}

module.exports.review = async (req, res) => {
  if (!ObjectId.isValid(req.params.id))
    return res.status(400).json({ msg: `No record with given id: ${req.params.id}` });

  const product = await Product.findById(req.params.id);

  if (product) {
    const reviews = product.reviews, review = {
      index: parseInt(req.body.index),
      user: JSON.parse(req.body.user),
      star: parseInt(req.body.star),
      content: req.body.content,
      imgs: []
    }
  
    for (const f of req.files) review.imgs.push(process.env.SERVER_URL + '/image/?image=product/' + req.params.id + '/review/' + req.body.index + '/' + f.filename);
  
    reviews.push(review);

    const product1 = await Product.findByIdAndUpdate(req.params.id, { $set: { reviews: reviews } }, { new: true });
  
    return product1 ? res.status(200).json({ msg: 'Your review is submitted successfully.' })
                    : res.status(404).json({ msg: 'Product not found.' });
  } else res.status(404).json({ msg: 'Product not found.' });
}

module.exports.deleteReview = async (req, res) => {
  if (!ObjectId.isValid(req.params.id))
    return res.status(400).json({ msg: `No record with given id: ${req.params.id}` });

  rimraf.sync('uploads/img/product/' + req.params.id + '/review/' + req.body.review.index);

  const product = await Product.findByIdAndUpdate(req.params.id, { $set: { reviews: req.body.reviews } }, { new: true });

  return product ? res.status(200).json({ msg: 'Delete review is successfully.' })
                 : res.status(404).json({ msg: 'Product not found.' });
}

module.exports.comment = async (req, res) => {
  if (!ObjectId.isValid(req.params.id))
    return res.status(400).json({ msg: `No record with given id: ${req.params.id}` });

  const product = await Product.findById(req.params.id);

  if (product) {
    const comments = product.comments, comment = {
      index: parseInt(req.body.index),
      user: JSON.parse(req.body.user),
      content: req.body.content,
      imgs: []
    }
  
    for (const f of req.files) comment.imgs.push(process.env.SERVER_URL + '/image/?image=product/' + req.params.id + '/comment/' + req.body.index + '/' + f.filename);
  
    comments.push(comment);

    const product1 = await Product.findByIdAndUpdate(req.params.id, { $set: { comments: comments } }, { new: true });
  
    return product1 ? res.status(200).json({ msg: 'Your comment is submitted successfully.' })
                    : res.status(404).json({ msg: 'Product not found.' });
  } else res.status(404).json({ msg: 'Product not found.' });
}

module.exports.deleteComment = async (req, res) => {
  if (!ObjectId.isValid(req.params.id))
    return res.status(400).json({ msg: `No record with given id: ${req.params.id}` });

  rimraf.sync('uploads/img/product/' + req.params.id + '/comment/' + req.body.comment.index);

  const product = await Product.findByIdAndUpdate(req.params.id, { $set: { comments: req.body.comments } }, { new: true });

  return product ? res.status(200).json({ msg: 'Delete comment is successfully.' })
                 : res.status(404).json({ msg: 'Product not found.' });
}

module.exports.reply = async (req, res) => {
  if (!ObjectId.isValid(req.params.id))
    return res.status(400).json({ msg: `No record with given id: ${req.params.id}` });

  const product = await Product.findById(req.params.id);

  if (product) {
    const comments = product.comments, comment = JSON.parse(req.body.cmt), answers = comments.filter(c => c.index == comment.index)[0].answers ? comments.filter(c => c.index == comment.index)[0].answers : [], answer = {
      index: parseInt(req.body.index),
      user: JSON.parse(req.body.user),
      content: req.body.content,
      imgs: []
    }
  
    for (const f of req.files) answer.imgs.push(process.env.SERVER_URL + '/image/?image=product/' + req.params.id + '/comment/' + comment.index + '/answer/' + req.body.index + '/' + f.filename);
  
    answers.push(answer);
    comments[comments.findIndex(c => c.index == comment.index)].answers = answers;

    const product1 = await Product.findByIdAndUpdate(req.params.id, { $set: { comments: comments } }, { new: true });
  
    return product1 ? res.status(200).json({ msg: 'Your answer is submitted successfully.' })
                    : res.status(404).json({ msg: 'Product not found.' });
  } else res.status(404).json({ msg: 'Product not found.' });
}

module.exports.deleteAnswer = async (req, res) => {
  if (!ObjectId.isValid(req.params.id))
    return res.status(400).json({ msg: `No record with given id: ${req.params.id}` });

  rimraf.sync('uploads/img/product/' + req.params.id + '/comment/' + req.body.comment.index + '/answer/' + req.body.answer.index);

  const product = await Product.findByIdAndUpdate(req.params.id, { $set: { comments: req.body.comments } }, { new: true });

  return product ? res.status(200).json({ msg: 'Delete answer is successfully.' })
                 : res.status(404).json({ msg: 'Product not found.' });
}
