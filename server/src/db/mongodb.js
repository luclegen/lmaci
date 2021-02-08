const mongoose = require('mongoose');

mongoose.set('useCreateIndex', true);
mongoose.set('useUnifiedTopology', true);
mongoose.set('useNewUrlParser', true);
mongoose.set('useFindAndModify', false);

mongoose.connect(process.env.MONGODB_URI);

mongoose.connection.on('error', error => console.error(error));
mongoose.connection.once('open', () => console.log('Connected to Mongoose'));

require('../models/user.model');
require('../models/code.model');
require('../models/product.model');
