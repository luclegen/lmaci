const mongoose = require('mongoose');

let codeSchema = new mongoose.Schema({
  _userId: {
    type: mongoose.Schema.Types.ObjectId,
    required: 'User Id can\'t be empty',
    ref: 'User'
  },
  code: {
    type: String,
    required: 'Code can\'t be empty',
  },
}, {
  timestamps: {
    createdAt: 'createdAt'
  }
});

module.exports = mongoose.model('Code', codeSchema);