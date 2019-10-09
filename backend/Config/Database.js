const Sequelize = require('sequelize');

// Option 1: Passing parameters separately
const sequelize = new Sequelize('iludate', 'root', '', {
  host: 'localhost',
  dialect: 'mysql'
});

// const sequelize = new Sequelize('wtshub_react_search_app', 'wtshub_react_sea', 'H,D!zXN#U+yj', {
//   host: 'localhost',
//   dialect: 'mysql'
// });

sequelize.authenticate().then(() => {
  console.log('Connection has been established successfully.');
}).catch(err => {
  console.error('Unable to connect to the database:', err);
});

module.exports = sequelize;