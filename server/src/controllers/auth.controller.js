const passport = require('passport');
const _ = require('lodash');
const ObjectId = require('mongoose').Types.ObjectId;

const converter = require('../helpers/converter');
const mailer = require('../helpers/mailer');
const generator = require('../helpers/generator');
const cleaner = require('../helpers/cleaner');

const User = require('../models/user.model');
const Code = require('../models/code.model');
const e = require('express');

module.exports.register = async (req, res, next) => {
  const user = new User();

  user.name.first = converter.toName(req.body.firstName);
  user.name.last = converter.toName(req.body.lastName);
  user.fullName = user.name.first + ' ' + user.name.last;

  user.gender = req.body.gender;
  user.email = req.body.email;
  user.mobileNumber = req.body.mobileNumber;
  user.address = req.body.address;

  user.username = req.body.username;
  user.password = req.body.password;

  if (user.username == 'root') {
    user.avatar = process.env.AVATARS + 'root.png';
    user.role = 'root';
  }
  
  try {
    return res.send(await user.save());
  } catch (err) {
    return err.code === 11000 ? res.status(422).send({ msg: 'Username is duplicate. Please try again!' })
                              : next(err);
  }
}

module.exports.activate = async (req, res) => {
  if (!ObjectId.isValid(req.params.id))
    return res.status(400).json({ msg: `No record with given id: ${req.params.id}` });

  const user = await User.findById(req.params.id);

  if (user) {
    const userActivated = {
      email: user.email,
      activated: true
    }, userEmailRemoved = {
      email: '',
      activated: false
    };

    if (user.activated) return res.status(422).json({ msg: 'Your account is activated.' });
    else {
      const code = await Code.findOne({ _userId: req.params.id });

      if (code) {
        if (Date.now() > Date.parse(code.createdAt) + 60000) return res.status(400).json({ msg: 'Code is expired. Please click to resend email!' });
        else if (code.verified(req.body.code)) {
          const result = await User.updateMany({ email: userActivated.email }, { $set: userEmailRemoved }, { multi: true });

          if (result.n) {
            const result1 = await User.findByIdAndUpdate(user._id, { $set: userActivated }, { new: true });

            return result1 ? cleaner.deleteCode(user._id) ? res.status(200).json({ msg: 'Activate your account is successfully.' }) : res.status(400).json({ msg: 'Clean your code is failed.' })
                           : res.status(404).json({ msg: 'User Verified isn\'t found.' });
          }
        }
        else return res.status(403).json({ msg: 'Verification Code is wrong.' });
      }
    }
  } else return res.status(404).json({ msg: 'User specified isn\'t found.' });
}

module.exports.resendActivate = async (req, res, next) => {
  if (!ObjectId.isValid(req.params.id))
    return res.status(400).json({ msg: `No record with given id: ${req.params.id}` });

  const user = await User.findById(req.params.id);

  if (user) {
    if (user.activated) return res.status(422).json({ msg: 'Email is verified.' });
    else {
      const newCode = new Code();
      const code = generator.getCode(6);

      cleaner.deleteCode(user._id);
      newCode._userId = user._id;
      newCode.code = code;

      try {
        setTimeout(() => cleaner.deleteCode(user._id), 5 * 60000);
        mailer.sendVerifyEmail(user.email, 'Verify Email', code);
        return await newCode.save() ? res.status(200).json({ msg: 'Resent Verification Code.' }) : res.status(404).json({ msg: 'Code not found.' });
      } catch (err) {
        next(err);
      }
    }
  } else return res.status(404).json({ msg: 'User not found.' });
}

module.exports.changeEmail = async (req, res) => {
  if (!ObjectId.isValid(req.params.id))
    return res.status(400).json({ msg: `No record with given id: ${req.params.id}` });

  const user = await User.findByIdAndUpdate(req.params.id, { $set: { email: req.body.email, activated: false } }, { new: true });

  return user ? res.status(200).json({ msg: 'Change email is successfully.' })
              : res.status(404).json({ msg: 'User not found.' });
}

module.exports.authenticate = (req, res) => {
  passport.authenticate('local', (err, user, info) => {
    return err ? res.status(400).json(err)
               : user ? res.status(200).json({ token: user.getToken() })
                      : res.status(404).json(info);
  })(req, res);
}

module.exports.findUsername = async (req, res) => {
  const user = await User.findOne({ email: req.body.email, activated: true });

  return user ? res.status(200).json({ username: user.username, msg: 'Your username is: ' + user.username })
              : res.status(404).json({ msg: 'User is not found.' });
}

module.exports.resendVerifyResetPassword = async (req, res, next) => {
  const user = await User.findOne({ username: req.params.username, activated: true });

  if (user) {
    const code = generator.getCode(6);
    const newCode = new Code();

    cleaner.deleteCode(user._id);
    newCode._userId = user._id;
    newCode.code = code;

    try {
      setTimeout(() => cleaner.deleteCode(user._id), 90000);
      mailer.sendVerifyEmail(user.email, 'Verify Reset Password', code);
      return await newCode.save() ? res.status(200).json({ msg: 'Resent Verification Code.' }) : res.status(404).json({ msg: 'Code not found.' });
    } catch (err) {
      next(err);
    }
  } else return res.status(404).json({ msg: 'User not found.' });
}

module.exports.resetPassword = async (req, res, next) => {
  const user = await User.findOne({ username: req.params.username, activated: true });
  if (user) {
    const code = await Code.findOne({ _userId: user._id });

    if (code) {
      if (Date.now() > Date.parse(code.createdAt) + 90000) return res.status(400).json({ msg: 'Code is expired. Please click to resend email!' });
      else if (code.verified(req.body.code)) {
        user.password = req.body.password;

        try {
          return await user.save() ? cleaner.deleteCode(user._id) ? res.status(200).json({ msg: 'Reset Password is successfully.' }) : res.status(400).json({ msg: 'Clean your code is failed.' })
                                   : res.status(404).json({ msg: 'User not found.' });
        } catch (err) {
          next(err);
        }
      } else return res.status(403).json({ msg: 'Verification Code is wrong.' });
    } else return res.status(404).json({ msg: 'Code not found.' });
  } else return res.status(404).json({ msg: 'User not found.' });
}

module.exports.changePassword = async (req, res, next) => {
  if (!ObjectId.isValid(req.params.id))
    return res.status(400).json({ msg: `No record with given id: ${req.params.id}` });
  
  const user = await User.findById(req.params.id);

  if (user) {
    if (user.verified(req.body.password)) {
      user.password = req.body.newPassword;

      try {
        return await user.save() ? res.status(200).json({ msg: 'Change Password is successfully.' }) : res.status(400).json({ msg: 'Change Password is failded.' });
      } catch (err) {
        next(err);
      }
    } else return res.status(403).json({ msg: 'Wrong password.' });
  } else return res.status(404).json({ msg: 'User not found.' });
}

module.exports.info = async (req, res) => {
  const user = await User.findById(req._id);

  return user ? res.status(200).json({ status: true, user: _.pick(user, [ 'avatar', 'name.first', 'activated', 'username', 'role']) })
              : res.status(404).json({ status: false, msg: 'User not found.' });
}