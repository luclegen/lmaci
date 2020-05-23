const User = require('../models/user.model');

module.exports.removeAsAdmin = (req, res) => {
  User.findOne({ username: req.params.username }, (err, admin) => {
    if (admin) {
      admin.role = 'user';

      admin.save(err => {
        return err ? res.status(400).json({ msg: 'Update is error.' })
                 : res.status(200).json({ msg: 'Remove as admin was successfully.' });
      });
    } else return res.status(404).json({ msg: 'Admin not found.' });
  });
}
