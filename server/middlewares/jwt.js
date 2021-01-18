const jwt = require('jsonwebtoken');

module.exports.verifyJwtToken = async (req, res, next) => {
  if ('authorization' in req.headers) {
    const token = req.headers['authorization'].split(' ')[1];

    if (token) {
      try {
        const decoded = await jwt.verify(token, process.env.JWT_SECRET);

        if (decoded) {
          req._id = decoded._id;
          next();
        } else return res.status(500).send({ auth: false, msg: 'Token authentication failed.' });
      } catch (err) {
        return res.status(440).send({ auth: false, msg: 'Token has expired.' });
      }
    } else return res.status(403).send({ auth: false, msg: 'No token provided.' });
  }
}
