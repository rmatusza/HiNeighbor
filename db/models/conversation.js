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
    member_one: {
      allowNull: false,
      type: DataTypes.INTEGER,

    },
    member_two: {
      allowNull: false,
      type: DataTypes.INTEGER,

    },

  }, {});
  Conversation.associate = function(models) {
    Conversation.belongsTo(models.User, { foreignKey: 'member_one'})
    Conversation.belongsTo(models.User, { foreignKey: 'member_two'})
    Conversation.hasMany(models.Message, { foreignKey: 'conversation_id'})

  };
  return Conversation;
};
