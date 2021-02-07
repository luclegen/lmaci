// Configuration
require('./configs/config');

// Database
require('./db/db');

// Initialization
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const passport = require('passport');

const app = express();

// Middleware
app.use(bodyParser.json());
app.use(cors());
app.use(passport.initialize());
require('./middlewares/passport');

// Routes
app.use('/auth', require('./routes/auth.router'));
app.use('/user', require('./routes/user.router'));
app.use('/admin', require('./routes/admin.router'));
app.use('/product', require('./routes/product.router'));
app.use('/products', require('./routes/products.router'));
app.use('/image', require('./routes/image.router'));

// Error handle
app.use((err, req, res, next) => err.name === 'ValidationError' ? res.status(442).send(Object.keys(err.errors).map(key => err.errors[key].message)) : 'Invaild request!');

// Start Server
app.listen(process.env.PORT, () => console.log(`Server started at port: ${process.env.PORT}`));