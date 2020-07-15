const mongoose = require('mongoose');
const { review } = require('../controllers/product.controller');

let productSchema = new mongoose.Schema({
  img: Buffer,
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
  sliders: Array,
  reviews: Array
}, {
  toObject: {
    virtuals: true
  },
  toJSON: {
    virtuals: true 
  },
  timestamps: {
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  }
});

productSchema.virtual('imgPath').get(function() {
  if (this.img) return `data:image/png;base64,${this.img.toString('base64')}`;
})

productSchema.virtual('slidersPaths').get(function() {
  let slidersPaths = [];
  for (let i = 0; i < this.sliders.length; i++) {
    var sliderPaths = [];
    sliderPaths.push(this.sliders[i][0]);
    for (let j = 1; j < this.sliders[i].length; j++) sliderPaths.push(`data:image/jpeg;base64,${this.sliders[i][j].toString('base64')}`);
    slidersPaths.push(sliderPaths);
  }
  return slidersPaths;
})

module.exports = mongoose.model('Product', productSchema);