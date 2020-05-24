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
  if (user.username == 'root') user.role = 'root';
  if (user.username == 'root') user.avatar = process.env.AVATARS + 'root.png';
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

module.exports.active = (req, res) => {
  if (!ObjectId.isValid(req.params.id))
    return res.status(400).json({ msg: `No record with given id: ${req.params.id}` });

  User.findById(req.params.id, (err, user) => {
    if (!user) return res.status(404).json({ msg: 'User specified isn\'t found.' });
    let useractivated = {
      email: user.email,
      activated: true
    }, userEmailRemoved = {
      email: '',
      activated: false
    }
    
    if (user.activated) return res.status(422).json({ msg: 'Your account has been activated.' });
    else {
      Code.findOne({ _userId: req.params.id }, (err, code) => {
        if (err) return res.status(400).json(err);
        else if (code) {
          if (Date.now() > Date.parse(code.createdAt) + 60000) return res.status(400).json({ msg: 'Code is expired. Please click to resend email!' });
          else if (req.body.code === code.code) {
            User.updateMany({ email: useractivated.email }, { $set: userEmailRemoved }, { multi: true }, (err, result) => {
              if (err) return res.status(404).json({ msg: 'Duplicated emails weren\'t found.' });
              else {
                User.findByIdAndUpdate(user._id, { $set: useractivated }, { new: true }, (err, result) => {
                  if (err) return  res.status(404).json({ msg: 'User Verified isn\'t found.' });
                  else {
                    Code.deleteOne({ _userId: user._id }, (err, result) => {
                      return err ? res.status(400).json(err)
                                 : res.status(200).json({ msg: 'Your account has been activated.' });
                    });
                  }
                });
              }
            });
          }
          else return res.status(403).json({ msg: 'Verification Code is wrong.' });
        } else return res.status(404).json({ msg: 'Code isn\'t found.' });
      });
    }
  });
}

module.exports.resendActive = (req, res) => {
  if (!ObjectId.isValid(req.params.id))
    return res.status(400).json({ msg: `No record with given id: ${req.params.id}` });

  User.findById(req.params.id, (err, user) => {
    if (user) {
      if (user.activated) return res.status(422).json({ msg: 'Email is verified.' });
      else {
        Code.findOne({ _userId: req.params.id }, (err, code) => {
          if (err) return res.status(400).json(err);
          else {
            Code.deleteOne({ _userId: user._id }, err => {
              if (err) console.log('ERROR: Clear code: ' + JSON.stringify(err, undefined, 2))
            });
    
            let code = new Code();
    
            code._userId = user._id;
            code.code = codeGenerator.generateCode(6);
    
            code.save((err, code) => {
              if (err) return res.status(400).json(err);
              else {
                mailer.sendVerifyEmail(user.email, 'Verify Email', code.code);
                return res.status(200).json({ msg: 'Resent Verification Code.' });
              }
            });
          }
        });
      }
    } else return res.status(404).json({ msg: 'User not found.' });
  });
}

module.exports.changeEmail = (req, res) => {
  if (!ObjectId.isValid(req.params.id))
    return res.status(400).json({ msg: `No record with given id: ${req.params.id}` });

  User.findByIdAndUpdate(req.params.id, { $set: { email: req.body.email, activated: false } }, { new: true }, (err, user) => {
    return user ? res.status(200).json({ msg: 'Email is changed.' })
                : res.status(404).json({ msg: 'User not found.' });
  });
}

module.exports.authenticate = (req, res) => {
  // Call for passport authentication
  passport.authenticate('local', (err, user, info) => {
    return err ? res.status(400).json(err) // Error from passport middleware
               : user ? res.status(200).json({ "token": user.generateJwt() }) // Registered user
                      : res.status(404).json(info); // Unknow user or wrong password
  })(req, res);
}

module.exports.findUsername = (req, res) => {
  User.findOne({ email: req.body.email, activated: true }, (err, user) => {
    return user ? res.status(200).json({ username: user.username, msg: 'Your username is: ' + user.username })
                : res.status(404).json({ msg: 'User is not found.' });
  });
}

module.exports.resendVerifyResetPassword = (req, res) => {
  User.findOne({ username: req.params.username, activated: true }, (err, user) => {
    if (user) {
      Code.deleteOne({ _userId: user._id }, err => {
        if (err) console.log('ERROR: Clear codes: ' + JSON.stringify(err, undefined, 2))
      });

      let code = new Code();

      code._userId = user._id;
      code.code = codeGenerator.generateCode(6);

      code.save((err, code) => {
        if (err) console.log('ERROR: User code: ' + JSON.stringify(err, undefined, 2));
        else {
          mailer.sendVerifyEmail(user.email, 'Verify Reset Password', code.code);
          return res.status(200).json({ msg: 'Resent Verification Code.' });
        }
      });
    } else return res.status(404).json({ msg: 'User not found.' });
  });
}

module.exports.resetPassword = (req, res) => {
  User.findOne({ username: req.params.username, activated: true }, (err, user) => {
    if (user) {
      Code.findOne({ _userId: user._id }, (err, code) => {
        if (code) {
          if (Date.now() > Date.parse(code.createdAt) + 90000) return res.status(400).json({ msg: 'Code is expired. Please click to resend email!' });
          else if (req.body.code === code.code) {
            user.password = req.body.password;

            user.save(err => {
              if (err) return res.status(400).json({ msg: 'Update is error.' });
              else {
                Code.deleteOne({ _userId: user._id }, (err, result) => {
                  return err ? res.status(400).json(err)
                             : res.status(200).json({ msg: 'Password reset successfully.' });
                });
              }
            });
          } else return res.status(403).json({ msg: 'Verification Code is wrong.' });
        } else return res.status(404).json({ msg: 'Code isn\'t found.' });
      });
    } else return res.status(404).json({ msg: 'User isn\'t found.' });
  });
}

module.exports.changePassword = (req, res) => {
  if (!ObjectId.isValid(req.params.id))
    return res.status(400).json({ msg: `No record with given id: ${req.params.id}` });
  
  User.findById(req.params.id, (err, user) => {
    if (user) {
      if (!user.activated) return res.status(422).json({ msg: 'Email isn\'t verified.' });
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

module.exports.info = (req, res) => {
  User.findById(req._id, (err, user) => {
    return user ? res.status(200).json({ status: true, user: _.pick(user, [ 'avatar', 'firstName', 'activated', 'username', 'role']) })
                : res.status(404).json({ status: false, msg: 'User not found.' });
  });
}