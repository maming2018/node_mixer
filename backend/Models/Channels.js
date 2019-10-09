const Sequelize = require('sequelize');
const Model = Sequelize.Model;

const sequelize = require('../Config/Database');

class Channels extends Model { }

Channels.init({
  channelName: {
    type: Sequelize.STRING,
    allowNull: false
  },
  channelId: {
    type: Sequelize.INTEGER.UNSIGNED,
    allowNull: false
  },
}, {
  sequelize,
  modelName: 'mixer_channels',
  timestamps: true,
  underscored: true,
  freezeTableName: true,
  // options
});

module.exports = Channels;