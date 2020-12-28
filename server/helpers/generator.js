module.exports.generateCode = length => {
  let code = '', digits = '0123456789';
  for (let i = 0; i < length; i++) code += digits[Math.floor(Math.random() * digits.length)];
  return code;
}
