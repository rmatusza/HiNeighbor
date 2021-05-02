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
    },
    content: {
      allowNull: false,
      type: DataTypes.TEXT
    },
    conversation_id: {
      allowNull: false,
      type: DataTypes.INTEGER,
    },
    author_username:{
      allowNull: false,
      type: DataTypes.STRING(100)
    }
   
  }, {});
  Message.associate = function(models) {
    Message.belongsTo(models.Conversation, {foreignKey: 'conversation_id'})
    Message.belongsTo(models.User, { foreignKey: 'author_id'}) 
  };
  return Message;
};
