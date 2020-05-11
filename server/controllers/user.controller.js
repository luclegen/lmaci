const passport = require('passport');
const _ = require('lodash');

const nameConverter = require('../helpers/name-converter');
const mailer = require('../helpers/mailer');
const codeGenerator = require('../helpers/code-generator');

const User = require('../models/user.model');

module.exports.register = (req, res, next) => {
  let user = new User();

  user.avatar = process.env.DEFAULT_AVATAR;
  user.firstName = nameConverter.convertName(req.body.firstName);
  user.lastName = nameConverter.convertName(req.body.lastName);
  user.fullName = nameConverter.convertName(req.body.firstName) + ' ' + nameConverter.convertName(req.body.lastName);

  if (req.body.role) user.role = req.body.role;
  else user.role = process.env.DEFAULT_ROLE;

  if (req.body.email) {
    user.email = req.body.email;
    user.emailVerifyCode = codeGenerator.generateCode(6);
    user.emailVerified = false;
  }

  if (req.body.mobileNumber) user.mobileNumber = req.body.mobileNumber;

  user.username = req.body.username;
  user.password = req.body.password;
  user.address = req.body.address;
  
  user.save((err, user) => {
    if (err) {
      if (err.code == 11000) res.status(422).send(['Username is duplicate. Please try again!']);
      else return next(err);
    } else {
      mailer.sendVerifyEmail(user.email, 'Verify Email', user.emailVerifyCode);
      res.send(user);
    }
  });
}

module.exports.verifyEmail = (req, res) => {
  User.findById(req.params.id, (err, user) => {
    let userVerified = {
      email: user.email,
      emailVerifyCode: '',
      emailVerified: true
    }, userEmailRemoved = {
      email: '',
      emailVerifyCode: '',
      emailVerified: false
    }
    
    if (user.emailVerified) return res.status(422).json({ status: true, message: 'Email is verified.' })
    else if (req.body.code == user.emailVerifyCode) {
      User.updateMany({ email: userVerified.email }, { $set: userEmailRemoved }, { multi: true }, (err, result) => {
        if (err) return res.status(404).json({ message: 'Duplicated emails weren\'t found.' });
        else {
          User.findByIdAndUpdate(req.params.id, { $set: userVerified }, { new: true }, (err, result) => {
            return err ? res.status(404).json({ message: 'User Verified wasn\'t found.' })
                       : res.status(200).json({ status: true, message: 'Email is verified.' });
          });
        }
      });
    } else return res.status(403).json({ message: 'Verification Code is wrong.' });
  });
}

module.exports.resendVerifyEmail = (req, res) => {
  User.findById(req.params.id, (err, user) => {
    if (user) {
      if (user.emailVerified) return res.status(422).json({ message: 'Email is verified.' });
      mailer.sendVerifyEmail(user.email, 'Verify Email', user.emailVerifyCode);
      return res.status(200).json({ message: 'Resent Verification Code.' });
    } else return res.status(404).json({ message: 'User not found.' });
  });
}
