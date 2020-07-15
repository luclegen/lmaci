const multer = require('multer');

module.exports.getImages = (imgDir, callback) => {
  let files = [];
  fs.readdir(imgDir, function (err, ls) {
    for (let i = 0; i < ls.length; i++) files.push(ls[i]);
    callback(err, files);
  });
}

module.exports.upload = () => {
  const storage = multer.diskStorage({
    destination: (req, file, callBack) => {
      callBack(null, 'uploads')
    },
    filename: (req, file, callBack) => {
      callBack(null, `${file.originalname}`)
    }
  });
  
  return multer({ storage: storage });
}

// module.exports = multer();