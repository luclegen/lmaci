const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  img: {
    index: {
      type: Number,
      default: 0
    },
    path: String
  },
  name: {
    type: String,
    required: 'Name can\'t be empty',
    trim: true
  },
  price: {
    type: Number,
    required: 'Price can\'t be empty'
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
  type: {
    type: String,
    enum: [ 'laptop', 'tablet', 'phone', 'watch', 'accessories' ],
    required: 'Type can\'t be empty'
  },
  colors: Array,
  properties: Array,
  technicalDetails: Array,
  post: {
    content: String,
    dateModified: Date
  },
  slideshows: Array,
  reviews: Array,
  comments: Array
}, {
  timestamps: {
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  }
});

//#region Validation

productSchema.path('price').validate(val => val >= 0, 'Invalid price');
productSchema.path('quantity.imported').validate(val => Number.isInteger(val) && val > -1, 'Invalid imported quantity');
productSchema.path('quantity.exported').validate(val => Number.isInteger(val) && val > -1, 'Invalid exported quantity');

//#endregion Validation

module.exports = mongoose.model('Product', productSchema);