const Sequelize = require('sequelize');
const Model = Sequelize.Model;

const sequelize = require('../Config/Database');

class MixerChat extends Model { }

MixerChat.init({
  chatId: {
    type: Sequelize.STRING,
    allowNull: false
  },
  channelId: {
    type: Sequelize.INTEGER.UNSIGNED,
    allowNull: false
  },
  userId: {
    type: Sequelize.INTEGER.UNSIGNED,
    allowNull: false
  },
  messageType: {
    type: Sequelize.STRING,
    allowNull: false
  },
  message: {
    type: Sequelize.STRING,
    allowNull: false
  },
  imageUrl: {
    type: Sequelize.STRING,
    allowNull: false
  }
}, {
  sequelize,
  modelName: 'mixer_chat',
  timestamps: true,
  underscored: true,
  freezeTableName: true,
  // options
});

module.exports = MixerChat;