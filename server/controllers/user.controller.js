const User = require('../models/user.model');

module.exports.get = async (req, res) => {
  const user = await User.findOne({ username: req.params.username });

  return user ? res.status(200).json({ user })
              : res.status(404).json({ msg: 'User not found.' });
}

module.exports.updateUser = async (req, res) => {
  const user = await User.findOne({ username: req.params.username });
  
  if (req.body.email != user.email) user.activated = false;

  user.name.first = req.body.firstName;
  user.name.last = req.body.lastName;
  user.fullName = user.name.first + ' ' + user.name.last;
  user.gender = req.body.gender;
  user.email = req.body.email;
  user.mobileNumber = req.body.mobileNumber;
  user.address = req.body.address;

  const userEdited = await User.findOneAndUpdate({ username: req.params.username }, { $set: user }, { new: true });
  
  return userEdited ? res.status(200).json({ username: userEdited.username })
                    : res.status(404).json({ msg: 'User not found.' });
}
