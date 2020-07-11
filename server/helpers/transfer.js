const multer = require('multer');

module.exports.getImages = (imgDir, callback) => {
  let files = [];
  fs.readdir(imgDir, function (err, ls) {
    for (let i = 0; i < ls.length; i++) files.push(ls[i]);
    callback(err, files);
  });
}

module.exports = multer();