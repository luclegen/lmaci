const User = require('../models/user.model');

module.exports.getUsers = (req, res) => {
  User.find({ role: 'user' }, (err, users) => {
    return users ? res.status(200).json({ users })
                 : res.status(404).json({ msg: 'Users not found.' })
  });
}