// Environment Variables
require('dotenv').config();

// Database
require('./db/db');

// Initialization
const app = require('express')();

// Middleware
app.use(require('body-parser').json());
app.use(require('cors')());
app.use(require('passport').initialize());
require('./middlewares/passport');

// Routes
app.use('/auth', require('./routes/auth.router'));
app.use('/user', require('./routes/user.router'));
app.use('/admin', require('./routes/admin.router'));
app.use('/product', require('./routes/product.router'));
app.use('/products', require('./routes/products.router'));
app.use('/image', require('./routes/image.router'));

// Error handle
app.use((err, req, res, next) => res.status(442).send({ msg: err.name == 'ValidationError' ? Object.values(err.errors).map((e, i) => (i + 1) + '. ' + e).join(', ') + '!' : err.name }));

// Start server
app.listen(process.env.PORT || 3000, () => console.log(`Server started at port: ${process.env.PORT || 3000}`));