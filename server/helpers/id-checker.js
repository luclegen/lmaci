const ObjectId = require('mongoose').Types.ObjectId;

module.exports.check = (res, id) => {
  if (!ObjectId.isValid(id))
    return res.status(400).json({ message: 'No record with given id: ' + id });
}