const env = process.env.NODE_ENV || 'development';

const config = require('./config.json');

Object.keys(config[env]).forEach(key => process.env[key] = config[env][key]);