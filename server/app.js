// Configuration
require('./configs/config');
require('./configs/db');

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

// Error handle
app.use((err, req, res, next) => {
  if (err.name === 'ValidationError') {
    let valErrors = [];
    Object.keys(err.errors).forEach(key => valErrors.push(err.errors[key].message));
    res.status(442).send(valErrors);
  }
});

// Start Server
app.listen(process.env.PORT, () => console.log(`Server started at port: ${process.env.PORT}`));