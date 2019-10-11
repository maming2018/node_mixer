const Sequelize = require('sequelize');

const constants = require('./Constants')

// Option 1: Passing parameters separately
const sequelize = new Sequelize(constants.DATABASE_NAME, constants.DATABASE_USER, constants.DATABASE_PASSWORD, {
  host: constants.DATABASE_HOST,
  dialect: 'mysql'
});

sequelize.authenticate().then(() => {
  console.log('Connection has been established successfully.');
}).catch(err => {
  console.error('Unable to connect to the database:', err);
});

module.exports = sequelize;