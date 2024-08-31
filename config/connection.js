const { connect, connection } = require('mongoose');
require('dotenv').config();

connect(process.env.DB_URL);

module.exports = connection;
