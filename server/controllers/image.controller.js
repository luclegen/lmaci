const fs = require('fs');
const url = require('url');

module.exports.get = (req, res) => {
  const query = url.parse(req.url, true).query;
  const pic = query.image;

  const imageDir = './uploads/img/';

  if (typeof pic === 'undefined') {
    transfer.getImages(imageDir, function (err, files) {
      res.writeHead(200, {'Content-type':'text/html'});
      res.end();
    });
  } else {
    fs.readFile(imageDir + pic, function (err, content) {
      if (err) {
        res.writeHead(400, {'Content-type':'text/html'})
        console.log(err);
        res.end("No such image");    
      } else {
        res.writeHead(200,{'Content-type':'image'});
        res.end(content);
      }
    });
  }
}