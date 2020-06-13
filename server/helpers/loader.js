const fs = require("fs");

module.exports.uploadImg = (url, path, filename) => {
  var base64Data = url.replace(/^data:image\/png;base64,/, "");

  if (!fs.existsSync(path)) fs.mkdirSync(path);

  fs.writeFile(path + '/' + filename + ".png", base64Data, 'base64', function(err) {
    if (err) console.log(err);
  });
}
