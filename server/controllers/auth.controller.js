const passport = require('passport');
const _ = require('lodash');
const ObjectId = require('mongoose').Types.ObjectId;

const converter = require('../helpers/converter');
const mailer = require('../helpers/mailer');
const generator = require('../helpers/generator');

const User = require('../models/user.model');
const Code = require('../models/code.model');

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
    return err.code === 11000 ? res.status(422).send([ 'Username is duplicate. Please try again!' ])
                              : next(err);
  }
}

module.exports.active = async (req, res) => {
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
        else if (req.body.code === code.code) {
          const result = await User.updateMany({ email: userActivated.email }, { $set: userEmailRemoved }, { multi: true });

          if (result.n) {
            const result1 = await User.findByIdAndUpdate(user._id, { $set: userActivated }, { new: true });

            if (result1) {
              const result2 = await Code.deleteOne({ _userId: user._id });

              return result2 ? res.status(200).json({ msg: 'Active your account is successfully.' })
                             : res.status(400).json({ msg: 'Clean your code is failed.' });
            } else return res.status(404).json({ msg: 'User Verified isn\'t found.' });
          }
        }
        else return res.status(403).json({ msg: 'Verification Code is wrong.' });
      }
    }
  } else return res.status(404).json({ msg: 'User specified isn\'t found.' });
}

module.exports.resendActive = async (req, res) => {
  if (!ObjectId.isValid(req.params.id))
    return res.status(400).json({ msg: `No record with given id: ${req.params.id}` });

  const user = await User.findById(req.params.id);

  if (user) {
    if (user.activated) return res.status(422).json({ msg: 'Email is verified.' });
    else {
      try {
        Code.deleteOne({ _userId: user._id }, err => {
          if (err) console.log('ERROR: Clear codes: ' + JSON.stringify(err, undefined, 2))
        });

        const newCode = new Code();

        newCode._userId = user._id;
        newCode.code = generator.generateCode(6);

        try {
          mailer.sendVerifyEmail(user.email, 'Verify Email', (await newCode.save()).code);
          return res.status(200).json({ msg: 'Resent Verification Code.' });
        } catch (err) {
          return res.status(400).json(err);
        }
      } catch (err) {
        return res.status(400).json(err);
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
               : user ? res.status(200).json({ "token": user.generateJwt() })
                      : res.status(404).json(info);
  })(req, res);
}

module.exports.findUsername = async (req, res) => {
  const user = await User.findOne({ email: req.body.email, activated: true });

  return user ? res.status(200).json({ username: user.username, msg: 'Your username is: ' + user.username })
              : res.status(404).json({ msg: 'User is not found.' });
}

module.exports.resendVerifyResetPassword = async (req, res) => {
  const user = await User.findOne({ username: req.params.username, activated: true });

  if (user) {
    Code.deleteOne({ _userId: user._id }, err => {
      if (err) console.log('ERROR: Clear codes: ' + JSON.stringify(err, undefined, 2))
    });

    const code = new Code();

    code._userId = user._id;
    code.code = generator.generateCode(6);

    try {
      mailer.sendVerifyEmail(user.email, 'Verify Reset Password', (await code.save()).code);
      return res.status(200).json({ msg: 'Resent Verification Code.' });
    } catch (err) {
      console.log('ERROR: User code: ' + JSON.stringify(err, undefined, 2));
    }
  } else return res.status(404).json({ msg: 'User not found.' });
}

module.exports.resetPassword = async (req, res) => {
  const user = await User.findOne({ username: req.params.username, activated: true });
  if (user) {
    const code = await Code.findOne({ _userId: user._id });
    if (code) {
      if (Date.now() > Date.parse(code.createdAt) + 90000) return res.status(400).json({ msg: 'Code is expired. Please click to resend email!' });
      else if (req.body.code === code.code) {
        user.password = req.body.password;

        user.save(err => {
          if (err) return res.status(400).json({ msg: 'Update is error.' });
          else {
            Code.deleteOne({ _userId: user._id }, err => {
              return err ? res.status(400).json(err)
                         : res.status(200).json({ msg: 'Reset Password is successfully.' });
            });
          }
        });
      } else return res.status(403).json({ msg: 'Verification Code is wrong.' });
    } else return res.status(404).json({ msg: 'Code isn\'t found.' });
  } else return res.status(404).json({ msg: 'User isn\'t found.' });
}

module.exports.changePassword = async (req, res) => {
  if (!ObjectId.isValid(req.params.id))
    return res.status(400).json({ msg: `No record with given id: ${req.params.id}` });
  
  const user = await User.findById(req.params.id);

  if (user) {
    if (user.verifyPassword(req.body.password)) {
      user.password = req.body.newPassword;
      
      user.save(err => {
        return err ? res.status(400).json({ msg: 'Change Password is failded.' })
                   : res.status(200).json({ msg: 'Change Password is successfully.' });
      });
    } else return res.status(403).json({ msg: 'Wrong password.' });
  } else return res.status(404).json({ msg: 'User not found.' });
}

module.exports.info = async (req, res) => {
  const user = await User.findById(req._id);

  return user ? res.status(200).json({ status: true, user: _.pick(user, [ 'avatar', 'name.first', 'activated', 'username', 'role']) })
              : res.status(404).json({ status: false, msg: 'User not found.' });
}