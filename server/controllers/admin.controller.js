const User = require('../models/user.model');

module.exports.getAdmins = (req, res) => {
  User.find({ role: 'root' }, (err, root) => {
    if (root) {
      User.find({ role: 'admin' }, (err, admins) => {
        return admins ? res.status(200).json({ root, admins })
                     : res.status(404).json({ msg: 'Admins not found.' })
      });
    } else return res.status(404).json({ msg: 'Root not found.' })
  });
}

module.exports.removeAsAdmin = (req, res) => {
  User.findOneAndUpdate({ username: req.params.username }, { $set: { role: 'user' } }, { new: true }, (err, result) => {
    return err ? res.status(400).json({ msg: 'Update is error.' })
               : res.status(200).json({ msg: 'Remove as admin was successfully.' });
  });
}

module.exports.getUsers = (req, res) => {
  User.find({ role: 'user' }, (err, users) => {
    return users ? res.status(200).json({ users })
                 : res.status(404).json({ msg: 'Users not found.' })
  });
}

module.exports.makeAdmin = (req, res) => {
  User.findOneAndUpdate({ username: req.params.username }, { $set: { role: 'admin' } }, { new: true }, (err, result) => {
    return err ? res.status(400).json({ msg: 'Update is error.' })
               : res.status(200).json({ msg: 'Make admin was successfully.' });
  });
}
