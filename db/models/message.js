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
      type: DataTypes.INTEGER,
    },
   
  }, {});
  Message.associate = function(models) {
    Message.belongsTo(models.User, { foreignKey: 'author'})
  };
  return Message;
};
