'use strict';
module.exports = (sequelize, DataTypes) => {
  const Message = sequelize.define('Message', {
    author_id: DataTypes.INTEGER,
    content: DataTypes.TEXT,
    conversation_id: DataTypes.INTEGER
  }, {});
  Message.associate = function(models) {
    // associations can be defined here
  };
  return Message;
};