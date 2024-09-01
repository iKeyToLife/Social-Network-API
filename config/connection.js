const { connect, connection } = require('mongoose');
require('dotenv').config();

connect(process.env.DB_URL).catch(err => console.error("Error connection to DB", err));

module.exports = connection;
