'use strict';
module.exports = (sequelize, DataTypes) => {
  const Conversation = sequelize.define('Conversation', {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER
    },
    subject: {
      allowNull: false,
      type: DataTypes.STRING(100)
    },
    creator: {
      allowNull: false,
      type: DataTypes.INTEGER,

    },
    recipient: {
      allowNull: false,
      type: DataTypes.INTEGER,
    },
    creator_username: {
      allowNull: false,
      type: DataTypes.STRING(100)
    },
    recipient_username: {
      allowNull: false,
      type: DataTypes.STRING(100)
    }
  }, {});
  Conversation.associate = function(models) {
    Conversation.belongsTo(models.User, { foreignKey: 'creator'})
    Conversation.belongsTo(models.User, { foreignKey: 'recipient'})
    Conversation.hasMany(models.Message, { foreignKey: 'conversation_id'})
  };
  return Conversation;
};
