const multer = require('multer');
const fs = require("fs");

module.exports.getImages = (imgDir, callback) => {
  let files = [];
  fs.readdir(imgDir, function (err, ls) {
    for (let i = 0; i < ls.length; i++) files.push(ls[i]);
    callback(err, files);
  });
}

module.exports.upload = (path, dir = '') => {
  const storage = multer.diskStorage({
    destination: (req, file, callBack) => {
      if (!fs.existsSync(path + '/' + req.params.id)) fs.mkdirSync(path + '/' + req.params.id);

      if (dir) if (!fs.existsSync(path + '/' + req.params.id + '/' + dir)) fs.mkdirSync(path + '/' + req.params.id + '/' + dir);

      switch (dir) {
        case 'slider':
          if (!fs.existsSync(path + '/' + req.params.id + '/' + dir + '/' + req.body.color.replace(/#/, ''))) fs.mkdirSync(path + '/' + req.params.id + '/' + dir + '/' + req.body.color.replace(/#/, ''));

          callBack(null, path + '/' + req.params.id + '/' + dir + '/' + req.body.color.replace(/#/, ''));
          break;

        case 'review':
        case 'comment':
          if (!fs.existsSync(path + '/' + req.params.id + '/' + dir + '/' + req.body.index)) fs.mkdirSync(path + '/' + req.params.id + '/' + dir + '/' + req.body.index);

          callBack(null, path + '/' + req.params.id + '/' + dir + '/' + req.body.index);
          break;
      
        default:
          callBack(null, path + '/' + req.params.id);
          break;
      }
    },
    filename: (req, file, callBack) => {
      callBack(null, `${file.originalname}`);
    }
  });
  
  return multer({ storage: storage });
}

module.exports.transfer = () => multer();