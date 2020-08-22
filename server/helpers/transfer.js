const multer = require('multer');
const fs = require("fs");

module.exports.getImages = (imgDir, callback) => {
  let files = [];
  fs.readdir(imgDir, function (err, ls) {
    for (let i = 0; i < ls.length; i++) files.push(ls[i]);
    callback(err, files);
  });
}

module.exports.upload = (root, dir = '', parentdir = '') => {
  const storage = multer.diskStorage({
    destination: (req, file, callBack) => {
      const path = [];

      path.push(root + '/' + req.params.id);
      if (dir) path.push(path[0] + '/' + (parentdir ? parentdir : dir));

      switch (dir) {
        case 'slider':
          path.push(path[1] + '/' + req.body.color.replace(/#/, ''));
          break;

        case 'review':
        case 'comment':
          path.push(path[1] + '/' + req.body.index);
          break;

        case 'answer':
          path.push(path[1] + '/' + JSON.parse(req.body.cmt).index);
          path.push(path[2] + '/' + dir);
          path.push(path[3] + '/' + req.body.index);
          break;
      }

      path.forEach(p => { if (!fs.existsSync(p)) fs.mkdirSync(p); });
      
      callBack(null, path[path.length - 1]);
    },
    filename: (req, file, callBack) => {
      callBack(null, `${file.originalname}`);
    }
  });
  
  return multer({ storage: storage });
}
