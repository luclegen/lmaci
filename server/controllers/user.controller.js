const _ = require('lodash');

const User = require('../models/user.model');

module.exports.profile = (req, res) => {
  User.findById(req._id, (err, user) => {
    return user ? res.status(200).json({ status: true, user: _.pick(user, [ 'avatar', 'firstName', 'fullName', 'gender', 'email', 'activated', 'mobileNumber', 'username', 'role', 'address']) })
                : res.status(404).json({ status: false, msg: 'User not found.' });
  });
}