const mongoose = require('mongoose');

let productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: 'Name can\'t be empty',
    trim: true
  },
  price: {
    type: Number,
    required: 'Price can\'t be empty'
  },
  star: {
    number: Number,
    countRate: Number
  },
  type: {
    type: String,
    enum: [ 'laptop', 'tablet', 'phone', 'watch', 'accessories' ],
    required: 'Type can\'t be empty'
  },
  description: {
    type: Array,
    required: 'Price can\'t be empty'
  },
  technicalDetails: Array,
  article: String
});

module.exports = mongoose.model('Product', productSchema);