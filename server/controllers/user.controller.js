const User = require('../models/user.model');

module.exports.get = async (req, res) => {
  const user = await User.findOne({ username: req.params.username });

  return user ? res.status(200).json({ user })
              : res.status(404).json({ msg: 'User not found.' });
}
