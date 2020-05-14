const User = require('../models/user.model');

module.exports.get = (req, res) => {
  console.log(req.params.username);
  User.findOne({ username: req.params.username }, (err, user) => {
    return user ? res.status(200).json(user)
                : res.status(404).json({ msg: 'User not found.' });
  });
}