const mongoose = require('mongoose');

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
  colors: Array,
  properties: Array,
  technicalDetails: Array,
  description: String,
  post: String
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

module.exports = mongoose.model('Product', productSchema);