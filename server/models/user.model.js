const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const userSchema = new mongoose.Schema({
  name: {
    first: {
      type: String,
      required: 'First name can\'t be empty'
    },
    last: {
      type: String,
      required: 'Last name can\'t be empty'
    }
  },
  fullName: String,
  gender: {
    type: String,
    enum: [ 'male', 'female', 'other' ],
    required: 'Gender can\'t be empty'
  },
  email: {
    type: String,
    trim: true,
    lowercase: true,
    required: 'Email can\'t be empty'
  },
  mobileNumber: {
    type: String,
    required: 'Mobile Number can\'t be empty'
  },
  address: String,
  avatar: {
    type: String,
    default: process.env.DEFAULT_AVATAR
  },
  username: {
    type: String,
    required: 'Username can\'t be empty',
    unique: true
  },
  password: {
    type: String,
    required: 'Password can\'t be empty',
    minlength: [ 8, 'Password must be at least 8 characters long' ]
  },
  activated: {
    type: Boolean,
    default: false
  },
  role: {
    type: String,
    enum: [ 'root', 'admin', 'user' ],
    default: 'user'
  },
}, {
  timestamps: {
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  }
});

//#region Validation

userSchema.path('username').validate(val => /^(?=[a-zA-Z0-9._]{1,20}$)/.test(val), 'Invalid username.');
userSchema.path('email').validate(val => /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(val), 'Invalid email.');
userSchema.path('mobileNumber').validate(val => /^(\+\d{1,3}[- ]?)?\d{10}$/.test(val), 'Invalid mobile number.');

//#endregion Validation

//#region Events

userSchema.pre('save', async function (next) {
  this.password = await bcrypt.hash(this.password, await bcrypt.genSalt(10));
  next();
});

//#endregion Events

//#region Methods

userSchema.methods.verified = function (password) {
  return bcrypt.compareSync(password, this.password);
}

userSchema.methods.getToken = function () {
  return jwt.sign({ _id: this._id, username: this.username, admin: this.role == 'root' || this.role == 'admin', activated: this.activated }, process.env.JWT_SECRET, this.activated ? {} : { expiresIn: process.env.JWT_EXP });
}

//#endregion Methods

module.exports = mongoose.model('User', userSchema);