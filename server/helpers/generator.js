const Code = require('../models/code.model');

module.exports.getCode = length => '0'.repeat(length).split("").map(() => Math.floor(Math.random() * 10)).join("");

module.exports.deleteCode = async id => await Code.deleteOne({ _userId: id }, err => { if (err) console.log('ERROR: Clear codes: ' + JSON.stringify(err, undefined, 2)); });
