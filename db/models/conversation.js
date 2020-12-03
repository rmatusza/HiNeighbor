'use strict';
module.exports = (sequelize, DataTypes) => {
  const Conversation = sequelize.define('Conversation', {
    subject: DataTypes.STRING,
    member_one: DataTypes.INTEGER,
    member_two: DataTypes.INTEGER
  }, {});
  Conversation.associate = function(models) {
    // associations can be defined here
  };
  return Conversation;
};