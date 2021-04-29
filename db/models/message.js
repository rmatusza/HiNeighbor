'use strict';
module.exports = (sequelize, DataTypes) => {
  const Message = sequelize.define('Message', {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER
    },
    author_id: {
      allowNull: false,
      type: DataTypes.INTEGER,
      references: {model: 'Users'}
    },
    content: {
      allowNull: false,
      type: DataTypes.TEXT
    },
    conversation_id: {
      allowNull: false,
      type: DataTypes.INTEGER,
      references: {model: 'Conversations'}
    },
   
  }, {});
  Message.associate = function(models) {
    Message.belongsTo(models.Conversation, {foreignKey: 'conversation_id'})
    Message.belongsTo(models.User, { foreignKey: 'author_id'}) 
  };
  return Message;
};
