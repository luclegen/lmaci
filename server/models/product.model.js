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
  description: {
    type: String,
    required: 'Price can\'t be empty'
  }
});

module.exports = mongoose.model('Product', productSchema);