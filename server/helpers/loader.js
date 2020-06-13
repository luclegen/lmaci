
module.exports.uploadImg = (url, namefile) => {
  var base64Data = url.replace(/^data:image\/png;base64,/, "");

  require("fs").writeFile('./uploads/avatars/' + namefile + ".png", base64Data, 'base64', function(err) {
    if (err) console.log(err);
  });
}
