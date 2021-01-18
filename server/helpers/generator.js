const Code = require('../models/code.model');

module.exports.generateCode = length => {
  let code = '', digits = '0123456789';
  for (let i = 0; i < length; i++) code += digits[Math.floor(Math.random() * digits.length)];
  return code;
}

module.exports.deleteCode = async id => await Code.deleteOne({ _userId: id }, err => { if (err) console.log('ERROR: Clear codes: ' + JSON.stringify(err, undefined, 2)); });
