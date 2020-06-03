const mongoose = require('mongoose');

let productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: 'Name can\'t be empty',
    trim: true
  },
  status: String,
  quantity: {
    imported: {
      type: Number,
      required: 'Quantity imported can\'t be empty',
    },
    exported: {
      type: Number,
      default: 0
    },
  },
  price: {
    type: Number,
    required: 'Price can\'t be empty'
  },
  star: {
    number: {
      type: Number,
      default: 0
    },
    countRate: {
      type: Number,
      default: 0
    }
  },
  type: {
    type: String,
    enum: [ 'laptop', 'tablet', 'phone', 'watch', 'accessories' ],
    required: 'Type can\'t be empty'
  },
  description: {
    type: String,
    required: 'Description can\'t be empty'
  },
  colors: Array,
  technicalDetails: Array,
  post: String
}, {
  timestamps: {
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  }
});

module.exports = mongoose.model('Product', productSchema);