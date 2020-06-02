const mongoose = require('mongoose');

mongoose.connect(process.env.MONGODB_URI, err => {
  if (err) console.log('ERROR: MongoDB connection is failed: ' + JSON.stringify(err, undefined, 2));
  else console.log('MongoDB connection succeeded.');
});

require('../models/user.model');
require('../models/code.model');
require('../models/product.model');
