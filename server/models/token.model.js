const mongoose = require('mongoose');

const tokenSchema = new mongoose.Schema({
  _userId: {
    type: mongoose.Schema.Types.ObjectId,
    required: 'User Id can\'t be empty',
    ref: 'User'
  },
  token: {
    type: String,
    required: 'Token can\'t be empty',
  },
  createdAt: {
    type: Date,
    required: 'createdAt can\'t be empty',
    default: Date.now,
    expires: 43200
  }
});