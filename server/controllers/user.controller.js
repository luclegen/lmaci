const passport = require('passport');
const _ = require('lodash');
const ObjectId = require('mongoose').Types.ObjectId;

const nameConverter = require('../helpers/name-converter');
const mailer = require('../helpers/mailer');
const codeGenerator = require('../helpers/code-generator');

const User = require('../models/user.model');
const Code = require('../models/code.model');

module.exports.register = (req, res, next) => {
  let user = new User();

  user.firstName = nameConverter.convertName(req.body.firstName);
  user.lastName = nameConverter.convertName(req.body.lastName);
  user.fullName = nameConverter.convertName(req.body.firstName) + ' ' + nameConverter.convertName(req.body.lastName);
  user.gender = req.body.gender;
  user.email = req.body.email;
  user.mobileNumber = req.body.mobileNumber;
  user.username = req.body.username;
  user.password = req.body.password;
  if (req.body.role) user.role = req.body.role;
  user.address = req.body.address;
  
  user.save((err, user) => {
    if (err) {
      if (err.code == 11000) res.status(422).send(['Username is duplicate. Please try again!']);
      else return next(err);
    } else {
      res.send(user);
    }
  });
}

module.exports.verifyEmail = (req, res) => {
  if (!ObjectId.isValid(req.params.id))
    return res.status(400).json({ msg: `No record with given id: ${req.params.id}` });

  User.findById(req.params.id, (err, user) => {
    if (!user) return res.status(404).json({ msg: 'User specified wasn\'t found.' });
    let userVerified = {
      email: user.email,
      isVerified: true
    }, userEmailRemoved = {
      email: '',
      isVerified: false
    }
    
    if (user.isVerified) return res.status(422).json({ msg: 'Email is verified.' });
    else if (req.body.code == user.emailVerifyCode) {
      User.updateMany({ email: userVerified.email }, { $set: userEmailRemoved }, { multi: true }, (err, result) => {
        if (err) return res.status(404).json({ msg: 'Duplicated emails weren\'t found.' });
        else {
          User.findByIdAndUpdate(req.params.id, { $set: userVerified }, { new: true }, (err, result) => {
            return err ? res.status(404).json({ msg: 'User Verified wasn\'t found.' })
                       : res.status(200).json({ msg: 'Email is verified.' });
          });
        }
      });
    } else return res.status(403).json({ msg: 'Verification Code is wrong.' });
  });
}

module.exports.resendVerifyEmail = (req, res) => {
  if (!ObjectId.isValid(req.params.id))
    return res.status(400).json({ msg: `No record with given id: ${req.params.id}` });

  User.findById(req.params.id, (err, user) => {
    if (user) {
      if (user.emailVerified) return res.status(422).json({ msg: 'Email is verified.' });
      mailer.sendVerifyEmail(user.email, 'Verify Email', user.emailVerifyCode);
      return res.status(200).json({ msg: 'Resent Verification Code.' });
    } else return res.status(404).json({ msg: 'User not found.' });
  });
}

module.exports.changeEmail = (req, res) => {
  if (!ObjectId.isValid(req.params.id))
    return res.status(400).json({ msg: `No record with given id: ${req.params.id}` });

  User.findByIdAndUpdate(req.params.id, { $set: { email: req.body.email, emailVerifyCode: codeGenerator.generateCode(6), emailVerified: false } }, { new: true }, (err, user) => {
    if (user) {
      mailer.sendVerifyEmail(user.email, 'Verify Email', user.emailVerifyCode);
      res.status(200).json({ msg: 'Email is changed.' });
    } else res.status(404).json({ msg: 'User not found.' });
  });
}

module.exports.authenticate = (req, res) => {
  // Call for passport authentication
  passport.authenticate('local', (err, user, info) => {
    if (err) return res.status(400).json(err); // Error from passport middleware
    else if (user) {
      if (!user.isVerified) {
        Code.deleteMany({ _userId: user._id }, err => {
          if (err) console.log('ERROR: Clear codes: ' + JSON.stringify(err, undefined, 2))
        });

        let code = new Code();

        code._userId = user._id;
        code.code = codeGenerator.generateCode(6);

        code.save((err, code) => {
          if (err) console.log('ERROR: User code: ' + JSON.stringify(err, undefined, 2));
          else mailer.sendVerifyEmail(user.email, 'Verify Email', code.code);
        });
      }
      return res.status(200).json({ "token": user.generateJwt() }) // Registered user
    } else return res.status(404).json(info); // Unknow user or wrong password
  })(req, res);
}

module.exports.findUsername = (req, res) => {
  User.findOneAndUpdate({ email: req.body.email, emailVerified: true }, { $set: { emailVerifyCode: codeGenerator.generateCode(6) } }, { new: true}, (err, user) => {
    if (user) {
      mailer.sendVerifyEmail(user.email, 'Verify Reset Password', user.emailVerifyCode);
      return res.status(200).json({ username: user.username, msg: 'Sent a code verification to email of username: ' + user.username });
    } else res.status(404).json({ msg: 'User is not found.' });
  });
}

module.exports.resendVerifyResetPassword = (req, res) => {
  User.findOne({ username: req.params.username }, (err, user) => {
    if (user) {
      mailer.sendVerifyEmail(user.email, 'Verify Reset Password', user.emailVerifyCode);
      return res.status(200).json({ msg: 'Resent Verification Code.' });
    } else return res.status(404).json({ msg: 'User not found.' });
  });
}

module.exports.resetPassword = (req, res) => {
  User.findOne({ username: req.params.username, emailVerifyCode: req.body.code, emailVerified: true }, (err, user) => {
    if (user) {
      user.emailVerifyCode = '';
      user.password = req.body.password;

      user.save(err => {
        return err ? res.status(400).json({ msg: 'Update is error.' })
                   : res.status(200).json({ msg: 'Password reset successfully.' });
      });
    } else return res.status(404).json({ msg: 'Verification Code is wrong.' });
  });
}

module.exports.changePassword = (req, res) => {
  if (!ObjectId.isValid(req.params.id))
    return res.status(400).json({ msg: `No record with given id: ${req.params.id}` });
  
  User.findById(req.params.id, (err, user) => {
    if (user) {
      if (!user.emailVerified) return res.status(422).json({ msg: 'Email isn\'t verified.' });
      if (user.verifyPassword(req.body.password)) {
        user.password = req.body.newPassword
        
        user.save(err => {
          return err ? res.status(400).json({ msg: 'Update is error.' })
                   : res.status(200).json({ msg: 'Password was successfully changed.' });
        });
      } else return res.status(403).json({ msg: 'Wrong password.' });
    } else return res.status(404).json({ msg: 'User not found.' });
  });
}

module.exports.profile = (req, res) => {
  User.findOne({ _id: req._id }, (err, user) => {
    return user ? res.status(200).json({ status: true, user: _.pick(user, [ 'avatar', 'firstName', 'fullName', 'role', 'email', 'emailVerified', 'mobileNumber', 'username', 'address']) })
                : res.status(404).json({ status: false, msg: 'User not found.' });
  });
}