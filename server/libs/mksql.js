const configs = require('../config');

var marknote = require('knex')({
  client: 'mysql',
  connection: {
    host: configs.mysql.host,
    port: configs.mysql.port,
    user: configs.mysql.user,
    password: configs.mysql.pass,
    database: 'marknote',
    charset: configs.mysql.char
  }
});

module.exports = marknote;