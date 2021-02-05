const bcrypt = require('bcryptjs');
const mongoose = require('mongoose');

const codeSchema = new mongoose.Schema({
  _userId: {
    type: mongoose.Schema.Types.ObjectId,
    required: 'User Id can\'t be empty',
    ref: 'User'
  },
  code: {
    type: String,
    required: 'Code can\'t be empty'
  },
}, {
  timestamps: {
    createdAt: 'createdAt'
  }
});

//#region Events

codeSchema.pre('save', async function (next) {
  this.code = await bcrypt.hash(this.code, await bcrypt.genSalt(10));
  next();
});

//#endregion Events

//#region Methods

codeSchema.methods.verified = function (code) {
  return bcrypt.compareSync(code, this.code);
}

//#endregion Methods

module.exports = mongoose.model('Code', codeSchema);