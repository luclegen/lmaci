const jwt = require('jsonwebtoken');

module.exports.verifyJwtToken = (req, res, next) => {
  let token;
  if ('authorization' in req.headers) token = req.headers['authorization'].split(' ')[1];
  
  if (token) {
    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
      if (err) return res.status(500).send({ auth: false, message: 'Token authentication failed.' });
      else {
        req._id = decoded._id;
        next();
      }
    })
  } else return res.status(403).send({ auth: false, message: 'No token provided.' });
}