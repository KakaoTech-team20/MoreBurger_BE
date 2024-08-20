const { config } = require('../config.js');
const { Sequelize } = require('sequelize');

const { host, user, database, password } = config.db;
const sequelize = new Sequelize(database, user, password, {
  host,
  dialect: 'mysql',
  logging: false,
});

module.exports = {
  sequelize
};