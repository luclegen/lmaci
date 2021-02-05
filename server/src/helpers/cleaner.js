const Code = require('../models/code.model');

module.exports.deleteCode = async id => await Code.deleteOne({ _userId: id }, err => { if (err) console.log('ERROR: Clear codes: ' + JSON.stringify(err, undefined, 2)); });
