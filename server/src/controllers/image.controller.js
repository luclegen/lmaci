const fs = require('fs');
const url = require('url');
const transfer = require('../helpers/transfer');

module.exports.get = (req, res) => {
  const pic = url.parse(req.url, true).query.image;
  const imageDir = process.env.UPLOADS_IMG;

  if (typeof pic === 'undefined') {
    transfer.getImages(imageDir, function (err, files) {
      res.writeHead(200, { 'Content-type':'text/html' });
      res.end();
    });
  } else {
    fs.readFile(imageDir + pic, function (err, content) {
      if (err) {
        res.writeHead(400, { 'Content-type':'text/html' })
        console.log(err);
        res.end('No such image');    
      } else {
        res.writeHead(200,{ 'Content-type':'image' });
        res.end(content);
      }
    });
  }
}