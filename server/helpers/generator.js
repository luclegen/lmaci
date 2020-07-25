module.exports.generateCode = length => {
  let code = '', characters = '0123456789';
  for (let i = 0; i < length; i++) code += characters[Math.floor(Math.random() * characters.length)];
  return code;
}
