const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

let userSchema = new mongoose.Schema({
  avatar: {
    type: String,
    default: process.env.DEFAULT_AVATAR
  },
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
  activated: {
    type: Boolean,
    default: false
  },
  mobileNumber: {
    type: String,
    required: 'Mobile Number can\'t be empty'
  },
  username: {
    type: String,
    required: 'Username can\'t be empty',
    unique: true
  },
  password: {
    type: String,
    required: 'Password can\'t be empty',
    minlength: [8, 'Password must be at least 8 characters long']
  },
  role: {
    type: String,
    enum: [ 'root', 'admin', 'user' ],
    default: 'user'
  },
  address: String,
  saltSecret: String
}, {
  timestamps: {
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  }
});

// Custom validation for email
userSchema.path('email').validate(val => {
  emailRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return emailRegex.test(val);
}, 'Invalid email.');

// Events
userSchema.pre('save', function (next) {
  bcrypt.genSalt(10, (err, salt) => {
    bcrypt.hash(this.password, salt, (err, hash) => {
      this.password = hash;
      this.saltSecret = salt;
      next();
    });
  });
});

// Methods
userSchema.methods.verifyPassword = function (password) {
  return bcrypt.compareSync(password, this.password);
}

userSchema.methods.generateJwt = function () {
  return jwt.sign({ _id: this._id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXP });
}

module.exports = mongoose.model('User', userSchema);