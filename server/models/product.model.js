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
  post: String,
  slides: [[Buffer]]
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

productSchema.virtual('slidesPaths').get(function() {
  if (this.slides.length) {
    let slidesPaths = [];
    for (let i = 0; i < this.slides.length; i++) {
      if (this.slides[i].length) {
        var slidePaths = [];
        for (let j = 0; j < this.slides[i].length; j++) slidePaths.push(`data:image/png;base64,${this.slides[i][j].toString('base64')}`);
        slidesPaths.push(slidePaths);
      }
    }
    return slidesPaths;
  }
})

module.exports = mongoose.model('Product', productSchema);